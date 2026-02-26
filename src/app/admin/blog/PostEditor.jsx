"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RichTextEditor from "./RichTextEditor";
import MediaPickerModal from "./MediaPickerModal";
import {
  fetchCategories,
  fetchTags,
  fetchPostById,
  createPost,
  updatePost,
} from "@/lib/blogApi";
import { toast } from "react-hot-toast";
import { ArrowLeft, Save, Eye, ImagePlus } from "lucide-react";

const slugify = (s) =>
  (s || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const SEO_TITLE_MAX = 60;
const SEO_DESC_MAX = 160;

export default function PostEditor({ postId = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(!!postId);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("content"); // content | seo

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tagIds, setTagIds] = useState([]);
  const [status, setStatus] = useState("draft");
  const [featured, setFeatured] = useState(false);
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [featuredPreviewVisible, setFeaturedPreviewVisible] = useState(false);

  useEffect(() => {
    if (featuredImageUrl) {
      setFeaturedPreviewVisible(false);
      const t = setTimeout(() => setFeaturedPreviewVisible(true), 10);
      return () => clearTimeout(t);
    } else {
      setFeaturedPreviewVisible(false);
    }
  }, [featuredImageUrl]);

  useEffect(() => {
    (async () => {
      const [cats, tagsList] = await Promise.all([
        fetchCategories(),
        fetchTags(),
      ]);
      setCategories(cats || []);
      setTags(tagsList || []);
    })();
  }, []);

  useEffect(() => {
    if (!postId) return;
    (async () => {
      try {
        const post = await fetchPostById(postId);
        if (post) {
          setTitle(post.title || "");
          setSlug(post.slug || slugify(post.title));
          setDescription(post.description || "");
          setBody(post.body || post.content || "");
          setCategoryId(post.category_id || post.category?.id || "");
          setTagIds((post.tags || []).map((t) => t.id || t));
          setStatus(post.status || "draft");
          setFeatured(!!post.featured);
          setFeaturedImageUrl(post.featured_image_url || post.featuredImageUrl || "");
          setSeoTitle(post.seoTitle || post.seo_title || "");
          setSeoDescription(post.seoDescription || post.seo_description || "");
          setCanonicalUrl(post.canonicalUrl || post.canonical_url || "");
        }
      } catch {
        toast.error("Failed to load post");
      } finally {
        setLoading(false);
      }
    })();
  }, [postId]);

  const derivedSlug = slug || slugify(title);
  const handleTitleChange = (v) => {
    setTitle(v);
    if (!slug || slug === slugify(title)) setSlug(slugify(v));
  };

  const saveDraft = useCallback(async () => {
    const payload = {
      title,
      slug: derivedSlug,
      description,
      body,
      category_id: categoryId || null,
      tag_ids: tagIds,
      status,
      featured,
      featured_image_url: featuredImageUrl || null,
      seoTitle,
      seoDescription,
      canonical_url: canonicalUrl || null,
    };
    setSaving(true);
    try {
      if (postId) {
        await updatePost(postId, payload);
        toast.success("Post updated");
      } else {
        const created = await createPost(payload);
        toast.success("Post created");
        router.replace(`/admin/blog/${created.id}/edit`);
      }
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }, [
    postId,
    title,
    derivedSlug,
    description,
    body,
    categoryId,
    tagIds,
    status,
    featured,
    featuredImageUrl,
    seoTitle,
    seoDescription,
    canonicalUrl,
    router,
  ]);

  const toggleTag = (id) => {
    setTagIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-3/4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/blog">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-gray-900 flex-1">
          {postId ? "Edit post" : "New post"}
        </h1>
        <Button onClick={saveDraft} disabled={saving} className="gap-1">
          <Save className="h-4 w-4" />
          {saving ? "Saving…" : "Save"}
        </Button>
        {postId && derivedSlug && (
          <a
            href={`${process.env.NEXT_PUBLIC_USER_APP_URL || (typeof window !== "undefined" ? window.location.origin : "")}/blogs/${derivedSlug}?preview=true`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-purple-600 hover:underline flex items-center gap-1"
          >
            <Eye className="h-4 w-4" />
            Preview
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-4 min-w-0">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Post title"
              className="text-lg"
            />
            <p className="mt-1 text-xs text-neutral-500">
              URL: <span className="font-mono">/blog/{derivedSlug || "…"}</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder={slugify(title) || "auto-from-title"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short summary or excerpt for the post"
              className="flex min-h-[72px] w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm"
              rows={3}
            />
          </div>

          <div>
            <div className="flex gap-2 border-b border-gray-200 mb-2">
              <button
                type="button"
                onClick={() => setActiveSection("content")}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                  activeSection === "content"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500"
                }`}
              >
                Content
              </button>
              <button
                type="button"
                onClick={() => setActiveSection("seo")}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                  activeSection === "seo"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500"
                }`}
              >
                SEO
              </button>
            </div>

            {activeSection === "content" && (
              <RichTextEditor content={body} onChange={setBody} />
            )}

            {activeSection === "seo" && (
              <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta title
                  </label>
                  <Input
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="Keep under 60 characters"
                    maxLength={SEO_TITLE_MAX + 20}
                  />
                  <p
                    className={`text-xs mt-1 ${
                      seoTitle.length > SEO_TITLE_MAX ? "text-amber-600" : "text-neutral-500"
                    }`}
                  >
                    {seoTitle.length}/{SEO_TITLE_MAX}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta description
                  </label>
                  <textarea
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Keep under 160 characters"
                    maxLength={SEO_DESC_MAX + 50}
                    className="flex min-h-[80px] w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm"
                    rows={3}
                  />
                  <p
                    className={`text-xs mt-1 ${
                      seoDescription.length > SEO_DESC_MAX ? "text-amber-600" : "text-neutral-500"
                    }`}
                  >
                    {seoDescription.length}/{SEO_DESC_MAX}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Canonical URL
                  </label>
                  <Input
                    value={canonicalUrl}
                    onChange={(e) => setCanonicalUrl(e.target.value)}
                    placeholder="https://yoursite.com/blog/..."
                  />
                </div>
                {/* <div className="border rounded-lg p-3 bg-white">
                  <p className="text-xs font-medium text-neutral-500 mb-2">OpenGraph preview</p>
                  <div className="border rounded overflow-hidden max-w-md">
                    <div className="h-24 bg-neutral-200" />
                    <div className="p-2">
                      <p className="text-sm font-medium text-neutral-900 truncate">
                        {seoTitle || title || "Post title"}
                      </p>
                      <p className="text-xs text-neutral-600 line-clamp-2">
                        {seoDescription || "Meta description for social sharing."}
                      </p>
                    </div>
                  </div>
                </div> */}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 lg:border-l lg:pl-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-9 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="h-9 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <div className="flex flex-wrap gap-2 border rounded-md p-2 bg-white min-h-[40px]">
              {tags.map((t) => (
                <label
                  key={t.id}
                  className="inline-flex items-center gap-1.5 cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    checked={tagIds.includes(t.id)}
                    onChange={() => toggleTag(t.id)}
                    className="rounded border-gray-300"
                  />
                  <span>{t.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Featured</label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Show in Popular Articles</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Featured image
            </label>
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              onClick={() => setMediaPickerOpen(true)}
            >
              <ImagePlus className="h-4 w-4" />
              Select or upload image
            </Button>
            {featuredImageUrl && (
              <div
                className={`mt-2 relative w-full aspect-video rounded border bg-gray-100 overflow-hidden transition-opacity duration-300 ease-out ${
                  featuredPreviewVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={featuredImageUrl}
                  alt="Featured"
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setFeaturedImageUrl("")}
                  className="absolute top-2 right-2 px-2 py-1 text-xs bg-black/60 text-white rounded hover:bg-black/80"
                >
                  Remove
                </button>
              </div>
            )}
            <MediaPickerModal
              open={mediaPickerOpen}
              onClose={() => setMediaPickerOpen(false)}
              onSelect={(url) => setFeaturedImageUrl(url)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

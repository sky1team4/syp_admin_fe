/**
 * Blog API – uses real backend where implemented; mocks for the rest.
 */
import axios from "axios";
import { API_CONFIG, getApiUrl, getAuthHeaders, getAuthHeadersMultipart, handleApiError } from "@/config/api.js";

// --- Categories (real API) ---
export async function fetchCategories() {
  try {
    const { data } = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.BLOG_CATEGORIES), {
      headers: getAuthHeaders(),
      timeout: API_CONFIG.TIMEOUT,
    });
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("fetchCategories", handleApiError(err));
    throw err;
  }
}

export async function createCategory(payload) {
  const { data } = await axios.post(
    getApiUrl(API_CONFIG.ENDPOINTS.BLOG_CATEGORIES),
    {
      name: payload.name,
      slug: payload.slug || payload.name?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      description: payload.description || "",
    },
    { headers: getAuthHeaders(), timeout: API_CONFIG.TIMEOUT }
  );
  return { id: data.id, name: data.name, slug: data.slug, description: data.description };
}

export async function updateCategory(id, payload) {
  const { data } = await axios.patch(
    getApiUrl(API_CONFIG.ENDPOINTS.BLOG_CATEGORY_BY_ID(id)),
    { name: payload.name, slug: payload.slug, description: payload.description },
    { headers: getAuthHeaders(), timeout: API_CONFIG.TIMEOUT }
  );
  return { id: data.id, name: data.name, slug: data.slug, description: data.description };
}

export async function deleteCategory(id) {
  await axios.delete(getApiUrl(API_CONFIG.ENDPOINTS.BLOG_CATEGORY_BY_ID(id)), {
    headers: getAuthHeaders(),
    timeout: API_CONFIG.TIMEOUT,
  });
  return { success: true };
}

// --- Posts (real API) ---
export async function fetchPosts(params = {}) {
  try {
    const { data } = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.BLOG_POSTS), {
      headers: getAuthHeaders(),
      params: { category: params.category, author: params.author, status: params.status, search: params.search, page: params.page, limit: params.limit },
      timeout: API_CONFIG.TIMEOUT,
    });
    const list = Array.isArray(data) ? data : [];
    const normalized = list.map((p) => ({
      id: p.id,
      title: p.title,
      status: p.status,
      featured: !!p.featured,
      category: p.category,
      category_id: p.category_id,
      author: p.author,
      author_id: p.author_id,
      published_at: p.published ?? p.published_at,
      slug: p.slug,
    }));
    return { data: normalized, total: normalized.length };
  } catch (err) {
    console.error("fetchPosts", handleApiError(err));
    throw err;
  }
}

export async function fetchPostById(id) {
  try {
    const { data } = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.BLOG_POST_BY_ID(id)), {
      headers: getAuthHeaders(),
      timeout: API_CONFIG.TIMEOUT,
    });
    if (!data) return null;
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      description: data.description ?? "",
      body: data.content ?? data.body ?? "",
      content: data.content,
      category_id: data.categoryId ?? data.category?.id,
      category: data.category,
      tagIds: (data.tags || []).map((t) => t.id),
      tags: data.tags,
      status: (data.status || "draft").toLowerCase(),
      featured: !!data.featured,
      featured_image_url: data.featuredImage ?? data.featured_image_url,
      featuredImageUrl: data.featuredImage ?? data.featured_image_url,
      published_at: data.publishedAt ?? data.published_at,
      excerpt: data.excerpt,
      seo_title: data.seoTitle ?? data.seo_title,
      seoTitle: data.seoTitle,
      seo_description: data.seoDescription ?? data.seo_description,
      seoDescription: data.seoDescription,
      canonical_url: data.canonicalUrl ?? data.canonical_url,
      canonicalUrl: data.canonicalUrl,
      author_id: data.authorId ?? data.author?.id,
      author: data.author,
      media: data.media,
    };
  } catch (err) {
    console.error("fetchPostById", handleApiError(err));
    throw err;
  }
}

function buildPostPayload(editorPayload) {
  const status = (editorPayload.status || "draft").toUpperCase();
  const categoryId = editorPayload.categoryId ?? editorPayload.category_id;
  const tagIds = Array.isArray(editorPayload.tagIds)
    ? editorPayload.tagIds
    : Array.isArray(editorPayload.tag_ids)
      ? editorPayload.tag_ids
      : [];
  const categoryIdNum = categoryId ? Number(categoryId) : undefined;
  const tagIdsNum = tagIds.map((id) => Number(id)).filter((n) => !Number.isNaN(n));
  const featuredImage =
    editorPayload.featuredImageUrl ?? editorPayload.featured_image_url ?? editorPayload.featuredImage;
  return {
    title: editorPayload.title || "",
    slug: editorPayload.slug || "",
    description: editorPayload.description ?? "",
    content: editorPayload.body ?? editorPayload.content ?? "",
    excerpt: editorPayload.excerpt ?? "",
    featuredImage: featuredImage || null,
    status: status === "ARCHIVED" ? "ARCHIVED" : status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
    publishedAt: editorPayload.publishedAt ?? null,
    categoryId: categoryIdNum,
    tagIds: tagIdsNum,
    seoTitle: editorPayload.seoTitle ?? "",
    seoDescription: editorPayload.seoDescription ?? "",
    canonicalUrl: editorPayload.canonicalUrl ?? editorPayload.canonical_url ?? null,
    media: editorPayload.media ?? [],
  };
}

export async function createPost(payload) {
  try {
    const body = buildPostPayload(payload);
    const { data } = await axios.post(getApiUrl(API_CONFIG.ENDPOINTS.BLOG_POSTS), body, {
      headers: getAuthHeaders(),
      timeout: API_CONFIG.TIMEOUT,
    });
    return { id: data.id, ...data };
  } catch (err) {
    console.error("createPost", handleApiError(err));
    throw err;
  }
}

export async function updatePost(id, payload) {
  try {
    const body = buildPostPayload(payload);
    body.featured = !!payload.featured;
    if (payload.uploadIds && payload.uploadIds.length) body.uploadIds = payload.uploadIds;
    const { data } = await axios.patch(getApiUrl(API_CONFIG.ENDPOINTS.BLOG_POST_BY_ID(id)), body, {
      headers: getAuthHeaders(),
      timeout: API_CONFIG.TIMEOUT,
    });
    return { id: data.id, ...data };
  } catch (err) {
    console.error("updatePost", handleApiError(err));
    throw err;
  }
}

export async function deletePost(id) {
  try {
    await axios.delete(getApiUrl(API_CONFIG.ENDPOINTS.BLOG_POST_BY_ID(id)), {
      headers: getAuthHeaders(),
      timeout: API_CONFIG.TIMEOUT,
    });
    return { success: true };
  } catch (err) {
    console.error("deletePost", handleApiError(err));
    throw err;
  }
}

export async function setPostFeatured(id, featured) {
  try {
    const { data } = await axios.patch(
      getApiUrl(API_CONFIG.ENDPOINTS.BLOG_POST_FEATURED(id)),
      { featured: !!featured },
      {
        headers: getAuthHeaders(),
        timeout: API_CONFIG.TIMEOUT,
      }
    );
    return { id: data?.id ?? id, featured: !!featured };
  } catch (err) {
    console.error("setPostFeatured", handleApiError(err));
    throw err;
  }
}

// --- Tags (real API) ---
export async function fetchTags() {
  try {
    const { data } = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.BLOG_TAGS), {
      headers: getAuthHeaders(),
      timeout: API_CONFIG.TIMEOUT,
    });
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("fetchTags", handleApiError(err));
    throw err;
  }
}

export async function createTag(payload) {
  const slug =
    payload.slug ||
    (payload.name || "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const { data } = await axios.post(
    getApiUrl(API_CONFIG.ENDPOINTS.BLOG_TAGS),
    { name: payload.name, slug },
    { headers: getAuthHeaders(), timeout: API_CONFIG.TIMEOUT }
  );
  return { id: data.id, name: data.name, slug: data.slug };
}

export async function updateTag(id, payload) {
  const { data } = await axios.patch(
    getApiUrl(API_CONFIG.ENDPOINTS.BLOG_TAG_BY_ID(id)),
    { name: payload.name, slug: payload.slug },
    { headers: getAuthHeaders(), timeout: API_CONFIG.TIMEOUT }
  );
  return { id: data.id, name: data.name, slug: data.slug };
}

export async function deleteTag(id) {
  await axios.delete(getApiUrl(API_CONFIG.ENDPOINTS.BLOG_TAG_BY_ID(id)), {
    headers: getAuthHeaders(),
    timeout: API_CONFIG.TIMEOUT,
  });
  return { success: true };
}

// --- Authors (e.g. from your users/employees) ---
export async function fetchAuthors() {
  // TODO: GET /api/blog/authors or /api/employees
  await delay(200);
  return MOCK_AUTHORS;
}

// --- Media (GET /blog/media/uploads, POST /blog/media/upload, DELETE /blog/media/uploads/:id) ---
function normalizeMediaItem(item) {
  if (!item || typeof item !== "object") return null;
  return {
    id: item.id ?? item.key ?? item.url,
    url: item.url,
    filename: item.filename ?? item.fileName ?? item.key ?? "",
    alt: item.alt ?? "",
  };
}

export async function fetchMedia() {
  try {
    const { data } = await axios.get(getApiUrl(API_CONFIG.ENDPOINTS.BLOG_MEDIA_UPLOADS), {
      headers: getAuthHeaders(),
      timeout: API_CONFIG.TIMEOUT,
    });
    const raw = Array.isArray(data) ? data : data?.uploads ?? data?.data ?? [];
    return raw.map(normalizeMediaItem).filter(Boolean);
  } catch (err) {
    console.error("fetchMedia", handleApiError(err));
    throw err;
  }
}

export async function uploadMediaFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axios.post(
    getApiUrl(API_CONFIG.ENDPOINTS.BLOG_MEDIA_UPLOAD),
    formData,
    {
      headers: getAuthHeadersMultipart(),
      timeout: 60000,
    }
  );
  return {
    url: data.url,
    fileName: data.fileName,
    fileType: data.fileType,
    key: data.key,
    id: data.id ?? data.key ?? data.url,
    filename: data.fileName,
    alt: data.alt ?? "",
  };
}

export async function updateMediaItem(id, payload) {
  // Optional: if backend adds PATCH /blog/media/uploads/:id for alt text
  await delay(200);
  return { id, ...payload };
}

export async function deleteMediaItem(id) {
  await axios.delete(getApiUrl(API_CONFIG.ENDPOINTS.BLOG_MEDIA_UPLOAD_BY_ID(id)), {
    headers: getAuthHeaders(),
    timeout: API_CONFIG.TIMEOUT,
  });
  return { success: true };
}

export async function deleteMediaBulk(ids) {
  await Promise.all(ids.map((id) => axios.delete(getApiUrl(API_CONFIG.ENDPOINTS.BLOG_MEDIA_UPLOAD_BY_ID(id)), {
    headers: getAuthHeaders(),
    timeout: API_CONFIG.TIMEOUT,
  })));
  return { success: true, deleted: ids.length };
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// --- Mock data (replace with API responses) ---
const MOCK_CATEGORIES = [
  { id: '1', name: 'Tips', slug: 'tips' },
  { id: '2', name: 'Branding', slug: 'branding' },
  { id: '3', name: 'Resources', slug: 'resources' },
  { id: '4', name: 'Design', slug: 'design' },
];

const MOCK_TAGS = [
  { id: '1', name: 'Branding' },
  { id: '2', name: 'Tips' },
  { id: '3', name: 'Tools' },
  { id: '4', name: 'Tutorial' },
];

const MOCK_AUTHORS = [
  { id: '1', name: 'Burak Deniz' },
  { id: '2', name: 'Admin User' },
];

const MOCK_MEDIA = [
  { id: '1', url: '/placeholder-blog.jpg', filename: 'banner-1.jpg', alt: 'Blog banner' },
  { id: '2', url: '/placeholder-blog.jpg', filename: 'thumb-2.jpg', alt: '' },
];

const MOCK_POSTS = [
  {
    id: '1',
    title: 'How to design better landing pages',
    slug: 'how-to-design-better-landing-pages',
    body: '<p>Start writing here...</p>',
    status: 'published',
    featured: true,
    category_id: '1',
    category: { id: '1', name: 'Tips' },
    author_id: '1',
    author: { id: '1', name: 'Burak Deniz' },
    tags: [{ id: '1', name: 'Branding' }, { id: '2', name: 'Tips' }],
    published_at: '2025-02-20T10:00:00Z',
    created_at: '2025-02-18T12:00:00Z',
    seoTitle: 'How to design better landing pages | Blog',
    seoDescription: 'Practical tips for improving conversion with better landing page design.',
  },
  {
    id: '2',
    title: 'Draft: Advanced branding guide',
    slug: 'advanced-branding-guide',
    body: '<p>Draft content...</p>',
    status: 'draft',
    featured: false,
    category_id: '2',
    category: { id: '2', name: 'Branding' },
    author_id: '2',
    author: { id: '2', name: 'Admin User' },
    tags: [{ id: '1', name: 'Branding' }],
    published_at: null,
    created_at: '2025-02-22T09:00:00Z',
    seoTitle: '',
    seoDescription: '',
  },
];

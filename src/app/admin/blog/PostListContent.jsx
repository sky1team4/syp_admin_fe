"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchPosts, fetchCategories, fetchAuthors, setPostFeatured, setPostCareerTip, deletePost } from "@/lib/blogApi";
import { createPostColumns } from "./postColumns";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Plus, Search } from "lucide-react";
import ConfirmationDialog from "@/components/ConfirmationDialog";

export default function PostListContent() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [postsRes, catsRes, authorsRes] = await Promise.all([
        fetchPosts(),
        fetchCategories(),
        fetchAuthors(),
      ]);
      setPosts(postsRes.data || []);
      setCategories(catsRes || []);
      setAuthors(authorsRes || []);
    } catch (e) {
      toast.error("Failed to load posts");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleFeatured = async (id, featured) => {
    try {
      await setPostFeatured(id, featured);
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, featured } : p))
      );
      toast.success(featured ? "Post set as featured" : "Post unfeatured");
    } catch {
      toast.error("Failed to update featured");
    }
  };

  const handleToggleCareerTip = async (id, isCareerTip) => {
    try {
      await setPostCareerTip(id, isCareerTip);
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isCareerTip } : p))
      );
      toast.success(isCareerTip ? "Post set as career tip" : "Removed from career tips");
    } catch {
      toast.error("Failed to update career tip");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setDeleteId(null);
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const filteredData = useMemo(() => {
    let list = [...posts];
    if (categoryFilter) {
      list = list.filter((p) => (p.category_id || p.category?.id) === categoryFilter);
    }
    if (authorFilter) {
      list = list.filter((p) => (p.author_id || p.author?.id) === authorFilter);
    }
    if (statusFilter) {
      list = list.filter((p) => (p.status || "").toLowerCase() === statusFilter.toLowerCase());
    }
    if (globalFilter.trim()) {
      const q = globalFilter.trim().toLowerCase();
      list = list.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(q) ||
          (p.slug || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [posts, categoryFilter, authorFilter, statusFilter, globalFilter]);

  const columns = useMemo(
    () =>
      createPostColumns({
        onToggleFeatured: handleToggleFeatured,
        onToggleCareerTip: handleToggleCareerTip,
        onDelete: (id) => setDeleteId(id),
      }),
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="p-4 md:p-6 h-full bg-white shadow-lg rounded-xl w-full">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">Posts</h2>
          <Link href="/admin/blog/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search by title or slug..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 rounded-md border border-neutral-200 bg-white px-3 text-sm"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
            className="h-9 rounded-md border border-neutral-200 bg-white px-3 text-sm"
          >
            <option value="">All authors</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-neutral-200 bg-white px-3 text-sm"
          >
            <option value="">All statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="rounded-md border overflow-x-auto">
          {loading ? (
            <div className="animate-pulse p-8 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-100 rounded" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-left">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="text-left">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-neutral-500">
                      No posts found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <ConfirmationDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Delete post"
        message="Are you sure you want to delete this post? This cannot be undone."
      />
    </div>
  );
}

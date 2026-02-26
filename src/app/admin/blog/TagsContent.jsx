"use client";

import React, { useState, useEffect } from "react";
import {
  fetchTags,
  createTag,
  updateTag,
  deleteTag,
} from "@/lib/blogApi";
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
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import ConfirmationDialog from "@/components/ConfirmationDialog";

const slugFromName = (name) =>
  (name || "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

export default function TagsContent() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchTags();
      setTags(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load tags");
      setTags([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormName("");
    setFormSlug("");
    setModalOpen(true);
  };

  const openEditModal = (tag) => {
    setEditingId(tag.id);
    setFormName(tag.name || "");
    setFormSlug(tag.slug || slugFromName(tag.name));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setFormName("");
    setFormSlug("");
  };

  const saveTag = async () => {
    const name = formName.trim();
    if (!name) {
      toast.error("Enter a name");
      return;
    }
    const slug = formSlug.trim() || slugFromName(name);
    try {
      if (editingId) {
        await updateTag(editingId, { name, slug });
        setTags((prev) =>
          prev.map((t) => (t.id === editingId ? { ...t, name, slug } : t))
        );
        toast.success("Tag updated");
      } else {
        const created = await createTag({ name, slug });
        setTags((prev) => [...prev, { ...created, name, slug }]);
        toast.success("Tag added");
      }
      closeModal();
    } catch {
      toast.error(editingId ? "Failed to update tag" : "Failed to add tag");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTag(id);
      setTags((prev) => prev.filter((t) => t.id !== id));
      setDeleteId(null);
      toast.success("Tag deleted");
    } catch {
      toast.error("Failed to delete tag");
    }
  };

  return (
    <div className="p-4 md:p-6 h-full bg-white shadow-lg rounded-xl w-full">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">Tags</h2>
          <Button onClick={openAddModal}>Add tag</Button>
        </div>

        <div className="rounded-md border">
          {loading ? (
            <div className="animate-pulse p-8 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-100 rounded" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell className="font-medium">{tag.name}</TableCell>
                    <TableCell className="text-neutral-600">{tag.slug}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditModal(tag)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600"
                        onClick={() => setDeleteId(tag.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {tags.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-neutral-500">
                      No tags yet. Add one using the button above.
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
        title="Delete tag"
        message="Are you sure? This tag will be removed from any posts using it."
      />

      {modalOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={closeModal} aria-hidden />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
              className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="tag-modal-title"
            >
              <h3 id="tag-modal-title" className="text-lg font-semibold text-gray-900 mb-4">
                {editingId ? "Edit tag" : "Add tag"}
              </h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <Input
                    placeholder="e.g. Branding, Tips"
                    value={formName}
                    onChange={(e) => {
                      setFormName(e.target.value);
                      if (!editingId && !formSlug) setFormSlug(slugFromName(e.target.value));
                    }}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <Input
                    placeholder="url-friendly-slug"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button onClick={saveTag}>Save</Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

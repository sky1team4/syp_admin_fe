"use client";

import React, { useState, useEffect } from "react";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
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

export default function CategoriesContent() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const slugFromName = (name) =>
    (name || "")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  const openAddModal = () => {
    setEditingId(null);
    setFormName("");
    setFormSlug("");
    setFormDescription("");
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingId(cat.id);
    setFormName(cat.name || "");
    setFormSlug(cat.slug || slugFromName(cat.name));
    setFormDescription(cat.description || "");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setFormName("");
    setFormSlug("");
    setFormDescription("");
  };

  const saveCategory = async () => {
    const name = formName.trim();
    if (!name) {
      toast.error("Enter a name");
      return;
    }
    const slug = formSlug.trim() || slugFromName(name);
    const description = formDescription.trim();
    try {
      if (editingId) {
        await updateCategory(editingId, { name, slug, description });
        setCategories((prev) =>
          prev.map((c) =>
            c.id === editingId ? { ...c, name, slug, description } : c
          )
        );
        toast.success("Category updated");
      } else {
        const created = await createCategory({ name, slug, description });
        setCategories((prev) => [...prev, { ...created, name, slug, description }]);
        toast.success("Category added");
      }
      closeModal();
    } catch {
      toast.error(editingId ? "Failed to update category" : "Failed to add category");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setDeleteId(null);
      toast.success("Category deleted");
    } catch {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="p-4 md:p-6 h-full bg-white shadow-lg rounded-xl w-full">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">Categories</h2>
          <Button onClick={openAddModal}>Add category</Button>
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
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="font-medium">{cat.name}</TableCell>
                    <TableCell className="text-neutral-600">{cat.slug}</TableCell>
                    <TableCell className="text-neutral-600 text-sm max-w-[200px] truncate" title={cat.description}>
                      {cat.description || "—"}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditModal(cat)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600"
                        onClick={() => setDeleteId(cat.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {categories.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-neutral-500">
                      No categories yet. Add one using the button above.
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
        title="Delete category"
        message="Are you sure? Posts using this category may need to be reassigned."
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
              aria-labelledby="category-modal-title"
            >
              <h3 id="category-modal-title" className="text-lg font-semibold text-gray-900 mb-4">
                {editingId ? "Edit category" : "Add category"}
              </h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <Input
                    placeholder="e.g. Tips, Branding"
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    placeholder="Optional short description for this category"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    rows={3}
                    className="flex w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm min-h-[80px]"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button onClick={saveCategory}>Save</Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { fetchMedia, updateMediaItem, deleteMediaBulk, uploadMediaFile } from "@/lib/blogApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Pencil, Trash2, Upload } from "lucide-react";
import { toast } from "react-hot-toast";
import ConfirmationDialog from "@/components/ConfirmationDialog";

export default function MediaContent() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [editingId, setEditingId] = useState(null);
  const [editAlt, setEditAlt] = useState("");
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const list = await fetchMedia();
      setItems(Array.isArray(list) ? list : []);
    } catch {
      toast.error("Failed to load media");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadMediaFile(file);
      setItems((prev) => [
        ...prev,
        { id: res.id || res.key, url: res.url, filename: res.filename || res.fileName, alt: res.alt || "" },
      ]);
      toast.success("Image uploaded");
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Upload failed";
      toast.error(message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === items.length) setSelected(new Set());
    else setSelected(new Set(items.map((m) => m.id)));
  };

  const startEditAlt = (item) => {
    setEditingId(item.id);
    setEditAlt(item.alt || "");
  };

  const saveAlt = async () => {
    if (!editingId) return;
    try {
      await updateMediaItem(editingId, { alt: editAlt });
      setItems((prev) =>
        prev.map((m) => (m.id === editingId ? { ...m, alt: editAlt } : m))
      );
      setEditingId(null);
      setEditAlt("");
      toast.success("Alt text saved");
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    try {
      await deleteMediaBulk(ids);
      setItems((prev) => prev.filter((m) => !ids.includes(m.id)));
      setSelected(new Set());
      setBulkDeleteOpen(false);
      toast.success(`${ids.length} item(s) deleted`);
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="p-4 md:p-6 h-full bg-white shadow-lg rounded-xl w-full">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">Media Library</h2>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
              multiple={false}
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading…" : "Upload"}
            </Button>
            {selected.size > 0 && (
              <Button variant="destructive" onClick={() => setBulkDeleteOpen(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete {selected.size} selected
              </Button>
            )}
          </div>
        </div>

        <p className="text-sm text-neutral-600">
          Reuse images across posts. Add alt text for accessibility and SEO.
        </p>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg overflow-hidden bg-gray-50 group relative"
              >
                <div
                  className="aspect-square relative cursor-pointer"
                  onClick={() => toggleSelect(item.id)}
                >
                  <img
                    src={item.url || "/placeholder-blog.jpg"}
                    alt={item.alt || item.filename || "Media"}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div
                    className={`absolute top-2 left-2 w-6 h-6 rounded border-2 flex items-center justify-center ${
                      selected.has(item.id) ? "bg-purple-600 border-purple-600 text-white" : "bg-white border-gray-300"
                    }`}
                  >
                    {selected.has(item.id) && <Check className="h-4 w-4" />}
                  </div>
                </div>
                <div className="p-2">
                  {editingId === item.id ? (
                    <div className="flex gap-1">
                      <Input
                        value={editAlt}
                        onChange={(e) => setEditAlt(e.target.value)}
                        placeholder="Alt text"
                        className="text-xs flex-1 min-w-0"
                      />
                      <Button size="sm" className="shrink-0" onClick={saveAlt}>Save</Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs text-neutral-600 truncate flex-1" title={item.alt || item.filename}>
                        {item.alt || item.filename || "—"}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={() => startEditAlt(item)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <p className="text-center text-neutral-500 py-8">No media yet. Upload images when creating posts.</p>
        )}
      </div>

      <ConfirmationDialog
        isOpen={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={handleBulkDelete}
        title="Delete selected media"
        message={`Delete ${selected.size} item(s)? This cannot be undone.`}
      />
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import { fetchMedia, uploadMediaFile } from "@/lib/blogApi";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { toast } from "react-hot-toast";

export default function MediaPickerModal({ open, onClose, onSelect }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [visible, setVisible] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setVisible(false);
      const t = setTimeout(() => setVisible(true), 20);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setLoading(true);
      const delay = setTimeout(() => {
        fetchMedia()
          .then((res) => setMedia(Array.isArray(res) ? res : res?.data || []))
          .catch(() => setMedia([]))
          .finally(() => setLoading(false));
      }, 50);
      return () => clearTimeout(delay);
    }
  }, [open]);

  const handleSelect = (url) => {
    onSelect?.(url);
    onClose?.();
  };

  const handleUpload = async (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadMediaFile(file);
      setMedia((prev) => [...prev, { id: res.id, url: res.url, filename: res.filename, alt: res.alt || "" }]);
      handleSelect(res.url);
      toast.success("Image uploaded");
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Upload failed";
      toast.error(message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (!open) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-200 ease-out ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-hidden
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={`bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col pointer-events-auto transition-all duration-200 ease-out ${
            visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="media-picker-title"
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 id="media-picker-title" className="text-lg font-semibold text-gray-900">
              Select or upload image
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 border-b bg-gray-50">
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
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading…" : "Upload new image"}
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {media.map((item) => (
                  <button
                    key={item.id ?? item.url}
                    type="button"
                    onClick={() => handleSelect(item.url)}
                    className="aspect-square relative rounded-lg border-2 border-transparent hover:border-purple-500 hover:ring-2 hover:ring-purple-200 overflow-hidden bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <img
                      src={item.url || "/placeholder-blog.jpg"}
                      alt={item.alt || item.filename || "Media"}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            {!loading && media.length === 0 && (
              <p className="text-center text-gray-500 py-8">No media yet. Upload an image above.</p>
            )}
          </div>

          <div className="p-4 border-t flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

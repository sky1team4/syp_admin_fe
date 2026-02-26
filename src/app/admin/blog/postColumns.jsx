"use client";

import { ArrowDown, ArrowUp, Eye, Pencil, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

const statusBadgeClass = (status) => {
  switch ((status || "").toLowerCase()) {
    case "published":
      return "bg-green-100 text-green-800";
    case "draft":
      return "bg-gray-100 text-gray-700";
    case "archived":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export function createPostColumns({ onToggleFeatured, onDelete }) {
  return [
    columnHelper.accessor("title", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent justify-start font-medium w-full text-left"
        >
          Title
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium text-neutral-900 max-w-[220px] truncate" title={row.original.title}>
          {row.original.title}
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status || "draft";
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusBadgeClass(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    }),
    columnHelper.accessor("featured", {
      header: "Featured",
      cell: ({ row }) => {
        const featured = row.original.featured;
        return (
          <button
            type="button"
            onClick={() => onToggleFeatured?.(row.original.id, !featured)}
            className={`p-1.5 rounded-md transition-colors ${featured ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}
            title={featured ? "Remove from featured" : "Set as featured"}
          >
            <Star className={`h-4 w-4 ${featured ? "fill-current" : ""}`} />
          </button>
        );
      },
    }),
    columnHelper.accessor("category", {
      header: "Category",
      cell: ({ row }) => (
        <span className="text-sm text-neutral-600">
          {row.original.category || "—"}
        </span>
      ),
    }),
    columnHelper.accessor("author", {
      header: "Author",
      cell: ({ row }) => (
        <span className="text-sm text-neutral-600">
          {row.original.author || "—"}
        </span>
      ),
    }),
    columnHelper.accessor("published_at", {
      header: "Published",
      cell: ({ row }) => {
        const d = row.original.published_at ?? row.original.published;
        if (!d) return <span className="text-neutral-400">—</span>;
        try {
          return (
            <span className="text-sm text-neutral-600">
              {new Date(d).toLocaleDateString()}
            </span>
          );
        } catch {
          return "—";
        }
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Link href={`/admin/blog/${row.original.id}/edit`}>
            <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-neutral-500"
            title="Preview"
            asChild
          >
            <a
              href={`${process.env.NEXT_PUBLIC_USER_APP_URL || (typeof window !== "undefined" ? window.location.origin : "")}/blogs/${row.original.slug}?preview=true`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Eye className="h-4 w-4" />
            </a>
          </Button>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-600 hover:text-red-700"
              title="Delete"
              onClick={() => onDelete(row.original.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    }),
  ];
}

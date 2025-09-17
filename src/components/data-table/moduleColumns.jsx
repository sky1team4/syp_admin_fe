"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"

export const createColumns = ({ handleEdit = () => {}, handleDelete = () => {} }) => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent justify-start font-medium w-full text-left"
        >
          Module Name
          {column.getIsSorted() === "asc" ? (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.name}
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent justify-start font-medium w-full text-left"
        >
          Description
          {column.getIsSorted() === "asc" ? (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="max-w-xs truncate" title={row.original.description}>
        {row.original.description}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent justify-start font-medium w-full text-left"
        >
          Status
          {column.getIsSorted() === "asc" ? (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-center">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.original.status === 'pro' 
            ? 'bg-purple-100 text-purple-800' 
            : 'bg-blue-100 text-blue-800'
        }`}>
          {row.original.status?.toUpperCase()}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent justify-start font-medium w-full text-left"
        >
          Active
          {column.getIsSorted() === "asc" ? (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-center">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.original.isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {row.original.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent justify-start font-medium w-full text-left"
        >
          Created Date
          {column.getIsSorted() === "asc" ? (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.createdDate}
      </div>
    ),
  },
  {
    accessorKey: "lastUpdated",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent justify-start font-medium w-full text-left"
        >
          Last Updated
          {column.getIsSorted() === "asc" ? (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.lastUpdated}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const module = row.original

      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(module)}
            className="h-8 w-8 p-0"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit module</span>
          </Button>
        </div>
      )
    },
  },
]

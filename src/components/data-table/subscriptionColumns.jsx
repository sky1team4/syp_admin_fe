"use client"

import { ArrowDown, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState } from "react"
import SubscriptionSideBar from "@/components/SubscriptionSideBar"

export const columns = [
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            )
        },
    },
    {
        accessorKey: "createdDate",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created Date
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            )
        },
    },
    {
        accessorKey: "lastUpdated",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Last Updated
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            )
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const [isSidebarOpen, setIsSidebarOpen] = useState(false)
            const handleDelete = () => {
                if (typeof row.original.onDelete === 'function') {
                    row.original.onDelete(row.original)
                } else {
                    console.error('onDelete handler is not defined')
                }
            }
            
            return (
                <>
                    <div className="flex gap-2">
                        <button 
                            className="p-1"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Image
                                src="/EditTable.svg"
                                width={20}
                                height={20}
                                alt="Edit"
                            />
                        </button>
                        <button 
                            className="p-1"
                            onClick={handleDelete}
                        >
                            <Image
                                src="/delete.svg"
                                width={20}
                                height={20}
                                alt="Delete"
                            />
                        </button>
                    </div>

                    <SubscriptionSideBar 
                        isOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                        mode="edit"
                        data={row.original}
                        onSave={row.original.onEdit}
                    />
                </>
            )
        },
    },
]

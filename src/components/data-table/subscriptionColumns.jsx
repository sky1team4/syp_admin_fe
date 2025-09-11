"use client"

import { ArrowDown, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState } from "react"
// import SubscriptionSideBar from "@/components/SubscriptionSideBar"
import ConfirmationDialog from "@/components/ConfirmationDialog"
// import { toast } from 'react-toastify'
// import { useDispatch } from 'react-redux'
// import { deleteSubscription } from '@/redux/features/subscriptionSlice'

// Create a proper React component for the actions cell
function ActionsCell({ row, handleEdit, handleDelete }) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const item = row.original;

    const onDelete = () => {
        setIsConfirmOpen(true);
    };

    const onConfirmDelete = () => {
        handleDelete(item.id);
        setIsConfirmOpen(false);
    };

    return (
        <>
            <div className="flex justify-center gap-1">
                <button
                    className="p-0.5"
                    onClick={() => handleEdit(item)}
                >
                    <Image
                        src="/EditTable.svg"
                        width={18}
                        height={18}
                        alt="Edit"
                    />
                </button>
                <button
                    className="p-0.5"
                    onClick={onDelete}
                >
                    <Image
                        src="/delete.svg"
                        width={18}
                        height={18}
                        alt="Delete"
                    />
                </button>
            </div>

            <ConfirmationDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={onConfirmDelete}
                title="Delete Item"
                message="Are you sure you want to delete this item? This action cannot be undone."
            />
        </>
    )
}

export const createColumns = ({ handleEdit, handleDelete }) => [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="p-0 hover:bg-transparent justify-start font-medium w-full text-left"
                >
                    Name
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
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
        accessorKey: "monthlyPrice",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="p-0 hover:bg-transparent justify-start font-medium w-full text-left"
                >
                    Monthly Price
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="text-center">
                <div className="font-medium">${parseFloat(row.original.monthlyPrice).toFixed(2)}</div>
                {row.original.monthlyDiscount > 0 && (
                    <div className="text-xs text-green-600">
                        -{row.original.monthlyDiscount}% = ${parseFloat(row.original.monthlyPriceWithDiscount).toFixed(2)}
                    </div>
                )}
            </div>
        ),
    },
    {
        accessorKey: "yearlyPrice",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="p-0 hover:bg-transparent justify-start font-medium w-full text-left"
                >
                    Yearly Price
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="text-center">
                <div className="font-medium">${parseFloat(row.original.yearlyPrice).toFixed(2)}</div>
                {row.original.yearlyDiscount > 0 && (
                    <div className="text-xs text-green-600">
                        -{row.original.yearlyDiscount}% off
                    </div>
                )}
            </div>
        ),
    },
    {
        accessorKey: "subscriptionType",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="p-0 hover:bg-transparent justify-start font-medium w-full text-left"
                >
                    Subscription Type
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="text-center">
                {row.original.subscriptionType || (
                    <span className="text-gray-500 text-sm">No type</span>
                )}
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
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="flex justify-center">
                <div className={`px-2 py-1 rounded-full text-sm w-fit
                    ${row.original.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'}`}>
                    {row.original.status?.toLowerCase()}
                </div>
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
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
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
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="text-center whitespace-nowrap">
                {row.original.lastUpdated}
            </div>
        ),
    },
    {
        id: "actions",
        header: () => <div className="text-left">Actions</div>,
        cell: ({ row }) => <ActionsCell row={row} handleEdit={handleEdit} handleDelete={handleDelete} />
    },
]

"use client"

import { ArrowDown, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState } from "react"
import SubscriptionSideBar from "@/components/SubscriptionSideBar"
import ConfirmationDialog from "@/components/ConfirmationDialog"
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { deleteSubscription } from '@/redux/features/subscriptionSlice'


export const columns = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
            const [isConfirmOpen, setIsConfirmOpen] = useState(false)
            const subscription = row.original;
            const dispatch = useDispatch();

            const handleDelete = () => {
                setIsConfirmOpen(true);
            };

            const handleConfirmDelete = () => {
                console.log('Subscription object:', subscription);
                dispatch(deleteSubscription(subscription.id));
                setIsConfirmOpen(false);
            };

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
                        click={() => setIsSidebarOpen(false)}
                        mode="edit"
                        data={{
                            id: subscription.id,
                            name: subscription.title,
                            price: subscription.price,
                            status: subscription.status
                        }}
                    />

                    <ConfirmationDialog
                        isOpen={isConfirmOpen}
                        onClose={() => setIsConfirmOpen(false)}
                        onConfirm={handleConfirmDelete}
                        title="Delete Subscription"
                        message="Are you sure you want to delete this subscription? This action cannot be undone."
                    />
                </>
            )
        },
    },
]

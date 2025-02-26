"use client"

import { ArrowDown, ArrowUp, MoreHorizontal } from "lucide-react"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button"
import { BannedUsers } from "@/redux/features/authSlice";
import { Checkbox } from "@/components/ui/checkbox"
import { useDispatch, useSelector } from "react-redux";

import { useState } from "react"
import Image from "next/image"

export const columns = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="p-0 hover:bg-transparent justify-start font-medium w-full text-left"
                >
                    User
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <Image
                    src="/dash.png"
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-lg"
                />
                <div>
                    <div className="font-medium">{row.original.name}</div>
                    <div className="text-sm text-gray-500">{row.original.email}</div>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "phoneNumber",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="p-0 hover:bg-transparent justify-start font-medium w-full text-left"
                >
                    Phone Number
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="text-sm font-medium">{row.original.phoneNumber}</div>
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
            <span
                className={`text-sm font-medium ${
                    row.getValue("status") === "active" ? "bg-green-100 text-green-600 rounded-full px-2 py-1" : "bg-yellow-100 text-yellow-600 rounded-full px-2 py-1"
                }`}
            >
                {row.getValue("status") ? row.getValue("status").toString() : "N/A"}
            </span>
        ),
    },
 
    {
        accessorKey: "billingPeriod",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="p-0 hover:bg-transparent justify-start font-medium w-full text-left"
                >
                    Subscription
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="text-sm font-medium">{row.original.billingPeriod}</div>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const user = row.original;
            const [isOpen, setIsOpen] = useState(false);
            const dispatch = useDispatch();

            return (
                <>
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                    >
                        {user.status === "active" ? (
                            <Image
                                src="/verifiedcrosss.svg"
                                alt="close"
                                width={20}
                                height={20}
                                onClick={async () => {
                                    if (user.status === "active") {
                                        try {
                                            console.log("user.id", user);
                                            const result = await dispatch(BannedUsers({ id: user.id, updateUserStatusDto: { status: "inactive" } }));
                                            if (BannedUsers.fulfilled.match(result)) {
                                                toast.success("User status changed to inactive");
                                            } else {
                                                toast.error("Failed to change user status");
                                            }
                                        } catch (error) {
                                            console.error("Error updating user status:", error);
                                            toast.error("Failed to change user status");
                                        }
                                    }
                                }}
                            />
                        ) : (
                            <Image src="/unverified.svg" alt="close" width={20} height={20}
                                onClick={async () => {
                                    if (user.status === "inactive") {
                                        try {
                                            const result = await dispatch(BannedUsers({ id: user.id, updateUserStatusDto: { status: "active" } }));
                                            if (BannedUsers.fulfilled.match(result)) {
                                                toast.success("User status changed to active");
                                            } else {
                                                toast.error("Failed to change user status");
                                            }
                                        } catch (error) {
                                            console.error("Error updating user status:", error);
                                            toast.error("Failed to change user status");
                                        }
                                    }
                                }}
                            />
                        )}
                    </Button>
                    
                </>
            );
        },
    },
]
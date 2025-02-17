"use client"

import { ArrowDown, ArrowUp, MoreHorizontal } from "lucide-react"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import VerificationRequest from "@/app/admin/dashboard/verificationrequest"
import Image from "next/image"

export const columns = [
    {
        accessorKey: "user_name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
                    <div className="font-medium">{row.original.user_name}</div>
                    {/* <div className="text-sm text-gray-500">{row.original.email}</div> */}
                </div>
            </div>
        ),
    },
    {
        accessorKey: "phone_number",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
            <div className="text-sm font-medium">{row.original.phone_number}</div>
        ),
    },
    {
        accessorKey: "subscription_status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
            <div className="capitalize">{row.getValue("subscription_status")}</div>
        ),
    },
    // {
    //     accessorKey: "name",
    //     header: ({ column }) => {
    //         return (
    //             <Button
    //                 variant="ghost"
    //                 onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //             >
    //                 Name
    //                 {column.getIsSorted() === "asc" ? (
    //                     <ArrowUp className="ml-2 h-4 w-4" />
    //                 ) : (
    //                     <ArrowDown className="ml-2 h-4 w-4" />
    //                 )}
    //             </Button>
    //         )
    //     },
    //     cell: ({ row }) => (
    //         <div className="font-medium text-black">{row.original.name}
    //         {console.log(row.original.name)}</div>
    //     ),
    // },
    {
        accessorKey: "subscription_type",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
            <div className="text-sm font-medium">{row.original.subscription}</div>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const user = row.original;
            const [isOpen, setIsOpen] = useState(false);

            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                    if (user.subscription_status === "pending") {
                                        setIsOpen(true);
                                    }
                                }}
                            >
                                {user.subscription_status === "verified" ? (
                                    <Image src="/verifiedcrosss.svg" alt="close" width={20} height={20} onClick={() => toast.success("User banned")} />
                                ) : (
                                    <Image src="/unverified.svg" alt="close" width={20} height={20} />
                                )}
                                
                            </Button>
                        </DropdownMenuTrigger>
                    </DropdownMenu>
                    <VerificationRequest isOpen={isOpen} setIsOpen={setIsOpen} />
                    {/* // cross button for veried user */}
                    
                </>
            );
        },
    },
]
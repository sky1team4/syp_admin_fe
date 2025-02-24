"use client"

import { ArrowDown, ArrowUp, MoreHorizontal } from "lucide-react"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button"
import { ChangeBadgeStatus } from "../../../redux/features/badgeVerificationSlice"
import { useDispatch, useSelector } from "react-redux";
import {
    DropdownMenu,
    
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import VerificationRequest from "@/app/admin/dashboard/verificationrequest"
import Image from "next/image"

export const BadgeVerificationColumns = [
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
                    <div className="font-medium">{row.original.name}</div>
                    <div className="text-sm text-gray-500">{row.original.email}</div>
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
            <div className="text-sm font-medium">{row.original.user_phone_number}</div>
        ),
    },
    {
        accessorKey: "badge_status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Badge Status
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ArrowDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            )
        },
        cell: ({ row }) => {
            const status = row.original.badge_status;
            return (
                <div className={`text-sm font-medium w-14 ${status === 'active' ? 'bg-green-100 text-green-600 p-1 rounded-xl' : 'bg-red-100 text-red-500 p-1 rounded-xl'}`}>
                    {status}
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const user = row.original;
            const [isOpen, setIsOpen] = useState(false);
            const dispatch = useDispatch();
console.log("user", user)
            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <Image src="/unverified.svg" alt="more" width={20} height={20}
                                onClick={() => {
                                    setIsOpen(true)
                                }}
                                 />
                            </Button>
                        </DropdownMenuTrigger>
                    </DropdownMenu>

                
                    <VerificationRequest isOpen={isOpen} setIsOpen={setIsOpen} userData={user} />
                </>
            );
        },
    },
]
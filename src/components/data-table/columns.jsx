"use client"

import { ArrowUpDown, MoreHorizontal } from "lucide-react"
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

export const columns = [
    {
        accessorKey: "Users",
        header: "Username",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <img
                    src={row.original.image}
                    alt={`${row.original.username}'s avatar`}
                    className="w-8 h-8 rounded-full"
                />
                <div>
                    <div className="font-medium">{row.original.username}</div>
                    <div className="text-sm text-gray-500">{row.original.email}</div>
                </div>
            </div>
        ),
    },
    {
        accessorKey: "phone",
        header: "Phone Number",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("status")}</div>
        ),
    },
    {
        accessorKey: "subscription",
        header: "Subscription",
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
                                onClick={() => setIsOpen(true)}
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                    </DropdownMenu>
                    <VerificationRequest isOpen={isOpen} setIsOpen={setIsOpen} />
                </>
            );
        },
    },
]
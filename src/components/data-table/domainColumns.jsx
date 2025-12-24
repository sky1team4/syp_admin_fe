"use client"

import { ArrowDown, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export const createDomainColumns = () => {
    return [
        {
            accessorKey: "domain_name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent justify-start font-medium w-full text-left"
                    >
                        Domain Name
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
                    {row.original.domain_name}
                </div>
            ),
        },
        {
            accessorKey: "user",
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
                <div>
                    {row.original.user?.name || row.original.user || 'N/A'}
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
            cell: ({ row }) => {
                const status = row.original.status;
                const statusColors = {
                    'paid': 'bg-green-100 text-green-800',
                    'pending': 'bg-yellow-100 text-yellow-800',
                    'failed': 'bg-red-100 text-red-800',
                    'refunded': 'bg-gray-100 text-gray-800',
                };
                return (
                    <div className={`px-3 py-1 rounded-full text-sm w-fit capitalize ${statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
                        {status}
                    </div>
                );
            },
        },
        {
            accessorKey: "amount",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent justify-start font-medium w-full text-left"
                    >
                        Amount
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
                    {row.original.currency} {row.original.amount?.toLocaleString()}
                </div>
            ),
        },
        {
            accessorKey: "godaddy_status",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent justify-start font-medium w-full text-left"
                    >
                        GoDaddy Status
                        {column.getIsSorted() === "asc" ? (
                            <ArrowUp className="ml-2 h-4 w-4" />
                        ) : (
                            <ArrowDown className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                )
            },
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.original.godaddy_status || 'N/A'}
                </div>
            ),
        },
        {
            accessorKey: "is_verified",
            header: "Verified",
            cell: ({ row }) => (
                <div className={`px-3 py-1 rounded-full text-sm w-fit ${row.original.is_verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {row.original.is_verified ? 'Yes' : 'No'}
                </div>
            ),
        },
        {
            accessorKey: "created_at",
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
                <div>
                    {new Date(row.original.created_at).toLocaleDateString()}
                </div>
            ),
        },
        {
            accessorKey: "refundRequest.status",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent justify-start font-medium w-full text-left"
                    >
                        Refund Request Status
                        {column.getIsSorted() === "asc" ? (
                            <ArrowUp className="ml-2 h-4 w-4" />
                        ) : (
                            <ArrowDown className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                )
            },
            cell: ({ row }) => {
                const refundRequest = row.original.refundRequest;
                if (!refundRequest) {
                    return <div className="text-gray-400">-</div>;
                }
                
                const status = refundRequest.status;
                const statusColors = {
                    'pending': 'bg-yellow-100 text-yellow-800',
                    'approved': 'bg-green-100 text-green-800',
                    'rejected': 'bg-red-100 text-red-800',
                    'processed': 'bg-blue-100 text-blue-800',
                };
                
                return (
                    <div className={`px-3 py-1 rounded-full text-sm w-fit capitalize ${statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
                        {status || 'N/A'}
                    </div>
                );
            },
        },
    ];
}


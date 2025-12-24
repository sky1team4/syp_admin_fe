"use client"

import { ArrowDown, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import ConfirmationDialog from "@/components/ConfirmationDialog"

// Create a proper React component for the actions cell
function ActionsCell({ row, handleApprove, handleReject }) {
    const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false)
    const [isRejectConfirmOpen, setIsRejectConfirmOpen] = useState(false)
    const item = row.original;
    
    // Only show actions for pending requests
    const isPending = item.status?.toLowerCase() === 'pending';

    const onApprove = () => {
        setIsApproveConfirmOpen(true);
    };

    const onConfirmApprove = () => {
        handleApprove(item.id);
        setIsApproveConfirmOpen(false);
    };

    const onReject = () => {
        setIsRejectConfirmOpen(true);
    };

    const onConfirmReject = () => {
        handleReject(item.id);
        setIsRejectConfirmOpen(false);
    };

    if (!isPending) {
        return (
            <div className="text-gray-500 text-sm capitalize">
                {item.status}
            </div>
        );
    }

    return (
        <>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onApprove}
                    className="bg-green-50 text-green-700 hover:bg-green-100 border-green-300"
                >
                    Approve
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onReject}
                    className="bg-red-50 text-red-700 hover:bg-red-100 border-red-300"
                >
                    Reject
                </Button>
            </div>

            <ConfirmationDialog
                isOpen={isApproveConfirmOpen}
                onClose={() => setIsApproveConfirmOpen(false)}
                onConfirm={onConfirmApprove}
                title="Approve Refund Request"
                message="Are you sure you want to approve this refund request? This action will process the refund."
                confirmButtonText="Approve"
                confirmButtonClassName="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700"
            />

            <ConfirmationDialog
                isOpen={isRejectConfirmOpen}
                onClose={() => setIsRejectConfirmOpen(false)}
                onConfirm={onConfirmReject}
                title="Reject Refund Request"
                message="Are you sure you want to reject this refund request? This action cannot be undone."
                confirmButtonText="Reject"
                confirmButtonClassName="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700"
            />
        </>
    );
}

export const createRefundRequestColumns = ({ handleApprove, handleReject }) => {
    return [
        {
            accessorKey: "domain.domain_name",
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
                    {row.original.domain?.domain_name || 'N/A'}
                </div>
            ),
        },
        {
            accessorKey: "user.name",
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
                    {row.original.user?.name || 'N/A'}
                </div>
            ),
        },
        {
            accessorKey: "requested_amount",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent justify-start font-medium w-full text-left"
                    >
                        Requested Amount
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
                    {row.original.currency} {row.original.requested_amount?.toLocaleString()}
                </div>
            ),
        },
        {
            accessorKey: "refunded_amount",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="p-0 hover:bg-transparent justify-start font-medium w-full text-left"
                    >
                        Refunded Amount
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
                    {row.original.refunded_amount 
                        ? `${row.original.currency} ${row.original.refunded_amount.toLocaleString()}`
                        : '-'
                    }
                </div>
            ),
        },
        {
            accessorKey: "reason",
            header: "Reason",
            cell: ({ row }) => (
                <div className="max-w-xs truncate" title={row.original.reason}>
                    {row.original.reason || 'N/A'}
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
                    'pending': 'bg-yellow-100 text-yellow-800',
                    'approved': 'bg-green-100 text-green-800',
                    'rejected': 'bg-red-100 text-red-800',
                    'processed': 'bg-blue-100 text-blue-800',
                };
                return (
                    <div className={`px-3 py-1 rounded-full text-sm w-fit capitalize ${statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
                        {status}
                    </div>
                );
            },
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.original.type?.replace('_', ' ') || 'N/A'}
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
            id: "actions",
            header: "Actions",
            cell: ({ row }) => <ActionsCell row={row} handleApprove={handleApprove} handleReject={handleReject} />
        },
    ];
}


"use client"

import React, { useState } from "react"
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Button from '../cui/button'
import Image from "next/image"

export function SubscriptionTable({ columns, data, title, btnText, click, isOpen , backBTN, link}) {
    const [sorting, setSorting] = useState([])

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
    })

    return (
        <div className="p-6 h-full bg-white shadow-lg rounded-xl w-full">
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-3">
                    {backBTN == "no" ? null : (
                        <a href={`${link? link : "/admin/setting"}`} className="self-center cursor-pointer">
                            <Image
                                src="/backArrow.svg"  // path from public folder
                                alt="Illustration"
                                width={8}  // required in Next.js
                                height={8}
                            />
                        </a>
                    )}
                    <h2 className="text-xl font-semibold text-gray-900">
                        {title}
                    </h2>

                </div>
                {btnText && <Button click={click} isOpen={isOpen} h="10" text={btnText} />}
            </div>

            <div className="relative overflow-x-auto w-full">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="hover:bg-gray-100"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

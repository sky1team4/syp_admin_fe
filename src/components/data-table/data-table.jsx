"use client";
import Image from "next/image";
import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export function DataTable({ columns, data, globalFilter }) {
  // console.log("data table", data);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data,
    columns: columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  return (
    <div className="w-full main-content">
      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-left">
                    <div className="flex justify-start">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells()
                    .map((cell) => (
                      <TableCell key={cell.id} className="text-left">
                        <div className="flex justify-start">
                          {cell.column.id === "user_name" ? (
                            <div className="flex items-center space-x-3">
                              <Image
                                src={row.original.profileImage || "/dash.png"}
                                alt="Profile"
                                width={32}
                                height={32}
                                className="rounded-lg"
                              />
                              <div>
                                <p className="text-sm font-medium">
                                  {row.original.name || cell.getValue() || "Unknown"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {row.original.email || ""}
                                </p>
                              </div>
                            </div>
                          ) : cell.column.id === "phoneNumber" ? (
                            <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-500">
                              {row.original.phoneNumber || "N/A"}
                            </span>
                          ) : cell.column.id === "status" ? (
                            <span
                              className={`text-sm font-medium  ${cell.getValue() === "active" ? "bg-green-100 text-green-600 rounded-full px-2 py-1" : "bg-yellow-100 text-yellow-600 rounded-full px-2 py-1"
                                }`}
                            >
                              {cell.getValue() ? cell.getValue().toString() : "N/A"}
                            </span>
                          ) : cell.column.id === "billingPeriod" ? (
                            <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              cell.getValue()?.toLowerCase() === "monthly"
                                ? "bg-green-100 text-green-600"
                                : cell.getValue()?.toLowerCase() === "yearly"
                                ? "bg-blue-100 text-blue-600"
                                : cell.getValue()?.toLowerCase() === "free"
                                ? "bg-yellow-100 text-yellow-600"
                                : cell.getValue()?.toLowerCase() === "not_subscribed"
                                ? "bg-gray-100 text-gray-600"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {cell.getValue()?.toLowerCase() === "monthly"
                              ? "Monthly Subscription"
                              : cell.getValue()?.toLowerCase() === "yearly"
                              ? "Yearly Subscription"
                              : cell.getValue()?.toLowerCase() === "free"
                              ? "Free Subscription"
                              : cell.getValue()?.toLowerCase() === "not_subscribed"
                              ? "Not Subscribed"
                              : "Not Subscribed"}
                          </span>
                          
                          ) : (
                            flexRender(cell.column.columnDef.cell, cell.getContext())
                          )}
                        </div>
                      </TableCell>
                    ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center py-4">
        <div className="text-sm text-gray-500">
          {table.getFilteredRowModel().rows.length} row(s)
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

    </div>
  );
}

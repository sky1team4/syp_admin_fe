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
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, MoreVertical } from "lucide-react";
import VerificationRequest from "@/app/admin/dashboard/verificationrequest";

export function DataTable({ columns, data }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [activeTab, setActiveTab] = useState("Users");
  const [openVerificationRow, setOpenVerificationRow] = useState(null); // Track the open row for the verification popup

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "Users") {
      setColumnFilters([{ id: "status", value: "Active" }]);
    } else {
      setColumnFilters([{ id: "status", value: "Inactive" }]);
    }
  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          Users Information
        </h2>
        <button className="bg-gray-100 rounded-full">
          <Image src="/More.svg" width={45} height={45} />
        </button>
      </div>
      {/* Tabs */}
      <div className="flex items-center justify-start mb-4 w-fit border border-purple-600 rounded-lg overflow-hidden">
        <button
          className={`px-4 py-2 text-sm md:text-base font-medium transition ${
            activeTab === "Users"
              ? "bg-purple-600 text-white"
              : "bg-white text-purple-600"
          }`}
          onClick={() => handleTabClick("Users")}
        >
          Users
        </button>

        <button
          className={`px-4 py-2 text-sm md:text-base font-medium transition ${
            activeTab === "Verification Requests"
              ? "bg-purple-600 text-white"
              : "bg-white text-purple-600"
          }`}
          onClick={() => handleTabClick("Verification Requests")}
        >
          Verification Requests
        </button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50">
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.column.id === "user" ? (
                        <div className="flex items-center space-x-3">
                          <img
                            src={cell.getValue().image}
                            alt="Profile"
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="text-sm font-medium">
                              {cell.getValue().name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {cell.getValue().username}
                            </p>
                          </div>
                        </div>
                      ) : cell.column.id === "status" ? (
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            cell.getValue() === "Active"
                              ? "bg-purple-100 text-purple-500"
                              : "bg-red-100 text-red-500"
                          }`}
                        >
                          {cell.getValue()}
                        </span>
                      ) : cell.column.id === "subscription" ? (
                        <span
                          className={`text-sm font-medium ${
                            cell.getValue() === "Subscribed"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {cell.getValue()}
                        </span>
                      ) : cell.column.id === "action" ? (
                        <>
                          <Button
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => setOpenVerificationRow(row.id)} // Open the popup for this row
                          >
                            View Documents
                          </Button>
                          {openVerificationRow === row.id && (
                            <VerificationRequest
                              isOpen={true}
                              setIsOpen={() => setOpenVerificationRow(null)} // Close the popup
                            />
                          )}
                        </>
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      )}
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

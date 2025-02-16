"use client"

import React, { useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
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
import Button from "../cui/button";
import Image from "next/image";

export function SubscriptionTable({ columns, data = [], title, btnText, click, isOpen, backBTN, link }) {
  const [sorting, setSorting] = useState([]);

  // Ensure data is an array before passing it to react-table
  const validatedData = Array.isArray(data) ? data : [];

  // console.log("Table Data:", validatedData);

  const table = useReactTable({
    data: validatedData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="p-4 md:p-6 h-full bg-white shadow-lg rounded-xl w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 md:gap-3">
          {backBTN !== "no" && (
            <a href={link || "/admin/setting"} className="self-center cursor-pointer">
              <Image src="/backArrow.svg" alt="Back" width={10} height={10} />
            </a>
          )}
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">{title}</h2>
        </div>
        {btnText && <Button click={click} isOpen={isOpen} h="10" text={btnText} className="text-sm md:text-base lg:text-lg xl:text-xl" />}
      </div>

      <div className="relative overflow-x-auto w-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-100">
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
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

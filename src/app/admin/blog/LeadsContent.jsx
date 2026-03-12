"use client";

import React, { useState, useEffect } from "react";
import { fetchLeads } from "@/lib/blogApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "react-hot-toast";

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return "—";
  }
}

export default function LeadsContent() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchLeads();
      setLeads(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load leads");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-4 md:p-6 h-full bg-white shadow-lg rounded-xl w-full">
      <div className="flex flex-col gap-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">Leads</h2>

        <div className="rounded-md border overflow-x-auto">
          {loading ? (
            <div className="animate-pulse p-8 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-100 rounded" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="text-left">User</TableHead>
                  <TableHead className="text-left">Name</TableHead>
                  <TableHead className="text-left">Phone</TableHead>
                  <TableHead className="text-left">Industry</TableHead>
                  <TableHead className="text-left">Job Title</TableHead>
                  <TableHead className="text-left">Experience</TableHead>
                  <TableHead className="text-left">Location</TableHead>
                  <TableHead className="text-left">Current Step</TableHead>
                  <TableHead className="text-left">Status</TableHead>
                  <TableHead className="text-left">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.length > 0 ? (
                  leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="text-sm text-neutral-600">
                        {lead.user
                          ? `${lead.user.name ?? lead.user.email ?? "—"} (${lead.user.email ?? "—"})`
                          : "—"}
                      </TableCell>
                      <TableCell className="text-sm text-neutral-600">
                        {lead.name ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm text-neutral-600">
                        {lead.phone ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm text-neutral-600">
                        {lead.industry ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm text-neutral-600">
                        {lead.jobTitle ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm text-neutral-600">
                        {lead.experienceYears != null ? lead.experienceYears : "—"}
                      </TableCell>
                      <TableCell className="text-sm text-neutral-600">
                        {lead.location ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm text-neutral-600">
                        {lead.currentStep ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm text-neutral-600">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            lead.status === "in_progress"
                              ? "bg-amber-100 text-amber-800"
                              : lead.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {lead.status ?? "—"}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-neutral-500">
                        {formatDate(lead.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="h-24 text-center text-neutral-500"
                    >
                      No leads found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}

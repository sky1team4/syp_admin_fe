"use client";

import React, { useState } from "react";
import PostListContent from "./PostListContent";
import CategoriesContent from "./CategoriesContent";
import TagsContent from "./TagsContent";
import MediaContent from "./MediaContent";
import LeadsContent from "./LeadsContent";

const TABS = [
  { id: "posts", label: "Posts" },
  { id: "categories", label: "Categories" },
  { id: "tags", label: "Tags" },
  { id: "media", label: "Media" },
  { id: "leads", label: "Leads" },
];

export default function BlogPage() {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex border-b border-gray-200 mb-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex gap-3 w-full min-h-0">
        {activeTab === "posts" && <PostListContent />}
        {activeTab === "categories" && <CategoriesContent />}
        {activeTab === "tags" && <TagsContent />}
        {activeTab === "media" && <MediaContent />}
        {activeTab === "leads" && <LeadsContent />}
      </div>
    </div>
  );
}

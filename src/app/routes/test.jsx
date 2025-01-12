"use client"
import React, {useState} from "react";

const TabMenu = () => {
  const [activeTab, setActiveTab] = useState("Users"); // Initial active tab

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="flex w-72 border-b border-purple-600 rounded-xl">
      {/* Users Tab */}
      <button
        className={`px-3 py-2 text-sm md:text-base font-medium rounded-l-xl ${
          activeTab === "Users"
            ? "bg-purple-600 text-white"
            : "bg-white text-purple-600"
        }`}
        onClick={() => handleTabClick("Users")}
      >
        Users
      </button>

      {/* Verification Requests Tab */}
      <button
        className={`px-3 py-2 text-sm md:text-base font-medium rounded-r-xl ${
          activeTab === "Verification Requests"
            ? "bg-purple-600 text-white"
            : "bg-white text-purple-600"
        }`}
        onClick={() => handleTabClick("Verification Requests")}
      >
        Verification Requests
      </button>
    </div>
  );
};

export default TabMenu;

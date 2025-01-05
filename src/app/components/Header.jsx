import React from "react";

const DashboardTopBar = () => {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white rounded-xl shadow flex-col md:flex-row">
      {/* Left Section: Dashboard Title and Search Bar */}
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        <div className="relative ml-4">
          <input
            type="text"
            placeholder="Search here..."
            className="w-64 px-4 py-2 text-gray-700 bg-gray-100 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-purple-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Right Section: Language Dropdown, Notifications, Profile */}
      <div className="flex items-center space-x-6">
        {/* Language Dropdown */}
        <div className="flex items-center space-x-2 cursor-pointer">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg"
            alt="US Flag"
            className="w-5 h-5 rounded-full"
          />
          <span className="text-gray-700">Eng (US)</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4 text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* Notifications */}
        <div className="relative cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-gray-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-5-5.917V4a1 1 0 10-2 0v1.083A6.002 6.002 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3.001 3.001 0 01-6 0m6 0H9"
            />
          </svg>
          <span className="absolute top-0 right-0 w-4 h-4 text-xs text-white bg-red-500 rounded-full flex items-center justify-center">
            1
          </span>
        </div>

        {/* Profile Section */}
        <div className="flex items-center space-x-2 cursor-pointer">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
          <div className="text-gray-700">
            <h4 className="text-sm font-medium">Musfiq</h4>
            <span className="text-xs">Admin</span>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4 text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DashboardTopBar;
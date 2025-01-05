// Notifications.jsx
import React from "react";

const Notifications = () => {
  const notifications = Array(10).fill({
    name: "Natalia Khan",
    message: "Activated her Domain.",
    time: "25 min ago",
    avatar: "https://via.placeholder.com/50", // Replace with actual avatar URLs
  });

  return (
    <div className="p-2 sm:p-6 bg-white shadow-md rounded-lg w-full max-w-xs sm:max-w-sm overflow-x-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
        <button className="text-sm text-purple-600 hover:underline flex items-center">
          <span className="material-icons mr-1">done_all</span>Mark as read
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-4 overflow-x-auto">
        <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md">
          All
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md">
          Unread
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md">
          Archived
        </button>
      </div>

      {/* Notifications List */}
      <ul className="space-y-4">
        {notifications.map((notification, index) => (
          <li
            key={index}
            className="flex items-start sm:items-center space-x-4 p-2 border-b last:border-none"
          >
            <img
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
              src={notification.avatar}
              alt={notification.name}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">
                {notification.name}{" "}
                <span className="font-normal">{notification.message}</span>
              </p>
              <p className="text-xs text-gray-500">{notification.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;

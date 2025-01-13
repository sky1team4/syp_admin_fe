// Notifications.jsx
import React, { useState } from "react";
import Image from "next/image";

const Notifications = () => {
  const initialNotifications = Array(10).fill({
    name: "Natalia Khan",
    message: "Activated her Domain.",
    time: "25 min ago",
    avatar: "https://i.pravatar.cc/50", // Corrected avatar URL
    isRead: false,
    isArchived: false,
  });

  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("All");

  const handleMarkAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      isRead: true,
    }));
    setNotifications(updatedNotifications);
  };

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "All") return true;
    if (filter === "Unread") return !notification.isRead && !notification.isArchived;
    if (filter === "Archived") return notification.isArchived;
    return true;
  });

  const toggleArchive = (index) => {
    const updatedNotifications = [...notifications];
    updatedNotifications[index].isArchived = !updatedNotifications[index].isArchived;
    setNotifications(updatedNotifications);
  };

  return (
    <div className="p-2 sm:p-6 bg-white shadow-md rounded-lg w-full max-w-xs sm:max-w-sm overflow-x-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
        <button
          className="gap-2 text-sm text-purple-600 hover:underline flex items-center"
          onClick={handleMarkAsRead}
        >
          <Image src="/doubletick.svg" alt="mark" width={20} height={20} />
          <p>Mark all as read</p>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-4 overflow-x-auto">
        {["All", "Unread", "Archived"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium rounded-md ${filter === tab
                ? "border border-purple-600 text-purple-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            onClick={() => handleFilterChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <ul className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification, index) => (
            <li
              key={index}
              className={`flex items-start sm:items-center space-x-4 p-2 border-b last:border-none ${!notification.isRead ? "bg-gray-50" : ""
                }`}
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
              <button
                className="text-xs text-blue-500 hover:underline"
                onClick={() => toggleArchive(index)}
              >
                {notification.isArchived ? "Unarchive" : "Archive"}
              </button>
            </li>
          ))
        ) : (
          <li className="text-center text-gray-500">No notifications to display.</li>
        )}
      </ul>
    </div>
  );
};

export default Notifications;

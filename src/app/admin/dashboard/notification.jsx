"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import "./scrollBar.css";
import { createPortal } from "react-dom";

const Notifications = ({ 
  isVisible, 
  notifications: propNotifications, 
  setNotifications: propSetNotifications,
  markAsRead: propMarkAsRead,
  markAllAsRead: propMarkAllAsRead 
}) => {
  const [filter, setFilter] = useState("All");
  const [mounted, setMounted] = useState(false);
  const [loadingMarkAll, setLoadingMarkAll] = useState(false);
  const [loadingIndividual, setLoadingIndividual] = useState({});

  // Use notifications passed as props instead of calling the hook again
  const notifications = propNotifications || [];
  const setNotifications = propSetNotifications || (() => {});
  const markAsRead = propMarkAsRead || (() => {});
  const markAllAsRead = propMarkAllAsRead || (() => {});

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleMarkAllAsRead = async () => {
    if (loadingMarkAll) return;
    
    setLoadingMarkAll(true);
    console.log('🔔 Marking all notifications as read...');
    
    try {
      const success = await markAllAsRead();
      if (success) {
        console.log('✅ All notifications marked as read');
      } else {
        console.error('❌ Failed to mark all as read');
      }
    } catch (error) {
      console.error('❌ Error marking all as read:', error);
    } finally {
      setLoadingMarkAll(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    if (loadingIndividual[notificationId]) return;
    
    setLoadingIndividual(prev => ({ ...prev, [notificationId]: true }));
    console.log('🔔 Marking notification as read:', notificationId);
    
    try {
      const success = await markAsRead(notificationId);
      if (success) {
        console.log('✅ Notification marked as read');
      } else {
        console.error('❌ Failed to mark notification as read');
      }
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
    } finally {
      setLoadingIndividual(prev => ({ ...prev, [notificationId]: false }));
    }
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
    const updated = [...notifications];
    updated[index].isArchived = !updated[index].isArchived;
    setNotifications(updated);
  };

  // Count unread notifications for the mark all button
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const content = (
    <div
      className="fixed top-16 right-4 notification-panel"
      style={{
        zIndex: 99999,
        position: "fixed",
        isolation: "isolate",
      }}
    >
      <div
        className={`notification-panel ${
          isVisible ? "slide-in" : "slide-out"
        } bg-white shadow-2xl rounded-lg 2xl:w-[20rem] h-[38rem] p-2 sm:p-6 flex flex-col`}
      >
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap">
          <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
          {unreadCount > 0 && (
            <button
              className={`gap-2 text-sm text-purple-600 hover:underline flex items-center ${loadingMarkAll ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleMarkAllAsRead}
              disabled={loadingMarkAll}
            >
              <Image src="/doubletick.svg" alt="mark" width={20} height={20} />
              <p>{loadingMarkAll ? 'Marking...' : `Mark all as read (${unreadCount})`}</p>
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-4 z-90">
          {["All", "Unread", "Archived"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                filter === tab
                  ? "border border-purple-600 text-purple-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => handleFilterChange(tab)}
            >
              {tab}
              {tab === "Unread" && unreadCount > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto custom-scrollbar flex-1">
          <ul className="space-y-4 mb-20">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification, index) => (
                <li
                  key={notification.id || index}
                  className={`flex items-start space-x-4 p-3 border-b last:border-none rounded-lg transition-colors ${
                    !notification.isRead ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                  }`}
                >
                  <Image
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0"
                    src={notification.avatar || "/profileImage.png"}
                    alt={notification.name || "Notification"}
                    width={48}
                    height={48}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">
                          {notification.name || "System"}{" "}
                          <span className="font-normal">
                            {notification.message || notification.text_title}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.time || new Date().toLocaleTimeString()}
                        </p>
                      </div>
                      
                      {/* Mark as read button for unread notifications */}
                      {!notification.isRead && (
                        <button
                          className={`ml-2 text-xs text-purple-600 hover:text-purple-800 hover:underline flex-shrink-0 ${
                            loadingIndividual[notification.id] ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          onClick={() => handleMarkAsRead(notification.id)}
                          disabled={loadingIndividual[notification.id]}
                        >
                          {loadingIndividual[notification.id] ? '...' : 'Mark read'}
                        </button>
                      )}
                      
                      {/* Read indicator */}
                      {notification.isRead && (
                        <div className="ml-2 flex-shrink-0">
                          <Image src="/doubletick.svg" alt="read" width={16} height={16} className="opacity-50" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Archive button (if needed) */}
                  {/* <button
                    className="text-xs text-blue-500 hover:underline"
                    onClick={() => toggleArchive(index)}
                  >
                    {notification.isArchived ? "Unarchive" : "Archive"}
                  </button> */}
                </li>
              ))
            ) : (
              <li className="text-center text-gray-500 py-8">
                {filter === "Unread" ? "No unread notifications" : "No notifications to display."}
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );

  if (!mounted || typeof window === "undefined") return null;

  return createPortal(content, document.body);
};

export default Notifications;

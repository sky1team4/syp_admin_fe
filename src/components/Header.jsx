import React, { useState, useEffect, useRef, useContext } from "react";
import Image from "next/image";
import Link from 'next/link';
import { useSelector } from 'react-redux';
import Notifications from "../../src/app/admin/dashboard/notification";
import { TabContext } from '../context/Tabcontext'; // Adjust the path as necessary


const DashboardTopBar = () => {
  // 1. All useState declarations
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 2. All useRef declarations
  const notificationRef = useRef(null);

  // 3. All context hooks
  const { currentTab } = useContext(TabContext);

  // 4. Redux selector
  const { user, role } = useSelector((state) => state.auth);

  // 5. All useEffect hooks
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isNotificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen]);

  // Event handlers
  const handleClickOutside = (event) => {
    const notificationPanel = document.querySelector('.notification-panel');
    if (
      notificationRef.current && 
      !notificationRef.current.contains(event.target) && 
      (!notificationPanel || !notificationPanel.contains(event.target))
    ) {
      setIsNotificationOpen(false);
    }
  };

  const toggleNotifications = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  // Loading state JSX
  if (!mounted) {
    return (
      <div className="fixed top-0 w-full lg:pr-80 flex items-center justify-between px-8 py-4 bg-white">
        <div className="animate-pulse flex items-center space-x-2">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className={`fixed top-0 w-full lg:pr-80 flex items-center justify-between px-8 py-4 bg-white flex-col md:flex-row ${isNotificationOpen ? 'backdrop-blur-md' : ''}`}>
      {/* Left Section */}
      <div className="flex md:items-center lg:items-center">
        <h1 className="hidden lg:block text-sm md:text-2xl font-bold text-gray-800">
          {currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}
        </h1>
      </div>

      {/* Right Section */}
      <div className="pl-6 md:pl-0 flex ml-auto items-center space-x-2 md:space-x-6">
        {/* Notifications */}
        <div className="relative cursor-pointer" ref={notificationRef}>
          <div onClick={toggleNotifications} className="transition-transform duration-200 hover:scale-110">
            <Image
              alt="bellicon"
              src="/bellicon.png"
              width={30}
              height={30}
            />
            <span className="hover:scale-110 absolute top-0 right-0 w-4 h-4 text-xs text-white bg-red-500 rounded-full flex items-center justify-center">
              1
            </span>
          </div>
          <div className="absolute">
            <Notifications isVisible={isNotificationOpen} />
          </div>
        </div>

        {/* Profile Section */}
        <Link 
          href="/admin/profile"
          className="flex items-center space-x-2 cursor-pointer transition-transform duration-200 hover:scale-105"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden">
            {user?.profilePicture ? (
              <Image 
                src={user.profilePicture}
                alt={user?.name || 'Profile'} 
                width={40} 
                height={40} 
                className="rounded-full object-cover"
                unoptimized={true}
              />
            ) : (
              <Image 
                src="/profile.png"
                alt="Default Profile" 
                width={40} 
                height={40} 
                className="rounded-full object-cover"
              />
            )}
          </div>

          <div className="text-gray-700">
            <h4 className="text-sm font-bold">{user?.name || 'User'}</h4>
            <span className="text-xs capitalize">{role || 'Admin'}</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DashboardTopBar;
'use client';
import React, { useState, useEffect, useRef, useContext } from "react";
import Image from "next/image";
import Link from 'next/link';
import { useSelector } from 'react-redux';
import Notifications from "../../src/app/admin/dashboard/notification";
import { TabContext } from '../context/Tabcontext'; // Adjust the path as necessary
import { useNotifications, testSocketConnection, testBackendConnection, debugBackendSocketAuth, forcePollingMode, testNotificationAPI, validateToken, refreshToken, startTokenMonitor, extendTokenForTesting, restartTokenMonitorIfNeeded, emergencyRecovery } from '../hooks/useNotifications';

// Get base URL from environment variable
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const DashboardTopBar = () => {
  console.log('🎨 Header component rendering at:', new Date().toISOString());
  
  // 1. All useState declarations
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 2. All useRef declarations
  const notificationRef = useRef(null);

  // 3. All context hooks
  const { currentTab } = useContext(TabContext);

  // 4. Redux selector
  const { user, role } = useSelector((state) => state.auth);

  // 6. All useNotifications hooks
  const { notifications, setNotifications, markAsRead, markAllAsRead } = useNotifications();
  
  console.log('🎨 Header render - notifications data:');
  console.log('   - Notifications count:', notifications?.length || 0);
  console.log('   - Current tab:', currentTab);
  console.log('   - User:', user?.name);
  console.log('   - Component mounted:', mounted);
  
  // Track when notifications change
  useEffect(() => {
    console.log('🔔 Header detected notification change');
    console.log('   - New notification count:', notifications?.length || 0);
    console.log('   - Timestamp:', new Date().toISOString());
    
    // Check if this notification change affects auth
    setTimeout(() => {
      console.log('🔔 Post-notification auth check from Header:');
      const authStatus = validateToken();
      console.log('   - Token valid:', authStatus.valid);
      console.log('   - Auth reason:', authStatus.reason);
      
      if (!authStatus.valid) {
        console.error('🚨 AUTH INVALID AFTER NOTIFICATION CHANGE IN HEADER!');
        console.error('   - This suggests Header re-render is affecting auth');
      }
    }, 50);
  }, [notifications]);

  // 5. All useEffect hooks
  useEffect(() => {
    setMounted(true);
    
    // Expose test functions globally for debugging
    if (typeof window !== 'undefined') {
      window.testSocketConnection = testSocketConnection;
      window.testBackendConnection = testBackendConnection;
      window.debugBackendSocketAuth = debugBackendSocketAuth;
      window.forcePollingMode = forcePollingMode;
      window.testNotificationAPI = testNotificationAPI;
      window.validateToken = validateToken;
      window.refreshToken = refreshToken;
      window.startTokenMonitor = startTokenMonitor;
      window.extendTokenForTesting = extendTokenForTesting;
      window.restartTokenMonitorIfNeeded = restartTokenMonitorIfNeeded;
      window.emergencyRecovery = emergencyRecovery;
      console.log('🧪 Debug functions available:');
      console.log('  - window.testSocketConnection()');
      console.log('  - window.testBackendConnection()');
      console.log('  - window.debugBackendSocketAuth()');
      console.log('  - window.forcePollingMode()');
      console.log('  - window.forceStartPolling()');
      console.log('  - window.testNotificationAPI()  // Test notification endpoint directly');
      console.log('  - window.validateToken()        // Check token status without logout');
      console.log('  - window.refreshToken()         // Manually refresh auth token');
      console.log('  - window.startTokenMonitor()    // Start token expiration monitor');
      console.log('  - window.extendTokenForTesting() // Extend token by 1 hour (testing only)');
      console.log('  - window.restartTokenMonitorIfNeeded() // Restart monitor after login');
      console.log('  - window.emergencyRecovery()     // Check login & restart all systems');
    }
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

  // Helper function to get complete image URL
  const getCompleteImageUrl = (url) => {
    if (!url || url === 'null' || url === '[null]' || url === 'undefined') return null;
    return url.startsWith('http') ? url : `${BASE_URL}${url}`;
  };

  // Fixed: Use consistent property name for filtering unread notifications
  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;
  console.log('Unread notifications count:', unreadCount);

  // Profile Image Component
  const ProfileImage = ({ user }) => {
    const defaultImage = '/profileImage.png';
    const profilePic = user?.profilePicture;
    
    // Handle null, undefined, or string 'null' cases
    let imageUrl = defaultImage;
    if (profilePic && profilePic !== 'null' && profilePic !== '[null]' && profilePic !== 'undefined') {
      const completeUrl = getCompleteImageUrl(profilePic);
      if (completeUrl) {
        imageUrl = completeUrl;
      }
    }
    
    return (
      <Image 
        src={imageUrl}  // Now guaranteed to be a valid URL string
        alt={user?.name || 'Profile'} 
        fill
        sizes="(max-width: 768px) 40px, 44px"
        className="rounded-full object-cover"
        priority
        unoptimized={true}
      />
    );
  };

  // Loading state JSX
  if (!mounted) {
    return (
      <div className="z-50 fixed top-0 w-full lg:pr-80 flex items-center justify-between px-8 py-4 bg-white">
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
    <div className={`fixed z-10 top-0 w-full lg:pr-80 flex items-center justify-between px-8 py-4 bg-white flex-col md:flex-row ${isNotificationOpen ? 'backdrop-blur-md' : ''}`}>
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
              src="/bell_Icon.png"
              width={30}
              height={30}
            />
            {unreadCount > 0 && (
              <span className="hover:scale-110 absolute top-0 right-0 w-4 h-4 text-xs text-white bg-red-500 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}

          </div>
          <div className="absolute">
            <Notifications 
              isVisible={isNotificationOpen} 
              notifications={notifications} 
              setNotifications={setNotifications}
              markAsRead={markAsRead}
              markAllAsRead={markAllAsRead}
            />
          </div>
        </div>

        {/* Profile Section */}
        <Link 
          href="/admin/profile"
          className="flex items-center space-x-3 cursor-pointer transition-transform duration-200 hover:scale-105"
        >
          <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-purple-100 ring-offset-2 shadow-sm relative">
            <ProfileImage user={user} />
          </div>

          <div className="text-gray-700">
            <h4 className="text-sm font-semibold tracking-wide">
              {user?.name || 'User'}
            </h4>
            <span className="text-xs text-gray-500 capitalize">
              {role || 'Admin'}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DashboardTopBar;
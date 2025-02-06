import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Notifications from "../../src/app/admin/dashboard/notification";

const DashboardTopBar = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleClickOutside = (event) => {
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setIsNotificationOpen(false);
    }
  };

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

  return (
    <div className="flex items-center justify-between px-8 py-4 bg-white flex-col md:flex-row">
      {/* Left Section: Dashboard Title and Search Bar */}
      <div className="flex md:items-center lg:items-center">
        <h1 className="hidden lg:block text-sm md:text-2xl font-bold text-gray-800">Dashboard</h1>
        {/* <div className="relative ml-4 hidden lg:block">
          <span className="absolute top-1/2 left-3 lg:left-5 transform -translate-y-1/2 text-purple-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 hidden md:block"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
          </span>
          <input
            type="text"
            placeholder="     Search here..."
            className=" w-[25rem] 2xl:w-[33rem] px-10 py-3 text-gray-700 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          
        </div> */}
      </div>

      {/* Right Section: Language Dropdown, Notifications, Profile */}
      <div className="pl-6 md:pl-0 flex ml-auto items-center space-x-2 md:space-x-6">


        {/* Notifications */}
        <div className="relative cursor-pointer" ref={notificationRef}>
          <Image 
            alt="bellicon" 
            src="/bellicon.png" 
            width={30} 
            height={30} 
            onClick={toggleNotifications}
          />
          <span className="absolute top-0 right-0 w-4 h-4 text-xs text-white bg-red-500 rounded-full flex items-center justify-center">
            1
          </span>
          
          {/* Notification Popup */}
          {isNotificationOpen && (
            <div className="absolute -right-28 mt-14 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-auto">
              <Notifications />
            </div>
          )}
        </div>

        {/* Profile Section */}
        <div className="flex items-center space-x-2 cursor-pointer">
          
          <Image alt="profile" src="/profile.png" width={40} height={40}/>

          <div className="text-gray-700">
            <h4 className="text-sm font-bold">Musfiq</h4>
            <span className="text-xs">Admin</span>
          </div>
          
          {/* <Image alt="downArrow" src="/downArrow.svg" width={30} height={30}/> */}

        </div>
      </div>
    </div>
  );
};

export default DashboardTopBar;
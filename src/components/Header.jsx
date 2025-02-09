import React, { useState, useEffect, useRef, useContext } from "react";
import Image from "next/image";
import Notifications from "../../src/app/admin/dashboard/notification";
import { TabContext } from '../context/Tabcontext'; // Adjust the path as necessary


const DashboardTopBar = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);
  const { currentTab } = useContext(TabContext);

  const toggleNotifications = () => {
    setIsNotificationOpen((prev) => !prev);
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
    <div className={`fixed top-0 w-full lg:w-[78%] 2xl:w-[85%] flex items-center justify-between px-8 py-4 bg-white flex-col md:flex-row ${isNotificationOpen ? 'backdrop-blur-md z-10' : ''}`}>
      {/* Left Section: Dashboard Title and Search Bar */}
      <div className="flex md:items-center lg:items-center">

        <h1 className="hidden lg:block text-sm md:text-2xl font-bold text-gray-800">
          {currentTab.charAt(0).toUpperCase() + currentTab.slice(1)} {/* Capitalize the first letter */}
        </h1>
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
        <Notifications isVisible={isNotificationOpen} />
          <Image
            alt="bellicon"
            src="/bellicon.png"
            width={30}
            height={30}
            onClick={toggleNotifications}
          />
          <span className="absolute top-0 right-0 w-4 h-4 text-xs text-white bg-red-500 rounded-full flex items-center justify-center">
            1
            <Notifications isVisible={isNotificationOpen} />
          </span>

          {/* Notification Popup */}
          <div className="absolute top-10 -right-36 z-60">
            {/* <Notifications isVisible={isNotificationOpen} /> */}
          </div>
        </div>

        {/* Profile Section */}
        <div className="flex items-center space-x-2 cursor-pointer">

          <Image alt="profile" src="/profile.png" width={40} height={40} />

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
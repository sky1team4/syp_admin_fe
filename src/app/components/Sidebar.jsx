import React, { useState } from "react";
import Image from "next/image";
import themes from "../theme.js";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const staticTab = "dashboard";
  const sidebarClass = themes.SideBarTheme;
  const activeSidebarClass = themes.SideBarTheme_Active;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="relative flex w-64 h-auto">
      {/* Hamburger Button */}
      <button
        onClick={toggleSidebar}
        className="sm:hidden bg-purple-600 text-white p-2 rounded-md m-2 z-50 h-10 absolute"
      >
        <Image
          src="/dashbaord_siedebar_icon/menu.png"
          width={25}
          height={25}
          // alt=""
        />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-purple-600 text-white w-screen ${
          isSidebarOpen ? "w-screen" : "sm:w-48"
        } flex flex-col gap-5 items-center py-6 px-4 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 transition-transform duration-300 z-50`}
      >
        {/* Close Button */}
        <button
          onClick={toggleSidebar}
          className="sm:hidden text-white self-end mr-4"
        >
          ✖
        </button>

        {/* Logo / Active Dashboard */}
        <div
          className={`${staticTab === "dashboard" ? activeSidebarClass : sidebarClass} mt-16`}
        >
          <Image
            src="/dashbaord_siedebar_icon/Graph.png"
            width={30}
            height={30}
            alt="icon"
          />
          <span className="ml-2 text-purple-600 text-sm font-medium">
            Dashboard
          </span>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col space-y-6">
          {/* Subscriptions */}
          <div
            className={
              staticTab === "subscription" ? activeSidebarClass : sidebarClass
            }
          >
            <Image
              src="/dashbaord_siedebar_icon/subscribe.png"
              width={30}
              height={30}
              alt="icon"
              className="text-purple-500"
            />
            <span className="text-sm">Subscriptions</span>
          </div>

          {/* Companies */}
          <div
            className={
              staticTab === "companies" ? activeSidebarClass : sidebarClass
            }
          >
            <Image
              src="/dashbaord_siedebar_icon/companies.png"
              width={30}
              height={30}
              alt="icon"
              className="text-purple-500"
            />
            <span className="text-sm">Companies</span>
          </div>

          {/* Payment Integration */}
          <div
            className={
              staticTab === "payment" ? activeSidebarClass : sidebarClass
            }
          >
            <Image
              src="/dashbaord_siedebar_icon/payment.png"
              width={30}
              height={30}
              alt="icon"
              className="text-purple-500"
            />
            <span className="text-sm">Payment Integration</span>
          </div>

          {/* Settings */}
          <div
            className={
              staticTab === "setting" ? activeSidebarClass : sidebarClass
            }
          >
            <Image
              src="/dashbaord_siedebar_icon/setting.png"
              width={30}
              height={30}
              alt="icon"
              className="text-purple-500"
            />
            <span className="text-sm">Settings</span>
          </div>

          {/* Sign Out */}
          <div
            className={
              staticTab === "signout" ? activeSidebarClass : sidebarClass
            }
          >
            <Image
              src="/dashbaord_siedebar_icon/signout.png"
              width={30}
              height={30}
              alt="icon"
              className="text-purple-500"
            />
            <span className="text-sm">Sign Out</span>
          </div>
        </nav>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        ></div>
      )}

      {/* Main Content */}
      
    </div>
  );
};

export default Sidebar;

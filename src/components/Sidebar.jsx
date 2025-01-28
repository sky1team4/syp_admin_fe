import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import themes from "../app/theme.js";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [staticTab, setStaticTab] = useState("dashboard"); // Default selected tab
  const sidebarClass = themes.SideBarTheme;
  const activeSidebarClass = themes.SideBarTheme_Active;
  const sidebarItemClass = "flex items-center p-2 rounded-md";

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex md:w-64 h-auto">
      {/* Hamburger Button */}
      <button
        onClick={toggleSidebar}
        className="sm:hidden bg-purple-600 text-white p-2 rounded-md m-2 h-10 absolute top-4"
      >
        <Image
          src="/dashbaord_siedebar_icon/menu.png"
          width={25}
          height={25}
          alt="menu"
        />
      </button>

      {/* Sidebar */}
      <div
        className={`z-40 fixed top-0 left-0 h-full bg-purple-600 text-white ${isSidebarOpen ? "w-screen" : "sm:w-64"
          } flex flex-col gap-5 items-center py-6 px-4 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } sm:translate-x-0 transition-transform duration-300`}
      >
        {/* Close Button */}
        <button
          onClick={toggleSidebar}
          className="sm:hidden text-white self-end mr-4"
        >
          ✖
        </button>
        {/* Logo / Active Dashboard */}
        <Link href="/admin/dashboard">
          <div
            onClick={() => handleTabClick("dashboard")}
            className={`${staticTab === "dashboard" ? activeSidebarClass : sidebarClass} mt-16 ${sidebarItemClass}`}
          >
            <Image
              src="/dashbaord_siedebar_icon/Graph.svg"
              width={30}
              height={30}
              alt="icon"
            />
            <span className="ml-2 text-[12px] font-medium">Dashboard</span>
          </div>
        </Link>

        {/* Menu Items */}
        <nav className="flex flex-col space-y-6">
          {/* Subscriptions */}
          <a href="/admin/subscriptionManagement">
            <div
              onClick={() => handleTabClick("subscription")}
              className={`${sidebarItemClass} ${staticTab === "subscription" ? "bg-white text-purple-600" : sidebarClass}`}
            >
              <Image
                src={"/dashbaord_siedebar_icon/subscribe.png"}
                width={30}
                height={30}
                alt="Subscriptions icon"
              />
              <span className="ml-2 text-[12px]">Subscriptions</span>
            </div>
          </a>

          {/* Companies */}
          <a href="/admin/companies">
            <div
              onClick={() => handleTabClick("companies")}
              className={`${sidebarItemClass} ${staticTab === "companies" ? "bg-white text-purple-600" : sidebarClass}`}
            >
              <Image
                src="/dashbaord_siedebar_icon/Mask group (1).svg"
                width={30}
                height={30}
                alt="icon"
              />
              <span className="ml-2 text-[12px]">Companies</span>
            </div>
          </a>

          {/* Payment Integration */}
          <a href="/admin/payment">
            <div
              onClick={() => handleTabClick("payment")}
              className={`${sidebarItemClass} ${staticTab === "payment" ? "bg-white text-purple-600" : sidebarClass}`}
            >
              <Image
                src="/dashbaord_siedebar_icon/Mask group (2).svg"
                width={30}
                height={30}
                alt="icon"
              />
              <span className="ml-2 text-[12px]">Payment Integration</span>
            </div>
          </a>

          {/* Settings */}
          <a href="/admin/setting">
            <div
              onClick={() => handleTabClick("setting")}
              className={`${sidebarItemClass} ${staticTab === "setting" ? "bg-white text-purple-600" : sidebarClass}`}
            >
              <Image
                src="/dashbaord_siedebar_icon/setting.svg"
                width={30}
                height={30}
                alt="icon"
              />
              <span className="ml-2 text-[12px]">Settings</span>
            </div>
          </a>

          {/* Sign Out */}
          <Link href="/admin-Login">
            <div
              onClick={() => handleTabClick("signout")}
              className={`${sidebarItemClass} ${staticTab === "signout" ? "bg-white text-purple-600" : sidebarClass}`}
            >
              <Image
                src="/dashbaord_siedebar_icon/Signout.svg"
                width={30}
                height={30}
                alt="icon"
              />
              <span className="text-sm">Sign Out</span>
            </div>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;

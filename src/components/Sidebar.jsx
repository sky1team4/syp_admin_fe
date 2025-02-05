import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import themes from "../app/theme.js";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [staticTab, setStaticTab] = useState("dashboard"); // Default selected tab
  const sidebarClass = themes.SideBarTheme;
  const activeSidebarClass = themes.SideBarTheme_Active;
  const sidebarItemClass = "flex items-center p-2 rounded-md";

  useEffect(() => {
    // Load the selected tab from localStorage on component mount
    const savedTab = localStorage.getItem("selectedTab");
    setStaticTab(savedTab || "dashboard"); // Default to "dashboard" if no tab is saved
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleTabClick = (tab) => {
    setStaticTab(tab);
    if (tab === "signout") {
      localStorage.removeItem("selectedTab"); // Clear the selected tab on sign out
    } else {
      localStorage.setItem("selectedTab", tab); // Save the selected tab in localStorage
    }
    setIsSidebarOpen(false); // Close sidebar after selecting a tab
  };

  return (
    <>
      {/* Overlay (Appears only on mobile when sidebar is open) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <div className="flex md:w-64 h-auto">
        {/* Hamburger Button */}
        <button
          onClick={toggleSidebar}
          className="sm:hidden bg-purple-600 text-white p-2 rounded-md m-2 h-10 fixed top-4 z-40"
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
          className={`z-40 fixed top-0 left-0 h-full bg-purple-600 text-white ${
            isSidebarOpen ? "w-[70%]" : "sm:w-64"
          } flex flex-col gap-5 items-center py-6 px-4 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } sm:translate-x-0 transition-transform duration-300`}
        >
          {/* Close Button */}
          <button
            onClick={toggleSidebar}
            className="sm:hidden text-white self-end mr-4"
          >
            <Image
              src="/closeIcon.svg"
              width={25}
              height={25}
              alt="close"
            />
          </button>

          {/* Sidebar Content */}
          <Link href="/admin/dashboard" onClick={() => handleTabClick("dashboard")}>
            <div
              className={`${
                staticTab === "dashboard" ? activeSidebarClass : sidebarClass
              } mt-16 ${sidebarItemClass}`}
            >
              <Image
                src={
                  staticTab === "dashboard"
                    ? "/dashbaord_siedebar_icon/dashboardIcon_active.svg"
                    : "/dashbaord_siedebar_icon/dashboardIcon.svg"
                }
                width={30}
                height={30}
                alt="icon"
              />
              <span className="ml-2 text-[12px] font-medium">Dashboard</span>
            </div>
          </Link>

          {/* Menu Items */}
          <nav className="flex flex-col space-y-6">
            <Link
              href="/admin/subscriptionManagement"
              onClick={() => handleTabClick("subscription")}
            >
              <div
                className={`${sidebarItemClass} ${
                  staticTab === "subscription"
                    ? "bg-white text-purple-600"
                    : sidebarClass
                }`}
              >
                <Image
                  src={
                    staticTab === "subscription"
                      ? "/dashbaord_siedebar_icon/subscriptionIcon_active.svg"
                      : "/dashbaord_siedebar_icon/subscriptionIcon.svg"
                  }
                  width={30}
                  height={30}
                  alt="Subscriptions icon"
                />
                <span className="ml-2 text-[12px]">Subscriptions</span>
              </div>
            </Link>

            <Link href="/admin/companyPage" onClick={() => handleTabClick("companies")}>
              <div
                className={`${sidebarItemClass} ${
                  staticTab === "companies"
                    ? "bg-white text-purple-600"
                    : sidebarClass
                }`}
              >
                <Image
                  src={
                    staticTab === "companies"
                      ? "/dashbaord_siedebar_icon/companyIcon_active.svg"
                      : "/dashbaord_siedebar_icon/companyIcon.svg"
                  }
                  width={30}
                  height={30}
                  alt="icon"
                />
                <span className="ml-2 text-[12px]">Companies</span>
              </div>
            </Link>

            <Link href="/admin/payment" onClick={() => handleTabClick("payment")}>
              <div
                className={`${sidebarItemClass} ${
                  staticTab === "payment"
                    ? "bg-white text-purple-600"
                    : sidebarClass
                }`}
              >
                <Image
                  src={
                    staticTab === "payment"
                      ? "/dashbaord_siedebar_icon/paymentIcon_active.svg"
                      : "/dashbaord_siedebar_icon/paymentIcon.svg"
                  }
                  width={30}
                  height={30}
                  alt="icon"
                />
                <span className="ml-2 text-[12px]">Payment Integration</span>
              </div>
            </Link>

            <Link href="/admin/setting" onClick={() => handleTabClick("setting")}>
              <div
                className={`${sidebarItemClass} ${
                  staticTab === "setting"
                    ? "bg-white text-purple-600"
                    : sidebarClass
                }`}
              >
                <Image
                  src={
                    staticTab === "setting"
                      ? "/dashbaord_siedebar_icon/settingIcon_active.svg"
                      : "/dashbaord_siedebar_icon/settingIcon.svg"
                  }
                  width={30}
                  height={30}
                  alt="icon"
                />
                <span className="ml-2 text-[12px]">Settings</span>
              </div>
            </Link>

            <Link href="/admin-Login" onClick={() => handleTabClick("signout")}>
              <div
                className={`${sidebarItemClass} ${
                  staticTab === "signout"
                    ? "bg-white text-purple-600"
                    : sidebarClass
                }`}
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
    </>
  );
};

export default Sidebar;

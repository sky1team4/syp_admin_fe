import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import themes from "../theme.js";

const Sidebar = () => {
  const [staticTab, setStaticTab] = useState("dashboard"); // Default selected tab
  const sidebarClass = themes.SideBarTheme;
  const activeSidebarClass = themes.SideBarTheme_Active;
  const sidebarItemClass = "flex items-center p-2 rounded-md";

  return (
    <div className="flex w-64 h-auto">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-purple-600 text-purple-500 w-64 flex flex-col gap-5 items-center py-6 px-4`}
      >
        {/* Logo / Active Dashboard */}
        <Link href="/admin/dashboard">
          <div
            onClick={() => setStaticTab("dashboard")}
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
          <Link href="/admin/subscriptionManagement">
            <div
              onClick={() => setStaticTab("subscription")}
              className={`${sidebarItemClass} ${staticTab === "subscription" ? "bg-white text-purple-600" : sidebarClass}`}
            >
              <Image
                src="/dashbaord_siedebar_icon/subscribe.png"
                width={30}
                height={30}
                alt="icon"
              />
              <span className="ml-2 text-[12px]">Subscriptions</span>
            </div>
          </Link>

          {/* Companies */}
          <Link href="/admin/companies">
            <div
              onClick={() => setStaticTab("companies")}
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
          </Link>

          {/* Payment Integration */}
          <Link href="/admin/payment">
            <div
              onClick={() => setStaticTab("payment")}
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
          </Link>

          {/* Settings */}
          <Link href="/admin/setting">
            <div
              onClick={() => setStaticTab("setting")}
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
          </Link>

          {/* Sign Out */}
          <Link href="/admin-Login">
            <div
              onClick={() => setStaticTab("signout")}
              className={`${sidebarItemClass} ${staticTab === "signout" ? "bg-white text-purple-600" : sidebarClass}`}
            >
              <Image
                src="/dashbaord_siedebar_icon/Signout.svg"
                width={30}
                height={30}
                alt="icon"
              />
              <span className="ml-2 text-[12px]">Sign Out</span>
            </div>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;

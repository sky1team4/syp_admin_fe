import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import themes from "../app/theme.js";
import { TabContext } from '../context/Tabcontext'; // Adjust the path as necessary
import theme from "../app/theme.js";

// console.log(color.color);

const Sidebar = () => {
  const { setCurrentTab } = useContext(TabContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [staticTab, setStaticTab] = useState("dashboard"); // Default selected tab
  const sidebarClass = themes.SideBarTheme;
  const activeSidebarClass = themes.SideBarTheme_Active;
  const sidebarItemClass = "flex items-center p-2 rounded-md";

  useEffect(() => {
    // Load the selected tab from localStorage on component mount
    const savedTab = localStorage.getItem("selectedTab");
    const initialTab = savedTab || "dashboard"; // Default to "dashboard" if no tab is saved
    setStaticTab(initialTab);
    setCurrentTab(initialTab); // Ensure context is updated with the initial tab
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleTabClick = (tab) => {
    setStaticTab(tab);
    setCurrentTab(tab); // Update the context with the selected tab
    if (tab === "signout") {
      localStorage.removeItem("token"); // Remove the token
      localStorage.removeItem("selectedTab"); // Clear selected tab
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
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <div className="flex md:w-64 h-auto">
        {/* Hamburger Button */}
        <button
          onClick={toggleSidebar}
          className={`lg:hidden bg-[${theme.color}] text-white p-2 rounded-md m-2 ml-3 h-10 fixed top-4 z-40`}
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
          className={`z-40 fixed top-0 left-0 h-screen bg-[${theme.color}] text-white ${isSidebarOpen ? "w-[70%] translate-x-0" : "lg:w-72 -translate-x-full"
          } flex flex-col gap-5 items-center py-6 px-4 transform  lg:translate-x-0 transition-transform duration-300`}
        >
          <div className="text-4xl font-bold self-start ml-4"> SYP</div>
          {/* Close Button */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-white self-end mr-4"
          >
            <Image
              src="/closeIcon.svg"
              width={25}
              height={25}
              alt="close"
            />
          </button>

          {/* Sidebar Content */}

          {/* Menu Items */}
          <nav className="flex flex-col space-y-6 ">
            <Link href="/admin/dashboard" onClick={() => handleTabClick("dashboard")}>
              <div
                className={`${staticTab === "dashboard" ? activeSidebarClass : sidebarClass
                  } mt-7 ${sidebarItemClass}`}
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
                <span className="ml-2 font-medium">Dashboard</span>
              </div>
            </Link>
            
            <Link
              href="/admin/subscriptionManagement"
              onClick={() => handleTabClick("subscription")}
            >
              <div
                className={`${sidebarItemClass} ${staticTab === "subscription"
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
                <span className="ml-2 font-medium">Subscriptions</span>
              </div>
            </Link>

            <Link href="/admin/companyPage" onClick={() => handleTabClick("companies")}>
              <div
                className={`${sidebarItemClass} ${staticTab === "companies"
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
                <span className="ml-2 font-medium">Companies</span>
              </div>
            </Link>


            <Link href="/admin/payment" onClick={() => handleTabClick("payment")}>
              <div
                className={`${sidebarItemClass} ${staticTab === "payment"
                    ? "bg-white  text-purple-600"
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
                <span className="ml-2 font-medium">Payment Integration</span>
              </div>
            </Link>
            <Link href="/admin/setting" onClick={() => handleTabClick("setting")}>
              <div
                className={`${sidebarItemClass} ${staticTab === "setting"
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
                <span className="ml-2 font-medium">Settings</span>
              </div>
            </Link>

            <div className="">
              <Link href="/admin-Login" onClick={() => handleTabClick("signout")} >
                <div className={`${sidebarItemClass} ${sidebarClass}`}>
                  <Image
                    src="/dashbaord_siedebar_icon/Signout.svg"
                    width={40}
                    height={40}
                    alt="icon"
                  />
                  <span className="ml-2 font-medium">Sign Out</span>
                </div>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
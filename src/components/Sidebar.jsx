import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import themes from "../app/theme.js";
import { TabContext } from '../context/Tabcontext'; // Adjust the path as necessary
import theme from "../app/theme.js";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/features/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";

// console.log(color.color);

const Sidebar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { setCurrentTab } = useContext(TabContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [staticTab, setStaticTab] = useState("dashboard");
  const sidebarClass = themes.SideBarTheme;
  const activeSidebarClass = themes.SideBarTheme_Active;
  const sidebarItemClass = "flex items-center p-2 rounded-xl";

  useEffect(() => {
    // Load the selected tab from localStorage on component mount
    const savedTab = localStorage.getItem("selectedTab");
    const path = window.location.pathname;

    // Only default to dashboard if there's no saved tab AND we're on the dashboard route
    if (!savedTab && path === '/admin/dashboard') {
      setStaticTab('dashboard');
      setCurrentTab('dashboard');
      localStorage.setItem('selectedTab', 'dashboard');
    } else if (savedTab) {
      // Otherwise use the saved tab
      setStaticTab(savedTab);
      setCurrentTab(savedTab);
    }
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleTabClick = async (tab) => {
    if (tab === "signout") {
      try {
        Cookies.remove("authToken", { path: "/" });
        await dispatch(logoutUser()).unwrap();
        localStorage.setItem("selectedTab", "dashboard");
        setCurrentTab("dashboard");
        router.replace("/admin-Login");
      } catch (err) {
        console.error("Logout error:", err);
        Cookies.remove("authToken", { path: "/" });
        toast.error("Logged out due to error");
        router.replace("/admin-Login");
      }
    } else {
      setStaticTab(tab);
      localStorage.setItem("selectedTab", tab);
      setCurrentTab(tab);
    }
    setIsSidebarOpen(false);
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
          className={`lg:hidden text-white p-2 rounded-md m-2 ml-3 h-10 fixed top-4 z-40`}
          style={{ backgroundColor: theme.color }}
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
          className={`z-40 fixed top-0 left-0 h-screen text-white ${isSidebarOpen ? "sm:w-[70%] md:w-[50%] lg:w-72 translate-x-0" : "lg:w-72 -translate-x-full"
          } flex flex-col gap-5 items-center py-6 px-4 transform  lg:translate-x-0 transition-transform duration-300`}
          style={{ backgroundColor: theme.color }}
          >
          <div className="text-4xl font-bold self-start ml-4"> SYP</div>
          {/* Close Button */}
          {/* <button
            onClick={toggleSidebar}
            className="lg:hidden text-white self-end mr-4"
          >
            <Image
              src="/closeIcon.svg"
              width={25}
              height={25}
              alt="close"
            />
          </button> */}

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
                    width={30}
                    height={30}
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
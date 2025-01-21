import React from "react";
import Image from "next/image";
const DashboardTopBar = () => {
  return (
    <div className="flex items-center justify-between px-8 py-6 bg-white flex-col md:flex-row">
      {/* Left Section: Dashboard Title and Search Bar */}
      <div className="flex md:items-center lg:item-center">
        <h1 className="text-sm md:text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="relative ml-4 hidden md:block">
          <span className="absolute top-1/2 left-3 transform -translate-y-1/2 text-purple-500">
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
            className="hidden md:block w-[25rem] px-10 py-3 text-gray-700 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          
        </div>
      </div>

      {/* Right Section: Language Dropdown, Notifications, Profile */}
      <div className="flex items-center space-x-6">
        {/* Language Dropdown */}
        <div className="flex items-center space-x-2 cursor-pointer">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg"
            alt="US Flag"
            className="w-5 h-5 rounded-full"
          />
          <span className="text-gray-700">Eng (US)</span>
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4 text-gray-500"
          > */}
            {/* <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            /> */}
          {/* </svg> */}
          <Image alt="downArrow" src="/downArrow.svg" width={30} height={30}/>
        </div>

        {/* Notifications */}
        <div className="relative cursor-pointer">
        <Image alt="bellicon" src="/bellicon.png" width={30} height={30}/>
          <span className="absolute top-0 right-0 w-4 h-4 text-xs text-white bg-red-500 rounded-full flex items-center justify-center">
            1
          </span>
        </div>

        {/* Profile Section */}
        <div className="flex items-center space-x-2 cursor-pointer">
          
          <Image alt="profile" src="/profile.png" width={40} height={40}/>

          <div className="text-gray-700">
            <h4 className="text-sm font-bold">Musfiq</h4>
            <span className="text-xs">Admin</span>
          </div>
          
          <Image alt="downArrow" src="/downArrow.svg" width={30} height={30}/>

        </div>
      </div>
    </div>
  );
};

export default DashboardTopBar;
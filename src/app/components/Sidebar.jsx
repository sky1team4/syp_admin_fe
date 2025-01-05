import React from "react";
import Image from "next/image";
const Sidebar = () => {
  return (
    <div className=" bg-purple-600 text-white w-64 flex flex-col gap-5 items-center py-6 px-6">
      {/* Logo / Active Dashboard */}
      <div className="flex items-center justify-center mt-16 w-48 h-12 bg-white rounded-full">
      <Image
      src="/dashbaord_siedebar_icon/Graph.png"
      width={30}
      height={30}
      alt="icon"
    />
        <span className="ml-2 text-purple-600 text-sm font-medium">Dashboard</span>
      </div>

      {/* Menu Items */}
      <nav className="flex flex-col space-y-6">
        {/* Subscriptions */}
        <div className="flex items-center space-x-4 cursor-pointer hover:bg-gray-50 p-2 rounded-3xl hover:text-purple-500">
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
        <div className="flex items-center space-x-4 cursor-pointer hover:bg-gray-50 p-2 rounded-3xl  hover:text-purple-500">
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
        <div className="flex items-center space-x-4 cursor-pointer hover:bg-gray-50 p-2 rounded-3xl  hover:text-purple-500">
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
        <div className="flex items-center space-x-4 cursor-pointer hover:bg-gray-50 p-2 rounded-3xl  hover:text-purple-500">
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
        <div className="flex items-center space-x-4 cursor-pointer hover:bg-gray-50 p-2 rounded-3xl  hover:text-purple-500">
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
  );
};

export default Sidebar;

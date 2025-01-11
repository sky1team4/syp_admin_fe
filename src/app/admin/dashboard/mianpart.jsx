import React, { useState } from "react";
import Image from "next/image";
import VerificationRequest from "./verificationrequest";

const UserTable = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Users");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const users = [
    {
      name: "Maddison",
      username: "@Maddison_c21",
      phone: "0321765284",
      status: "Active",
      subscription: "Unsubscribed",
      avatar: "https://i.pravatar.cc/40",
    },
    {
      name: "Maddison",
      username: "@Maddison_c21",
      phone: "0321765284",
      status: "Inactive",
      subscription: "Subscribed",
      avatar: "https://i.pravatar.cc/40",
    },
    {
      name: "Maddison",
      username: "@Maddison_c21",
      phone: "0321765284",
      status: "Active",
      subscription: "Unsubscribed",
      avatar: "https://i.pravatar.cc/40",
    },
  ];

  const getStatusBadge = (status) => {
    if (status === "Active")
      return <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">Active</span>;
    return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">Inactive</span>;
  };

  const getSubscriptionBadge = (subscription) => {
    if (subscription === "Subscribed")
      return <span className="text-green-600 font-medium">Subscribed</span>;
    return <span className="text-red-600 font-medium">Unsubscribed</span>;
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "Users") {
      setFilteredUsers(users.filter(user => user.status === "Active"));
    } else {
      setFilteredUsers(users.filter(user => user.status === "Inactive"));
    }
  };

  return (
    <div className="relative">
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
      )}
      <div className="flex flex-col gap-4 p-4 md:p-6 bg-white rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Users Information</h2>
          <button className=" bg-gray-100 rounded-full">
            <Image src='/More.svg' width={45} height={45}/>
          </button>
        </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`px-3 py-2 text-sm md:text-base ${activeTab === "Users" ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-600"
            }`}
          onClick={() => handleTabClick("Users")}
        >
          Users
        </button>
        <button
          className={`px-3 py-2 text-sm md:text-base ${activeTab === "Verification Requests" ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-600"
            }`}
          onClick={() => handleTabClick("Verification Requests")}
        >
          Verification Requests
        </button>
      </div>

      {/* Table for Larger Screens */}
      <div className="hidden md:block overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left py-3 px-4 text-gray-600">User</th>
              <th className="text-left py-3 px-4 text-gray-600">Phone Number</th>
              <th className="text-left py-3 px-4 text-gray-600">Status</th>
              <th className="text-left py-3 px-4 text-gray-600">Subscription</th>
              <th className="text-left py-3 px-4 text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 flex items-center space-x-4">
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="text-gray-800 font-medium">{user.name}</p>
                    <p className="text-gray-500 text-sm">{user.username}</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-500">{user.phone}</td>
                <td className="py-3 px-4">{getStatusBadge(user.status)}</td>
                <td className="py-3 px-4">{getSubscriptionBadge(user.subscription)}</td>
                <td className="py-3 px-4">
                  <div className="p-1 flex items-center justify-center">
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      <Image src='/Vector.svg' width={5} height={5}/>
                    </button>
                    {isOpen && <VerificationRequest isOpen={isOpen} setIsOpen={setIsOpen} />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards for Smaller Screens */}
      <div className="block md:hidden space-y-4 overflow-x-auto">
        {filteredUsers.map((user, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-lg shadow flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="text-gray-800 font-medium">{user.name}</p>
                <p className="text-gray-500 text-sm">{user.username}</p>
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Phone: {user.phone}</p>
              <div className="flex items-center justify-between mt-2">
                <p>Status: {getStatusBadge(user.status)}</p>
                <p>Subscription: {getSubscriptionBadge(user.subscription)}</p>
              </div>
            </div>
            <div className="text-right">
            <button className="p-2 bg-gray-100 rounded-full">
          <Image src='/Vector.svg' width={25} height={25}/>
        </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default UserTable;
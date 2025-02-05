// Today'sSummary.jsx
"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
const TodaysSummary = ({ btnText, title, click, isOpen }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from local storage
        const response = await fetch(`${API_URL}/subscription-verification`, {
          method: 'GET', // Specify the method
          headers: {

            'Authorization': `Bearer ${token}`, // Add token to headers
            'Content-Type': 'application/json', // Specify content type
          },
        });
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Calculate totals from incoming data
  const totalUsers = data.length; // Assuming each entry in data represents a user
  const subscribedUsers = data.filter(user => user.subscription_status === "verified").length;
  const unsubscribedUsers = data.filter(user => user.subscription_status === "pending").length;

  const info = [
    { id: 1, label: "Total user", value: totalUsers.toString(), bgColor: "bg-purple-100", icon: '/totalusers.svg' },
    { id: 2, label: "Subscribed User", value: subscribedUsers.toString(), bgColor: "bg-red-100", icon: '/subscribeuser.svg' },
    { id: 3, label: "Unsubscribed User", value: unsubscribedUsers.toString(), bgColor: "bg-yellow-100", icon: '/unsubscribe.svg' },
    { id: 4, label: "Active domains", value: "5,455", bgColor: "bg-green-100", icon: '/activedomain.svg' },
  ];

  return (
    <div className="w-full bg-white shadow-md p-4 md:p-8 rounded-xl">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <button
          className="text-sm bg-purple-600 text-white px-2 py-2 rounded-md"
          onClick={click}
        >
          {btnText}
        </button>
      </div>
      {isOpen && (
        <div className="popup-content">
          {/* Popup content goes here */}
        </div>
      )}
      <div className="flex gap-4 justify-start w-full flex-wrap">


        {info.map((item) => (
          <div
            key={item.id}
            className={`w-full md:w-[8rem] lg:w-[12rem] flex gap-2 flex-col items-start justify-start p-4 ${item.bgColor} rounded-2xl shadow-lg transition-transform transform hover:scale-105 cursor-pointer`}
          >
            <Image src={item.icon} width={40} height={40} alt="icon" />
            <p className="text-3xl font-bold text-gray-800">{item.value}</p>
            <p className="text-sm font-medium text-gray-600">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodaysSummary;

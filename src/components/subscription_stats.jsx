// Today'sSummary.jsx
"use client"
import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'; // Import hooks from react-redux
// import { fetchAllUsers } from '../redux/features/authSlice'; // Import the action and selector
import { getSubscriptionStats } from '../redux/features/subscribedUserSlice'; // Import the action and selector
import Image from "next/image";
import theme from "../app/theme";

const TodaysSummary = ({ btnText, title, click, isOpen }) => {

  const dispatch = useDispatch(); // Initialize dispatch
  const { subscriptionStats = {} } = useSelector((state) => state.subscribedUser); // Access subscriptionStats from the state


  console.log("totalSubscribed", subscriptionStats);
  

  useEffect(() => {
    dispatch(getSubscriptionStats());
  }, [dispatch]);


  const info = [
    { id: 2, label: "Subscribed User", value: subscriptionStats?.subscribedUsers, bgColor: "bg-red-100", icon: '/subscribeuser.svg' },
    { id: 1, label: "Free Subscription", value:  subscriptionStats?.freeUsers, bgColor: "bg-purple-100", icon: '/totalusers.svg' },
    { id: 3, label: "Monthly Subscription", value:  subscriptionStats?.monthlyUsers, bgColor: "bg-yellow-100", icon: '/unsubscribe.svg' },
    { id: 4, label: "Annual Subscription", value:  subscriptionStats?.yearlyUsers, bgColor: "bg-green-100", icon: '/activedomain.svg' },
  ];

  return (
    <div className="w-full bg-white shadow-md p-4 md:p-5 rounded-xl">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        {btnText && (
          <button
            className={`text-sm text-white px-2 py-2 rounded-md`}
            style={{ backgroundColor: theme.color }}
            onClick={click}
          >
            {btnText}
          </button>
        )}
      </div>
      {isOpen && (
        <div className="popup-content">
          {/* Popup content goes here */}
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-4 justify-start w-full">

        {info.map((item) => (
          <div
            key={item.id}
            className={`w-full  lg:w-1/4 flex gap-2 flex-col items-start justify-start p-4 ${item.bgColor} rounded-2xl`}
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

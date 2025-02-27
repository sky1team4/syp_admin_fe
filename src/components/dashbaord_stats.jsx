// Today'sSummary.jsx
"use client"
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'; 
import { fetchAllUsers } from '../redux/features/authSlice';
import Image from "next/image";
import theme from "../app/theme";
import { getSubscriptionStats } from '../redux/features/subscribedUserSlice'; // Import the action and selector

const TodaysSummary = ({ btnText, title, click, isOpen }) => {

  const dispatch = useDispatch(); // Initialize dispatch
  const { users = [] } = useSelector((state) => state.auth); // Access users from the state
  console.log("users" , users);
  
  const { subscriptionStats = {} } = useSelector((state) => state.subscribedUser);
  const [subscribedUsers, setSubscribedUsers] = useState(0);

  useEffect(() => {
    // Update state with API response
    if (subscriptionStats) {
      setSubscribedUsers(subscriptionStats.totalSubscribed || 0);
      // setFreeUsers(subscriptionStats.freeUsers || 0);
      // setMonthlySubscribedUsers(subscriptionStats.monthly || 0);
      // setAnnualSubscription(subscriptionStats.yearly || 0);
    }
  }, [subscriptionStats]);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const totalUsers = users.length; // Get total users
  console.log(totalUsers);
  // const subscribedUsers = users.filter(user => user.subscription_id !== null).length; // Assuming all users are subscribed for now
  // //  console.log(subscribedUsers);
  const unsubscribedUsers = 0;

  const info = [
    { id: 1, label: "Total user", value: totalUsers.toString(), bgColor: "bg-purple-100", icon: '/totalusers.svg' },
    { id: 2, label: "Subscribed User", value: subscribedUsers.toString(), bgColor: "bg-red-100", icon: '/subscribeuser.svg' },
    { id: 3, label: "Unsubscribed User", value: unsubscribedUsers.toString(), bgColor: "bg-yellow-100", icon: '/unsubscribe.svg' },
    { id: 4, label: "Active domains", value: 0, bgColor: "bg-green-100", icon: '/activedomain.svg' },
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

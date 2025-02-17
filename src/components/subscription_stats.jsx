// Today'sSummary.jsx
"use client"
import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'; // Import hooks from react-redux
import { fetchAllUsers } from '../redux/features/authSlice'; // Import the action and selector
import Image from "next/image";
import theme from "../app/theme";

const TodaysSummary = ({ btnText, title, click, isOpen }) => {
  const dispatch = useDispatch();  // Initialize dispatch
  const data = useSelector(fetchAllUsers); // Get data from the new UserSlice
  const loading = useSelector(state => state.users.loading); // Add loading state
  const error = useSelector(state => state.users.error); // Add error state
  
  // console.log(data);


  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchAllUsers()); // Dispatch the action to fetch user data
      } catch (err) {
        console.error("Failed to fetch users:", err); // Log any errors
      }
    };
    fetchData();
  }, [dispatch]);

  // Calculate totals from incoming data
  const subscribedUsers = data.length;
  const freeUsers = data.length; // this is the total users for free subscription
  const totalUsers = data.length;
  const unsubscribedUsers = data.length;
  const annualSubscription=data.length;
// console.log(freeUsers);

  const info = [
    { id: 2, label: "Subscribed User", value: subscribedUsers.toString(), bgColor: "bg-red-100", icon: '/subscribeuser.svg' },
    { id: 1, label: "Free Subscription", value: freeUsers, bgColor: "bg-purple-100", icon: '/totalusers.svg' },
    { id: 3, label: "Monthly Subscription", value: unsubscribedUsers.toString(), bgColor: "bg-yellow-100", icon: '/unsubscribe.svg' },
    { id: 4, label: "Annual Subscription", value: "5,455", bgColor: "bg-green-100", icon: '/activedomain.svg' },
  ];

  // Add loading and error handling in the return statement
  if (loading) return <div>Loading...</div>; // Show loading state
  if (error) return <div>Error fetching data: {error}</div>; // Show error message

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

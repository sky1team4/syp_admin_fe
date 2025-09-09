// SubscriptionTypeStats.jsx
"use client"
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubscriptionTypes } from '../redux/features/subscriptionTypesSlice';
import Image from "next/image";
import theme from "../app/theme";

const SubscriptionTypeStats = ({ btnText, title, click, isOpen }) => {
  const dispatch = useDispatch();
  const { subscriptionTypes = [] } = useSelector((state) => state.subscriptionTypes);
  const [activeTypes, setActiveTypes] = useState(0);
  const [inactiveTypes, setInactiveTypes] = useState(0);
  const [totalModules, setTotalModules] = useState(0);

  useEffect(() => {
    dispatch(fetchSubscriptionTypes());
  }, [dispatch]);

  useEffect(() => {
    // Calculate stats from subscription types
    if (subscriptionTypes) {
      const active = subscriptionTypes.filter(type => type.status === 'ACTIVE' && !type.deleteDate).length;
      const inactive = subscriptionTypes.filter(type => type.status === 'INACTIVE' && !type.deleteDate).length;
      const allModules = subscriptionTypes.reduce((acc, type) => {
        return acc + (type.modules ? type.modules.length : 0);
      }, 0);
      
      setActiveTypes(active);
      setInactiveTypes(inactive);
      setTotalModules(allModules);
    }
  }, [subscriptionTypes]);

  const info = [
    { id: 1, label: "Active Types", value: activeTypes, bgColor: "bg-green-100", icon: '/activedomain.svg' },
    { id: 2, label: "Inactive Types", value: inactiveTypes, bgColor: "bg-red-100", icon: '/unverified.svg' },
    { id: 3, label: "Total Types", value: subscriptionTypes.filter(type => !type.deleteDate).length, bgColor: "bg-blue-100", icon: '/totalusers.svg' },
    { id: 4, label: "Total Modules", value: totalModules, bgColor: "bg-purple-100", icon: '/subscribeuser.svg' },
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
            className={`w-full lg:w-1/4 flex gap-2 flex-col items-start justify-start p-4 ${item.bgColor} rounded-2xl`}
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

export default SubscriptionTypeStats;

// Today'sSummary.jsx
// "use client"

import React from "react";

const TodaysSummary = (info) => {


  // const data = [
  //   { id: 1, label: "Total user", value: "8,456", bgColor: "bg-purple-100", icon: "👤" },
  //   { id: 2, label: "Subscribed User", value: "4,590", bgColor: "bg-red-100", icon: "📊" },
  //   { id: 3, label: "Unsubscribed User", value: "3,866", bgColor: "bg-yellow-100", icon: "📄" },
  //   { id: 4, label: "Active domains", value: "5,455", bgColor: "bg-green-100", icon: "🔑" },
  // ];

  return (
    <div className="w-full bg-white shadow-md p-8 rounded-xl">
      <div className="w-full flex justify-between items-center mb-4">
        {/* <h2 className="text-lg font-semibold text-gray-800">Today's Summary</h2> */}
        <h2 className="text-lg font-semibold text-gray-800">{info.title}</h2>
        <button onClick={()=> info.click()} className="px-4 py-2 text-sm text-white bg-purple-600 rounded-md hover:bg-purple-700">
          {info.btnText}
        </button>
      </div>
      <div className="flex gap-4 w-full flex-wrap">
        {info.data.map((item) => (
          <div
            key={item.id}
            className={`md:w-[12rem] md:h-32 flex flex-col items-center justify-center p-4 ${item.bgColor} rounded-md cursor-pointer`}
          >
            <div className="text-2xl">{item.icon}</div>
            <p className="mt-2 text-3xl font-bold text-gray-800">{item.value}</p>
            <p className="text-sm font-medium text-gray-600">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodaysSummary;

// Today'sSummary.jsx
import React from "react";

const TodaysSummary = () => {
  const data = [
    { id: 1, label: "Total user", value: "8,456", bgColor: "bg-purple-100", icon: "👤" },
    { id: 2, label: "Subscribed User", value: "4,590", bgColor: "bg-red-100", icon: "📊" },
    { id: 3, label: "Unsubscribed User", value: "3,866", bgColor: "bg-yellow-100", icon: "📄" },
    { id: 4, label: "Active domains", value: "5,455", bgColor: "bg-green-100", icon: "🔑" },
  ];

  return (
    <div className=" bg-white shadow-md p-4 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Today's Summary</h2>
        <button className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-500">
          Export
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col items-center justify-center p-4 ${item.bgColor} rounded-md`}
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

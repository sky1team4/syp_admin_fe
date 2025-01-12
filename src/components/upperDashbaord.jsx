// Today'sSummary.jsx
"use client"
import React from "react";
import Image from "next/image";
const TodaysSummary = (info) => {


  return (
    <div className="w-full bg-white shadow-md p-8 rounded-xl">
      <div className="w-full flex justify-between items-center mb-4">
        {/* <h2 className="text-lg font-semibold text-gray-800">Today's Summary</h2> */}
        <h2 className="text-lg font-semibold text-gray-800">{info.title}</h2>
        <button onClick={()=> info.click()} className="flex justify-center items-center gap-1 px-2 py-2 text-sm text-gray-600 outline outline-2 outline-gray-300 rounded-md hover:bg-purple-300 hover:text-purple-500">
          <Image src='/Exporticon.svg' width={20} height={20}className="mb-1"/>
          {info.btnText}
        </button>
      </div>
      <div className="flex gap-4 justify-start w-full flex-wrap">
        {info.data.map((item) => (
          <div
            key={item.id}
            className={`md:w-[12rem] flex gap-2 flex-col items-start justify-start p-4 ${item.bgColor} rounded-2xl cursor-pointer`}
          >
            <Image src={item.icon} width={40} height={40}/>
            <p className=" text-3xl font-bold text-gray-800">{item.value}</p>
            <p className="text-sm font-medium text-gray-600">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodaysSummary;

"use client"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "@/redux/features/authSlice";
import { badgeVerification } from "@/redux/features/badgeVerificationSlice";
import { columns } from "@/components/data-table/columns"
import { BadgeVerificationColumns } from "@/components/data-table/badge_verification/badgeVerificationColumns"
import { DataTable } from "@/components/data-table/data-table"

export default function DashboardPage() {
  console.log("DashboardPage");
  const dispatch = useDispatch(); 
  const usersData = useSelector((state) => state.auth.users);
  const verificationRequestsData = useSelector((state) => state.badgeVerificationList.data);
  const [activeTab, setActiveTab] = useState("Users");
  
  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(badgeVerification());
  }, [dispatch]);

  const handleVerification = async (user) => {
    console.log("Verifying user:", user);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  
  // const verificationRequestsData = [];
  
  console.log("data mainpart", verificationRequestsData);

  return (
<<<<<<< HEAD
    <div className="relative" style={{ zIndex: 1 }}>
      <div className="w-full py-10 bg-white rounded-xl p-5 shadow-md" style={{ position: 'relative', zIndex: 1 }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          Users Information
        </h2>
        {/* <button className="bg-gray-100 rounded-full">
          <Image alt="more" src="/More.svg" width={45} height={45} />
        </button> */}
      </div>
      {/* Tabs */}
      <div className="flex items-center justify-start mb-4 w-fit border border-purple-600 rounded-lg overflow-hidden">
        <button
          className={`px-4 py-2 text-sm md:text-base font-medium transition ${
            activeTab === "Users"
              ? "bg-purple-600 text-white"
              : "bg-white text-purple-600"
          }`}
          onClick={() => handleTabClick("Users")}
        >
          Users
        </button>

        <button
          className={`px-4 py-2 text-sm md:text-base font-medium transition ${
            activeTab === "Verification Requests"
              ? "bg-purple-600 text-white"
              : "bg-white text-purple-600"
          }`}
          onClick={() => handleTabClick("Verification Requests")}
        >
          Verification Requests
        </button>
      </div>
      {activeTab === "Users" && (
=======
    <div className="">
      <div className="w-full py-10 bg-white rounded-xl p-5 shadow-md">
>>>>>>> 8e42d07eec443cc87d52996c0442d6dca1053311
        <DataTable
          columns={columns}
          data={usersData}
          onVerify={handleVerification}
        />
      )}
      {activeTab === "Verification Requests" && (
        <DataTable
          columns={BadgeVerificationColumns}
          data={verificationRequestsData}
          onVerify={handleVerification}
        />
      )}
      </div>
    </div>
  );
}

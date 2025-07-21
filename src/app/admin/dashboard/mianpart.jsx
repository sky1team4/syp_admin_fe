"use client"
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "@/redux/features/authSlice";
import { GetAllbadgeVerificationRequest } from "@/redux/features/badgeVerificationSlice";
import { columns } from "@/components/data-table/columns"
import { BadgeVerificationColumns } from "@/components/data-table/badge_verification/badgeVerificationColumns"
import { DataTable } from "@/components/data-table/data-table"
import { ToastContainer } from "react-toastify";

export default function DashboardPage() {
  // console.log("DashboardPage");
  const dispatch = useDispatch();
  const usersData = useSelector((state) => state.auth.users);
  const verificationRequestsData = useSelector((state) => state.badgeVerificationList.data);
  const [activeTab, setActiveTab] = useState("Users");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Create a function to fetch data
  const fetchData = useCallback(() => {
    dispatch(fetchAllUsers());
    dispatch(GetAllbadgeVerificationRequest());
  }, [dispatch]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleVerification = async (user) => {
    try {
      // Your verification logic here
      await performVerification(user);
      // After verification, fetch fresh data
      fetchData();
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Filter data based on search term
  const filteredData = activeTab === "Users" 
    ? usersData?.filter(user => 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phoneNumber?.toString() || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    : verificationRequestsData?.filter(request => 
        request.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
  // const verificationRequestsData = [];

  // console.log("Badge Verification Data", verificationRequestsData);

  return (
    <div>
      <ToastContainer />
      <div className="w-full py-10 bg-white rounded-xl p-5 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          Users Information
        </h2>
        {/* <button className="bg-gray-100 rounded-full">
          <Image alt="more" src="/More.svg" width={45} height={45} />
        </button> */}
      </div>
      {/* Tabs and Search */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4 gap-4">
        <div className="flex items-center justify-start w-full lg:w-fit border border-purple-600 rounded-lg overflow-hidden">
          <button
            className={`flex-1 lg:flex-none px-3 lg:px-4 py-2 text-xs sm:text-sm md:text-base font-medium transition whitespace-nowrap ${
              activeTab === "Users"
                ? "bg-purple-600 text-white"
                : "bg-white text-purple-600"
            }`}
            onClick={() => handleTabClick("Users")}
          >
            Users
          </button>

          <button
            className={`flex-1 lg:flex-none px-3 lg:px-4 py-2 text-xs sm:text-sm md:text-base font-medium transition whitespace-nowrap ${
              activeTab === "Verification Requests"
                ? "bg-purple-600 text-white"
                : "bg-white text-purple-600"
            }`}
            onClick={() => handleTabClick("Verification Requests")}
          >
            Verification Requests
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full lg:w-auto">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full lg:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      {activeTab === "Users" && (
        <DataTable
          columns={columns}
          data={filteredData || []}
          onVerify={handleVerification}
        />
      )}
      {activeTab === "Verification Requests" && (
        <DataTable
          columns={BadgeVerificationColumns}
          data={filteredData || []}
          onVerify={handleVerification}
        />
      )}
      </div>
    </div>
  );
}

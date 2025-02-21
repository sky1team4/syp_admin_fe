"use client"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "@/redux/features/authSlice";
import { columns } from "@/components/data-table/columns"
import { DataTable } from "@/components/data-table/data-table"

export default function DashboardPage() {
  console.log("DashboardPage");
  const dispatch = useDispatch(); 
  const data = useSelector((state) => state.auth.users);
  console.log("data mainpart", data);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleVerification = async (user) => {
    console.log("Verifying user:", user);
  };

  return (
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
        <DataTable
          columns={columns}
          data={data}
          onVerify={handleVerification}
        />
        <DataTable
          columns={columns}
          data={data}
          onVerify={handleVerification}
        />
      </div>
    </div>
  );
}

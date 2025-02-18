"use client"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "@/redux/features/authSlice";
import { columns } from "@/components/data-table/columns"
import { DataTable } from "@/components/data-table/data-table"

export default function DashboardPage() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.auth.users);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleVerification = async (user) => {
    console.log("Verifying user:", user);
  };

  return (
    <div className="w-full py-10 bg-white rounded-xl p-5 shadow-md">
      <DataTable
        columns={columns}
        data={data}
        onVerify={handleVerification}
      />
    </div>
  );
}

"use client"
import { useEffect, useState } from "react";
import { columns } from "@/components/data-table/columns"
import { DataTable } from "@/components/data-table/data-table"

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
export default function DashboardPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const yourToken = localStorage.getItem('token');
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscription-verification`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${yourToken}`, // Include your JWT token if required

                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        // console.log(data);
        setData(data);
    } catch (error) {
        console.log(error.message);
    }
    };

    fetchData();
  }, []);

  const handleVerification = async (user) => {
    // Add your verification logic here
    console.log("Verifying user:", user);
    // Example: await verifyUser(user.id);
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

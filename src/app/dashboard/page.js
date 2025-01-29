"use client"
import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/features/authSlice';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    // ... existing code ...

    return (
        <>
            <div className="flex flex-col w-full h-screen overflow-hidden bg-[#F5F5F5] text-black">
                {/* Sidebar */}
                <div className="w-1/4 bg-purple-600 text-white">
                    {/* Sidebar content */}
                </div>

                {/* Main Content */}
                <div className="flex-1 p-4 overflow-auto">
                    {/* Main content goes here */}
                </div>
            </div>
        </>
    );
}
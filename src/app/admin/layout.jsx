"use client"
// src/app/admin/layout.jsx
import React from 'react';
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
// import second from 'first'

const AdminLayout = ({ children }) => {
    return (
        <>
            <div className='flex bg-gray-50 w-screen h-auto'>
                <div className="w-auto">
                    <Sidebar />
                </div>
                {/* <Sidebar /> */}
                <div className='flex flex-col gap-3 w-full h-screen pb-8 overflow-x-hidden'>
                    <Header />
                    <div className="pl-3 pr-6 h-full overflow-x-hidden">
                        {children}
                    </div>
                    {/* <div className='flex gap-3 w-full pb-4'>
                        {children}
                    </div> */}

                </div>
            </div>
        </>
    );
};

export default AdminLayout;

"use client"
// src/app/admin/layout.jsx
import React from 'react';
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
// import second from 'first'

const AdminLayout = ({ children }) => {
    return (
        <>
            <div className='flex flex-col bg-gray-50 w-full'>
                <div className="w-[80%] h-auto self-end fixed top-0">
                    <Header />
                </div>


                <div className="flex justify-end mt-20 m-5">
                    <Sidebar />
                    <div className="mt-5 w-[80%]">
                        {children}


                    </div>
                </div>

                {/* <div className="w-auto">
                    <Sidebar />
                </div> */}

                {/* <Sidebar /> */}
                {/* <div className='flex flex-col gap-3 w-full'> */}
                    {/* <Header />
                    <div className="">
                        {children}
                    </div> */}
                    {/* <div className='flex gap-3 w-full pb-4'>
                        {children}
                    </div> */}

                {/* </div> */}
            </div>
        </>
    );
};

export default AdminLayout;

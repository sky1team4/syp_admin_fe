"use client"
// src/app/admin/layout.jsx
import React from 'react';
import Header from "./../components/Header";
import Sidebar from "./../components/Sidebar";
// import second from 'first'

const AdminLayout = ({ children }) => {
    return (
        <>
            <div className='flex gap-3 bg-gray-50'>
                <Sidebar />
                <div className='flex flex-col gap-3 w-full '>
                    <Header />
                    <div className='flex gap-3'>
                        {children}
                    {/* <div className='flex flex-col gap-3'>
                        <UpperSide />
                        <UserTable />
                    </div>
                    <Left /> */}
                    </div>
                    
                </div>
                </div>
        </>
    );
};

export default AdminLayout;

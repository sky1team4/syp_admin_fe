"use client"
// src/app/admin/layout.jsx
import React from 'react';
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
// import second from 'first'

const AdminLayout = ({ children }) => {
    return (
        <>
            <div className="bg-purple-50/75 w-full h-screen grid gap-4 grid-cols-1 md:grid-cols-[270px_1fr]">
                <div className="w-full">
                    <Sidebar />
                </div>

                <div className="flex flex-col pb-4">
                    <Header />
                    <main className="mt-2 w-full h-full px-4">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
};

export default AdminLayout;

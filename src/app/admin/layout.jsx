"use client"
// src/app/admin/layout.jsx
import React from 'react';
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { TabProvider } from '../../context/Tabcontext'; // Adjust the path as necessary
// import second from 'first'

const AdminLayout = ({ children }) => {
    return (
        <TabProvider>
            <div className="bg-purple-50/75 w-full h-screen lg:grid gap-4 grid-cols-1 md:grid-cols-[270px_1fr]">
                <div className="w-full h-0">
                    <Sidebar />
                </div>

                <div className="flex flex-col pb-4 min-w-0 overflow-hidden">
                    <Header />
                    <main className="w-full flex-1 mt-[78px] p-4 bg-white overflow-y-auto">
                        {children}
                    </main>
                </div>

            </div>
        </TabProvider>
    );
};

export default AdminLayout;

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
            <div className="bg-purple-50/75 w-full h-screen md:grid gap-4 grid-cols-1 md:grid-cols-[270px_1fr]">
                <div className="w-full h-0">
                    <Sidebar />
                </div>

                <div className="flex flex-col pb-4">
                    <Header />
                    <main className="w-full h-full mt-14 md:mt-20 p-4">
                        {children}
                    </main>
                </div>

            </div>
        </TabProvider>
    );
};

export default AdminLayout;

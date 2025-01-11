"use client"

import React from 'react'
import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import UserTable from './mianpart'
import UpperSide from '../../components/upperDashbaord'
import Notification from './notification'

const DashboardPage = () => {

  const data = [
    { id: 1, label: "Total user", value: "8,456", bgColor: "bg-purple-100", icon: '/totalusers.png' },
    { id: 2, label: "Subscribed User", value: "4,590", bgColor: "bg-red-100", icon: '/subscribeuser.png' },
    { id: 3, label: "Unsubscribed User", value: "3,866", bgColor: "bg-yellow-100", icon: '/unsubscribe.png' },
    { id: 4, label: "Active domains", value: "5,455", bgColor: "bg-green-100", icon: '/activedomain.png' },
  ];

  return (
    <div className='flex flex-col md:flex-row gap-3 w-full p-4'>
      {/* <Sidebar /> */}
      <div className='flex flex-col flex-1 gap-3'>
        {/* <Header /> */}
        <UpperSide title="Today's Summary" data={data} btnText="Export" />
        <UserTable />
      </div>
      <Notification />
    </div>
  )
}

export default DashboardPage

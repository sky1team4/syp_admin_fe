"use client"

import React, { useEffect, useState } from 'react'
// import Sidebar from '../../../components/Sidebar'
// import Header from '../../../components/Header'
import UserTable from './mianpart'
import Dashbaord_stats from '../../../components/dashbaord_stats'
// import Notification from './notification'

const DashboardPage = () => {
  

  return (
    <div className='flex flex-col md:flex-row gap-5 w-full p-4'>
      {/* <Sidebar /> */}
      <div className='flex flex-col flex-1 gap-3'>
        {/* <Header /> */}
        <Dashbaord_stats title="Today's Summary" />
        <UserTable />
      </div>
      {/* <Notification /> */}
    </div>
  )
}

export default DashboardPage

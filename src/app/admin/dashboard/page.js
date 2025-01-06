"use client"

import React from 'react'
import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import UserTable from './mianpart'
import UpperSide from './upperDashbaord'
import Left from './notification'

const DashboardPage = () => {
  return (
    <div className='flex gap-3 bg-gray-50'>
      <Sidebar />
      <div className='flex flex-col gap-3 w-full '>
        <Header />
        <div className='flex gap-3'>
          <div className='flex flex-col gap-3'>
            <UpperSide />
            <UserTable />
          </div>
          <Left />
        </div>
        
      </div>
    </div>
  )
}

export default DashboardPage

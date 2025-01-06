"use client"

import React from 'react'
import Header from '../../components/Header'
import SideBar from '../../components/Sidebar'
import UserTable from './mianpart'
import UpperSide from './upperDashbaord'
import Left from './notification'

function page() {
  return (
    <div className='flex gap-3 bg-gray-50'>
      <SideBar />
      <div className='flex flex-col gap-3 w-full '>
        <Header />
        <div className='flex gap-3'>
          <div className=' flex flex-col gap-3'>
          <UpperSide />
          <UserTable />

          </div>
          <Left />
        </div>
        
      </div>
    </div>
  )
}

export default page

"use client"

import React from 'react'
import Header from '../../../components/Header'
import SideBar from '../../../components/Sidebar'
import Content from '../../Work experience/page'


function page() {
  return (
    <div className='flex gap-3 bg-gray-50'>
      <SideBar />
      <div className='flex flex-col gap-3 w-screen '>
        <Header />
        <div className='flex gap-3 w-full'>
          <Content />
        </div>
      </div>
    </div>
  )
}

export default page

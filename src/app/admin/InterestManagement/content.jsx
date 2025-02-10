"use client"
// import React from 'react'
import React, { useState } from 'react'

// import UpperSide from '../../../components/upperDashbaord'
import TableSideBar from '../../../components/TableSideBar'
import DisplayTable from '../../../components/displayTable'


function content() {

  const data = [
    { id: 1, label: "Total user", value: "8,456", bgColor: "bg-purple-100", icon: "👤" },
    { id: 2, label: "Subscribed User", value: "4,590", bgColor: "bg-red-100", icon: "📊" },
    { id: 3, label: "Unsubscribed User", value: "3,866", bgColor: "bg-yellow-100", icon: "📄" },
    { id: 4, label: "Active domains", value: "5,455", bgColor: "bg-green-100", icon: "🔑" },
  ];

  const tableData = [
    {
      title: "Photography",
      createdDate: "26/02/2024",
      lastUpdated: "27/02/2024",
    },
    {
      title: "Traveling",
      createdDate: "26/02/2024",
      lastUpdated: "27/02/2024",
    },
    {
      title: "Cooking",
      createdDate: "26/02/2024",
      lastUpdated: "27/02/2024",
    },
    {
      title: "Reading",
      createdDate: "26/02/2024",
      lastUpdated: "27/02/2024",
    },
  ];

  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className='flex flex-col gap-3 w-full h-full'>
        {/* <UpperSide title="Degree" data={data} click={toggleSidebar} isOpen={isOpen} btnText="Add Degree" /> */}
        {/* <TableSideBar title="Interest" namePlaceholder='Enter Interest' dis="lorem ipsum has been the industry's standard." subTitle="Interest" click={toggleSidebar} isOpen={isOpen} />
        <DisplayTable link="/admin/profile-management" click={toggleSidebar} isOpen={isOpen} title="Interest" btnText="Add Interest" array={tableData} col1_Title="Interest" col2_Title="Created Date" col3_Title="Last Updated" /> */}
      </div>
    </>

  )
}

export default content
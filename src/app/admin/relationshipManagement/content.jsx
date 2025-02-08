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
      title: "Business Partner",
      createdDate: "26/02/2024",
      lastUpdated: "27/02/2024",
    },
    {
      title: "Supplier",
      createdDate: "26/02/2024",
      lastUpdated: "27/02/2024",
    },
    {
      title: "Customer",
      createdDate: "26/02/2024",
      lastUpdated: "27/02/2024",
    },
    {
      title: "Affiliate",
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
        {/* <UpperSide title="Relationship" data={data} click={toggleSidebar} isOpen={isOpen} btnText="Add Relationship" /> */}
        <TableSideBar
          isOpen={isOpen}
          click={toggleSidebar}
          title="Relationship"
          dis="lorem ipsum has been the industry's standard."
          subTitle="Relationship Name *"
          namePlaceholder="Enter relationship name"
          saveButtonText="Add Relationship"
          updateButtonText="Update Relationship"
          type="relationship"
        />
        <DisplayTable  click={toggleSidebar} isOpen={isOpen} btnText="Add Relationship" title="Relationship" array={tableData} col1_Title="Relationship" col2_Title="Created Date" col3_Title="Last Updated" />
      </div>
    </>
  )
}

export default content
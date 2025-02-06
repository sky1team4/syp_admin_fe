"use client"
// import React from 'react'
import React, { useState } from 'react'

import TableSideBar from '../../../components/TableSideBar'
import DisplayTable from '../../../components/displayTable'


function content() {

  const data = [
    { id: 1, label: "Total user", value: "8,456", bgColor: "bg-purple-100", icon: "👤" },
    { id: 2, label: "Subscribed User", value: "4,590", bgColor: "bg-red-100", icon: "📊" },
    { id: 3, label: "Unsubscribed User", value: "3,866", bgColor: "bg-yellow-100", icon: "📄" },
    { id: 4, label: "Active domains", value: "5,455", bgColor: "bg-green-100", icon: "🔑" },
  ];

  // const tableData = [
  //   {
  //     title: "Monthly Subscription",
  //     createdDate: "26/02/2024",
  //     lastUpdated: "27/02/2024",
  //   },
  //   {
  //     title: "Professional Subscription",
  //     createdDate: "26/02/2024",
  //     lastUpdated: "27/02/2024",
  //   },
  //   {
  //     title: "Special Subscription",
  //     createdDate: "26/02/2024",
  //     lastUpdated: "27/02/2024",
  //   },
  //   {
  //     title: "Annual Subscription",
  //     createdDate: "26/02/2024",
  //     lastUpdated: "27/02/2024",
  //   },
  // ];

  const tableData = [
    {
      title: "Tech Innovators Inc.",
      createdDate: "01/01/2023",
      lastUpdated: "15/01/2023",
    },
    {
      title: "Green Solutions Ltd.",
      createdDate: "05/02/2023",
      lastUpdated: "20/02/2023",
    },
    {
      title: "HealthCare Partners",
      createdDate: "10/03/2023",
      lastUpdated: "25/03/2023",
    },
    {
      title: "Finance Experts LLC",
      createdDate: "15/04/2023",
      lastUpdated: "30/04/2023",
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
        <TableSideBar title="Company Name" namePlaceholder='Enter Company name' dis="lorem ipsum has been the industry's standard." subTitle="Company Name" click={toggleSidebar} isOpen={isOpen} />
        <DisplayTable link="/admin/work-experience" click={toggleSidebar} isOpen={isOpen} btnText="Add Company" title="Company Name" array={tableData} col1_Title="Company Name" col2_Title="Created Date" col3_Title="Last Updated" />
      </div>
    </>
  )
}

export default content
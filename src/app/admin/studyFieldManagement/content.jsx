"use client"
// import React from 'react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'; // Import useSelector from react-redux

// import UpperSide from '../../../components/upperDashbaord'
import TableSideBar from '../../../components/TableSideBar'
import DisplayTable from '../../../components/displayTable'


function content() {

  const data = useSelector((state) => state.data); // Get data from Redux store
  console.log(data);
  const tableData = useSelector((state) => state.tableData) || []; // Provide a default empty array

  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className='flex flex-col gap-3 w-full h-full'>
        {/* <UpperSide title="Degree" data={data} click={toggleSidebar} isOpen={isOpen} btnText="Add Degree" /> */}
        <TableSideBar title="Field of Study" namePlaceholder='Enter Field of Study' dis="lorem ipsum has been the industry's standard." subTitle="Field of Study" click={toggleSidebar} isOpen={isOpen} />
        <DisplayTable link="/admin/education-management" click={toggleSidebar} isOpen={isOpen} btnText="Add Field Study" title="Field of Study" array={tableData} col1_Title="Field of Study" col2_Title="Created Date" col3_Title="Last Updated" />
      </div>
    </>
  )
}

export default content
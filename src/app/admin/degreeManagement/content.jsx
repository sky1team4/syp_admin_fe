"use client"
// import React from 'react'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchDegrees } from '@/redux/features/degreeSLice'
import TableSideBar from '../../../components/TableSideBar'
import DisplayTable from '../../../components/displayTable'


function content() {
  const dispatch = useDispatch()
  const degrees = useSelector((state) => state.degrees) || [];
  console.log(degrees);
  

  useEffect(() => {
    dispatch(fetchDegrees())
  }, [dispatch])

  const tableData = degrees.map(degree => ({
    title: degree.title,
    createdDate: degree.createdDate,
    lastUpdated: degree.lastUpdated,
  }));

  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className='flex flex-col gap-3 w-full h-full'>
        {/* <UpperSide title="Degree" data={data} click={toggleSidebar} isOpen={isOpen} btnText="Add Degree" /> */}
        <TableSideBar title="Degree" namePlaceholder="Enter Degree name" dis="lorem ipsum has been the industry's standard." subTitle="Degree" click={toggleSidebar} isOpen={isOpen} />
        <DisplayTable link="/admin/education-management" click={toggleSidebar} isOpen={isOpen} btnText="Add Degree" title="Degree" array={tableData} col1_Title="Degree" col2_Title="Created Date" col3_Title="Last Updated" />
      </div>
    </>

  )
}

export default content
"use client"
// import React from 'react'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector from react-redux
import { fetchFieldOfStudy, saveFieldOfStudy } from '@/redux/features/fieldofstudySlice';

// import UpperSide from '../../../components/upperDashbaord'
import TableSideBar from '../../../components/TableSideBar'
import DisplayTable from '../../../components/displayTable'

function Content() {
  
  const dispatch = useDispatch();
  // Changed the selector to correctly access the state
  const { items: fetchFieldOfStudies, isLoading, error } = useSelector((state) => state.fieldofstudy); // Ensure correct state path
  console.log(fetchFieldOfStudy);
  // const tableData = fetchFieldOfStudies || []; // Ensure tableData is an array
  // console.log('Table Data:', tableData);
  
  useEffect(() => {
    dispatch(fetchFieldOfStudy()); // Ensure correct action is dispatched
  }, [dispatch]);

  useEffect(() => {
    console.log('field of study:', fetchFieldOfStudies); // Debugging: Log the relationships data
  }, [fetchFieldOfStudies]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='flex flex-col gap-3 w-full h-full'>
      <TableSideBar 
        title="Field of Study"
        namePlaceholder="Enter Field of Study"
        dis="lorem ipsum has been the industry's standard"
        subTitle="Add Field of Study"
        click={toggleSidebar}
        isOpen={isOpen} 
      />
      <DisplayTable
        title="Field of Study"
        link="/admin/education-management"
        click={toggleSidebar}
        isOpen={isOpen}
        btnText="Add Study Field"
        array={fetchFieldOfStudies}
        col1_Title="Field of Study"
        col2_Title="Created Date"
        col3_Title="Last Updated"
      />
    </div>
  );
}

export default Content
"use client"
// import React from 'react'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector from react-redux
import { fetchFieldOfStudy } from '../../../redux/features/fieldofstudySlice';

// import UpperSide from '../../../components/upperDashbaord'
import TableSideBar from '../../../components/TableSideBar'
import DisplayTable from '../../../components/displayTable'

function Content({ title, namePlaceholder, link, btnText, dataSelector, tableDataSelector }) {
  const dispatch = useDispatch();
  const data = useSelector(dataSelector);
  const tableData = useSelector(tableDataSelector) || [];
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchFieldOfStudy());
  }, [dispatch]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='flex flex-col gap-3 w-full h-full'>
      <TableSideBar title={title} namePlaceholder={namePlaceholder} dis="lorem ipsum has been the industry's standard." subTitle={title} click={toggleSidebar} isOpen={isOpen} />
      <DisplayTable link={link} click={toggleSidebar} isOpen={isOpen} btnText={btnText} title={title} array={tableData} col1_Title={title} col2_Title="Created Date" col3_Title="Last Updated" />
    </div>
  );
}

export default Content
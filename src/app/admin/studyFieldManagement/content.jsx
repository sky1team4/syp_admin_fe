"use client"
// import React from 'react'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector from react-redux
import { fetchFieldOfStudy, saveFieldOfStudy, updateFieldOfStudy, deleteFieldOfStudy } from '../../../redux/features/fieldofstudySlice';

// import UpperSide from '../../../components/upperDashbaord'
import TableSideBar from '../../../components/TableSideBar'
import DisplayTable from '../../../components/displayTable'

function Content() {

  const dispatch = useDispatch();
  const { items: fetchFieldOfStudies, isLoading, error } = useSelector((state) => {
    console.log('State:', state.fetchFieldOfStudies ); // Debugging: Log the entire state
    return state.fetchFieldOfStudies || { items: [], isLoading: false, error: null };
  });

  useEffect(() => {
    dispatch(fetchFieldOfStudies());
  }, [dispatch]);

  useEffect(() => {
    console.log('Relationships:', fetchFieldOfStudies); // Debugging: Log the relationships data
  }, [fetchFieldOfStudies]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className='flex flex-col gap-3 w-full h-full'>
        {/* <UpperSide title="Degree" data={data} click={toggleSidebar} isOpen={isOpen} btnText="Add Degree" /> */}
          {/* {isLoading && <p>Loading field of study...</p>}
          {error && <p>Error loading field of study: {error}</p>} */}
        {/* <TableSideBar
          // title="Field Of Study"
          dis="lorem ipsum has been the industry's standard."
          subTitle="Field Of Study Name"
          namePlaceholder="Enter Field of Study"
          saveButtonText="Add Field Of Study"
          updateButtonText="Update Field Of Study" // Pass the fetched data
          // isLoading={isLoading} // Pass loading state
          // error={error}
        
          save={saveFieldOfStudy} // Pass save function
          update={updateFieldOfStudy} // Pass update function
          delete={deleteFieldOfStudy} // Pass delete function
        />
        <DisplayTable 
            click={toggleSidebar}
            isOpen={isOpen}
            btnText="Add Field Of Study"
            // title="Field Of Study"
            array={fetchFieldOfStudy}
            col1_Title="Field Of Study"
            col2_Title="Created Date"
            col3_Title="Last Updated" 
          /> */}
      </div>
    </>
  )
}

export default Content
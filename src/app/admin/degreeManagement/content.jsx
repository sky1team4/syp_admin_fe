"use client"
// import React from 'react'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDegrees, saveDegree, updateDegree, deleteDegree } from '../../../redux/features/degreeSlice.js'
import TableSideBar from '../../../components/TableSideBar'
import DisplayTable from '../../../components/displayTable'
import { toast } from 'react-hot-toast'

// import UpperSide from '../../../components/upperDashbaord'
// import SubscriptionSideBar from '../../../components/SubscriptionSideBar'

function Content() {
  const dispatch = useDispatch();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const { items: degrees, isLoading, error } = useSelector((state) => state.degree || { items: [], isLoading: false, error: null });
  console.log('Degrees for table:', degrees);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsDataLoaded(false);
        const result = await dispatch(fetchDegrees()).unwrap();
        console.log('Fetch result:', result);

        // Update the Redux state directly if needed
        dispatch({
          type: 'degree/setDegrees',
          payload: result
        });

        setIsDataLoaded(true);
      } catch (error) {
        console.error('Error fetching degrees:', error);
        toast.error('Failed to load degrees');
        setIsDataLoaded(true);
      }
    };
    fetchData();
  }, [dispatch]);

  // Add a useEffect to log whenever degrees changes
  useEffect(() => {
    console.log('Degrees updated in state:', degrees);
  }, [degrees]);

  // Add more detailed logging for the formatted degrees
  const formattedDegrees = degrees?.map(degree => {
    const formatted = {
      ...degree,
      createdDate: new Date(degree.createTime).toLocaleDateString(),
      lastUpdated: new Date(degree.updateTime).toLocaleDateString()
    };
    console.log('Formatting degree:', degree, 'to:', formatted);
    return formatted;
  });

  console.log('Final formatted degrees:', formattedDegrees);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [mode, setMode] = useState('create');

  const toggleSidebar = (mode = 'create') => {
    if (!isOpen) {
      setMode(mode);
    } else {
      setSelectedItem(null);
      setMode('create');
    }
    setIsOpen(!isOpen);
  };

  const handleEdit = (item) => {
    setSelectedItem({
      id: item.id,
      title: item.name,
      status: item.status,
      educationId: item.educationId
    });
    toggleSidebar('edit');
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteDegree(id));
      toast.success('Degree deleted successfully');
    } catch (error) {
      toast.error('Failed to delete degree');
    }
  };

  // Show loading state while data is being fetched
  // if (!isDataLoaded || isLoading) {
  //   return (
  //     <div className='flex flex-col gap-3 w-full h-full items-center justify-center'>
  //       <p>Loading degrees...</p>
  //     </div>
  //   );
  // }

  // Show error state if there's an error
  if (error) {
    return (
      <div className='flex flex-col gap-4 w-full h-full items-center justify-center p-8'>
        <div className='text-red-500'>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className='text-xl font-semibold text-gray-800'>Failed to Load Degrees</h3>
        <p className='text-gray-600 text-center max-w-md'>
          {error?.message || 'An unexpected error occurred while loading the degrees.'}
        </p>
        <button 
          onClick={() => dispatch(fetchDegrees())}
          className='mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3 w-full h-full'>
      <TableSideBar
        isOpen={isOpen}
        click={toggleSidebar}
        mode={mode}
        selectedItem={selectedItem}
        title="Degree"
        dis="Manage degree records efficiently."
        subTitle="Degree Name *"
        namePlaceholder="Enter degree name"
        saveButtonText="Add Degree"
        updateButtonText="Update Degree"
        type="degree"
        fetchData={fetchDegrees}
        saveData={saveDegree}
        updateData={updateDegree}
      />

      <DisplayTable
        click={() => toggleSidebar('create')}
        isOpen={isOpen}
        btnText="Add Degree"
        title="Degree"
        link="/admin/education-management"
        array={formattedDegrees}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default Content
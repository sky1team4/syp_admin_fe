"use client"
// import React from 'react'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchInterests, saveInterest, updateInterest, deleteInterest } from '../../../redux/features/interestSlice'
import TableSideBar from '../../../components/TableSideBar'
import DisplayTable from '../../../components/displayTable'
import { toast } from 'react-hot-toast'

// import UpperSide from '../../../components/upperDashbaord'

function Content() {
  const dispatch = useDispatch();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const { items: interests, isLoading, error } = useSelector((state) => {
    console.log('Full Redux State:', state);
    return state.interest || { items: [], isLoading: false, error: null };
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsDataLoaded(false);
        await dispatch(fetchInterests()).unwrap();
        setIsDataLoaded(true);
      } catch (error) {
        console.error('Error fetching interests:', error);
        toast.error('Failed to load interests');
        setIsDataLoaded(true);
      }
    };
    fetchData();
  }, [dispatch]);

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
      await dispatch(deleteInterest(id));
      toast.success('Interest deleted successfully');
    } catch (error) {
      toast.error('Failed to delete interest');
    }
  };

  // Format dates for display
  const formattedInterests = interests?.map(interest => ({
    ...interest,
    createdDate: new Date(interest.createDate).toLocaleDateString(),
    lastUpdated: new Date(interest.updateDate).toLocaleDateString()
  }));

  // Show loading state while data is being fetched
  // if (!isDataLoaded || isLoading) {
  //   return (
  //     <div className='flex flex-col gap-3 w-full h-full items-center justify-center'>
  //       <p>Loading interests...</p>
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
        <h3 className='text-xl font-semibold text-gray-800'>Failed to Load Interests</h3>
        <p className='text-gray-600 text-center max-w-md'>
          {error?.message || 'An unexpected error occurred while loading the interests.'}
        </p>
        <button 
          onClick={() => dispatch(fetchInterests())}
          className='mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3 w-full h-full'>
      {/* <UpperSide title="Degree" data={data} click={toggleSidebar} isOpen={isOpen} btnText="Add Degree" /> */}
      <TableSideBar
        isOpen={isOpen}
        click={toggleSidebar}
        mode={mode}
        selectedItem={selectedItem}
        title="Interest"
        dis="Manage interest records efficiently."
        subTitle="Interest Name *"
        namePlaceholder="Enter interest name"
        type="interest"
        fetchData={fetchInterests}
        saveData={saveInterest}
        updateData={updateInterest}
        onSuccess={() => {
          toast.success(mode === 'create' ? 'Interest created successfully' : 'Interest updated successfully');
          toggleSidebar();
        }}
        onError={(error) => {
          toast.error(error || 'Operation failed');
        }}
      />

      <DisplayTable
        click={() => toggleSidebar('create')}
        isOpen={isOpen}
        btnText="Add Interest"
        title="Interest"
        link="/admin/profile-management"
        array={formattedInterests}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  )
}

export default Content
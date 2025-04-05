"use client"
// import React from 'react'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSpecialties, saveSpecialty, updateSpecialty, deleteSpecialty, setSpecialties } from '../../../redux/features/specialitySlice'
import TableSideBar from '../../../components/TableSideBar'
import DisplayTable from '../../../components/displayTable'
import { toast } from 'react-hot-toast'

// import UpperSide from '../../../components/upperDashbaord'

function Content() {
  const dispatch = useDispatch();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const { items: specialties, isLoading, error } = useSelector((state) => {
    console.log('Full Redux State:', state);  // Debug log
    return state.specialty || { items: [], isLoading: false, error: null };
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsDataLoaded(false);
        const result = await dispatch(fetchSpecialties()).unwrap();
        console.log('Raw API result:', result);
        
        // Explicitly set the specialties in the state
        dispatch(setSpecialties(result));
        
        setIsDataLoaded(true);
      } catch (error) {
        console.error('Error fetching specialties:', error);
        toast.error('Failed to load specialties');
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
      await dispatch(deleteSpecialty(id));
      toast.success('Specialty deleted successfully');
    } catch (error) {
      toast.error('Failed to delete specialty');
    }
  };

  // Format dates for display - update to match the API response fields
  const formattedSpecialties = specialties?.map(specialty => ({
    ...specialty,
    createdDate: new Date(specialty.createDateTime).toLocaleDateString(),  // Note: changed from createTime
    lastUpdated: new Date(specialty.updateDateTime).toLocaleDateString()   // Note: changed from updateTime
  }));

  console.log('Formatted Specialties:', formattedSpecialties);  // Debug log

  // Show loading state while data is being fetched
  // if (!isDataLoaded || isLoading) {
  //   return (
  //     <div className='flex flex-col gap-3 w-full h-full items-center justify-center'>
  //       <p>Loading specialties...</p>
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
        <h3 className='text-xl font-semibold text-gray-800'>Failed to Load Specialties</h3>
        <p className='text-gray-600 text-center max-w-md'>
          {error?.message || 'An unexpected error occurred while loading the specialties.'}
        </p>
        <button 
          onClick={() => dispatch(fetchSpecialties())}
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
        title="Specialty"
        dis="Manage specialty records efficiently."
        subTitle="Specialty Name *"
        namePlaceholder="Enter specialty name"
        saveButtonText="Add Specialty"
        updateButtonText="Update Specialty"
        type="specialty"
        fetchData={fetchSpecialties}
        saveData={saveSpecialty}
        updateData={updateSpecialty}
      />

      <DisplayTable
        click={() => toggleSidebar('create')}
        isOpen={isOpen}
        btnText="Add Specialty"
        title="Specialty"
        array={formattedSpecialties}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        type="specialty"
      />
    </div>
  );
}

export default Content
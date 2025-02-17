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
  if (!isDataLoaded || isLoading) {
    return (
      <div className='flex flex-col gap-3 w-full h-full items-center justify-center'>
        <p>Loading degrees...</p>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className='flex flex-col gap-3 w-full h-full items-center justify-center'>
        <p>Error loading degrees: {error}</p>
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
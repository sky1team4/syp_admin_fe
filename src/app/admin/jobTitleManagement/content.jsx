"use client"
// import React from 'react'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchJobTitles, saveJobTitle, updateJobTitle, deleteJobTitle } from '../../../redux/features/jobTitleSlice'
import TableSideBar from '../../../components/TableSideBar'
import DisplayTable from '../../../components/displayTable'
import { toast } from 'react-hot-toast'

// import UpperSide from '../../../components/upperDashbaord'

function Content() {
  const dispatch = useDispatch();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const { items: jobTitles, isLoading, error } = useSelector((state) => {
    console.log('Full Redux State:', state);
    return state.jobTitle || { items: [], isLoading: false, error: null };
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsDataLoaded(false);
        await dispatch(fetchJobTitles()).unwrap();
        setIsDataLoaded(true);
      } catch (error) {
        console.error('Error fetching job titles:', error);
        toast.error('Failed to load job titles');
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
      status: item.status
    });
    toggleSidebar('edit');
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteJobTitle(id)).unwrap();
      toast.success('Job title deleted successfully');
    } catch (error) {
      toast.error('Failed to delete job title');
    }
  };

  // Format dates for display
  const formattedJobTitles = jobTitles?.map(jobTitle => ({
    ...jobTitle,
    createdDate: new Date(jobTitle.createDateTime).toLocaleDateString(),
    lastUpdated: new Date(jobTitle.updateDateTime).toLocaleDateString()
  }));

  if (!isDataLoaded || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex flex-col gap-3 w-full h-full'>
      {/* <UpperSide title="Degree" data={data} click={toggleSidebar} isOpen={isOpen} btnText="Add Degree" /> */}
      <TableSideBar
        isOpen={isOpen}
        click={toggleSidebar}
        mode={mode}
        selectedItem={selectedItem}
        title="Job Title"
        dis="Manage job titles efficiently."
        subTitle="Job Title *"
        namePlaceholder="Enter job title"
        type="jobTitle"
        fetchData={fetchJobTitles}
        saveData={saveJobTitle}
        updateData={updateJobTitle}
      />

      <DisplayTable
        click={() => toggleSidebar('create')}
        isOpen={isOpen}
        btnText="Add Job Title"
        title="Job Title"
        link="/admin/work-experience"
        array={formattedJobTitles}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        columnTitles={[
          { header: "Job Title", accessorKey: "name" },
          { header: "Created Date", accessorKey: "createdDate" },
          { header: "Last Updated", accessorKey: "lastUpdated" }
        ]}
      />
    </div>
  )
}

export default Content
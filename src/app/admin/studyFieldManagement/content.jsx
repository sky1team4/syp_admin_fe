"use client"
// import React from 'react'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFieldOfStudy, saveFieldOfStudy, updateFieldOfStudy, deleteFieldOfStudy } from '../../../redux/features/fieldofstudySlice'
import TableSideBar from '../../../components/TableSideBar'
import DisplayTable from '../../../components/displayTable'
import { toast } from 'react-hot-toast'

// import UpperSide from '../../../components/upperDashbaord'

function Content() {
  const dispatch = useDispatch();
  const { items: fieldOfStudies, isLoading, error } = useSelector((state) => state.fieldofstudy || { items: [], isLoading: false, error: null });

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchFieldOfStudy());
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
      await dispatch(deleteFieldOfStudy(id));
      toast.success('Field of Study deleted successfully');
    } catch (error) {
      toast.error('Failed to delete Field of Study');
    }
  };

  return (
    <div className='flex flex-col gap-3 w-full h-full'>
      {isLoading && <p>Loading field of studies...</p>}
      {error && <p>Error loading field of studies: {error}</p>}
      
      <TableSideBar
        isOpen={isOpen}
        click={toggleSidebar}
        mode={mode}
        selectedItem={selectedItem}
        title="Field of Study"
        dis="Manage field of study records efficiently."
        subTitle="Field of Study Name *"
        namePlaceholder="Enter field of study name"
        saveButtonText="Add Field of Study"
        updateButtonText="Update Field of Study"
        type="fieldofstudy"
        fetchData={fetchFieldOfStudy}
        saveData={saveFieldOfStudy}
        updateData={updateFieldOfStudy}
      />
      <DisplayTable
        title="Field of Study"
        link="/admin/education-management"
        click={toggleSidebar}
        isOpen={isOpen}
        btnText="Add Study Field"
        array={fieldOfStudies}
        col1_Title="Field of Study"
        col2_Title="Created Date"
        col3_Title="Last Updated"
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default Content
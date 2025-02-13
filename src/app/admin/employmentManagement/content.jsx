"use client"
// import React from 'react'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEmployees, saveEmployee, updateEmployee, deleteEmployee } from '../../../redux/features/employeeSlice'
import TableSideBar from '../../../components/TableSideBar'
import DisplayTable from '../../../components/displayTable'
import { toast } from 'react-hot-toast'

// import UpperSide from '../../../components/upperDashbaord'

function Content() {
  const dispatch = useDispatch();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const { items: employees, isLoading, error } = useSelector((state) => {
    console.log('Full Redux State:', state);
    return state.employee || { items: [], isLoading: false, error: null };
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsDataLoaded(false);
        await dispatch(fetchEmployees()).unwrap();
        setIsDataLoaded(true);
      } catch (error) {
        console.error('Error fetching employees:', error);
        toast.error('Failed to load employees');
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
      await dispatch(deleteEmployee(id)).unwrap();
      toast.success('Employee status deleted successfully');
    } catch (error) {
      toast.error('Failed to delete employee status');
    }
  };

  // Format dates for display
  const formattedEmployees = employees?.map(employee => ({
    ...employee,
    createdDate: new Date(employee.createDateTime).toLocaleDateString(),
    lastUpdated: new Date(employee.updateDateTime).toLocaleDateString()
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
        title="Employment"
        dis="Manage employment status records efficiently."
        subTitle="Employment Status *"
        namePlaceholder="Enter employment status"
        type="employee"
        fetchData={fetchEmployees}
        saveData={saveEmployee}
        updateData={updateEmployee}
      />

      <DisplayTable
        click={() => toggleSidebar('create')}
        isOpen={isOpen}
        btnText="Add Employment"
        link="/admin/work-experience"
        title="Employment Status Management"
        array={formattedEmployees}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        columnTitles={[
          { header: "Employment", accessorKey: "name" },
          { header: "Created Date", accessorKey: "createdDate" },
          { header: "Last Updated", accessorKey: "lastUpdated" }
        ]}
      />
    </div>
  );
}

export default Content;
"use client"
// import React from 'react'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCompanies, saveCompany, updateCompany, deleteCompany } from '../../../redux/features/companyNameSlice'
import TableSideBar from '../../../components/TableSideBar'
import DisplayTable from '../../../components/displayTable'
import { toast } from 'react-hot-toast'

function Content() {
  const dispatch = useDispatch();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const { items: companies, isLoading, error } = useSelector((state) => {
    console.log('Full Redux State:', state);
    console.log('Company State:', state.companyName);
    return state.companyName || { items: [], isLoading: false, error: null };
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsDataLoaded(false);
        const response = await dispatch(fetchCompanies()).unwrap();
        console.log('Fetched Data:', response);
        setIsDataLoaded(true);
      } catch (error) {
        console.error('Error fetching companies:', error);
        toast.error('Failed to load companies');
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
      await dispatch(deleteCompany(id)).unwrap();
      toast.success('Company deleted successfully');
    } catch (error) {
      toast.error('Failed to delete company');
    }
  };

  const formattedCompanies = companies ? companies.map(company => ({
    ...company,
    createdDate: new Date(company.createDateTime).toLocaleDateString(),
    lastUpdated: new Date(company.updateDateTime).toLocaleDateString()
  })) : [];

  // if (!isDataLoaded || isLoading) {
  //   return <div>Loading...</div>;
  // }

  console.log('Formatted Companies:', formattedCompanies);
  

  return (
    <div className='flex flex-col gap-3 w-full h-full'>
      <TableSideBar
        isOpen={isOpen}
        click={toggleSidebar}
        mode={mode}
        selectedItem={selectedItem}
        title="Company Name"
        dis="Manage company names efficiently."
        subTitle="Company Name *"
        namePlaceholder="Enter company name"
        type="company"
        fetchData={fetchCompanies}
        saveData={saveCompany}
        updateData={updateCompany}
      />

      <DisplayTable
        click={() => toggleSidebar('create')}
        isOpen={isOpen}
        btnText="Add Company"
        title="Company Name"
        link="/admin/work-experience"
        array={formattedCompanies}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        columnTitles={[
          { header: "Company Name", accessorKey: "name" },
          { header: "Created Date", accessorKey: "createdDate" },
          { header: "Last Updated", accessorKey: "lastUpdated" }
        ]}
      />
    </div>
  );
}

export default Content; 
"use client"
// import React from 'react'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFaqCategories, saveFaqCategory, updateFaqCategory, deleteFaqCategory } from '../../../../redux/features/faqCateSlice'
import TableSideBar from '../../../../components/TableSideBar'
import DisplayTable from '../../../../components/displayTable'
import { toast } from 'react-hot-toast'

function Content() {
  const dispatch = useDispatch();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const { items: faqCategories, isLoading, error } = useSelector((state) => {
    console.log('Full Redux State:', state);
    console.log('FAQ Category State:', state.faqCategory);
    return state.faqCategory || { items: [], isLoading: false, error: null };
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsDataLoaded(false);
        const response = await dispatch(fetchFaqCategories()).unwrap();
        // console.log('Fetched Data:', response);
        setIsDataLoaded(true);
      } catch (error) {
        // console.error('Error fetching FAQ categories:', error);
        toast.error('Failed to load FAQ categories');
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
      await dispatch(deleteFaqCategory(id)).unwrap();
      toast.success('FAQ category deleted successfully');
    } catch (error) {
      toast.error('Failed to delete FAQ category');
    }
  };

  // Format dates for display
  const formattedFaqCategories = faqCategories ? faqCategories.map(category => ({
    ...category,
    createdDate: new Date(category.createDate).toLocaleDateString(),
    lastUpdated: new Date(category.updateDate).toLocaleDateString()
  })) : [];

  if (!isDataLoaded || isLoading) {
    return <div>Loading...</div>;
  }

  console.log('Formatted FAQ Categories:', formattedFaqCategories);

  return (
    <div className='flex flex-col gap-3 w-full h-full'>
      <TableSideBar
        isOpen={isOpen}
        click={toggleSidebar}
        mode={mode}
        selectedItem={selectedItem}
        title="FAQ Category"
        dis="Manage FAQ categories efficiently."
        subTitle="FAQ Category *"
        namePlaceholder="Enter FAQ category"
        type="faqCategory"
        fetchData={fetchFaqCategories}
        saveData={saveFaqCategory}
        updateData={updateFaqCategory}
      />

      <DisplayTable
        click={() => toggleSidebar('create')}
        isOpen={isOpen}
        btnText="Add FAQ"
        title="FAQ Category"
        link="/admin/FAQ"
        array={formattedFaqCategories}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        columnTitles={[
          { header: "Q&A Category", accessorKey: "name" },
          { header: "Created Date", accessorKey: "createdDate" },
          { header: "Last Updated", accessorKey: "lastUpdated" }
        ]}
      />
    </div>
  );
}

export default Content;
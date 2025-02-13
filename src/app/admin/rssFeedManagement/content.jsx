"use client"
// import React from 'react'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRssFeeds, saveRssFeed, updateRssFeed, deleteRssFeed } from '../../../redux/features/rssFeedSlice'
import TableSideBar from '../../../components/TableSideBar'
import DisplayTable from '../../../components/displayTable'
import { toast } from 'react-hot-toast'

// import UpperSide from '../../../components/upperDashbaord'

function Content() {
  const dispatch = useDispatch();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const { items: rssFeeds, isLoading, error } = useSelector((state) => {
    console.log('Full Redux State:', state);
    console.log('RSS Feed State:', state.rssFeed);
    return state.rssFeed || { items: [], isLoading: false, error: null };
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsDataLoaded(false);
        const response = await dispatch(fetchRssFeeds()).unwrap();
        console.log('Fetched Data:', response);
        setIsDataLoaded(true);
      } catch (error) {
        console.error('Error fetching RSS feeds:', error);
        toast.error('Failed to load RSS feeds');
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
      await dispatch(deleteRssFeed(id)).unwrap();
      toast.success('RSS feed deleted successfully');
    } catch (error) {
      toast.error('Failed to delete RSS feed');
    }
  };

  // Format dates for display
  const formattedRssFeeds = rssFeeds ? rssFeeds.map(rssFeed => ({
    ...rssFeed,
    createdDate: new Date(rssFeed.createDateTime).toLocaleDateString(),
    lastUpdated: new Date(rssFeed.updateDateTime).toLocaleDateString()
  })) : [];

  if (!isDataLoaded || isLoading) {
    return <div>Loading...</div>;
  }

  console.log('Formatted RSS Feeds:', formattedRssFeeds);

  return (
    <div className='flex flex-col gap-3 w-full h-full'>
      {/* <UpperSide title="Degree" data={data} click={toggleSidebar} isOpen={isOpen} btnText="Add Degree" /> */}
      <TableSideBar
        isOpen={isOpen}
        click={toggleSidebar}
        mode={mode}
        selectedItem={selectedItem}
        title="RSS Feed Category"
        dis="Manage RSS feed categories efficiently."
        subTitle="RSS Feed Category *"
        namePlaceholder="Enter RSS feed category"
        type="rssFeed"
        fetchData={fetchRssFeeds}
        saveData={saveRssFeed}
        updateData={updateRssFeed}
      />
      <DisplayTable
        click={() => toggleSidebar('create')}
        isOpen={isOpen}
        btnText="Add RSS Feed"
        title="RSS Feed Category"
        array={formattedRssFeeds}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        columnTitles={[
          { header: "RSS Feed Category", accessorKey: "name" },
          { header: "Created Date", accessorKey: "createdDate" },
          { header: "Last Updated", accessorKey: "lastUpdated" }
        ]}
      />
    </div>
  )
}

export default Content
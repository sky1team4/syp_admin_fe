// "use client"
// import React from 'react'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { saveSubscription, fetchSubscriptions } from '../../../redux/features/subscriptionSlice'

import UpperSide from '../../../components/upperDashbaord'
import SubscriptionSideBar from '../../../components/SubscriptionSideBar'
import DisplayTable from '../../../components/displayTable'


function content() {
  const dispatch = useDispatch();
  const { error, isLoading, subscriptions } = useSelector((state) => state.subscription);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [mode, setMode] = useState('create');

  const data = [
    { id: 1, label: "Total user", value: "8,456", bgColor: "bg-purple-100", icon: "/4box_1.svg" },
    { id: 2, label: "Subscribed User", value: "4,590", bgColor: "bg-red-100", icon: "/4box_2.svg" },
    { id: 3, label: "Unsubscribed User", value: "3,866", bgColor: "bg-yellow-100", icon: "/4box_3.svg" },
    { id: 4, label: "Active domains", value: "5,455", bgColor: "bg-green-100", icon: "/4box_4.svg" },
  ];

  useEffect(() => {
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  const handleEdit = (subscription) => {
    setSelectedSubscription({
      name: subscription.title,
      price: subscription.price,
      status: subscription.status || 'ACTIVE'
    });
    setMode('edit');
    setIsOpen(true);
  };

  // Transform subscriptions data to match table format
  const tableData = subscriptions.map(subscription => ({
    title: subscription.name,
    createdDate: new Date(subscription.createdAt).toLocaleDateString(),
    lastUpdated: new Date(subscription.updatedAt).toLocaleDateString(),
    price: subscription.price,
    status: subscription.status,
    onEdit: handleEdit
  }));

  const [isOpen, setIsOpen] = useState(false);
  
  const toggleSidebar = () => {
    if (!isOpen) {
      setMode('create');
      setSelectedSubscription(null);
    }
    setIsOpen(!isOpen);
  };

  const handleSubmitSubscription = async (formData) => {
    try {
      await dispatch(saveSubscription(formData)).unwrap();
      toggleSidebar();
      dispatch(fetchSubscriptions()); // Refresh the list after saving
    } catch (err) {
      console.error('Failed to save subscription:', err);
    }
  };

  return (
    <div className='flex flex-col w-full max-w-full overflow-x-hidden'>
      <div className='flex flex-col gap-3'>
        <UpperSide 
          title="Subscription" 
          data={data} 
          click={toggleSidebar} 
          isOpen={isOpen} 
          btnText="Add Subscrition" 
        />
        <SubscriptionSideBar 
          isOpen={isOpen}
          click={toggleSidebar}
          mode={mode}
          data={selectedSubscription}
        />
        <DisplayTable 
          title="Subscription" 
          array={tableData} 
          col1_Title="Subscription" 
          col2_Title="Created Date" 
          col3_Title="Last Updated" 
          isOpen={isOpen}
          click={toggleSidebar}
        />
      </div>
    </div>
  )
}

export default content
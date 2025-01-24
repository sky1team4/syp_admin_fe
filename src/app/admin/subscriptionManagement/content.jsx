// "use client"
// import React from 'react'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  saveSubscription, 
  fetchSubscriptions, 
  deleteSubscription,
  updateSubscription 
} from '../../../redux/features/subscriptionSlice'
import { toast } from 'react-hot-toast'

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

  const handleEdit = async (subscription) => {
    try {
      const formData = {
        name: subscription.name,
        price: subscription.price,
        status: subscription.status
      };
      
      await dispatch(updateSubscription({
        id: subscription.id,
        data: formData
      })).unwrap();
      
      toast.success('Subscription updated successfully');
      dispatch(fetchSubscriptions()); // Refresh the list
    } catch (err) {
      toast.error(err?.message || 'Failed to update subscription');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      try {
        await dispatch(deleteSubscription(id)).unwrap();
        toast.success('Subscription deleted successfully');
      } catch (err) {
        toast.error(err?.message || 'Failed to delete subscription');
      }
    }
  };

  // Transform subscriptions data to match table format
  const tableData = subscriptions.map(subscription => ({
    id: subscription.id,
    title: subscription.name || subscription.title,
    price: subscription.price,
    status: subscription.status,
    createdDate: new Date(subscription.createdAt).toLocaleDateString(),
    lastUpdated: new Date(subscription.updatedAt).toLocaleDateString(),
    onEdit: handleEdit,
    onDelete: handleDelete
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
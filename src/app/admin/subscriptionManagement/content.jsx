// "use client"
// import React from 'react'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { saveSubscription, fetchSubscriptions, deleteSubscription, updateSubscription } from '../../../redux/features/subscriptionSlice'
import { toast } from 'react-hot-toast'

import UpperSide from '../../../components/dashbaord_stats'
import SubscriptionSideBar from '../../../components/SubscriptionSideBar'
import DisplayTable from '../../../components/displayTable'


function content() {
  const dispatch = useDispatch();
  const { error, isLoading, subscriptions } = useSelector((state) => state.subscription);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [mode, setMode] = useState('create');


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
    } catch (err) {
      toast.error(err?.message || 'Failed to update subscription');
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteSubscription(id)).unwrap();
      toast.success('Subscription deleted successfully');
    } catch (err) {
      toast.error(err?.message || 'Failed to delete subscription');
    }
  };

  // Transform subscriptions data to match table format
  const tableData = subscriptions.map(subscription => ({
    id: subscription.id,
    name: subscription.name,
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
      // Log the formData to ensure it has the correct structure
      console.log('Submitting subscription with data:', formData);

      const { name, price, status } = formData; // Destructure formData
      await dispatch(saveSubscription({ name, price, status })).unwrap(); // Pass the correct structure
      toggleSidebar();
    } catch (err) {
      // Log the full error response for debugging
      console.error('Failed to save subscription:', err);
      toast.error(err?.message || 'Failed to save subscription'); // Update error message
    }
  };

  return (
    <div className='flex flex-col w-full max-w-full overflow-x-hidden'>
      <div className='flex flex-col gap-3'>
        <UpperSide
          title="Subscription"
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
          backBTN="no"
          // btnText="Add Subscription"
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
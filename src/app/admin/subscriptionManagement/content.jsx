// "use client"
// import React from 'react'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { saveSubscription, fetchSubscriptions, deleteSubscription, updateSubscription } from '../../../redux/features/subscriptionSlice'
import { toast } from 'react-hot-toast'

import UpperSide from '../../../components/subscription_stats'
import SubscriptionSideBar from '../../../components/SubscriptionSideBar'
import DisplayTable from '../../../components/subdisplayTable.jsx'

function content() {
  const dispatch = useDispatch();
  const { error, isLoading, subscriptions } = useSelector((state) => state.subscription);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [mode, setMode] = useState('create');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  // Transform subscriptions data to match table format and filter out deleted items
  const tableData = subscriptions
    .filter(subscription => !subscription.deletedAt) // Filter out deleted items
    .map(subscription => ({
      id: subscription.id,
      title: subscription.name,
      name: subscription.name,
      price: subscription.price,
      status: subscription.status,
      billingPeriod: subscription.billingPeriod || 'MONTHLY',
      createdDate: new Date(subscription.createdAt).toLocaleDateString(),
      lastUpdated: new Date(subscription.updatedAt).toLocaleDateString()
    }));

  const toggleSidebar = () => {
    if (!isOpen) {
      setMode('create');
      setSelectedSubscription(null);
    }
    setIsOpen(!isOpen);
  };

  const handleEdit = (subscription) => {
    setSelectedSubscription({
      id: subscription.id,
      name: subscription.name,
      price: subscription.price,
      status: subscription.status,
      billingPeriod: subscription.billingPeriod === 'YEARLY' ? 'ANNUAL' : subscription.billingPeriod
    });
    setMode('edit');
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      console.log('Attempting to delete subscription:', id); // Add debug log
      
      const result = await dispatch(deleteSubscription(id)).unwrap();
      
      if (result) {
        toast.success('Subscription deleted successfully');
        // Optionally refresh the list
        dispatch(fetchSubscriptions());
      }
    } catch (err) {
      console.error('Delete handler error:', err); // Add debug log
      console.error('Error details:', err?.response?.data || err); // Log additional error details
      toast.error(err?.message || 'Failed to delete subscription');
    }
  };

  const handleSubmitSubscription = async (formData) => {
    try {
      if (mode === 'edit' && selectedSubscription?.id) {
        console.log('Updating subscription with data:', formData); // Debug log
        
        await dispatch(updateSubscription({
          id: selectedSubscription.id,
          data: {
            name: formData.name?.trim(),
            price: parseFloat(formData.price),
            status: formData.status,
            billingPeriod: formData.billingPeriod // This should be 'ANNUAL' or 'MONTHLY'
          }
        })).unwrap();
        
        toast.success('Subscription updated successfully');
      } else {
        const subscriptionData = {
          name: formData.name?.trim(),
          price: parseFloat(formData.price),
          status: formData.status,
          billingPeriod: formData.billingPeriod
        };

        console.log('Submitting subscription data:', subscriptionData);

        await dispatch(saveSubscription(subscriptionData)).unwrap();
        toast.success('Subscription created successfully');
      }
      dispatch(fetchSubscriptions());
      toggleSidebar();
    } catch (err) {
      console.error('Submission error:', err);
      toast.error(err?.message || `Failed to ${mode === 'edit' ? 'update' : 'create'} subscription`);
    }
  };

  return (
    <div className='flex flex-col w-full max-w-full overflow-x-hidden'>
      <div className='flex flex-col gap-3'>
        <UpperSide
          title="Subscription"
          click={toggleSidebar}
          isOpen={isOpen}
          btnText="Add Subscription"
        />
        <SubscriptionSideBar
          isOpen={isOpen}
          click={toggleSidebar}
          mode={mode}
          data={selectedSubscription}
          onSubmit={handleSubmitSubscription}
        />
        <DisplayTable 
          title="Subscription" 
          array={tableData} 
          backBTN="no"
          col1_Title="Subscription" 
          col2_Title="Created Date" 
          col3_Title="Last Updated" 
          isOpen={isOpen}
          click={toggleSidebar}
          handleEdit={handleEdit}    // Pass handleEdit directly
          handleDelete={handleDelete} // Pass handleDelete directly
        />
      </div>
    </div>
  )
}

export default content
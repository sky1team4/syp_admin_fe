// "use client"
// import React from 'react'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { saveSubscription, fetchSubscriptions, deleteSubscription, updateSubscription } from '../../../redux/features/subscriptionSlice'
import { 
  createSubscriptionType, 
  fetchSubscriptionTypes, 
  deleteSubscriptionType, 
  updateSubscriptionType 
} from '../../../redux/features/subscriptionTypesSlice'
import { toast } from 'react-hot-toast'

import Subscription_stats from '../../../components/subscription_stats'
import SubscriptionTypeStats from '../../../components/subscriptionType_stats'
import SubscriptionSideBar from '../../../components/SubscriptionSideBar'
import SubscriptionTypeSideBar from '../../../components/SubscriptionTypeSideBar'
import DisplayTable from '../../../components/subdisplayTable.jsx'
import SubscriptionTypeDisplayTable from '../../../components/subscriptionTypeDisplayTable.jsx'

// Available modules for subscription types
const AVAILABLE_MODULES = [
  'user-management',
  'analytics', 
  'reporting',
  'api-access',
  'premium-support',
  'data-export',
  'custom-branding',
  'advanced-security',
  'multi-user-access',
  'priority-support'
];

function Content() {
  const dispatch = useDispatch();
  const { error, isLoading, subscriptions } = useSelector((state) => state.subscription);
  const { subscriptionTypes } = useSelector((state) => state.subscriptionTypes);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [selectedSubscriptionType, setSelectedSubscriptionType] = useState(null);
  const [mode, setMode] = useState('create');
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('subscriptions'); // 'subscriptions' or 'types'

  useEffect(() => {
    dispatch(fetchSubscriptions());
    dispatch(fetchSubscriptionTypes());
  }, [dispatch]);

  // Transform subscriptions data to match table format and filter out deleted items
  const subscriptionsTableData = subscriptions
    .filter(subscription => !subscription.deletedAt) // Filter out deleted items
    .map(subscription => {
      return {
        id: subscription.id,
        title: subscription.name,
        name: subscription.name,
        monthlyPrice: subscription.monthlyPrice,
        monthlyDiscount: subscription.monthlyDiscount || 0,
        yearlyDiscount: subscription.yearlyDiscount || 0,
        yearlyPrice: subscription.yearlyPrice,
        monthlyPriceWithDiscount: subscription.monthlyPriceWithDiscount,
        status: subscription.status,
        typeId: subscription.typeId || subscription.subscriptionType?.id,
        subscriptionType: subscription.subscriptionType?.name || 'No Type',
        createdDate: new Date(subscription.createdAt).toLocaleDateString(),
        lastUpdated: new Date(subscription.updatedAt).toLocaleDateString()
      };
    });

  // Transform subscription types data to match table format and filter out deleted items
  const subscriptionTypesTableData = subscriptionTypes
    .filter(subscriptionType => !subscriptionType.deleteDate) // Filter out deleted items
    .map(subscriptionType => ({
      id: subscriptionType.id,
      title: subscriptionType.name,
      name: subscriptionType.name,
      modules: subscriptionType.modules,
      status: subscriptionType.status,
      createdDate: new Date(subscriptionType.createDate).toLocaleDateString(),
      lastUpdated: new Date(subscriptionType.updateDate).toLocaleDateString()
    }));

  const toggleSidebar = () => {
    if (!isOpen) {
      setMode('create');
      setSelectedSubscription(null);
      setSelectedSubscriptionType(null);
    }
    setIsOpen(!isOpen);
  };

  const handleEdit = (subscription) => {
    setSelectedSubscription({
      id: subscription.id,
      name: subscription.name,
      monthlyPrice: subscription.monthlyPrice,
      monthlyDiscount: subscription.monthlyDiscount || 0,
      yearlyDiscount: subscription.yearlyDiscount || 0,
      status: subscription.status,
      typeId: subscription.typeId || subscription.subscriptionType?.id || ''
    });
    setMode('edit');
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      
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

  // Subscription Type handlers
  const handleEditSubscriptionType = (subscriptionType) => {
    setSelectedSubscriptionType({
      id: subscriptionType.id,
      name: subscriptionType.name,
      modules: subscriptionType.modules,
      status: subscriptionType.status
    });
    setMode('edit');
    setIsOpen(true);
  };

  const handleDeleteSubscriptionType = async (id) => {
    try {
      
      const result = await dispatch(deleteSubscriptionType(id)).unwrap();
      
      if (result) {
        toast.success('Subscription type deleted successfully');
        dispatch(fetchSubscriptionTypes());
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to delete subscription type');
    }
  };

  const handleSubmitSubscription = async (formData) => {
    try {
      if (mode === 'edit' && selectedSubscription?.id) {
        
        await dispatch(updateSubscription({
          id: selectedSubscription.id,
          data: {
            name: formData.name?.trim(),
            monthlyPrice: parseFloat(formData.monthlyPrice),
            monthlyDiscount: parseFloat(formData.monthlyDiscount) || 0,
            yearlyDiscount: parseFloat(formData.yearlyDiscount) || 0,
            status: formData.status,
            typeId: formData.typeId
          }
        })).unwrap();
        
        toast.success('Subscription updated successfully');
      } else {
        const subscriptionData = {
          name: formData.name?.trim(),
          monthlyPrice: parseFloat(formData.monthlyPrice),
          monthlyDiscount: parseFloat(formData.monthlyDiscount) || 0,
          yearlyDiscount: parseFloat(formData.yearlyDiscount) || 0,
          status: formData.status,
          typeId: formData.typeId
        };


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

  const handleSubmitSubscriptionType = async (formData) => {
    try {
      if (mode === 'edit' && selectedSubscriptionType?.id) {
        console.log('Updating subscription type with data:', formData);
        
        await dispatch(updateSubscriptionType({
          id: selectedSubscriptionType.id,
          data: {
            name: formData.name?.trim(),
            modules: formData.modules,
            status: formData.status
          }
        })).unwrap();
        
        toast.success('Subscription type updated successfully');
      } else {
        const subscriptionTypeData = {
          name: formData.name?.trim(),
          modules: formData.modules,
          status: formData.status
        };

        console.log('Submitting subscription type data:', subscriptionTypeData);

        await dispatch(createSubscriptionType(subscriptionTypeData)).unwrap();
        toast.success('Subscription type created successfully');
      }
      dispatch(fetchSubscriptionTypes());
      toggleSidebar();
    } catch (err) {
      console.error('Submission error:', err);
      toast.error(err?.message || `Failed to ${mode === 'edit' ? 'update' : 'create'} subscription type`);
    }
  };

  return (
    <div className='flex flex-col w-full max-w-full overflow-x-hidden'>
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'subscriptions'
              ? 'border-purple-500 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Subscriptions
        </button>
        <button
          onClick={() => setActiveTab('types')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'types'
              ? 'border-purple-500 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Subscription Types
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'subscriptions' && (
        <div className='flex flex-col gap-3'>
          <Subscription_stats
            title="Subscriptions Summary"
            click={toggleSidebar}
            isOpen={isOpen}
          />
          <SubscriptionSideBar
            isOpen={isOpen}
            click={toggleSidebar}
            mode={mode}
            data={selectedSubscription}
            onSubmit={handleSubmitSubscription}
          />
          <DisplayTable 
            btnText="Add Subscription"
            title="Subscriptions" 
            array={subscriptionsTableData} 
            backBTN="no"
            col1_Title="Subscription" 
            col2_Title="Created Date" 
            col3_Title="Last Updated" 
            isOpen={isOpen}
            click={toggleSidebar}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </div>
      )}

      {activeTab === 'types' && (
        <div className='flex flex-col gap-3'>
          <SubscriptionTypeStats
            title="Subscription Types Summary"
            click={toggleSidebar}
            isOpen={isOpen}
          />
          <SubscriptionTypeSideBar
            isOpen={isOpen}
            click={toggleSidebar}
            mode={mode}
            data={selectedSubscriptionType}
            onSubmit={handleSubmitSubscriptionType}
            availableModules={AVAILABLE_MODULES}
          />
          <SubscriptionTypeDisplayTable 
            btnText="Add Subscription Type"
            title="Subscription Types" 
            array={subscriptionTypesTableData} 
            backBTN="no"
            isOpen={isOpen}
            click={toggleSidebar}
            handleEdit={handleEditSubscriptionType}
            handleDelete={handleDeleteSubscriptionType}
          />
        </div>
      )}
    </div>
  )
}

export default Content
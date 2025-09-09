import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
// import { Toaster } from 'react-hot-toast';
import { saveSubscription, fetchSubscriptions, updateSubscription } from '../redux/features/subscriptionSlice';
import { fetchActiveSubscriptionTypes, fetchSubscriptionTypes } from '../redux/features/subscriptionTypesSlice';
import Input from './cui/input';
import Image from 'next/image';

const FORM_VALIDATION = {
  name: {
    required: 'Subscription name is required'
  },
  price: {
    required: 'Price is required',
    pattern: {
      value: /^\d+(\.\d{1,2})?$/,
      message: 'Please enter a valid price'
    },
    min: {
      message: 'Price must be greater than 0'
    }
  },
  typeId: {
    required: 'Subscription type is required'
  }
};

// Option 1: Move outside the component
const INITIAL_FORM_STATE = {
    name: '',
    price: '',
    status: 'ACTIVE',
    billingPeriod: '',
    typeId: ''
};

function SubscriptionSideBar({ isOpen, click, mode = 'create', data = null, onSubmit }) {
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.subscription);
    const { activeSubscriptionTypes, subscriptionTypes } = useSelector((state) => state.subscriptionTypes);
    
    // Filter subscription types for active ones
    const availableTypes = subscriptionTypes.filter(type => 
        type.status === 'ACTIVE' && type.deleteDate === null
    );
    
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (data) {
            setFormData({
                name: data.name || '',
                price: data.price || '',
                status: data.status || 'ACTIVE',
                billingPeriod: data.billingPeriod,
                typeId: data.typeId || ''
            });
        } else {
            setFormData(INITIAL_FORM_STATE);
        }
    }, [data, isOpen]);

    // Fetch subscription types when sidebar opens
    useEffect(() => {
        if (isOpen) {
            // Always fetch subscription types to ensure we have the latest data
            dispatch(fetchSubscriptionTypes());
        }
    }, [isOpen, dispatch]);

    // Debug subscription types (can be removed in production)
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log('Subscription types loaded:', subscriptionTypes.length);
            console.log('Available types:', availableTypes.length);
        }
    }, [subscriptionTypes, availableTypes]);

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name?.trim()) {
            newErrors.name = FORM_VALIDATION.name.required;
        }
        
        if (!formData.price) {
            newErrors.price = FORM_VALIDATION.price.required;
        } else if (!FORM_VALIDATION.price.pattern.value.test(formData.price)) {
            newErrors.price = FORM_VALIDATION.price.pattern.message;
        } else if (parseFloat(formData.price) <= 0) {
            newErrors.price = FORM_VALIDATION.price.min.message;
        }

        if (!formData.typeId) {
            newErrors.typeId = FORM_VALIDATION.typeId.required;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // First validate the form
        if (!validateForm()) {
            return;
        }

        // Log form data for debugging
        console.log('Form Data:', formData);

        try {
            await onSubmit({
                ...formData,
                name: formData.name?.trim(),
                price: parseFloat(formData.price)
            });
            
            // Reset form after successful submission
            if (mode === 'create') {
                setFormData(INITIAL_FORM_STATE);
                setErrors({});
            }
        } catch (error) {
            console.error('Form submission error:', error);
            toast.error(error.message || 'Failed to submit form');
        }
    };

    return (
        <>
            {/* <Toaster position="top-right" /> */}
            {/* Overlay */}
            {isOpen && (
                <div
                    onClick={()=>click()}
                    className="fixed inset-0 bg-black opacity-50 z-40"
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                } transition-transform duration-300 z-50`}
            >
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4 text-black">
                        <h2 className="text-xl font-semibold">
                            {mode === 'edit' ? 'Edit Subscription' : 'New Subscription'}
                        </h2>
                        <button
                            onClick={()=>click()}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <Image alt="close" src="/FAQ/cross.png" width={20} height={20}/>
                        </button>
                    </div>

                    {/* Description */}
                    <p className="text-gray-500 text-sm mb-6">
                        {mode === 'edit' ? 'Update your subscription details' : 'Create a new subscription'}
                    </p>

                    {/* Subscription Inputs */}
                    <div className="flex flex-col gap-4">
                        <Input  
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            w="full"
                            mdw="full"
                            label="Subscription Name *"
                            placeholder="Enter subscription name"
                            error={errors.name}
                            required
                        />

                        {/* Subscription Type Selection */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Subscription Type *</label>
                            <select
                                value={formData.typeId}
                                onChange={(e) => setFormData({...formData, typeId: e.target.value})}
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
                            >
                                <option value="">Select Subscription Type</option>
                                {availableTypes && availableTypes.length > 0 ? (
                                    availableTypes.map(type => (
                                        <option key={type.id} value={type.id}>
                                            {type.name} - {type.modules?.join(', ') || 'No modules'}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>No subscription types available</option>
                                )}
                            </select>
                            {errors.typeId && (
                                <p className="mt-1 text-sm text-red-600">{errors.typeId}</p>
                            )}
                            {/* Debug info - remove in production */}
                            {process.env.NODE_ENV === 'development' && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Available types: {availableTypes?.length || 0}
                                </p>
                            )}
                        </div>

                        {/* Display selected subscription type modules */}
                        {formData.typeId && (
                            <div className="mb-4 p-3 bg-gray-50 rounded-md">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Included Modules:
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {availableTypes
                                        .find(type => type.id === parseInt(formData.typeId))
                                        ?.modules?.map((module, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                                            >
                                                {module.replace('-', ' ')}
                                            </span>
                                        )) || <span className="text-gray-500 text-sm">No modules selected</span>}
                                </div>
                            </div>
                        )}
                        
                        <Input
                            id="price"
                            value={formData.price}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || parseFloat(value) > 0) {
                                    setFormData({...formData, price: value});
                                }
                            }}
                            w="full"
                            mdw="full"
                            label="Price *"
                            placeholder="Enter price"
                            type="number"
                            step="0.01"
                            min="0.01"
                            error={errors.price}
                            required
                        />

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Billing Period</label>
                            <select
                                value={formData.billingPeriod}
                                onChange={(e) => setFormData({...formData, billingPeriod: e.target.value})}
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
                            >
                                <option value="MONTHLY">Monthly</option>
                                <option value="ANNUAL">Annual</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">
                                Status:
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                                className="border border-gray-300 rounded-md p-2"
                            >
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 w-full p-4">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Saving...' : (mode === 'edit' ? 'Update' : 'Save')}
                    </button>
                </div>
            </div>
        </>
    );
}

export default SubscriptionSideBar;

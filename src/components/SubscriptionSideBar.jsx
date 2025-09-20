import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
// import { Toaster } from 'react-hot-toast';
import { saveSubscription, fetchSubscriptions, updateSubscription } from '../redux/features/subscriptionSlice';
import { fetchActiveSubscriptionTypes, fetchSubscriptionTypes } from '../redux/features/subscriptionTypesSlice';
import { fetchModules } from '../redux/features/modulesSlice';
import Input from './cui/input';
import Image from 'next/image';

const FORM_VALIDATION = {
  name: {
    required: 'Subscription name is required'
  },
  monthlyPrice: {
    required: 'Monthly price is required',
    pattern: {
      value: /^\d+(\.\d{1,2})?$/,
      message: 'Please enter a valid monthly price'
    },
    min: {
      message: 'Monthly price must be greater than 0'
    }
  },
  monthlyDiscount: {
    pattern: {
      value: /^\d+(\.\d{1,2})?$/,
      message: 'Please enter a valid discount percentage'
    },
    min: {
      value: 0,
      message: 'Discount cannot be negative'
    },
    max: {
      value: 100,
      message: 'Discount cannot exceed 100%'
    }
  },
  yearlyDiscount: {
    pattern: {
      value: /^\d+(\.\d{1,2})?$/,
      message: 'Please enter a valid discount percentage'
    },
    min: {
      value: 0,
      message: 'Discount cannot be negative'
    },
    max: {
      value: 100,
      message: 'Discount cannot exceed 100%'
    }
  },
  typeId: {
    required: 'Subscription type is required'
  }
};

// Option 1: Move outside the component
const INITIAL_FORM_STATE = {
    name: '',
    monthlyPrice: '',
    monthlyDiscount: '0',
    yearlyDiscount: '0',
    status: 'ACTIVE',
    typeId: ''
};

function SubscriptionSideBar({ isOpen, click, mode = 'create', data = null, onSubmit }) {
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.subscription);
    const { activeSubscriptionTypes, subscriptionTypes } = useSelector((state) => state.subscriptionTypes);
    const { modules } = useSelector((state) => state.modules);
    
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
                monthlyPrice: data.monthlyPrice || '',
                monthlyDiscount: data.monthlyDiscount || '0',
                yearlyDiscount: data.yearlyDiscount || '0',
                status: data.status || 'ACTIVE',
                typeId: data.typeId || ''
            });
        } else {
            setFormData(INITIAL_FORM_STATE);
        }
    }, [data, isOpen]);

    // Fetch subscription types and modules when sidebar opens
    useEffect(() => {
        if (isOpen) {
            // Always fetch subscription types to ensure we have the latest data
            dispatch(fetchSubscriptionTypes());
            // Fetch modules for displaying module names
            dispatch(fetchModules());
        }
    }, [isOpen, dispatch]);


    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name?.trim()) {
            newErrors.name = FORM_VALIDATION.name.required;
        }
        
        if (!formData.monthlyPrice) {
            newErrors.monthlyPrice = FORM_VALIDATION.monthlyPrice.required;
        } else if (!FORM_VALIDATION.monthlyPrice.pattern.value.test(formData.monthlyPrice)) {
            newErrors.monthlyPrice = FORM_VALIDATION.monthlyPrice.pattern.message;
        } else if (parseFloat(formData.monthlyPrice) <= 0) {
            newErrors.monthlyPrice = FORM_VALIDATION.monthlyPrice.min.message;
        }

        if (formData.monthlyDiscount && !FORM_VALIDATION.monthlyDiscount.pattern.value.test(formData.monthlyDiscount)) {
            newErrors.monthlyDiscount = FORM_VALIDATION.monthlyDiscount.pattern.message;
        } else if (formData.monthlyDiscount && (parseFloat(formData.monthlyDiscount) < 0 || parseFloat(formData.monthlyDiscount) > 100)) {
            newErrors.monthlyDiscount = parseFloat(formData.monthlyDiscount) < 0 
                ? FORM_VALIDATION.monthlyDiscount.min.message 
                : FORM_VALIDATION.monthlyDiscount.max.message;
        }

        if (formData.yearlyDiscount && !FORM_VALIDATION.yearlyDiscount.pattern.value.test(formData.yearlyDiscount)) {
            newErrors.yearlyDiscount = FORM_VALIDATION.yearlyDiscount.pattern.message;
        } else if (formData.yearlyDiscount && (parseFloat(formData.yearlyDiscount) < 0 || parseFloat(formData.yearlyDiscount) > 100)) {
            newErrors.yearlyDiscount = parseFloat(formData.yearlyDiscount) < 0 
                ? FORM_VALIDATION.yearlyDiscount.min.message 
                : FORM_VALIDATION.yearlyDiscount.max.message;
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


        try {
            await onSubmit({
                ...formData,
                name: formData.name?.trim(),
                monthlyPrice: parseFloat(formData.monthlyPrice),
                monthlyDiscount: parseFloat(formData.monthlyDiscount) || 0,
                yearlyDiscount: parseFloat(formData.yearlyDiscount) || 0
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
                                            {type.name} - {type.modules?.map(m => m.name).join(', ') || 'No modules'}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>No subscription types available</option>
                                )}
                            </select>
                            {errors.typeId && (
                                <p className="mt-1 text-sm text-red-600">{errors.typeId}</p>
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
                                        ?.modules?.map((moduleItem, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                                            >
                                                {moduleItem.name}
                                            </span>
                                        )) || <span className="text-gray-500 text-sm">No modules selected</span>}
                                </div>
                            </div>
                        )}
                        
                        <Input
                            id="monthlyPrice"
                            value={formData.monthlyPrice}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || parseFloat(value) > 0) {
                                    setFormData({...formData, monthlyPrice: value});
                                }
                            }}
                            w="full"
                            mdw="full"
                            label="Monthly Price *"
                            placeholder="Enter monthly price"
                            type="number"
                            step="0.01"
                            min="0.01"
                            error={errors.monthlyPrice}
                            required
                        />

                        <Input
                            id="monthlyDiscount"
                            value={formData.monthlyDiscount}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
                                    setFormData({...formData, monthlyDiscount: value});
                                }
                            }}
                            w="full"
                            mdw="full"
                            label="Monthly Discount (%)"
                            placeholder="Enter monthly discount percentage"
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            error={errors.monthlyDiscount}
                        />

                        <Input
                            id="yearlyDiscount"
                            value={formData.yearlyDiscount}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
                                    setFormData({...formData, yearlyDiscount: value});
                                }
                            }}
                            w="full"
                            mdw="full"
                            label="Yearly Discount (%)"
                            placeholder="Enter yearly discount percentage"
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            error={errors.yearlyDiscount}
                        />

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

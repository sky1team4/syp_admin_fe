import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
// import { Toaster } from 'react-hot-toast';
import { saveSubscription, fetchSubscriptions, updateSubscription } from '../redux/features/subscriptionSlice';
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
  }
};

function SubscriptionSideBar({ isOpen, click, mode = 'create', data = null, onSubmit }) {
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.subscription);
    
    const initialFormState = {
        name: '',
        price: '',
        status: 'ACTIVE',
        billingPeriod: ''
    };
    
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (data) {
            setFormData({
                name: data.name || '',
                price: data.price || '',
                status: data.status || 'ACTIVE',
                billingPeriod: data.billingPeriod
            });
        } else {
            setFormData(initialFormState); // Reset form when no data is provided
        }
    }, [data, isOpen]); // Add isOpen to dependencies

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
                setFormData(initialFormState);
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

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
// import { Toaster } from 'react-hot-toast';
import { saveSubscription, fetchSubscriptions, updateSubscription } from '../redux/features/subscriptionSlice';
import Input from './cui/input';

const FORM_VALIDATION = {
  name: {
    required: 'Subscription name is required'
  },
  price: {
    required: 'Price is required',
    pattern: {
      value: /^\d+(\.\d{1,2})?$/,
      message: 'Please enter a valid price'
    }
  }
};

function SubscriptionSideBar({ isOpen, click, mode = 'create', data = null }) {
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.subscription);
    
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        status: 'ACTIVE'
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (mode === 'edit' && data) {
            setFormData({
                name: data.name || data.title || '',
                price: data.price?.toString() || '',
                status: data.status || 'ACTIVE',
                id: data.id
            });
        } else {
            setFormData({
                name: '',
                price: '',
                status: 'ACTIVE'
            });
        }
    }, [mode, data]);

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name) {
            newErrors.name = FORM_VALIDATION.name.required;
        }
        
        if (!formData.price) {
            newErrors.price = FORM_VALIDATION.price.required;
        } else if (!FORM_VALIDATION.price.pattern.value.test(formData.price)) {
            newErrors.price = FORM_VALIDATION.price.pattern.message;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            toast.error('Please fill in all required fields correctly', { id: 'validation-error' });
            return;
        }

        try {
            const subscriptionData = {
                name: formData.name,
                status: formData.status,
                price: parseFloat(formData.price)
            };

            if (mode === 'edit' && data?.id) {
                await dispatch(updateSubscription({
                    id: data.id,
                    data: subscriptionData
                })).unwrap();
                toast.success('Subscription updated successfully');
            } else {
                await dispatch(saveSubscription(subscriptionData)).unwrap();
                toast.success('Subscription created successfully');
            }
            
            click(false); // Close sidebar
            dispatch(fetchSubscriptions()); // Refresh the list
        } catch (err) {
            toast.error(err?.message || `Failed to ${mode === 'edit' ? 'update' : 'create'} subscription`);
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
                            ✖
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
                        />
                        
                        <Input
                            id="price"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                            w="full"
                            mdw="full"
                            label="Price *"
                            placeholder="Enter price"
                            type="number"
                            step="0.01"
                            error={errors.price}
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
                        onClick={handleSave}
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

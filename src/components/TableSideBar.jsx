import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
// import { Toaster } from 'react-hot-toast';
import { saveSubscription, fetchSubscriptions, updateSubscription } from '../redux/features/subscriptionSlice';
import Input from './cui/input';

const FORM_VALIDATION = {
  name: {
    required: 'Subscription name is required'
  }
};

function TableSideBar({
    isOpen,
    click,
    mode = 'create',
    data = null,
    headerText = 'Subscription',
    descriptionText = 'Manage your subscription',
    nameLabel = 'Subscription Name *',
    namePlaceholder = 'Enter subscription name',
    saveButtonText = 'Save',
    updateButtonText = 'Update'
}) {
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.subscription);
    
    const [formData, setFormData] = useState({
        name: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (mode === 'edit' && data) {
            setFormData({
                name: data.name || data.title || ''
            });
        } else {
            setFormData({
                name: ''
            });
        }
    }, [mode, data]);

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name) {
            newErrors.name = FORM_VALIDATION.name.required;
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
                name: formData.name
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
            toast.error(err?.message || `Failed to ${mode === 'edit' ? 'update' : 'create'} ${headerText}`);
        }
    };

    return (
        <>
            {/* <Toaster position="top-right" /> */}
            {/* Overlay */}
            {isOpen && (
                <div
                    onClick={() => click()}
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
                            Add {headerText}
                        </h2>
                        <button
                            onClick={() => click()}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ✖
                        </button>
                    </div>

                    {/* Description */}
                    <p className="text-gray-500 text-sm mb-6">
                        {descriptionText}
                    </p>

                    {/* Subscription Inputs */}
                    <div className="flex flex-col gap-4">
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            w="full"
                            mdw="full"
                            label={nameLabel}
                            placeholder={namePlaceholder}
                            error={errors.name}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 w-full p-4">
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Saving...' : (mode === 'edit' ? updateButtonText : saveButtonText)}
                    </button>
                </div>
            </div>
        </>
    );
}

export default TableSideBar;

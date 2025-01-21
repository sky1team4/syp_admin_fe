import React, { useState, useEffect } from 'react';
import Input from './cui/input';

function SubscriptionSideBar({ isOpen, onClose, mode = 'create', data = null, onSave }) {
    const [subscription, setSubscription] = useState('');

    useEffect(() => {
        // Pre-fill the input when editing
        if (mode === 'edit' && data) {
            setSubscription(data.title || '');
        } else {
            setSubscription('');
        }
    }, [mode, data]);

    const handleSave = () => {
        onSave?.({ subscription, id: data?.id });
        onClose();
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-black opacity-50 z-40"
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform ${isOpen ? "translate-x-0" : "translate-x-full"
                    } transition-transform duration-300 z-50`}
            >
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4 text-black">
                        <h2 className="text-xl font-semibold">
                            {mode === 'edit' ? 'Edit Subscription' : 'New Subscription'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ✖
                        </button>
                    </div>

                    {/* Description */}
                    <p className="text-gray-500 text-sm mb-6">
                        {mode === 'edit' ? 'Update your subscription details' : 'Create a new subscription'}
                    </p>

                    {/* Subscription Input */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                            Subscription Details
                        </h3>
                        <div className="flex flex-col gap-4">
                            <Input
                                id="subscription-input"
                                value={subscription}
                                onChange={(e) => setSubscription(e.target.value)}
                                w="full"
                                mdw="full"
                                placeholder="Monthly Subscription"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 w-full p-4">
                    <button
                        onClick={handleSave}
                        className="w-full bg-purple-600 text-white py-2 rounded-md"
                    >
                        {mode === 'edit' ? 'Update' : 'Save'}
                    </button>
                </div>
            </div>
        </>
    );
}

export default SubscriptionSideBar;

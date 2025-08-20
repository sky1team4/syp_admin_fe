import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRewardSteps, fetchCoinConversionRate, fetchPaymentMethods } from '../../../redux/features/rewardSystemSlice'
import { toast } from 'react-hot-toast'
import PaymentMethodsTab from './PaymentMethodsTab'
import RewardStepsTab from './RewardStepsTab'
import CoinConversionTab from './CoinConversionTab'

function Content() {
    const dispatch = useDispatch();
    const { error, isLoading, rewardSteps, paymentMethods, conversionRate } = useSelector((state) => state.rewardSystem);
    const [activeTab, setActiveTab] = useState('payment');

    useEffect(() => {
        dispatch(fetchRewardSteps());
        dispatch(fetchCoinConversionRate());
        dispatch(fetchPaymentMethods());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const tabs = [
        { id: 'payment', label: 'Payment Methods', icon: '💳' },
        { id: 'steps', label: 'Reward Steps', icon: '🎯' },
        { id: 'conversion', label: 'Coin Conversion', icon: '💰' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Reward System</h1>
                    <p className="text-gray-600">Manage reward steps and coin-to-dollar conversion rates</p>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6" aria-label="Tabs">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === tab.id
                                        ? 'border-purple-500 text-purple-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <span className="text-lg">{tab.icon}</span>
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'payment' && <PaymentMethodsTab />}
                        {activeTab === 'steps' && <RewardStepsTab />}
                        {activeTab === 'conversion' && <CoinConversionTab />}
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Content;

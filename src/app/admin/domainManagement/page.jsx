"use client"
import React, { useState } from 'react'
import Content from './content'
import RefundRequestsContent from './refundRequestsContent'
import CommissionContent from './commissionContent'

function Page() {
    const [activeTab, setActiveTab] = useState('domains');

    return (
        <>
            <div className='flex flex-col gap-3 w-full'>
                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        onClick={() => setActiveTab('domains')}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'domains'
                                ? 'border-purple-500 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Domains
                    </button>
                    <button
                        onClick={() => setActiveTab('refundRequests')}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'refundRequests'
                                ? 'border-purple-500 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Refund Requests
                    </button>
                    <button
                        onClick={() => setActiveTab('commission')}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'commission'
                                ? 'border-purple-500 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Commission
                    </button>
                </div>

                {/* Tab Content */}
                <div className='flex gap-3 w-full'>
                    {activeTab === 'domains' && <Content />}
                    {activeTab === 'refundRequests' && <RefundRequestsContent />}
                    {activeTab === 'commission' && <CommissionContent />}
                </div>
            </div>
        </>
    )
}

export default Page

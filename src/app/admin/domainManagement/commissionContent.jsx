"use client"
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchCommissionConfig, 
  updateCommissionConfig,
  fetchCommissionRecords,
  fetchCommissionStats
} from '../../../redux/features/domainSlice'
import { toast } from 'react-hot-toast'
import CommissionConfig from './commissionConfig'
import CommissionStats from './commissionStats'
import CommissionRecords from './commissionRecords'

function CommissionContent() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('config');

  const { 
    commissionConfig, 
    commissionConfigLoading, 
    commissionConfigError,
    commissionRecords,
    commissionRecordsLoading,
    commissionRecordsError,
    commissionStats,
    commissionStatsLoading,
    commissionStatsError
  } = useSelector((state) => state.domain || {});

  useEffect(() => {
    // Fetch all data when component mounts
    dispatch(fetchCommissionConfig());
    dispatch(fetchCommissionRecords());
    dispatch(fetchCommissionStats());
  }, [dispatch]);

  return (
    <div className='flex flex-col w-full h-full max-w-full overflow-hidden'>
      {/* Tab Navigation */}
      <div className="flex-shrink-0 flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('config')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'config'
              ? 'border-purple-500 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Commission Config
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'stats'
              ? 'border-purple-500 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Statistics
        </button>
        <button
          onClick={() => setActiveTab('records')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'records'
              ? 'border-purple-500 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Commission Records
        </button>
      </div>

      {/* Tab Content */}
      <div className='flex-1 overflow-y-auto min-h-0'>
        {activeTab === 'config' && (
          <CommissionConfig 
            config={commissionConfig}
            loading={commissionConfigLoading}
            error={commissionConfigError}
            onUpdate={(config) => dispatch(updateCommissionConfig(config))}
            onRefresh={() => dispatch(fetchCommissionConfig())}
          />
        )}
        {activeTab === 'stats' && (
          <CommissionStats 
            stats={commissionStats}
            loading={commissionStatsLoading}
            error={commissionStatsError}
            onRefresh={() => dispatch(fetchCommissionStats())}
          />
        )}
        {activeTab === 'records' && (
          <CommissionRecords 
            records={commissionRecords}
            loading={commissionRecordsLoading}
            error={commissionRecordsError}
            onRefresh={() => dispatch(fetchCommissionRecords())}
          />
        )}
      </div>
    </div>
  )
}

export default CommissionContent

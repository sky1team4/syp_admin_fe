"use client"
import React from 'react'

function CommissionStats({ stats, loading, error, onRefresh }) {
  const formatCurrency = (cents) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  };

  const formatPercentage = (rate) => {
    return `${(rate * 100).toFixed(2)}%`;
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading commission statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="text-red-500 mb-4">Error loading commission statistics</div>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">No statistics available</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Commissions */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-sm text-gray-600 mb-1">Total Commissions</div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.total_commissions || 0}
          </div>
          <div className="text-xs text-gray-500 mt-1">Number of commission records</div>
        </div>

        {/* Total Commission Amount */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-sm text-gray-600 mb-1">Total Commission Amount</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(stats.total_commission_amount || 0)}
          </div>
          <div className="text-xs text-gray-500 mt-1">Sum of all commissions</div>
        </div>

        {/* Total Domain Sales */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-sm text-gray-600 mb-1">Total Domain Sales</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(stats.total_domain_sales || 0)}
          </div>
          <div className="text-xs text-gray-500 mt-1">Total sales amount</div>
        </div>

        {/* Average Commission Rate */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-sm text-gray-600 mb-1">Average Commission Rate</div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.average_commission_rate ? formatPercentage(stats.average_commission_rate) : '0%'}
          </div>
          <div className="text-xs text-gray-500 mt-1">Average rate across all commissions</div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      {stats.monthly_breakdown && stats.monthly_breakdown.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">Month</th>
                  <th className="text-right py-2 px-4 text-sm font-medium text-gray-700">Commissions</th>
                  <th className="text-right py-2 px-4 text-sm font-medium text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody>
                {stats.monthly_breakdown.map((month, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 text-sm text-gray-900">
                      {new Date(month.month + '-01').toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long' 
                      })}
                    </td>
                    <td className="py-2 px-4 text-sm text-gray-900 text-right">
                      {month.commissions}
                    </td>
                    <td className="py-2 px-4 text-sm text-gray-900 text-right font-medium">
                      {formatCurrency(month.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(!stats.monthly_breakdown || stats.monthly_breakdown.length === 0) && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-center text-gray-500 py-8">
            No monthly breakdown data available
          </div>
        </div>
      )}
    </div>
  );
}

export default CommissionStats

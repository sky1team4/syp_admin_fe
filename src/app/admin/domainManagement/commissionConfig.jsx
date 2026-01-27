"use client"
import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

function CommissionConfig({ config, loading, error, onUpdate, onRefresh }) {
  const [formData, setFormData] = useState({
    commission_rate: '',
    min_commission: '',
    max_commission: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (config) {
      setFormData({
        commission_rate: config.commission_rate ? (config.commission_rate * 100).toFixed(2) : '',
        min_commission: config.min_commission ? (config.min_commission / 100).toFixed(2) : '',
        max_commission: config.max_commission ? (config.max_commission / 100).toFixed(2) : ''
      });
    }
  }, [config]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert percentage to decimal (e.g., 10 -> 0.10)
      const commission_rate = parseFloat(formData.commission_rate) / 100;
      
      // Validate commission rate
      if (isNaN(commission_rate) || commission_rate < 0 || commission_rate > 1) {
        toast.error('Commission rate must be between 0% and 100%');
        setIsSubmitting(false);
        return;
      }

      // Convert dollars to cents
      const updateData = {
        commission_rate: commission_rate,
        min_commission: formData.min_commission ? Math.round(parseFloat(formData.min_commission) * 100) : null,
        max_commission: formData.max_commission ? Math.round(parseFloat(formData.max_commission) * 100) : null
      };

      // Validate min/max
      if (updateData.min_commission !== null && updateData.min_commission < 0) {
        toast.error('Minimum commission must be >= 0');
        setIsSubmitting(false);
        return;
      }

      if (updateData.max_commission !== null && updateData.max_commission < 0) {
        toast.error('Maximum commission must be >= 0');
        setIsSubmitting(false);
        return;
      }

      if (updateData.min_commission !== null && updateData.max_commission !== null && 
          updateData.min_commission > updateData.max_commission) {
        toast.error('Minimum commission cannot be greater than maximum commission');
        setIsSubmitting(false);
        return;
      }

      await onUpdate(updateData);
      toast.success('Commission configuration updated successfully');
      onRefresh();
    } catch (error) {
      toast.error(error.message || 'Failed to update commission configuration');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !config) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading commission configuration...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="text-red-500 mb-4">Error loading commission configuration</div>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-6">Commission Configuration</h2>
        
        {config && (
          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Current Configuration</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Commission Rate:</span>
                <span className="ml-2 font-medium">{(config.commission_rate * 100).toFixed(2)}%</span>
              </div>
              <div>
                <span className="text-gray-600">Type:</span>
                <span className="ml-2 font-medium">{config.commission_type}</span>
              </div>
              {config.min_commission && (
                <div>
                  <span className="text-gray-600">Min Commission:</span>
                  <span className="ml-2 font-medium">${(config.min_commission / 100).toFixed(2)}</span>
                </div>
              )}
              {config.max_commission && (
                <div>
                  <span className="text-gray-600">Max Commission:</span>
                  <span className="ml-2 font-medium">${(config.max_commission / 100).toFixed(2)}</span>
                </div>
              )}
              <div>
                <span className="text-gray-600">Status:</span>
                <span className={`ml-2 font-medium ${config.is_active ? 'text-green-600' : 'text-gray-500'}`}>
                  {config.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              {config.updated_at && (
                <div>
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="ml-2 font-medium">
                    {new Date(config.updated_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="commission_rate" className="block text-sm font-medium text-gray-700 mb-1">
              Commission Rate (%)
            </label>
            <input
              type="number"
              id="commission_rate"
              name="commission_rate"
              value={formData.commission_rate}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., 10.00 for 10%"
            />
            <p className="mt-1 text-xs text-gray-500">Enter a value between 0 and 100 (e.g., 10 for 10%)</p>
          </div>

          <div>
            <label htmlFor="min_commission" className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Commission ($)
            </label>
            <input
              type="number"
              id="min_commission"
              name="min_commission"
              value={formData.min_commission}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., 5.00 (optional)"
            />
            <p className="mt-1 text-xs text-gray-500">Optional: Minimum commission amount in dollars</p>
          </div>

          <div>
            <label htmlFor="max_commission" className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Commission ($)
            </label>
            <input
              type="number"
              id="max_commission"
              name="max_commission"
              value={formData.max_commission}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., 50.00 (optional)"
            />
            <p className="mt-1 text-xs text-gray-500">Optional: Maximum commission amount in dollars</p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Updating...' : 'Update Configuration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CommissionConfig

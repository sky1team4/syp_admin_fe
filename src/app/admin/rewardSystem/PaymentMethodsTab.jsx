import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { savePaymentMethod, updatePaymentMethod, deletePaymentMethod, fetchPaymentMethods } from '../../../redux/features/rewardSystemSlice'
import { toast } from 'react-hot-toast'
import { Plus, Edit, Trash2, CreditCard, DollarSign } from 'lucide-react'

const PaymentMethodsTab = () => {
    const dispatch = useDispatch();
    const { paymentMethods, isLoading } = useSelector((state) => ({
        paymentMethods: state.rewardSystem?.paymentMethods || [],
        isLoading: state.rewardSystem?.isLoading || false
    }));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMethod, setEditingMethod] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        thresholdLimit: '',
        isActive: true
    });

    // Function to refresh data from database
    const refreshData = async () => {
        setIsRefreshing(true);
        try {
            await dispatch(fetchPaymentMethods()).unwrap();
        } catch (error) {
            console.error('Refresh error:', error);
            toast.error('Failed to refresh data');
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleOpenModal = (method = null) => {
        if (method && typeof method === 'object' && method.id && method.name && method.description && method.thresholdLimit !== undefined && method.isActive !== undefined) {
            setEditingMethod(method);
            setFormData({
                name: method?.name || '',
                description: method?.description || '',
                thresholdLimit: (method?.thresholdLimit || 0).toString(),
                isActive: method?.isActive !== undefined ? method.isActive : true
            });
        } else {
            setEditingMethod(null);
            // Show dummy data for new payment method
            setFormData({
                name: 'PayPal',
                description: 'PayPal payment gateway for secure online transactions',
                thresholdLimit: '25.00',
                isActive: true
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingMethod(null);
        setFormData({
            name: '',
            description: '',
            thresholdLimit: '',
            isActive: true
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (!name) return;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form data
        if (!formData.name || !formData.description || !formData.thresholdLimit) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            if (editingMethod && editingMethod.id) {
                await dispatch(updatePaymentMethod({ id: editingMethod.id, data: formData })).unwrap();
                toast.success('Payment method updated successfully');

                // Refresh data from database after update
                await refreshData();
            } else {
                await dispatch(savePaymentMethod(formData)).unwrap();
                toast.success('Payment method created successfully');

                // Refresh data from database after create
                await refreshData();
            }
            handleCloseModal();
        } catch (error) {
            console.error('Submit error:', error);
            toast.error(error || 'Failed to save payment method');
        }
    };

    const handleDelete = async (id) => {
        if (!id) {
            toast.error('Invalid payment method ID');
            return;
        }
        
        try {
            await dispatch(deletePaymentMethod(id)).unwrap();
            toast.success('Payment method deleted successfully');

            // Refresh data from database after delete
            await refreshData();
        } catch (error) {
            toast.error(error || 'Failed to delete payment method');
        }
    };

    const sortedMethods = [...(paymentMethods || [])].sort((a, b) => {
        if (!a?.name || !b?.name) return 0;
        return a.name.localeCompare(b.name);
    });

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Payment Methods</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage payment methods and their threshold limits for reward claims
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal(null)}
                    className="bg-purple-600 text-white px-2 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
                >
                    <Plus size={12} />
                    <span>Add</span>
                </button>
            </div>


            {/* Summary Stats */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                            {(paymentMethods || []).length}
                        </div>
                        <div className="text-sm text-gray-600">Total Methods</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {(paymentMethods || []).filter(method => method?.isActive).length}
                        </div>
                        <div className="text-sm text-gray-600">Active Methods</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                            {(paymentMethods || []).filter(method => !method?.isActive).length}
                        </div>
                        <div className="text-sm text-gray-600">Banned Methods</div>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {(isLoading || isRefreshing) && (
                <div className="flex justify-center items-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">
                            {isRefreshing ? 'Refreshing data from database...' : 'Loading payment methods...'}
                        </p>
                    </div>
                </div>
            )}

            {/* Payment Methods Grid */}
            {!isLoading && !isRefreshing && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedMethods.map((method, index) => (
                            <div
                                key={method?.id || `method-${index}`}
                                className={`bg-white rounded-lg border-2 p-6 transition-all duration-200 ${method?.isActive
                                    ? 'border-purple-200 hover:border-purple-300 shadow-sm'
                                    : 'border-red-200 hover:border-red-300 shadow-sm opacity-75'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${method?.isActive ? 'bg-blue-500' : 'bg-red-500'}`}>
                                            <CreditCard size={20} />
                                        </div>
                                        <span className={`text-sm px-2 py-1 rounded-full ${method?.isActive
                                            ? 'bg-purple-100 text-purple-800'
                                            : 'bg-red-100 text-red-600'
                                            }`}>
                                            {method?.isActive ? 'Active' : 'Banned'}
                                        </span>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => method && method.id && method.name && method.description && method.thresholdLimit !== undefined && method.isActive !== undefined && handleOpenModal(method)}
                                            className={`p-1 hover:text-purple-600 transition-colors ${method?.isActive ? 'text-gray-400' : 'text-gray-300'
                                                }`}
                                            title="Edit"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => method?.id && method?.name && method?.description && method?.thresholdLimit !== undefined && method?.isActive !== undefined && handleDelete(method.id)}
                                            className={`p-1 hover:text-red-600 transition-colors ${method?.isActive ? 'text-gray-400' : 'text-gray-300'
                                                }`}
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <h3 className={`font-semibold mb-2 ${method?.isActive ? 'text-gray-900' : 'text-gray-600'
                                    }`}>
                                    {method?.name || 'Unnamed Method'}
                                </h3>
                                <p className={`text-sm mb-4 line-clamp-2 ${method?.isActive ? 'text-gray-600' : 'text-gray-500'
                                    }`}>
                                    {method?.description || 'No description available'}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <DollarSign size={16} className="text-green-500" />
                                        <span className={`text-sm ${method?.isActive ? 'text-gray-600' : 'text-gray-500'}`}>
                                            Threshold Limit:
                                        </span>
                                    </div>
                                    <div className={`text-lg font-bold ${method?.isActive ? 'text-green-600' : 'text-green-400'
                                        }`}>
                                        ${method?.thresholdLimit || '0.00'}
                                    </div>
                                </div>

                                {/* Banned Notice */}
                                {!method?.isActive && (
                                    <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded-md">
                                        <p className="text-xs text-red-600 text-center">
                                            This payment method is currently banned and unavailable for use
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {sortedMethods.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <CreditCard size={48} className="mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No payment methods yet</h3>
                            <p className="text-gray-600 mb-4">Create your first payment method to get started</p>
                            <button
                                onClick={() => handleOpenModal(null)}
                                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                            >
                                Add First Payment Method
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold mb-4">
                            {editingMethod ? 'Edit Payment Method' : 'Add New Payment Method'}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Payment Method Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., PayPal, Stripe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Describe the payment method"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Threshold Limit ($) *
                                </label>
                                <input
                                    type="number"
                                    name="thresholdLimit"
                                    value={formData.thresholdLimit}
                                    onChange={handleInputChange}
                                    required
                                    min="0.01"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="25.00"
                                />
                                <p className="text-xs text-gray-500 mt-1">Minimum amount required to checkout</p>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-900">
                                    Active
                                </label>
                            </div>

                            {/* Banned Method Info */}
                            {!formData.isActive && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-sm text-red-800">
                                        <strong>Note:</strong> Banned payment methods will not be available for users to select during checkout.
                                    </p>
                                </div>
                            )}

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                                >
                                    {isLoading ? 'Saving...' : (editingMethod ? 'Update' : 'Create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentMethodsTab;

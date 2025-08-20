import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { saveRewardStep, updateRewardStep, deleteRewardStep, fetchRewardSteps } from '../../../redux/features/rewardSystemSlice'
import { toast } from 'react-hot-toast'
import { Plus, Edit, Trash2 } from 'lucide-react'

const RewardStepsTab = () => {
    const dispatch = useDispatch();
    const { rewardSteps, isLoading } = useSelector((state) => ({
        rewardSteps: state.rewardSystem?.rewardSteps || [],
        isLoading: state.rewardSystem?.isLoading || false
    }));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStep, setEditingStep] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        coinsReward: '',
        dollarValue: '',
        order: '',
        isActive: true
    });

    // Function to refresh data from database
    const refreshData = async () => {
        setIsRefreshing(true);
        try {
            await dispatch(fetchRewardSteps()).unwrap();
        } catch (error) {
            console.error('Refresh error:', error);
            toast.error('Failed to refresh data');
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleOpenModal = (step = null) => {
        if (step && step.id) {
            setEditingStep(step);
            setFormData({
                title: step.title || '',
                description: step.description || '',
                coinsReward: (step.coinsReward || 0).toString(),
                dollarValue: (step.dollarValue || 0).toString(),
                order: (step.stepOrder || step.order || 1).toString(), // Handle both field names
                isActive: step.isActive !== undefined ? step.isActive : true
            });
        } else {
            setEditingStep(null);
            // Show dummy data for new step
            const nextOrder = (rewardSteps || []).length + 1;
            setFormData({
                title: 'Complete Profile Setup',
                description: 'Fill out your complete profile information including bio, profile picture, and contact details to earn rewards.',
                coinsReward: '100',
                dollarValue: '10.00',
                order: nextOrder.toString(),
                isActive: true
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingStep(null);
        setFormData({
            title: '',
            description: '',
            coinsReward: '',
            dollarValue: '',
            order: '',
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
        if (!formData.title || !formData.description || !formData.coinsReward || !formData.dollarValue || !formData.order) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            // Transform form data to match API expectations
            const apiData = {
                title: formData.title,
                description: formData.description,
                coinsReward: parseInt(formData.coinsReward) || 0,
                dollarValue: parseFloat(formData.dollarValue) || 0,
                stepOrder: parseInt(formData.order) || 1,  // Convert 'order' to 'stepOrder'
                isActive: formData.isActive
            };

            if (editingStep) {
                await dispatch(updateRewardStep({ id: editingStep.id, data: apiData })).unwrap();
                toast.success('Reward step updated successfully - other steps redistributed automatically');

                // Refresh data from database after update
                await refreshData();
            } else {
                await dispatch(saveRewardStep(apiData)).unwrap();
                toast.success('Reward step created successfully');

                // Refresh data from database after create
                await refreshData();
            }
            handleCloseModal();
        } catch (error) {
            console.error('Submit error:', error);
            toast.error(error || 'Failed to save reward step');
        }
    };

    const handleDelete = async (id) => {
        if (!id) {
            toast.error('Invalid reward step ID');
            return;
        }
        
        try {
            await dispatch(deleteRewardStep(id)).unwrap();
            toast.success('Reward step deleted successfully');

            // Refresh data from database after delete
            await refreshData();
        } catch (error) {
            console.error('Delete error:', error);
            toast.error(error || 'Failed to delete reward step');
        }
    };

    const sortedSteps = [...(rewardSteps || [])].sort((a, b) => {
        const orderA = a.stepOrder || a.order || 0;
        const orderB = b.stepOrder || b.order || 0;
        return orderA - orderB;
    });

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Reward Steps</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Manage the steps users need to complete to earn rewards
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal(null)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
                >
                    <Plus size={16} />
                    <span>Add Step</span>
                </button>
            </div>

            {/* Total Values Display */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                            {(rewardSteps || []).reduce((sum, step) => sum + (parseInt(step.coinsReward) || 0), 0)}
                        </div>
                        <div className="text-sm text-gray-600">Total Coins</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                            ${(rewardSteps || []).reduce((sum, step) => sum + (parseFloat(step.dollarValue) || 0), 0).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">Total Dollars</div>
                    </div>
                    <div className="text-center">
                        <div className="text-sm text-gray-600">Dynamic Totals</div>
                        <div className="text-xs text-gray-500">Sum of all steps</div>
                    </div>
                </div>

                {/* Active/Inactive Summary */}
                <div className="mt-3 pt-3 border-t border-purple-200">
                    <div className="flex justify-center space-x-6 text-sm">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-gray-600">
                                {(rewardSteps || []).filter(step => step.isActive).length} Active
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                            <span className="text-gray-600">
                                {(rewardSteps || []).filter(step => !step.isActive).length} Inactive
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {(isLoading || isRefreshing) && (
                <div className="flex justify-center items-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">
                            {isRefreshing ? 'Refreshing data from database...' : 'Loading reward steps...'}
                        </p>
                    </div>
                </div>
            )}

            {/* Steps Grid */}
            {!isLoading && !isRefreshing && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sortedSteps.map((step, index) => (
                            <div
                                key={step.id || `step-${index}`}
                                className={`bg-white rounded-lg border-2 p-6 transition-all duration-200 h-full flex flex-col min-h-[280px] ${step?.isActive
                                    ? 'border-green-200 hover:border-green-300 shadow-sm'
                                    : 'border-gray-200 hover:border-gray-300 shadow-sm opacity-75'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${step.isActive ? 'bg-green-500' : 'bg-gray-400'
                                            }`}>
                                            {step.stepOrder || step.order || index + 1}
                                        </div>
                                        <span className={`text-sm px-2 py-1 rounded-full ${step?.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {step?.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => step && step.id && handleOpenModal(step)}
                                            className={`p-1 hover:text-blue-600 transition-colors ${step?.isActive ? 'text-gray-400' : 'text-gray-300'
                                                }`}
                                            title="Edit"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => step?.id && handleDelete(step.id)}
                                            className={`p-1 hover:text-red-600 transition-colors ${step?.isActive ? 'text-gray-400' : 'text-gray-300'
                                                }`}
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <h3 className={`font-semibold mb-2 line-clamp-1 ${step?.isActive ? 'text-gray-900' : 'text-gray-600'
                                    }`}>
                                    {step.title || 'Untitled Step'}
                                </h3>
                                <p className={`text-sm mb-4 line-clamp-3 flex-grow ${step?.isActive ? 'text-gray-600' : 'text-gray-500'
                                    }`}>
                                    {step.description || 'No description available'}
                                </p>

                                {/* Spacer to push rewards to bottom */}
                                <div className="flex-grow"></div>

                                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                                    <div className="text-center flex-1">
                                        <div className={`text-lg font-bold ${step?.isActive ? 'text-purple-600' : 'text-purple-400'
                                            }`}>
                                            {step.coinsReward || '0'}
                                        </div>
                                        <div className={`text-xs ${step?.isActive ? 'text-gray-500' : 'text-gray-400'
                                            }`}>
                                            Coins
                                        </div>
                                    </div>
                                    <div className="text-center flex-1">
                                        <div className={`text-lg font-bold ${step?.isActive ? 'text-green-600' : 'text-green-400'
                                            }`}>
                                            ${step.dollarValue || '0.00'}
                                        </div>
                                        <div className={`text-xs ${step?.isActive ? 'text-gray-500' : 'text-gray-400'
                                            }`}>
                                            Value
                                        </div>
                                    </div>
                                </div>

                                {/* Inactive Notice */}
                                {!step?.isActive && (
                                    <div className="mt-4 p-2 bg-gray-50 border border-gray-200 rounded-md">
                                        <p className="text-xs text-gray-500 text-center">
                                            This step is currently inactive but retains its data
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {sortedSteps.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <Plus size={48} className="mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No reward steps yet</h3>
                            <p className="text-gray-600 mb-4">Create your first reward step to get started</p>
                            <button
                                onClick={() => handleOpenModal(null)}
                                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                            >
                                Add First Step
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
                            {editingStep ? 'Edit Reward Step' : 'Add New Reward Step'}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g., Complete Profile"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Describe what the user needs to do"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Coins Reward *
                                    </label>
                                    <input
                                        type="number"
                                        name="coinsReward"
                                        value={formData.coinsReward}
                                        onChange={handleInputChange}
                                        required
                                        min="1"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Dollar Value *
                                    </label>
                                    <input
                                        type="number"
                                        name="dollarValue"
                                        value={formData.dollarValue}
                                        onChange={handleInputChange}
                                        required
                                        min="0.01"
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="10.00"
                                    />
                                </div>
                            </div>



                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Order *
                                </label>
                                <input
                                    type="number"
                                    name="order"
                                    value={formData.order}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="1"
                                />
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

                            {/* Inactive Step Info */}
                            {!formData.isActive && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                    <p className="text-sm text-yellow-800">
                                        <strong>Note:</strong> Inactive steps will still display their data but won&apos;t be available for users to complete. You can reactivate them anytime.
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
                                    {isLoading ? 'Saving...' : (editingStep ? 'Update' : 'Create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RewardStepsTab;

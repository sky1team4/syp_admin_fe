import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateCoinConversionRate } from '../../../redux/features/rewardSystemSlice'
import { toast } from 'react-hot-toast'
import { DollarSign, Coins, Settings } from 'lucide-react'

const CoinConversionTab = () => {
    const dispatch = useDispatch();
    const { conversionRate, isLoading } = useSelector((state) => state.rewardSystem);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        coinsPerDollar: '100',
        isActive: true
    });

    // Update form data when conversion rate changes
    useEffect(() => {
        if (conversionRate && conversionRate.coinsPerDollar !== undefined) {
            setFormData({
                coinsPerDollar: conversionRate.coinsPerDollar.toString(),
                isActive: conversionRate.isActive
            });
        }
    }, [conversionRate]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await dispatch(updateCoinConversionRate(formData)).unwrap();
            toast.success('Conversion rate updated successfully');
            setIsEditing(false);
        } catch (error) {
            toast.error(error || 'Failed to update conversion rate');
        }
    };

    const handleCancel = () => {
        setFormData({
            coinsPerDollar: (conversionRate?.coinsPerDollar || 100).toString(),
            isActive: conversionRate?.isActive ?? true
        });
        setIsEditing(false);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Coin Conversion Rate</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Set the exchange rate between coins and dollars
                    </p>
                </div>
                {!isEditing && (
                    <button
                        onClick={handleEdit}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
                    >
                        <Settings size={16} />
                        <span>Edit Rate</span>
                    </button>
                )}
            </div>

            {/* Conversion Rate Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                {!isEditing ? (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${conversionRate?.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                <span className={`text-sm font-medium ${conversionRate?.isActive ? 'text-green-700' : 'text-gray-500'}`}>
                                    {conversionRate?.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="text-center p-6 bg-purple-50 rounded-lg">
                                <div className="flex justify-center mb-3">
                                    <Coins className="w-8 h-8 text-purple-600" />
                                </div>
                                <div className="text-3xl font-bold text-purple-600 mb-2">
                                    {conversionRate?.coinsPerDollar || 100}
                                </div>
                                <div className="text-sm text-gray-600">Coins per Dollar</div>
                            </div>

                            <div className="text-center p-6 bg-green-50 rounded-lg">
                                <div className="flex justify-center mb-3">
                                    <DollarSign className="w-8 h-8 text-green-600" />
                                </div>
                                <div className="text-3xl font-bold text-green-600 mb-2">
                                    ${(1 / (conversionRate?.coinsPerDollar || 100)).toFixed(4)}
                                </div>
                                <div className="text-sm text-gray-600">Dollar per Coin</div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-2">Example Conversions:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="text-center">
                                    <div className="font-medium">100 Coins</div>
                                    <div className="text-gray-600">= ${(100 / (conversionRate?.coinsPerDollar || 100)).toFixed(2)}</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-medium">500 Coins</div>
                                    <div className="text-gray-600">= ${(500 / (conversionRate?.coinsPerDollar || 100)).toFixed(2)}</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-medium">1000 Coins</div>
                                    <div className="text-gray-600">= ${(1000 / (conversionRate?.coinsPerDollar || 100)).toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Coins per Dollar *
                            </label>
                            <input
                                type="number"
                                name="coinsPerDollar"
                                value={formData.coinsPerDollar}
                                onChange={handleInputChange}
                                required
                                min="1"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="100"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                How many coins equal 1 dollar
                            </p>
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
                                Enable conversion rate
                            </label>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="font-medium text-blue-900 mb-2">Preview:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="text-center">
                                    <div className="font-medium">100 Coins</div>
                                    <div className="text-blue-600">
                                        = ${formData.coinsPerDollar ? (100 / parseFloat(formData.coinsPerDollar)).toFixed(2) : '0.00'}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="font-medium">1 Dollar</div>
                                    <div className="text-blue-600">
                                        = {formData.coinsPerDollar || '0'} Coins
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                            >
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Information Section */}
            <div className="mt-8 bg-yellow-50 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">Important Notes:</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• This conversion rate affects all reward calculations</li>
                    <li>• Changes will apply to new reward redemptions</li>
                    <li>• Users can exchange their coins for dollars based on this rate</li>
                    <li>• Make sure the rate is fair and sustainable for your business</li>
                </ul>
            </div>
        </div>
    );
};

export default CoinConversionTab;

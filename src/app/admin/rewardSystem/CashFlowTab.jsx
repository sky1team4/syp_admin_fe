import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCashFlows, fetchCashFlowStats, updateCashFlowStatus, acceptCashFlow, rejectCashFlow } from '../../../redux/features/rewardSystemSlice';
import { canUpdateStatus, getAllowedTransitions, isValidTransition } from '../../../utils/cashFlowUtils';
import { toast } from 'react-hot-toast';
import { RefreshCw, DollarSign, Clock, CheckCircle, XCircle, AlertCircle, Filter, TrendingUp, Users, Activity } from 'lucide-react';

const CashFlowTab = () => {
    const dispatch = useDispatch();
    const { cashFlows, cashFlowStats, loading, error } = useSelector((state) => ({
        cashFlows: state.rewardSystem?.cashFlows || [],
        cashFlowStats: state.rewardSystem?.cashFlowStats || {},
        loading: state.rewardSystem?.loading || false,
        error: state.rewardSystem?.error || null
    }));
    
    const [filterStatus, setFilterStatus] = useState('all');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        dispatch(fetchAllCashFlows());
        dispatch(fetchCashFlowStats());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    // Debug: Log current statistics
    useEffect(() => {
        console.log('Current Cash Flow Statistics:', cashFlowStats);
        console.log('Current Cash Flows:', cashFlows.map(cf => ({ id: cf.id, status: cf.status, amount: cf.amount })));
    }, [cashFlowStats, cashFlows]);

    const refreshData = async () => {
        setIsRefreshing(true);
        try {
            await Promise.all([
                dispatch(fetchAllCashFlows()).unwrap(),
                dispatch(fetchCashFlowStats()).unwrap()
            ]);
            toast.success('Data refreshed successfully');
        } catch (error) {
            console.error('Refresh error:', error);
            toast.error('Failed to refresh data');
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleStatusUpdate = async (requestId, newStatus) => {
        try {
            // Validate the transition before making the API call
            const currentRequest = cashFlows.find(cf => cf.id === requestId);
            if (!currentRequest) {
                toast.error('Request not found');
                return;
            }

            if (!isValidTransition(currentRequest.status, newStatus)) {
                toast.error(`Invalid status transition from ${currentRequest.status} to ${newStatus}`);
                return;
            }

            if (newStatus === 'ACCEPTED') {
                await dispatch(acceptCashFlow({ id: requestId, notes })).unwrap();
                toast.success('Payment request accepted successfully');
            } else if (newStatus === 'REJECTED') {
                await dispatch(rejectCashFlow({ id: requestId, notes })).unwrap();
                toast.success('Payment request rejected successfully');
            } else {
                await dispatch(updateCashFlowStatus({ id: requestId, status: newStatus, notes })).unwrap();
                toast.success(`Payment request status updated to ${newStatus}`);
            }
            
            // Refresh both cash flows and statistics to ensure UI is up to date
            await Promise.all([
                dispatch(fetchAllCashFlows()).unwrap(),
                dispatch(fetchCashFlowStats()).unwrap()
            ]);
            
            setShowNotesModal(false);
            setSelectedRequest(null);
            setNotes('');
        } catch (error) {
            console.error('Status update error:', error);
            toast.error('Failed to update status');
        }
    };

    const openStatusModal = (request, status) => {
        // Validate the transition before opening modal
        if (!isValidTransition(request.status, status)) {
            toast.error(`Invalid status transition from ${request.status} to ${status}`);
            return;
        }
        setSelectedRequest({ ...request, newStatus: status });
        setShowNotesModal(true);
        setNotes('');
    };

    const getStatusIcon = (status) => {
        switch (status.toUpperCase()) {
            case 'PENDING':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'ACCEPTED':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'REJECTED':
                return <XCircle className="w-4 h-4 text-red-500" />;
            // case 'PROCESSING':
            //     return <Activity className="w-4 h-4 text-blue-500" />;
            case 'COMPLETED':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            default:
                return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusBadge = (status) => {
        const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
        switch (status.toUpperCase()) {
            case 'PENDING':
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case 'ACCEPTED':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'REJECTED':
                return `${baseClasses} bg-red-100 text-red-800`;
                // case 'PROCESSING':
                //     return `${baseClasses} bg-blue-100 text-blue-800`;
            case 'COMPLETED':
                return `${baseClasses} bg-green-100 text-green-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    const filteredRequests = cashFlows.filter(request => {
        if (filterStatus === 'all') return true;
        return request.status.toUpperCase() === filterStatus.toUpperCase();
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getAvailableActions = (request) => {
        const allowedTransitions = getAllowedTransitions(request.status);
        return allowedTransitions.map(status => ({
            status,
            label: status.charAt(0) + status.slice(1).toLowerCase(),
            className: status === 'ACCEPTED' 
                ? 'text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100'
                : status === 'REJECTED'
                ? 'text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100'
                : 'text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100'
        }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Payment Requests</h2>
                    <p className="text-gray-600">Manage user payment requests and update their status</p>
                </div>
                <button
                    onClick={refreshData}
                    disabled={isRefreshing}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Requests</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {isRefreshing ? '...' : (cashFlowStats.total || 0)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Pending</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {isRefreshing ? '...' : (cashFlowStats.pending || 0)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Accepted</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {isRefreshing ? '...' : (cashFlowStats.accepted || 0)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <XCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Rejected</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {isRefreshing ? '...' : (cashFlowStats.rejected || 0)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-4">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Filter by status:</span>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="all">All Requests</option>
                        <option value="pending">Pending</option>
                        {/* <option value="processing">Processing</option> */}
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>

            {/* Requests Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payment Method
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Request Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        <DollarSign className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                                        <p className="text-lg font-medium">No payment requests found</p>
                                        <p className="text-sm">There are no payment requests matching your criteria.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredRequests.map((request) => (
                                    <tr key={request.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                                        <span className="text-sm font-medium text-purple-600">
                                                            {request.user?.name?.charAt(0) || 'U'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {request.user?.name || 'Unknown User'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {request.user?.email || 'No email'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {formatCurrency(request.amount)}
                                            </div>
                                            {request.transactionReference && (
                                                <div className="text-sm text-gray-500">
                                                    Ref: {request.transactionReference}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {request.paymentMethod || 'Not specified'}
                                            </div>
                                            {request.bankEmail && (
                                                <div className="text-sm text-gray-500">
                                                    {request.bankEmail}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                {getStatusIcon(request.status)}
                                                <span className={getStatusBadge(request.status)}>
                                                    {request.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(request.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {canUpdateStatus(request.status) && (
                                                <div className="flex space-x-2">
                                                    {getAvailableActions(request).map((action) => (
                                                        <button
                                                            key={action.status}
                                                            onClick={() => openStatusModal(request, action.status)}
                                                            className={`px-3 py-1 rounded-md text-xs font-medium ${action.className}`}
                                                        >
                                                            {action.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                            {!canUpdateStatus(request.status) && (
                                                <span className="text-gray-400 text-xs">
                                                    Status updated
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Notes Modal */}
            {showNotesModal && selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Update Status to {selectedRequest.newStatus}
                        </h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notes (optional)
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                rows="3"
                                placeholder="Add notes about this status change..."
                            />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowNotesModal(false);
                                    setSelectedRequest(null);
                                    setNotes('');
                                }}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleStatusUpdate(selectedRequest.id, selectedRequest.newStatus)}
                                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                            >
                                Update Status
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
            )}
        </div>
    );
};

export default CashFlowTab;

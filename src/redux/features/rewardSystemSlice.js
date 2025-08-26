import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_CONFIG, getApiUrl, getAuthHeaders, handleApiError } from '../../config/api';

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
    const defaultOptions = {
        headers: getAuthHeaders(),
        ...options,
    };

    const response = await fetch(getApiUrl(endpoint), {
        ...defaultOptions,
        ...options,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
};

// Helper function to recalculate statistics from cash flows
const recalculateStats = (state) => {
    const stats = {
        total: state.cashFlows.length,
        pending: 0,
        accepted: 0,
        rejected: 0,
        processing: 0,
        completed: 0,
        totalAmount: 0
    };

    state.cashFlows.forEach(cashFlow => {
        const status = cashFlow.status.toUpperCase();
        const amount = parseFloat(cashFlow.amount) || 0;
        
        stats.totalAmount += amount;
        
        switch (status) {
            case 'PENDING':
                stats.pending++;
                break;
            case 'ACCEPTED':
                stats.accepted++;
                break;
            case 'REJECTED':
                stats.rejected++;
                break;
            case 'PROCESSING':
                stats.processing++;
                break;
            case 'COMPLETED':
                stats.completed++;
                break;
        }
    });

    state.cashFlowStats = stats;
};

// Fetch all reward steps
export const fetchRewardSteps = createAsyncThunk(
    'rewardSystem/fetchSteps',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiCall(API_CONFIG.ENDPOINTS.REWARD_STEPS);
            return response.data;
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

// Save new reward step
export const saveRewardStep = createAsyncThunk(
    'rewardSystem/saveStep',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiCall(API_CONFIG.ENDPOINTS.REWARD_STEPS, {
                method: 'POST',
                body: JSON.stringify(data)
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

// Update reward step
export const updateRewardStep = createAsyncThunk(
    'rewardSystem/updateStep',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await apiCall(API_CONFIG.ENDPOINTS.REWARD_STEP_BY_ID(id), {
                method: 'PUT',
                body: JSON.stringify(data)
            });

            // Handle different response formats from backend
            let updatedStep, allSteps;

            if (response.data && response.data.updatedStep) {
                // Backend returns { data: { updatedStep: {...}, allSteps: [...] } }
                updatedStep = response.data.updatedStep;
                allSteps = response.data.allSteps;
            } else if (response.data && Array.isArray(response.data)) {
                // Backend returns { data: [...] } - array of all steps
                allSteps = response.data;
                updatedStep = response.data.find(step => step.id === id);
            } else if (response.data) {
                // Backend returns { data: {...} } - single updated step
                updatedStep = response.data;
                allSteps = [response.data];
            } else {
                // Fallback
                updatedStep = response;
                allSteps = [response];
            }

            return {
                id,
                data: updatedStep,
                allSteps: allSteps
            };
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

// Delete reward step
export const deleteRewardStep = createAsyncThunk(
    'rewardSystem/deleteStep',
    async (id, { rejectWithValue }) => {
        try {
            await apiCall(API_CONFIG.ENDPOINTS.REWARD_STEP_BY_ID(id), {
                method: 'DELETE'
            });
            return id;
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

// Fetch coin conversion rate
export const fetchCoinConversionRate = createAsyncThunk(
    'rewardSystem/fetchConversionRate',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiCall(API_CONFIG.ENDPOINTS.CONVERSION_RATE);
            return response.data;
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

// Update coin conversion rate
export const updateCoinConversionRate = createAsyncThunk(
    'rewardSystem/updateConversionRate',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiCall(API_CONFIG.ENDPOINTS.CONVERSION_RATE, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

// Payment Methods
export const fetchPaymentMethods = createAsyncThunk(
    'rewardSystem/fetchPaymentMethods',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiCall(API_CONFIG.ENDPOINTS.PAYMENT_METHODS);
            return response.data;
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

export const savePaymentMethod = createAsyncThunk(
    'rewardSystem/savePaymentMethod',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiCall(API_CONFIG.ENDPOINTS.PAYMENT_METHODS, {
                method: 'POST',
                body: JSON.stringify(data)
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

export const updatePaymentMethod = createAsyncThunk(
    'rewardSystem/updatePaymentMethod',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await apiCall(API_CONFIG.ENDPOINTS.PAYMENT_METHOD_BY_ID(id), {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

export const deletePaymentMethod = createAsyncThunk(
    'rewardSystem/deletePaymentMethod',
    async (id, { rejectWithValue }) => {
        try {
            await apiCall(API_CONFIG.ENDPOINTS.PAYMENT_METHOD_BY_ID(id), {
                method: 'DELETE'
            });
            return id;
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

// Cash Flow - Payment Requests
export const fetchAllCashFlows = createAsyncThunk(
    'rewardSystem/fetchAllCashFlows',
    async (filters = {}, { rejectWithValue }) => {
        try {
            const queryParams = new URLSearchParams();
            if (filters.status) queryParams.append('status', filters.status);
            if (filters.userId) queryParams.append('userId', filters.userId);
            if (filters.paymentMethod) queryParams.append('paymentMethod', filters.paymentMethod);
            
            const endpoint = queryParams.toString() 
                ? `${API_CONFIG.ENDPOINTS.CASH_FLOW}?${queryParams.toString()}`
                : API_CONFIG.ENDPOINTS.CASH_FLOW;
                
            const response = await apiCall(endpoint);
            return response.data || response; // Handle both array and object responses
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

export const fetchCashFlowById = createAsyncThunk(
    'rewardSystem/fetchCashFlowById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiCall(API_CONFIG.ENDPOINTS.CASH_FLOW_BY_ID(id));
            return response.data || response;
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

export const fetchCashFlowStats = createAsyncThunk(
    'rewardSystem/fetchCashFlowStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiCall(API_CONFIG.ENDPOINTS.CASH_FLOW_STATS);
            return response.data || response;
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

export const updateCashFlowStatus = createAsyncThunk(
    'rewardSystem/updateCashFlowStatus',
    async ({ id, status, notes }, { rejectWithValue }) => {
        try {
            const response = await apiCall(API_CONFIG.ENDPOINTS.UPDATE_CASH_FLOW_STATUS(id), {
                method: 'PUT',
                body: JSON.stringify({ status, notes })
            });
            return { id, status, notes, data: response.data || response };
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

export const acceptCashFlow = createAsyncThunk(
    'rewardSystem/acceptCashFlow',
    async ({ id, notes }, { rejectWithValue }) => {
        try {
            const response = await apiCall(API_CONFIG.ENDPOINTS.ACCEPT_CASH_FLOW(id), {
                method: 'PUT',
                body: JSON.stringify({ notes })
            });
            return { id, status: 'ACCEPTED', notes, data: response.data || response };
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

export const rejectCashFlow = createAsyncThunk(
    'rewardSystem/rejectCashFlow',
    async ({ id, notes }, { rejectWithValue }) => {
        try {
            const response = await apiCall(API_CONFIG.ENDPOINTS.REJECT_CASH_FLOW(id), {
                method: 'PUT',
                body: JSON.stringify({ notes })
            });
            return { id, status: 'REJECTED', notes, data: response.data || response };
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

const initialState = {
    rewardSteps: [],
    paymentMethods: [],
    conversionRate: {
        coinsPerDollar: 100,
        isActive: true
    },
    // Cash Flow state
    cashFlows: [],
    cashFlowStats: {
        total: 0,
        pending: 0,
        accepted: 0,
        rejected: 0,
        processing: 0,
        completed: 0,
        totalAmount: 0
    },
    selectedCashFlow: null,
    loading: false,
    error: null
};

const rewardSystemSlice = createSlice({
    name: 'rewardSystem',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearRewardSteps: (state) => {
            state.rewardSteps = [];
        },
        clearCashFlowError: (state) => {
            state.error = null;
        },
        clearSelectedCashFlow: (state) => {
            state.selectedCashFlow = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch reward steps
            .addCase(fetchRewardSteps.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRewardSteps.fulfilled, (state, action) => {
                state.loading = false;
                state.rewardSteps = action.payload || [];
            })
            .addCase(fetchRewardSteps.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Save reward step
            .addCase(saveRewardStep.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveRewardStep.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.rewardSteps.push(action.payload);
                }
            })
            .addCase(saveRewardStep.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update reward step
            .addCase(updateRewardStep.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateRewardStep.fulfilled, (state, action) => {
                state.loading = false;
                // Update all steps with redistributed values from backend
                if (action.payload.allSteps && Array.isArray(action.payload.allSteps)) {
                    state.rewardSteps = action.payload.allSteps;
                } else if (action.payload.data) {
                    // Fallback to single step update
                    const index = state.rewardSteps.findIndex(step => step.id === action.payload.id);
                    if (index !== -1) {
                        state.rewardSteps[index] = action.payload.data;
                    }
                }
            })
            .addCase(updateRewardStep.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete reward step
            .addCase(deleteRewardStep.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteRewardStep.fulfilled, (state, action) => {
                state.loading = false;
                state.rewardSteps = state.rewardSteps.filter(step => step.id !== action.payload);
            })
            .addCase(deleteRewardStep.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch conversion rate
            .addCase(fetchCoinConversionRate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCoinConversionRate.fulfilled, (state, action) => {
                state.loading = false;
                state.conversionRate = action.payload || { coinsPerDollar: 100, isActive: true };
            })
            .addCase(fetchCoinConversionRate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update conversion rate
            .addCase(updateCoinConversionRate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCoinConversionRate.fulfilled, (state, action) => {
                state.loading = false;
                state.conversionRate = action.payload;
            })
            .addCase(updateCoinConversionRate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch payment methods
            .addCase(fetchPaymentMethods.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentMethods = action.payload || [];
            })
            .addCase(fetchPaymentMethods.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Save payment method
            .addCase(savePaymentMethod.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(savePaymentMethod.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.paymentMethods.push(action.payload);
                }
            })
            .addCase(savePaymentMethod.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update payment method
            .addCase(updatePaymentMethod.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePaymentMethod.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.paymentMethods.findIndex(method => method.id === action.payload.id);
                if (index !== -1) {
                    state.paymentMethods[index] = action.payload;
                }
            })
            .addCase(updatePaymentMethod.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete payment method
            .addCase(deletePaymentMethod.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePaymentMethod.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentMethods = state.paymentMethods.filter(method => method.id !== action.payload);
            })
            .addCase(deletePaymentMethod.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch all cash flows
            .addCase(fetchAllCashFlows.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllCashFlows.fulfilled, (state, action) => {
                state.loading = false;
                state.cashFlows = action.payload;
                recalculateStats(state); // Recalculate stats after fetching cash flows
            })
            .addCase(fetchAllCashFlows.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch cash flow by ID
            .addCase(fetchCashFlowById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCashFlowById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedCashFlow = action.payload;
            })
            .addCase(fetchCashFlowById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch cash flow stats
            .addCase(fetchCashFlowStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCashFlowStats.fulfilled, (state, action) => {
                state.loading = false;
                state.cashFlowStats = action.payload;
            })
            .addCase(fetchCashFlowStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update cash flow status
            .addCase(updateCashFlowStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCashFlowStatus.fulfilled, (state, action) => {
                state.loading = false;
                // Update the cash flow in the list
                const index = state.cashFlows.findIndex(cf => cf.id === action.payload.id);
                if (index !== -1) {
                    state.cashFlows[index] = action.payload.data;
                }
                // Update selected cash flow if it's the same one
                if (state.selectedCashFlow && state.selectedCashFlow.id === action.payload.id) {
                    state.selectedCashFlow = action.payload.data;
                }
                recalculateStats(state); // Recalculate stats after updating cash flow status
            })
            .addCase(updateCashFlowStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Accept cash flow
            .addCase(acceptCashFlow.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(acceptCashFlow.fulfilled, (state, action) => {
                state.loading = false;
                // Update the cash flow in the list
                const index = state.cashFlows.findIndex(cf => cf.id === action.payload.id);
                if (index !== -1) {
                    state.cashFlows[index] = action.payload.data;
                }
                recalculateStats(state); // Recalculate stats after accepting cash flow
            })
            .addCase(acceptCashFlow.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Reject cash flow
            .addCase(rejectCashFlow.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(rejectCashFlow.fulfilled, (state, action) => {
                state.loading = false;
                // Update the cash flow in the list
                const index = state.cashFlows.findIndex(cf => cf.id === action.payload.id);
                if (index !== -1) {
                    state.cashFlows[index] = action.payload.data;
                }
                recalculateStats(state); // Recalculate stats after rejecting cash flow
            })
            .addCase(rejectCashFlow.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, clearRewardSteps, clearCashFlowError, clearSelectedCashFlow } = rewardSystemSlice.actions;
export default rewardSystemSlice.reducer;

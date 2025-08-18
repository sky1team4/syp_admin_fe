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

const initialState = {
    rewardSteps: [],
    paymentMethods: [],
    conversionRate: {
        coinsPerDollar: 100,
        isActive: true
    },
    isLoading: false,
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
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch reward steps
            .addCase(fetchRewardSteps.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchRewardSteps.fulfilled, (state, action) => {
                state.isLoading = false;
                state.rewardSteps = action.payload;
            })
            .addCase(fetchRewardSteps.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Save reward step
            .addCase(saveRewardStep.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(saveRewardStep.fulfilled, (state, action) => {
                state.isLoading = false;
                state.rewardSteps.push(action.payload);
            })
            .addCase(saveRewardStep.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Update reward step
            .addCase(updateRewardStep.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateRewardStep.fulfilled, (state, action) => {
                state.isLoading = false;
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
                state.isLoading = false;
                state.error = action.payload;
            })
            // Delete reward step
            .addCase(deleteRewardStep.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteRewardStep.fulfilled, (state, action) => {
                state.isLoading = false;
                state.rewardSteps = state.rewardSteps.filter(step => step.id !== action.payload);
            })
            .addCase(deleteRewardStep.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch conversion rate
            .addCase(fetchCoinConversionRate.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCoinConversionRate.fulfilled, (state, action) => {
                state.isLoading = false;
                state.conversionRate = action.payload;
            })
            .addCase(fetchCoinConversionRate.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Update conversion rate
            .addCase(updateCoinConversionRate.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateCoinConversionRate.fulfilled, (state, action) => {
                state.isLoading = false;
                state.conversionRate = action.payload;
            })
            .addCase(updateCoinConversionRate.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch payment methods
            .addCase(fetchPaymentMethods.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
                state.isLoading = false;
                state.paymentMethods = action.payload;
            })
            .addCase(fetchPaymentMethods.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Save payment method
            .addCase(savePaymentMethod.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(savePaymentMethod.fulfilled, (state, action) => {
                state.isLoading = false;
                state.paymentMethods.push(action.payload);
            })
            .addCase(savePaymentMethod.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Update payment method
            .addCase(updatePaymentMethod.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updatePaymentMethod.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.paymentMethods.findIndex(method => method.id === action.payload.id);
                if (index !== -1) {
                    state.paymentMethods[index] = action.payload;
                }
            })
            .addCase(updatePaymentMethod.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Delete payment method
            .addCase(deletePaymentMethod.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deletePaymentMethod.fulfilled, (state, action) => {
                state.isLoading = false;
                state.paymentMethods = state.paymentMethods.filter(method => method.id !== action.payload);
            })
            .addCase(deletePaymentMethod.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, clearRewardSteps } = rewardSystemSlice.actions;
export default rewardSystemSlice.reducer;

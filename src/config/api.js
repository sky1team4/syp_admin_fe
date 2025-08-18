// API Configuration
export const API_CONFIG = {
    // Base URL for API calls
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',

    // API Endpoints
    ENDPOINTS: {
        // Reward System
        REWARD_STEPS: '/api/reward-system/steps',
        REWARD_STEP_BY_ID: (id) => `/api/reward-system/steps/${id}`,
        CONVERSION_RATE: '/api/reward-system/conversion-rate',

        // Add other endpoints here as needed
    },

    // Request timeout (in milliseconds)
    TIMEOUT: 10000,

    // Retry configuration
    RETRY: {
        MAX_ATTEMPTS: 3,
        DELAY: 1000,
    }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
};

// Helper function to handle API errors
export const handleApiError = (error) => {
    if (error.response) {
        // Server responded with error status
        return error.response.data?.error || `HTTP ${error.response.status}: ${error.response.statusText}`;
    } else if (error.request) {
        // Network error
        return 'Network error: Unable to connect to server';
    } else {
        // Other error
        return error.message || 'An unexpected error occurred';
    }
};

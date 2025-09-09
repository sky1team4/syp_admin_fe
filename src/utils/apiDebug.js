// API Debug Utility
export const debugApiResponse = (endpoint, response, method = 'GET') => {
    console.group(`🔍 API Debug: ${method} ${endpoint}`);
    console.log('Full Response:', response);
    console.log('Response Type:', typeof response);
    console.log('Response.data:', response.data);
    console.log('Response.data Type:', typeof response.data);

    if (response.data && Array.isArray(response.data)) {
        console.log('Response.data is Array with length:', response.data.length);
        console.log('First item:', response.data[0]);
    }

    if (response.data && typeof response.data === 'object') {
        console.log('Response.data Keys:', Object.keys(response.data));
    }

    console.groupEnd();
};

// Enhanced API call with debugging
export const apiCallWithDebug = async (endpoint, options = {}) => {
    const { API_CONFIG, getApiUrl, getAuthHeaders, handleApiError } = await import('../config/api');

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

    const data = await response.json();

    // Debug the response
    debugApiResponse(endpoint, data, options.method || 'GET');

    return data;
};

// API Configuration
// Change this to your backend URL
const API_BASE_URL = window.location.origin.includes('localhost') 
    ? 'http://localhost:5000/api'
    : '/api';

// API Endpoints
const API = {
    // Auth endpoints
    SIGNUP: `${API_BASE_URL}/auth/signup`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    ME: `${API_BASE_URL}/auth/me`,
    
    // Student endpoints
    STUDENTS: `${API_BASE_URL}/students`,
    STUDENT_BY_ID: (id) => `${API_BASE_URL}/students/${id}`,
    SEARCH_STUDENT: (studentId) => `${API_BASE_URL}/students/search/${studentId}`,
    DASHBOARD_STATS: `${API_BASE_URL}/students/stats/dashboard`,
    EXPORT_CSV: `${API_BASE_URL}/students/export/csv`,
};

// Helper function to get auth token
function getAuthToken() {
    return localStorage.getItem('token');
}

// Helper function to get auth headers
function getAuthHeaders() {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// Helper function for API calls
async function apiCall(url, options = {}) {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...getAuthHeaders(),
                ...options.headers
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

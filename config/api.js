// API Configuration for different environments
const API_CONFIG = {
  development: 'http://localhost:8000',
  production: 'http://localhost:8000' // For now, keep localhost in production too
};

export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? API_CONFIG.production 
  : API_CONFIG.development;

export const API_ENDPOINTS = {
  ADMIN: {
    UPLOAD_DOCUMENT: `${API_BASE_URL}/api/admin/upload-document`,
    STATS: `${API_BASE_URL}/api/admin/stats`,
    DOCUMENTS: `${API_BASE_URL}/api/admin/documents`
  },
  CHAT: `${API_BASE_URL}/api/chat`,
  COMPLEXITY: `${API_BASE_URL}/api/complexity`,
  HEALTH: `${API_BASE_URL}/api/health`
};

// Helper function for API requests with error handling
export async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}
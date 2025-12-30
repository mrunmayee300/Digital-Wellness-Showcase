import axios from 'axios';

// API base URL - uses environment variable or defaults to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * API Service
 * Handles all API calls to the backend
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

/**
 * Upload student work
 * @param {FormData} formData - Form data containing file and metadata
 * @param {Function} onUploadProgress - Progress callback
 * @returns {Promise} Upload response
 */
export const uploadWork = async (formData, onUploadProgress) => {
  try {
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        }
      },
    });
    return response.data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error.response?.data || { error: "Upload failed" };
  }
};

/**
 * Get all works with optional filters
 * @param {Object} filters - Filter options (category, search, sort)
 * @returns {Promise} Works list
 */
export const getWorks = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/works?${params}`);
    return response.data;
  } catch (error) {
    console.error("Get works error:", error);
    throw error.response?.data || { error: "Failed to fetch works" };
  }
};

/**
 * Get single work by ID
 * @param {string} id - Work ID
 * @returns {Promise} Work details
 */
export const getWorkById = async (id) => {
  try {
    const response = await api.get(`/works/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get work error:", error);
    throw error.response?.data || { error: "Work not found" };
  }
};

export default api;

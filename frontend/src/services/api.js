import axios from 'axios';

// API base URL - uses environment variable or defaults to localhost for dev
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Axios instance used for all backend requests
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

/**
 * Upload a work with file + metadata
 * @param {File} file - uploaded file
 * @param {Object} metadata - title, category, etc.
 * @param {Function} onUploadProgress - upload progress handler
 */
export const uploadWork = async (file, metadata, onUploadProgress) => {
  try {
    const formData = new FormData();
    formData.append('file', file); // REQUIRED — backend expects "file"

    // Required metadata fields
    Object.entries(metadata).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (event) => {
        if (onUploadProgress && event.total) {
          const percent = Math.round((event.loaded * 100) / event.total);
          onUploadProgress(percent);
        }
      }
    });

    return response.data;
  } catch (error) {
    console.error("🚫 Upload failed:", error.response?.data || error.message);
    throw error.response?.data || { error: "Upload failed" };
  }
};

/**
 * Fetch all works with filters
 */
export const getWorks = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/works?${params}`);
    return response.data;
  } catch (error) {
    console.error("🚫 Fetch works failed:", error.response?.data || error.message);
    throw error.response?.data || { error: "Failed to fetch works" };
  }
};

/**
 * Fetch single work by ID
 */
export const getWorkById = async (id) => {
  try {
    const response = await api.get(`/works/${id}`);
    return response.data;
  } catch (error) {
    console.error("🚫 Fetch work failed:", error.response?.data || error.message);
    throw error.response?.data || { error: "Work not found" };
  }
};

export default api;

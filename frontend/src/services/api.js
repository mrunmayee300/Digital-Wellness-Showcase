import axios from 'axios';

// API base URL - uses environment variable or defaults to localhost for dev
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Axios instance for backend communication
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

/**
 * Upload a work with file + metadata fields
 * @param {File} file
 * @param {Object} metadata - title, category, description, etc.
 * @param {Function} onUploadProgress
 */
export const uploadWork = async (file, metadata, onUploadProgress) => {
  try {
    const formData = new FormData();

    // File (backend expects key = "file")
    formData.append("file", file);

    // Additional metadata fields
    Object.entries(metadata).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress: event => {
        if (onUploadProgress && event.total) {
          const percent = Math.round((event.loaded * 100) / event.total);
          onUploadProgress(percent);
        }
      }
    });

    return response.data;

  } catch (error) {
    console.error("🚫 Full upload error:", error.response?.data);
    alert(JSON.stringify(error.response?.data, null, 2)); // Shows exact missing fields
    throw error.response?.data || { error: "Upload failed" };
  }
};

/**
 * Fetch all works
 */
export const getWorks = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/works?${params}`);
    return response.data;
  } catch (error) {
    console.error("🚫 Fetch works failed:", error.response?.data);
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
    console.error("🚫 Fetch work failed:", error.response?.data);
    throw error.response?.data || { error: "Work not found" };
  }
};

export default api;

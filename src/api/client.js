// src/api/client.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8000"; // later .env la set pannalam

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Attach admin token (if available)
apiClient.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("admin_access_token");
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }
  return config;
});

export default apiClient;

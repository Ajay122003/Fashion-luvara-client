import axios from "axios";
import { getAdminToken } from "../utils/storage";

const apiClient = axios.create({
  baseURL: "http://localhost:8000", // change to your backend URL
  withCredentials: false,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getAdminToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;

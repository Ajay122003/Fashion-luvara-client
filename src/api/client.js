import axios from "axios";
import storage from "../utils/storage"; // UNIVERSAL TOKEN STORAGE

const apiClient = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: false,
});

apiClient.interceptors.request.use(
  (config) => {
    // PRIORITY 1 → Admin token
    let token = storage.getAdminToken();

    // PRIORITY 2 → User token
    if (!token) {
      token = storage.getUserToken();
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;

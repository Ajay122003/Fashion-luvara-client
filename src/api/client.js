import axios from "axios";
import storage from "../utils/storage";

const apiClient = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: false,
});

/* ================= REQUEST INTERCEPTOR ================= */
apiClient.interceptors.request.use(
  (config) => {
    const token = storage.getUserToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    const path = window.location.pathname;

    // ❌ Ignore logout endpoint errors
    if (url.includes("/api/auth/logout/")) {
      return Promise.reject(error);
    }

    if (status === 401) {
      storage.clearUserToken();

      // ❌ Don't touch admin routes
      if (!path.startsWith("/admin") && path !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);


export default apiClient;

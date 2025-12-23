import axios from "axios";
import storage from "../utils/storage";

const adminClient = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: false,
});

adminClient.interceptors.request.use(
  (config) => {
    const token = storage.getAdminToken(); // ✅ ADMIN TOKEN ONLY

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

//  auto logout admin if token invalid
adminClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      storage.clearAdminToken();
      window.location.href = "/admin/login";
    }
    return Promise.reject(err);
  }
);

export default adminClient;

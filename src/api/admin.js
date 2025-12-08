// src/api/admin.js
import apiClient from "./client";

// Admin login
export const adminLogin = async (email, password) => {
  const res = await apiClient.post("/api/admin-panel/login/", {
    email,
    password,
  });
  return res.data;
};

// Dashboard stats
export const fetchDashboardStats = async () => {
  const res = await apiClient.get("/api/admin-panel/dashboard/");
  return res.data;
};


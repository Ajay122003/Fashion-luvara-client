import apiClient from "./client";

/* -----------------------------------------------
   ADMIN LOGIN (STEP 1 → PASSWORD VERIFY)
------------------------------------------------ */
export const adminLoginStep1 = async (email, password) => {
  const res = await apiClient.post("/api/admin-panel/login/", { email, password });
  return res.data; 
};

/* -----------------------------------------------
   ADMIN LOGIN (STEP 2 → OTP VERIFY)
------------------------------------------------ */
export const adminLoginVerifyOTP = async (email, otp) => {
  const res = await apiClient.post("/api/admin-panel/verify-otp/", { email, otp });
  return res.data; 
};

/* -----------------------------------------------
   DASHBOARD STATS
------------------------------------------------ */
export const fetchAdminDashboardStats = async () => {
  const res = await apiClient.get("/api/admin-panel/dashboard/");
  return res.data;
};

/* -----------------------------------------------
   PRODUCTS CRUD
------------------------------------------------ */
export const fetchAdminProducts = async () => {
  const res = await apiClient.get("/api/admin-panel/products/");
  return res.data;
};

export const createAdminProduct = async (formData) => {
  const res = await apiClient.post("/api/admin-panel/products/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateAdminProduct = async (id, formData) => {
  const res = await apiClient.put(`/api/admin-panel/products/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteAdminProduct = async (id) => {
  const res = await apiClient.delete(`/api/admin-panel/products/${id}/`);
  return res.data;
};

/* -----------------------------------------------
   CATEGORIES CRUD
------------------------------------------------ */
export const fetchAdminCategories = async () => {
  const res = await apiClient.get("/api/admin-panel/categories/");
  return res.data;
};

export const fetchSingleAdminCategory = async (id) => {
  const res = await apiClient.get(`/api/admin-panel/categories/${id}/`);
  return res.data;
};

export const createAdminCategory = async (formData) => {
  const res = await apiClient.post("/api/admin-panel/categories/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateAdminCategory = async (id, formData) => {
  const res = await apiClient.put(`/api/admin-panel/categories/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteAdminCategory = async (id) => {
  const res = await apiClient.delete(`/api/admin-panel/categories/${id}/`);
  return res.data;
};

/* -----------------------------------------------
   SITE SETTINGS (COD / RETURN / CANCEL)
------------------------------------------------ */
export const updateSiteSettings = async (payload) => {
  const res = await apiClient.put("/api/admin-panel/settings/", payload);
  return res.data;
};

export const fetchSiteSettings = async () => {
  const res = await apiClient.get("/api/admin-panel/settings/");
  return res.data;
};


/* -----------------------------------------------
   ORDER MANAGEMENT
------------------------------------------------ */

// Get all orders
export const fetchAdminOrders = async (status = "") => {
  const res = await apiClient.get(`/api/admin-panel/orders/?status=${status}`);
  return res.data;
};

// Get order details
export const fetchAdminOrderDetails = async (id) => {
  const res = await apiClient.get(`/api/admin-panel/orders/${id}/`);
  return res.data;
};

// Update order status
export const updateAdminOrder = async (id, data) => {
  const res = await apiClient.put(`/api/admin-panel/orders/${id}/`, data);
  return res.data;
};

/* -----------------------------------------------
   user list
------------------------------------------------ */

export const fetchAdminUsers = async () => {
  const res = await apiClient.get("/api/admin-panel/users/");
  return res.data;
};
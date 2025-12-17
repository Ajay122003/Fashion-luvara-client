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
   user list
------------------------------------------------ */

export const fetchAdminUsers = async () => {
  const res = await apiClient.get("/api/admin-panel/users/");
  return res.data;
};

export const fetchAdminSubscriptions = async () => {
  const res = await apiClient.get("/api/admin-panel/subscriptions/");
  return res.data;
};


/* -----------------------------------------------
   DASHBOARD STATS
------------------------------------------------ */
export const fetchAdminDashboardStats = async () => {
  const res = await apiClient.get("/api/admin-panel/dashboard/");
  return res.data;
};

export const fetchLowStockProducts = async () => {
  const res = await apiClient.get("/api/admin-panel/low-stock-products/");
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
export const deleteProductImage = async (imageId) => {
  const res = await apiClient.delete(
    `/api/admin-panel/products/images/${imageId}/delete/`
  );
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
   COLLECTIONS CRUD (ADMIN)
------------------------------------------------ */

// Get all collections
export const fetchAdminCollections = async () => {
  const res = await apiClient.get("/api/admin-panel/collections/");
  return res.data;
};

// Get a single collection
export const fetchSingleAdminCollection = async (id) => {
  const res = await apiClient.get(`/api/admin-panel/collections/${id}/`);
  return res.data;
};

// Create a collection
export const createAdminCollection = async (formData) => {
  const res = await apiClient.post("/api/admin-panel/collections/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Update a collection
export const updateAdminCollection = async (id, formData) => {
  const res = await apiClient.put(`/api/admin-panel/collections/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Delete a collection
export const deleteAdminCollection = async (id) => {
  const res = await apiClient.delete(`/api/admin-panel/collections/${id}/`);
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

export const fetchPublicSettings = async () => {
  const res = await apiClient.get("/api/admin-panel/public-settings/");
  return res.data;   // 🔥 IMPORTANT
};


// Update admin email
export const adminUpdateEmail = async (data) => {
  const res = await apiClient.put("/api/admin-panel/update-email/", data);
  return res.data;
};

// Update admin password
export const adminChangePassword = async (data) => {
  const res = await apiClient.put("/api/admin-panel/change-password/", data);
  return res.data;
};

/* -----------------------------------------------
   ORDER MANAGEMENT
------------------------------------------------ */

export const fetchAdminOrders = async (status = "") => {
  const url = status
    ? `/api/admin-panel/orders/?status=${status}`
    : `/api/admin-panel/orders/`;

  const res = await apiClient.get(url);
  return res.data;
};

export const fetchAdminOrderDetail = async (id) => {
  const res = await apiClient.get(`/api/admin-panel/orders/${id}/`);
  return res.data;
};

export const adminUpdateOrder = async (id, data) => {
  const res = await apiClient.put(`/api/admin-panel/orders/${id}/`, data);
  return res.data;
};




// ------------------ COUPONS ------------------

export const fetchAdminCoupons = async () => {
  const res = await apiClient.get("/api/admin-panel/coupons/");
  return res.data;
};

export const createAdminCoupon = async (data) => {
  const res = await apiClient.post("/api/admin-panel/coupons/", data);
  return res.data;
};

export const updateAdminCoupon = async (id, data) => {
  const res = await apiClient.put(`/api/admin-panel/coupons/${id}/`, data);
  return res.data;
};

export const deleteAdminCoupon = async (id) => {
  const res = await apiClient.delete(`/api/admin-panel/coupons/${id}/`);
  return res.data;
};

export const fetchSingleCoupon = async (id) => {
  const res = await apiClient.get(`/api/admin-panel/coupons/${id}/`);
  return res.data;
};

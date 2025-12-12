import apiClient from "./client";

/* ============================================================
   PUBLIC PRODUCT API
   ============================================================ */

// Get products with filtering, search, pagination
export const fetchProducts = async (params = {}) => {
  const res = await apiClient.get("/api/products/", { params });
  return res.data;
};

// Get single product detail
export const fetchProductDetail = async (id) => {
  const res = await apiClient.get(`/api/products/${id}/`);
  return res.data;
};



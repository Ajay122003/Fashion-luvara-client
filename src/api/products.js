// src/api/products.js
import publicClient from "./publicClient";

/* ============================================================
   PUBLIC PRODUCT API
   ============================================================ */

// Get products with filtering, search, pagination
export const fetchProducts = async (params = {}) => {
  const res = await publicClient.get("/api/products/", { params });
  return res.data;
};

// Get single product detail
export const fetchProductDetail = async (id) => {
  const res = await publicClient.get(`/api/products/${id}/`);
  return res.data;
};

//  GET RELATED PRODUCTS (YOU MAY ALSO LIKE)
export const fetchRelatedProducts = async (id) => {
  const res = await publicClient.get(
    `/api/products/${id}/related/`
  );
  return res.data;
};


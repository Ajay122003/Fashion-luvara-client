import apiClient from "./client";

// GET all products
export const getAdminProducts = async () => {
  const res = await apiClient.get("/api/admin-panel/products/");
  return res.data;
};

// DELETE product
export const deleteProduct = async (id) => {
  const res = await apiClient.delete(`/api/admin-panel/products/${id}/`);
  return res.data;
};

export const createProduct = async (formData) => {
  const res = await apiClient.post("/api/admin-panel/products/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateProduct = async (id, formData) => {
  const res = await apiClient.put(`/api/admin-panel/products/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteProductImage = async (imageId) => {
  const res = await apiClient.delete(`/api/admin-panel/delete-image/${imageId}/`);
  return res.data;
};

export const getProductDetails = async (id) => {
  const res = await apiClient.get(`/api/admin-panel/products/${id}/`);
  return res.data;
};



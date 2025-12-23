import apiClient from "./client";

// Add item to cart (variant based)
export const addToCart = ({ variant_id, quantity }) =>
  apiClient.post("/api/cart/add/", { variant_id, quantity });

// Get all cart items
export const getCartItems = async () => {
  const res = await apiClient.get("/api/cart/");
  return res.data;
};


// Update quantity
export const updateCartItem = (id, quantity) =>
  apiClient.put(`/api/cart/${id}/update/`, { quantity });

// Remove item
export const removeCartItem = (id) =>
  apiClient.delete(`/api/cart/${id}/remove/`);

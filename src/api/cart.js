import apiClient from "./client";

// Add item to cart
export const addToCart = (data) => apiClient.post("/api/cart/add/", data);

// Get all items
export const getCartItems = () => apiClient.get("/api/cart/");

// Update item quantity
export const updateCartItem = (id, qty) =>
  apiClient.put(`/api/cart/${id}/update/`, { quantity: qty });

// Remove item
export const removeCartItem = (id) =>
  apiClient.delete(`/api/cart/${id}/remove/`);

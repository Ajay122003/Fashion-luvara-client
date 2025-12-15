// src/api/wishlist.js
import apiClient from "./client";

/* ================= WISHLIST APIs ================= */

// Get all wishlist items
export const getWishlist = () =>
  apiClient.get("/api/wishlist/");

// Toggle wishlist (add / remove)
export const toggleWishlist = (productId) =>
  apiClient.post("/api/wishlist/toggle/", {
    product_id: productId,
  });

// Check wishlist status (heart icon)
export const getWishlistStatus = (productId) =>
  apiClient.get("/api/wishlist/status/", {
    params: { product_id: productId },
  });

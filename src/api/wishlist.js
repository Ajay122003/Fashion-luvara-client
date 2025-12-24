import apiClient from "./client";

/* ================= WISHLIST APIs (LOGIN USER ONLY) ================= */

// Get all wishlist items
export const getWishlist = async () => {
  const res = await apiClient.get("/api/wishlist/");
  return res.data;
};

// Toggle wishlist (add / remove)
export const toggleWishlist = async (productId) => {
  const res = await apiClient.post("/api/wishlist/toggle/", {
    product_id: productId,
  });
  return res.data;
};

// Check wishlist status (heart icon)
export const getWishlistStatus = async (productId) => {
  const res = await apiClient.get("/api/wishlist/status/", {
    params: { product_id: productId },
  });
  return res.data;
};

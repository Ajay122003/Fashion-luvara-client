import apiClient from "./client";

/* ================= ADD TO CART ================= */
export const addToCart = ({ variant_id, quantity = 1 }) =>
  apiClient.post("/api/cart/add/", { variant_id, quantity });

/* ================= GET CART ================= */
export const getCart = async () => {
  const res = await apiClient.get("/api/cart/");

  return {
    items: res.data.items || [],
    summary: res.data.summary || {
      subtotal: 0,
      total_items: 0,
      total_quantity: 0,
    },
  };
};

/* ================= UPDATE CART ITEM ================= */
export const updateCartItem = (id, quantity) =>
  apiClient.put(`/api/cart/${id}/update/`, { quantity });

/* ================= REMOVE CART ITEM ================= */
export const removeCartItem = (id) =>
  apiClient.delete(`/api/cart/${id}/remove/`);

/* ================= CLEAR CART ================= */
export const clearCart = () =>
  apiClient.delete("/api/cart/clear/");

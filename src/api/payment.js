import apiClient from "./client";

// Create Razorpay Order
export const createRazorpayOrder = async (orderId) => {
  const res = await apiClient.post("/api/payments/create/", {
    order_id: orderId,
  });
  return res.data;
};

// Verify Razorpay Payment
export const verifyRazorpayPayment = async (payload) => {
  const res = await apiClient.post("/api/payments/verify/", payload);
  return res.data;
};

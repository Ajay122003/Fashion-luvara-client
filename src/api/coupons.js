import apiClient from "./client";

export const applyCoupon = async (code, amount) => {
  const res = await apiClient.post("/api/coupons/apply/", {
    code,
    amount,
  });
  return res.data;
};

import apiClient from "./client";

export const createOrder = (data) =>
  apiClient.post("/api/orders/create/", data);

export const getMyOrders = async () => {
  const res = await apiClient.get("/api/orders/");
  return res.data;
};


export const getOrderDetail = (id) =>
  apiClient.get(`/api/orders/${id}/`);

export const cancelOrder = (id) =>
  apiClient.post(`/api/orders/${id}/cancel/`);


export const downloadInvoice = (id) =>
  apiClient.get(`/api/orders/${id}/invoice/`, {
    responseType: "blob",
  });


export const requestReturn = (id, reason) =>
  apiClient.post(`/api/orders/${id}/return/`, { reason });

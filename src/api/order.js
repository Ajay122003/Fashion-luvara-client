import apiClient from "./client";

export const createOrder = (data) =>
  apiClient.post("/api/orders/create/", data);

export const getMyOrders = () =>
  apiClient.get("/api/orders/");

export const getOrderDetail = (id) =>
  apiClient.get(`/api/orders/${id}/`);

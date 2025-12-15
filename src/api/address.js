import apiClient from "./client";

/* Get all addresses */
export const getAddresses = () =>
  apiClient.get("/api/address/");

/* Add new address */
export const addAddress = (data) =>
  apiClient.post("/api/address/", data);

/* Update address */
export const updateAddress = (id, data) =>
  apiClient.put(`/api/address/${id}/`, data);

/* Delete address */
export const deleteAddress = (id) =>
  apiClient.delete(`/api/address/${id}/`);

/* Set default address */
export const setDefaultAddress = (id) =>
  apiClient.post(`/api/address/${id}/set-default/`);

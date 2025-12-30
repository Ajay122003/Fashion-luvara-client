import apiClient from "./client";
import publicClient from "./publicClient";

export const registerUser = (data) => 
  apiClient.post("/api/auth/register/", data);

export const sendOtpLogin = (data) => 
  apiClient.post("/api/auth/login/send-otp/", data);

export const verifyOtpLogin = (data) => 
  apiClient.post("/api/auth/login/verify-otp/", data);

export const passwordLogin = (data) => 
  apiClient.post("/api/auth/login/", data);

export const getMe = async () => {
  const res = await apiClient.get("/api/auth/me/");
  return res.data;
};


export const updateProfile = (data) =>
  apiClient.put("/api/auth/me/update/", data);

export const logoutUser = (refresh) =>
  apiClient.post("/api/auth/logout/", { refresh });


export const globalSearch = (query) => {
  return publicClient.get(`/api/auth/search/?q=${query}`);
};
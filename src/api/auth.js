import apiClient from "./client";

export const registerUser = (data) => 
  apiClient.post("/api/auth/register/", data);

export const sendOtpLogin = (data) => 
  apiClient.post("/api/auth/login/send-otp/", data);

export const verifyOtpLogin = (data) => 
  apiClient.post("/api/auth/login/verify-otp/", data);

export const passwordLogin = (data) => 
  apiClient.post("/api/auth/login/", data);

export const getMe = () => 
  apiClient.get("/api/auth/me/");

export const logoutUser = (refresh) =>
  apiClient.post("/api/auth/logout/", { refresh });

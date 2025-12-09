import api from "./client";

// REGISTER
export const registerUser = (data) => api.post("/api/auth/register/", data);

// SEND OTP
export const sendLoginOTP = (data) =>
  api.post("/api/auth/login/send-otp/", data);

// VERIFY OTP
export const verifyLoginOTP = (data) =>
  api.post("/api/auth/login/verify-otp/", data);

// PASSWORD LOGIN (optional)
export const passwordLogin = (data) =>
  api.post("/api/auth/login/", data);

// GET USER PROFILE
export const fetchProfile = () => api.get("/api/auth/me/");

// LOGOUT
export const logoutUser = (refresh) =>
  api.post("/api/auth/logout/", { refresh });

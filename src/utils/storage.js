// =========================
// UNIVERSAL TOKEN HANDLING
// =========================

export const saveToken = (access, refresh = null) => {
  localStorage.setItem("user_access_token", access);
  if (refresh) localStorage.setItem("user_refresh_token", refresh);
};

export const getToken = () => {
  return (
    localStorage.getItem("user_access_token") ||
    localStorage.getItem("admin_access_token")
  );
};

export const removeToken = () => {
  localStorage.removeItem("user_access_token");
  localStorage.removeItem("user_refresh_token");
  localStorage.removeItem("admin_access_token");
  localStorage.removeItem("admin_refresh_token");
};


// ADMIN TOKEN STORAGE
export const saveAdminToken = (access, refresh) => {
  localStorage.setItem("admin_access_token", access);
  localStorage.setItem("admin_refresh_token", refresh);
};

export const getAdminToken = () => {
  return localStorage.getItem("admin_access_token");
};

export const clearAdminToken = () => {
  localStorage.removeItem("admin_access_token");
  localStorage.removeItem("admin_refresh_token");
};


// USER TOKEN STORAGE
export const saveUserToken = (access, refresh) => {
  localStorage.setItem("user_access_token", access);
  localStorage.setItem("user_refresh_token", refresh);
};

export const getUserToken = () => {
  return localStorage.getItem("user_access_token");
};

export const clearUserToken = () => {
  localStorage.removeItem("user_access_token");
  localStorage.removeItem("user_refresh_token");
};

export const getUserRefreshToken = () => {
  return localStorage.getItem("user_refresh_token");
};


// DEFAULT EXPORT
const storage = {
  saveToken,
  getToken,
  removeToken,
  saveAdminToken,
  getAdminToken,
  clearAdminToken,
  saveUserToken,
  getUserToken,
  clearUserToken,
  getUserRefreshToken,
};

export default storage;


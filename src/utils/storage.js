// =========================
// USER TOKEN STORAGE
// =========================
export const saveUserToken = (access, refresh) => {
  localStorage.setItem("user_access_token", access);
  localStorage.setItem("user_refresh_token", refresh);
};

export const getUserToken = () => {
  return localStorage.getItem("user_access_token");
};

export const getUserRefreshToken = () => {
  return localStorage.getItem("user_refresh_token");
};

export const clearUserToken = () => {
  localStorage.removeItem("user_access_token");
  localStorage.removeItem("user_refresh_token");
};


// =========================
// ADMIN TOKEN STORAGE
// =========================
export const saveAdminToken = (access, refresh) => {
  localStorage.setItem("admin_access_token", access);
  localStorage.setItem("admin_refresh_token", refresh);
};

export const getAdminToken = () => {
  return localStorage.getItem("admin_access_token");
};

export const getAdminRefreshToken = () => {
  return localStorage.getItem("admin_refresh_token");
};

export const clearAdminToken = () => {
  localStorage.removeItem("admin_access_token");
  localStorage.removeItem("admin_refresh_token");
};


// =========================
// FULL CLEAN (LOGOUT / ROLE SWITCH)
// =========================
export const clearAllTokens = () => {
  clearUserToken();
  clearAdminToken();
};


// =========================
// DEFAULT EXPORT
// =========================
const storage = {
  saveUserToken,
  getUserToken,
  getUserRefreshToken,
  clearUserToken,

  saveAdminToken,
  getAdminToken,
  getAdminRefreshToken,
  clearAdminToken,

  clearAllTokens,
};

export default storage;


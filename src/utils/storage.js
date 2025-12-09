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

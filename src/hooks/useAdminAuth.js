// src/hooks/useAdminAuth.js
import { useEffect, useState } from "react";

const ADMIN_TOKEN_KEY = "admin_access_token";
const ADMIN_REFRESH_KEY = "admin_refresh_token";

export const useAdminAuth = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    const access = localStorage.getItem(ADMIN_TOKEN_KEY);
    setIsAdminAuthenticated(!!access);
  }, []);

  const loginAdmin = (tokens) => {
    localStorage.setItem(ADMIN_TOKEN_KEY, tokens.access);
    if (tokens.refresh) {
      localStorage.setItem(ADMIN_REFRESH_KEY, tokens.refresh);
    }
    setIsAdminAuthenticated(true);
  };

  const logoutAdmin = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_REFRESH_KEY);
    setIsAdminAuthenticated(false);
  };

  return { isAdminAuthenticated, loginAdmin, logoutAdmin };
};

import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import storage from "../../utils/storage";


const AdminRoute = ({ children }) => {
  const location = useLocation();

  // 1️⃣ Redux admin state
  const isAuthenticated = useSelector(
    (state) => state.admin.isAuthenticated
  );

  // 2️⃣ Admin token existence
  const adminToken = storage.getAdminToken();

  // ❌ If no redux auth AND no token → redirect
  if (!isAuthenticated && !adminToken) {
    return (
      <Navigate
        to="/admin/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
};

export default AdminRoute;

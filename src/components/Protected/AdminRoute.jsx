import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.admin.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRoute;
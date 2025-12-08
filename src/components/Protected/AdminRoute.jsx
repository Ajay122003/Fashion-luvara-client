// src/components/Protected/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("admin_access_token");
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

export default AdminRoute;

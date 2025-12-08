// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminRoute from "../components/Protected/AdminRoute";
import AdminLayout from "../layouts/AdminLayout";
import AdminLogin from "../pages/Admin/AdminLogin";
import Dashboard from "../pages/Admin/Dashboard";
import ManageProducts from "../pages/Admin/ManageProducts";
import AddProduct from "../pages/Admin/AddProduct";
import EditProduct from "../pages/Admin/EditProduct";


// TODO: later add user routes, product details, cart etc.

const AppRoutes = () => {
  return (
    <Routes>
      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Dashboard />} />
        {/* Next: Orders, Products, Categories, Coupons, Settings pages */}
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/products" element={<ManageProducts />} />
      <Route path="/admin/products/add" element={<AddProduct/>} />
      <Route path="/admin/products/edit/:id" element={<EditProduct />} />
      



      
    </Routes>
  );
};

export default AppRoutes;

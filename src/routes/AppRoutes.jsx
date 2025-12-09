import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "../pages/Admin/AdminLogin";
import Dashboard from "../pages/Admin/Dashboard";

import ManageProducts from "../pages/Admin/ManageProducts";
import AddProduct from "../pages/Admin/AddProduct";
import EditProduct from "../pages/Admin/EditProduct";

import ManageCategories from "../pages/Admin/ManageCategories";
import AddCategory from "../pages/Admin/AddCategory";
import EditCategory from "../pages/Admin/EditCategory";

import AdminOrders from "../pages/Admin/AdminOrders";           // ADDED
import AdminOrderDetails from "../pages/Admin/AdminOrderDetails"; // ADDED

import Settings from "../pages/Admin/Settings";

import AdminLayout from "../layouts/AdminLayout";
import AdminRoute from "../components/Protected/AdminRoute";
import UsersList from "../pages/Admin/UsersList";

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
        <Route path="dashboard" element={<Dashboard />} />

        {/* PRODUCTS */}
        <Route path="products" element={<ManageProducts />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="products/:id/edit" element={<EditProduct />} />

        {/* CATEGORIES */}
        <Route path="categories" element={<ManageCategories />} />
        <Route path="categories/add" element={<AddCategory />} />
        <Route path="categories/:id/edit" element={<EditCategory />} />

        {/* ORDERS (ADDED NEW) */}
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:id" element={<AdminOrderDetails />} />

        {/* SETTINGS */}
        <Route path="settings" element={<Settings />} />
      </Route>
      
      <Route path="users" element={<UsersList />} />
      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;

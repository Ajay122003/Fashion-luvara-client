import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";

// Protected Routes
import PrivateRoute from "../components/Protected/PrivateRoute";
import AdminRoute from "../components/Protected/AdminRoute";

// User Pages (PUBLIC)
import Home from "../pages/User/Home";
import Products from "../pages/User/Products";
import ProductDetail from "../pages/User/ProductDetail";
import Categories from "../pages/User/Categories";
import CategoryProducts from "../pages/User/CategoryProducts";
import Collections from "../pages/User/Collections";
import CollectionProducts from "../pages/User/CollectionProducts";
import RelatedProducts from "../pages/User/RelatedProducts";

// User Pages (PROTECTED)
import Cart from "../pages/User/Cart";
import Wishlist from "../pages/User/Wishlist";
import Profile from "../pages/User/Profile";
import Orders from "../pages/orders/Orders";
import OrderDetail from "../pages/orders/OrderDetail";
import Checkout from "../pages/checkout/Checkout";
import OrderSuccess from "../pages/orders/OrderSuccess";

// Auth Pages
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import OTPVerify from "../pages/Auth/OTPVerify";

// Admin Pages
import AdminLogin from "../pages/Admin/AdminLogin";
import Dashboard from "../pages/Admin/Dashboard";
import AdminUsersAndSubscribers from "../pages/Admin/AdminUsersAndSubscribers";

import ManageProducts from "../pages/Admin/ManageProducts";
import AddProduct from "../pages/Admin/AddProduct";
import EditProduct from "../pages/Admin/EditProduct";

import ManageCategories from "../pages/Admin/ManageCategories";
import AddCategory from "../pages/Admin/AddCategory";
import EditCategory from "../pages/Admin/EditCategory";

import ManageCollection from "../pages/Admin/ManageCollection";
import AddCollection from "../pages/Admin/AddCollection";
import EditCollection from "../pages/Admin/EditCollection";

import AdminOrders from "../pages/Admin/AdminOrders";
import AdminOrderDetails from "../pages/Admin/AdminOrderDetails";

import Coupons from "../pages/Admin/Coupons";
import AddCoupon from "../pages/Admin/AddCoupon";
import EditCoupon from "../pages/Admin/EditCoupon";

import Settings from "../pages/Admin/Settings";
import AdminForgotPassword from "../pages/Admin/AdminForgotPassword";
import AdminResetPassword from "../pages/Admin/AdminResetPassword";

const AppRoutes = () => {
  return (
    <Routes>
      {/* =========================== USER ROUTES ============================ */}
      <Route path="/" element={<UserLayout />}>
        {/* PUBLIC */}
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="product/:id/related" element={<RelatedProducts />} />

        <Route path="categories" element={<Categories />} />
        <Route path="categories/:slug" element={<CategoryProducts />} />


        <Route path="collections" element={<Collections />} />
        <Route path="collections/:slug" element={<CollectionProducts />} />

        {/* PROTECTED USER ROUTES */}
        <Route
          path="cart"
          element={<PrivateRoute> <Cart />  </PrivateRoute>}
        />

        <Route
          path="wishlist"
          element={
            <PrivateRoute>
              <Wishlist />
            </PrivateRoute>
          }
        />

        <Route
          path="profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />

        <Route
          path="orders/:id"
          element={
            <PrivateRoute>
              <OrderDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="checkout"
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />

        <Route
          path="order-success"
          element={
            <PrivateRoute>
              <OrderSuccess />
            </PrivateRoute>
          }
        />
      </Route>

      {/* =========================== AUTH ROUTES ============================ */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<OTPVerify />} />

      {/* =========================== ADMIN LOGIN ============================ */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/forgot-password" element={<AdminForgotPassword />}/>
        <Route path="/admin/reset-password" element={<AdminResetPassword />} />

      {/* =========================== ADMIN PROTECTED ROUTES ============================ */}
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

        {/* Products */}
        <Route path="products" element={<ManageProducts />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="products/:id/edit" element={<EditProduct />} />

        {/* Users */}
        <Route path="users" element={<AdminUsersAndSubscribers />} />

        {/* Categories */}
        <Route path="categories" element={<ManageCategories />} />
        <Route path="categories/add" element={<AddCategory />} />
        <Route path="categories/:id/edit" element={<EditCategory />} />

        {/* Collections */}
        <Route path="collections" element={<ManageCollection />} />
        <Route path="collections/add" element={<AddCollection />} />
        <Route path="collections/:id/edit" element={<EditCollection />} />

        {/* Orders */}
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:id" element={<AdminOrderDetails />} />

        {/* Coupons */}
        <Route path="coupons" element={<Coupons />} />
        <Route path="coupons/add" element={<AddCoupon />} />
        <Route path="coupons/:id/edit" element={<EditCoupon />} />

        {/* Settings */}
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* =========================== FALLBACK ============================ */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";

// Protected Routes
// import PrivateRoute from "../components/Protected/PrivateRoute";
import AdminRoute from "../components/Protected/AdminRoute";

// User Pages
import Home from "../pages/User/Home";
// import Categories from "../pages/User/Categories";
// import ProductDetails from "../pages/User/ProductDetails";
// import Cart from "../pages/User/Cart";
// import Wishlist from "../pages/User/Wishlist";
// import Checkout from "../pages/User/Checkout";
// import Orders from "../pages/User/Orders";
// import OrderDetails from "../pages/User/OrderDetails";

// Auth Pages
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import OTPVerify from "../pages/Auth/OTPVerify";

// Payment Pages
// import RazorpaySuccess from "../pages/Payment/RazorpaySuccess";
// import RazorpayFailed from "../pages/Payment/RazorpayFailed";

// Admin Pages
import AdminLogin from "../pages/Admin/AdminLogin";
import Dashboard from "../pages/Admin/Dashboard";

import ManageProducts from "../pages/Admin/ManageProducts";
import AddProduct from "../pages/Admin/AddProduct";
import EditProduct from "../pages/Admin/EditProduct";

import ManageCategories from "../pages/Admin/ManageCategories";
import AddCategory from "../pages/Admin/AddCategory";
import EditCategory from "../pages/Admin/EditCategory";

import AdminOrders from "../pages/Admin/AdminOrders";
import AdminOrderDetails from "../pages/Admin/AdminOrderDetails";

import Coupons from "../pages/Admin/Coupons";
import AddCoupon from "../pages/Admin/AddCoupon";
import EditCoupon from "../pages/Admin/EditCoupon";

import Settings from "../pages/Admin/Settings";


const AppRoutes = () => {
  return (
    <Routes>

      {/* ===========================
              USER PUBLIC ROUTES
      ============================ */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<Home />} />
        {/* <Route path="categories" element={<Categories />} />
        <Route path="product/:id" element={<ProductDetails />} /> */}

        {/* Cart & Wishlist */}
        {/* <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} /> */}

        {/* Protected User Routes */}
        {/* <Route
          path="checkout"
          element={
            <PrivateRoute>
              <Checkout />
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
              <OrderDetails />
            </PrivateRoute>
          }
        /> */}
      </Route>

      {/* ===========================
              AUTH ROUTES
      ============================ */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<OTPVerify />} />

      {/* ===========================
              PAYMENT ROUTES
      ============================ */}
      {/* <Route path="/payment/success" element={<RazorpaySuccess />} />
      <Route path="/payment/failed" element={<RazorpayFailed />} /> */}

      {/* ===========================
              ADMIN AUTH
      ============================ */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ===========================
          ADMIN PROTECTED ROUTES
      ============================ */}
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

        {/* Categories */}
        <Route path="categories" element={<ManageCategories />} />
        <Route path="categories/add" element={<AddCategory />} />
        <Route path="categories/:id/edit" element={<EditCategory />} />

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

      {/* DEFAULT FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
};

export default AppRoutes;

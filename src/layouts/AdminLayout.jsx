// src/layouts/AdminLayout.jsx
import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import AdminNavbar from "../components/Navbar/AdminNavbar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin_access_token");
    localStorage.removeItem("admin_refresh_token");
    navigate("/admin/login");
  };

  return (
    <div className="admin-wrapper d-flex">
      {/* Sidebar */}
      <nav
        className={`admin-sidebar bg-dark text-white ${
          sidebarOpen ? "open" : ""
        }`}
      >
        <div className="sidebar-header p-3 d-flex justify-content-between align-items-center">
          <span className="fw-bold">Luvara Admin</span>
          <button
            className="btn btn-sm btn-outline-light d-md-none"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        <ul className="nav flex-column px-2">
          <li className="nav-item">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                "nav-link text-white" + (isActive ? " active" : "")
              }
            >
              Dashboard
            </NavLink>
          </li>

          <li className="nav-item mt-2">
            <div className="text-uppercase text-muted small px-2">
              Catalog
            </div>
          </li>
         <li className="nav-item">
            <NavLink
               to="/admin/products"
               className={({ isActive }) =>
               "nav-link text-white" + (isActive ? " active" : "")
                }
               >
               Products
             </NavLink>
         </li>

          <li className="nav-item">
            <NavLink
              to="/admin/categories"
              className={({ isActive }) =>
                "nav-link text-white" + (isActive ? " active" : "")
              }
            >
              Categories
            </NavLink>
          </li>

          <li className="nav-item mt-2">
            <div className="text-uppercase text-muted small px-2">
              Orders
            </div>
          </li>
          <li className="nav-item">
            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                "nav-link text-white" + (isActive ? " active" : "")
              }
            >
              All Orders
            </NavLink>
          </li>

          <li className="nav-item mt-2">
            <div className="text-uppercase text-muted small px-2">
              Marketing
            </div>
          </li>
          <li className="nav-item">
            <NavLink
              to="/admin/coupons"
              className={({ isActive }) =>
                "nav-link text-white" + (isActive ? " active" : "")
              }
            >
              Coupons
            </NavLink>
          </li>

          <li className="nav-item mt-2">
            <div className="text-uppercase text-muted small px-2">
              Settings
            </div>
          </li>
          <li className="nav-item">
            <NavLink
              to="/admin/settings"
              className={({ isActive }) =>
                "nav-link text-white" + (isActive ? " active" : "")
              }
            >
              Site Settings
            </NavLink>
          </li>
        </ul>

        <div className="mt-auto p-3 border-top border-secondary">
          <button
            className="btn btn-outline-light w-100 btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div className="admin-main flex-grow-1 d-flex flex-column">
        <AdminNavbar onMenuClick={() => setSidebarOpen((prev) => !prev)} />

        <main className="admin-content flex-grow-1 p-3 p-md-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

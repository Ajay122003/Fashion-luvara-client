import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AdminNavbar from "../components/Navbar/AdminNavbar";
import { adminLogout } from "../features/admin/adminSlice";

const AdminLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate("/admin/login");
  };

  const menuItemClass = ({ isActive }) =>
    `d-flex align-items-center gap-2 px-3 py-2 rounded sidebar-link ${
      isActive ? "active" : ""
    }`;

  return (
    <div className="admin-layout d-flex flex-column min-vh-100">
      {/* ================= TOP NAVBAR ================= */}
      <AdminNavbar onMenuClick={() => setShowSidebar(true)} />

      <div className="d-flex flex-grow-1">
        {/* ================= DESKTOP SIDEBAR ================= */}
        <aside className="admin-sidebar d-none d-md-flex flex-column">
          <div className="px-3 py-3 border-bottom fw-bold">
            Admin Panel
          </div>

          <nav className="flex-grow-1 px-2 py-3">
            <NavLink to="/admin/dashboard" className={menuItemClass}>
              <i className="bi bi-speedometer2" />
              Dashboard
            </NavLink>

            <NavLink to="/admin/products" className={menuItemClass}>
              <i className="bi bi-box-seam" />
              Products
            </NavLink>

            <NavLink to="/admin/categories" className={menuItemClass}>
              <i className="bi bi-tags" />
              Categories
            </NavLink>

            <NavLink to="/admin/collections" className={menuItemClass}>
              <i className="bi bi-collection" />
              Collections
            </NavLink>

            {/* ✅ OFFERS */}
            <NavLink to="/admin/offers" className={menuItemClass}>
              <i className="bi bi-percent" />
              Offers
            </NavLink>

            <NavLink to="/admin/coupons" className={menuItemClass}>
              <i className="bi bi-ticket-perforated" />
              Coupons
            </NavLink>

            <NavLink to="/admin/orders" className={menuItemClass}>
              <i className="bi bi-receipt" />
              Orders
            </NavLink>

            <NavLink to="/admin/users" className={menuItemClass}>
              <i className="bi bi-people" />
              Users & Subscribers
            </NavLink>

            <NavLink to="/admin/settings" className={menuItemClass}>
              <i className="bi bi-gear" />
              Settings
            </NavLink>
          </nav>

          {/* LOGOUT */}
          <div className="p-3 border-top">
            <button
              className="btn btn-outline-danger w-100"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-2" />
              Logout
            </button>
          </div>
        </aside>

        {/* ================= MOBILE SIDEBAR ================= */}
        <div
          className={`offcanvas offcanvas-start admin-offcanvas ${
            showSidebar ? "show" : ""
          }`}
          style={{ visibility: showSidebar ? "visible" : "hidden" }}
        >
          <div className="offcanvas-header border-bottom">
            <h5 className="offcanvas-title">Admin Menu</h5>
            <button
              className="btn-close"
              onClick={() => setShowSidebar(false)}
            />
          </div>

          <div className="offcanvas-body text-dark px-2">
            <NavLink
              to="/admin/dashboard"
              className={menuItemClass}
              onClick={() => setShowSidebar(false)}
            >
              <i className="bi bi-speedometer2" />
              Dashboard
            </NavLink>

            <NavLink
              to="/admin/products"
              className={menuItemClass}
              onClick={() => setShowSidebar(false)}
            >
              <i className="bi bi-box-seam" />
              Products
            </NavLink>

            <NavLink
              to="/admin/categories"
              className={menuItemClass}
              onClick={() => setShowSidebar(false)}
            >
              <i className="bi bi-tags" />
              Categories
            </NavLink>

            <NavLink
              to="/admin/collections"
              className={menuItemClass}
              onClick={() => setShowSidebar(false)}
            >
              <i className="bi bi-collection" />
              Collections
            </NavLink>

            {/* ✅ OFFERS (MOBILE FIX) */}
            <NavLink
              to="/admin/offers"
              className={menuItemClass}
              onClick={() => setShowSidebar(false)}
            >
              <i className="bi bi-percent" />
              Offers
            </NavLink>

            <NavLink
              to="/admin/coupons"
              className={menuItemClass}
              onClick={() => setShowSidebar(false)}
            >
              <i className="bi bi-ticket-perforated" />
              Coupons
            </NavLink>

            <NavLink
              to="/admin/orders"
              className={menuItemClass}
              onClick={() => setShowSidebar(false)}
            >
              <i className="bi bi-receipt" />
              Orders
            </NavLink>

            <NavLink
              to="/admin/users"
              className={menuItemClass}
              onClick={() => setShowSidebar(false)}
            >
              <i className="bi bi-people" />
              Users & Subscribers
            </NavLink>

            <NavLink
              to="/admin/settings"
              className={menuItemClass}
              onClick={() => setShowSidebar(false)}
            >
              <i className="bi bi-gear" />
              Settings
            </NavLink>

            <button
              className="btn btn-outline-danger w-100 mt-3"
              onClick={() => {
                handleLogout();
                setShowSidebar(false);
              }}
            >
              <i className="bi bi-box-arrow-right me-2" />
              Logout
            </button>
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <main className="flex-grow-1 p-3 bg-light">
          <Outlet />
        </main>
      </div>

      {/* ================= STYLES ================= */}
      <style>
        {`
          .admin-sidebar {
            width: 240px;
            background: #111827;
            color: #e5e7eb;
          }

          .sidebar-link {
            color: #d1d5db;
            text-decoration: none;
            margin-bottom: 6px;
          }

          .sidebar-link:hover {
            background: #1f2937;
            color: #fff;
          }

          .sidebar-link.active {
            background: #2563eb;
            color: #fff;
          }

          .sidebar-link i {
            font-size: 1.1rem;
          }

          /* MOBILE OFFCANVAS */
          .admin-offcanvas {
            background: #111827 !important;
            color: #e5e7eb;
          }

          .admin-offcanvas .offcanvas-title {
            color: #ffffff;
          }

          .admin-offcanvas .sidebar-link {
            color: #d1d5db !important;
          }

          .admin-offcanvas .sidebar-link:hover {
            background: #1f2937;
            color: #ffffff !important;
          }

          .admin-offcanvas .sidebar-link.active {
            background: #2563eb;
            color: #ffffff !important;
          }

          .admin-offcanvas .btn-close {
            filter: invert(1);
          }
        `}
      </style>
    </div>
  );
};

export default AdminLayout;

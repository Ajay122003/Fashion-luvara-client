import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import AdminNavbar from "../components/Navbar/AdminNavbar";
import { useDispatch } from "react-redux";
import { adminLogout } from "../features/admin/adminSlice";

const AdminLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate("/admin/login");
  };

  return (
    <div className="admin-layout d-flex flex-column" style={{ minHeight: "100vh" }}>
      {/* TOP NAVBAR */}
      <AdminNavbar onMenuClick={() => setShowSidebar(true)} />

      <div className="d-flex flex-grow-1">

        {/* ======================= DESKTOP SIDEBAR ======================= */}
        <aside
          className="bg-light border-end d-none d-md-block"
          style={{ width: "240px" }}
        >
          <div className="list-group list-group-flush">

            <NavLink to="/admin/dashboard" className="list-group-item list-group-item-action">
              Dashboard
            </NavLink>

            <NavLink to="/admin/products" className="list-group-item list-group-item-action">
              Products
            </NavLink>

            <NavLink to="/admin/categories" className="list-group-item list-group-item-action">
              Categories
            </NavLink>

            <NavLink to="/admin/coupons" className="list-group-item list-group-item-action">
              Coupons
            </NavLink>

            <NavLink to="/admin/orders" className="list-group-item list-group-item-action">
              Orders
            </NavLink>
            <NavLink to="/admin/users" className="list-group-item list-group-item-action">
            Users & Subscribers
            </NavLink>
            <NavLink to="/admin/settings" className="list-group-item list-group-item-action">
              Settings
            </NavLink>

            {/* LOGOUT */}
            <button
              className="list-group-item list-group-item-action text-danger fw-bold"
              onClick={handleLogout}
            >
              Logout ⟶
            </button>
          </div>
        </aside>

        {/* ======================= MOBILE SIDEBAR (OFFCANVAS) ======================= */}
        <div
          className={`offcanvas offcanvas-start ${showSidebar ? "show" : ""}`}
          style={{ visibility: showSidebar ? "visible" : "hidden" }}
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Admin Menu</h5>
            <button className="btn-close" onClick={() => setShowSidebar(false)}></button>
          </div>

          <div className="offcanvas-body">
            <div className="list-group">

              <NavLink
                to="/admin/dashboard"
                className="list-group-item list-group-item-action"
                onClick={() => setShowSidebar(false)}
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/admin/products"
                className="list-group-item list-group-item-action"
                onClick={() => setShowSidebar(false)}
              >
                Products
              </NavLink>

              <NavLink
                to="/admin/categories"
                className="list-group-item list-group-item-action"
                onClick={() => setShowSidebar(false)}
              >
                Categories
              </NavLink>

              <NavLink
                to="/admin/coupons"
                className="list-group-item list-group-item-action"
                onClick={() => setShowSidebar(false)}
              >
                Coupons
              </NavLink>

              <NavLink
                to="/admin/orders"
                className="list-group-item list-group-item-action"
                onClick={() => setShowSidebar(false)}
              >
                Orders
              </NavLink>

              <NavLink
                to="/admin/settings"
                className="list-group-item list-group-item-action"
                onClick={() => setShowSidebar(false)}
              >
                Settings
              </NavLink>

              {/* LOGOUT */}
              <button
                className="list-group-item list-group-item-action text-danger fw-bold"
                onClick={() => {
                  handleLogout();
                  setShowSidebar(false);
                }}
              >
                Logout ⟶
              </button>
            </div>
          </div>
        </div>

        {/* ======================= MAIN CONTENT ======================= */}
        <main className="flex-grow-1 p-3 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

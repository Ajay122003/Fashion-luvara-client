// src/components/Navbar/AdminNavbar.jsx
import React from "react";

const AdminNavbar = ({ onMenuClick }) => {
  return (
    <header className="admin-topbar navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container-fluid">
        <button
          className="btn btn-outline-secondary d-md-none me-2"
          onClick={onMenuClick}
        >
          ☰
        </button>
        <span className="navbar-brand mb-0 h1 d-none d-md-inline">
          Admin Panel
        </span>

        <div className="ms-auto d-flex align-items-center gap-3">
          <span className="text-muted small d-none d-sm-inline">
            Logged in as <b>Admin</b>
          </span>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;

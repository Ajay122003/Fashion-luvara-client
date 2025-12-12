// src/components/Navbar/AdminNavbar.jsx


import React from "react";
import { Link } from "react-router-dom";

const AdminNavbar = ({ onMenuClick }) => {
  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      {/* Mobile Menu Button */}
      <button
        className="btn btn-outline-light d-md-none me-2"
        onClick={onMenuClick}
      >
        <i class="bi bi-list"></i>
      </button>

      <Link className="navbar-brand fw-bold" to="/admin/dashboard">
        Luvara Admin
      </Link>
    </nav>
  );
};

export default AdminNavbar;

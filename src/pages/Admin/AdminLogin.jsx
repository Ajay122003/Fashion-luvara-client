import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin, adminVerifyOTP } from "../../features/admin/adminSlice";
import { useNavigate, Link } from "react-router-dom";
import { MdAdminPanelSettings } from "react-icons/md";

/* ================= ERROR MESSAGE HELPER ================= */
const getErrorMessage = (error) => {
  if (!error) return null;

  const msg = String(error).toLowerCase();

  if (msg.includes("password")) {
    return "Your password is wrong";
  }

  if (msg.includes("email")) {
    return "Admin email not found";
  }

  if (msg.includes("otp")) {
    return "Invalid OTP";
  }

  return "Login failed. Please try again.";
};

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, step, pendingEmail } = useSelector(
    (state) => state.admin
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  /* ================= STEP 1 → LOGIN + SEND OTP ================= */
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    dispatch(adminLogin({ email, password }));
  };

  /* ================= STEP 2 → VERIFY OTP ================= */
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const finalEmail = pendingEmail || email;

    dispatch(adminVerifyOTP({ email: finalEmail, otp }))
      .unwrap()
      .then(() => navigate("/admin/dashboard"))
      .catch(() => {});
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        animation: "slideUp 0.7s ease-out",
      }}
    >
      <div
        className="p-4 shadow-lg bg-white rounded-4"
        style={{ 
          width: "100%", 
          maxWidth: "420px",
          borderTop: "4px solid transparent",
          background: "linear-gradient(white, white) padding-box, linear-gradient(135deg, #667eea 0%, #764ba2 100%) border-box"
        }}
      >
        {/* LOGO & TITLE */}
        <div className="text-center mb-3">
          <div 
            className="d-inline-flex align-items-center justify-content-center rounded-circle"
            style={{ 
              width: "80px", 
              height: "80px", 
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              marginBottom: "8px",
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)"
            }}
          >
            <MdAdminPanelSettings size={44} color="#fff" />
          </div>
        </div>
        <h2
          className="text-center fw-bold"
          style={{ letterSpacing: "1px", color: "#111", fontSize: "1.6rem" }}
        >
          LUVARA Admin
        </h2>
        <p className="text-center text-muted mb-4" style={{ fontSize: "0.9rem" }}>
          Secure access for administrators
        </p>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="alert alert-danger py-2 text-center">
            {getErrorMessage(error)}
          </div>
        )}

        {/* ================= STEP 1 → LOGIN ================= */}
        {step === 1 && (
          <form onSubmit={handleLoginSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Admin Email
              </label>
              <input
                type="email"
                className="form-control shadow-sm"
                placeholder="admin@luvara.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                style={{ borderRadius: "10px" }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Password
              </label>
              <input
                type="password"
                className="form-control shadow-sm"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ borderRadius: "10px" }}
              />
            </div>

            {/* FORGOT PASSWORD */}
            <div className="d-flex justify-content-end mb-3">
              <Link
                to="/admin/forgot-password"
                className="text-decoration-none small"
                style={{ color: "#555" }}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn btn-dark w-100 py-2 fw-semibold"
              style={{ 
                borderRadius: "10px",
                transition: "all 0.3s ease",
                background: "linear-gradient(135deg, #333 0%, #1a1a1a 100%)",
                border: "none"
              }}
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Login & Send OTP"}
            </button>
          </form>
        )}

        {/* ================= STEP 2 → OTP VERIFY ================= */}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="mt-3">
            <div className="alert alert-info small text-center">
              OTP sent to <b>{pendingEmail}</b>
            </div>

            <label className="form-label fw-semibold">
              Enter OTP
            </label>
            <input
              type="text"
              maxLength={6}
              className="form-control shadow-sm text-center fs-4 mb-3"
              placeholder="xxxxxx"
              style={{
                letterSpacing: "10px",
                fontWeight: "600",
                borderRadius: "10px",
              }}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              autoFocus
            />

            <button
              type="submit"
              className="btn btn-success w-100 py-2 fw-semibold"
              style={{ 
                borderRadius: "10px",
                transition: "all 0.3s ease",
                background: "linear-gradient(135deg, #11998e 0%, #0e8a75 100%)",
                border: "none"
              }}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
          </form>
        )}
      </div>

      {/* ================= STYLES ================= */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .form-control:focus {
          border-color: #667eea !important;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25) !important;
        }
        .btn-dark:hover:not(:disabled) {
          background: linear-gradient(135deg, #444 0%, #222 100%) !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        .btn-success:hover:not(:disabled) {
          background: linear-gradient(135deg, #12a88a 0%, #0d9a82 100%) !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(17, 153, 142, 0.4);
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;



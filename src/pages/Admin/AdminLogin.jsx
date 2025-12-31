import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin, adminVerifyOTP } from "../../features/admin/adminSlice";
import { useNavigate, Link } from "react-router-dom";

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
        background: "#f4f4f4",
        animation: "fadeIn 0.8s",
      }}
    >
      <div
        className="p-4 shadow-lg bg-white rounded-4"
        style={{ width: "100%", maxWidth: "420px" }}
      >
        {/* LOGO & TITLE */}
        <h2
          className="text-center fw-bold"
          style={{ letterSpacing: "1px", color: "#111" }}
        >
          LUVARA Admin
        </h2>
        <p className="text-center text-muted mb-4">
          Secure access for administrators
        </p>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="alert alert-danger py-2">
            {String(error)}
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

            {/* 🔐 FORGOT PASSWORD */}
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
              style={{ borderRadius: "10px" }}
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Login & Send OTP"}
            </button>
          </form>
        )}

        {/* ================= STEP 2 → OTP VERIFY ================= */}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="mt-3">
            <div className="alert alert-info small">
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
            />

            <button
              type="submit"
              className="btn btn-success w-100 py-2 fw-semibold"
              style={{ borderRadius: "10px" }}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
          </form>
        )}
      </div>

      {/* SIMPLE FADE ANIMATION */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;


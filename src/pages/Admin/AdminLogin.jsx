import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin, adminVerifyOTP } from "../../features/admin/adminSlice";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, step, pendingEmail } = useSelector(
    (state) => state.admin
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    dispatch(adminLogin({ email, password }));
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const finalEmail = pendingEmail || email;
    dispatch(adminVerifyOTP({ email: finalEmail, otp }))
      .unwrap()
      .then(() => {
        navigate("/admin/dashboard");
      })
      .catch(() => {});
  };

  return (
    <div className="d-flex align-items-center justify-content-center bg-light" style={{ minHeight: "100vh" }}>
      <div className="card shadow-sm" style={{ maxWidth: "420px", width: "100%" }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-3">Admin Panel Login</h3>
          <p className="text-muted text-center small mb-4">
            Secure access for Luvara Store admins
          </p>

          {error && (
            <div className="alert alert-danger py-2">{JSON.stringify(error)}</div>
          )}

          {step === 1 && (
            <form onSubmit={handleLoginSubmit}>
              <div className="mb-3">
                <label className="form-label">Admin Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="admin@luvara.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-dark w-100"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Login & Send OTP"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleOtpSubmit}>
              <div className="alert alert-info small">
                OTP sent to: <b>{pendingEmail || email}</b>
              </div>

              <div className="mb-3">
                <label className="form-label">Enter OTP</label>
                <input
                  type="text"
                  className="form-control"
                  maxLength={6}
                  placeholder="6 digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

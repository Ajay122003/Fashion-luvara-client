import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { adminResetPassword } from "../../api/admin";

const AdminResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If user directly opens this page
  useEffect(() => {
    if (!email) {
      navigate("/admin/forgot-password");
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await adminResetPassword({
        email,
        otp,
        new_password: newPassword,
      });

      alert("Password reset successful. Please login.");
      navigate("/admin/login");
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          "Invalid OTP or something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow-sm border-0 p-4"
        style={{ maxWidth: 420, width: "100%" }}
      >
        <h4 className="text-center fw-bold mb-2">
          Reset Admin Password
        </h4>

        <p className="text-muted text-center mb-4" style={{ fontSize: 14 }}>
          Enter the OTP sent to <b>{email}</b>
        </p>

        {error && (
          <div className="alert alert-danger py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">
              OTP
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              New Password
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-dark w-100"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="text-center mt-3">
          <Link
            to="/admin/login"
            className="text-decoration-none text-secondary"
          >
            ← Back to Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminResetPassword;

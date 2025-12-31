import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { adminForgotPassword } from "../../api/admin";

const AdminForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await adminForgotPassword(email);

      // Navigate to reset password page with email
      navigate("/admin/reset-password", {
        state: { email },
      });
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.email ||
          "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow-sm border-0 p-4"
        style={{ maxWidth: "420px", width: "100%" }}
      >
        <h4 className="text-center fw-bold mb-2">
          Admin Forgot Password
        </h4>

        <p
          className="text-muted text-center mb-4"
          style={{ fontSize: "14px" }}
        >
          Enter your admin email. We’ll send an OTP to reset your password.
        </p>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="alert alert-danger py-2">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Admin Email
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-dark w-100"
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        {/* BACK TO LOGIN */}
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

export default AdminForgotPassword;

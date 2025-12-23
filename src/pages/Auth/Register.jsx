import { useState, useEffect } from "react";
import { registerUser } from "../../api/auth";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import storage from "../../utils/storage";

const Register = () => {
  const navigate = useNavigate();

  /* ================= CLEAN OLD SESSION ================= */
  useEffect(() => {
    // 🔥 Clear any existing admin/user tokens
    storage.clearAllTokens();
  }, []);

  /* ================= FORM STATE ================= */
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* ---------- BASIC VALIDATION ---------- */
    if (!form.email || !form.username || !form.password) {
      toast.error("All fields are required");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      await registerUser(form);

      toast.success("Account created! Please login.");
      navigate("/login", { replace: true });
    } catch (err) {
      const data = err.response?.data;

      if (data?.email) {
        toast.error(data.email[0]);
      } else if (data?.username) {
        toast.error(data.username[0]);
      } else if (data?.password) {
        toast.error(data.password[0]);
      } else {
        toast.error("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div
      className="d-flex justify-content-center align-items-center py-5"
      style={{ minHeight: "100vh", background: "#f8f8f8" }}
    >
      <div className="register-card bg-white p-4 p-md-5 shadow rounded-4">

        {/* BRAND HEADING */}
        <h2
          className="text-center fw-bold mb-1"
          style={{ letterSpacing: "1px" }}
        >
          Welcome to <span style={{ color: "#000" }}>LUVARA</span>
        </h2>
        <p className="text-center text-muted mb-4">
          Create your Luvara account to start shopping in style
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <label className="form-label fw-semibold">Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="form-control mb-3 shadow-sm"
            style={{ borderRadius: "10px" }}
            value={form.email}
            onChange={handleChange}
          />

          <label className="form-label fw-semibold">Username</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="form-control mb-3 shadow-sm"
            style={{ borderRadius: "10px" }}
            value={form.username}
            onChange={handleChange}
          />

          <label className="form-label fw-semibold">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="form-control mb-4 shadow-sm"
            style={{ borderRadius: "10px" }}
            value={form.password}
            onChange={handleChange}
          />

          <button
            className="btn btn-dark w-100 py-2 fw-semibold"
            style={{ borderRadius: "10px" }}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="text-center mt-3 mb-0">
          Already have an account?{" "}
          <Link to="/login" className="text-decoration-none fw-semibold">
            Sign in
          </Link>
        </p>
      </div>

      {/* RESPONSIVE CSS */}
      <style>{`
        .register-card {
          width: 100%;
          animation: fadeIn .6s;
        }

        @media (min-width: 768px) {
          .register-card {
            max-width: 430px;
          }
        }

        @media (max-width: 767px) {
          .register-card {
            box-shadow: none !important;
            border-radius: 0 !important;
            padding-left: 20px;
            padding-right: 20px;
            background: transparent !important;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Register;


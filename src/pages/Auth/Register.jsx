import { useState, useEffect } from "react";
import { registerUser } from "../../api/auth";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import storage from "../../utils/storage";


import "../../styles/register.css";

const Register = () => {
  const navigate = useNavigate();

  /* ================= CLEAN OLD SESSION ================= */
  useEffect(() => {
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

    if (!form.email || !form.username || !form.password) {
      toast.error("All fields are required");
      return;
    }

    if (form.password.length < 1) {
      toast.error("Password must be at least  characters");
      return;
    }

    try {
      setLoading(true);
      await registerUser(form);
      toast.success("Account created! Please login.");
      setTimeout(()=>navigate("/login", { replace: true }),1000);
    } catch (err) {
      const data = err.response?.data;
      toast.error(
        data?.email?.[0] ||
          data?.username?.[0] ||
          data?.password?.[0] ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div
      className="d-flex justify-content-center align-items-center py-5"
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <div className="register-card bg-transparent p-4 p-md-5">

        {/* BRAND */}
        <h2 className="text-center fw-bold mb-1">
          Welcome to <span>LUVARA</span>
        </h2>
        <p className="text-center text-muted mb-4">
          Create your Luvara account
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div className="floating-group mb-3">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label>Email Address</label>
          </div>

          {/* USERNAME */}
          <div className="floating-group mb-3">
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label>Username</label>
          </div>

          {/* PASSWORD */}
          <div className="floating-group mb-4">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder=" "
            />
            <label>Password</label>
          </div>

          <button
            className="register-btn w-100 py-2 fw-semibold"
            style={{ borderRadius: 10 }}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="text-center mt-3 mb-0">
          Already have an account?{" "}
          <Link
            to="/login"
            className="fw-semibold text-decoration-none"
          >
            Sign in
          </Link>
        </p>
      </div>

      {/* PAGE CSS */}
      <style>{`
        .register-card {
          width: 100%;
          max-width: 430px;
          animation: fadeIn .6s;
        }

        @media (max-width: 767px) {
          .register-card {
            box-shadow: none;
            padding-left: 20px;
            padding-right: 20px;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Register;

import { useState } from "react";
import { registerUser } from "../../api/auth";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerUser(form);
      toast.success("Account created! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.email || "Registration failed");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center py-5"
      style={{ minHeight: "100vh", background: "#f8f8f8" }}
    >
      <div className="register-card bg-white p-4 p-md-5 shadow rounded-4">

        {/* Brand Heading */}
        <h2 className="text-center fw-bold mb-1" style={{ letterSpacing: "1px" }}>
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
            placeholder="you@example.com"
            className="form-control mb-3 shadow-sm"
            style={{ borderRadius: "10px" }}
            onChange={handleChange}
          />

          <label className="form-label fw-semibold">Username</label>
          <input
            type="text"
            name="username"
            placeholder="Choose a username"
            className="form-control mb-3 shadow-sm"
            style={{ borderRadius: "10px" }}
            onChange={handleChange}
          />

          <label className="form-label fw-semibold">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Choose a strong password"
            className="form-control mb-4 shadow-sm"
            style={{ borderRadius: "10px" }}
            onChange={handleChange}
          />

          <button
            className="btn btn-dark w-100 py-2 fw-semibold"
            style={{ borderRadius: "10px" }}
          >
            Create Account
          </button>
        </form>

        {/* Already have account */}
        <p className="text-center mt-3 mb-0">
          Already have an account?{" "}
          <Link to="/login" className="text-decoration-none fw-semibold">
            Sign in
          </Link>
        </p>
      </div>

      {/* CSS for Responsive Box */}
      <style>{`
        .register-card {
          width: 100%;
          animation: fadeIn .6s;
        }

        /* Desktop only box look */
        @media (min-width: 768px) {
          .register-card {
            max-width: 430px;
          }
        }

        /* Mobile view full width (no box feel) */
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

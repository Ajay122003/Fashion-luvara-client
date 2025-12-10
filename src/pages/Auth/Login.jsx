import { useState } from "react";
import { sendOtpLogin } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSendOTP = async () => {
    if (!email) return toast.error("Please enter email");

    try {
      await sendOtpLogin({ email });
      toast.success("OTP sent to your email");
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.error || "Error sending OTP");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center py-5"
      style={{ minHeight: "100vh", background: "#f8f8f8" }}
    >
      <div className="login-card bg-white p-4 p-md-5 shadow rounded-4">

        {/* BRAND TITLE */}
        <h2 className="text-center fw-bold mb-1" style={{ letterSpacing: "1px" }}>
          Welcome back to <span style={{ color: "#000" }}>LUVARA</span>
        </h2>
        <p className="text-center text-muted mb-4">
          Login using your email to receive OTP
        </p>

        {/* EMAIL INPUT */}
        <label className="form-label fw-semibold">Email Address</label>
        <input
          type="email"
          className="form-control mb-4 shadow-sm"
          placeholder="you@example.com"
          style={{ borderRadius: "10px" }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* LOGIN BTN */}
        <button
          className="btn btn-dark w-100 py-2 fw-semibold"
          style={{ borderRadius: "10px" }}
          onClick={handleSendOTP}
        >
          Send OTP
        </button>

        {/* REGISTER LINK */}
        <p className="text-center mt-3 mb-0">
          Don't have an account?{" "}
          <Link to="/register" className="text-decoration-none fw-semibold">
            Register
          </Link>
        </p>
      </div>

      {/* RESPONSIVE STYLES */}
      <style>{`
        .login-card {
          width: 100%;
          max-width: 430px;
          animation: fadeIn .6s;
        }

        /* Desktop box look */
        @media (min-width: 768px) {
          .login-card {
            background: white;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            border-radius: 20px;
          }
        }

        /* Mobile full-width (no box) */
        @media (max-width: 767px) {
          .login-card {
            background: transparent !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
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

export default Login;

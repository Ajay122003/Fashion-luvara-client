import { useState } from "react";
import { sendOtpLogin } from "../../api/auth";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email) {
      setMessage("Please enter your email address");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await sendOtpLogin({ email });

      setMessage("OTP has been sent to your email address.");
      setMessageType("success");

      setTimeout(() => {
        navigate("/verify-otp", { state: { email } });
      }, 1200);

    } catch (err) {
      const data = err.response?.data;

      if (data?.non_field_errors?.[0] === "User not found") {
        setMessage("Your email is not registered. Please sign up.");
        setMessageType("error");
      } else {
        setMessage("Unable to send OTP. Please try again.");
        setMessageType("error");
      }
    } finally {
      setLoading(false);
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

        {/* MESSAGE */}
        {message && (
          <div
            className={`alert ${
              messageType === "success" ? "alert-success" : "alert-danger"
            } py-2`}
            style={{
              fontSize: "0.9rem",
              borderRadius: "10px",
            }}
          >
            {message}
          </div>
        )}

        {/* EMAIL INPUT */}
        <label className="form-label fw-semibold">Email Address</label>
        <input
          type="email"
          className="form-control mb-4 shadow-sm"
          placeholder="Enter your Email"
          style={{ borderRadius: "10px" }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* LOGIN BTN */}
        <button
          className="btn btn-dark w-100 py-2 fw-semibold"
          style={{ borderRadius: "10px" }}
          onClick={handleSendOTP}
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        {/* REGISTER LINK */}
        <p className="text-center mt-3 mb-0">
          Don't have an account?{" "}
          <Link to="/register" className="text-decoration-none fw-semibold">
            Sign up
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

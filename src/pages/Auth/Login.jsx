import { useState, useEffect } from "react";
import { sendOtpLogin } from "../../api/auth";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/login.css";
import Home from "../User/Home";


const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  /* ================= COOLDOWN TIMER ================= */
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((c) => c - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  /* ================= SEND OTP ================= */
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

      setMessage("OTP has been sent to your email.");
      
      setMessageType("success");
      setCooldown(60);

      setTimeout(() => {
        navigate("/verify-otp", { state: { email } });
      }, 1200);
    } catch (err) {
      const data = err.response?.data;
      const status = err.response?.status;

      if (
        status === 404 ||
        data?.detail === "User not found" ||
        data?.non_field_errors?.[0] === "User not found"
      ) {
        setMessage("Your email is not registered. Please sign up first.");
      } else if (status === 429) {
        setMessage("Too many OTP requests. Please wait and try again.");
      } else {
        setMessage("Unable to send OTP. Please try again.");
      }

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">
          Welcome back to <span>LUVARA</span>
        </h2>

        <p className="login-subtitle">
          Login using your email to receive OTP
        </p>

        {/* ALERT MESSAGE */}
        {message && (
          <div className={`login-alert ${messageType}`}>
            {message}
            {message.includes("sign up") && (
              <>
                {" "}
                <Link to="/register" className="fw-semibold">
                  Sign up
                </Link>
              </>
            )}
          </div>
        )}

        {/* FLOATING EMAIL INPUT */}
        <div className="floating-input">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Email address</label>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          className="login-btn"
          onClick={handleSendOTP}
          disabled={loading || cooldown > 0}
        >
          {loading
            ? "Sending OTP..."
            : cooldown > 0
            ? `Retry in ${cooldown}s`
            : "Send OTP"}
        </button>

        <p className="login-footer">
          Don’t have an account? <Link to="/register">Sign up</Link>
        </p>

      </div>
    </div>
  );
};

export default Login;

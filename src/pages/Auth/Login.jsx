import { useState, useEffect } from "react";
import { sendOtpLogin } from "../../api/auth";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const [cooldown, setCooldown] = useState(0); // seconds

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

      // 🔥 Start cooldown (match backend: 60 sec)
      setCooldown(60);

      setTimeout(() => {
        navigate("/verify-otp", { state: { email } });
      }, 1200);
    } catch (err) {
      const data = err.response?.data;

      if (err.response?.status === 429) {
        setMessage(
          data?.detail ||
          "Too many OTP requests. Please wait before trying again."
        );
      } else if (data?.non_field_errors?.[0] === "User not found") {
        setMessage("Your email is not registered. Please sign up.");
      } else {
        setMessage("Unable to send OTP. Please try again.");
      }

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center py-5"
      style={{ minHeight: "100vh", background: "#f8f8f8" }}>

      <div className="login-card bg-white p-4 p-md-5 shadow rounded-4">

        <h2 className="text-center fw-bold mb-1">
          Welcome back to <span>LUVARA</span>
        </h2>

        <p className="text-center text-muted mb-4">
          Login using your email to receive OTP
        </p>

        {message && (
          <div className={`alert ${
            messageType === "success" ? "alert-success" : "alert-danger"
          }`}>
            {message}
          </div>
        )}

        <label className="form-label fw-semibold">Email Address</label>
        <input
          type="email"
          className="form-control mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="btn btn-dark w-100"
          onClick={handleSendOTP}
          disabled={loading || cooldown > 0}
        >
          {loading
            ? "Sending OTP..."
            : cooldown > 0
            ? `Retry in ${cooldown}s`
            : "Send OTP"}
        </button>

        <p className="text-center mt-3">
          Don't have an account?{" "}
          <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

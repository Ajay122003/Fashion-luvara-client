import { useState, useEffect } from "react";
import { sendOtpLogin } from "../../api/auth";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/login.css";

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
      setMessageType("");

      //  API CALL
      const res = await sendOtpLogin({ email });

      //  STRICT SUCCESS CHECK
      if (res?.data?.email) {
        setMessage("OTP has been sent to your email.");
        setMessageType("success");
        setCooldown(60);

        //  IMMEDIATE REDIRECT (no delay needed)
        navigate("/verify-otp", {
          state: { email: res.data.email },
        });
      } else {
        throw new Error("Invalid OTP response");
      }
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
  Welcome to <span>LUVARA</span>
</h2>

        <p className="login-subtitle">
  Sign in with your email to receive a secure OTP
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

        {/* EMAIL INPUT */}
        <div className="floating-input input-box">
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

      <style>
        {`
        .input-box input:focus {
          border-color: #c9a14a;
        }

        .login-title{
  position: relative;
  display: inline-block;
  width: 100%;
  text-align: center;
  font-family: "Cormorant Garamond", serif;
  font-size: 42px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #313E17;
  text-shadow: 0 2px 10px rgba(0,0,0,.08);
  margin-bottom: 12px;
}

.login-title span{
  color:#C9A14A;
}

.login-subtitle{
  text-align:center;
  color:#666;
  font-size:15px;
  letter-spacing:.5px;
  margin:12px 0 30px;
}
        `}
      </style>
    </div>
    
  );
};

export default Login;

import { useState, useEffect } from "react";
import { verifyOtpLogin, getMe } from "../../api/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../../features/auth/authSlice";
import storage from "../../utils/storage";
import "../../styles/otpVerify.css";

const OTPVerify = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const email = state?.email;

  const [otp, setOTP] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= SAFETY CHECK ================= */
  useEffect(() => {
    if (!email) {
      toast.error("Session expired. Please login again.");
      navigate("/login", { replace: true });
    }
    storage.clearAllTokens();
  }, [email, navigate]);

  /* ================= VERIFY OTP ================= */
  const verify = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await verifyOtpLogin({ email, otp });
      dispatch(setToken(res.data.tokens));

      const me = await getMe();
      dispatch(setUser(me.data));

      toast.success("Login successful 🎉");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-wrapper">
      <div className="otp-card">

        <h2 className="otp-title">Verify OTP</h2>
        <p className="otp-subtitle">
          We’ve sent a 6-digit OTP to <strong>{email}</strong>
        </p>

        {/* OTP INPUT */}
        <div className="otp-input-wrapper">
          <input
            type="text"
            maxLength={6}
            placeholder="XXXXXX"
            value={otp}
            disabled={loading}
            onChange={(e) =>
              setOTP(e.target.value.replace(/\D/g, ""))
            }
          />
        </div>

        {/* VERIFY BUTTON */}
        <button
          className="otp-btn"
          onClick={verify}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify & Login"}
        </button>
      </div>
    </div>
  );
};

export default OTPVerify;

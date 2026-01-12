import { useState, useEffect } from "react";
import { verifyOtpLogin, getMe } from "../../api/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../../features/auth/authSlice";
import storage from "../../utils/storage";
import "../../styles/otpVerify.css";

const OTPVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const email = location.state?.email;

  const [otp, setOTP] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 COUNTDOWN STATE (5 MIN)
  const [timeLeft, setTimeLeft] = useState(300); // 300 seconds

  /* ================= SAFETY CHECK ================= */
  useEffect(() => {
    if (!email) {
      toast.error("Session expired. Please login again.");
      navigate("/login", { replace: true });
    }

    storage.clearAllTokens();
  }, [email, navigate]);

  /* ================= 5 MIN TIMER INIT ================= */
  useEffect(() => {
    if (!email) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          toast.error("OTP time expired. Please request OTP again.");
          navigate("/login", { replace: true });
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  /* ================= FORMAT TIMER ================= */
  const formatTime = () => {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    return `${String(m).padStart(2, "0")} : ${String(s).padStart(2, "0")}`;
  };

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

      toast.success("Login successful");
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

        {/* 🔥 SHOW 5 MIN COUNTDOWN */}
        <p className="otp-subtitle text-center">
          OTP expires in  
          <span className=" text-black ms-2">
            {formatTime()}
          </span>
        </p>

        <div className="otp-input-wrapper">
          <input
            type="text"
            maxLength={6}
            placeholder="XXXXXX"
            value={otp}
            disabled={loading || timeLeft === 0}
            onChange={(e) =>
              setOTP(e.target.value.replace(/\D/g, ""))
            }
          />
        </div>

        <button
          className="otp-btn"
          onClick={verify}
          disabled={loading || timeLeft === 0}
        >
          {loading ? "Verifying..." : "Verify & Login"}
        </button>
      </div>
    </div>
  );
};

export default OTPVerify;

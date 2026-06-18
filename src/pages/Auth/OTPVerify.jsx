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

  //  COUNTDOWN STATE (5 MIN)
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

        {/*  SHOW 5 MIN COUNTDOWN */}
        <p className="otp-subtitle">
  Enter the 6-digit verification code sent to your email

  <br />

  <span className="otp-timer">
    Expires in {formatTime()}
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

      <style>{`
      .otp-title{
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



.otp-timer{
  display:inline-block;
  margin-top:10px;
  padding:6px 18px;
  border-radius:30px;
  background:#f5f5f5;
  color:#313E17;
  font-weight:600;
  border:1px solid rgba(201,161,74,.35);
}

.otp-subtitle{
  text-align:center;
  color:#666;
  font-size:15px;
  line-height:1.8;
  margin:25px 0;
}`
}</style>
    </div>
  );
};

export default OTPVerify;

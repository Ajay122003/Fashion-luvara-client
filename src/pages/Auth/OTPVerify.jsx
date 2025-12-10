import { useState } from "react";
import { verifyOtpLogin, getMe } from "../../api/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../../features/auth/authSlice";

const OTPVerify = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const email = state?.email;
  const [otp, setOTP] = useState("");

  const verify = async () => {
    if (!otp) return toast.error("Enter OTP");

    try {
      // 1) Verify OTP → Get Tokens
      const res = await verifyOtpLogin({ email, otp });
      dispatch(setToken(res.data.tokens));

      // 2) Fetch logged-in user details
      const me = await getMe();
      dispatch(setUser(me.data));

      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.otp || "Invalid OTP");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center py-5"
      style={{ minHeight: "100vh", background: "#f8f8f8" }}
    >
      <div
        className="bg-white p-4 p-md-5 shadow rounded-4"
        style={{ width: "100%", maxWidth: "430px", animation: "fadeIn .6s" }}
      >
        {/* BRANDING */}
        <h2 className="text-center fw-bold mb-1" style={{ letterSpacing: "1px" }}>
          Verify your OTP
        </h2>
        <p className="text-center text-muted mb-4">
          OTP has been sent to <strong>{email}</strong>
        </p>

        {/* OTP INPUT */}
        <label className="form-label fw-semibold">Enter 6-digit OTP</label>
        <input
          type="text"
          className="form-control mb-4 text-center fs-4 shadow-sm"
          placeholder="XXXXXX"
          maxLength={6}
          style={{
            borderRadius: "12px",
            letterSpacing: "10px",
            fontWeight: "600",
          }}
          value={otp}
          onChange={(e) => setOTP(e.target.value)}
        />

        {/* VERIFY BUTTON */}
        <button
          className="btn btn-dark w-100 py-2 fw-semibold"
          style={{ borderRadius: "10px" }}
          onClick={verify}
        >
          Verify OTP
        </button>
      </div>

      {/* SMOOTH ANIMATION */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default OTPVerify;

import { useState } from "react";
import { verifyOtpLogin, getMe } from "../../api/auth";   // ADD getMe
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../../features/auth/authSlice";  // ADD setUser

const OTPVerify = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const email = state?.email;
  const [otp, setOTP] = useState("");

  const verify = async () => {
    try {
      const res = await verifyOtpLogin({ email, otp });

      // 1) Save token
      dispatch(setToken(res.data.tokens));

      // 2) Fetch user details
      const me = await getMe();
      dispatch(setUser(me.data));

      toast.success("Login successful!");

      navigate("/");
    } catch (err) {
      toast.error("Invalid OTP");
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "450px" }}>
      <h3 className="mb-4">Verify OTP</h3>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Enter OTP"
        maxLength={6}
        value={otp}
        onChange={(e) => setOTP(e.target.value)}
      />

      <button className="btn btn-dark w-100" onClick={verify}>
        Verify
      </button>
    </div>
  );
};

export default OTPVerify;

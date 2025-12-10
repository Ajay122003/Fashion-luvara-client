import { useState } from "react";
import { sendOtpLogin } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSendOTP = async () => {
    try {
      await sendOtpLogin({ email });
      toast.success("OTP sent to email");
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.error || "Error sending OTP");
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "450px" }}>
      <h3 className="mb-4">Login</h3>

      <input
        type="email"
        className="form-control mb-3"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button className="btn btn-dark w-100" onClick={handleSendOTP}>
        Send OTP
      </button>
    </div>
  );
};

export default Login;

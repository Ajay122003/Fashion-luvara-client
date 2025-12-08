const OTPInput = ({ otp, setOtp }) => {
  return (
    <input
      type="text"
      maxLength="6"
      className="form-control text-center fs-4"
      style={{ letterSpacing: "8px", fontWeight: "600" }}
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
      placeholder="______"
    />
  );
};

export default OTPInput;

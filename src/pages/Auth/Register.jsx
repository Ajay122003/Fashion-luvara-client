import { useState } from "react";
import { registerUser } from "../../api/auth";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerUser(form);
      toast.success("Account created! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.email || "Registration failed");
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "450px" }}>
      <h3 className="mb-4">Create Account</h3>

      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" className="form-control mb-3"
          onChange={handleChange} />

        <input type="text" name="username" placeholder="Username" className="form-control mb-3"
          onChange={handleChange} />

        <input type="password" name="password" placeholder="Password"
          className="form-control mb-3" onChange={handleChange} />

        <button className="btn btn-dark w-100">Register</button>
      </form>
    </div>
  );
};

export default Register;

import { useState } from "react";
import { subscribeEmail } from "../../api/subscription";
import { toast } from "react-hot-toast";
import { HiOutlineMailOpen } from "react-icons/hi";

const SubscribeBox = () => {
  const [email, setEmail] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubscribe = async () => {
    if (!email.trim()) return toast.error("Please enter your email");

    try {
      await subscribeEmail(email);
      setSuccessMsg(" Thank you for subscribing to Luvara!");
      toast.success("Subscribed successfully!");
      setEmail("");

      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      toast.error(err.response?.data?.email || "Already subscribed");
    }
  };

  return (
    <section className="py-5 bg-white border-top border-bottom">
      <div className="container text-center">

        {/* ICON */}
        <div className="mb-3">
          <HiOutlineMailOpen
            size={48}
            className="text-dark"
            style={{ animation: "bounce 1.3s infinite alternate" }}
          />
        </div>

        {/* TITLE */}
        <p className="text-muted mb-4 fs-5">
          Subscribe to our emails
        </p>

        {/* FORM */}
        <div className="row justify-content-center">
          <div className="col-12 col-sm-7 col-md-6 mb-2">
            <input
              type="email"
              className="form-control shadow-sm"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ borderRadius: "12px", padding: "12px 15px" }}
            />
          </div>

          <div className="col-12 col-sm-3 col-md-2">
            <button
              className="btn btn-dark w-100 fw-semibold"
              style={{ borderRadius: "12px", padding: "12px 20px" }}
              onClick={handleSubscribe}
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* SUCCESS MSG */}
        {successMsg && (
          <div className="text-success mt-3 fade-in">
            {successMsg}
          </div>
        )}

        {/* ANIMATIONS */}
        <style>{`
          @keyframes bounce {
            0% { transform: translateY(0); }
            100% { transform: translateY(-6px); }
          }
          .fade-in {
            animation: fadeIn 0.5s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

      </div>
    </section>
  );
};

export default SubscribeBox;

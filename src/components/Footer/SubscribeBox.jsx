import { useState } from "react";
import { subscribeEmail } from "../../api/subscription";
import { toast } from "react-hot-toast";
import { HiOutlineMailOpen } from "react-icons/hi";
import "../../styles/SubscribeBox.css";

const SubscribeBox = () => {
  const [email, setEmail] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubscribe = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    try {
      await subscribeEmail(email);
      setSuccessMsg("Thank you for subscribing to Luvara!");
      toast.success("Subscribed successfully!");
      setEmail("");

      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      toast.error(err.response?.data?.email || "Already subscribed");
    }
  };

  return (
    <section className="subscribe-section">
      <div className="container text-center">

        {/* ICON */}
        <div className="subscribe-icon">
          <HiOutlineMailOpen size={48} />
        </div>

        {/* TITLE */}
        <p className="subscribe-title">
          Subscribe to our emails
        </p>

        {/* FORM */}
        <div className="row justify-content-center align-items-center">
          <div className="col-12 col-sm-7 col-md-6 mb-2">
            <input
              type="email"
              className="subscribe-input"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="col-12 col-sm-3 col-md-2">
            <button
              className="subscribe-btn"
              onClick={handleSubscribe}
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* SUCCESS MESSAGE */}
        {successMsg && (
          <div className="subscribe-success">
            {successMsg}
          </div>
        )}

      </div>
    </section>
  );
};

export default SubscribeBox;

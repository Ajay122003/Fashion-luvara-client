import { useState } from "react";
import { subscribeEmail } from "../../api/subscription";
import { toast } from "react-hot-toast";
import { HiOutlineMailOpen } from "react-icons/hi";  // ICON

const SubscribeBox = () => {
  const [email, setEmail] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubscribe = async () => {
    if (!email.trim()) return toast.error("Please enter your email");

    try {
      await subscribeEmail(email);
      setSuccessMsg("🎉 Thank you for subscribing to Luvara!");
      toast.success("Subscribed successfully!");
      setEmail("");

      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      toast.error(err.response?.data?.email || "Already subscribed");
    }
  };

  return (
    <section
      className="py-5"
      style={{
        background: "#ffffff",
        color: "#000",
        borderTop: "1px solid #eee",
        borderBottom: "1px solid #eee",
      }}
    >
      <div className="container text-center">

        {/* ICON */}
        <div className="mb-3" style={{ fontSize: "42px", color: "#000" }}>
          <HiOutlineMailOpen className="icon-animate" />
        </div>

        {/* TEXT */}
        <p
          className="text-muted mb-4"
          style={{
            maxWidth: "450px",
            margin: "auto",
            fontSize: "20px",
            lineHeight: "22px",
          }}
        >
          Subscribe to our emails
        </p>

        {/* FORM */}
        <div className="row justify-content-center">
          <div className="col-7 col-sm-7 col-md-6 mb-2 mb-sm-0">
            <input
              type="email"
              className="form-control shadow-sm"
              placeholder="Enter your email address"
              style={{
                padding: "12px 15px",
                borderRadius: "12px",
                border: "1px solid #ccc",
                background: "#f9f9f9",
                color: "#000",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="col-5 col-sm-3 col-md-2">
            <button
              className="btn fw-semibold w-100"
              style={{
                borderRadius: "12px",
                padding: "12px 25px",
                backgroundColor: "#000",
                color: "#fff",
                letterSpacing: "0.5px",
                transition: "0.25s",
              }}
              onClick={handleSubscribe}
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* SUCCESS MESSAGE */}
        {successMsg && (
          <div
            style={{
              marginTop: "18px",
              fontSize: "15px",
              color: "#28a745",
              animation: "fadeIn 0.5s ease",
            }}
          >
            {successMsg}
          </div>
        )}

        {/* ANIMATIONS */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .icon-animate {
            animation: bounce 1.3s infinite alternate;
          }
          @keyframes bounce {
            0% { transform: translateY(0); }
            100% { transform: translateY(-6px); }
          }
        `}</style>

      </div>
    </section>
  );
};

export default SubscribeBox;

import { useState } from "react";
import { subscribeEmail } from "../../api/subscription";
import { toast } from "react-hot-toast";

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

        {/* HEADING */}
        {/* <h2
          className="fw-bold mb-2"
          style={{ letterSpacing: "1px", fontSize: "26px" }}
        >
          Subscribe to our emails
        </h2> */}

        {/* SUBTEXT */}
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

        {/* FORM: RESPONSIVE */}
        <div
          className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-2"
          style={{
            maxWidth: "480px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          {/* INPUT */}
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
              flex: 1,              // makes it stretch on desktop
              minWidth: "200px",    // prevents shrinking too small
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* BUTTON */}
          <button
            className="btn fw-semibold px-4 w-100 w-sm-auto"
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

        {/* Animation */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
          }
          /* Mobile Optimizations */
          @media (max-width: 576px) {
            h2 { font-size: 22px !important; }
            input { font-size: 14px; }
            button { font-size: 14px; padding: 12px; }
          }
        `}</style>

      </div>
    </section>
  );
};

export default SubscribeBox;

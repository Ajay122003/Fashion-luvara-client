
import { useState } from "react";
import { subscribeEmail } from "../../api/subscription";
import { toast } from "react-hot-toast";
import { HiOutlineMailOpen } from "react-icons/hi";
import subBg from "../../assets/images/about.png"; // Change image path if needed

const SubscribeBox = () => {
  const [email, setEmail] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      await subscribeEmail(email);

      setSuccessMsg("🎉 Thank you for subscribing!");
      toast.success("Subscribed successfully!");
      setEmail("");

      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      toast.error(err.response?.data?.email || "Already subscribed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="subscribe-section"
      style={{ backgroundImage: `url(${subBg})` }}
    >
      <div className="container text-center">

        {/* ICON */}
        <div className="subscribe-icon">
          <HiOutlineMailOpen size={50} />
        </div>

        {/* TITLE */}
        <p className="subscribe-subtitle">
          Subscribe to our emails
        </p>

        {/* FORM */}
        <div className="subscribe-box">
          <input
            type="email"
            className="subscribe-input"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className="subscribe-btn"
            onClick={handleSubscribe}
            disabled={loading}
          >
            {loading ? "..." : "Subscribe"}
          </button>
        </div>

        {/* SUCCESS MESSAGE */}
        {successMsg && (
          <div className="subscribe-success">
            {successMsg}
          </div>
        )}

      </div>

      <style>{`
        .subscribe-section {
          padding: 80px 20px;
          position: relative;
          overflow: hidden;

          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;

          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);

          animation: bgMove 20s linear infinite;
        }

        .subscribe-section::before {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.85);
        }

        .subscribe-section .container {
          position: relative;
          z-index: 1;
        }

        @keyframes bgMove {
          0% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 0%;
          }
        }

        .subscribe-icon {
          margin-bottom: 10px;
          color: #313E17;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
          100% {
            transform: translateY(0);
          }
        }

        .subscribe-subtitle {
          color: #313E17;
          margin-bottom: 24px;
          font-size: 1.5rem;
          font-weight: 500;
        }

        .subscribe-box {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;

          max-width: 550px;
          margin: auto;

          background: rgba(255, 255, 255, 0.95);
          padding: 10px;
          border-radius: 50px;

          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(8px);
        }

        .subscribe-input {
          flex: 1;
          border: none;
          outline: none;
          padding: 12px 18px;
          border-radius: 50px;
          font-size: 0.95rem;
          background: transparent;
        }

        .subscribe-btn {
          background: var(--button-bg);
          color: var(--button-text);

          border: none;
          padding: 12px 20px;
          border-radius: 50px;

          font-size: 0.9rem;
          font-weight: 500;

          transition: all 0.3s ease;
        }

        .subscribe-btn:hover {
          transform: translateY(-2px) scale(1.05);
        }

        .subscribe-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .subscribe-success {
          margin-top: 18px;
          color: green;
          font-size: 0.95rem;
          font-weight: 500;
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 576px) {
          .subscribe-section {
            padding: 60px 15px;
          }

          .subscribe-subtitle {
            font-size: 1.2rem;
          }

          .subscribe-box {
            padding: 8px;
            gap: 8px;
          }

          .subscribe-input {
            font-size: 0.85rem;
            padding: 10px 14px;
          }

          .subscribe-btn {
            width: 110px;
            font-size: 0.8rem;
            padding: 10px;
          }
        }
      `}</style>
    </section>
  );
};

export default SubscribeBox;
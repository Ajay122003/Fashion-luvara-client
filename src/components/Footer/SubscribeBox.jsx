

import { useState } from "react";
import { subscribeEmail } from "../../api/subscription";
import { toast } from "react-hot-toast";
import { HiOutlineMailOpen } from "react-icons/hi";


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
    <section className="subscribe-section">
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

        {/* SUCCESS */}
        {successMsg && (
          <div className="subscribe-success">
            {successMsg}
          </div>
        )}

      </div>

      {/* STYLES */}
      <style>{`
        .subscribe-section {
  padding: 60px 0;
  background: var(--bg-color);
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

        .subscribe-icon {
          margin-bottom: 10px;
          color: #1B0C0C;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0); }
        }

        .subscribe-title {
          font-weight: 700;
          margin-bottom: 5px;
        }

        .subscribe-subtitle {
  color: var(--secondary);
  margin-bottom: 24px;
  font-size: 1.1rem;
}


        /* BOX */
        .subscribe-box {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          max-width: 500px;
          margin: auto;
          background: #fff;
          padding: 8px;
          border-radius: 50px;
          box-shadow: 0 10px 25px #262626;
        }

        /* INPUT */
        .subscribe-input {
          flex: 1;
          border: none;
          outline: none;
          padding: 12px 16px;
          border-radius: 50px;
          font-size: 0.9rem;
        }


        /* BUTTON */
        .subscribe-btn {
          background: var(--button-bg);
          color: var(--button-text);
          border: none;
          padding: 10px 18px;
          border-radius: 50px;
          font-size: 0.85rem;
          transition: 0.3s;
          box-shadow: 5px 5px 20px #262626;
        }

        .subscribe-btn:hover {
          transform: scale(1.05);
        }

        .subscribe-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* SUCCESS */
        .subscribe-success {
          margin-top: 15px;
          color: green;
          font-size: 0.9rem;
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* MOBILE */
        @media (max-width: 576px) {
          .subscribe-box {
            flex-direction: row;
            border-radius: 50px;
            padding: 10px;
          }

          .subscribe-btn {
            width: 100px;
          }

          .subscribe-input {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
};

export default SubscribeBox;
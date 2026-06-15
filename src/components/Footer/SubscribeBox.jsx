
import { useState } from "react";
import { subscribeEmail } from "../../api/subscription";
import { toast } from "react-hot-toast";
import { HiOutlineMailOpen } from "react-icons/hi";
import subBg from "../../assets/images/about.png";

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

      setTimeout(() => {
        setSuccessMsg("");
      }, 4000);
    } catch (err) {
      toast.error(
        err.response?.data?.email ||
          "Already subscribed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="subscribe-section"
      style={{
        backgroundImage: `url(${subBg})`,
      }}
    >
      <div className="container text-center">

        {/* ICON */}
        <div className="subscribe-icon">
          <HiOutlineMailOpen size={55} />
        </div>

        {/* TITLE */}
        <h2 className="subscribe-title">
          Stay Connected
        </h2>

        <p className="subscribe-subtitle">
          Subscribe to receive updates, new arrivals,
          exclusive offers and more.
        </p>

        {/* FORM */}
        <div className="subscribe-box">

          <input
            type="email"
            className="subscribe-input"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubscribe();
              }
            }}
          />

          <button
            className="subscribe-btn"
            onClick={handleSubscribe}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Subscribing...
              </>
            ) : (
              "Subscribe"
            )}
          </button>

        </div>

        {/* SUCCESS */}
        {successMsg && (
          <div className="subscribe-success">
            {successMsg}
          </div>
        )}
      </div>

      <style>{`
        .subscribe-section {
          position: relative;
          overflow: hidden;

          padding: 90px 20px;

          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;

          border-top: 1px solid #ececec;
          border-bottom: 1px solid #ececec;

          animation: bgMove 20s linear infinite;
        }

        .subscribe-section::before {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(2px);
        }

        .subscribe-section .container {
          position: relative;
          z-index: 2;
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
          color: #313E17;
          margin-bottom: 14px;
          animation: floatIcon 3s ease-in-out infinite;
        }

        @keyframes floatIcon {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
          100% {
            transform: translateY(0);
          }
        }

        .subscribe-title {
          font-size: 2rem;
          font-weight: 700;
          color: #111;
          margin-bottom: 10px;
          font-family: 'Playfair Display', serif;
        }

        .subscribe-subtitle {
          max-width: 650px;
          margin: 0 auto 30px;
          color: #555;
          font-size: 1rem;
          line-height: 1.7;
        }

        .subscribe-box {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;

          max-width: 650px;
          margin: auto;

          padding: 12px;

          border-radius: 60px;

          background: rgba(255,255,255,0.95);

          box-shadow:
            0 15px 35px rgba(0,0,0,0.12);

          backdrop-filter: blur(10px);
        }

        .subscribe-input {
          flex: 1;

          border: none;
          outline: none;

          background: transparent;

          padding: 14px 20px;

          font-size: 1rem;
          border-radius: 50px;

          transition: all .3s ease;
        }

        .subscribe-input:focus {
          box-shadow:
            0 0 0 3px rgba(49,62,23,.12);
        }

        .subscribe-btn {
          min-width: 140px;

          border: none;
          outline: none;

          padding: 14px 24px;

          border-radius: 50px;

          
          background: var(--button-bg);
          color: var(--button-text);

          font-weight: 600;

          transition: all .3s ease;
        }

        .subscribe-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow:
            0 8px 20px rgba(0,0,0,.15);
        }

        .subscribe-btn:active {
          transform: scale(.98);
        }

        .subscribe-btn:disabled {
          opacity: .7;
          cursor: not-allowed;
        }

        .subscribe-success {
          margin-top: 20px;

          color: #198754;

          font-weight: 600;
          font-size: .95rem;

          animation: fadeIn .4s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* TABLET */
        @media (max-width: 768px) {

          .subscribe-section {
            padding: 70px 16px;
          }

          .subscribe-title {
            font-size: 1.6rem;
          }

          .subscribe-subtitle {
            font-size: .95rem;
            margin-bottom: 24px;
          }

          .subscribe-box {
            flex-direction: column;

            width: 100%;

            border-radius: 20px;

            padding: 16px;
            gap: 12px;
          }

          .subscribe-input {
            width: 100%;

            text-align: center;

            background: #f8f8f8;

            border-radius: 12px;

            padding: 14px 16px;
          }

          .subscribe-btn {
            width: 100%;

            min-width: unset;

            border-radius: 12px;
          }
        }

        /* MOBILE */
        @media (max-width: 576px) {

          .subscribe-section {
            padding: 60px 15px;
          }

          .subscribe-icon svg {
            width: 45px;
            height: 45px;
          }

          .subscribe-title {
            font-size: 1.4rem;
          }

          .subscribe-subtitle {
            font-size: .9rem;
            line-height: 1.6;
          }

          .subscribe-input {
            font-size: .9rem;
          }

          .subscribe-btn {
            font-size: .9rem;
            padding: 13px;
          }

          .subscribe-success {
            font-size: .9rem;
          }
        }
      `}</style>
    </section>
  );
};

export default SubscribeBox;
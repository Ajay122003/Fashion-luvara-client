

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchActiveOffers } from "../../api/offers";
import AOS from "aos";
import "aos/dist/aos.css";

/* ---------------- COUNTDOWN ---------------- */
const getRemainingTime = (endDate) => {
  const diff = new Date(endDate) - new Date();
  if (diff <= 0) return null;

  const total = Math.floor(diff / 1000);

  return {
    days: String(Math.floor(total / 86400)).padStart(2, "0"),
    hours: String(Math.floor((total % 86400) / 3600)).padStart(2, "0"),
    minutes: String(Math.floor((total % 3600) / 60)).padStart(2, "0"),
    seconds: String(total % 60).padStart(2, "0"),
  };
};

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [, setTick] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    fetchActiveOffers().then((res) => {
      setOffers(res.data?.results || res.data || []);
    });
  }, []);

  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (offers.length <= 1) return;
    const s = setInterval(() => {
      setActiveIndex((p) =>
        p === offers.length - 1 ? 0 : p + 1
      );
    }, 5000);
    return () => clearInterval(s);
  }, [offers]);

  if (!offers.length) return null;

  const offer = offers[activeIndex];
  const time = getRemainingTime(offer.end_date);
  if (!time) return null;

  return (
    <Link to={`/offers/${offer.slug}`} className="offer-wrapper">
      <div className="container my-3">

        <div className="offer-card d-flex  ">

          {/* IMAGE */}
          <div
            className="offer-image" data-aos="fade-right"
            style={{ backgroundImage: `url(${offer.image_url})` }}
          />

          {/* CONTENT */}
          <div className="offer-content " data-aos="fade-left">

            <div className="badge px-3 py-2 rounded-pill"><i class="bi bi-stars text-warning me-1"></i>LIMITED TIME ONLY</div>

            <h5 className="subtitle">{offer.title}</h5>
          
            <h1 className="main">
              UP TO <span>
                {offer.discount_type === "PERCENT"
                  ? `${offer.discount_value}%`
                  : `₹${offer.discount_value}`}
              </span> OFF
            </h1>

            <p className="desc">On Selected Collection</p>

            <div className="countdown d-flex gap-2">
              {["days","hours","minutes","seconds"].map((k) => (
                <div className="time-box" key={k}>
                  <div className="box rounded">{time[k]}</div>
                  <span>{k.toUpperCase()}</span>
                </div>
              ))}
            </div>

            <button className="shop-btn text-white bg-dark rounded ">
              SHOP NOW  <i class="bi bi-arrow-right"></i></button>

          </div>
        </div>

      </div>

      <style>{`
        .offer-wrapper {
          text-decoration: none;
          color: inherit;
        }

        /*  ALWAYS SIDE BY SIDE */
        .offer-card {
          overflow: hidden;
          background: #f4efe6;
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          border-radius: 80px 0 80px 0;
        }

        .offer-image,
        .offer-content {
          width: 50%;
          // clip-path: polygon(0 0, 100% 0, 85% 100%, 0% 100%);
        }

        /* IMAGE */
        .offer-image {
          min-height: 200px;
          background-size: cover;
          background-position: center;
        }

        /* CONTENT */
        .offer-content {
          padding: clamp(10px, 3vw, 40px);
          background: #f4efe6;
        }

        /* TEXT */
        .badge {
          background: #000;
          color: #fff;
          font-size: clamp(8px, 1.5vw, 12px);
          margin-bottom: 8px;
          display: inline-block;
        }

        .subtitle {
          font-size: clamp(10px, 2vw, 16px);
          letter-spacing: 2px;
          margin-bottom: 6px;
        }

        .main {
          font-size: clamp(16px, 3.5vw, 36px);
          font-weight: bold;
           font-family: 'Playfair Display', serif;
        }
          

        .main span {
          font-size: clamp(20px, 5vw, 60px);
          color: #c9a14a;
        }

        .desc {
          font-size: clamp(10px, 2vw, 14px);
          margin-bottom: 5px;
        }

        /* COUNTDOWN */
        .countdown {
          flex-wrap: wrap;
          margin-bottom: 10px;
        }

        .box {
          background: #1d2b1f;
          color: #fff;
          padding: clamp(4px, 1vw, 10px);
          font-size: clamp(8px, 2vw, 14px);
        }

        .time-box span {
          font-size: clamp(6px, 1.5vw, 10px);
        }

        /* BUTTON */
        .shop-btn {
          padding: clamp(6px, 1.5vw, 12px) clamp(10px, 3vw, 25px);
          border: none;
          font-size: clamp(10px, 2vw, 14px);
        }

      `}</style>
    </Link>
  );
};

export default Offers;
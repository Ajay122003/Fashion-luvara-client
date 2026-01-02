import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchActiveOffers } from "../../api/offers";
import AOS from "aos";
import "aos/dist/aos.css";

/* ---------------- COUNTDOWN HELPER ---------------- */
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

  /* ---------------- INIT AOS ---------------- */
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      easing: "ease-in-out",
    });
  }, []);

  /* ---------------- FETCH OFFERS ---------------- */
  useEffect(() => {
    fetchActiveOffers().then((res) => {
      const data = res.data?.results || res.data || [];
      setOffers(data);
    });
  }, []);

  /* ---------------- COUNTDOWN TICK ---------------- */
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(i);
  }, []);

  /* ---------------- AUTO SLIDE (5 SEC) ---------------- */
  useEffect(() => {
    if (offers.length <= 1) return;

    const slider = setInterval(() => {
      setActiveIndex((prev) =>
        prev === offers.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(slider);
  }, [offers]);

  if (offers.length === 0) return null;

  const offer = offers[activeIndex];
  const time = getRemainingTime(offer.end_date);
  if (!time) return null;

  return (
    <>
      <Link
        to={`/offers/${offer.slug}`}
        className="hero-offer"
        style={{ backgroundImage: `url(${offer.image_url})` }}
        data-aos="fade-up"
      >
        <div className="overlay">
          <h1 data-aos="zoom-in">
            {offer.discount_type === "PERCENT"
              ? `${offer.discount_value}% OFF`
              : `₹${offer.discount_value} OFF`}
          </h1>

          <p className="sale" data-aos="fade-right">
            {offer.title}
          </p>

          {/* COUNTDOWN */}
          <div className="countdown" data-aos="fade-up">
            <div className="box">{time.days}</div>
            <div className="box">{time.hours}</div>
            <div className="box">{time.minutes}</div>
            <div className="box">{time.seconds} </div>
          </div>
          
          <div className="labels">
    <span>DAY</span>
    <span>HOUR</span>
    <span>MIN</span>
    <span>SEC</span>
  </div>
          
        </div>
      </Link>

      {/* ---------------- STYLES ---------------- */}
      <style>{`
        .hero-offer {
  display: block;
  position: relative;
  height: 520px;
  background-size: cover;
  background-position: center;
  margin-bottom: 40px;
  text-decoration: none;
  color: #1f1f1f;
  transition: background-image 1s ease-in-out;
  font-family: 'Montserrat', sans-serif;
}

/* Glass overlay */
.overlay {
  position: absolute;
  inset: 0;
  padding: 60px;
  background: linear-gradient(
    to right,
    
    rgba(255,255,255,0.15)
  );
  
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* MASS HEADLINE */
.overlay h1 {
  font-family: 'Playfair Display', serif;
  font-size: 88px;
  font-weight: 800;
  letter-spacing: 2px;
  margin-bottom: 12px;
  line-height: 1.05;
}

/* Offer title */
.sale {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 6px;
  text-transform: uppercase;
  margin-bottom: 30px;
  color: #333;
}

/* Countdown row */
.countdown {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

/* Countdown boxes – premium card look */
.box {
  background: linear-gradient(145deg, #111, #333);
  color: #fff;
  font-size: 28px;
  font-weight: 700;
  padding: 18px 22px;
  border-radius: 10px;
  min-width: 78px;
  text-align: center;
  box-shadow:
    0 10px 20px rgba(0,0,0,0.25),
    inset 0 1px 0 rgba(255,255,255,0.15);
}

/* Labels under countdown */
.labels {
  display: flex;
  gap: 48px;
  margin-top: 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #444;
  padding-left: 10px;
}

/* ---------------- TABLET ---------------- */
@media (max-width: 768px) {
  .hero-offer {
    height: 380px;
  }

  .overlay {
    padding: 30px;
  }

  .overlay h1 {
    font-size: 46px;
    letter-spacing: 1px;
  }

  .sale {
    font-size: 14px;
    letter-spacing: 4px;
  }

  .box {
    font-size: 18px;
    padding: 12px 14px;
    min-width: 60px;
  }

  .labels {
    gap: 30px;
    font-size: 10px;
  }
}

/* ---------------- MOBILE ---------------- */
@media (max-width: 480px) {
  .overlay h1 {
    font-size: 34px;
  }

  .countdown {
    justify-content: center;
  }

  .labels {
    justify-content: center;
    gap: 22px;
  }
}

      `}</style>
    </>
  );
};

export default Offers;

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

  /* AOS INIT */
  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  /* FETCH OFFERS */
  useEffect(() => {
    fetchActiveOffers().then((res) => {
      setOffers(res.data?.results || res.data || []);
    });
  }, []);

  /* COUNTDOWN TICK */
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(i);
  }, []);

  /* AUTO SLIDER */
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
      <div className="container">
        <div className="row g-0 align-items-stretch">

          {/* LEFT IMAGE */}
          <div
            className="col-6 offer-image"
            style={{ backgroundImage: `url(${offer.image_url})` }}
            data-aos="fade-right"
          />

          {/* RIGHT CONTENT */}
          <div className="col-6 offer-content" data-aos="fade-left">
            <h1>
              {offer.discount_type === "PERCENT"
                ? `${offer.discount_value}% OFF`
                : `₹${offer.discount_value} OFF`}
            </h1>

            <p className="sale">{offer.title}</p>

            <div className="countdown">
  <div className="time-box">
    <div className="box">{time.days}</div>
    <span>DAY</span>
  </div>
  <div className="time-box">
    <div className="box">{time.hours}</div>
    <span>HOUR</span>
  </div>
  <div className="time-box">
    <div className="box">{time.minutes}</div>
    <span>MIN</span>
  </div>
  <div className="time-box">
    <div className="box">{time.seconds}</div>
    <span>SEC</span>
  </div>
</div>

          </div>

        </div>
      </div>

      {/* ---------------- STYLES ---------------- */}
      <style>{`
        .offer-wrapper {
          display: block;
          text-decoration: none;
          color: inherit;
          margin-bottom: 40px;
        }

        /* IMAGE */
        .offer-image {
          height: clamp(260px, 40vw, 520px);
          background-size: cover;
          background-position: center;
          border-radius: 14px 0 0 14px;
        }

        /* CONTENT */
        .offer-content {
          padding: clamp(20px, 4vw, 60px);
          background: #f8f8f8;
          border-radius: 0 14px 14px 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        /* MAIN HEADING */
        h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 6vw, 72px);
          font-weight: 800;
          line-height: 1.05;
          margin-bottom: 12px;
        }

        /* SUB TITLE */
        .sale {
          font-size: clamp(12px, 2vw, 18px);
          letter-spacing: clamp(2px, 0.8vw, 5px);
          text-transform: uppercase;
          margin-bottom: 22px;
          color: #555;
        }

        /* COUNTDOWN */
        .countdown {
  display: flex;
  gap: clamp(8px, 2vw, 16px);
  flex-wrap: nowrap; /*  NO WRAP */
}

.time-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time-box span {
  margin-top: 4px;
  font-size: clamp(8px, 1.8vw, 11px);
  font-weight: 700;
  letter-spacing: 2px;
  color: #666;
}

      `}</style>
    </Link>
  );
};

export default Offers;



// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { fetchActiveOffers } from "../../api/offers";
// import AOS from "aos";
// import "aos/dist/aos.css";

// /* ---------------- COUNTDOWN HELPER ---------------- */
// const getRemainingTime = (endDate) => {
//   const diff = new Date(endDate) - new Date();
//   if (diff <= 0) return null;

//   const total = Math.floor(diff / 1000);

//   return {
//     days: String(Math.floor(total / 86400)).padStart(2, "0"),
//     hours: String(Math.floor((total % 86400) / 3600)).padStart(2, "0"),
//     minutes: String(Math.floor((total % 3600) / 60)).padStart(2, "0"),
//     seconds: String(total % 60).padStart(2, "0"),
//   };
// };

// const Offers = () => {
//   const [offers, setOffers] = useState([]);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [, setTick] = useState(0);

//   /* AOS INIT */
//   useEffect(() => {
//     AOS.init({ duration: 1000, once: false });
//   }, []);

//   /* FETCH OFFERS */
//   useEffect(() => {
//     fetchActiveOffers().then((res) => {
//       setOffers(res.data?.results || res.data || []);
//     });
//   }, []);

//   /* COUNTDOWN TICK */
//   useEffect(() => {
//     const i = setInterval(() => setTick((t) => t + 1), 1000);
//     return () => clearInterval(i);
//   }, []);

//   /* AUTO SLIDER */
//   useEffect(() => {
//     if (offers.length <= 1) return;
//     const s = setInterval(() => {
//       setActiveIndex((p) =>
//         p === offers.length - 1 ? 0 : p + 1
//       );
//     }, 5000);
//     return () => clearInterval(s);
//   }, [offers]);

//   if (!offers.length) return null;

//   const offer = offers[activeIndex];
//   const time = getRemainingTime(offer.end_date);
//   if (!time) return null;

//   return (
//     <Link to={`/offers/${offer.slug}`} className="offer-wrapper">
//       <div className="container">
//         <div className="row g-0 align-items-stretch">

//           {/* LEFT IMAGE */}
//           <div
//             className="col-6 offer-image"
//             style={{ backgroundImage: `url(${offer.image_url})` }}
//             data-aos="fade-right"
//           />

//           {/* RIGHT CONTENT */}
//           <div className="col-6 offer-content" data-aos="fade-left">

//             <h1>
//               {offer.discount_type === "PERCENT"
//                 ? `${offer.discount_value}% OFF`
//                 : `₹${offer.discount_value} OFF`}
//             </h1>

//             <p className="sale">{offer.title}</p>

//             <div className="countdown">
//               <div className="time-box">
//                 <div className="box">{time.days}</div>
//                 <span>DAYS</span>
//               </div>
//               <div className="time-box">
//                 <div className="box">{time.hours}</div>
//                 <span>HOURS</span>
//               </div>
//               <div className="time-box">
//                 <div className="box">{time.minutes}</div>
//                 <span>MIN</span>
//               </div>
//               <div className="time-box">
//                 <div className="box">{time.seconds}</div>
//                 <span>SEC</span>
//               </div>
//             </div>

//             {/* BUTTON */}
//             <button className="offer-btn">SHOP NOW</button>

//           </div>

//         </div>
//       </div>

//       {/* ---------------- STYLES ---------------- */}
//       <style>{`
//         .offer-wrapper {
//           display: block;
//           text-decoration: none;
//           color: inherit;
//           margin-bottom: 50px;
//         }

//         .container {
//           max-width: 1200px;
//         }

//         /* IMAGE */
//         .offer-image {
//           height: clamp(260px, 40vw, 520px);
//           background-size: cover;
//           background-position: center;
//           border-radius: 20px 0 0 20px;
//           position: relative;
//           overflow: hidden;
//         }

//         /* IMAGE OVERLAY */
//         .offer-image::after {
//           content: "";
//           position: absolute;
//           inset: 0;
//           background: linear-gradient(to right, rgba(0,0,0,0.2), transparent);
//         }

//         /* CONTENT */
//         .offer-content {
//           padding: clamp(20px, 4vw, 60px);
//           background: linear-gradient(135deg, #d4f5df, #b7e4c7);
//           border-radius: 0 20px 20px 0;
//           display: flex;
//           flex-direction: column;
//           justify-content: center;
//           backdrop-filter: blur(10px);
//         }

//         /* HEADING */
//         h1 {
//           font-family: 'Playfair Display', serif;
//           font-size: clamp(28px, 6vw, 70px);
//           font-weight: 900;
//           line-height: 1.05;
//           margin-bottom: 10px;
//           color: #1b4332;
//         }

//         /* SUB TITLE */
//         .sale {
//           font-size: clamp(12px, 2vw, 18px);
//           letter-spacing: clamp(2px, 0.8vw, 4px);
//           text-transform: uppercase;
//           margin-bottom: 25px;
//           color: #344e41;
//         }

//         /* COUNTDOWN */
//         .countdown {
//           display: flex;
//           gap: clamp(8px, 2vw, 16px);
//         }

//         /* TIME BOX */
//         .time-box {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//         }

//         /* NUMBER BOX */
//         .box {
//           width: clamp(45px, 6vw, 75px);
//           height: clamp(45px, 6vw, 75px);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: clamp(14px, 2vw, 24px);
//           font-weight: 700;
//           border-radius: 12px;
//           background: rgba(255, 255, 255, 0.7);
//           backdrop-filter: blur(6px);
//           box-shadow: 0 8px 20px rgba(0,0,0,0.08);
//         }

//         /* LABEL */
//         .time-box span {
//           margin-top: 6px;
//           font-size: clamp(8px, 1.8vw, 11px);
//           font-weight: 700;
//           letter-spacing: 2px;
//           color: #2d6a4f;
//         }

//         /* BUTTON */
//         .offer-btn {
//           margin-top: 30px;
//           padding: 12px 28px;
//           border-radius: 8px;
//           background: #1b4332;
//           color: white;
//           font-weight: 600;
//           letter-spacing: 1px;
//           border: none;
//           transition: 0.3s;
//           width: fit-content;
//         }

//         .offer-btn:hover {
//           background: #081c15;
//           transform: translateY(-2px);
//         }

//         /* MOBILE */
//         @media (max-width: 768px) {
//   .offer-image {
//     border-radius: 20px 0 0 20px;
//   }

//   .offer-content {
//     border-radius: 0 20px 20px 0;
//     text-align: left;
//     align-items: flex-start;
//   }

//   .countdown {
//     justify-content: flex-start;
//   }
// }
//       `}</style>
//     </Link>
//   );
// };

// export default Offers;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchActiveOffers } from "../../api/offers";

/* ---------------- COUNTDOWN HELPER (DD:HH:MM:SS) ---------------- */
const getRemainingTime = (endDate) => {
  const diff = new Date(endDate) - new Date();

  if (diff <= 0) {
    return { expired: true };
  }

  const totalSeconds = Math.floor(diff / 1000);

  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor(
    (totalSeconds % (24 * 60 * 60)) / (60 * 60)
  );
  const minutes = Math.floor(
    (totalSeconds % (60 * 60)) / 60
  );
  const seconds = totalSeconds % 60;

  return {
    expired: false,
    time: `${String(days).padStart(2, "0")} : ${String(hours).padStart(
      2,
      "0"
    )} : ${String(minutes).padStart(2, "0")} : ${String(
      seconds
    ).padStart(2, "0")}`,
  };
};

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setTick] = useState(0); // ⏱ force re-render every second

  /* ---------------- FETCH ACTIVE OFFERS ---------------- */
  const loadOffers = async () => {
    try {
      setLoading(true);

      const res = await fetchActiveOffers();

      // ✅ handle paginated & non-paginated response
      const data = res.data?.results || res.data || [];

      setOffers(data);
      console.log("OFFERS PAGE DATA 👉", data);
    } catch (err) {
      console.error("Offer fetch error:", err);
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  /* ---------------- COUNTDOWN TICK ---------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-5">
        Loading offers...
      </p>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4"></h2>

      {offers.length === 0 && (
        <p className="text-muted">
          No active offers right now.
        </p>
      )}

      <div className="row g-4">
        {offers.map((offer) => {
          const countdown = getRemainingTime(
            offer.end_date
          );

          if (countdown.expired) return null;

          return (
            <div
              className="col-12 col-md-4"
              key={offer.id}
            >
              <Link
                to={`/offers/${offer.slug}`}
                className="text-decoration-none text-dark"
              >
                <div className="card h-100 shadow-sm offer-card">
                  {offer.image_url && (
                    <img
                      src={offer.image_url}
                      alt={offer.title}
                      className="card-img-top"
                      style={{
                        height: "220px",
                        objectFit: "cover",
                      }}
                    />
                  )}

                  <div className="card-body">
                    <h5 className="card-title">
                      {offer.title}
                    </h5>

                    {/* <p className="card-text text-muted">
                      {offer.description}
                    </p> */}

                    <span className="badge bg-danger mb-2">
                      {offer.discount_type === "PERCENT"
                        ? `${offer.discount_value}% OFF`
                        : `₹${offer.discount_value} OFF`}
                    </span>

                    {/* ⏱ COUNTDOWN */}
                    <p className="small mt-3 mb-0 text-danger fw-bold">
                      ⏱ Ends in: {countdown.time}
                    </p>
                    <p className="small text-muted mb-0">
                      (DD : HH : MM : SS)
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* ---------------- STYLES ---------------- */}
      <style>{`
        .offer-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .offer-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.12);
        }
      `}</style>
    </div>
  );
};

export default Offers;

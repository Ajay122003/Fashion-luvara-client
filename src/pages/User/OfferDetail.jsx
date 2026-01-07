import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchOfferDetail } from "../../api/offers";
import AOS from "aos";
import "aos/dist/aos.css";

/* -------- COUNTDOWN HELPER -------- */
const getRemainingTime = (endDate) => {
  if (!endDate) return "Expired";

  const diff = new Date(endDate) - new Date();
  if (diff <= 0) return "Expired";

  const sec = Math.floor(diff / 1000);
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);

  return `${d}d ${h}h ${m}m`;
};

const OfferDetail = () => {
  const { slug } = useParams();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* 🔥 Typewriter state */
  const [typedTitle, setTypedTitle] = useState("");

  /* ================= LOAD OFFER ================= */
  useEffect(() => {
    const loadOffer = async () => {
      try {
        setLoading(true);
        const res = await fetchOfferDetail(slug);
        setOffer(res.data);
      } catch (err) {
        console.error("Offer detail error:", err);
        setError("Offer not found");
      } finally {
        setLoading(false);
      }
    };

    loadOffer();
  }, [slug]);

  /* ================= AOS INIT ================= */
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  /* ================= TYPEWRITER EFFECT ================= */
  useEffect(() => {
    if (!offer?.title) return;

    let index = 0;
    setTypedTitle("");

    const interval = setInterval(() => {
      index++;
      setTypedTitle(offer.title.slice(0, index));

      if (index === offer.title.length) {
        clearInterval(interval); // 🛑 stop after complete
      }
    }, 60);

    return () => clearInterval(interval);
  }, [offer?.title]);

  const products = useMemo(
    () => offer?.products || [],
    [offer]
  );

  if (loading) {
    return (
      <p className="text-center mt-5">
        Loading offer details...
      </p>
    );
  }

  if (error || !offer) {
    return (
      <p className="text-center mt-5 text-danger">
        Offer not found
      </p>
    );
  }

  return (
    <div className="container py-4">

      {/* ================= OFFER HEADER ================= */}
      <div className="row mb-4 align-items-center">

        {/* IMAGE */}
        <div
          className="col-md-5 mb-3 mb-md-0"
          data-aos="fade-right"
        >
          {offer.image_url && (
            <img
              src={offer.image_url}
              alt={offer.title}
              className="img-fluid rounded shadow"
            />
          )}
        </div>

        {/* CONTENT */}
        <div
          className="col-md-7"
          data-aos="fade-left"
        >
          {/* 🔥 TYPEWRITER TITLE */}
          <h2 className="fw-bold">
            {typedTitle}
            <span className="typing-cursor">|</span>
          </h2>

          {offer.description && (
            <p className="text-muted mt-2">
              {offer.description}
            </p>
          )}

          <span className="badge bg-danger fs-6">
            {offer.discount_type === "PERCENT"
              ? `${offer.discount_value}% OFF`
              : `₹${offer.discount_value} OFF`}
          </span>

          <p className="mt-3 fw-bold text-danger">
            <i class="bi bi-alarm alarm-icon"></i> offer Ends in: {getRemainingTime(offer.end_date)}
          </p>
        </div>
      </div>

      {/* ================= PRODUCTS ================= */}
      <h4 className="mb-3" data-aos="fade-up">
        Products in this offer
      </h4>

      {products.length === 0 && (
        <p className="text-muted">No products available</p>
      )}

      <div className="row g-4">
        {products.map((p, index) => (
          <div
            key={p.id}
            className="col-6 col-md-3"
            data-aos="fade-up"
            data-aos-delay={index * 120}
          >
            <Link
              to={`/product/${p.id}`}
              className="text-decoration-none text-dark"
            >
              <div className="card h-100 shadow-sm position-relative">

                {/* OFFER BADGE */}
                <span
                  className="badge bg-danger position-absolute"
                  style={{
                    top: "8px",
                    left: "8px",
                    fontSize: "0.75rem",
                    padding: "6px 8px",
                    zIndex: 2,
                  }}
                >
                  {offer.discount_type === "PERCENT"
                    ? `${offer.discount_value}% OFF`
                    : `₹${Math.round(offer.discount_value)} OFF`}
                </span>

                {/* IMAGE */}
                <img
                  src={p.images?.[0]?.image_url || "/placeholder.png"}
                  alt={p.name}
                  className="card-img-top"
                  style={{
                    height: 180,
                    objectFit: "cover",
                  }}
                />

                <div className="card-body">
                  <h6 className="card-title text-truncate">
                    {p.name}
                  </h6>

                  <div>
                    <span className="fw-bold text-danger">
                      ₹{Math.round(p.effective_price)}
                    </span>

                    {p.effective_price < p.price && (
                      <span className="text-muted text-decoration-line-through ms-2 small">
                        ₹{p.price}
                      </span>
                    )}
                  </div>

                  {p.effective_price < p.price && (
                    <p className="text-success small fw-semibold mb-0">
                      You save ₹{Math.round(p.price - p.effective_price)}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* ================= CSS ================= */}
      <style>{`
        .typing-cursor {
          display: inline-block;
          margin-left: 2px;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0; }
        }
          /* Shake + glow feel */
.alarm-icon {
  display: inline-block;
  animation: alarmShake 1.2s infinite ease-in-out;
}

@keyframes alarmShake {
  0%   { transform: rotate(0deg) scale(1); }
  25%  { transform: rotate(-10deg) scale(1.1); }
  50%  { transform: rotate(10deg) scale(1.1); }
  75%  { transform: rotate(-6deg) scale(1.05); }
  100% { transform: rotate(0deg) scale(1); }
}
      `}</style>
    </div>
  );
};

export default OfferDetail;

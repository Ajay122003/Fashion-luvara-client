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

  const [typedTitle, setTypedTitle] = useState("");

  /* ================= LOAD OFFER ================= */
  useEffect(() => {
    const loadOffer = async () => {
      try {
        setLoading(true);
        const res = await fetchOfferDetail(slug);
        setOffer(res.data);
      } catch (err) {
        setError("Offer not found");
      } finally {
        setLoading(false);
      }
    };
    loadOffer();
  }, [slug]);

  /* ================= AOS ================= */
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  /* ================= TYPEWRITER ================= */
  useEffect(() => {
    if (!offer?.title) return;
    let i = 0;
    setTypedTitle("");
    const t = setInterval(() => {
      i++;
      setTypedTitle(offer.title.slice(0, i));
      if (i === offer.title.length) clearInterval(t);
    }, 60);
    return () => clearInterval(t);
  }, [offer?.title]);

  const products = useMemo(
    () => offer?.products || [],
    [offer]
  );

  if (loading)
    return <p className="text-center mt-5">Loading…</p>;

  if (error || !offer)
    return <p className="text-center mt-5 text-danger">Offer not found</p>;

  return (
    <div className="container py-4">

      {/* ================= HEADER ================= */}
      <div className="row mb-4 align-items-center">
        <div className="col-md-5 mb-3 mb-md-0" data-aos="fade-right">
          <img
            src={offer.image_url}
            alt={offer.title}
            className="img-fluid rounded shadow"
          />
        </div>

        <div className="col-md-7" data-aos="fade-left">
          <h2 className="fw-bold">
            {typedTitle}
            <span className="typing-cursor">|</span>
          </h2>

          <p className="text-muted">{offer.description}</p>

          <span className="badge bg-danger fs-6">
            {offer.discount_type === "PERCENT"
              ? `${offer.discount_value}% OFF`
              : `₹${offer.discount_value} OFF`}
          </span>

          <p className="mt-3 fw-bold text-danger">
            <i className="bi bi-alarm alarm-icon me-2"></i>
            Offer ends in {getRemainingTime(offer.end_date)}
          </p>
        </div>
      </div>

      {/* ================= PRODUCTS ================= */}
      <h4 className="mb-3">Products in this offer</h4>

      <div className="row g-4">
        {products.map((p, index) => {
          const isOutOfStock =
            p.variants &&
            p.variants.length > 0 &&
            p.variants.every((v) => v.stock === 0);

          return (
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
                    style={{ top: 8, left: 8, zIndex: 2 }}
                  >
                    {offer.discount_type === "PERCENT"
                      ? `${offer.discount_value}% OFF`
                      : `₹${offer.discount_value} OFF`}
                  </span>

                  {/* 🔴 OUT OF STOCK BADGE */}
                  {isOutOfStock && (
                    <span
                      className="badge bg-dark rounded-pill position-absolute"
                      style={{ top: 8, right: 8, zIndex: 2 }}
                    >
                      0 Stock
                    </span>
                  )}

                  <img
                    src={p.images?.[0]?.image_url || "/placeholder.png"}
                    alt={p.name}
                    className={`card-img-top ${isOutOfStock ? "opacity-75" : ""}`}
                    style={{ height: 180, objectFit: "cover" }}
                  />

                  <div className="card-body">
                    <h6 className="text-truncate">{p.name}</h6>

                    <span className="fw-bold text-danger">
                      ₹{Math.round(p.effective_price)}
                    </span>

                    {p.effective_price < p.price && (
                      <span className="text-muted text-decoration-line-through ms-2 small">
                        ₹{p.price}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* ================= CSS ================= */}
      <style>{`
        .typing-cursor {
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%,50%,100%{opacity:1}
          25%,75%{opacity:0}
        }
        .alarm-icon {
          animation: alarmShake 1.2s infinite;
        }
        @keyframes alarmShake {
          0%{transform:rotate(0)}
          25%{transform:rotate(-10deg)}
          50%{transform:rotate(10deg)}
          75%{transform:rotate(-6deg)}
          100%{transform:rotate(0)}
        }
      `}</style>
    </div>
  );
};

export default OfferDetail;

import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchOfferDetail } from "../../api/offers";

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
        <div className="col-md-5 mb-3 mb-md-0">
          {offer.image_url && (
            <img
              src={offer.image_url}
              alt={offer.title}
              className="img-fluid rounded shadow"
            />
          )}
        </div>

        <div className="col-md-7">
          <h2 className="fw-bold">{offer.title}</h2>

          {offer.description && (
            <p className="text-muted">{offer.description}</p>
          )}

          <span className="badge bg-danger fs-6">
            {offer.discount_type === "PERCENT"
              ? `${offer.discount_value}% OFF`
              : `₹${offer.discount_value} OFF`}
          </span>

          <p className="mt-3 fw-bold text-danger">
            ⏱ Ends in: {getRemainingTime(offer.end_date)}
          </p>
        </div>
      </div>

      {/* ================= PRODUCTS ================= */}
      <h4 className="mb-3">Products in this offer</h4>

      {products.length === 0 && (
        <p className="text-muted">No products available</p>
      )}

      <div className="row g-4">
        {products.map((p) => (
          <div key={p.id} className="col-6 col-md-3">
            <Link
              to={`/product/${p.id}`}
              className="text-decoration-none text-dark"
            >
              <div className="card h-100 shadow-sm position-relative">

                {/* 🔥 OFFER BADGE */}
                 {offer.discount_type === "PERCENT" && (
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
    {offer.discount_value}% OFF
  </span>
)}

{offer.discount_type === "FLAT" && (
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
    ₹{Math.round(offer.discount_value)} OFF
  </span>
)}


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

                  {/* PRICE */}
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

                  {/* YOU SAVE */}
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
    </div>
  );
};

export default OfferDetail;

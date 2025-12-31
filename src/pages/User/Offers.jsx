import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchActiveOffers } from "../../api/offers";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const res = await fetchActiveOffers();
      setOffers(res.data || []);
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

  if (loading) {
    return <p className="text-center mt-5">Loading offers...</p>;
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4"> Current Offers</h2>

      {offers.length === 0 && (
        <p className="text-muted">No active offers right now.</p>
      )}

      <div className="row g-4">
        {offers.map((offer) => (
          <div className="col-12 col-md-4" key={offer.id}>
            <Link
              to={`/offers/${offer.slug}`}
              className="text-decoration-none text-dark"
            >
              <div className="card h-100 shadow-sm offer-card">
                {offer.image && (
                  <img
                    src={offer.image}
                    alt={offer.title || offer.name}
                    className="card-img-top"
                    style={{
                      height: "220px",
                      objectFit: "cover",
                    }}
                  />
                )}

                <div className="card-body">
                  <h5 className="card-title">
                    {offer.title || offer.name}
                  </h5>

                  <p className="card-text text-muted">
                    {offer.description}
                  </p>

                  <span className="badge bg-danger mb-2">
                    {offer.discount_type === "PERCENT"
                      ? `${offer.discount_value}% OFF`
                      : `₹${offer.discount_value} OFF`}
                  </span>

                  <p className="small mt-2 mb-0">
                    ⏱ Ends on:{" "}
                    <strong>
                      {new Date(offer.end_date).toLocaleString()}
                    </strong>
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Styles */}
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

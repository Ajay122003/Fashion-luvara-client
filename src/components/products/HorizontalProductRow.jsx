import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchProducts } from "../../api/products";

const HorizontalProductRow = ({
  title = "Featured Products",
  viewAllLink = "/products",
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts({ limit: 4 });
      setProducts(data.results || data || []);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <p className="text-center py-4 fw-semibold">
        Loading products…
      </p>
    );
  }

  if (!products.length) return null;

  return (
    <div className="container py-4">

      {/* ================= HEADER ================= */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">{title}</h5>

        <button
  className="btn btn-sm btn-outline-dark rounded-pill d-flex align-items-center gap-2 px-3"
  onClick={() => navigate(viewAllLink)}
>
  View All
  <i className="bi bi-chevron-right"></i>
</button>

      </div>

      {/* ================= HORIZONTAL SCROLL ================= */}
      <div
        className="d-flex gap-3 overflow-auto pb-2"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {products.map((product) => {
          const hasOffer =
            product.effective_price < product.price;

          const discountPercent = hasOffer
            ? Math.round(
                ((product.price - product.effective_price) /
                  product.price) *
                  100
              )
            : 0;

          return (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="text-decoration-none text-dark"
            >
              <div
                className="card shadow-sm border-0 h-100"
                style={{ minWidth: 180, maxWidth: 180 }}
              >
                {/* IMAGE */}
                <div
                  className="position-relative bg-light rounded-top overflow-hidden"
                  style={{ height: 180 }}
                >
                  {hasOffer && (
                    <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                      {discountPercent}% OFF
                    </span>
                  )}

                  <img
                    src={
                      product.images?.[0]?.image_url ||
                      "/placeholder.png"
                    }
                    alt={product.name}
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>

                {/* BODY */}
                <div className="card-body p-2">
                  <p
                    className="fw-semibold mb-1 small text-truncate"
                    title={product.name}
                  >
                    {product.name}
                  </p>

                  <p className="fw-bold mb-0">
                    ₹{product.effective_price}
                  </p>

                  {hasOffer && (
                    <small className="text-muted text-decoration-line-through">
                      ₹{product.price}
                    </small>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ================= MOBILE FIX ================= */}
      <style>{`
        @media (max-width: 576px) {
          .card {
            min-width: 145px !important;
            max-width: 145px !important;
          }
          .card > div:first-child {
            height: 145px !important;
          }
        }

        @media (max-width: 768px) {
          .card {
            min-width: 160px;
            max-width: 160px;
          }
          .card > div:first-child {
            height: 160px;
          }
        }
      `}</style>
    </div>
  );
};

export default HorizontalProductRow;

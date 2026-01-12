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
      const data = await fetchProducts({ limit: 6 });
      setProducts(data?.results || data || []);
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
        <h5 className="fw-bold mb-0" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>{title}</h5>

        <button
          className="btn btn-sm btn-outline-dark rounded-pill d-flex align-items-center gap-2 px-3"
          onClick={() => navigate(viewAllLink)}
        >
          View All <i className="bi bi-arrow-right"></i>
        </button>
      </div>

      {/* ================= HORIZONTAL LIST ================= */}
      <div className="horizontal-scroll d-flex gap-3 pb-2">
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

          const isOutOfStock =
  product.variants &&
  product.variants.length > 0 &&
  product.variants.every((v) => v.stock === 0);

          return (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="text-decoration-none text-dark"
            >
              <div className="product-card-sm shadow-sm">
                {/* IMAGE */}
                <div className="img-wrapper position-relative">
                  {hasOffer && (
                    <span className="badge bg-success position-absolute top-0 start-0 m-2">
                      {discountPercent}% OFF
                    </span>
                  )}

                {isOutOfStock && (
    <span
      className="badge bg-dark position-absolute"
      style={{
        top: "8px",
        right: "8px",   // 👈 offer badge opposite side
        fontSize: "0.75rem",
        padding: "6px 8px",
        zIndex: 2,
      }}
    >
      0 Stock
    </span>
  )}

                  <img
                    src={
                      product.images?.[0]?.image_url ||
                      "/placeholder.png"
                    }
                    alt={product.name}
                    
                  />
                </div>

                {/* INFO */}
                <div className="p-2">
                  <p
                    className="fw-semibold small mb-1 text-truncate"
                    title={product.name}
                  >
                    {product.name}
                  </p>

                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold">
                      ₹{Math.round(product.effective_price)}
                    </span>

                    {hasOffer && (
                      <small className="text-muted text-decoration-line-through">
                        ₹{product.price}
                      </small>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ================= STYLES ================= */}
      <style>{`
        /* Horizontal scroll */
        .horizontal-scroll {
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .horizontal-scroll::-webkit-scrollbar {
          display: none;
        }

        /* Product card */
        .product-card-sm {
          min-width: 180px;
          max-width: 180px;
          background: #fff;
          border-radius: 12px;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .product-card-sm:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 18px rgba(0,0,0,0.12);
        }

        /* Image */
        .img-wrapper {
          height: 180px;
          background: #f6f6f6;
          overflow: hidden;
          border-radius: 12px 12px 0 0;
        }

        .img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .product-card-sm:hover img {
          transform: scale(1.07);
        }

        /* Mobile */
        @media (max-width: 576px) {
          .product-card-sm {
            min-width: 145px;
            max-width: 145px;
          }

          .img-wrapper {
            height: 145px;
          }
        }

        @media (max-width: 768px) {
          .product-card-sm {
            min-width: 160px;
            max-width: 160px;
          }

          .img-wrapper {
            height: 160px;
          }
        }
      `}</style>
    </div>
  );
};

export default HorizontalProductRow;


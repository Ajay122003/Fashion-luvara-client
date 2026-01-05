import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchCollectionProducts } from "../../api/collections";
import AOS from "aos";
import "aos/dist/aos.css";

const CollectionProducts = () => {
  const { slug } = useParams();

  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCollection = async () => {
    try {
      setLoading(true);
      const res = await fetchCollectionProducts(slug);
      setCollection(res.data);
    } catch (err) {
      console.error("Failed to load collection:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    loadCollection();
  }, [slug]);

  /* ================= AOS INIT ================= */
  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  if (loading)
    return (
      <p className="text-center py-5 fw-bold">
        Loading…
      </p>
    );

  if (!collection)
    return (
      <p className="text-center py-5">
        Collection not found.
      </p>
    );

  const productCount = collection.products?.length || 0;

  return (
    <div className="container py-4">

      {/* ================= HEADER ================= */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h3 className="fw-bold mb-0">
          {collection.name}
        </h3>

        <span className="badge text-secondary fs-6">
          {productCount} Product{productCount !== 1 && "s"}
        </span>
      </div>

      {/* ================= PRODUCT GRID ================= */}
      <div className="row g-4">
        {productCount === 0 ? (
          <p className="text-center py-4">
            No products available.
          </p>
        ) : (
          collection.products.map((product, index) => {
            const hasOffer =
              product.effective_price < product.price;

            const discountPercent = hasOffer
              ? Math.round(
                  ((product.price -
                    product.effective_price) /
                    product.price) *
                    100
                )
              : 0;

            return (
              <div
                key={product.id}
                className="col-6 col-md-4 col-lg-3"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <Link
                  to={`/product/${product.id}`}
                  className="text-decoration-none text-dark"
                >
                  <div className="card product-card shadow-sm h-100 border-0">

                    {/* IMAGE + OFFER BADGE */}
                    <div className="product-img-wrapper position-relative">
                      {hasOffer && (
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
                          {discountPercent}% OFF
                        </span>
                      )}

                      <img
                        src={
                          product.images?.[0]?.image_url ||
                          "/placeholder.png"
                        }
                        alt={product.name}
                        className="product-img"
                      />
                    </div>

                    {/* BODY */}
                    <div className="card-body px-2">
                      <h6 className="fw-semibold mb-1 text-truncate">
                        {product.name}
                      </h6>

                      <p className="mb-0 fw-bold">
                        ₹{product.effective_price}
                      </p>

                      {hasOffer && (
                        <p className="text-muted small text-decoration-line-through mb-0">
                          ₹{product.price}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })
        )}
      </div>

      {/* ================= CSS ================= */}
      <style>{`
        .product-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          border-radius: 12px;
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        }

        .product-img-wrapper {
          height: 220px;
          background: #f8f8f8;
          border-radius: 12px 12px 0 0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .product-img {
          height: 100%;
          width: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .product-card:hover .product-img {
          transform: scale(1.05);
        }

        @media (max-width: 576px) {
          .product-img-wrapper {
            height: 180px;
          }
        }
      `}</style>
    </div>
  );
};

export default CollectionProducts;

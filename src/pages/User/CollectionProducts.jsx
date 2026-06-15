import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchCollectionProducts } from "../../api/collections";
import AOS from "aos";
import "aos/dist/aos.css";
import loadingLogo from "../../assets/images/logo3.png";

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
    <div
      className="container py-5 text-center d-flex flex-column justify-content-center align-items-center"
      style={{ minHeight: "60vh" }}
    >
      <img
        src={loadingLogo}
        alt="Loading"
        className="loading-image"
      />

      <p className="mt-3 fw-semibold text-black">
        Loading Collection...
      </p>

      <style>{`
        .loading-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 50%;
          padding: 8px;
          background: #fff;
          box-shadow:
            0 8px 20px rgba(0, 0, 0, 0.15),
            0 0 30px rgba(0, 0, 0, 0.08);

          animation: rotateLogo 1.5s linear infinite;
        }

        @keyframes rotateLogo {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
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
        <h3 className="fw-bold mb-0"   style={{
    fontFamily: "'Lobster Two', cursive",
    fontWeight: 700,
    fontSize:"33px",
    letterSpacing: "1px"
  }}>
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

            const isOutOfStock =
    product.variants &&
    product.variants.length > 0 &&
    product.variants.every((v) => v.stock === 0);

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
                    <div className="product-image-wrapper position-relative">
                      {hasOffer && (
                        <span
                          className="badge bg-success position-absolute"
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

                    {isOutOfStock && (
    <span
      className="badge bg-dark rounded-pill position-absolute"
      style={{
        top: "8px",
        right: "8px",
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
                        className="w-100"
                      style={{
                        objectFit: "cover",
                        transition: "transform .3s",
                      }}
                      />
                    </div>

                    {/* BODY */}
                    <div className="card-body px-2">
                      <h6 className="fw-semibold mb-1 text-truncate" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
                        {product.name}
                      </h6>

                      <p className="mb-0 fw-bold">
                        ₹{product.effective_price}
                      

                      {hasOffer && (
                        <span className="text-muted small ms-2 text-decoration-line-through mb-0">
                          ₹{product.price}
                        </span>
                      )}
                      </p>
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
        .product-image-wrapper {
          height: 180px;
          overflow: hidden;
        }

        @media (min-width: 768px) {
          .product-image-wrapper {
            height: 220px;
          }
        }

        @media (min-width: 992px) {
          .product-image-wrapper {
            height: 260px;
          }
        }

        .product-card:hover img {
          transform: scale(1.06);
        }
      `}</style>
    </div>
  );
};

export default CollectionProducts;




import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchProducts } from "../../api/products";
import loadingLogo from "../../assets/images/logo3.png";

const HorizontalProductRow = ({
  title = "Featured Products",
  viewAllLink = "/products",
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const scrollRef = useRef(null);
  const animationRef = useRef(null);
  const isPaused = useRef(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (products.length) {
      startAutoScroll();
    }

    return () => cancelAnimationFrame(animationRef.current);
  }, [products]);

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

  // duplicate for seamless loop
  const loopProducts = [...products, ...products, ...products, ...products, ...products];

  //  SMOOTH AUTO SCROLL (NO STUCK)
  const startAutoScroll = () => {
    const scroll = () => {
      if (!scrollRef.current) return;

      const el = scrollRef.current;

      if (!isPaused.current) {
        el.scrollLeft += 0.8; // speed

        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }

      animationRef.current = requestAnimationFrame(scroll);
    };

    animationRef.current = requestAnimationFrame(scroll);
  };

  const handleMouseEnter = () => {
    isPaused.current = true;
  };

  const handleMouseLeave = () => {
    isPaused.current = false;
  };

  if (loading) {
  return (
    <div
      className="container d-flex flex-column justify-content-center align-items-center text-center"
      style={{ minHeight: "40vh" }}
    >
      <img
        src={loadingLogo}
        alt="Loading"
        className="loading-image"
      />

      <p className="mt-3 fw-semibold text-black">
        Loading Products...
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
            0 8px 20px rgba(0,0,0,.15),
            0 0 30px rgba(0,0,0,.08);

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
}

  if (!products.length) return null;

  return (
    <div className="container py-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* <h5 className="fw-bold mb-0"
        style={{
    fontFamily: "'Lobster Two', cursive",
    fontWeight: 700,
    fontSize:"23px",
    letterSpacing: "1px"
  }}
>{title}</h5> */}

<h5
  className="section-title mb-0"
  style={{
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 700,
    fontSize: "23px",
    letterSpacing: "0px",
    textTransform: "uppercase",
    color: "#313E17",
  }}
>
  {title}
</h5>

       <button
  className="btn btn-sm btn-outline-dark rounded-pill px-3 three-d-btn"
  onClick={() => navigate(viewAllLink)}
>
  View All →
</button>
      </div>

      {/*  SCROLL AREA */}
      <div
        ref={scrollRef}
        className="horizontal-scroll d-flex gap-3 pb-2"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {loopProducts.map((product, index) => {
          const hasOffer = product.effective_price < product.price;

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
              key={product.id + "-" + index}
              to={`/product/${product.id}`}
              className="text-decoration-none text-dark"
            >
              <div className="product-card-sm shadow-sm">
                <div className="img-wrapper position-relative">
                  {hasOffer && (
                    <span className="badge bg-success position-absolute top-0 start-0 m-2">
                      {discountPercent}% OFF
                    </span>
                  )}

                  {isOutOfStock && (
                    <span className="badge bg-dark position-absolute top-0 end-0 m-2">
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

                <div className="p-2">
                  <p className="fw-semibold small mb-1 text-truncate" 
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
                    {product.name}
                  </p>

                  <div className="d-flex  gap-2">
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

      {/* STYLES */}
      <style>{`
        .horizontal-scroll {
          overflow-x: auto;
          scrollbar-width: none;
        }

        .horizontal-scroll::-webkit-scrollbar {
          display: none;
        }

        .product-card-sm {
          min-width: 180px;
          background: #fff;
          border-radius: 12px;
        }

        .img-wrapper {
          height: 180px;
          background: #f6f6f6;
          overflow: hidden;
        }

        .img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }


        .three-d-btn {
  position: relative;
  background: #fff;
  border: 2px solid #000;
  font-weight: 500;
  transition: all 0.2s ease;
  
  /* 🔥 3D shadow */
  box-shadow: 0 6px 0 #000;
}

/* HOVER */
.three-d-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 0 #000 ;
}

/* CLICK EFFECT */
.three-d-btn:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #000;
}
      `}</style>
    </div>
  );
};

export default HorizontalProductRow;


import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchRelatedProducts } from "../../api/products";
import AOS from "aos";
import "aos/dist/aos.css";

const RelatedProducts = ({ productId }) => {
  const [products, setProducts] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);

  /* ================= LOAD PRODUCTS ================= */
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchRelatedProducts(productId);
        setProducts(data || []);
      } catch (err) {
        console.error(err);
      }
    };

    if (productId) load();
  }, [productId]);

  /* ================= AOS INIT ================= */
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-out",
      once: true,
      offset: 100,
    });
  }, []);

  if (!products.length) return null;

  return (
    <div className="related-products-section">
      {/* SECTION HEADER */}
      <div className="section-header" data-aos="fade-up" data-aos-duration="800">
        <div className="header-line"></div>
        <h2 className="section-title">You May Also Like</h2>
        <p className="section-subtitle">Curated selections matching your interests</p>
      </div>

      {/* PRODUCTS GRID */}
      <div className="products-grid">
        {products.slice(0, 4).map((p, index) => {
          const hasOffer =
            p.effective_price !== undefined &&
            p.effective_price < p.price;

          const discountPercent = hasOffer
            ? Math.round(
                ((p.price - p.effective_price) / p.price) * 100
              )
            : null;

          const isOutOfStock =
            p.variants &&
            p.variants.length > 0 &&
            p.variants.every((v) => v.stock === 0);

          return (
            <div
              key={p.id}
              className="product-item-wrapper"
              data-aos="fade-up"
              data-aos-delay={index * 80}
              data-aos-duration="900"
              onMouseEnter={() => setHoveredId(p.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Link
                to={`/product/${p.id}`}
                onClick={() =>
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }
                className="product-link"
              >
                {/* PRODUCT CARD */}
                <div className={`product-card ${isOutOfStock ? "out-of-stock" : ""}`}>
                  
                  {/* IMAGE CONTAINER */}
                  <div className="product-image-container">
                    <div className="image-wrapper">
                      <img
                        src={p.images?.[0]?.image_url}
                        alt={p.name}
                        loading="lazy"
                        className="product-image"
                      />
                      <div className="image-overlay"></div>
                    </div>

                    {/* OFFER BADGE */}
                    {hasOffer && (
                      <div className="badge-offer" data-aos="zoom-in" data-aos-delay={index * 80 + 200}>
                        <span className="discount-value">{discountPercent}%</span>
                        <span className="discount-label">OFF</span>
                      </div>
                    )}

                    {/* OUT OF STOCK BADGE */}
                    {isOutOfStock && (
                      <div className="badge-stock">
                        <span>Out of Stock</span>
                      </div>
                    )}

                    {/* QUICK VIEW ICON */}
                    {!isOutOfStock && (
                      <div className={`quick-view-icon ${hoveredId === p.id ? "visible" : ""}`}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* PRODUCT INFO */}
                  <div className="product-info">
                    <h3 className="product-name" title={p.name}>
                      {p.name}
                    </h3>

                    {/* PRICING */}
                    <div className="pricing-section">
                      <div className="price-current">
                        ₹{hasOffer ? p.effective_price.toLocaleString("en-IN") : p.price.toLocaleString("en-IN")}
                      </div>
                      {hasOffer && (
                        <div className="price-original">
                          ₹{p.price.toLocaleString("en-IN")}
                        </div>
                      )}
                    </div>

                    {/* RATING PLACEHOLDER (if ratings available) */}
                    {p.rating !== undefined && (
                      <div className="rating-section">
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < Math.floor(p.rating) ? "star filled" : "star"}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="rating-value">({p.rating?.toFixed(1)})</span>
                      </div>
                    )}
                  </div>

                  {/* HOVER INDICATOR LINE */}
                  <div className={`hover-indicator ${hoveredId === p.id ? "active" : ""}`}></div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* ================= STYLES ================= */}
      <style>{`
        * {
          box-sizing: border-box;
        }

        .related-products-section {
          margin-top: 4rem;
          margin-bottom: 2rem;
        }

        /* SECTION HEADER */
        .section-header {
          margin-bottom: 3rem;
          position: relative;
        }

        .header-line {
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #313E17 0%, #c9a14a 100%);
          border-radius: 2px;
          margin-bottom: 1.5rem;
        }

        .section-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.5px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
        }

        .section-subtitle {
          font-size: 1rem;
          color: #666;
          margin: 0;
          font-weight: 400;
          letter-spacing: 0.3px;
        }

        /* GRID LAYOUT */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 2rem 1.5rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 768px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem 1rem;
          }
        }

        @media (max-width: 480px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem 0.75rem;
          }
        }

        /* PRODUCT ITEM */
        .product-item-wrapper {
          height: 100%;
        }

        .product-link {
          text-decoration: none;
          color: inherit;
          display: block;
          height: 100%;
        }

        .product-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid #f0f0f0;
          position: relative;
        }

        .product-card:hover {
          border-color: #313E17;
          box-shadow: 0 12px 32px rgba(49, 62, 23, 0.12);
          transform: translateY(-8px);
        }

        .product-card.out-of-stock {
          opacity: 0.75;
        }

        /* IMAGE CONTAINER */
        .product-image-container {
          position: relative;
          width: 100%;
          overflow: hidden;
          border-radius: 16px 16px 0 0;
        }

        .image-wrapper {
          width: 100%;
          aspect-ratio: 3 / 4;
          background: linear-gradient(135deg, #f5f5f5 0%, #efefef 100%);
          overflow: hidden;
          position: relative;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
          display: block;
        }

        .product-card:hover .product-image {
          transform: scale(1.12) rotate(0.5deg);
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0);
          transition: background 0.35s ease;
          pointer-events: none;
        }

        .product-card:hover .image-overlay {
          background: rgba(0, 0, 0, 0.08);
        }

        /* BADGES */
        .badge-offer {
          position: absolute;
          top: 12px;
          left: 12px;
          background: green;
          color: white;
          border-radius: 12px;
          padding: 8px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 52px;
          box-shadow: 0 4px 12px rgba(49, 62, 23, 0.3);
          z-index: 2;
          font-weight: 500;
          line-height: 1.2;
        }

        .discount-value {
          font-size: 1.2rem;
          font-weight: 800;
        }

        .discount-label {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-top: 2px;
        }

        .badge-stock {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(26, 26, 26, 0.92);
          color: white;
          padding: 8px 14px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.3px;
          backdrop-filter: blur(4px);
          z-index: 2;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        /* QUICK VIEW ICON */
        .quick-view-icon {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%) translateY(20px);
          opacity: 0;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 3;
          color: white;
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #313E17 0%, #c9a14a 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(49, 62, 23, 0.3);
        }

        .quick-view-icon.visible {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        /* PRODUCT INFO */
        .product-info {
          padding: 16px 14px 14px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .product-name {
          font-size: 1rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 10px 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          letter-spacing: -0.2px;
          transition: color 0.25s ease;
        }

        .product-card:hover .product-name {
          color: #313E17;
        }

        /* PRICING */
        .pricing-section {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 8px;
        }

        .price-current {
          font-size: 1.25rem;
          font-weight: 700;
          color: #313E17;
          letter-spacing: -0.3px;
        }

        .price-original {
          font-size: 0.9rem;
          color: #999;
          text-decoration: line-through;
          text-decoration-thickness: 1.5px;
          text-underline-offset: 3px;
          font-weight: 500;
        }

        /* RATING */
        .rating-section {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: auto;
        }

        .stars {
          display: flex;
          gap: 2px;
        }

        .star {
          font-size: 0.85rem;
          color: #ddd;
          transition: color 0.2s ease;
        }

        .star.filled {
          color: #313E17;
        }

        .rating-value {
          font-size: 0.8rem;
          color: #999;
          font-weight: 500;
        }

        /* HOVER INDICATOR */
        .hover-indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg,  #313E17 0%, #c9a14a 100%);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 3px;
        }

        .hover-indicator.active {
          transform: scaleX(1);
        }

        /* RESPONSIVE ADJUSTMENTS */
        @media (max-width: 768px) {
          .section-title {
            font-size: 1.75rem;
          }

          .section-subtitle {
            font-size: 0.95rem;
          }

          .product-card {
            border-radius: 14px;
          }

          .product-image-container {
            border-radius: 14px 14px 0 0;
          }

          .product-info {
            padding: 14px 12px 12px;
          }

          .product-name {
            font-size: 0.95rem;
            margin-bottom: 8px;
          }

          .price-current {
            font-size: 1.1rem;
          }
        }

        @media (max-width: 480px) {
          .related-products-section {
            margin-top: 2.5rem;
          }

          .section-header {
            margin-bottom: 2rem;
          }

          .section-title {
            font-size: 1.5rem;
          }

          .section-subtitle {
            font-size: 0.9rem;
          }

          .product-info {
            padding: 12px 10px;
          }

          .product-name {
            font-size: 0.9rem;
            margin-bottom: 6px;
          }

          .price-current {
            font-size: 1rem;
          }

          .quick-view-icon {
            width: 42px;
            height: 42px;
          }

          .quick-view-icon svg {
            width: 20px;
            height: 20px;
          }
        }

        /* REDUCED MOTION */
        @media (prefers-reduced-motion: reduce) {
          .product-card,
          .product-image,
          .image-overlay,
          .quick-view-icon,
          .hover-indicator {
            transition: none;
          }

          .product-card:hover .product-image {
            transform: none;
          }

          .quick-view-icon.visible {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default RelatedProducts;


import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchProducts } from "../../api/products";
import AOS from "aos";
import "aos/dist/aos.css";

const PAGE_SIZE = 10;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [params, setParams] = useSearchParams();

  const currentPage = parseInt(params.get("page") || "1", 10);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  /* ================= LOAD PRODUCTS ================= */
  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts(Object.fromEntries([...params]));

      setProducts(data.results || []);
      setTotalCount(data.count || 0);
      setPagination({
        next: data.next,
        previous: data.previous,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [params]);

  /* ================= AOS INIT ================= */
  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  const updateFilter = (key, value) => {
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page"); // reset to page 1 on filter change
    setParams(params);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    params.set("page", page);
    setParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= PAGINATION PAGES ================= */
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2; // pages shown around current

    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);

    if (left > 2) pages.push("...");

    for (let i = left; i <= right; i++) pages.push(i);

    if (right < totalPages - 1) pages.push("...");

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  return (
    <div className="container py-4">
      <h3 className="page-title mb-4">All Products</h3>

      {/* FILTER BAR */}
      <div className="row g-3 mb-4">
        <div className="col-4 col-md-4">
          <select
            className="form-select input-box"
            onChange={(e) => updateFilter("sort", e.target.value)}
          >
            <option value="">Sort</option>
            <option value="price_low">Low to High</option>
            <option value="price_high">High to Low</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        <div className="col-8 col-md-8">
          <input
            type="text"
            className="form-control input-box"
            placeholder="Search for products..."
            onChange={(e) => updateFilter("search", e.target.value)}
          />
        </div>
      </div>

      {/* LOADING */}
      {loading && <p className="text-center py-5">Loading...</p>}

      {/* PRODUCT GRID */}
      <div className="row g-3 g-md-4">
        {products.map((product, index) => {
          const hasOffer = product.effective_price < product.price;

          const discountPercent = hasOffer
            ? Math.round(
                ((product.price - product.effective_price) / product.price) *
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
                <div className="card border-0 shadow-sm product-card">
                  {/* IMAGE */}
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
                      src={product.images?.[0]?.image_url}
                      alt={product.name}
                      className="w-100"
                      style={{
                        objectFit: "cover",
                        transition: "transform .3s",
                      }}
                    />
                  </div>

                  {/* BODY */}
                  <div className="card-body">
                    <h6
                      className="text-truncate"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 700,
                      }}
                    >
                      {product.name}
                    </h6>

                    <p className="mb-0">
                      <span className="fw-bold">
                        ₹{Math.round(product.effective_price)}
                      </span>

                      {hasOffer && (
                        <span className="text-muted text-decoration-line-through ms-2 small">
                          ₹{product.price}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center my-5 gap-1 flex-wrap">
          {/* Left Arrow */}
          <button
            className={`pagination-btn arrow-btn ${currentPage === 1 ? "disabled" : ""}`}
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            &#8592;
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((page, i) =>
            page === "..." ? (
              <span key={`dots-${i}`} className="pagination-dots">
                &hellip;
              </span>
            ) : (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            )
          )}

          {/* Right Arrow */}
          <button
            className={`pagination-btn arrow-btn ${currentPage === totalPages ? "disabled" : ""}`}
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            &#8594;
          </button>
        </div>
      )}

      {/* STYLE */}
      <style>{`
        .product-image-wrapper {
          height: 190px;
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

        .input-box {
          border-color: #c9a14a;
        }

        .page-title {
          position: relative;
          display: inline-block;
          font-family: "Cormorant Garamond", serif;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #313E17;
          text-shadow: 0 2px 10px rgba(0,0,0,.08);
        }

        /* ── Pagination ── */
        .pagination-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1.5px solid #c9a14a;
          background: transparent;
          color: #313E17;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
          line-height: 1;
        }

        .pagination-btn:hover:not(.disabled):not(.active) {
          background: #f5ead4;
          border-color: #b8882e;
        }

        .pagination-btn.active {
          background: #313E17;
          border-color: #313E17;
          color: #fff;
          cursor: default;
        }

        .pagination-btn.arrow-btn {
          font-size: 1rem;
          border-color: #313E17;
          color: #313E17;
        }

        .pagination-btn.arrow-btn:hover:not(.disabled) {
          background: #313E17;
          color: #fff;
        }

        .pagination-btn.disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .pagination-dots {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #888;
          font-size: 1rem;
          letter-spacing: 1px;
        }
      `}</style>
    </div>
  );
};

export default Products;
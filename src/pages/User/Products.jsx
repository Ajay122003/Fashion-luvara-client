import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchProducts } from "../../api/products";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);

  const [params, setParams] = useSearchParams();

  const loadProducts = async () => {
    setLoading(true);

    try {
      const data = await fetchProducts(Object.fromEntries([...params]));

      setProducts(data.results || []);
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

  const updateFilter = (key, value) => {
    if (value) params.set(key, value);
    else params.delete(key);
    setParams(params);
  };

  return (
    <div className="container py-4">

      <h3 className="fw-bold mb-4">All Products</h3>

      {/* FILTER BAR */}
      <div className="row g-3 mb-4">
        <div className="col-4 col-md-4">
          <select
            className="form-select"
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
            className="form-control"
            placeholder="Search for products..."
            onChange={(e) => updateFilter("search", e.target.value)}
          />
        </div>
      </div>

      {/* LOADING */}
      {loading && <p className="text-center py-5">Loading...</p>}

      {/* PRODUCT GRID */}
      <div className="row g-3 g-md-4">
        {products.map((product) => (
          <div key={product.id} className="col-6 col-md-4 col-lg-3">
            <Link
              to={`/product/${product.id}`}
              className="text-decoration-none text-dark"
            >
              <div className="card border-0 shadow-sm product-card">

                {/* Responsive Image Wrapper */}
                <div className="product-image-wrapper w-100 rounded-top">
                  <img
                    src={product.images?.[0]?.image_url}
                    alt={product.name}
                    className="w-100 "
                    style={{
                      objectFit: "cover",
                      transition: "transform .3s",
                    }}
                  />
                </div>

                <div className="card-body">
                  <h6 className="fw-semibold text-truncate">{product.name}</h6>

                  <p className="mb-0">
                    <span className="fw-bold">
                      ₹{product.sale_price || product.price}
                    </span>

                    {product.sale_price && (
                      <span className="text-muted text-decoration-line-through ms-2 small">
                        ₹{product.price}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="d-flex justify-content-center my-4 gap-3">
        {pagination.previous && (
          <button
            className="btn btn-outline-dark"
            onClick={() => {
              const url = new URL(pagination.previous);
              setParams(url.searchParams);
            }}
          >
            Previous
          </button>
        )}

        {pagination.next && (
          <button
            className="btn btn-dark"
            onClick={() => {
              const url = new URL(pagination.next);
              setParams(url.searchParams);
            }}
          >
            Next
          </button>
        )}
      </div>

      {/* RESPONSIVE CSS */}
      <style>{`
        /* Default mobile height */
        .product-image-wrapper {
          height: 180px;
          overflow: hidden;
        }

        /* Tablet >= 768px */
        @media (min-width: 768px) {
          .product-image-wrapper {
            height: 220px !important;
          }
        }

        /* Desktop >= 992px */
        @media (min-width: 992px) {
          .product-image-wrapper {
            height: 260px !important;
          }
        }

        /* Hover Zoom effect */
        .product-card:hover img {
          transform: scale(1.06);
        }
      `}</style>
    </div>
  );
};

export default Products;

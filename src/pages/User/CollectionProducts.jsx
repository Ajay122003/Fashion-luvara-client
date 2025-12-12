import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchCollectionProducts } from "../../api/collections";

const CollectionProducts = () => {
  const { slug } = useParams();

  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCollection = async () => {
    try {
      setLoading(true);

      const res = await fetchCollectionProducts(slug);

      // Backend returns full collection with products[]
      setCollection(res.data);

    } catch (err) {
      console.error("Failed to load collection:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollection();
  }, [slug]);

  if (loading)
    return <p className="text-center py-5 fw-bold">Loading…</p>;

  if (!collection)
    return <p className="text-center py-5">Collection not found.</p>;

  return (
    <div className="container py-4">
      <h3 className=" mb-4">
        {collection.name}
      </h3>
      {/* ================= PRODUCT GRID ================= */}
      <div className="row g-4">
        {collection.products?.length === 0 ? (
          <p className="text-center py-4">No products available.</p>
        ) : (
          collection.products.map((product) => (
            <div key={product.id} className="col-6 col-md-4 col-lg-3">
              <Link
                to={`/product/${product.id}`}
                className="text-decoration-none text-dark"
              >
                <div className="card product-card shadow-sm h-100">

                  {/* IMAGE FRAME */}
                  <div className="product-img-wrapper">
                    <img
                      src={product.images?.[0]?.image_url || "/placeholder.png"}
                      alt={product.name}
                      className="product-img"
                    />
                  </div>

                  <div className="card-body px-2">
                    <h6 className="fw-semibold mb-1 text-truncate">
                      {product.name}
                    </h6>

                    <p className="mb-0 fw-bold">
                      ₹{product.sale_price || product.price}
                    </p>

                    {product.sale_price && (
                      <p className="text-muted small text-decoration-line-through mb-0">
                        ₹{product.price}
                      </p>
                    )}
                  </div>

                </div>
              </Link>
            </div>
          ))
        )}
      </div>

      {/* ==================== CSS ==================== */}
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
          padding: 8px;
          border-radius: 12px 12px 0 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-img {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
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


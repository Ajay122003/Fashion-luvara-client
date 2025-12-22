import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchRelatedProducts } from "../../api/products";

const RelatedProducts = ({ productId }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchRelatedProducts(productId);
      setProducts(data || []);
    };
    if (productId) load();
  }, [productId]);

  if (!products.length) return null;

  return (
    <div className="mt-5">
      <h5 className="fw-semibold mb-3">You may also like</h5>

      <div className="row g-3 g-md-4">
        {products.map((p) => (
          <div
            className="col-6 col-sm-6 col-md-4 col-lg-3"
            key={p.id}
          >
            <Link
              to={`/product/${p.id}`}
              onClick={() =>
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
              className="text-decoration-none text-dark"
            >
              <div className="card related-card h-100 border-0">

                {/* IMAGE */}
                <div className="related-img-wrapper">
                  <img
                    src={p.images?.[0]?.image_url}
                    alt={p.name}
                    loading="lazy"
                  />
                </div>

                {/* BODY */}
                <div className="card-body px-2 pb-3">
                  <h6 className="fw-semibold text-truncate mb-1">
                    {p.name}
                  </h6>

                  <p className="mb-0 fw-bold">
                    ₹{p.sale_price || p.price}
                  </p>

                  {p.sale_price && (
                    <small className="text-muted text-decoration-line-through">
                      ₹{p.price}
                    </small>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* ================= CSS ================= */}
      <style>{`
        .related-card {
          
          transition: transform .25s ease, box-shadow .25s ease;
          background: #fff;
        }

        

        /* IMAGE BOX */
        .related-img-wrapper {
          width: 100%;
          aspect-ratio: 3 / 4;
          overflow: hidden;
          background: #f5f5f5;
        }

        .related-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .4s ease;
        }

        .related-card:hover img {
          transform: scale(1.08);
        }

        /* MOBILE TUNING */
        @media (max-width: 576px) {
          .related-card {
            border-radius: 14px;
          }

          .related-img-wrapper {
            border-radius: 14px 14px 0 0;
          }
        }
      `}</style>
    </div>
  );
};

export default RelatedProducts;

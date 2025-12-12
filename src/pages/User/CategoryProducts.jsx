import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/client";

const CategoryProducts = () => {
  const { slug } = useParams();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCategory = async () => {
    try {
      const res = await api.get(`/api/categories/slug/${slug}/`);
      setCategory(res.data);
    } catch (err) {
      console.error("Category not found", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategory();
  }, [slug]);

  if (loading)
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-dark"></div>
        <p className="mt-3 fw-semibold">Loading products...</p>
      </div>
    );

  if (!category)
    return (
      <div className="container py-5 text-center">
        <h4 className="fw-bold">Category Not Found</h4>
        <p>This category does not exist.</p>
      </div>
    );

  return (
    <div className="container py-4">

      {/* CATEGORY TITLE */}
      <h3 className=" mb-4 ">
        {category.name}
      </h3>

      {/* PRODUCTS GRID */}
      <div className="row g-4">
        {category.products?.length === 0 ? (
          <p className="text-center py-5">No products available in this category.</p>
        ) : (
          category.products.map((product) => (
            <div className="col-6 col-md-4 col-lg-3" key={product.id}>
              <Link
                to={`/product/${product.id}`}
                className="text-decoration-none text-dark"
              >
                <div className="card product-card shadow-sm h-100 border-0">

                  {/* IMAGE */}
                  <div className="product-img-wrapper">
                    <img
                      src={product.images?.[0]?.image_url}
                      alt={product.name}
                      className="product-img"
                    />
                  </div>

                  {/* BODY */}
                  <div className="card-body px-2">
                    <h6 className="fw-semibold mb-1 text-truncate">
                      {product.name}
                    </h6>

                    {/* PRICING */}
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

      {/* CUSTOM CSS */}
      <style>{`
        .product-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          border-radius: 12px;
        }
        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        }

        /* FULL IMAGE FIT INSIDE CARD */
        .product-img-wrapper {
          height: 240px;
          overflow: hidden;
          border-radius: 12px 12px 0 0;
        }

        .product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;       /* FULL IMAGE FILL LIKE MYNTRA */
          transition: transform 0.4s ease;
        }

        .product-card:hover .product-img {
          transform: scale(1.07);
        }

        @media (max-width: 576px) {
          .product-img-wrapper {
            height: 200px;
          }
        }
      `}</style>
    </div>
  );
};

export default CategoryProducts;

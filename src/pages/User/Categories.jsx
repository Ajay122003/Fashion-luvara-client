import React, { useEffect, useState } from "react";
import api from "../../api/client"; // Axios instance
import { Link } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    try {
      const res = await api.get("/api/categories/");
      setCategories(res.data);
    } catch (err) {
      console.error("Error loading categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // -------------- Loading State --------------
  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-dark"></div>
        <p className="mt-2">Loading categories...</p>
      </div>
    );

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4 text-center">Shop by Category</h3>

      <div className="row g-4">
        {categories.map((cat) => (
          <div className="col-6 col-md-4 col-lg-3" key={cat.id}>
            <Link
              to={`/categories/${cat.slug}`}
              className="text-decoration-none text-dark"
            >
              <div
                className="card shadow-sm h-100"
                style={{ borderRadius: "12px", overflow: "hidden" }}
              >
                {/* CATEGORY IMAGE */}
                <img
                  src={cat.image_url || "/placeholder.png"}
                  alt={cat.name}
                  className="card-img-top"
                  style={{
                    height: "170px",
                    objectFit: "cover",
                  }}
                />

                {/* NAME */}
                <div className="card-body text-center">
                  <h6 className="fw-bold m-0">{cat.name}</h6>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;

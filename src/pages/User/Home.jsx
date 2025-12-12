import { useEffect, useState } from "react";
import api from "../../api/client";
import { fetchCollections } from "../../api/collections";
import { Link } from "react-router-dom";
import Products from "./Products";

const Home = () => {
  const [collections, setCollections] = useState([]);
  const [categories, setCategories] = useState([]);

  const loadData = async () => {
    try {
      const colRes = await fetchCollections();
      const catRes = await api.get("/api/categories/");

      setCollections(colRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.log("Home API error:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="bg-white py-4">

      {/* FULL WIDTH HERO BANNER */}
      <div className="mb-5">
        <div className="rounded overflow-hidden" style={{ height: "300px" }}>
          <img
            src="/banner-main.jpg"
            alt="Banner"
            className="w-100 h-100"
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>

      {/* ============================= */}
      {/* ⭐ COLLECTIONS + CATEGORIES */}
      {/* ============================= */}

      <div className="container">

        {/* COLLECTIONS TITLE */}
        <h3 className="mb-4 ">Collections</h3>

        {/* COLLECTIONS GRID */}
        <div className="row g-4 mb-4">
          {collections.map((col) => (
            <div className="col-12 col-md-4" key={col.id}>
              <Link to={`/collections/${col.slug}`} className="text-decoration-none text-dark">

                <div className="overflow-hidden position-relative ">
                  <img
                    src={col.image_url || "/placeholder.png"}
                    alt={col.name}
                    className="w-100 image-zoom"
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                </div>

                <p className="mt-2 ">
                  {col.name} <i className="bi bi-arrow-right"></i>
                </p>

              </Link>
            </div>
          ))}
        </div>

        {/* CATEGORIES GRID */}
        <div className="row g-4 mb-5">
          {categories.map((cat) => (
            <div className="col-12 col-md-4" key={cat.id}>
              <Link to={`/categories/${cat.slug}`} className="text-decoration-none text-dark">

                <div className="overflow-hidden position-relative ">
                  <img
                    src={cat.image_url || "/placeholder.png"}
                    alt={cat.name}
                    className="w-100 image-zoom"
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                </div>

                <p className="mt-2 ">
                  {cat.name} <i className="bi bi-arrow-right"></i>
                </p>

              </Link>
            </div>
          ))}
        </div>
      <Products/>
      </div>

      {/* IMAGE ZOOM CSS */}
      <style>{`
        .image-zoom {
          transition: transform 0.4s ease;
        }
        .image-zoom:hover {
          transform: scale(1.07);
        }
      `}</style>

    </div>
  );
};

export default Home;

import { useEffect, useState } from "react";
import publicClient from "../../api/publicClient";
import { fetchCollections } from "../../api/collections";
import { getCategories } from "../../api/category";
import { Link } from "react-router-dom";
import Products from "./Products";
import banner from "../../assets/images/banner1.jpg";
import Offers from "./Offers";
import HorizontalProductRow from "../../components/products/HorizontalProductRow";
import AOS from "aos";
import "aos/dist/aos.css";

const Home = () => {
  const [collections, setCollections] = useState([]);
  const [categories, setCategories] = useState([]);

  const loadData = async () => {
    try {
      const colRes = await fetchCollections();
      const catRes = await getCategories();

      setCollections(colRes?.data ?? colRes ?? []);
      setCategories(catRes?.data ?? catRes ?? []);
    } catch (error) {
      console.log("Home API error:", error);
      setCollections([]);
      setCategories([]);
    }
  };

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    loadData();
  }, []);

  /* ================= AOS INIT ================= */
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  return (
    <div className="bg-white py-4">

      {/* ================= HERO BANNER ================= */}
      <div className="mb-5" data-aos="fade-in">
        <div className="hero-banner">
          <img
            src={banner}
            alt="Banner"
            className="hero-banner-img"
          />
        </div>
      </div>

      <Offers />

      {/* ================= CONTENT ================= */}
      <div className="container">

        {/* COLLECTIONS TITLE */}
        <h3
  className="mb-4"
  data-aos="fade-up"
  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
>
  Collections
</h3>

        {/* COLLECTIONS GRID */}
        <div className="row g-4 mb-4">
          {collections.map((col, index) => (
            <div
              className="col-12 col-md-4"
              key={col.id}
              data-aos="fade-up"
              data-aos-delay={index * 1200}
            >
              <Link
                to={`/collections/${col.slug}`}
                className="text-decoration-none text-dark"
              >
                <div className="overflow-hidden">
                  <img
                    src={col.image_url || "/placeholder.png"}
                    alt={col.name}
                    className="w-100 image-zoom"
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                </div>

                <p className="mt-2 fw-semibold">
                  {col.name} <i className="bi bi-arrow-right"></i>
                </p>
              </Link>
            </div>
          ))}
        {/* </div> */}

        {/* CATEGORIES GRID */}
        {/* <div className="row g-4 mb-5"> */}
          {categories.map((cat, index) => (
            <div
              className="col-12 col-md-4"
              key={cat.id}
              data-aos="fade-up"
              data-aos-delay={index * 1000}
            >
              <Link
                to={`/categories/${cat.slug}`}
                className="text-decoration-none text-dark"
              >
                <div className="overflow-hidden">
                  <img
                    src={cat.image_url || "/placeholder.png"}
                    alt={cat.name}
                    className="w-100 image-zoom"
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                </div>

                <p className="mt-2 fw-semibold">
                  {cat.name} <i className="bi bi-arrow-right"></i>
                </p>
              </Link>
            </div>
          ))}
        </div>

        {/* PRODUCTS ROW */}
        <div data-aos="fade-up">
          <HorizontalProductRow />
        </div>
      </div>

      {/* ================= STYLES ================= */}
      <style>{`
        /* HERO BANNER */
        .hero-banner {
          width: 100%;
          overflow: hidden;
        }

        .hero-banner-img {
          width: 100%;
          height: auto;
          max-height: 620px;
          object-fit: cover;
          display: block;
        }

        /* Tablet */
        @media (max-width: 992px) {
          .hero-banner-img {
            max-height: 420px;
          }
        }

        /* Mobile */
        @media (max-width: 576px) {
          .hero-banner-img {
            max-height: 220px;
          }
        }

        /* IMAGE ZOOM */
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


import { useEffect, useState, useRef } from "react";
import { fetchCollections } from "../../api/collections";
import { getCategories } from "../../api/category";
import { Link } from "react-router-dom";
import banner from "../../assets/videos/banner1.MOV";
import Offers from "./Offers";
import HorizontalProductRow from "../../components/products/HorizontalProductRow";
import AOS from "aos";
import "aos/dist/aos.css";

const Home = () => {
  const [collections, setCollections] = useState([]);
  const [categories, setCategories] = useState([]);
  const videoRef = useRef(null);

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

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (videoRef.current) {
        const scrollY = window.scrollY;
        videoRef.current.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-white py-4">
      {/* HERO VIDEO */}
      <div className="hero-banner">
        <video
          ref={videoRef}
          className="hero-banner-video mb-4"
          src={banner}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      <Offers />

      <div className="container mt-4">
        {/* TITLE */}
        <h3
          className="mb-4 text-center"
          data-aos="fade-up"
          style={{
            fontFamily: "'Lobster Two', cursive",
            fontWeight: 700,
            fontSize: "42px",
          }}
        >
          Explore Collection
        </h3>

        {/* COLLECTIONS */}
        <div className="row g-4 mb-4">
          {collections.map((col, index) => (
            <div
              className="col-12 col-md-4"
              key={col.id}
              data-aos="fade-up"
              data-aos-delay={index * 200}
            >
              <Link
                to={`/collections/${col.slug}`}
                className="text-decoration-none text-dark"
              >
                <div className="card-container position-relative">
                  <img
                    src={col.image_url || "/placeholder.png"}
                    alt={col.name}
                    className="w-100 image-zoom"
                  />

                  <div className="image-overlay"></div>

                  <div className="overlay-text">
                    {col.name} <i className="bi bi-arrow-right"></i>
                  </div>
                </div>
              </Link>
            </div>
          ))}

          {/* CATEGORIES */}
          {categories.map((cat, index) => (
            <div
              className="col-12 col-md-4"
              key={cat.id}
              data-aos="fade-up"
              data-aos-delay={index * 200}
            >
              <Link
                to={`/categories/${cat.slug}`}
                className="text-decoration-none text-dark"
              >
                <div className="card-container position-relative">
                  <img
                    src={cat.image_url || "/placeholder.png"}
                    alt={cat.name}
                    className="w-100 image-zoom"
                  />

                  <div className="image-overlay"></div>

                  <div className="overlay-text">
                    {cat.name} <i className="bi bi-arrow-right"></i>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* PRODUCTS */}
        <div data-aos="fade-up">
          <HorizontalProductRow />
        </div>
      </div>

      {/* STYLES */}
      <style>{`
        /* HERO */
        .hero-banner {
          width: 100%;
          overflow: hidden;
        }

        .hero-banner-video {
          width: 100%;
          height: 500px;
          object-fit: cover;
        }

        /* CARD */
        .card-container {
          border-radius: 18px;
          overflow: hidden;
        }

        .card-container img {
          height: 250px;
          object-fit: cover;
          border-radius: 18px;
          transition: transform 0.5s ease;
        }

        .card-container:hover img {
          transform: scale(1.08);
        }

        /* OVERLAY */
        .image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.7),
            rgba(0,0,0,0.2),
            transparent
          );
          border-radius: 18px;
        }

        /* TEXT */
        .overlay-text {
          position: absolute;
          bottom: 12px;
          left: 12px;
          color: white;
          padding: 6px 14px;
          border-radius: 25px;
          font-weight: 600;
          backdrop-filter: blur(6px);
          background: rgba(0,0,0,0.4);
          transition: 0.3s;
        }

        .card-container:hover .overlay-text {
          transform: translateY(-3px);
        }

        /* RESPONSIVE */
        @media (max-width: 576px) {
          .hero-banner-video {
            height: 450px;
          }

          .overlay-text {
            font-size: 12px;
            padding: 5px 10px;
          }
        }

        @media (min-width: 768px) {
          .hero-banner-video {
            height: 400px;
          }
        }

        @media (min-width: 992px) {
          .hero-banner-video {
            height: 500px;
          }

          .overlay-text {
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
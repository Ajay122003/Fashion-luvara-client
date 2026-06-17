
import { useEffect, useState } from "react";
import { fetchCollections } from "../../api/collections";
import { getCategories } from "../../api/category";
import { Link } from "react-router-dom";
import Banner from "../../components/Banner/Banner";
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

 

  return (
    <div className="bg-white py-4">

      <Banner />

      <Offers />

      <div className="container mt-5">
        {/* TITLE */}
        

        <div className="title-wrapper">

  {/* 🌿 REAL SVG LEAVES */}
  <div className="leaves">
    {[...Array(6)].map((_, i) => (
      <span key={i}>
        <svg viewBox="0 0 24 24" className="leaf">
          <path d="M12 2C8 6 4 10 4 14a8 8 0 0016 0c0-4-4-8-8-12z" />
        </svg>
      </span>
    ))}
  </div>

  <h3
    className="mb-4 text-center animated-title"
    data-aos="fade-right"
    // style={{
    //   fontFamily: "'Lobster Two', cursive",
    //   fontWeight: 700,
    //   fontSize: "40px",
    // }}
    style={{
  fontFamily: "'Cormorant Garamond', serif",
  fontWeight: 700,
  fontSize: "30px",
  letterSpacing: "2px",
  textTransform: "uppercase",
  color: "#313E17",
}}
  >
    Explore Collection
  </h3>

</div>

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

                  <div className="overlay-text " data-aos="fade-right" data-aos-delay={index * 100}>
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

                  <div className="overlay-text" data-aos="fade-right" data-aos-delay={index * 100}>
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
  .overlay-text {
    font-size: 12px;
    padding: 5px 10px;
  }
}

        

        @media (min-width: 992px) {
  .overlay-text {
    font-size: 15px;
  }
}



.title-wrapper {
  position: relative;
  overflow: hidden;
}

/* LEAVES CONTAINER */
.leaves {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

/* EACH LEAF */
.leaves span {
  position: absolute;
  display: block;
  width: 25px;
  height: 25px;
  animation: flyLeaf linear infinite;
}

/* SVG STYLE */
.leaf {
  width: 100%;
  height: 100%;
  fill: #313E17;
  filter: drop-shadow(0 0 6px rgba(201,161,74,0.6));
}

/* RANDOM POSITIONS + SPEED */
.leaves span:nth-child(1) {
  left: 5%;
  animation-duration: 10s;
}
.leaves span:nth-child(2) {
  left: 20%;
  animation-duration: 8s;
}
.leaves span:nth-child(3) {
  left: 40%;
  animation-duration: 12s;
}
.leaves span:nth-child(4) {
  left: 60%;
  animation-duration: 9s;
}
.leaves span:nth-child(5) {
  left: 75%;
  animation-duration: 11s;
}
.leaves span:nth-child(6) {
  left: 90%;
  animation-duration: 7s;
}

/*  REALISTIC LEAF MOTION */
@keyframes flyLeaf {
  0% {
    transform: translateY(120px) translateX(0) rotate(0deg);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  50% {
    transform: translateY(-50px) translateX(20px) rotate(180deg);
  }
  100% {
    transform: translateY(-250px) translateX(-30px) rotate(360deg);
    opacity: 0;
  }
}

/* TEXT ABOVE */
// .animated-title {
//   position: relative;
//   z-index: 2;
// }


.animated-title{
    position:relative;
    z-index:2;
    color:#313E17;
    text-transform:uppercase;
    letter-spacing:2px;
    text-shadow:
      0 2px 8px rgba(0,0,0,.12),
      0 0 25px rgba(49,62,23,.12);
}

.animated-title::after{
    content:"";
    display:block;
    width:140px;
    height:3px;
    margin:12px auto 0;
    border-radius:20px;
    background:linear-gradient(90deg,#313E17,#C9A14A,#313E17);
}
      `}</style>
    </div>
  );
};

export default Home;
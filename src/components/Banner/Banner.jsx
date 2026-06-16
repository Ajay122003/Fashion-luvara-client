import { useEffect, useState, useRef } from "react";
import { fetchBanner } from "../../api/auth";

const Banner = () => {
  const [banner, setBanner] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    loadBanner();
  }, []);

  const loadBanner = async () => {
    try {
      const data = await fetchBanner();
      setBanner(data);
    } catch (err) {
      console.error("Banner Load Error:", err);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (videoRef.current) {
        const scrollY = window.scrollY;
        videoRef.current.style.transform = `translateY(${scrollY * 0.2}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  if (!banner?.video) return null;

  return (
    <>
      <div className="hero-banner">
        <video
          ref={videoRef}
          className="hero-banner-video"
          src={banner.video}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
      </div>

      <style>{`
        .hero-banner {
          width: 100%;
          height: 75vh;
          min-height: 350px;
          max-height: 850px;
          overflow: hidden;
          position: relative;
          background: #000;
        }

        .hero-banner-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.2s linear;
        }

        /* Mobile */
        @media (max-width: 576px) {
          .hero-banner {
            height: 40vh;
            min-height: 250px;
          }
        }

        /* Tablet */
        @media (min-width: 577px) and (max-width: 991px) {
          .hero-banner {
            height: 50vh;
          }
        }

        /* Laptop */
        @media (min-width: 992px) and (max-width: 1399px) {
          .hero-banner {
            height: 70vh;
          }
        }

        /* Large Screens */
        @media (min-width: 1400px) {
          .hero-banner {
            height: 80vh;
          }
        }
      `}</style>
    </>
  );
};

export default Banner;
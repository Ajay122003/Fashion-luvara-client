


import { useEffect, useState, useRef } from "react";
import { fetchBanner } from "../../api/auth";

const Banner = () => {
  const [banner, setBanner] = useState(null);
  const videoRef = useRef(null);
  const [aspectRatio, setAspectRatio] = useState(null); // e.g. 56.25 for 16:9

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

  /* ── Read actual video dimensions once metadata loads ── */
  const handleMetadata = () => {
    const vid = videoRef.current;
    if (!vid) return;
    const ratio = (vid.videoHeight / vid.videoWidth) * 100;
    setAspectRatio(ratio); // e.g. 56.25 for 16:9, 133.33 for 9:16
  };

  /* ── Parallax desktop only ── */
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) return;

    const handleScroll = () => {
      if (videoRef.current) {
        videoRef.current.style.transform = `translateY(calc(-50% + ${window.scrollY * 0.12}px))`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!banner?.video) return null;

  const isMobilePortrait = aspectRatio && aspectRatio > 100; // 9:16 type video

  return (
    <>
      <section
        className="hero-banner"
        style={
          aspectRatio
            ? { paddingTop: `min(${aspectRatio}%, 100vh)` }
            : undefined
        }
      >
        <video
          ref={videoRef}
          className="hero-banner-video"
          src={banner.video}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedMetadata={handleMetadata}
        />
        <div className="hero-overlay" />
      </section>

      <style>{`
        .hero-banner {
          position: relative;
          width: 100%;
          overflow: hidden;
          background: #1a0f08;

          /*
            Default before metadata loads:
            Use 56.25% (16:9) as safe fallback.
            Once onLoadedMetadata fires, inline style
            overrides with the real ratio.
          */
          padding-top: 56.25%;
        }

        /* Desktop overrides — tall hero, cover crop is fine */
        @media (min-width: 768px) {
          .hero-banner {
            padding-top: 0 !important;
            height: 52vh;
          }
        }
        @media (min-width: 992px) {
          .hero-banner {
            height: 78vh;
          }
        }
        @media (min-width: 1400px) {
          .hero-banner {
            height: 92vh;
          }
        }

        /* ── VIDEO ── */
        .hero-banner-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          /*
            object-fit: fill  → stretches to exact container size.
            Since container ratio = video ratio (from padding-top),
            no distortion happens — video fills 100% with zero crop.
          */
          object-fit: fill;
          display: block;
          transform: none;
        }

        /* Desktop: cover + parallax */
        @media (min-width: 768px) {
          .hero-banner-video {
            object-fit: cover;
            object-position: center center;
            top: 50%;
            height: 110%;
            transform: translateY(-50%);
            transition: transform 0.1s linear;
          }
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.12) 0%,
            rgba(0,0,0,0.02) 45%,
            rgba(0,0,0,0.18) 100%
          );
          z-index: 1;
        }
      `}</style>
    </>
  );
};

export default Banner;
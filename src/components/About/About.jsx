import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import about from "../../assets/images/about.png";

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className="about-section">
      <div className="about-container">

        {/* TOP IMAGE */}
        <div className="about-image-wrapper" data-aos="fade-up">
          <img
            src={about}  // change path if needed
            alt="LUVARA Brand"
            className="about-image"
          />
        </div>

        {/* TITLE */}
        <h2
          className="about-title"
          data-aos="fade-right"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 600,
          }}
        >
          About Us
        </h2>

        {/* CONTENT */}
        <p className="about-text" >
          <strong>LUVARA</strong> is a fashion label built on intention,
          precision, and thoughtful design.
        </p>

        <p className="about-text">
          Founded by <strong>Dharikka</strong>, the brand was created with a
          clear vision — to design pieces that reflect balance, structure, and
          refined craftsmanship. Every creation is approached with care,
          focusing on fabric quality, silhouette, and finishing.
        </p>

        <p className="about-text">
          The design process values restraint over excess, allowing each piece
          to feel elevated and timeless. Attention to detail and a commitment
          to quality define every collection.
        </p>

        <p className="about-text">
          Individuality is central to the brand’s philosophy. Designs are
          developed with an understanding of form and fit, with personalization
          offered where possible to ensure each piece feels considered and
          distinctive.
        </p>

        <p className="about-text about-highlight" >
          LUVARA represents a quiet sense of luxury expressed through subtlety,
          confidence, and enduring style.
        </p>
      </div>

      {/* STYLES */}
      <style>
        {`
        .about-section {
          padding: 80px 20px;
          background-color: #ffffff;
        }

        .about-container {
          max-width: 900px;
          margin: auto;
          text-align: center;
        }

        .about-image-wrapper {
          margin-bottom: 40px;
        }

        .about-image {
          width: 100%;
          max-height: 420px;
          object-fit: cover;
          border-radius: 14px;
        }

        .about-title {
          font-size: 36px;
          margin-bottom: 30px;
          letter-spacing: 1px;
        }

        .about-text {
          font-size: 16px;
          line-height: 1.8;
          color: #444;
          margin-bottom: 20px;
        }

        .about-highlight {
          font-weight: 500;
          color: #111;
          margin-top: 30px;
        }

        @media (max-width: 768px) {
          .about-title {
            font-size: 28px;
          }

          .about-image {
            max-height: 280px;
          }
        }
        `}
      </style>
    </section>
  );
};

export default About;

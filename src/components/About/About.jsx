import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import about from "../../assets/images/about.png";

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section
      className="about-section"
      style={{ backgroundImage: `url(${about})` }}
    >
      <div className="about-container">

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
        <p className="about-text">
          <strong>LUVARA</strong> is a fashion label built on intention,
          precision, and thoughtful design.
        </p>

        <p className="about-text">
          Founded by <strong>Dharikka</strong>, the brand was created with a clear vision — to design pieces that reflect balance, structure, and refined craftsmanship. Every creation is approached with care, 
          focusing on fabric quality, silhouette, and finishing.
        </p>

        <p className="about-text">
          The design process values restraint over excess, allowing each piece to feel elevated and timeless. Attention to detail and a commitment to quality 
          define every collection.
        </p>

        <p className="about-text">
          Individuality is central to the brand’s philosophy. Designs are developed with an understanding of form and fit, with personalization offered where possible to ensure each piece feels considered and distinctive.
        </p>

        <p className="about-text about-highlight">
          LUVARA represents a quiet sense of luxury expressed through
          subtlety, confidence, and enduring style.
        </p>

       < div className="contact-box" data-aos="fade-up">
          <h3>Contact Us</h3>
          <p>Email: <a href="mailto:yourmail@gmail.com">dharikka8@gmail.com</a></p>
          <p>Phone: <a href="tel:+911234567890">+91 8110811071</a></p>
        </div>

      </div>

      {/* STYLES */}
      <style>
        {`
        .about-section {
          padding: 80px 20px;
          background-size: cover;
          background-repeat: no-repeat;
          animation: bgMove 20s linear infinite;
          position: relative;
        }

        /* Dark overlay optional */
        .about-section::before {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.85);
        }

        .about-container {
          position: relative;
          max-width: 900px;
          margin: auto;
          text-align: center;
          z-index: 1;
        }

        @keyframes bgMove {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 0%; }
        }

        .about-title {
          font-size: 36px;
          margin-bottom: 30px;
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
        }

        .contact-box {
          margin-top: 50px;
          padding: 25px;
          border-radius: 12px;
          background: #ffffffcc;
          backdrop-filter: blur(5px);
        }

        .contact-box h3 {
          margin-bottom: 15px;
        }

        .contact-box a {
          color: #000;
          text-decoration: none;
          font-weight: 500;
        }

        .contact-box a:hover {
          text-decoration: underline;
        }
        `}
      </style>
    </section>
  );
};

export default About;
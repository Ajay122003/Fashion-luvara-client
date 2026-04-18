

import { Link } from "react-router-dom";
import SubscribeBox from "./SubscribeBox";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <>
      {/*  SUBSCRIBE SECTION */}
      <SubscribeBox/>

      {/*  FOOTER */}
      <footer
        className="text-center text-light pt-5 pb-4"
        style={{
          background: "#0f0f0f",
        }}
      >
        <div className="container">

          {/* Divider */}
          <div
            style={{
              height: "1px",
              background: "#333",
              marginBottom: "20px",
            }}
          ></div>

          {/* Business Name */}
          <p>
            LUVARA is owned and operated by{" "}
            <span style={{ color: "#c9a646", fontWeight: "600" }}>
              Dharikka J
            </span>
          </p>

          <p className="mb-3">
            © {year} LUVARA. All Rights Reserved.
          </p>

          {/* Links */}
          <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
            <Link to="/privacy" className="footer-link">
              Privacy Policy
            </Link>
            <Link to="/refund" className="footer-link">
              Refund Policy
            </Link>
            <Link to="/terms" className="footer-link">
              Terms & Conditions
            </Link>
            <Link to="/contact-information" className="footer-link">
              Contact Information
            </Link>
          </div>

          {/* Social Icons */}
          {/* <div className="d-flex justify-content-center gap-3">
            <i className="bi bi-instagram footer-icon"></i>
            <i className="bi bi-facebook footer-icon"></i>
            <i className="bi bi-pinterest footer-icon"></i>
            <i className="bi bi-whatsapp footer-icon"></i>
          </div> */}
        </div>
      </footer>

      {/*  STYLES */}
      <style>
        {`
          .footer-link {
            color: #ccc;
            text-decoration: none;
            font-size: 14px;
          }

          .footer-link:hover {
            color: #c9a646;
          }

          .footer-icon {
            font-size: 18px;
            color: #c9a646;
            cursor: pointer;
            transition: 0.3s;
          }

          .footer-icon:hover {
            transform: scale(1.2);
            color: #fff;
          }
        `}
      </style>
    </>
  );
};

export default Footer;
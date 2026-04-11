import SubscribeBox from "./SubscribeBox";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear(); 
  return (
    <>
      <SubscribeBox />

      <footer className="bg-white text-black text-center py-3">
        
        {/* Business Legal Name */}
        <div>
          LUVARA is owned and operated by <b>Dharikka J</b>
        </div>

        <div>
          © {year} LUVARA. All Rights Reserved.
        </div>

        {/* Policy Links */}
        <div style={{ marginTop: "10px" }}>
          <Link to="/privacy" style={{ color: "black" }}>Privacy Policy</Link> |{" "}
          <Link to="/refund" style={{ color: "black" }}>Refund Policy</Link> |{" "}
          <Link to="/terms" style={{ color: "black" }}>Terms & Conditions</Link> |{" "}
          <Link to="/contact-information" style={{ color: "black" }}>Contact Information</Link>
        </div>

      </footer>
    </>
  );
};

export default Footer;
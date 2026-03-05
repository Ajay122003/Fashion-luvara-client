import SubscribeBox from "./SubscribeBox";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <SubscribeBox />

      <footer className="bg-white text-black text-center py-3">
        <div>
          © 2026 LUVARA. All Rights Reserved.
        </div>

        {/* Policy Links */}
        <div style={{ marginTop: "10px", }}>
          <Link to="/privacy"  style={{ color: "black"}}>Privacy Policy</Link> |{" "}
          <Link to="/refund" style={{ color: "black"}}>Refund Policy</Link> |{" "}
          <Link to="/terms" style={{ color: "black"}}>Terms & Conditions</Link>
        </div>
      </footer>
    </>
  );
};

export default Footer;

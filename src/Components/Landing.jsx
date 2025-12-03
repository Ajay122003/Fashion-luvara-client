import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

import AOS from "aos";
import "aos/dist/aos.css";

function Landing() {
  useEffect(() => {
    AOS.init({
      duration: 600,   // fast & clear animation
      easing: "ease-out",
      once: true,      // only once animate
    });
  }, []);

  return (
    <div className="landing-bg d-flex align-items-center justify-content-center">
      <div className="text-center content-box" data-aos="fade-up">
        <h1 className="brand-title" data-aos="zoom-in">LUVARA</h1>
        <p className="sub-tagline" data-aos="fade-up" data-aos-delay="200">
          Women's Fashion
        </p>

        <h3 className="coming-title mt-4" data-aos="fade-up" data-aos-delay="300">
          COMING SOON
        </h3>

        <p className="coming-text" data-aos="fade-up" data-aos-delay="400">
          A fresh style experience is on the way.
        </p>
      </div>
    </div>
  );
}

export default Landing;


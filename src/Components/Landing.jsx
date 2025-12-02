import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

function Landing() {
  return (
    <div className="coming-bg d-flex align-items-center justify-content-center">
      <div className="text-center p-4 coming-box">
        <h1 className="brand">LUVARA</h1>
        <p className="tagline">Fashion That Defines You</p>

        <h3 className="coming-soon mt-4">COMING SOON</h3>
        <p className="text-light mb-4">We're launching something beautiful.</p>

        <div className="d-flex gap-2 justify-content-center">
          <input
            type="email"
            className="form-control email-box"
            placeholder="Enter your email"
          />
          <button className="btn btn-light notify-btn">Notify Me</button>
        </div>
      </div>
    </div>
  );
}

export default Landing;





import { useState } from "react";
import sizechart from "../assets/images/sizechart.jpeg";

const SizeChartModal = () => {
  const [zoom, setZoom] = useState(false);

  return (
    <div
      className="offcanvas offcanvas-end advanced-offcanvas"
      tabIndex="-1"
      id="sizeChartModal"
      aria-labelledby="sizeChartLabel"
    >
      {/* HEADER */}
      <div className="offcanvas-header custom-header">
        <h5 className="offcanvas-title" id="sizeChartLabel">
           Size Guide
        </h5>

        <button
          type="button"
          className="btn-close custom-close"
          data-bs-dismiss="offcanvas"
        ></button>
      </div>

      {/* BODY */}
      <div className="offcanvas-body text-center">
        <div
          className={`image-wrapper ${zoom ? "zoomed" : ""}`}
          onClick={() => setZoom(!zoom)}
        >
          <img src={sizechart} alt="Size Chart" />
        </div>

        <p className="mt-3 text-muted small">
          Tap image to zoom 
        </p>
      </div>

      {/* STYLES */}
      <style>{`
        /* BACKDROP */
        .offcanvas-backdrop.show {
          backdrop-filter: blur(6px);
          background: rgba(0,0,0,0.4);
        }

        /* MAIN PANEL */
        .advanced-offcanvas {
          width: 420px;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(12px);
          border-left: 1px solid rgba(0,0,0,0.1);
        }

        /* HEADER */
        .custom-header {
          border-bottom: 1px solid rgba(0,0,0,0.08);
          background: transparent;
        }

        .offcanvas-title {
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        /* CLOSE BUTTON */
        .custom-close {
          filter: invert(0.5);
          transition: 0.3s;
        }

        .custom-close:hover {
          transform: rotate(90deg);
        }

        /* IMAGE */
        .image-wrapper {
          overflow: hidden;
          border-radius: 16px;
          cursor: zoom-in;
          transition: all 0.4s ease;
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
        }

        .image-wrapper img {
          width: 100%;
          transition: transform 0.4s ease;
        }

        .image-wrapper.zoomed img {
          transform: scale(1.6);
          cursor: zoom-out;
        }

        /* MOBILE */
        @media (max-width: 576px) {
          .advanced-offcanvas {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default SizeChartModal;
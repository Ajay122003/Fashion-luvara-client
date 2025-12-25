import sizechart from "../assets/images/sizechart.jpeg";

const SizeChartModal = () => {
  return (
    <div
      className="offcanvas offcanvas-end"
      tabIndex="-1"
      id="sizeChartModal"
      aria-labelledby="sizeChartLabel"
    >
      {/* HEADER */}
      <div className="offcanvas-header border-bottom">
        <h5
          className="offcanvas-title fw-bold"
          id="sizeChartLabel"
        >
          Size Chart
        </h5>

        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
        ></button>
      </div>

      {/* BODY */}
      <div className="offcanvas-body text-center">
        <img
          src={sizechart}
          alt="Size Chart"
          className="img-fluid rounded"
        />
      </div>
    </div>
  );
};

export default SizeChartModal;


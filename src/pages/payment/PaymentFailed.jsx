import { useNavigate, useLocation } from "react-router-dom";

const PaymentFailed = () => {

  const navigate = useNavigate();
  const { state } = useLocation();

  return (
    <div className="container py-5 text-center">

      <i className="bi bi-x-circle-fill text-danger fs-1"></i>

      <h4 className="fw-bold mt-3">Payment Failed</h4>

      <p className="text-muted">
        Your payment could not be completed
      </p>

      <div className="d-flex justify-content-center gap-3 mt-4">

        <button
          className="btn btn-dark"
          onClick={() => navigate("/payment", { state })}
        >
          Retry Payment
        </button>

        <button
          className="btn btn-outline-dark"
          onClick={() => navigate("/cart")}
        >
          Go to Cart
        </button>

      </div>

    </div>
  );
};

export default PaymentFailed;
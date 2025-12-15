import { useLocation, Link } from "react-router-dom";

const OrderSuccess = () => {
  const { state } = useLocation();

  if (!state) return null;

  return (
    <div className="container py-5 text-center">
      <i className="bi bi-check-circle-fill text-success fs-1"></i>

      <h3 className="mt-3">Order Placed Successfully!</h3>

      <p className="text-muted">
        Order ID: <strong>{state.order_number}</strong>
      </p>

      <h4>₹{state.total_amount}</h4>

      <div className="d-flex justify-content-center gap-3 mt-4">
        <Link to="/orders" className="btn btn-outline-dark">
          My Orders
        </Link>
        <Link to="/" className="btn btn-dark">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;

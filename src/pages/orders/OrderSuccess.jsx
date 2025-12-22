import { useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import apiClient from "../../api/client";
import { clearCart } from "../../features/cart/cartSlice";

const OrderSuccess = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // If user refreshes or comes without order data
    if (!state) {
      navigate("/");
      return;
    }

    // 🔥 CLEAR CART (Frontend + Backend)
    const clearUserCart = async () => {
      try {
        await apiClient.delete("/api/cart/clear/");
      } catch (err) {
        // backend failure shouldn't block UI
        console.error("Failed to clear cart", err);
      } finally {
        // clear redux cart anyway
        dispatch(clearCart());
      }
    };

    clearUserCart();
  }, [state, dispatch, navigate]);

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

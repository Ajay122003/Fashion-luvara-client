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
        console.error("Failed to clear cart", err);
      } finally {
        dispatch(clearCart());
      }
    };

    clearUserCart();
  }, [state, dispatch, navigate]);

  if (!state) return null;

  return (
    <div className="container py-5 text-center">
      <i className="bi bi-check-circle-fill text-success fs-1"></i>

      <h3 className="mt-3 fw-bold">
        Order Placed Successfully!
      </h3>

      <p className="text-muted mb-4">
        Order ID:{" "}
        <strong>{state.order_number}</strong>
      </p>

      {/* PRICE BREAKDOWN */}
      <div
        className="card mx-auto shadow-sm"
        style={{ maxWidth: 420 }}
      >
        <div className="card-body text-start">
          <h5 className="fw-semibold mb-3">
            Order Summary
          </h5>

          <div className="d-flex justify-content-between mb-1">
            <span>Subtotal</span>
            <span>₹{state.subtotal.toFixed(2)}</span>
          </div>

          {state.discount > 0 && (
            <div className="d-flex justify-content-between mb-1 text-success">
              <span>
                Coupon Discount{" "}
                {state.coupon_code && (
                  <small className="text-muted">
                    ({state.coupon_code})
                  </small>
                )}
              </span>
              <span>- ₹{state.discount.toFixed(2)}</span>
            </div>
          )}

          <div className="d-flex justify-content-between mb-1">
            <span>Shipping</span>
            <span>
              {state.shipping > 0
                ? `₹${state.shipping.toFixed(2)}`
                : "Free"}
            </span>
          </div>

          <div className="d-flex justify-content-between mb-1">
            <span>GST</span>
            <span>₹{state.gst_amount.toFixed(2)}</span>
          </div>

          <hr />

          <div className="d-flex justify-content-between fw-bold fs-5">
            <span>Total Paid</span>
            <span>₹{state.total_amount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
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

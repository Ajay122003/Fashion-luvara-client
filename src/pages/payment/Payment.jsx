
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { createOrder } from "../../api/order";
import { createPaymentOrder } from "../../api/payment";

const Payment = () => {

  const { state } = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!window.Cashfree) {
      console.warn("Cashfree SDK not loaded");
    }
  }, []);

  const handleOnlinePayment = async () => {

    if (!window.Cashfree) {
      alert("Payment gateway loading...");
      return;
    }

    setLoading(true);

    try {

      // 1️⃣ Create Order
      const orderRes = await createOrder({
        ...state.checkout_payload,
        payment_method: "ONLINE",
      });

      const orderId = orderRes.data.order_id;

      // 2️⃣ Create Payment Session
      const payRes = await createPaymentOrder(orderId);

      const sessionId =
        payRes.payment_session_id ||
        payRes.data?.payment_session_id;

      if (!sessionId) {
        throw new Error("Payment session not received");
      }

      // 3️⃣ Initialize Cashfree
      const cashfree = window.Cashfree({
        // mode: "sandbox"
        mode: "production"
      });

      // 4️⃣ Open Checkout
      const checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_self"
      };

      cashfree.checkout(checkoutOptions);

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.error ||
        "Payment initialization failed"
      );

    } finally {

      setLoading(false);

    }

  };

  if (!state) {
    return (
      <div className="container py-5 text-center">
        No order data found
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 520 }}>

      <h4 className="fw-bold mb-3">Online Payment</h4>

      <div className="card shadow-sm p-4">

        <div className="d-flex justify-content-between mb-2">
          <span>Subtotal</span>
          <span>₹{state?.subtotal?.toFixed(2)}</span>
        </div>

        <div className="d-flex justify-content-between mb-2">
          <span>Shipping</span>
          <span>
            {state?.shipping > 0
              ? `₹${state.shipping.toFixed(2)}`
              : "Free"}
          </span>
        </div>

        {state?.coupon_discount > 0 && (
          <div className="d-flex justify-content-between text-success mb-2">
            <span>Coupon Discount</span>
            <span>- ₹{state.coupon_discount.toFixed(2)}</span>
          </div>
        )}

        <div className="d-flex justify-content-between mb-2">
          <span>GST</span>
          <span>₹{state?.gst_amount?.toFixed(2)}</span>
        </div>

        <hr />

        <div className="d-flex justify-content-between fw-bold mb-4 fs-5">
          <span>Total Amount</span>
          <span>₹{state?.total_amount?.toFixed(2)}</span>
        </div>

        <button
          className="btn btn-dark w-100 py-2 fw-bold"
          disabled={loading}
          onClick={handleOnlinePayment}
        >

          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Processing...
            </>
          ) : (
            "Pay Now"
          )}

        </button>

      </div>
    </div>
  );
};

export default Payment;


import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { createPaymentOrder } from "../../api/payment"; // ONLY THIS

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

      //  ONLY CALL CASHFREE ORDER API
      const res = await createPaymentOrder(); // ❗ no orderId

      const sessionId =
        res.payment_session_id ||
        res.data?.payment_session_id;

      const orderNumber =
        res.order_number ||
        res.data?.order_number;

      if (!sessionId) {
        throw new Error("Payment session not received");
      }

      //  STORE order_number (IMPORTANT for verify page)
      localStorage.setItem("order_number", orderNumber);

      //  INIT CASHFREE
      const cashfree = window.Cashfree({
        mode: "production"
        // mode:"sandbox"
      });

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
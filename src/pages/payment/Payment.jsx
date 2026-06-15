

import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { createPaymentOrder } from "../../api/payment"; // ONLY THIS
import cashfreeLogo from "../../assets/images/cashfree.png";

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

//   return (
//     <div className="container py-4" style={{ maxWidth: 520 }}>

//       <h4 className="fw-bold mb-3">Online Payment</h4>

//       <div className="card shadow-sm p-4">

//         <div className="d-flex justify-content-between mb-2">
//           <span>Subtotal</span>
//           <span>₹{state?.subtotal?.toFixed(2)}</span>
//         </div>

//         <div className="d-flex justify-content-between mb-2">
//           <span>Shipping</span>
//           <span>
//             {state?.shipping > 0
//               ? `₹${state.shipping.toFixed(2)}`
//               : "Free"}
//           </span>
//         </div>

//         {state?.coupon_discount > 0 && (
//           <div className="d-flex justify-content-between text-success mb-2">
//             <span>Coupon Discount</span>
//             <span>- ₹{state.coupon_discount.toFixed(2)}</span>
//           </div>
//         )}

//         <div className="d-flex justify-content-between mb-2">
//           <span>GST</span>
//           <span>₹{state?.gst_amount?.toFixed(2)}</span>
//         </div>

//         <hr />

//         <div className="d-flex justify-content-between fw-bold mb-4 fs-5">
//           <span>Total Amount</span>
//           <span>₹{state?.total_amount?.toFixed(2)}</span>
//         </div>

//         <button
//           className="btn btn-dark w-100 py-2 fw-bold"
//           disabled={loading}
//           onClick={handleOnlinePayment}
//         >

//           {loading ? (
//             <>
//               <span className="spinner-border spinner-border-sm me-2"></span>
//               Processing...
//             </>
//           ) : (
//             "Pay Now"
//           )}

//         </button>

//       </div>
//     </div>
//   );
// };


return (
  <div className="container py-5">
    <div
      className="mx-auto"
      style={{
        maxWidth: "550px",
      }}
    >
      <div className="card border-0 shadow-lg payment-card">
        
        {/* HEADER */}
        <div className="text-center p-4 border-bottom">
          <img
            src={cashfreeLogo}
            alt="Cashfree"
            style={{
              height: "45px",
              objectFit: "contain",
            }}
          />

          <h4 className="fw-bold mt-3 mb-1">
            Secure Payment
          </h4>

          <p className="text-muted small mb-0">
            Powered by Cashfree Payments
          </p>
        </div>

        {/* BODY */}
        <div className="p-4">

          {/* TOTAL BOX */}
          <div className="amount-box text-center mb-4">
            <small className="text-muted">
              Total Amount
            </small>

            <h2 className="fw-bold mb-0">
              ₹{state?.total_amount?.toFixed(2)}
            </h2>
          </div>

          {/* SUMMARY */}
          <div className="payment-summary">

            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal</span>
              <span>
                ₹{state?.subtotal?.toFixed(2)}
              </span>
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
                <span>
                  - ₹{state.coupon_discount.toFixed(2)}
                </span>
              </div>
            )}

            <div className="d-flex justify-content-between mb-2">
              <span>GST</span>
              <span>
                ₹{state?.gst_amount?.toFixed(2)}
              </span>
            </div>

            <hr />

            <div className="d-flex justify-content-between fw-bold">
              <span>Payable Amount</span>
              <span>
                ₹{state?.total_amount?.toFixed(2)}
              </span>
            </div>
          </div>

          {/* PAYMENT METHODS */}
          <div className="mt-4">
            <p className="fw-semibold mb-2">
              Available Payment Methods
            </p>

            <div className="d-flex gap-2 flex-wrap">
              <span className="badge bg-light text-dark border">
                UPI
              </span>

              <span className="badge bg-light text-dark border">
                Cards
              </span>

              <span className="badge bg-light text-dark border">
                Net Banking
              </span>

              <span className="badge bg-light text-dark border">
                Wallets
              </span>
            </div>
          </div>

          {/* SECURITY */}
          <div className="secure-box mt-4">
            <i className="bi bi-shield-check text-success me-2"></i>
            100% Secure Encrypted Payment
          </div>

          {/* BUTTON */}
          <button
            className="btn btn-dark w-100 py-3 fw-bold mt-4 pay-btn"
            disabled={loading}
            onClick={handleOnlinePayment}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Processing Payment...
              </>
            ) : (
              <>
                <i className="bi bi-lock-fill me-2"></i>
                Pay ₹{state?.total_amount?.toFixed(2)}
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .payment-card {
          border-radius: 24px;
          overflow: hidden;
        }

        .amount-box {
          background: #f8f9fa;
          border-radius: 18px;
          padding: 20px;
        }

        .secure-box {
          background: #f1fff5;
          border: 1px solid #ccefd7;
          padding: 12px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
        }

        .pay-btn {
          border-radius: 14px;
          transition: .3s;
        }

        .pay-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  </div>
);
}

export default Payment;
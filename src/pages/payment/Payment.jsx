import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../../api/payment";

const Payment = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [method, setMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  //  Safety
  if (!state?.order_id) {
    navigate("/cart");
    return null;
  }

  const handleCOD = async () => {
    navigate("/order-success", {
      state: {
        order_id: state.order_id,
        order_number: state.order_number,
      },
    });
  };

  const handleOnlinePayment = async () => {
    setLoading(true);
    try {
      // STEP 1: Create Razorpay order
      const data = await createRazorpayOrder(state.order_id);

      const options = {
        key: data.razorpay_key_id,
        amount: data.amount,
        currency: data.currency,
        name: "Luvara Store",
        description: "Order Payment",
        order_id: data.razorpay_order_id,

        handler: async function (response) {
          try {
            // STEP 2: Verify payment
            await verifyRazorpayPayment({
              order_id: data.order_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            navigate("/order-success", {
              state: {
                order_id: data.order_id,
                order_number: data.order_number,
              },
            });
          } catch {
            alert("Payment verification failed");
          }
        },

        prefill: {
          email: data.user_name,
        },

        theme: {
          color: "#111",
        },

        modal: {
          ondismiss: () => {
            alert("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(
        err.response?.data?.error || "Unable to start payment"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = () => {
    if (method === "COD") handleCOD();
    else handleOnlinePayment();
  };

  return (
    <div className="container py-4" style={{ maxWidth: 520 }}>
      <h4 className="fw-bold mb-3">Payment</h4>

      <div className="card shadow-sm p-3">
        <label className="d-flex gap-2 mb-2">
          <input
            type="radio"
            checked={method === "COD"}
            onChange={() => setMethod("COD")}
          />
          Cash on Delivery
        </label>

        <label className="d-flex gap-2">
          <input
            type="radio"
            checked={method === "ONLINE"}
            onChange={() => setMethod("ONLINE")}
          />
          Online Payment (UPI / Card / Netbanking)
        </label>

        <hr />

        <div className="d-flex justify-content-between fw-bold">
          <span>Total Amount</span>
          <span>₹{state.total_amount}</span>
        </div>

        <button
          className="btn btn-dark w-100 mt-3"
          disabled={loading}
          onClick={handlePayNow}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

        <p className="small text-muted text-center mt-2">
          100% secure payments powered by Razorpay
        </p>
      </div>
    </div>
  );
};

export default Payment;

// src/pages/payment/Payment.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { createRazorpayOrder, verifyRazorpayPayment } from "../../api/payment";
import { createOrder } from "../../api/order";

const Payment = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);

  // 🔒 Safety
  useEffect(() => {
    if (!state?.checkout_payload) {
      navigate("/cart", { replace: true });
    }
  }, [state, navigate]);
const handleOnlinePayment = async () => {
  setLoading(true);

  try {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: state.total_amount * 100, // paise
      currency: "INR",
      name: "Luvara Store",
      description: "Order Payment",

      handler: async function (response) {
        console.log("✅ PAYMENT SUCCESS", response);

        // ✅ NOW create order (FIRST TIME)
        const res = await createOrder({
          ...state.checkout_payload,
          payment_method: "ONLINE",
          razorpay_payment_id: response.razorpay_payment_id,
        });

        navigate("/order-success", {
          state: {
            order_id: res.data.order_id,
            order_number: res.data.order_number,
            total_amount: res.data.total_amount,
          },
        });
      },

      modal: {
        ondismiss: () => {
          alert("Payment cancelled");
        },
      },

      theme: { color: "#111" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    alert("Payment failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="container py-4" style={{ maxWidth: 520 }}>
      <h4 className="fw-bold mb-3">Online Payment</h4>

      <div className="card shadow-sm p-3">
        <div className="d-flex justify-content-between fw-bold mb-3">
          <span>Total Amount</span>
          <span>₹{state?.total_amount}</span>
        </div>

        <button
          className="btn btn-dark w-100"
          disabled={loading}
          onClick={handleOnlinePayment}
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

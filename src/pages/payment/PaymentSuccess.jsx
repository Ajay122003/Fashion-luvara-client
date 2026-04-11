import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyPayment } from "../../api/payment";
import { useDispatch } from "react-redux";
import { fetchCart } from "../../features/cart/cartSlice";

const PaymentSuccess = () => {

  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [status, setStatus] = useState("loading"); 
  // loading | success | failed

  useEffect(() => {

    const verify = async (retry = 0) => {

      try {

        const payload = {
          order_id: params.get("order_id"),
        };

        const res = await verifyPayment(payload);

        if (res.payment_status === "PAID") {

          setStatus("success");

          dispatch(fetchCart());

          // 🔥 show success message for 2 sec then navigate
          setTimeout(() => {
            navigate("/order-success", { replace: true });
          }, 2000);

        } else if (retry < 3) {

          setTimeout(() => verify(retry + 1), 2000);

        } else {

          setStatus("failed");

          setTimeout(() => {
            navigate("/payment-failed");
          }, 2000);

        }

      } catch (err) {

        if (retry < 3) {
          setTimeout(() => verify(retry + 1), 2000);
        } else {
          setStatus("failed");
          setTimeout(() => navigate("/payment-failed"), 2000);
        }

      }

    };

    setTimeout(() => verify(), 2000);

  }, []);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-60 text-center">

      {status === "loading" && (
        <>
          <h3 className="mb-3">Processing your payment...</h3>
          <p>Please wait, do not refresh.</p>
          <div className="spinner-border mt-3" role="status"></div>
        </>
      )}

      {status === "success" && (
        <>
          <h3 className="text-success mb-3">Payment Verified Successfully </h3>
        
        </>
      )}

      {status === "failed" && (
        <>
          <h3 className="text-danger mb-3">Payment Failed </h3>
        
        </>
      )}

    </div>
  );
};

export default PaymentSuccess;
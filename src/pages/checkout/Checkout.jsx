// src/pages/checkout/Checkout.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAddresses } from "../../api/address";
import { createOrder } from "../../api/order";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const cartItems = useSelector((s) => s.cart.items);

  const [addresses, setAddresses] = useState([]);
  const [addressId, setAddressId] = useState(null);
  const [payment, setPayment] = useState("COD");
  const [placing, setPlacing] = useState(false);

  /* ================= LOAD ADDRESSES ================= */
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    } else {
      loadAddresses();
    }
  }, []);

  const loadAddresses = async () => {
    const res = await getAddresses();
    setAddresses(res.data);

    const defaultAddr =
      res.data.find((a) => a.is_default) || res.data[0];
    if (defaultAddr) setAddressId(defaultAddr.id);
  };

  /* ================= TOTAL ================= */
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.total_price,
    0
  );

  /* ================= PLACE ORDER ================= */
  const placeOrder = async () => {
    if (!addressId) return alert("Please select an address");

    setPlacing(true);
    try {
      const res = await createOrder({
        address_id: addressId,
        payment_method: payment,
      });

      navigate("/order-success", {
        state: res.data,
      });
    } catch (err) {
      alert(err.response?.data?.error || "Order failed");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4 fw-bold">Checkout</h3>

      <div className="row g-4">
        {/* LEFT */}
        <div className="col-12 col-md-7">
          {/* ADDRESS */}
          <div className="card p-3 shadow-sm mb-3">
            <h5 className="mb-3">Delivery Address</h5>

            {addresses.length === 0 && (
              <p className="text-muted">No address found</p>
            )}

            {addresses.map((a) => (
              <label
                key={a.id}
                className={`border rounded p-3 d-block mb-2 ${
                  addressId === a.id ? "border-dark" : ""
                }`}
                style={{ cursor: "pointer" }}
              >
                <input
                  type="radio"
                  className="form-check-input me-2"
                  checked={addressId === a.id}
                  onChange={() => setAddressId(a.id)}
                />
                <strong>{a.name}</strong> – {a.phone}
                <p className="mb-0 small text-muted">
                  {a.full_address}, {a.city} – {a.pincode}
                </p>
              </label>
            ))}
          </div>

          {/* PAYMENT */}
          <div className="card p-3 shadow-sm">
            <h5 className="mb-2">Payment Method</h5>

            <label className="d-block">
              <input
                type="radio"
                className="me-2"
                checked={payment === "COD"}
                onChange={() => setPayment("COD")}
              />
              Cash on Delivery
            </label>

            <label className="d-block mt-2 text-muted">
              <input type="radio" disabled className="me-2" />
              Online Payment (Coming soon)
            </label>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-12 col-md-5">
          <div className="card p-3 shadow-sm">
            <h5 className="fw-bold">Order Summary</h5>
            <hr />

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="d-flex justify-content-between small mb-2"
              >
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span>₹{item.total_price}</span>
              </div>
            ))}

            <hr />

            <div className="d-flex justify-content-between fw-bold fs-5">
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>

            <button
              className="btn btn-dark w-100 mt-3"
              disabled={placing}
              onClick={placeOrder}
            >
              {placing ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

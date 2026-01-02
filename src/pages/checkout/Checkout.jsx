// src/pages/checkout/Checkout.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAddresses } from "../../api/address";
import { createOrder } from "../../api/order";
import { fetchPublicSettings } from "../../api/admin";
import apiClient from "../../api/client";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const cartItems = useSelector((s) => s.cart.items);

  /* ================= ADDRESS ================= */
  const [addresses, setAddresses] = useState([]);
  const [addressId, setAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);

  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
    full_address: "",
    save_for_future: false,
  });

  /* ================= BILLING ================= */
  const [sameAsDelivery, setSameAsDelivery] = useState(true);
  const [billingAddress, setBillingAddress] = useState({
    name: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
    full_address: "",
  });

  /* ================= COUPON ================= */
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  /* ================= OTHER ================= */
  const [payment, setPayment] = useState("COD");
  const [placing, setPlacing] = useState(false);
  const [settings, setSettings] = useState(null);

  /* ================= LOAD ================= */
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate("/cart");
    } else {
      loadAddresses();
      loadSettings();
    }
    // eslint-disable-next-line
  }, []);

  const loadAddresses = async () => {
    const res = await getAddresses();
    setAddresses(data); // ✅ FIX

    const defaultAddr =
      res.data.find((a) => a.is_default) || res.data[0];
    if (defaultAddr) setAddressId(defaultAddr.id);
  };

  const loadSettings = async () => {
    const data = await fetchPublicSettings();
    setSettings(data);
  };

  /* ================= PRICE ================= */
  const getEffectivePrice = (item) => {
    // backend already sends final price
    if (item.unit_price) {
      return Number(item.unit_price);
    }

    const product = item.variant.product;
    return product.sale_price || product.price;
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const price = getEffectivePrice(item);
    return sum + price * item.quantity;
  }, 0);

  const freeMin = Number(settings?.free_shipping_min_amount || 0);
  const shipCharge = Number(settings?.shipping_charge || 0);

  let shipping = 0;
  if (shipCharge > 0) {
    if (freeMin > 0 && subtotal >= freeMin) shipping = 0;
    else shipping = shipCharge;
  }

  const GST_PERCENTAGE = 3;
  const gstAmount =
    ((subtotal + shipping - couponDiscount) * GST_PERCENTAGE) /
    100;

  const grandTotal =
    subtotal + shipping + gstAmount - couponDiscount;

  /* ================= APPLY COUPON ================= */
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setApplyingCoupon(true);
    setCouponError("");

    try {
      const res = await apiClient.post("/api/coupons/apply/", {
        code: couponCode,
        amount: subtotal + shipping,
      });

      setCouponDiscount(res.data.discount);
    } catch (err) {
      setCouponDiscount(0);
      setCouponError(
        err.response?.data?.non_field_errors?.[0] ||
          err.response?.data ||
          "Invalid coupon"
      );
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    setCouponError("");
  };

  /* ================= PLACE ORDER ================= */
  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      let payload = {
        payment_method: payment,
        billing_address: sameAsDelivery ? null : billingAddress,
        coupon_code: couponCode || null,
      };

      if (useNewAddress) {
        payload.delivery_address = newAddress;
      } else {
        payload.address_id = addressId;
      }

      const res = await createOrder(payload);
      navigate("/order-success", { state: res.data });
    } catch (err) {
      alert(err.response?.data?.error || "Order failed");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4">Checkout</h3>

      <div className="row g-4">
        {/* LEFT */}
        <div className="col-md-7">
          {/* DELIVERY ADDRESS */}
          <div className="card p-3 shadow-sm mb-3">
            <h5>Delivery Address</h5>

            <label className="d-block">
              <input
                type="radio"
                checked={!useNewAddress}
                onChange={() => setUseNewAddress(false)}
                className="me-2"
              />
              Use saved address
            </label>

            {!useNewAddress &&
              addresses.map((a) => (
                <label
                  key={a.id}
                  className={`border rounded p-3 d-block mb-2 ${
                    addressId === a.id ? "border-dark" : ""
                  }`}
                >
                  <input
                    type="radio"
                    checked={addressId === a.id}
                    onChange={() => setAddressId(a.id)}
                    className="me-2"
                  />
                  <strong>{a.name}</strong> – {a.phone}
                  <p className="small mb-0">
                    {a.full_address}, {a.city} – {a.pincode}
                  </p>
                </label>
              ))}

            <label className="d-block mt-3">
              <input
                type="radio"
                checked={useNewAddress}
                onChange={() => setUseNewAddress(true)}
                className="me-2"
              />
              Use new delivery address
            </label>

            {useNewAddress && (
              <div className="mt-3">
                {["name", "phone", "pincode", "city", "state"].map(
                  (f) => (
                    <input
                      key={f}
                      className="form-control mb-2"
                      placeholder={f.toUpperCase()}
                      value={newAddress[f]}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          [f]: e.target.value,
                        })
                      }
                    />
                  )
                )}
                <textarea
                  className="form-control mb-2"
                  placeholder="Full address"
                  value={newAddress.full_address}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      full_address: e.target.value,
                    })
                  }
                />
              </div>
            )}
          </div>

          {/* PAYMENT */}
          <div className="card p-3 shadow-sm">
            <h5>Payment</h5>
            {settings?.enable_cod && (
              <label>
                <input
                  type="radio"
                  checked={payment === "COD"}
                  onChange={() => setPayment("COD")}
                  className="me-2"
                />
                Cash on Delivery
              </label>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-md-5">
          <div className="card p-3 shadow-sm">
            <h5>Order Summary</h5>
            <hr />

            {cartItems.map((item) => {
              const product = item.variant.product;
              const price = getEffectivePrice(item); // ✅ FIX

              return (
                <div
                  key={item.id}
                  className="d-flex justify-content-between mb-2"
                >
                  <span>
                    {product.name} ({item.variant.size}) ×{" "}
                    {item.quantity}
                  </span>
                  <span>
                    ₹{(price * item.quantity).toFixed(2)}
                  </span>
                </div>
              );
            })}

            <hr />

            {/* COUPON UI */}
            <div className="mb-3">
              <input
                className="form-control mb-2"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) =>
                  setCouponCode(e.target.value.toUpperCase())
                }
                disabled={couponDiscount > 0}
              />

              {couponDiscount === 0 ? (
                <button
                  className="btn btn-outline-dark w-100"
                  onClick={handleApplyCoupon}
                  disabled={applyingCoupon}
                >
                  {applyingCoupon
                    ? "Applying..."
                    : "Apply Coupon"}
                </button>
              ) : (
                <button
                  className="btn btn-outline-danger w-100"
                  onClick={handleRemoveCoupon}
                >
                  Remove Coupon
                </button>
              )}

              {couponError && (
                <small className="text-danger">
                  {couponError}
                </small>
              )}
            </div>

            <div className="d-flex justify-content-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between">
              <span>Shipping</span>
              <span>{shipping ? `₹${shipping}` : "Free"}</span>
            </div>

            {couponDiscount > 0 && (
              <div className="d-flex justify-content-between text-success">
                <span>Coupon Discount</span>
                <span>- ₹{couponDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="d-flex justify-content-between">
              <span>GST (3%)</span>
              <span>₹{gstAmount.toFixed(2)}</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between fw-bold">
              <span>Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>

            <button
              className="btn btn-dark w-100 mt-3"
              disabled={placing}
              onClick={handlePlaceOrder}
            >
              {placing ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

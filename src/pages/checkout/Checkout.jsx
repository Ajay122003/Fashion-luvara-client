// src/pages/checkout/Checkout.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAddresses } from "../../api/address";
import { createOrder } from "../../api/order";
import { fetchPublicSettings } from "../../api/admin";
import apiClient from "../../api/client";
import { useNavigate } from "react-router-dom";
import "../../styles/checkout.css";
const Checkout = () => {
  const navigate = useNavigate();
  const cartItems = useSelector((s) => s.cart.items);

  /* ================= ADDRESS ================= */
  const [addresses, setAddresses] = useState([]);
  const [addressId, setAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);

  const [newAddress, setNewAddress] = useState({
  first_name: "",
  last_name: "",
  phone: "",
  address: "",
  apartment: "",
  city: "",
  state: "",
  pincode: "",
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
  const [payment, setPayment] = useState("ONLINE");
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
  const data = await getAddresses(); // 👈 data = res.data

  setAddresses(data); // ✅ correct

  const defaultAddr =
    data.find((a) => a.is_default) || data[0];

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
    };

    if (couponCode.trim()) {
      payload.coupon_code = couponCode.trim();
    }

    if (useNewAddress) {
      payload.delivery_address = {
        name: `${newAddress.first_name} ${newAddress.last_name}`,
        phone: newAddress.phone,
        pincode: newAddress.pincode,
        city: newAddress.city,
        state: newAddress.state,
        full_address: `${newAddress.address}, ${newAddress.apartment}`,
      };
    } else {
      payload.address_id = addressId;
    }

    // 🔥 IMPORTANT LOGIC
    if (payment === "ONLINE") {
      // ❌ DO NOT CREATE ORDER HERE
      navigate("/payment", {
        state: {
          checkout_payload: payload,
          total_amount: grandTotal,
        },
      });

//       navigate("/payment", {
//   state: {
//     order_id: res.data.order_id,
//     total_amount: res.data.total_amount
//   }
// });

    } else {
      // ✅ COD → create order immediately
      const res = await createOrder(payload);

      navigate("/order-success", {
        state: {
          order_id: res.data.order_id,
          order_number: res.data.order_number,
          subtotal: res.data.subtotal,
          discount: res.data.discount,
          shipping: res.data.shipping,
          gst_amount: res.data.gst_amount,
          total_amount: res.data.total_amount,
          coupon_code: res.data.coupon_code,
        },
      });
    }

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

  <label className="d-block mt-3">
    <input
      type="radio"
      checked={useNewAddress}
      onChange={() => setUseNewAddress(true)}
      className="me-2"
    />
    Enter Delivery Address(click)
  </label>

  {useNewAddress && (
    <div className="mt-3">

      {/* COUNTRY */}
      <select className="form-select mb-2" disabled>
        <option>India</option>
      </select>

      {/* FIRST + LAST NAME */}
      <div className="row g-2">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="First name"
            value={newAddress.first_name}
            onChange={(e) =>
              setNewAddress({ ...newAddress, first_name: e.target.value })
            }
          />
        </div>
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Last name"
            value={newAddress.last_name}
            onChange={(e) =>
              setNewAddress({ ...newAddress, last_name: e.target.value })
            }
          />
        </div>
      </div>

      {/* ADDRESS */}
      <input
        className="form-control mt-2"
        placeholder="Address"
        value={newAddress.address}
        onChange={(e) =>
          setNewAddress({ ...newAddress, address: e.target.value })
        }
      />

      {/* APARTMENT */}
      <input
        className="form-control mt-2"
        placeholder="Apartment, suite, etc. (optional)"
        value={newAddress.apartment}
        onChange={(e) =>
          setNewAddress({ ...newAddress, apartment: e.target.value })
        }
      />

      {/* CITY / STATE / PIN */}
      <div className="row g-2 mt-1">
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="City"
            value={newAddress.city}
            onChange={(e) =>
              setNewAddress({ ...newAddress, city: e.target.value })
            }
          />
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={newAddress.state}
            onChange={(e) =>
              setNewAddress({ ...newAddress, state: e.target.value })
            }
          >
            <option value="">State</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Kerala">Kerala</option>
            <option value="Karnataka">Karnataka</option>
          </select>
        </div>

        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="PIN code"
            value={newAddress.pincode}
            onChange={(e) =>
              setNewAddress({ ...newAddress, pincode: e.target.value })
            }
          />
        </div>
      </div>

      {/* PHONE */}
      <input
        className="form-control mt-2"
        placeholder="Phone"
        value={newAddress.phone}
        onChange={(e) =>
          setNewAddress({ ...newAddress, phone: e.target.value })
        }
      />
    </div>
  )}
</div>


          {/* PAYMENT */}
         <div className="card p-3 shadow-sm">
  <h5>Payment Method</h5>

  {/* COD */}
  {settings?.enable_cod && (
    <label className="d-flex gap-2 mb-2">
      <input
        type="radio"
        checked={payment === "COD"}
        onChange={() => setPayment("COD")}
      />
      Cash on Delivery
    </label>
  )}

  {/* ONLINE */}
  <label className="d-flex gap-2">
    <input
      type="radio"
      checked={payment === "ONLINE"}
      onChange={() => setPayment("ONLINE")}
    />
    Online Payment (UPI / Card / Netbanking)
  </label>
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
                  className="checkout-btn w-100"
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
              className="checkout-btn w-100 mt-3"
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

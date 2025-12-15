// src/pages/cart/Cart.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCart } from "../../features/cart/cartSlice";
import { updateCartItem, removeCartItem } from "../../api/cart";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ FIX

  const { items, status } = useSelector((s) => s.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const updateQty = async (id, qty) => {
    if (qty < 1) return;
    try {
      await updateCartItem(id, qty);
      dispatch(fetchCart());
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update cart");
    }
  };

  const removeItem = async (id) => {
    try {
      await removeCartItem(id);
      dispatch(fetchCart());
    } catch {
      alert("Could not remove item");
    }
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + item.total_price,
    0
  );

  if (status === "loading") {
    return <p className="text-center py-5">Loading cart...</p>;
  }

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4">Shopping Cart</h3>

      {items.length === 0 && (
        <p className="text-center py-5 fs-5">Your cart is empty.</p>
      )}

      <div className="row g-4">
        {/* CART ITEMS */}
        <div className="col-12 col-lg-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="d-flex flex-column flex-md-row p-3 border rounded shadow-sm mb-3"
            >
              <div className="text-center">
                <img
                  src={item.product.images?.[0]?.image_url}
                  alt=""
                  className="rounded"
                  style={{
                    width: "140px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              </div>

              <div className="ms-md-3 mt-3 mt-md-0 flex-grow-1">
                <h6 className="fw-bold">{item.product.name}</h6>

                <p className="mb-1 fw-semibold">
                  ₹{item.product.sale_price || item.product.price}
                </p>

                {item.size && (
                  <p className="small mb-1">
                    <strong>Size:</strong> {item.size}
                  </p>
                )}

                <div className="d-flex align-items-center gap-2 mt-2">
                  <button
                    className="btn btn-outline-dark btn-sm"
                    disabled={item.quantity === 1}
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                  >
                    -
                  </button>

                  <span className="px-2 fw-bold">{item.quantity}</span>

                  <button
                    className="btn btn-outline-dark btn-sm"
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  className="btn btn-link text-danger mt-2 p-0"
                  onClick={() => removeItem(item.id)}
                >
                  <i className="bi bi-trash3"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ORDER SUMMARY */}
        <div className="col-12 col-lg-4">
          <div className="border rounded p-3 shadow-sm">
            <h5 className="fw-bold">Order Summary</h5>
            <hr />

            {items.map((item) => (
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
              <span>Total:</span>
              <span>₹{totalAmount}</span>
            </div>

            <button
              className="btn btn-dark w-100 mt-3"
              onClick={() => navigate("/checkout")}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

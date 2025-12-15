// src/pages/cart/Cart.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCart } from "../../features/cart/cartSlice";
import { updateCartItem, removeCartItem } from "../../api/cart";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    return <p className="text-center py-5">Loading cart…</p>;
  }

  if (items.length === 0) {
    return <p className="text-center py-5 fs-5">Your cart is empty.</p>;
  }

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4">Shopping Cart</h3>

      <div className="row g-4">
        {/* ================= CART ITEMS ================= */}
        <div className="col-12 col-lg-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="cart-item card border-0 shadow-sm mb-3"
            >
              <div className="card-body d-flex gap-3">

                {/* IMAGE */}
                <img
                  src={item.product.images?.[0]?.image_url}
                  alt={item.product.name}
                  className="cart-img"
                />

                {/* DETAILS */}
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-1">
                    {item.product.name}
                  </h6>

                  <p className="fw-semibold mb-1">
                    ₹{item.product.sale_price || item.product.price}
                  </p>

                  {item.size && (
                    <p className="small text-muted mb-2">
                      Size: <strong>{item.size}</strong>
                    </p>
                  )}

                  {/* QTY */}
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-outline-dark btn-sm"
                      disabled={item.quantity === 1}
                      onClick={() =>
                        updateQty(item.id, item.quantity - 1)
                      }
                    >
                      −
                    </button>

                    <span className="fw-bold px-2">
                      {item.quantity}
                    </span>

                    <button
                      className="btn btn-outline-dark btn-sm"
                      onClick={() =>
                        updateQty(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* REMOVE */}
                <button
                  className="btn btn-link text-danger align-self-start p-0"
                  onClick={() => removeItem(item.id)}
                >
                  <i className="bi bi-trash3 fs-5"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ================= ORDER SUMMARY ================= */}
        <div className="col-12 col-lg-4">
          <div className="order-summary card border-0 shadow-sm p-3">
            <h5 className="fw-bold mb-3">Order Summary</h5>

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
              <span>Total</span>
              <span>₹{totalAmount}</span>
            </div>

            <button
              className="btn btn-dark w-100 mt-3"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {/* ================= STYLES ================= */}
      <style>{`
        .cart-img {
          width: 120px;
          height: 140px;
          object-fit: cover;
          border-radius: 8px;
        }

        @media (max-width: 576px) {
          .cart-img {
            width: 90px;
            height: 110px;
          }
        }

        .order-summary {
          position: sticky;
          top: 80px;
        }
      `}</style>
    </div>
  );
};

export default Cart;


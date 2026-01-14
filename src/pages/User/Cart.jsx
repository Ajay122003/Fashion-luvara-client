import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCart } from "../../features/cart/cartSlice";
import { updateCartItem, removeCartItem } from "../../api/cart";
import "../../styles/cart.css";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items = [], summary = {}, status } = useSelector(
    (s) => s.cart
  );

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const updateQty = async (id, qty, maxStock) => {
    if (qty < 1 || qty > maxStock) return;

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

  /* ================= LOADING ================= */
  if (status === "loading") {
    return <p className="text-center py-5">Loading cart…</p>;
  }

  /* ================= EMPTY CART ================= */
  if (!items || items.length === 0) {
  return (
    
      <div
        className="mx-auto text-center p-4 p-md-5 rounded-4 "
        
      >
        {/* ICON */}
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
          style={{
            width: 72,
            height: 72,
            background: "#f1f3f5",
          }}
        >
          <i className="bi bi-cart-x fs-2 text-dark"></i>
        </div>

        {/* TEXT */}
        <h4 className="fw-bold mb-1">Your cart is empty</h4>
        <p className="text-muted mb-4">
          Looks like you haven’t added anything yet.
        </p>

        {/* CTA */}
        <button
          className="btn btn-dark rounded-pill px-4 py-2"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>
      </div>
  
  );
}


  return (
    <div className="container py-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button
          className="continue-shopping "
          onClick={() => navigate("/")}
        >
          ← Continue Shopping
        </button>
        <h3 className="fw-bold mb-0">Shopping Cart</h3>
      </div>

      <div className="row g-4">
        {/* CART ITEMS */}
        <div className="col-12 col-lg-8">
          {items.map((item) => {
            const { variant } = item;
            const product = variant.product;

            const original = Number(item.original_price);
            const final = Number(item.unit_price);

            // 🔥 PERCENT DISCOUNT (OFFER OR SALE)
            const discountPercent =
              original > final
                ? Math.round(
                    ((original - final) / original) * 100
                  )
                : 0;

            return (
              <div
                key={item.id}
                className="card border-0 shadow-sm mb-3"
              >
                <div className="card-body d-flex gap-3">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="cart-img"
                  />

                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-1">
                      {product.name}

                      {/* 🔥 OFFER NAME */}
                      {item.offer_title && (
                        <span className="badge bg-warning text-dark ms-2">
                          {item.offer_title}
                        </span>
                      )}
                    </h6>

                    <p className="small mb-1">
                      Size: <strong>{variant.size}</strong>
                    </p>

                    {/* PRICE */}
                    <p className="fw-bold mb-1">
                      ₹{item.unit_price}

                      {discountPercent > 0 && (
                        <span className="badge bg-success ms-2">
                          {discountPercent}% OFF
                        </span>
                      )}
                    </p>

                    {/* ORIGINAL PRICE */}
                    {discountPercent > 0 && (
                      <p className="small text-muted text-decoration-line-through mb-1">
                        ₹{item.original_price}
                      </p>
                    )}

                    {/* STOCK */}
                    <p className="small mb-2">
                      {variant.stock > 0 ? (
                        <span className="text-success">
                          In stock ({variant.stock})
                        </span>
                      ) : (
                        <span className="text-danger">
                          Out of stock
                        </span>
                      )}
                    </p>

                    {/* QTY */}
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-outline-dark btn-sm"
                        disabled={item.quantity === 1}
                        onClick={() =>
                          updateQty(
                            item.id,
                            item.quantity - 1,
                            variant.stock
                          )
                        }
                      >
                        −
                      </button>

                      <span className="fw-bold px-2">
                        {item.quantity}
                      </span>

                      <button
                        className="btn btn-outline-dark btn-sm"
                        disabled={
                          item.quantity >= variant.stock
                        }
                        onClick={() =>
                          updateQty(
                            item.id,
                            item.quantity + 1,
                            variant.stock
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* TOTAL */}
                  <div className="text-end">
                    <p className="fw-bold mb-2">
                      ₹{item.total_price}
                    </p>

                    <button
                      className="btn btn-link text-danger p-0"
                      onClick={() => removeItem(item.id)}
                    >
                      <i className="bi bi-trash3 fs-5"></i>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ORDER SUMMARY */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm p-3 order-summary">
            <h5 className="fw-bold mb-3">Order Summary</h5>

            <div className="d-flex justify-content-between">
              <span>Items</span>
              <span>{summary.total_quantity}</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between fw-bold fs-5">
              <span>Subtotal</span>
              <span>₹{summary.subtotal}</span>
            </div>

            <button
              className="cart-btn w-100 mt-3"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      <style>{`
      .cart-img {
          width: 120px;
          height: 140px;
          object-fit: cover;
          border-radius: 8px;
        }
        .order-summary {
          position: sticky;
          top: 90px;
        }
        .continue-shopping {
          background: none;
          border: none;
          font-weight: 600;
        }
       
      `}</style>
    </div>
  );
};

export default Cart;

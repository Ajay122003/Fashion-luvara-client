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

  const totalAmount = items.reduce(
    (sum, item) =>
      sum +
      (item.variant.product.sale_price ||
        item.variant.product.price) *
        item.quantity,
    0
  );

  /* ================= LOADING ================= */
  if (status === "loading") {
    return <p className="text-center py-5">Loading cart…</p>;
  }

  /* ================= EMPTY CART ================= */
  if (items.length === 0) {
    return (
      <div className="container py-5 text-center empty-cart-wrap">
        <i className="bi bi-cart-x cart-animate mb-3"></i>

        <h4 className="fw-bold mt-3">Your cart is empty</h4>
        <p className="text-muted mb-4">
          Looks like you haven’t added anything yet
        </p>

        <button
          className="continue-shopping-btn"
          onClick={() => navigate("/")}
        >
          <i className="bi bi-arrow-left"></i>
          <span>Continue Shopping</span>
        </button>

        <style>{`
          .cart-animate {
            font-size: 64px;
            color: #6c757d;
            animation: cartBounce 1.4s infinite;
          }
          @keyframes cartBounce {
            0% { transform: translateY(0); }
            30% { transform: translateY(-8px); }
            50% { transform: translateY(0); }
          }
          .continue-shopping-btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 10px 20px;
            border-radius: 30px;
            border: 1px solid #111;
            background: #fff;
            font-weight: 600;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="continue-shopping" onClick={() => navigate("/")}>
          <i className="bi bi-arrow-left"></i>
          <span>Continue Shopping</span>
        </button>
        <h3 className="fw-bold mb-0">Shopping Cart</h3>
      </div>

      <div className="row g-4">
        {/* CART ITEMS */}
        <div className="col-12 col-lg-8">
          {items.map((item) => {
            const { variant } = item;
            const product = variant.product;

            return (
              <div key={item.id} className="card border-0 shadow-sm mb-3">
                <div className="card-body d-flex gap-3">
                  <img
                    src={product.images?.[0]?.image_url}
                    alt={product.name}
                    className="cart-img"
                  />

                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-1">{product.name}</h6>

                    <p className="small mb-1">
                      Size: <strong>{variant.size}</strong>
                    </p>

                    <p className="fw-semibold mb-1">
                      ₹{product.sale_price || product.price}
                    </p>

                    <p className="small mb-2">
                      {variant.stock > 0 ? (
                        <span className="text-success">
                          In stock ({variant.stock})
                        </span>
                      ) : (
                        <span className="text-danger">Out of stock</span>
                      )}
                    </p>

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
                        disabled={item.quantity >= variant.stock}
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

                  <button
                    className="btn btn-link text-danger p-0"
                    onClick={() => removeItem(item.id)}
                  >
                    <i className="bi bi-trash3 fs-5"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ORDER SUMMARY */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm p-3 order-summary">
            <h5 className="fw-bold mb-3">Order Summary</h5>

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

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCart } from "../../features/cart/cartSlice";
import { updateCartItem, removeCartItem } from "../../api/cart";

const CartOffcanvas = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items = [], summary = {} } = useSelector(
    (s) => s.cart
  );

  /* ================= UPDATE QTY ================= */
  const updateQty = async (cartItemId, qty, maxStock) => {
    if (qty < 1 || qty > maxStock) return;

    try {
      await updateCartItem(cartItemId, qty);
      dispatch(fetchCart());
    } catch (err) {
      console.error("Update quantity failed", err);
    }
  };

  /* ================= REMOVE ITEM ================= */
  const removeItem = async (cartItemId) => {
    try {
      await removeCartItem(cartItemId);
      dispatch(fetchCart());
    } catch (err) {
      console.error("Remove item failed", err);
    }
  };

  return (
    <div
      className="offcanvas offcanvas-end"
      tabIndex="-1"
      id="cartOffcanvas"
    >
      {/* ================= HEADER ================= */}
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-bold mb-0">My Cart</h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
        />
      </div>

      {/* ================= BODY ================= */}
      <div className="offcanvas-body d-flex flex-column">
        {items.length === 0 ? (
          <p className="text-muted text-center mt-5">
            Your cart is empty
          </p>
        ) : (
          <>
            {/* ================= ITEMS ================= */}
            <div className="flex-grow-1 overflow-auto">
              {items.map((item) => {
                const product = item.variant.product;

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
                    className="d-flex mb-3 border-bottom pb-2"
                  >
                    {/* IMAGE */}
                    <img
                      src={
                        product.image_url || "/placeholder.png"
                      }
                      alt={product.name}
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 6,
                      }}
                    />

                    {/* INFO */}
                    <div className="ms-3 flex-grow-1">
                      <p className="fw-semibold mb-1">
                        {product.name}

                        {/* 🔥 OFFER NAME */}
                        {item.offer_title && (
                          <span className="badge bg-warning text-dark ms-2">
                            {item.offer_title}
                          </span>
                        )}
                      </p>

                      <p className="small text-muted mb-1">
                        Size: {item.variant.size}
                      </p>

                      {/* PRICE */}
                      <p className="fw-bold small mb-1">
                        ₹{item.unit_price}

                        {/* 🔥 % DISCOUNT */}
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

                      {/* QTY CONTROLS */}
                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="btn btn-sm btn-outline-dark"
                          disabled={item.quantity === 1}
                          onClick={() =>
                            updateQty(
                              item.id,
                              item.quantity - 1,
                              item.variant.stock
                            )
                          }
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          className="btn btn-sm btn-outline-dark"
                          disabled={
                            item.quantity >=
                            item.variant.stock
                          }
                          onClick={() =>
                            updateQty(
                              item.id,
                              item.quantity + 1,
                              item.variant.stock
                            )
                          }
                        >
                          +
                        </button>

                        <button
                          className="btn btn-sm text-danger ms-auto"
                          onClick={() => removeItem(item.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ================= FOOTER ================= */}
            <div className="border-top pt-3">
              <div className="d-flex justify-content-between fw-bold mb-3">
                <span>Subtotal</span>
                <span>₹{summary.subtotal || 0}</span>
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-dark w-50"
                  onClick={() => {
                    window.bootstrap.Offcanvas.getInstance(
                      document.getElementById("cartOffcanvas")
                    )?.hide();
                    navigate("/cart");
                  }}
                >
                  View Cart
                </button>

                <button
                  className="btn btn-dark w-50"
                  onClick={() => {
                    window.bootstrap.Offcanvas.getInstance(
                      document.getElementById("cartOffcanvas")
                    )?.hide();
                    navigate("/checkout");
                  }}
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartOffcanvas;

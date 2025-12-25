import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchCart } from "../../features/cart/cartSlice";
import {
  updateCartItem,
  removeCartItem,
} from "../../api/cart";

const CartOffcanvas = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((s) => s.cart.items);

  /* ================= UPDATE QTY ================= */
  const updateQty = async (cartItemId, qty) => {
    if (qty < 1) return;

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

  /* ================= SUBTOTAL ================= */
  const subtotal = items.reduce((sum, item) => {
    const price =
      item.variant.product.sale_price ||
      item.variant.product.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div
      className="offcanvas offcanvas-end"
      tabIndex="-1"
      id="cartOffcanvas"
    >
      {/* HEADER */}
      <div className="offcanvas-header border-bottom">
        <h5 className="fw-bold mb-0">My Cart</h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
        ></button>
      </div>

      {/* BODY */}
      <div className="offcanvas-body d-flex flex-column">
        {items.length === 0 ? (
          <p className="text-muted text-center mt-5">
            Your cart is empty
          </p>
        ) : (
          <>
            {/* ITEMS */}
            <div className="flex-grow-1 overflow-auto">
              {items.map((item) => {
                const product = item.variant.product;
                const price =
                  product.sale_price || product.price;

                return (
                  <div
                    key={item.id}
                    className="d-flex mb-3 border-bottom pb-2"
                  >
                    {/* IMAGE */}
                    <img
                      src={
                        product.images?.[0]?.image_url ||
                        "/placeholder.png"
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
                      </p>

                      <p className="small text-muted mb-1">
                        Size: {item.variant.size}
                      </p>

                      <div className="d-flex align-items-center gap-2">
                        {/* QTY - */}
                        <button
                          className="btn btn-sm btn-outline-dark"
                          onClick={() =>
                            updateQty(
                              item.id,
                              item.quantity - 1
                            )
                          }
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        {/* QTY + */}
                        <button
                          className="btn btn-sm btn-outline-dark"
                          onClick={() =>
                            updateQty(
                              item.id,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </button>

                        {/* REMOVE */}
                        <button
                          className="btn btn-sm text-danger ms-auto"
                          onClick={() =>
                            removeItem(item.id)
                          }
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>

                      <p className="fw-bold small mt-1 mb-0">
                        ₹{price * item.quantity}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FOOTER */}
            <div className="border-top pt-3">
              <div className="d-flex justify-content-between fw-bold mb-3">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="d-flex gap-2">
                <button
  className="btn btn-outline-dark w-50"
  onClick={() => {
    const el = document.getElementById("cartOffcanvas");
    window.bootstrap.Offcanvas.getInstance(el)?.hide();
    navigate("/cart");
  }}
>
  View Cart
</button>

                <button
                  className="btn btn-dark w-50"
                  onClick={() => {
                    const el =
                      document.getElementById(
                        "cartOffcanvas"
                      );
                    window.bootstrap.Offcanvas.getInstance(
                      el
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

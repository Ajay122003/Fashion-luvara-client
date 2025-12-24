import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist } from "../../features/wishlist/wishlistSlice";
import { toggleWishlist } from "../../api/wishlist";
import { Link } from "react-router-dom";

import storage from "../../utils/storage";
import {
  getGuestWishlist,
  toggleGuestWishlist,
} from "../../utils/guestWishlist";

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((s) => s.wishlist);

  const [guestItems, setGuestItems] = useState([]);

  const token = storage.getUserToken();

  /* ================= LOAD WISHLIST ================= */
  useEffect(() => {
    // 🔐 Logged in user
    if (token) {
      dispatch(fetchWishlist());
    } else {
      // 👤 Guest user
      const ids = getGuestWishlist();
      setGuestItems(ids);
    }
  }, [dispatch, token]);

  /* ================= REMOVE ITEM ================= */
  const removeFromWishlist = async (productId) => {
    // 👤 Guest
    if (!token) {
      toggleGuestWishlist(productId);
      setGuestItems(getGuestWishlist());
      return;
    }

    // 🔐 Login
    await toggleWishlist(productId);
    dispatch(fetchWishlist());
  };

  /* ================= LOADING ================= */
  if (token && status === "loading") {
    return (
      <p className="text-center py-5 fs-5">
        Loading wishlist…
      </p>
    );
  }

  /* ================= EMPTY WISHLIST ================= */
  const isEmpty = token ? items.length === 0 : guestItems.length === 0;

  if (isEmpty) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-heart-fill wishlist-heart mb-3"></i>

        <h4 className="fw-bold mb-2">
          Your wishlist is empty
        </h4>

        <p className="text-muted mb-4">
          Save items you like so you can find them easily later.
        </p>

        <Link to="/" className="continue-shopping-btn">
          <i className="bi bi-arrow-left"></i>
          <span>Continue Shopping</span>
        </Link>

        <style>{`
          .wishlist-heart {
            font-size: 54px;
            animation: heartBeat 1.3s infinite;
            display: inline-block;
          }

          @keyframes heartBeat {
            0% { transform: scale(1); }
            25% { transform: scale(1.15); }
            40% { transform: scale(1); }
            60% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }

          .continue-shopping-btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 10px 22px;
            border-radius: 30px;
            border: 1px solid #111;
            background: #fff;
            color: #111;
            font-weight: 600;
            font-size: 14px;
            text-decoration: none;
            transition: all 0.3s ease;
          }

          .continue-shopping-btn:hover {
            background: #111;
            color: #fff;
          }
        `}</style>
      </div>
    );
  }

  /* ================= LOGIN WISHLIST ================= */
  if (token) {
    return (
      <div className="container py-4">
        <h3 className="fw-bold mb-4">My Wishlist</h3>

        <div className="row g-4">
          {items.map((item) => (
            <div className="col-6 col-md-4 col-lg-3" key={item.id}>
              <div className="card shadow-sm h-100 border-0 wishlist-card">
                <Link to={`/product/${item.product.id}`}>
                  <div className="ratio ratio-1x1">
                    <img
                      src={item.product.images?.[0]?.image_url}
                      alt={item.product.name}
                      className="img-fluid"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </Link>

                <div className="card-body p-2 d-flex flex-column">
                  <h6 className="small fw-semibold text-truncate">
                    {item.product.name}
                  </h6>

                  <p className="small fw-bold mb-2">
                    ₹{item.product.sale_price || item.product.price}
                  </p>

                  <button
                    onClick={() => removeFromWishlist(item.product.id)}
                    className="btn btn-outline-danger btn-sm mt-auto"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ================= GUEST WISHLIST ================= */
  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4">My Wishlist</h3>

      <div className="row g-4">
        {guestItems.map((id) => (
          <div className="col-6 col-md-4 col-lg-3" key={id}>
            <div className="card shadow-sm h-100 border-0 p-3 text-center">
              <p className="small mb-3">
                Product ID: {id}
              </p>

              <Link
                to={`/product/${id}`}
                className="btn btn-outline-dark btn-sm mb-2"
              >
                View Product
              </Link>

              <button
                onClick={() => removeFromWishlist(id)}
                className="btn btn-outline-danger btn-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;

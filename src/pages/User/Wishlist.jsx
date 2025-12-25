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
    if (token) {
      dispatch(fetchWishlist());
    } else {
      setGuestItems(getGuestWishlist());
    }
  }, [dispatch, token]);

  /* ================= REMOVE ITEM ================= */
  const removeFromWishlist = async (productId) => {
    if (!token) {
      toggleGuestWishlist(productId);
      setGuestItems(getGuestWishlist());
      return;
    }

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

  /* ================= EMPTY ================= */
  const isEmpty = token
    ? items.length === 0
    : guestItems.length === 0;

  if (isEmpty) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-heart-fill wishlist-heart mb-3"></i>

        <h4 className="fw-bold mb-2">
          Your wishlist is empty
        </h4>

        <p className="text-muted mb-4">
          Save items you like so you can find them later.
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
            <div
              className="col-6 col-md-4 col-lg-3"
              key={item.id}
            >
              <div className="card shadow-sm h-100 border-0 wishlist-card">
                {/* IMAGE + REMOVE ICON */}
                <div className="position-relative">
                  <Link to={`/product/${item.product.id}`}>
                    <div className="ratio ratio-1x1">
                      <img
                        src={
                          item.product.images?.[0]
                            ?.image_url
                        }
                        alt={item.product.name}
                        className="img-fluid"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  </Link>

                  {/* REMOVE ICON */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeFromWishlist(
                        item.product.id
                      );
                    }}
                    className="wishlist-remove-btn position-absolute top-0 end-0 m-2"
                    title="Remove from wishlist"
                  >
                    <i className="bi bi-heart-fill"></i>
                  </button>
                </div>

                <div className="card-body p-2 d-flex flex-column">
                  <h6 className="small fw-semibold text-truncate">
                    {item.product.name}
                  </h6>

                  <p className="small fw-bold mb-2">
                    ₹
                    {item.product.sale_price ||
                      item.product.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ICON BUTTON CSS */}
        <style>{`
          .wishlist-remove-btn {
            border: none;
            background: rgba(255,255,255,0.9);
            color: #dc3545;
            font-size: 18px;
            padding: 6px 8px;
            border-radius: 50%;
            transition: all 0.25s ease;
          }

          .wishlist-remove-btn:hover {
            background: #dc3545;
            color: #fff;
            transform: scale(1.15);
          }

          .wishlist-remove-btn:active {
            transform: scale(0.95);
          }
        `}</style>
      </div>
    );
  }

  /* ================= GUEST WISHLIST ================= */
  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4">My Wishlist</h3>

      <div className="row g-4">
        {guestItems.map((id) => (
          <div
            className="col-6 col-md-4 col-lg-3"
            key={id}
          >
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


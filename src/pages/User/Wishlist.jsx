import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist } from "../../features/wishlist/wishlistSlice";
import { toggleWishlist } from "../../api/wishlist";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((s) => s.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const removeFromWishlist = async (productId) => {
    await toggleWishlist(productId);
    dispatch(fetchWishlist());
  };

  /* ================= LOADING ================= */
  if (status === "loading") {
    return (
      <p className="text-center py-5 fs-5">
        Loading wishlist…
      </p>
    );
  }

  /* ================= EMPTY WISHLIST ================= */
  if (items.length === 0) {
    return (
      <div className="container py-5 text-center">
        {/* ❤️ Animated Heart */}
        <i className="bi bi-heart-fill wishlist-heart mb-3"></i>

        <h4 className="fw-bold mb-2">
          Your wishlist is empty
        </h4>

        <p className="text-muted mb-4">
          Save items you like so you can find them easily later.
        </p>

        {/* MATCHED CONTINUE SHOPPING */}
        <Link to="/" className="continue-shopping-btn">
          <i className="bi bi-arrow-left"></i>
          <span>Continue Shopping</span>
        </Link>

        {/* EMPTY WISHLIST CSS */}
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

          .continue-shopping-btn i {
            font-size: 16px;
            transition: transform 0.3s ease;
          }

          .continue-shopping-btn:hover {
            background: #111;
            color: #fff;
          }

          .continue-shopping-btn:hover i {
            transform: translateX(-4px);
          }
        `}</style>
      </div>
    );
  }

  /* ================= WISHLIST ITEMS ================= */
  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4">My Wishlist</h3>

      <div className="row g-4">
        {items.map((item) => (
          <div className="col-6 col-md-4 col-lg-3" key={item.id}>
            <div className="card shadow-sm h-100 border-0 wishlist-card">

              {/* IMAGE */}
              <Link to={`/product/${item.product.id}`}>
                <div className="ratio ratio-1x1">
                  <img
                    src={item.product.images?.[0]?.image_url}
                    alt={item.product.name}
                    className="card-img-top img-fluid"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </Link>

              {/* DETAILS */}
              <div className="card-body p-2 d-flex flex-column">
                <h6 className="small fw-semibold mb-1 text-truncate">
                  {item.product.name}
                </h6>

                <p className="small mb-2 fw-bold">
                  ₹{item.product.sale_price || item.product.price}
                </p>

                <button
                  onClick={() =>
                    removeFromWishlist(item.product.id)
                  }
                  className="btn btn-outline-danger btn-sm w-100 mt-auto"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CARD HOVER */}
      <style>{`
        .wishlist-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          border-radius: 12px;
        }

        .wishlist-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 18px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
};

export default Wishlist;

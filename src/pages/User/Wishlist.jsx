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
        <i className="bi bi-heart fs-1 text-muted mb-3"></i>

        <h4 className="fw-bold mb-2">
          Your wishlist is empty
        </h4>

        <p className="text-muted mb-4">
          Save items you like so you can find them easily later.
        </p>

        <Link to="/" className="btn btn-dark px-4">
          Continue Shopping
        </Link>
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
            <div className="card shadow-sm h-100 border-0">

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
    </div>
  );
};

export default Wishlist;

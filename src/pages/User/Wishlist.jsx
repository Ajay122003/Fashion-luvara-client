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

  if (status === "loading") {
    return <p className="text-center py-5">Loading wishlist...</p>;
  }

  if (items.length === 0) {
    return <p className="text-center py-5 fs-5">Wishlist is empty </p>;
  }

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4">My Wishlist</h3>

      <div className="row g-4">
        {items.map((item) => (
          <div className="col-6 col-md-3" key={item.id}>
            <div className="card shadow-sm h-100">

              <Link to={`/product/${item.product.id}`}>
                <img
                  src={item.product.images?.[0]?.image_url}
                  className="card-img-top"
                  style={{ height: "220px", objectFit: "cover" }}
                />
              </Link>

              <div className="card-body p-2">
                <h6 className="small fw-semibold">
                  {item.product.name}
                </h6>
                <p className="small mb-2">
                  ₹{item.product.sale_price || item.product.price}
                </p>

                <button
                  onClick={() => removeFromWishlist(item.product.id)}
                  className="btn btn-outline-danger btn-sm w-100"
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

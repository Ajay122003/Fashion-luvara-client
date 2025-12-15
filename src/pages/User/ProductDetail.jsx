// src/pages/products/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import apiClient from "../../api/client";
import { fetchCart } from "../../features/cart/cartSlice";
import { toggleWishlist, getWishlistStatus } from "../../api/wishlist";
import { fetchWishlist } from "../../features/wishlist/wishlistSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);

  /* ================= LOAD PRODUCT ================= */
  const loadProduct = async () => {
    try {
      const res = await apiClient.get(`/api/products/${id}/`);
      setProduct(res.data);
      if (res.data.images?.length) {
        setMainImage(res.data.images[0].image_url);
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= WISHLIST STATUS ================= */
  const loadWishlistStatus = async (pid) => {
    try {
      const res = await getWishlistStatus(pid);
      setIsWishlisted(res.data.is_added);
    } catch {
      setIsWishlisted(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (product?.id) loadWishlistStatus(product.id);
  }, [product?.id]);

  /* ================= ADD TO CART ================= */
  const handleAddToCart = async () => {
    if (product.sizes?.length && !selectedSize)
      return alert("Select a size");

    await apiClient.post("/api/cart/add/", {
      product_id: product.id,
      quantity: 1,
      size: selectedSize,
    });

    dispatch(fetchCart());

    const modal = new window.bootstrap.Modal(
      document.getElementById("cartSuccessModal")
    );
    modal.show();
  };

  /* ================= BUY IT NOW ================= */
  const handleBuyNow = async () => {
    if (product.sizes?.length && !selectedSize)
      return alert("Select a size");

    await apiClient.post("/api/cart/add/", {
      product_id: product.id,
      quantity: 1,
      size: selectedSize,
    });

    dispatch(fetchCart());
    navigate("/checkout");
  };

  /* ================= WISHLIST ================= */
  const handleWishlistToggle = async () => {
    setIsWishlisted((p) => !p);
    try {
      await toggleWishlist(product.id);
      dispatch(fetchWishlist());
    } catch {
      setIsWishlisted((p) => !p);
    }
  };

  if (loading) return <p className="text-center py-5">Loading…</p>;
  if (!product) return <p className="text-center py-5">Not found</p>;

  return (
    <div className="container py-3 py-md-5">
      <div className="row g-4">
        {/* IMAGE */}
        <div className="col-12 col-md-6">
          <div className="position-relative border rounded p-2">
            <button
              onClick={handleWishlistToggle}
              className="btn position-absolute top-0 end-0 m-2"
            >
              <i
                className={`bi ${
                  isWishlisted ? "bi-heart-fill text-danger" : "bi-heart"
                } fs-4`}
              />
            </button>

            <img
              src={mainImage}
              alt=""
              className="w-100"
              style={{ height: "380px", objectFit: "contain" }}
            />
          </div>

          <div className="d-flex gap-2 mt-3 overflow-auto">
            {product.images?.map((img) => (
              <img
                key={img.id}
                src={img.image_url}
                onClick={() => setMainImage(img.image_url)}
                className={`border rounded ${
                  mainImage === img.image_url ? "border-dark" : ""
                }`}
                style={{ width: 70, height: 70, objectFit: "cover" }}
              />
            ))}
          </div>
        </div>

        {/* DETAILS */}
        <div className="col-12 col-md-6">
          <h4 className="fw-bold">{product.name}</h4>

          <h5 className="fw-bold my-2">
            ₹{product.sale_price || product.price}
            {product.sale_price && (
              <span className="text-muted text-decoration-line-through ms-2">
                ₹{product.price}
              </span>
            )}
          </h5>

          <p className="text-muted small">{product.description}</p>

          {product.sizes?.length > 0 && (
            <div className="my-3">
              <small className="fw-semibold">Select Size</small>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`btn btn-sm ${
                      selectedSize === s
                        ? "btn-dark"
                        : "btn-outline-dark"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* DESKTOP BUTTONS */}
          <div className="d-none d-md-flex gap-3 mt-4">
            <button
              onClick={handleAddToCart}
              className="btn btn-outline-dark btn-lg w-50"
            >
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="btn btn-dark btn-lg w-50"
            >
              Buy it now
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BAR */}
      <div className="d-md-none position-fixed bottom-0 start-0 w-100 bg-white p-2 shadow d-flex gap-2">
        <button
          onClick={handleAddToCart}
          className="btn btn-outline-dark w-50"
        >
          Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          className="btn btn-dark w-50"
        >
          Buy it now
        </button>
      </div>

      {/* SUCCESS MODAL */}
      <div className="modal fade" id="cartSuccessModal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content text-center p-4">
            <i className="bi bi-check-circle-fill text-success fs-1"></i>
            <h5 className="mt-3">Added to cart</h5>

            <div className="d-flex justify-content-center gap-3 mt-3">
              <button className="btn btn-outline-dark" data-bs-dismiss="modal">
                Shop More
              </button>
              <Link to="/cart" className="btn btn-dark">
                Go to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;


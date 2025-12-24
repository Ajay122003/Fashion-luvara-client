import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import publicClient from "../../api/publicClient";
import apiClient from "../../api/client";

import { fetchCart } from "../../features/cart/cartSlice";
import { toggleWishlist, getWishlistStatus } from "../../api/wishlist";
import { fetchWishlist } from "../../features/wishlist/wishlistSlice";

import storage from "../../utils/storage";
import {
  toggleGuestWishlist,
  isGuestWishlisted,
} from "../../utils/guestWishlist";

import sizechart from "../../assets/images/sizechart.jpeg";
import RelatedProducts from "./RelatedProducts";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [isWishlisted, setIsWishlisted] = useState(false);

  /* ================= LOAD PRODUCT ================= */
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await publicClient.get(`/api/products/${id}/`);
        setProduct(res.data);
        if (res.data.images?.length) {
          setMainImage(res.data.images[0].image_url);
        }
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    loadProduct();
  }, [id]);

  /* ================= WISHLIST STATUS ================= */
  useEffect(() => {
    const loadWishlistStatus = async () => {
      const token = storage.getUserToken();

      // 👤 Guest user
      if (!token) {
        setIsWishlisted(isGuestWishlisted(Number(id)));
        return;
      }

      // 🔐 Logged in user
      try {
        const res = await getWishlistStatus(id);
        setIsWishlisted(res.is_added);
      } catch {
        setIsWishlisted(false);
      }
    };

    loadWishlistStatus();
  }, [id]);

  /* ================= VARIANT MATCH ================= */
  useEffect(() => {
    if (!product || !selectedSize || !selectedColor) {
      setSelectedVariant(null);
      return;
    }

    const v = product.variants.find(
      (x) => x.size === selectedSize && x.color === selectedColor
    );
    setSelectedVariant(v || null);
  }, [selectedSize, selectedColor, product]);

  /* ================= ADD TO CART ================= */
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      alert("Select size and color");
      return;
    }

    if (selectedVariant.stock === 0) {
      alert("Selected variant is out of stock");
      return;
    }

    await apiClient.post("/api/cart/add/", {
      variant_id: selectedVariant.id,
      quantity: 1,
    });

    dispatch(fetchCart());

    const modal = new window.bootstrap.Modal(
      document.getElementById("cartSuccessModal")
    );
    modal.show();
  };

  /* ================= BUY NOW ================= */
  const handleBuyNow = async () => {
    if (!selectedVariant) {
      alert("Select size and color");
      return;
    }

    if (selectedVariant.stock === 0) {
      alert("Selected variant is out of stock");
      return;
    }

    await apiClient.post("/api/cart/add/", {
      variant_id: selectedVariant.id,
      quantity: 1,
    });

    dispatch(fetchCart());
    navigate("/checkout");
  };

  /* ================= WISHLIST TOGGLE ================= */
  const handleWishlistToggle = async () => {
    const token = storage.getUserToken();

    // 👤 Guest user
    if (!token) {
      const added = toggleGuestWishlist(product.id);
      setIsWishlisted(added);
      return;
    }

    // 🔐 Logged in user
    try {
      const res = await toggleWishlist(product.id);
      setIsWishlisted(res.is_added);
      dispatch(fetchWishlist());
    } catch {
      // ignore
    }
  };

  if (loading) return <p className="text-center py-5">Loading…</p>;
  if (!product) return <p className="text-center py-5">Not found</p>;

  const sizes = [...new Set(product.variants.map((v) => v.size))];
  const colors = [...new Set(product.variants.map((v) => v.color))];

  return (
    <div className="container py-3 py-md-5 product-detail-page">
      <div className="row g-4">

        {/* IMAGE SECTION */}
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
              alt={product.name}
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
                style={{
                  width: 70,
                  height: 70,
                  objectFit: "cover",
                  cursor: "pointer",
                }}
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
              <span className="text-muted text-decoration-line-through ms-2 small">
                ₹{product.price}
              </span>
            )}
          </h5>

          <p className="text-muted small">{product.description}</p>

          {/* SIZE */}
          <div className="my-3">
            <small className="fw-semibold">Size</small>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {sizes.map((s) => (
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

          {/* COLOR */}
          <div className="my-3">
            <small className="fw-semibold">Color</small>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`btn btn-sm ${
                    selectedColor === c
                      ? "btn-dark"
                      : "btn-outline-dark"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {selectedVariant && (
            <p className="small mt-2">
              {selectedVariant.stock > 0 ? (
                <span className="text-success">
                  In stock ({selectedVariant.stock})
                </span>
              ) : (
                <span className="text-danger">Out of stock</span>
              )}
            </p>
          )}

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

      <RelatedProducts productId={product.id} />

      {/* MOBILE BAR */}
      <div className="d-md-none position-fixed bottom-0 start-0 w-100 bg-white p-2 shadow d-flex gap-2">
        <button onClick={handleAddToCart} className="btn btn-outline-dark w-50">
          Add to Cart
        </button>
        <button onClick={handleBuyNow} className="btn btn-dark w-50">
          Buy it now
        </button>
      </div>

      {/* CART MODAL */}
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

      {/* SIZE CHART */}
      <div className="modal fade" id="sizeChartModal">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-body text-center">
              <img src={sizechart} alt="Size chart" className="img-fluid" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

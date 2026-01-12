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

import SizeChartModal from "../../components/SizeChartModal";
import RelatedProducts from "./RelatedProducts";

const getRemainingTime = (endDate) => {
  if (!endDate) return null;

  const diff = new Date(endDate) - new Date();
  if (diff <= 0) return null;

  const sec = Math.floor(diff / 1000);
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;

  return `${d}d ${h}h ${m}m ${s}s`;
};


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
  const [, forceTick] = useState(0);

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

  useEffect(() => {
  if (!product?.offer_end_date) return;

  const timer = setInterval(() => {
    forceTick((t) => t + 1);
  }, 1000);

  return () => clearInterval(timer);
}, [product]);


  /* ================= WISHLIST STATUS ================= */
  useEffect(() => {
    const loadWishlistStatus = async () => {
      const token = storage.getUserToken();

      if (!token) {
        setIsWishlisted(isGuestWishlisted(Number(id)));
        return;
      }

      try {
        const res = await getWishlistStatus(id);
        setIsWishlisted(res.is_added);
      } catch {
        setIsWishlisted(false);
      }
    };

    loadWishlistStatus();
  }, [id]);

  /* ================= DERIVED DATA ================= */
  if (!product && !loading) return null;

  const sizes = product
    ? [...new Set(product.variants.map((v) => v.size))]
    : [];

  const colors = product
    ? [
        ...new Set(
          product.variants.map((v) => v.color).filter(Boolean)
        ),
      ]
    : [];
  
  const isProductOutOfStock =
  product?.variants?.length > 0 &&
  product.variants.every((v) => v.stock === 0);


  const hasColors = colors.length > 0;

  /* ================= VARIANT MATCH ================= */
  useEffect(() => {
    if (!product || !selectedSize) {
      setSelectedVariant(null);
      return;
    }

    const variant = product.variants.find((v) => {
      if (hasColors) {
        return v.size === selectedSize && v.color === selectedColor;
      }
      return v.size === selectedSize;
    });

    setSelectedVariant(variant || null);
  }, [selectedSize, selectedColor, product, hasColors]);

  /* ================= HELPERS ================= */
  const isSizeAvailable = (size) =>
    product.variants.some(
      (v) => v.size === size && v.stock > 0
    );

  const isColorAvailable = (color) => {
    if (!selectedSize) return false;

    return product.variants.some(
      (v) =>
        v.size === selectedSize &&
        v.color === color &&
        v.stock > 0
    );
  };

  const isOutOfStock =
    selectedVariant && selectedVariant.stock === 0;

  const openCartSidebar = () => {
    const el = document.getElementById("cartOffcanvas");
    if (!el) return;

    const offcanvas =
      window.bootstrap.Offcanvas.getOrCreateInstance(el);
    offcanvas.show();
  };

  /* ================= ADD TO CART ================= */
  const handleAddToCart = async () => {
    if (!selectedVariant || isOutOfStock) return;

    await apiClient.post("/api/cart/add/", {
      variant_id: selectedVariant.id,
      quantity: 1,
    });

    dispatch(fetchCart());
    openCartSidebar();
  };

  /* ================= BUY NOW ================= */
  const handleBuyNow = async () => {
    if (!selectedVariant || isOutOfStock) return;

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

    if (!token) {
      const added = toggleGuestWishlist(product.id);
      setIsWishlisted(added);
      return;
    }

    try {
      const res = await toggleWishlist(product.id);
      setIsWishlisted(res.is_added);
      dispatch(fetchWishlist());
    } catch {}
  };

  if (loading)
    return <p className="text-center py-5">Loading…</p>;
  if (!product)
    return <p className="text-center py-5">Not found</p>;

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
                  isWishlisted
                    ? "bi-heart-fill text-danger"
                    : "bi-heart"
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
                  mainImage === img.image_url
                    ? "border-dark"
                    : ""
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
          {isProductOutOfStock && (
  <p className="text-danger fw-semibold my-2">
    Out of Stock
  </p>
)}

          {product.offer &&
 product.offer_is_active &&
 getRemainingTime(product.offer_end_date) && (
  <>
    <span className="badge bg-danger mb-1">
      {product.offer_title}
    </span>

    {/* <p className="text-danger small fw-semibold mb-2">
      <i class="bi bi-alarm"></i> Offer ends in{" "}
      {getRemainingTime(product.offer_end_date)}
    </p> */}

    <p className="text-danger small fw-semibold mb-2">
  <i className="bi bi-alarm alarm-icon me-2"></i>
  Offer ends in {getRemainingTime(product.offer_end_date)}
</p>

  </>
)}



<h5 className="fw-bold my-2">
  ₹{Math.round(product.effective_price)}

  {product.effective_price < product.price && (
    <span className="text-muted text-decoration-line-through ms-2 small">
      ₹{product.price}
    </span>
  )}
</h5>

{product.effective_price < product.price && (
  <p className="text-success small fw-semibold mb-1">
    You save ₹{Math.round(product.price - product.effective_price)}
  </p>
)}


          

           {/*  SKU ADDED */}
          {product.sku && (
            <p className="text-muted small mb-1">
              {" "}
              <span className="fw-semibold">{product.sku}</span>
            </p>
          )}

          <p className="text-muted small">{product.description}</p>

          {/* SIZE */}
          <div className="my-3">
            <div className="d-flex justify-content-between align-items-center">
              <small className="fw-semibold">Size</small>

              {/*  ADDED */}
              <button
                className="btn btn-link p-0 small text-decoration-underline"
                data-bs-toggle="offcanvas"
                data-bs-target="#sizeChartModal"
              >
                View Size Chart
              </button>
            </div>

            <div className="d-flex flex-wrap gap-2 mt-2">
              {sizes.map((s) => {
                const disabled = !isSizeAvailable(s);

                return (
                  <button
                    key={s}
                    disabled={disabled}
                    onClick={() =>
                      !disabled && setSelectedSize(s)
                    }
                    className={`btn btn-sm ${
                      selectedSize === s
                        ? "btn-dark"
                        : "btn-outline-dark"
                    } ${disabled ? "opacity-50" : ""}`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* COLOR */}
          {hasColors && (
            <div className="my-3">
              <small className="fw-semibold">Color</small>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {colors.map((c) => {
                  const disabled = !isColorAvailable(c);

                  return (
                    <button
                      key={c}
                      disabled={disabled}
                      onClick={() =>
                        !disabled && setSelectedColor(c)
                      }
                      className={`btn btn-sm ${
                        selectedColor === c
                          ? "btn-dark"
                          : "btn-outline-dark"
                      } ${disabled ? "opacity-50" : ""}`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {selectedVariant && (
            <p className="small fw-semibold mt-2">
              {selectedVariant.stock > 0 ? (
                <span className="text-success">
                  In stock ({selectedVariant.stock})
                </span>
              ) : (
                <span className="text-danger">
                  Out of stock
                </span>
              )}
            </p>
          )}

          <div className="d-none d-md-flex gap-3 mt-4">
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant || isOutOfStock}
              className="btn btn-outline-dark btn-lg w-50"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!selectedVariant || isOutOfStock}
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
        <button
          onClick={handleAddToCart}
          disabled={!selectedVariant || isOutOfStock}
          className="btn btn-outline-dark w-50"
        >
          Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          disabled={!selectedVariant || isOutOfStock}
          className="btn btn-dark w-50"
        >
          Buy it now
        </button>
      </div>

      {/*  ADDED MODAL */}
      <SizeChartModal />
      <style>
        {`
        /* Shake + glow feel */
.alarm-icon {
  display: inline-block;
  animation: alarmShake 1.2s infinite ease-in-out;
}

@keyframes alarmShake {
  0%   { transform: rotate(0deg) scale(1); }
  25%  { transform: rotate(-10deg) scale(1.1); }
  50%  { transform: rotate(10deg) scale(1.1); }
  75%  { transform: rotate(-6deg) scale(1.05); }
  100% { transform: rotate(0deg) scale(1); }
}
`}
      </style>
    </div>
  );
};

export default ProductDetail;

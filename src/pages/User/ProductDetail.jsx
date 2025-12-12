import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import apiClient from "../../api/client";
import { useDispatch } from "react-redux";
import { fetchCart } from "../../features/cart/cartSlice";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const [related, setRelated] = useState([]);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const loadProduct = async () => {
    try {
      const res = await apiClient.get(`/api/products/${id}/`);
      setProduct(res.data);

      if (res.data.images?.length > 0) {
        setMainImage(res.data.images[0].image_url);
      }

      loadRelatedProducts(res.data.category);
    } catch (err) {
      alert("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedProducts = async (catId) => {
    try {
      const res = await apiClient.get("/api/products/", {
        params: { category: catId, exclude: id, limit: 8 },
      });

      setRelated(res.data.results || []);
    } catch {}
  };

  useEffect(() => {
    setProduct(null);
    setMainImage(null);
    setRelated([]);
    setLoading(true);
    loadProduct();
  }, [id]);

  // ADD TO CART FUNCTION
  const handleAddToCart = async () => {
    try {
      if (product.sizes?.length > 0 && !selectedSize)
        return alert("Select a size");

      if (product.colors?.length > 0 && !selectedColor)
        return alert("Select a color");

      await apiClient.post("/api/cart/add/", {
        product_id: product.id,
        quantity: 1,
        size: selectedSize,
        color: selectedColor,
      });

      alert("Added to Cart!");

      // 🔥 UPDATE REDUX CART
      dispatch(fetchCart());  

    } catch (err) {
      alert(err.response?.data?.error || "Failed to add to cart");
    }
  };

  if (loading) return <p className="text-center py-5">Loading...</p>;
  if (!product) return <p className="text-center py-5">Product not found</p>;

  return (
    <div className="container py-4">
      <div className="row g-4 align-items-start">

        {/* LEFT SECTION */}
        <div className="col-12 col-md-6">
          <div className="border rounded shadow-sm p-2">
            <img
              src={mainImage}
              className="w-100"
              style={{ height: "450px", objectFit: "contain" }}
              alt=""
            />
          </div>

          {/* Thumbnails */}
          <div className="d-flex gap-2 flex-wrap mt-3">
            {product.images?.map((img) => (
              <img
                key={img.id}
                src={img.image_url}
                className={`border rounded ${mainImage === img.image_url ? "border-dark" : ""}`}
                style={{ width: "75px", height: "75px", objectFit: "cover", cursor: "pointer" }}
                onClick={() => setMainImage(img.image_url)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="col-12 col-md-6">
          <h2 className="fw-bold">{product.name}</h2>

          <h3 className="fw-bold">
            ₹{product.sale_price || product.price}
            {product.sale_price && (
              <span className="text-muted text-decoration-line-through fs-6 ms-2">
                ₹{product.price}
              </span>
            )}
          </h3>

          <p className="text-muted">{product.description}</p>

          <p><strong>Category:</strong> {product.category_name}</p>

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="my-3">
              <strong>Sizes:</strong>
              <div className="d-flex gap-2 mt-2">
                {product.sizes.map((size) => (
                  <span
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 border rounded ${
                      selectedSize === size ? "bg-dark text-white" : ""
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="my-3">
              <strong>Colors:</strong>
              <div className="d-flex gap-2 mt-2">
                {product.colors.map((color) => (
                  <div
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-circle border ${
                      selectedColor === color ? "border-3 border-dark" : ""
                    }`}
                    style={{
                      width: "32px",
                      height: "32px",
                      backgroundColor: color.toLowerCase(),
                      cursor: "pointer",
                    }}
                  ></div>
                ))}
              </div>
            </div>
          )}

          <button onClick={handleAddToCart} className="btn btn-dark btn-lg mt-3 px-4">
            Add to Cart
          </button>
        </div>
      </div>

      {/* Related products */}
      <div className="mt-5">
        <h4 className="fw-bold mb-3">Similar Products</h4>

        <div className="row g-3">
          {related.map((item) => (
            <div className="col-6 col-md-3" key={item.id}>
              <Link to={`/product/${item.id}`} className="text-dark text-decoration-none">
                <div className="card shadow-sm">
                  <img
                    src={item.images?.[0]?.image_url}
                    className="card-img-top"
                    style={{ height: "220px", objectFit: "cover" }}
                  />
                  <div className="card-body p-2">
                    <h6 className="fw-semibold small">{item.name}</h6>
                    <p className="small mb-0">₹{item.sale_price || item.price}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;


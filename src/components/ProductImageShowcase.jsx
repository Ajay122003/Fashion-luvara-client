import { useEffect, useState } from "react";
import { fetchProducts } from "../api/products";
import { Link } from "react-router-dom";

const ProductImageShowcase = () => {
  const [products, setProducts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts({ page_size: 10 });
        setProducts(data.results || []);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    loadProducts();
  }, []);

  /* AUTO SLIDE */
  useEffect(() => {
    if (!products.length) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) =>
        prev === products.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [products]);

  /* TRIGGER SCROLL ANIMATION */
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  if (!products.length) {
    return <p className="text-center py-5">Loading products...</p>;
  }

  const activeProduct = products[activeIndex];
  const hasOffer =
    activeProduct.effective_price < activeProduct.price;

  return (
    <div className="container my-5">
      <div className="row g-3" style={{ height: "420px" }}>
        {/* ================= LEFT IMAGE ================= */}
        <div className="col-6 h-100">
          <img
            src={activeProduct.images?.[0]?.image_url}
            alt={activeProduct.name}
            className="w-100 h-100 rounded shadow"
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* ================= RIGHT PRODUCT CARD ================= */}
        <div className="col-6 h-100 overflow-hidden">
          <Link
            to={`/product/${activeProduct.id}`}
            className="text-decoration-none text-dark h-100 d-block"
          >
            <div
              className={`card shadow border-0 h-100 d-flex flex-column product-card-scroll ${
                animate ? "slide-in" : ""
              }`}
            >
              <img
                src={activeProduct.images?.[0]?.image_url}
                alt={activeProduct.name}
                className="w-100"
                style={{
                  height: "55%",
                  objectFit: "cover",
                }}
              />

              <div className="p-3 flex-grow-1">
                <h5 className="fw-bold">
                  {activeProduct.name}
                </h5>

                <p className="mb-2">
                  <span className="fw-bold fs-5">
                    ₹{Math.round(activeProduct.effective_price)}
                  </span>

                  {hasOffer && (
                    <span className="text-muted text-decoration-line-through ms-2">
                      ₹{activeProduct.price}
                    </span>
                  )}
                </p>

                {hasOffer && (
                  <span className="badge bg-success">
                    {Math.round(
                      ((activeProduct.price -
                        activeProduct.effective_price) /
                        activeProduct.price) *
                        100
                    )}
                    % OFF
                  </span>
                )}
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* ===== SCROLL ANIMATION STYLE ===== */}
      <style>{`
        .product-card-scroll {
          transform: translateY(40px);
          opacity: 0;
          transition: all 0.45s ease;
        }

        .product-card-scroll.slide-in {
          transform: translateY(0);
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default ProductImageShowcase;

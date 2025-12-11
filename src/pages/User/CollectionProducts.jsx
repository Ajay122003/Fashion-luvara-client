import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchCollectionProducts } from "../../api/collections";

const CollectionProducts = () => {
  const { slug } = useParams();

  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [page, setPage] = useState(1);

  const loadCollection = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const res = await fetchCollectionProducts(slug, { page: pageNumber });

      // API returns pagination wrapper:
      // { count, next, previous, results: { collection, products } }

      const data = res.data.results; 

      setCollection(data.collection);
      setProducts(data.products);

      setNextPage(res.data.next);
      setPrevPage(res.data.previous);
      setPage(pageNumber);
    } catch (err) {
      console.error("❌ Failed to load collection:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollection(1);
  }, [slug]);

  if (loading)
    return <p className="text-center py-5 fw-bold">Loading…</p>;

  if (!collection)
    return <p className="text-center py-5">Collection not found.</p>;

  return (
    <div className="container py-4">

      {/* HEADER */}
      <div className="text-center mb-4">
        <h3 className="fw-bold">{collection.name}</h3>
        {collection.description && (
          <p className="text-muted">{collection.description}</p>
        )}

        {collection.image_url && (
          <img
            src={collection.image_url}
            alt={collection.name}
            className="img-fluid rounded shadow-sm my-3"
            style={{ maxHeight: "300px", objectFit: "cover" }}
          />
        )}
      </div>

      {/* PRODUCT GRID */}
      <div className="row g-4">
        {products.length === 0 ? (
          <p className="text-center py-4">No products available.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="col-6 col-md-4 col-lg-3">
              <Link
                to={`/product/${product.id}`}
                className="text-decoration-none text-dark"
              >
                <div className="card shadow-sm h-100">

                  {/* PRODUCT IMAGE */}
                  <div style={{ height: "220px", overflow: "hidden" }}>
                    <img
                      src={
                        product.images?.[0]?.image_url ||
                        "/placeholder.png"
                      }
                      alt={product.name}
                      className="w-100"
                      style={{ height: "100%", objectFit: "cover" }}
                    />
                  </div>

                  <div className="card-body">
                    <h6 className="fw-bold">{product.name}</h6>

                    <p className="mb-1 fw-semibold">
                      ₹{product.effective_price}
                    </p>

                    {product.sale_price && (
                      <small className="text-muted text-decoration-line-through">
                        ₹{product.price}
                      </small>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>

      {/* PAGINATION */}
      <div className="d-flex justify-content-center gap-3 mt-4">
        <button
          className="btn btn-dark"
          disabled={!prevPage}
          onClick={() => loadCollection(page - 1)}
        >
          Previous
        </button>

        <button
          className="btn btn-dark"
          disabled={!nextPage}
          onClick={() => loadCollection(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CollectionProducts;

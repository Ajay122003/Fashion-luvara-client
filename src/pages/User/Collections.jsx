import React, { useEffect, useState } from "react";
import { fetchCollections } from "../../api/collections";
import { Link } from "react-router-dom";

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchCollections();
      setCollections(res.data);
    } catch (err) {
      console.error("Failed to load collections", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center py-5">Loading collections...</p>;
  if (!collections.length) return <p className="text-center py-5">No collections yet.</p>;

  return (
    <div className="container py-4">
      <h3 className="mb-4 fw-bold text-center">Collections</h3>

      <div className="row g-4">
        {collections.map((c) => (
          <div key={c.id} className="col-6 col-md-4 col-lg-3">
            <Link to={`/collections/${c.slug}`} className="text-decoration-none">
              <div className="card h-100 shadow-sm">

                <div style={{ height: 160, overflow: "hidden" }}>
                  <img
                    src={c.image_url || "/placeholder.png"}
                    alt={c.name}
                    className="w-100"
                    style={{ objectFit: "cover", height: "100%" }}
                  />
                </div>

                <div className="card-body text-center">
                  <h6 className="fw-bold mb-1">{c.name}</h6>
                  <small className="text-muted">{c.product_count} items</small>
                </div>

              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collections;

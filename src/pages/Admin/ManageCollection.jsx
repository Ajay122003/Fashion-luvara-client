import React, { useEffect, useState } from "react";
import {
  fetchAdminCollections,
  deleteAdminCollection,
} from "../../api/admin";
import { Link } from "react-router-dom";

const ManageCollection = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCollections = async () => {
    try {
      const res = await fetchAdminCollections(); // ✅ CORRECT API
      setCollections(res);
    } catch (err) {
      console.error(err);
      alert("Failed to load collections");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this collection?"))
      return;

    try {
      await deleteAdminCollection(id); // ✅ CORRECT API
      setCollections(collections.filter((col) => col.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);

  if (loading)
    return <p className="text-center py-5 fw-semibold">Loading Collections…</p>;

  return (
    <div className="container py-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">Collections</h3>

        <Link to="/admin/collections/add" className="btn btn-dark">
          + Add Collection
        </Link>
      </div>

      {/* EMPTY STATE */}
      {collections.length === 0 ? (
        <div className="text-center py-5">
          <h5 className="text-muted">No collections found</h5>
          <Link to="/admin/collections/add" className="btn btn-dark mt-3">
            Create First Collection
          </Link>
        </div>
      ) : (
        <div className="table-responsive card shadow-sm">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Products</th>
                <th>Status</th>
                <th width="150" className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {collections.map((col) => (
                <tr key={col.id}>

                  <td>
                    <img
                      src={col.image_url || "/placeholder.png"}
                      alt={col.name}
                      style={{
                        height: "50px",
                        width: "50px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        border: "1px solid #ddd",
                      }}
                    />
                  </td>

                  <td className="fw-semibold">{col.name}</td>
                  <td>{col.slug}</td>

                  <td>
                    <span className="badge bg-info text-dark">
                      {col.product_count}
                    </span>
                  </td>

                  <td>
                    {col.is_active ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-secondary">Hidden</span>
                    )}
                  </td>

                  <td className="text-center">
                    <Link
                      to={`/admin/collections/${col.id}/edit`}
                      className="btn btn-sm btn-primary me-2"
                    >
                      Edit
                    </Link>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(col.id)}
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default ManageCollection;

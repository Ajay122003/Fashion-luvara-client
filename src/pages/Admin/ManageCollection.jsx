import React, { useEffect, useState } from "react";
import {
  fetchAdminCollections,
  deleteAdminCollection,
} from "../../api/admin";
import { Link } from "react-router-dom";

const ManageCollection = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const loadCollections = async () => {
    try {
      const res = await fetchAdminCollections();
      setCollections(res); // API returns array
    } catch (err) {
      console.error(err);
      alert("Failed to load collections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);

  /* ---------------- SEARCH ---------------- */
  const filteredCollections = collections.filter((col) =>
    col.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- DELETE ---------------- */
  const openDeleteModal = (collection) => {
    setSelected(collection);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelected(null);
    setShowModal(false);
  };

  const confirmDelete = async () => {
    if (!selected) return;

    try {
      await deleteAdminCollection(selected.id);
      setCollections((prev) =>
        prev.filter((c) => c.id !== selected.id)
      );
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  if (loading)
    return (
      <p className="text-center py-5 fw-semibold">
        Loading Collections…
      </p>
    );

  return (
    <div className="container-fluid py-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-semibold mb-0">Collections</h4>

        <Link to="/admin/collections/add" className="btn btn-dark">
          + Add Collection
        </Link>
      </div>

      {/* SEARCH */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search collection..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="card shadow-sm border-0 d-none d-md-block">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Products</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCollections.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No collections found
                  </td>
                </tr>
              ) : (
                filteredCollections.map((col) => (
                  <tr key={col.id}>
                    <td>
                      <img
                        src={col.image_url || "/placeholder.png"}
                        alt={col.name}
                        className="rounded border"
                        style={{
                          width: 48,
                          height: 48,
                          objectFit: "cover",
                        }}
                      />
                    </td>

                    <td className="fw-medium">{col.name}</td>
                    <td className="text-muted">{col.slug}</td>

                    <td>
                      <span className="badge bg-info-subtle text-dark">
                        {col.product_count}
                      </span>
                    </td>

                    <td>
                      {col.is_active ? (
                        <span className="badge bg-success-subtle text-success">
                          Active
                        </span>
                      ) : (
                        <span className="badge bg-secondary-subtle text-secondary">
                          Hidden
                        </span>
                      )}
                    </td>

                    <td className="text-end">
                      <Link
                        to={`/admin/collections/${col.id}/edit`}
                        className="btn btn-sm btn-outline-primary me-2"
                      >
                        <i className="bi bi-pencil"></i>
                      </Link>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => openDeleteModal(col)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="d-block d-md-none">
        {filteredCollections.length === 0 ? (
          <div className="text-center text-muted py-4">
            No collections found
          </div>
        ) : (
          filteredCollections.map((col) => (
            <div
              key={col.id}
              className="card shadow-sm border-0 mb-3"
            >
              <div className="card-body d-flex gap-3">
                <img
                  src={col.image_url || "/placeholder.png"}
                  alt={col.name}
                  className="rounded border"
                  style={{
                    width: 64,
                    height: 64,
                    objectFit: "cover",
                  }}
                />

                <div className="flex-grow-1">
                  <h6 className="mb-1 fw-semibold">{col.name}</h6>
                  <small className="text-muted d-block mb-2">
                    {col.slug}
                  </small>

                  <span className="badge bg-info-subtle text-dark me-2">
                    {col.product_count} products
                  </span>

                  {col.is_active ? (
                    <span className="badge bg-success-subtle text-success">
                      Active
                    </span>
                  ) : (
                    <span className="badge bg-secondary-subtle text-secondary">
                      Hidden
                    </span>
                  )}
                </div>

                <div className="d-flex flex-column gap-2">
                  <Link
                    to={`/admin/collections/${col.id}/edit`}
                    className="btn btn-sm btn-outline-primary"
                  >
                    <i className="bi bi-pencil"></i>
                  </Link>

                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => openDeleteModal(col)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= DELETE MODAL ================= */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5 className="modal-title">Delete Collection</h5>
                <button className="btn-close" onClick={closeModal} />
              </div>

              <div className="modal-body">
                <p className="mb-1">
                  Are you sure you want to delete{" "}
                  <strong>{selected?.name}</strong>?
                </p>
                <small className="text-muted">
                  This action cannot be undone.
                </small>
              </div>

              <div className="modal-footer">
                <button className="btn btn-light" onClick={closeModal}>
                  Cancel
                </button>
                <button
                  className="btn btn-danger fw-semibold"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageCollection;

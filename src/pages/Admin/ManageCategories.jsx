import React, { useEffect, useState } from "react";
import {
  fetchAdminCategories,
  deleteAdminCategory,
} from "../../api/admin";
import { Link } from "react-router-dom";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await fetchAdminCategories();
    setCategories(data);
  };

  /* ---------------- SEARCH FILTER ---------------- */
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- DELETE FLOW ---------------- */
  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedCategory(null);
    setShowModal(false);
  };

  const confirmDelete = async () => {
    if (!selectedCategory) return;

    await deleteAdminCategory(selectedCategory.id);
    closeModal();
    loadCategories();
  };

  return (
    <div className="container-fluid py-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-semibold mb-0">Manage Categories</h4>

        <Link
          to="/admin/categories/add"
          className="btn btn-dark fw-semibold"
        >
          + Add Category
        </Link>
      </div>

      {/* SEARCH */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search category..."
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
                <th>Status</th>
                <th>Sort</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No categories found
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr key={cat.id}>
                    <td>
                      {cat.image_url ? (
                        <img
                          src={cat.image_url}
                          alt=""
                          className="rounded"
                          style={{
                            width: 48,
                            height: 48,
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>

                    <td className="fw-medium">{cat.name}</td>

                    <td>
                      {cat.is_active ? (
                        <span className="badge bg-success-subtle text-success">
                          Active
                        </span>
                      ) : (
                        <span className="badge bg-secondary-subtle text-secondary">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td>{cat.sort_order}</td>

                    <td className="text-end">
                      <Link
                        to={`/admin/categories/${cat.id}/edit`}
                        className="btn btn-sm btn-outline-primary me-2"
                      >
                        <i className="bi bi-pencil"></i>
                      </Link>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => openDeleteModal(cat)}
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
        {filteredCategories.length === 0 ? (
          <div className="text-center text-muted py-4">
            No categories found
          </div>
        ) : (
          filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="card shadow-sm border-0 mb-3"
            >
              <div className="card-body d-flex gap-3">
                {/* IMAGE */}
                {cat.image_url ? (
                  <img
                    src={cat.image_url}
                    alt=""
                    className="rounded"
                    style={{
                      width: 64,
                      height: 64,
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    className="bg-light rounded d-flex align-items-center justify-content-center"
                    style={{ width: 64, height: 64 }}
                  >
                    <i className="bi bi-image text-muted fs-4"></i>
                  </div>
                )}

                {/* CONTENT */}
                <div className="flex-grow-1">
                  <h6 className="mb-1 fw-semibold">{cat.name}</h6>

                  <div className="mb-2">
                    {cat.is_active ? (
                      <span className="badge bg-success-subtle text-success">
                        Active
                      </span>
                    ) : (
                      <span className="badge bg-secondary-subtle text-secondary">
                        Inactive
                      </span>
                    )}
                  </div>

                  <small className="text-muted">
                    Sort Order: {cat.sort_order}
                  </small>
                </div>

                {/* ACTIONS */}
                <div className="d-flex flex-column gap-2">
                  <Link
                    to={`/admin/categories/${cat.id}/edit`}
                    className="btn btn-sm btn-outline-primary"
                  >
                    <i className="bi bi-pencil"></i>
                  </Link>

                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => openDeleteModal(cat)}
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
                <h5 className="modal-title">Delete Category</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                />
              </div>

              <div className="modal-body">
                <p className="mb-0">
                  Are you sure you want to delete{" "}
                  <strong>{selectedCategory?.name}</strong>?
                </p>
                <small className="text-muted">
                  This action cannot be undone.
                </small>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-light"
                  onClick={closeModal}
                >
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

export default ManageCategories;

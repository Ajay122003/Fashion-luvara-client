import React, { useEffect, useState } from "react";
import { fetchAdminCategories, deleteAdminCategory } from "../../api/admin";
import { Link } from "react-router-dom";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await fetchAdminCategories();
    setCategories(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await deleteAdminCategory(id);
      loadCategories();
    }
  };

  return (
    <div className="container py-3">
      {/* HEADER */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <h3 className="fw-bold mb-2">Manage Categories</h3>

        <Link to="/admin/categories/add" className="btn btn-primary">
          + Add Category
        </Link>
      </div>

      {/* CARD WRAPPER */}
      <div className="card shadow-sm p-3">
        <div className="table-responsive">
          <table className="table table-hover align-middle text-center">
            <thead className="table-light">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Active</th>
                <th>Sort</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-4 fw-bold text-muted">
                    No categories available
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id}>
                    {/* IMAGE */}
                    <td>
                      {cat.image_url ? (
                        <img
                          src={cat.image_url}
                          alt=""
                          className="rounded"
                          style={{
                            width: "55px",
                            height: "55px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span className="text-muted">No Image</span>
                      )}
                    </td>

                    <td className="fw-semibold">{cat.name}</td>

                    <td>
                      {cat.is_active ? (
                        <span className="badge bg-success">Active</span>
                      ) : (
                        <span className="badge bg-secondary">Inactive</span>
                      )}
                    </td>

                    <td>{cat.sort_order}</td>

                    {/* ACTIONS */}
                    <td>
                      <div className="d-flex flex-wrap justify-content-center gap-2">
                        <Link
                          to={`/admin/categories/${cat.id}/edit`}
                          className="btn btn-sm btn-warning"
                        >
                          Edit
                        </Link>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(cat.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageCategories;

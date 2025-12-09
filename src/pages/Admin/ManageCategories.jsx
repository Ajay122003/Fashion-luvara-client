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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Manage Categories</h3>
        <Link to="/admin/categories/add" className="btn btn-primary">
          + Add Category
        </Link>
      </div>

      <div className="table-responsive card p-3 shadow-sm">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Active</th>
              <th>Sort</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td>
                  {cat.image_url ? (
                    <img
                      src={cat.image_url}
                      alt=""
                      width="60"
                      className="rounded"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>

                <td>{cat.name}</td>
                <td>{cat.is_active ? "Yes" : "No"}</td>
                <td>{cat.sort_order}</td>

                <td>
                  <Link
                    to={`/admin/categories/${cat.id}/edit`}
                    className="btn btn-sm btn-warning me-2"
                  >
                    Edit
                  </Link>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(cat.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default ManageCategories;

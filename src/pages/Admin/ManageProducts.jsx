import React, { useEffect, useState } from "react";
import { fetchAdminProducts, deleteAdminProduct } from "../../api/admin";
import { Link } from "react-router-dom";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this product?")) return;
    try {
      await deleteAdminProduct(id);
      load();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Manage Products</h3>
        <Link to="/admin/products/add" className="btn btn-primary btn-sm">
          + Add Product
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Price</th>
                <th>Sale Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th width="150">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, idx) => (
                <tr key={p.id}>
                  <td>{idx + 1}</td>
                  <td>{p.name}</td>
                  <td>₹{p.price}</td>
                  <td>{p.sale_price ? `₹${p.sale_price}` : "-"}</td>
                  <td>{p.stock}</td>
                  <td>
                    {p.is_active ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-secondary">Disabled</span>
                    )}
                  </td>
                  <td>
                    <Link
                      to={`/admin/products/${p.id}/edit`}
                      className="btn btn-sm btn-outline-primary me-2"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      Del
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

export default ManageProducts;

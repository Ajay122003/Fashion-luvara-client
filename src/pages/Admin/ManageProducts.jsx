import React, { useEffect, useState } from "react";
import { getAdminProducts, deleteProduct } from "../../api/products";
import { Link } from "react-router-dom";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const loadProducts = async () => {
    try {
      const data = await getAdminProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Manage Products</h3>

        <Link to="/admin/products/add" className="btn btn-dark">
          + Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search products..."
          className="form-control"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Products Table */}
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th width="150">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No products found.
                </td>
              </tr>
            ) : (
              filtered.map((product, index) => (
                <tr key={product.id}>
                  <td>{index + 1}</td>

                  <td>
                    {product.images?.length > 0 ? (
                      <img
                        src={product.images[0].image_url}
                        alt=""
                        width="50"
                        height="50"
                        style={{ objectFit: "cover", borderRadius: "6px" }}
                      />
                    ) : (
                      <span className="text-muted">No image</span>
                    )}
                  </td>

                  <td>{product.name}</td>
                  <td>{product.category_name}</td>

                  <td>
                    {product.sale_price ? (
                      <>
                        <span className="text-decoration-line-through text-muted me-1">
                          ₹{product.price}
                        </span>
                        <span className="fw-bold text-success">
                          ₹{product.sale_price}
                        </span>
                      </>
                    ) : (
                      <span className="fw-bold">₹{product.price}</span>
                    )}
                  </td>

                  <td>{product.stock}</td>

                  <td>
                    {product.is_active ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-secondary">Disabled</span>
                    )}
                  </td>

                  <td>
                    <div className="d-flex gap-2">
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="btn btn-sm btn-primary"
                      >
                        Edit
                      </Link>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(product.id)}
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
  );
};

export default ManageProducts;

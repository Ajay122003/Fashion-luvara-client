import React, { useEffect, useState } from "react";
import { fetchAdminProducts, deleteAdminProduct } from "../../api/admin";
import { Link } from "react-router-dom";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

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
    if (!window.confirm("Delete this product permanently?")) return;
    try {
      await deleteAdminProduct(id);
      load();
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  // Filter search
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="container-fluid">
      {/* Header Row */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2">
        <h3 className="fw-bold m-0">Manage Products</h3>

        <Link to="/admin/products/add" className="btn btn-primary fw-semibold">
          + Add Product
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Loading */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredProducts.length === 0 ? (
        <p>No matching products found.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="table-responsive d-none d-md-block">
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
                {filteredProducts.map((p, idx) => (
                  <tr key={p.id}>
                    <td>{idx + 1}</td>
                    <td className="fw-semibold">{p.name}</td>
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

          {/* Mobile Card View */}
          <div className="d-md-none">
            {filteredProducts.map((p, idx) => (
              <div key={p.id} className="card shadow-sm mb-3">
                <div className="card-body">
                  <h6 className="fw-bold">{p.name}</h6>
                  <p className="mb-1">
                    <span className="fw-semibold">Price:</span> ₹{p.price}
                  </p>
                  <p className="mb-1">
                    <span className="fw-semibold">Sale:</span>{" "}
                    {p.sale_price ? `₹${p.sale_price}` : "-"}
                  </p>
                  <p className="mb-1">
                    <span className="fw-semibold">Stock:</span> {p.stock}
                  </p>
                  <p className="mb-2">
                    {p.is_active ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-secondary">Disabled</span>
                    )}
                  </p>

                  <div className="d-flex justify-content-end gap-2">
                    <Link
                      to={`/admin/products/${p.id}/edit`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      Edit
                    </Link>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(p.id)}
                    >
                      Del
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageProducts;

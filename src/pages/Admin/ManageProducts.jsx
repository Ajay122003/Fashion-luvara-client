import React, { useEffect, useState } from "react";
import { fetchAdminProducts, deleteAdminProduct } from "../../api/admin";
import { Link } from "react-router-dom";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  /* ---------------- SEARCH (NAME + SKU) ---------------- */
  const filteredProducts = products.filter((p) =>
    `${p.name} ${p.sku || ""}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  /* ---------------- DELETE ---------------- */
  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setShowModal(false);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;

    try {
      await deleteAdminProduct(selectedProduct.id);
      setProducts((prev) =>
        prev.filter((p) => p.id !== selectedProduct.id)
      );
      closeModal();
    } catch {
      alert("Failed to delete product");
    }
  };

  /* ---------------- VARIANT STOCK ---------------- */
  const renderVariantStock = (variants = []) => {
    if (!variants.length) {
      return <span className="text-muted">—</span>;
    }

    return (
      <div className="d-flex flex-wrap gap-1">
        {variants.map((v) => (
          <span
            key={v.id}
            className={`badge ${
              v.stock > 0
                ? "bg-success-subtle text-success"
                : "bg-danger-subtle text-danger"
            }`}
          >
            {v.size}
            {v.color ? ` / ${v.color}` : ""} : {v.stock}
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <p className="text-center py-5 fw-semibold">
        Loading Products…
      </p>
    );
  }

  return (
    <div className="container-fluid py-4">

      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3">
        <h4 className="fw-semibold mb-0">Manage Products</h4>

        <Link to="/admin/products/add" className="btn btn-dark">
          + Add Product
        </Link>
      </div>

      {/* SEARCH */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name or SKU..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="card shadow-sm border-0 d-none d-md-block">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Sale</th>
                <th>Stock</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p, idx) => (
                  <tr key={p.id}>
                    <td>{idx + 1}</td>

                    <td className="fw-medium">{p.name}</td>

                    <td>
                      <span className="badge bg-light text-dark border">
                        {p.sku || "—"}
                      </span>
                    </td>

                    <td>₹{p.price}</td>

                    <td>{p.sale_price ? `₹${p.sale_price}` : "—"}</td>

                    <td>{renderVariantStock(p.variants)}</td>

                    <td>
                      {p.is_active ? (
                        <span className="badge bg-success-subtle text-success">
                          Active
                        </span>
                      ) : (
                        <span className="badge bg-secondary-subtle text-secondary">
                          Disabled
                        </span>
                      )}
                    </td>

                    <td className="text-end">
                      <Link
                        to={`/admin/products/${p.id}/edit`}
                        className="btn btn-sm btn-outline-primary me-2"
                      >
                        <i className="bi bi-pencil"></i>
                      </Link>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => openDeleteModal(p)}
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
      <div className="d-md-none">
        {filteredProducts.map((p) => (
          <div key={p.id} className="card shadow-sm border-0 mb-3">
            <div className="card-body">
              <h6 className="fw-semibold mb-1">{p.name}</h6>

              <div className="mb-1">
                {" "}
                <span className="badge bg-light text-dark border">
                  {p.sku || "—"}
                </span>
              </div>

              <div className="mb-1">
                <strong>Price:</strong> ₹{p.price}
              </div>

              <div className="mb-1">
                <strong>Sale:</strong>{" "}
                {p.sale_price ? `₹${p.sale_price}` : "—"}
              </div>

              <div className="mb-2">
                <strong>Stock:</strong>
                <div className="mt-1">
                  {renderVariantStock(p.variants)}
                </div>
              </div>

              <div className="mb-2">
                {p.is_active ? (
                  <span className="badge bg-success-subtle text-success">
                    Active
                  </span>
                ) : (
                  <span className="badge bg-secondary-subtle text-secondary">
                    Disabled
                  </span>
                )}
              </div>

              <div className="d-flex justify-content-end gap-2">
                <Link
                  to={`/admin/products/${p.id}/edit`}
                  className="btn btn-sm btn-outline-primary"
                >
                  <i className="bi bi-pencil"></i>
                </Link>

                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => openDeleteModal(p)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
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
                <h5 className="modal-title">Delete Product</h5>
                <button className="btn-close" onClick={closeModal} />
              </div>

              <div className="modal-body">
                <p className="mb-1">
                  Delete <strong>{selectedProduct?.name}</strong>?
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

export default ManageProducts;

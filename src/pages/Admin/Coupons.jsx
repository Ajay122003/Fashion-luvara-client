import React, { useEffect, useState } from "react";
import { fetchAdminCoupons, deleteAdminCoupon } from "../../api/admin";
import { Link } from "react-router-dom";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const data = await fetchAdminCoupons();
      setCoupons(data);
    } catch (err) {
      alert("Failed to load coupons");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;

    try {
      await deleteAdminCoupon(id);
      loadCoupons();
    } catch (err) {
      alert("Failed to delete coupon");
    }
  };

  return (
    <div className="container py-3">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">Manage Coupons</h3>
        <Link to="/admin/coupons/add" className="btn btn-primary btn-sm">
          + Add Coupon
        </Link>
      </div>

      {/* CARD WRAPPER */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          {/* TABLE RESPONSIVE WRAPPER */}
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Code</th>
                  <th>Type</th>
                  <th>Value</th>
                  <th>Min Purchase</th>
                  <th>Expiry</th>
                  <th>Active</th>
                  <th style={{ minWidth: "140px" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {coupons.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      No coupons available.
                    </td>
                  </tr>
                ) : (
                  coupons.map((c) => (
                    <tr key={c.id}>
                      <td className="fw-bold">{c.code}</td>
                      <td>
                        {c.discount_type === "PERCENT" ? "Percentage" : "Flat"}
                      </td>
                      <td>
                        {c.discount_type === "PERCENT"
                          ? `${c.discount_value}%`
                          : `₹${c.discount_value}`}
                      </td>
                      <td>₹{c.min_purchase}</td>
                      <td>{new Date(c.expiry_date).toLocaleString()}</td>

                      <td>
                        {c.is_active ? (
                          <span className="badge bg-success">Active</span>
                        ) : (
                          <span className="badge bg-danger">Inactive</span>
                        )}
                      </td>

                      <td>
                        <div className="d-flex gap-2 flex-wrap">
                          <Link
                            to={`/admin/coupons/${c.id}/edit`}
                            className="btn btn-sm btn-warning"
                          >
                            Edit
                          </Link>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(c.id)}
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

      {/* MOBILE FRIENDLY SPACING */}
      <style>{`
        @media (max-width: 576px) {
          h3 {
            font-size: 1.3rem;
          }
          .btn-sm {
            padding: 6px 10px;
            font-size: 0.8rem;
          }
          table td, table th {
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  );
};

export default Coupons;


import React, { useEffect, useState } from "react";
import {
  fetchAdminCoupons,
  deleteAdminCoupon,
  updateAdminCoupon,
} from "../../api/admin";
import { Link } from "react-router-dom";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const data = await fetchAdminCoupons();
      setCoupons(data);
    } catch {
      alert("Failed to load coupons");
    }
  };

  /* ================= STATUS BADGE ================= */
  const renderStatusBadge = (coupon) => {
    const now = new Date();
    const expiry = new Date(coupon.expiry_date);

    if (!coupon.is_active) {
      return (
        <span className="badge bg-secondary">
          DISABLED
        </span>
      );
    }

    if (expiry < now) {
      return (
        <span className="badge bg-danger">
          EXPIRED
        </span>
      );
    }

    return (
      <span className="badge bg-success">
        ACTIVE
      </span>
    );
  };

  /* ================= TOGGLE ACTIVE ================= */
  const toggleActive = async (coupon) => {
    setLoadingId(coupon.id);
    try {
      await updateAdminCoupon(coupon.id, {
        is_active: !coupon.is_active,
      });

      setCoupons((prev) =>
        prev.map((c) =>
          c.id === coupon.id
            ? { ...c, is_active: !c.is_active }
            : c
        )
      );
    } catch {
      alert("Failed to update coupon status");
    } finally {
      setLoadingId(null);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;

    try {
      await deleteAdminCoupon(id);
      loadCoupons();
    } catch {
      alert("Failed to delete coupon");
    }
  };

  return (
    <div className="container py-3">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">Manage Coupons</h3>
        <Link
          to="/admin/coupons/add"
          className="btn btn-primary btn-sm"
        >
          + Add Coupon
        </Link>
      </div>

      {/* TABLE CARD */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Code</th>
                  <th>Type</th>
                  <th>Value</th>
                  <th>Min Purchase</th>
                  <th>Expiry</th>
                  <th>Status</th>
                  <th style={{ minWidth: "170px" }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {coupons.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-4 text-muted"
                    >
                      No coupons available.
                    </td>
                  </tr>
                ) : (
                  coupons.map((c) => (
                    <tr key={c.id}>
                      <td className="fw-bold">
                        {c.code}
                      </td>

                      <td>
                        {c.discount_type === "PERCENT"
                          ? "Percentage"
                          : "Flat"}
                      </td>

                      <td>
                        {c.discount_type === "PERCENT"
                          ? `${c.discount_value}%`
                          : `₹${c.discount_value}`}
                      </td>

                      <td>₹{c.min_purchase}</td>

                      <td>
                        {new Date(
                          c.expiry_date
                        ).toLocaleString()}
                      </td>

                      <td>{renderStatusBadge(c)}</td>

                      <td>
                        <div className="d-flex gap-2 flex-wrap">
                          <Link
                            to={`/admin/coupons/${c.id}/edit`}
                            className="btn btn-sm btn-warning"
                          >
                            Edit
                          </Link>

                          <button
                            className={`btn btn-sm ${
                              c.is_active
                                ? "btn-outline-secondary"
                                : "btn-outline-success"
                            }`}
                            disabled={loadingId === c.id}
                            onClick={() =>
                              toggleActive(c)
                            }
                          >
                            {loadingId === c.id
                              ? "Updating..."
                              : c.is_active
                              ? "Disable"
                              : "Enable"}
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              handleDelete(c.id)
                            }
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

      {/* MOBILE FIX */}
      <style>{`
        @media (max-width: 576px) {
          h3 {
            font-size: 1.3rem;
          }
          table td,
          table th {
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  );
};

export default Coupons;

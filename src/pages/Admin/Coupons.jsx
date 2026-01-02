import React, { useEffect, useState } from "react";
import {
  fetchAdminCoupons,
  deleteAdminCoupon,
  updateAdminCoupon,
} from "../../api/admin";
import { Link } from "react-router-dom";

/* ================= STATUS BADGE ================= */
const getStatus = (coupon) => {
  const now = new Date();
  const expiry = new Date(coupon.expiry_date);

  if (!coupon.is_active) return "DISABLED";
  if (expiry < now) return "EXPIRED";
  return "ACTIVE";
};

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const data = await fetchAdminCoupons();
      setCoupons(data || []);
    } catch {
      alert("Failed to load coupons");
    }
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
    <div className="container-fluid py-3">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">Manage Coupons</h3>
        <Link
          to="/admin/coupons/add"
          className="btn btn-dark"
        >
          + Add Coupon
        </Link>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="table-responsive d-none d-md-block">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Value</th>
              <th>Min Purchase</th>
              <th>Expiry</th>
              <th>Status</th>
              <th style={{ width: 170 }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {coupons.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center">
                  No coupons found
                </td>
              </tr>
            )}

            {coupons.map((c) => {
              const status = getStatus(c);

              return (
                <tr key={c.id}>
                  <td className="fw-bold">{c.code}</td>

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
                    {new Date(c.expiry_date).toLocaleDateString()}
                  </td>

                  <td>
                    {status === "ACTIVE" && (
                      <span className="badge bg-success">
                        Active
                      </span>
                    )}
                    {status === "EXPIRED" && (
                      <span className="badge bg-danger">
                        Expired
                      </span>
                    )}
                    {status === "DISABLED" && (
                      <span className="badge bg-secondary">
                        Disabled
                      </span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <Link
                      to={`/admin/coupons/${c.id}/edit`}
                      className="btn btn-sm btn-outline-primary me-2"
                      title="Edit"
                    >
                      <i className="bi bi-pencil"></i>
                    </Link>

                    <button
                      className={`btn btn-sm me-2 ${
                        c.is_active
                          ? "btn-outline-secondary"
                          : "btn-outline-success"
                      }`}
                      disabled={loadingId === c.id}
                      onClick={() => toggleActive(c)}
                      title={
                        c.is_active ? "Disable" : "Enable"
                      }
                    >
                      {loadingId === c.id ? (
                        <span className="spinner-border spinner-border-sm" />
                      ) : (
                        <i
                          className={`bi ${
                            c.is_active
                              ? "bi-pause"
                              : "bi-play"
                          }`}
                        ></i>
                      )}
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(c.id)}
                      title="Delete"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARD VIEW ================= */}
      <div className="d-block d-md-none">
        {coupons.length === 0 && (
          <p className="text-center text-muted">
            No coupons found
          </p>
        )}

        {coupons.map((c) => {
          const status = getStatus(c);

          return (
            <div key={c.id} className="card shadow-sm mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h6 className="fw-bold">{c.code}</h6>
                  {status === "ACTIVE" && (
                    <span className="badge bg-success">
                      Active
                    </span>
                  )}
                  {status === "EXPIRED" && (
                    <span className="badge bg-danger">
                      Expired
                    </span>
                  )}
                  {status === "DISABLED" && (
                    <span className="badge bg-secondary">
                      Disabled
                    </span>
                  )}
                </div>

                <p className="mb-1">
                  <strong>Discount:</strong>{" "}
                  {c.discount_type === "PERCENT"
                    ? `${c.discount_value}%`
                    : `₹${c.discount_value}`}
                </p>

                <p className="mb-1">
                  <strong>Min Purchase:</strong> ₹
                  {c.min_purchase}
                </p>

                <p className="text-muted mb-2">
                  Expiry:{" "}
                  {new Date(c.expiry_date).toLocaleDateString()}
                </p>

                <div className="d-flex gap-2">
                  <Link
                    to={`/admin/coupons/${c.id}/edit`}
                    className="btn btn-sm btn-outline-primary"
                  >
                    <i className="bi bi-pencil"></i>
                  </Link>

                  <button
                    className={`btn btn-sm ${
                      c.is_active
                        ? "btn-outline-secondary"
                        : "btn-outline-success"
                    }`}
                    disabled={loadingId === c.id}
                    onClick={() => toggleActive(c)}
                  >
                    <i
                      className={`bi ${
                        c.is_active
                          ? "bi-pause"
                          : "bi-play"
                      }`}
                    ></i>
                  </button>

                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(c.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Coupons;

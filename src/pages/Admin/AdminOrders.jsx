import React, { useEffect, useState } from "react";
import { fetchAdminOrders } from "../../api/admin";
import { Link } from "react-router-dom";

const STATUS_LIST = [
  { key: "", label: "All", color: "dark" },
  { key: "PENDING", label: "Pending", color: "warning" },
  { key: "SHIPPED", label: "Shipped", color: "info" },
  { key: "DELIVERED", label: "Delivered", color: "success" },
  { key: "CANCELLED", label: "Cancelled", color: "danger" },
];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminOrders(filter);
      setOrders(data);
    } catch {
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [filter]);

  // ---------- STATUS COUNTS ----------
  const getCount = (status) => {
    if (!status) return orders.length;
    return orders.filter((o) => o.status === status).length;
  };

  return (
    <div className="container-fluid py-3">

      {/* ================= HEADER ================= */}
      <div className="mb-3">
        <h3 className="fw-bold mb-1">Orders</h3>
        <small className="text-muted">
          Manage and track customer orders
        </small>
      </div>

      {/* ================= STATUS FILTER WITH COUNT ================= */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {STATUS_LIST.map((s) => (
          <button
            key={s.key}
            onClick={() => setFilter(s.key)}
            className={`btn btn-sm ${
              filter === s.key
                ? `btn-${s.color}`
                : "btn-outline-secondary"
            }`}
          >
            {s.label}{" "}
            <span className="badge bg-light text-dark ms-1">
              {getCount(s.key)}
            </span>
          </button>
        ))}
      </div>

      {/* ================= LOADING ================= */}
      {loading ? (
        <p className="text-center">Loading orders…</p>
      ) : (
        <>
          {/* ================= DESKTOP TABLE ================= */}
          <div className="table-responsive d-none d-md-block">
            <table className="table table-hover align-middle border">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Order No</th>
                  <th>User</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={o.id}>
                    <td>{i + 1}</td>
                    <td className="fw-semibold">{o.order_number}</td>
                    <td>{o.user_email}</td>
                    <td className="fw-bold">₹{o.total_amount}</td>

                    <td>
                      <span
                        className={`badge ${
                          o.payment_status === "PAID"
                            ? "bg-success"
                            : o.payment_status === "COD"
                            ? "bg-info"
                            : "bg-warning"
                        }`}
                      >
                        {o.payment_status}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          o.status === "DELIVERED"
                            ? "bg-success"
                            : o.status === "PENDING"
                            ? "bg-warning"
                            : o.status === "SHIPPED"
                            ? "bg-info"
                            : "bg-secondary"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>

                    <td>
                      {new Date(o.created_at).toLocaleDateString()}
                    </td>

                    <td className="text-end">
                      <Link
                        to={`/admin/orders/${o.id}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= MOBILE CARD VIEW ================= */}
          <div className="d-md-none">
            {orders.map((o) => (
              <div key={o.id} className="card shadow-sm mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h6 className="fw-bold">{o.order_number}</h6>
                    <span
                      className={`badge ${
                        o.status === "DELIVERED"
                          ? "bg-success"
                          : o.status === "PENDING"
                          ? "bg-warning"
                          : o.status === "SHIPPED"
                          ? "bg-info"
                          : "bg-secondary"
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>

                  <p className="mb-1">
                    <b>User:</b> {o.user_email}
                  </p>

                  <p className="mb-1">
                    <b>Total:</b> ₹{o.total_amount}
                  </p>

                  <p className="mb-1">
                    <b>Payment:</b>{" "}
                    <span className="fw-semibold">
                      {o.payment_status}
                    </span>
                  </p>

                  <p className="mb-2">
                    <b>Date:</b>{" "}
                    {new Date(o.created_at).toLocaleDateString()}
                  </p>

                  <Link
                    to={`/admin/orders/${o.id}`}
                    className="btn btn-sm btn-primary w-100"
                  >
                    View Order
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;


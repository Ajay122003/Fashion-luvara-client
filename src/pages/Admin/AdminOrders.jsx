import React, { useEffect, useState } from "react";
import { fetchAdminOrders, deleteAdminOrder } from "../../api/admin";
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
  const [search, setSearch] = useState("");
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

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      await deleteAdminOrder(id);
      alert("Order deleted");
      loadOrders();
    } catch {
      alert("Delete failed");
    }
  };

  const filteredOrders = orders.filter((o) =>
    o.order_number.toLowerCase().includes(search.toLowerCase())
  );

  const getCount = (status) => {
    if (!status) return orders.length;
    return orders.filter((o) => o.status === status).length;
  };

  return (
    <div className="container-fluid py-3">
      {/* HEADER */}
      <div className="mb-3">
        <h3 className="fw-bold mb-1">Orders</h3>
        <small className="text-muted">
          Search & manage customer orders
        </small>
      </div>

      {/* SEARCH */}
      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Search by order number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* STATUS FILTER */}
      <div className="status-scroll mb-3">
        {STATUS_LIST.map((s) => (
          <button
            key={s.key}
            onClick={() => setFilter(s.key)}
            className={`btn btn-sm me-2 ${
              filter === s.key
                ? `btn-${s.color}`
                : "btn-outline-secondary"
            }`}
          >
            {s.label}
            <span className="badge bg-light text-dark ms-1">
              {getCount(s.key)}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center">Loading orders…</p>
      ) : (
        <>
          {/* ================= DESKTOP TABLE ================= */}
          <div className="table-scroll d-none d-md-block">
            <table className="table table-hover align-middle mb-0">
              <thead>
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
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center text-muted">
                      No orders found
                    </td>
                  </tr>
                )}

                {filteredOrders.map((o, i) => (
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
                        className="btn btn-sm btn-outline-dark me-2"
                      >
                        View
                      </Link>

                      {o.can_delete && (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(o.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= MOBILE CARD VIEW ================= */}
          <div className="d-md-none">
            {filteredOrders.map((o) => (
              <div key={o.id} className="order-card mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="fw-bold mb-0">{o.order_number}</h6>
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

                <div className="small text-muted mt-1">
                  {o.user_email}
                </div>

                <div className="d-flex justify-content-between mt-2">
                  <span>Total</span>
                  <strong>₹{o.total_amount}</strong>
                </div>

                <div className="d-flex justify-content-between">
                  <span>Payment</span>
                  <span>{o.payment_status}</span>
                </div>

                <div className="text-muted small mt-1">
                  {new Date(o.created_at).toLocaleDateString()}
                </div>

                <div className="d-flex gap-2 mt-3">
                  <Link
                    to={`/admin/orders/${o.id}`}
                    className="btn btn-sm btn-dark flex-fill"
                  >
                    View
                  </Link>

                  {o.can_delete && (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(o.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* STYLES */}
      <style>{`
        .status-scroll {
          display: flex;
          overflow-x: auto;
        }

        .table-scroll {
          max-height: 65vh;
          overflow-y: auto;
          border: 1px solid #eee;
          border-radius: 12px;
        }

        table thead th {
          position: sticky;
          top: 0;
          background: #f8f9fa;
          z-index: 1;
        }

        .order-card {
          border: 1px solid #eee;
          border-radius: 14px;
          padding: 14px;
          background: #fff;
          box-shadow: 0 6px 14px rgba(0,0,0,0.05);
        }
      `}</style>
    </div>
  );
};

export default Orders;

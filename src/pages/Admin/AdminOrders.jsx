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
  const [search, setSearch] = useState(""); // 🔍 search
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

  /* ================= FILTER + SEARCH ================= */
  const filteredOrders = orders.filter((o) =>
    o.order_number
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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
          Search & manage customer orders
        </small>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder=" Search by order number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ================= STATUS FILTER ================= */}
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

      {/* ================= CONTENT ================= */}
      {loading ? (
        <p className="text-center">Loading orders…</p>
      ) : (
        <>
          {/* ================= DESKTOP ================= */}
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
                    <td className="fw-semibold">
                      {o.order_number}
                    </td>
                    <td>{o.user_email}</td>
                    <td className="fw-bold">
                      ₹{o.total_amount}
                    </td>

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
                      {new Date(
                        o.created_at
                      ).toLocaleDateString()}
                    </td>

                    <td className="text-end">
                      <Link
                        to={`/admin/orders/${o.id}`}
                        className="btn btn-sm btn-outline-dark"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= MOBILE ================= */}
          <div className="d-md-none">
            {filteredOrders.map((o) => (
              <div key={o.id} className="order-card mb-3">
                <div className="d-flex justify-content-between">
                  <h6 className="fw-bold">
                    {o.order_number}
                  </h6>
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

                <p className="small mb-1">
                  <b>User:</b> {o.user_email}
                </p>
                <p className="small mb-1">
                  <b>Total:</b> ₹{o.total_amount}
                </p>
                <p className="small mb-1">
                  <b>Payment:</b>{" "}
                  {o.payment_status}
                </p>

                <p className="small text-muted">
                  {new Date(
                    o.created_at
                  ).toLocaleDateString()}
                </p>

                <Link
                  to={`/admin/orders/${o.id}`}
                  className="btn btn-sm btn-dark w-100"
                >
                  View Order
                </Link>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ================= STYLES ================= */}
      <style>{`
        .status-scroll {
          display: flex;
          overflow-x: auto;
          padding-bottom: 6px;
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
          border-radius: 12px;
          padding: 12px;
          background: #fff;
          box-shadow: 0 4px 10px rgba(0,0,0,0.04);
        }
      `}</style>
    </div>
  );
};

export default Orders;




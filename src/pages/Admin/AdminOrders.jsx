import React, { useEffect, useState } from "react";
import { fetchAdminOrders } from "../../api/admin";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminOrders(filter);
      setOrders(data);
    } catch (err) {
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [filter]);

  return (
    <div className="container-fluid">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2">
        <h3 className="fw-bold m-0">Orders</h3>

        {/* STATUS FILTER */}
        <select
          className="form-select w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All Orders</option>
          <option value="PENDING">Pending</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* LOADING */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="table-responsive d-none d-md-block">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Order No.</th>
                  <th>User</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={o.id}>
                    <td>{i + 1}</td>
                    <td className="fw-bold">{o.order_number}</td>
                    <td>{o.user_email}</td>
                    <td>₹{o.total_amount}</td>
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
                      <span className="badge bg-dark">{o.status}</span>
                    </td>

                    <td>{new Date(o.created_at).toLocaleDateString()}</td>

                    <td>
                      <Link
                        to={`/admin/orders/${o.id}`}
                        className="btn btn-sm btn-primary"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD VIEW */}
          <div className="d-md-none">
            {orders.map((o) => (
              <div key={o.id} className="card shadow-sm mb-3">
                <div className="card-body">
                  <h6 className="fw-bold mb-1">{o.order_number}</h6>

                  <p className="mb-1">
                    <b>User:</b> {o.user_email}
                  </p>
                  <p className="mb-1">
                    <b>Total:</b> ₹{o.total_amount}
                  </p>

                  <p className="mb-1">
                    <b>Payment:</b> {o.payment_status}
                  </p>

                  <p className="mb-1">
                    <b>Status:</b>{" "}
                    <span className="badge bg-dark">{o.status}</span>
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

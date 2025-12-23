// src/pages/orders/Orders.jsx
import { useEffect, useState } from "react";
import { getMyOrders } from "../../api/order";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getMyOrders(); // ✅ already array
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login", { replace: true });
      } else {
        alert("Failed to load orders");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center py-5">Loading orders...</p>;
  }

  return (
    <div className="container py-4" style={{ maxWidth: 900 }}>
      <h3 className="mb-4">My Orders</h3>

      {orders.length === 0 && (
        <p className="text-muted">You haven’t placed any orders yet.</p>
      )}

      {orders.map((order) => (
        <div
          key={order.id}
          className="card shadow-sm mb-3"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(`/orders/${order.id}`)}
        >
          <div className="card-body d-flex justify-content-between flex-wrap">
            <div>
              <h6 className="mb-1">
                Order #{order.order_number || order.id}
              </h6>
              <small className="text-muted">
                {new Date(order.created_at).toLocaleDateString()}
              </small>
            </div>

            <div className="text-end">
              <span className="fw-bold">₹{order.total_amount}</span>
              <br />
              <span
                className={`badge ${
                  order.status === "DELIVERED"
                    ? "bg-success"
                    : "bg-warning text-dark"
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;

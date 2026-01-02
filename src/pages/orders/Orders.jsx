import { useEffect, useState } from "react";
import { getMyOrders } from "../../api/order";
import { useNavigate } from "react-router-dom";

/* ================= STATUS COLOR HELPER ================= */
const getStatusClass = (status) => {
  switch (status) {
    case "DELIVERED":
      return "bg-success";
    case "CANCELLED":
      return "bg-danger";
    case "SHIPPED":
    case "OUT_FOR_DELIVERY":
      return "bg-primary";
    case "PROCESSING":
    case "PACKED":
      return "bg-info text-dark";
    default:
      return "bg-warning text-dark";
  }
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getMyOrders(); // ✅ backend returns array
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

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <p className="text-center py-5 fw-semibold">
        Loading orders…
      </p>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 900 }}>
      <h3 className="mb-4 fw-bold">My Orders</h3>

      {orders.length === 0 && (
        <p className="text-muted">
          You haven’t placed any orders yet.
        </p>
      )}

      {orders.map((order) => (
        <div
          key={order.id}
          className="card shadow-sm mb-3"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(`/orders/${order.id}`)}
        >
          <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-2">
            {/* LEFT */}
            <div>
              <h6 className="mb-1 fw-semibold">
                Order #{order.order_number || order.id}
              </h6>

              <small className="text-muted">
                {new Date(order.created_at).toLocaleDateString()}
              </small>
            </div>

            {/* RIGHT */}
            <div className="text-end">
              <div className="fw-bold mb-1">
                ₹{Number(order.total_amount).toFixed(2)}
              </div>

              <span
                className={`badge ${getStatusClass(order.status)}`}
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

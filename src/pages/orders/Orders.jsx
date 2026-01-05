import { useEffect, useState } from "react";
import { getMyOrders } from "../../api/order";
import { useNavigate } from "react-router-dom";

/* ================= STATUS CONFIG ================= */
const STATUS_META = {
  PENDING: { label: "Pending", color: "warning", icon: "bi-hourglass-split" },
  PROCESSING: { label: "Processing", color: "info", icon: "bi-gear" },
  PACKED: { label: "Packed", color: "info", icon: "bi-box-seam" },
  SHIPPED: { label: "Shipped", color: "primary", icon: "bi-truck" },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    color: "primary",
    icon: "bi-bicycle",
  },
  DELIVERED: { label: "Delivered", color: "success", icon: "bi-check-circle" },
  CANCELLED: { label: "Cancelled", color: "danger", icon: "bi-x-circle" },
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
      const data = await getMyOrders();
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
      <div className="text-center py-5">
        <div className="spinner-border text-dark"></div>
        <p className="mt-3 fw-semibold">Loading your orders…</p>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 950 }}>
      <h3 className="mb-4 fw-bold">
        <i className="bi bi-bag-check me-2"></i>
        My Orders
      </h3>

      {orders.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-cart-x fs-1 text-muted"></i>
          <p className="mt-3 text-muted">
            You haven’t placed any orders yet.
          </p>
          <button
            className="btn btn-dark mt-2"
            onClick={() => navigate("/")}
          >
            Start Shopping
          </button>
        </div>
      )}

      {orders.map((order) => {
        const meta = STATUS_META[order.status] || STATUS_META.PENDING;

        return (
          <div
            key={order.id}
            className="card shadow-sm mb-3 order-card"
            onClick={() => navigate(`/orders/${order.id}`)}
            style={{ cursor: "pointer" }}
          >
            <div className="card-body">
              <div className="row align-items-center g-3">
                {/* LEFT */}
                <div className="col-md-6">
                  <h6 className="fw-bold mb-1">
                    Order #{order.order_number || order.id}
                  </h6>

                  <small className="text-muted">
                    <i className="bi bi-calendar-event me-1"></i>
                    {new Date(order.created_at).toLocaleDateString()}
                  </small>
                </div>

                {/* CENTER */}
                <div className="col-md-3">
                  <span
                    className={`badge bg-${meta.color} d-inline-flex align-items-center gap-1 px-3 py-2`}
                  >
                    <i className={`bi ${meta.icon}`}></i>
                    {meta.label}
                  </span>
                </div>

                {/* RIGHT */}
                <div className="col-md-3 text-md-end">
                  <div className="fw-bold fs-6">
                    ₹{Number(order.total_amount).toFixed(2)}
                  </div>

                  <small className="text-muted">
                    <i className="bi bi-chevron-right"></i>
                    View Details
                  </small>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* ================= EXTRA CSS ================= */}
      <style>{`
        .order-card {
          border-radius: 14px;
          transition: transform .25s ease, box-shadow .25s ease;
        }

        .order-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 18px rgba(0,0,0,0.12);
        }

        @media (max-width: 576px) {
          .order-card .text-md-end {
            text-align: left !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Orders;

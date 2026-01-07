import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderDetail } from "../../api/order";

/* ================= STATUS FLOW ================= */
const STATUS_FLOW = [
  { key: "PENDING", label: "Pending", icon: "bi-hourglass" },
  { key: "PROCESSING", label: "Processing", icon: "bi-gear" },
  { key: "PACKED", label: "Packed", icon: "bi-box-seam" },
  { key: "SHIPPED", label: "Shipped", icon: "bi-truck" },
  {
    key: "OUT_FOR_DELIVERY",
    label: "Out for Delivery",
    icon: "bi-bicycle",
  },
  { key: "DELIVERED", label: "Delivered", icon: "bi-check-circle" },
];

const getStatusBadge = (status) => {
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

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line
  }, []);

  const loadOrder = async () => {
    try {
      const res = await getOrderDetail(id);
      setOrder(res.data);
    } catch {
      alert("Failed to load order details");
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-dark"></div>
        <p className="mt-3 fw-semibold">Loading order details…</p>
      </div>
    );
  }

  if (!order) {
    return <p className="text-center py-5">Order not found</p>;
  }

  const currentIndex = STATUS_FLOW.findIndex(
    (s) => s.key === order.status
  );

  return (
    <div className="container py-4" style={{ maxWidth: 900 }}>
      {/* ================= HEADER ================= */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">
        <h4 className="fw-bold mb-0">
          Order id : {order.order_number}
        </h4>

        <span className={`badge fs-6 ${getStatusBadge(order.status)}`}>
          {order.status.replaceAll("_", " ")}
        </span>
      </div>

      {/* ================= STATUS TIMELINE ================= */}
      {order.status !== "CANCELLED" && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h6 className="fw-semibold mb-3">Order Status</h6>

            <div className="d-flex justify-content-between flex-wrap gap-3">
              {STATUS_FLOW.map((step, index) => {
                const active = index <= currentIndex;

                return (
                  <div key={step.key} className="text-center flex-fill">
                    <div
                      className={`rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center ${
                        active ? "bg-success" : "bg-secondary"
                      }`}
                      style={{ width: 36, height: 36 }}
                    >
                      <i
                        className={`bi ${step.icon} text-white`}
                      ></i>
                    </div>
                    <small
                      className={
                        active ? "fw-bold" : "text-muted"
                      }
                    >
                      {step.label}
                    </small>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= DELIVERY ADDRESS ================= */}
      {order.address && (
        <div className="card shadow-sm mb-3">
          <div className="card-body">
            <h6 className="fw-semibold mb-2">
              <i className="bi bi-geo-alt me-2"></i>
              Delivery Address
            </h6>

            <p className="mb-1 fw-semibold">
              {order.address.name} – {order.address.phone}
            </p>

            <small className="text-muted">
              {order.address.full_address}, {order.address.city} –{" "}
              {order.address.pincode}
            </small>
          </div>
        </div>
      )}

      {/* ================= SHIPPING ================= */}
      {(order.courier_name || order.tracking_id) && (
        <div className="card shadow-sm mb-3">
          <div className="card-body">
            <h6 className="fw-semibold mb-2">
              <i className="bi bi-truck me-2"></i>
              Shipping Details
            </h6>

            {order.courier_name && (
              <p className="mb-1">
                <strong>Courier:</strong> {order.courier_name}
              </p>
            )}

            {order.tracking_id && (
              <p className="mb-0">
                <strong>Tracking ID:</strong> {order.tracking_id}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ================= ORDER ITEMS ================= */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <h6 className="fw-semibold mb-3">
            <i className="bi bi-bag me-2"></i>
            Ordered Items
          </h6>

          {order.items?.map((item, index) => {
            const unit = Number(item.unit_price || 0);
            const qty = Number(item.quantity || 1);
            const total = Number(item.total_price || unit * qty);

            return (
              <div
                key={item.id || index}
                className="d-flex gap-3 border-bottom py-3"
              >
                {item.product?.images?.length > 0 && (
                  <img
                    src={item.product.images[0].image_url}
                    alt={item.product.name}
                    className="rounded"
                    style={{ width: 70, height: 70, objectFit: "cover" }}
                  />
                )}

                <div className="flex-grow-1">
                  <p className="fw-bold mb-1">
                    {item.product?.name}
                  </p>

                  <small className="text-muted">
                    Qty: {qty}
                    {item.size && <> | Size: {item.size}</>}
                    {item.color && <> | Color: {item.color}</>}
                  </small>

                  <p className="mb-0 mt-1">
                    ₹{unit.toFixed(2)} × {qty} ={" "}
                    <strong>₹{total.toFixed(2)}</strong>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= PAYMENT SUMMARY ================= */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-2">
            <span>Payment Status</span>
            <strong>{order.payment_status}</strong>
          </div>

          <hr />

          <div className="d-flex justify-content-between fs-5 fw-bold">
            <span>Total Paid</span>
            <span>₹{Number(order.total_amount).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button
        className="btn btn-outline-dark mt-4"
        onClick={() => navigate("/orders")}
      >
        ← Back to Orders
      </button>
    </div>
  );
};

export default OrderDetail;

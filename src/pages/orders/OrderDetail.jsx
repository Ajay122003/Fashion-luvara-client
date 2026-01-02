import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderDetail } from "../../api/order";

/* ================= STATUS FLOW ================= */
const STATUS_FLOW = [
  "PENDING",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

/* ================= STATUS COLOR ================= */
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
      <p className="text-center py-5 fw-semibold">
        Loading order…
      </p>
    );
  }

  if (!order) {
    return (
      <p className="text-center py-5">
        Order not found
      </p>
    );
  }

  const currentIndex = STATUS_FLOW.indexOf(order.status);

  return (
    <div className="container py-4" style={{ maxWidth: 900 }}>

      {/* ================= HEADER ================= */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
        <h4 className="fw-bold mb-0">
          Order #{order.order_number}
        </h4>

        <span
          className={`badge fs-6 align-self-start ${getStatusClass(order.status)}`}
        >
          {order.status}
        </span>
      </div>

      {/* ================= ORDER TIMELINE ================= */}
      {order.status !== "CANCELLED" && (
        <div className="card shadow-sm mb-3">
          <div className="card-body">
            <h6 className="fw-semibold mb-3">
              Order Status
            </h6>

            <div
              className="d-flex gap-3 overflow-auto"
              style={{ scrollbarWidth: "thin" }}
            >
              {STATUS_FLOW.map((step, index) => (
                <div
                  key={step}
                  className="text-center"
                  style={{ minWidth: 80 }}
                >
                  <div
                    className={`mx-auto mb-2 rounded-circle ${
                      index <= currentIndex
                        ? "bg-success"
                        : "bg-secondary"
                    }`}
                    style={{ width: 14, height: 14 }}
                  />
                  <small
                    className={
                      index <= currentIndex
                        ? "fw-bold"
                        : "text-muted"
                    }
                  >
                    {step.replaceAll("_", " ")}
                  </small>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= ADDRESS ================= */}
      {order.address && (
        <div className="card shadow-sm mb-3">
          <div className="card-body">
            <h6 className="fw-semibold mb-2">
              Delivery Address
            </h6>

            <p className="mb-0">
              <strong>{order.address.name}</strong> –{" "}
              {order.address.phone}
            </p>

            <small className="text-muted">
              {order.address.full_address},{" "}
              {order.address.city} –{" "}
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
              Shipping Details
            </h6>

            {order.courier_name && (
              <p className="mb-1">
                <strong>Courier:</strong>{" "}
                {order.courier_name}
              </p>
            )}

            {order.tracking_id && (
              <p className="mb-0">
                <strong>Tracking ID:</strong>{" "}
                {order.tracking_id}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ================= ITEMS ================= */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <h6 className="mb-3 fw-semibold">
            Ordered Items
          </h6>

          {order.items?.map((item, index) => {
            const unitPrice = Number(item.unit_price || 0);
            const qty = Number(item.quantity || 1);
            const total =
              Number(item.total_price) ||
              unitPrice * qty;

            return (
              <div
                key={item.id || index}
                className="border-bottom py-3 d-flex flex-column flex-sm-row gap-3"
              >
                {item.product?.images?.length > 0 && (
                  <img
                    src={item.product.images[0].image_url}
                    alt={item.product.name}
                    className="rounded"
                    style={{
                      width: 70,
                      height: 70,
                      objectFit: "cover",
                    }}
                  />
                )}

                <div className="flex-grow-1">
                  <p className="fw-bold mb-1">
                    {item.product?.name}
                  </p>

                  <p className="small mb-1 text-muted">
                    Qty: {qty}
                    {item.size && <> | Size: {item.size}</>}
                    {item.color && <> | Color: {item.color}</>}
                  </p>

                  <p className="mb-0">
                    ₹{unitPrice.toFixed(2)} × {qty} ={" "}
                    <strong>
                      ₹{total.toFixed(2)}
                    </strong>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <span>Payment Status</span>
            <strong>{order.payment_status}</strong>
          </div>

          <hr />

          <div className="d-flex justify-content-between fs-5 fw-bold">
            <span>Total</span>
            <span>
              ₹{Number(order.total_amount).toFixed(2)}
            </span>
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

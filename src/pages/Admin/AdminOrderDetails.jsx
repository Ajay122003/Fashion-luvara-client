import React, { useEffect, useState } from "react";
import {
  fetchAdminOrderDetail,
  adminUpdateOrder,
} from "../../api/admin";
import { useParams } from "react-router-dom";

const STATUS_FLOW = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [courierName, setCourierName] = useState("");
  const [trackingId, setTrackingId] = useState("");

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminOrderDetail(id);
      setOrder(data);
      setCourierName(data.courier_name || "");
      setTrackingId(data.tracking_id || "");
    } catch {
      alert("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line
  }, []);

  const updateOrder = async (key, value) => {
    try {
      await adminUpdateOrder(id, { [key]: value });
      loadOrder();
    } catch {
      alert("Update failed");
    }
  };

  const saveShippingDetails = async () => {
    try {
      await adminUpdateOrder(id, {
        courier_name: courierName,
        tracking_id: trackingId,
        status: "SHIPPED",
      });
      loadOrder();
    } catch {
      alert("Failed to update shipping");
    }
  };

  if (loading)
    return <p className="text-center py-5">Loading…</p>;
  if (!order) return <p>Order not found</p>;

  const currentIndex = STATUS_FLOW.indexOf(order.status);

  return (
    <div className="container-fluid py-3">

      {/* ================= HEADER ================= */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">{order.order_number}</h3>
          <small className="text-muted">
            Placed on {new Date(order.created_at).toLocaleString()}
          </small>
        </div>

        <div className="text-end">
          <span className="badge bg-dark me-2">
            {order.status}
          </span>
          <span
            className={`badge ${
              order.payment_status === "PAID"
                ? "bg-success"
                : order.payment_status === "COD"
                ? "bg-info"
                : "bg-warning"
            }`}
          >
            {order.payment_status}
          </span>
        </div>
      </div>

      <div className="row">

        {/* ================= LEFT COLUMN ================= */}
        <div className="col-lg-8">

          {/* ORDER STATUS & PAYMENT */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Order Management</h5>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Order Status
                  </label>
                  <select
                    className="form-select"
                    value={order.status}
                    onChange={(e) =>
                      updateOrder("status", e.target.value)
                    }
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Payment Status
                  </label>
                  <select
                    className="form-select"
                    value={order.payment_status}
                    onChange={(e) =>
                      updateOrder("payment_status", e.target.value)
                    }
                  >
                    <option value="PAID">PAID</option>
                    <option value="PENDING">PENDING</option>
                    <option value="FAILED">FAILED</option>
                    <option value="COD">COD</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ORDER TIMELINE */}
          {order.status !== "CANCELLED" && (
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Order Timeline</h5>

                <div className="d-flex justify-content-between">
                  {STATUS_FLOW.map((step, index) => (
                    <div
                      key={step}
                      className="text-center flex-fill"
                    >
                      <div
                        className={`mx-auto mb-2 rounded-circle ${
                          index <= currentIndex
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                        style={{ width: 14, height: 14 }}
                      ></div>
                      <small
                        className={
                          index <= currentIndex
                            ? "fw-bold"
                            : "text-muted"
                        }
                      >
                        {step.replace("_", " ")}
                      </small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ORDER ITEMS */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Order Items</h5>

              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="d-flex align-items-start border-bottom pb-3 mb-3"
                >
                  {item.product?.images?.length > 0 && (
                    <img
                      src={item.product.images[0].image_url}
                      alt=""
                      width="64"
                      height="64"
                      className="rounded me-3"
                      style={{ objectFit: "cover" }}
                    />
                  )}

                  <div className="flex-grow-1">
                    <p className="fw-bold mb-1">
                      {item.product?.name}
                    </p>
                    <small className="text-muted">
                      Size: {item.size || "-"} | Color:{" "}
                      {item.color || "-"}
                    </small>
                    <div className="d-flex justify-content-between mt-1">
  <span>
    Qty: {item.quantity} × ₹{item.unit_price}
  </span>
  <span className="fw-semibold">
    ₹{item.total_price}
  </span>
</div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="col-lg-4">

          {/* SHIPPING DETAILS */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Shipping</h5>

              <input
                className="form-control mb-2"
                placeholder="Courier Name"
                value={courierName}
                onChange={(e) =>
                  setCourierName(e.target.value)
                }
              />

              <input
                className="form-control mb-3"
                placeholder="Tracking ID"
                value={trackingId}
                onChange={(e) =>
                  setTrackingId(e.target.value)
                }
              />

              <button
                className="btn btn-dark w-100"
                disabled={!courierName || !trackingId}
                onClick={saveShippingDetails}
              >
                Save Shipping Details
              </button>
            </div>
          </div>

          {/* PRICE DETAILS */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Price Summary</h5>

              <PriceRow label="Subtotal" value={order.subtotal_amount} />
              {Number(order.discount_amount) > 0 && (
                <PriceRow
                  label="Discount"
                  value={`- ${order.discount_amount}`}
                  green
                />
              )}
              <PriceRow
                label="Shipping"
                value={
                  order.shipping_amount > 0
                    ? order.shipping_amount
                    : "Free"
                }
              />
              <PriceRow label="GST" value={order.gst_amount} />

              <hr />
              <PriceRow
                label="Total"
                value={order.total_amount}
                bold
              />
            </div>
          </div>

          {/* ADDRESS */}
          {order.address_details && (
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold mb-2">
                  Customer Address
                </h5>
                <p className="mb-1 fw-semibold">
                  {order.address_details.name}
                </p>
                <small className="text-muted">
                  {order.address_details.phone}
                </small>
                <p className="mt-2 mb-0">
                  {order.address_details.full_address},{" "}
                  {order.address_details.city}
                </p>
                <p className="mb-0">
                  {order.address_details.state} –{" "}
                  {order.address_details.pincode}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

/* ================= PRICE ROW ================= */

const PriceRow = ({ label, value, bold, green }) => (
  <div className="d-flex justify-content-between mb-1">
    <span>{label}</span>
    <span
      className={`${bold ? "fw-bold" : ""} ${
        green ? "text-success" : ""
      }`}
    >
      ₹{value}
    </span>
  </div>
);


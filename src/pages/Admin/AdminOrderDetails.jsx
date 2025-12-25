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

  // 🔥 Shipping states
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
      alert("Order updated successfully");
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
      alert("Shipping details updated");
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
    <div className="container py-3">
      <h3 className="fw-bold mb-3">Order Details</h3>
      <hr />

      {/* ORDER INFO */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="fw-bold mb-2">{order.order_number}</h5>

          <p><b>User:</b> {order.user_email}</p>

          <p>
            <b>Order Status:</b>{" "}
            <span className="badge bg-secondary">
              {order.status}
            </span>
          </p>

          <p>
            <b>Payment Status:</b>{" "}
            <span className="badge bg-info">
              {order.payment_status}
            </span>
          </p>

          {/* STATUS + PAYMENT UPDATE */}
          <div className="row mt-3">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                Update Order Status
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
              <label className="form-label fw-bold">
                Update Payment Status
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

      {/* SHIPPING DETAILS */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Shipping Details</h5>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                Courier Name
              </label>
              <input
                className="form-control"
                value={courierName}
                onChange={(e) =>
                  setCourierName(e.target.value)
                }
                placeholder="Eg: Delhivery"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                Tracking ID
              </label>
              <input
                className="form-control"
                value={trackingId}
                onChange={(e) =>
                  setTrackingId(e.target.value)
                }
                placeholder="AWB / Tracking number"
              />
            </div>
          </div>

          <button
            className="btn btn-dark"
            disabled={!courierName || !trackingId}
            onClick={saveShippingDetails}
          >
            Save Shipping Details
          </button>
        </div>
      </div>

      {/* ORDER TIMELINE */}
      {order.status !== "CANCELLED" && (
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5 className="fw-bold mb-3">Order Timeline</h5>

            {STATUS_FLOW.map((step, index) => {
              const isActive = index <= currentIndex;
              return (
                <div key={step} className="d-flex mb-2">
                  <div
                    className={`rounded-circle me-3 ${
                      isActive ? "bg-success" : "bg-secondary"
                    }`}
                    style={{ width: 14, height: 14 }}
                  ></div>
                  <span
                    className={
                      isActive ? "fw-bold" : "text-muted"
                    }
                  >
                    {step.replaceAll("_", " ")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PRICE BREAKUP */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Price Details</h5>

          <div className="d-flex justify-content-between">
            <span>Subtotal</span>
            <span>₹{Number(order.subtotal_amount).toFixed(2)}</span>
          </div>

          {Number(order.discount_amount) > 0 && (
            <div className="d-flex justify-content-between text-success">
              <span>Discount</span>
              <span>- ₹{Number(order.discount_amount).toFixed(2)}</span>
            </div>
          )}

          <div className="d-flex justify-content-between">
            <span>Shipping</span>
            <span>
              {Number(order.shipping_amount) > 0
                ? `₹${Number(order.shipping_amount).toFixed(2)}`
                : "Free"}
            </span>
          </div>

          <div className="d-flex justify-content-between">
            <span>GST</span>
            <span>₹{Number(order.gst_amount).toFixed(2)}</span>
          </div>

          <hr />

          <div className="d-flex justify-content-between fw-bold fs-5">
            <span>Total</span>
            <span>₹{Number(order.total_amount).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* ADDRESS */}
      {order.address_details && (
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h5 className="fw-bold">Customer Address</h5>
            <p className="mb-1 fw-semibold">
              {order.address_details.name}
            </p>
            <p className="mb-1">
              {order.address_details.phone}
            </p>
            <p className="mb-0">
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

      {/* ORDER ITEMS */}
      {/* ORDER ITEMS */}
<div className="card shadow-sm">
  <div className="card-body">
    <h5 className="fw-bold">Order Items</h5>
    <hr />

    {order.items.map((item, i) => (
      <div key={i} className="mb-3 border-bottom pb-2">
        {/* 🖼 IMAGE (optional) */}
        {item.product?.image && (
         <img
  src={item.product?.images?.[0]?.image_url}
  alt={item.product?.name}
  style={{
    width: 60,
    height: 60,
    objectFit: "cover",
    borderRadius: 6,
    marginRight: 12,
  }}
/>

        )}

        <p className="fw-bold mb-1">
          {item.product?.name || "Product"}
        </p>
        <p className="mb-1">Qty: {item.quantity}</p>
        <p className="mb-1">Ordered Price: ₹{item.price}</p>
        <p className="mb-1">Size: {item.size}</p>
        <p className="mb-0">Color: {item.color || "-"}</p>
      </div>
    ))}
  </div>
</div>

    </div>
  );
};

export default OrderDetails;

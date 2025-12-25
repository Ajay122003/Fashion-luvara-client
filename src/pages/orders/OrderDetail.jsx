import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderDetail } from "../../api/order";

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

  if (loading)
    return <p className="text-center py-5">Loading order...</p>;

  if (!order)
    return <p className="text-center py-5">Order not found</p>;

  return (
    <div className="container py-4" style={{ maxWidth: 900 }}>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Order #{order.order_id || order.id}</h4>
        <span
          className={`badge fs-6 ${
            order.status === "DELIVERED"
              ? "bg-success"
              : "bg-warning text-dark"
          }`}
        >
          {order.status}
        </span>
      </div>

      {/* ADDRESS */}
      {order.address && (
        <div className="card shadow-sm mb-3">
          <div className="card-body">
            <h6>Delivery Address</h6>
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

      {/* SHIPPING DETAILS */}
      {(order.courier_name || order.tracking_id) && (
        <div className="card shadow-sm mb-3">
          <div className="card-body">
            <h6>Shipping Details</h6>

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

      {/* ITEMS */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <h6 className="mb-3">Ordered Items</h6>

          {order.items?.map((item, index) => {
            const unitPrice = Number(item.price || 0);
            const qty = Number(item.quantity || 1);
            const total = unitPrice * qty;

            return (
              <div
                key={item.id || index}
                className="border-bottom py-3"
              >
                <p className="fw-bold mb-1">
                  {item.product || "Product"}
                </p>

                <p className="small mb-1 text-muted">
                  Qty: {qty}
                  {item.size && <> | Size: {item.size}</>}
                  {item.color && <> | Color: {item.color}</>}
                </p>

                <p className="mb-0">
                  ₹{unitPrice.toFixed(2)} × {qty} =
                  <strong> ₹{total.toFixed(2)}</strong>
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* SUMMARY */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <span>Payment Status</span>
            <strong>{order.payment_status}</strong>
          </div>

          <hr />

          <div className="d-flex justify-content-between fs-5 fw-bold">
            <span>Total</span>
            <span>₹{order.total_amount}</span>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
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


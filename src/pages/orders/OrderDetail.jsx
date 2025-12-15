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
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <h6>Delivery Address</h6>
          <p className="mb-0">
            <strong>{order.address.name}</strong> – {order.address.phone}
          </p>
          <small className="text-muted">
            {order.address.full_address}, {order.address.city} –{" "}
            {order.address.pincode}
          </small>
        </div>
      </div>

      {/* ITEMS */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <h6 className="mb-3">Items</h6>

          {order.items.map((item) => (
            <div
              key={item.id}
              className="d-flex justify-content-between align-items-center border-bottom py-2"
            >
              <div>
                <strong>{item.product.name}</strong>
                <p className="small mb-0">
                  Qty: {item.quantity}
                  {item.size && <> | Size: {item.size}</>}
                </p>
              </div>

              <span className="fw-bold">₹{item.total_price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SUMMARY */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <span>Payment</span>
            <strong>{order.payment_method}</strong>
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

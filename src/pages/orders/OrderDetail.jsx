// src/pages/orders/OrderDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderDetail } from "../../api/order";

const OrderDetail = () => {
  const { id } = useParams();
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
      alert("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center py-5">Loading order...</p>;
  if (!order) return <p className="text-center py-5">Order not found</p>;

  return (
    <div className="container py-4" style={{ maxWidth: 900 }}>
      <h4 className="mb-3">Order Details</h4>

      {/* ORDER INFO */}
      <div className="card p-3 shadow-sm mb-4">
        <div className="d-flex justify-content-between flex-wrap">
          <div>
            <strong>Order ID:</strong> {order.order_id || order.id}
            <br />
            <small className="text-muted">
              {new Date(order.created_at).toLocaleString()}
            </small>
          </div>

          <span className="badge bg-dark align-self-start">
            {order.status}
          </span>
        </div>
      </div>

      {/* ITEMS */}
      <div className="card p-3 shadow-sm mb-4">
        <h6 className="mb-3">Items</h6>

        {order.items.map((item) => (
          <div
            key={item.id}
            className="d-flex justify-content-between mb-2"
          >
            <div>
              {item.product_name} × {item.quantity}
            </div>
            <strong>₹{item.total_price}</strong>
          </div>
        ))}

        <hr />

        <div className="d-flex justify-content-between fw-bold">
          <span>Total</span>
          <span>₹{order.total_amount}</span>
        </div>
      </div>

      {/* ADDRESS */}
      <div className="card p-3 shadow-sm">
        <h6 className="mb-2">Delivery Address</h6>
        <p className="mb-1">{order.address.name}</p>
        <p className="mb-1">{order.address.phone}</p>
        <p className="mb-0">
          {order.address.full_address}, {order.address.city} –{" "}
          {order.address.pincode}
        </p>
      </div>
    </div>
  );
};

export default OrderDetail;

import React, { useEffect, useState } from "react";
import {
  fetchAdminOrderDetail,
  adminUpdateOrder,
} from "../../api/admin";
import { useParams } from "react-router-dom";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminOrderDetail(id);
      setOrder(data);
    } catch (err) {
      alert("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, []);

  const updateOrder = async (key, value) => {
    try {
      await adminUpdateOrder(id, { [key]: value });
      alert("Order updated successfully");
      loadOrder();
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!order) return <p>Order not found</p>;

  return (
    <div>
      <h3 className="fw-bold">Order Details</h3>
      <hr />

      {/* Order Info */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="fw-bold">{order.order_number}</h5>
          <p>
            <b>User:</b> {order.user_email}
          </p>
          <p>
            <b>Total Amount:</b> ₹{order.total_amount}
          </p>

          {/* STATUS SELECT */}
          <div className="mb-3">
            <label className="form-label fw-bold">
              Update Order Status
            </label>
            <select
              className="form-select"
              value={order.status}
              onChange={(e) => updateOrder("status", e.target.value)}
            >
              <option value="PENDING">Pending</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* PAYMENT STATUS */}
          <div className="mb-3">
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

      {/* ADDRESS */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="fw-bold">Customer Address</h5>
          <p>
            <b>{order.address_details.name}</b>
          </p>
          <p>{order.address_details.phone}</p>
          <p>
            {order.address_details.full_address}, {order.address_details.city}
          </p>
          <p>
            {order.address_details.state} - {order.address_details.pincode}
          </p>
        </div>
      </div>

      {/* ITEMS */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="fw-bold">Order Items</h5>
          <hr />

          {order.items.map((item, i) => (
            <div key={i} className="mb-3 pb-3 border-bottom">
              <p className="fw-bold">{item.product}</p>
              <p>
                Qty: <b>{item.quantity}</b>
              </p>
              <p>Price: ₹{item.price}</p>
              <p>Size: {item.size}</p>
              <p>Color: {item.color}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

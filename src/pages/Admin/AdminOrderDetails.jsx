import React, { useEffect, useState } from "react";
import { fetchAdminOrderDetails, updateAdminOrder } from "../../api/admin";
import { useParams } from "react-router-dom";
import OrderItemsTable from "../../components/Admin/OrderItemsTable";

const AdminOrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  const statuses = [
    "PENDING",
    "PROCESSING",
    "PACKED",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
  ];

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    const data = await fetchAdminOrderDetails(id);
    setOrder(data);
  };

  const updateStatus = async (field, value) => {
    await updateAdminOrder(id, { [field]: value });
    loadOrder();
    alert("Updated successfully!");
  };

  if (!order) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container py-3">
      <h3>Order #{order.order_number}</h3>

      <div className="row mt-3">
        {/* Left side — Order details */}
        <div className="col-md-6">
          <div className="card p-3 shadow-sm mb-3">
            <h5>Customer Info</h5>
            <p><strong>Email:</strong> {order.user_email}</p>
            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
          </div>

          <div className="card p-3 shadow-sm">
            <h5>Address</h5>
            {order.address_details ? (
              <>
                <p>{order.address_details.name}</p>
                <p>{order.address_details.phone}</p>
                <p>{order.address_details.full_address}</p>
                <p>{order.address_details.city}, {order.address_details.state}</p>
              </>
            ) : (
              <p>No address available</p>
            )}
          </div>
        </div>

        {/* Right side — Status controls */}
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5>Order Controls</h5>
            
            <label className="mt-2 fw-semibold">Order Status</label>
            <select
              className="form-select"
              value={order.status}
              onChange={(e) => updateStatus("status", e.target.value)}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <label className="mt-3 fw-semibold">Payment Status</label>
            <select
              className="form-select"
              value={order.payment_status}
              onChange={(e) =>
                updateStatus("payment_status", e.target.value)
              }
            >
              <option value="PAID">PAID</option>
              <option value="COD">COD</option>
              <option value="PENDING">PENDING</option>
            </select>

            <div className="mt-3">
              <h5>Total Amount: ₹{order.total_amount}</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Items table */}
      <div className="card p-3 shadow-sm mt-4">
        <h5>Order Items</h5>
        <OrderItemsTable items={order.items} />
      </div>
    </div>
  );
};

export default AdminOrderDetails;

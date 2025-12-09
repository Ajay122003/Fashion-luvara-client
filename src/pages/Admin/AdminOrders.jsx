import React, { useEffect, useState } from "react";
import { fetchAdminOrders } from "../../api/admin";
import OrderRow from "../../components/Admin/OrderRow";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    loadOrders();
  }, [status]);

  const loadOrders = async () => {
    const data = await fetchAdminOrders(status);
    setOrders(data);
  };

  return (
    <div className="container py-3">
      <h3>All Orders</h3>

      {/* Filter */}
      <div className="d-flex gap-3 mt-3 mb-3">
        <select
          className="form-select w-auto"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="PACKED">Packed</option>
          <option value="SHIPPED">Shipped</option>
          <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="card p-3 shadow-sm table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Order #</th>
              <th>User</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
              <th>View</th>
            </tr>
          </thead>

          <tbody>
            {orders.length ? (
              orders.map((order) => <OrderRow key={order.id} order={order} />)
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;

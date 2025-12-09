import React from "react";
import { Link } from "react-router-dom";

const OrderRow = ({ order }) => {
  return (
    <tr>
      <td>{order.order_number}</td>
      <td>{order.user_email}</td>
      <td>₹{order.total_amount}</td>
      <td>
        <span
          className={`badge text-bg-${
            order.payment_status === "PAID"
              ? "success"
              : order.payment_status === "COD"
              ? "primary"
              : "warning"
          }`}
        >
          {order.payment_status}
        </span>
      </td>
      <td>
        <span className="badge text-bg-info">{order.status}</span>
      </td>
      <td>{new Date(order.created_at).toLocaleString()}</td>
      <td>
        <Link
          to={`/admin/orders/${order.id}`}
          className="btn btn-sm btn-outline-primary"
        >
          View
        </Link>
      </td>
    </tr>
  );
};

export default OrderRow;

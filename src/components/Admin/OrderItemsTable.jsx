import React from "react";

const OrderItemsTable = ({ items }) => {
  return (
    <div className="table-responsive mt-3">
      <table className="table table-bordered align-middle">
        <thead className="table-light">
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Size</th>
            <th>Color</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.product.name}</td>
              <td>{item.quantity}</td>
              <td>₹{item.price}</td>
              <td>{item.size || "-"}</td>
              <td>{item.color || "-"}</td>
              <td className="fw-bold">
                ₹{(item.price * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default OrderItemsTable;

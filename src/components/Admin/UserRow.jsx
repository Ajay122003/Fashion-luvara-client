import React from "react";

const UserRow = ({ user }) => {
  return (
    <tr>
      <td>{user.id}</td>
      <td>{user.name || "—"}</td>
      <td>{user.email}</td>
      <td>{user.phone || "—"}</td>
      <td>{new Date(user.created_at).toLocaleDateString()}</td>
    </tr>
  );
};

export default UserRow;

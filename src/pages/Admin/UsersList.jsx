import React, { useEffect, useState } from "react";
import { fetchAdminUsers } from "../../api/admin";
import UserRow from "../../components/Admin/UserRow";

const UsersList = () => {
  const [users, setUsers] = useState([]);

  // Search state
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await fetchAdminUsers();
    setUsers(data);
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-3">
      <h3 className="mb-3">All Users</h3>

      {/* Search Bar */}
      <div className="card p-3 shadow-sm mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Users Table */}
      <div className="card p-3 shadow-sm table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Joined</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((user) => <UserRow key={user.id} user={user} />)
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;

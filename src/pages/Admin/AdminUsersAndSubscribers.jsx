import React, { useEffect, useState } from "react";
import { fetchAdminUsers, fetchAdminSubscriptions } from "../../api/admin";

const AdminUsersAndSubscribers = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [subs, setSubs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
    loadSubscriptions();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await fetchAdminUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadSubscriptions = async () => {
    try {
      const data = await fetchAdminSubscriptions();
      setSubs(data);
    } catch (err) {
      console.error(err);
    }
  };

  // FILTER USERS
  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase())
  );

  // FILTER SUBSCRIBERS
  const filteredSubs = subs.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4 text-center text-md-start">
        Users & Subscribers
      </h3>

      {/* TABS */}
      <div className="d-flex gap-3 justify-content-center justify-content-md-start border-bottom pb-3 mb-3">
        <button
          className={`btn ${
            activeTab === "users" ? "btn-dark" : "btn-outline-dark"
          }`}
          onClick={() => {
            setActiveTab("users");
            setSearch("");
          }}
        >
          Users
        </button>

        <button
          className={`btn ${
            activeTab === "subs" ? "btn-dark" : "btn-outline-dark"
          }`}
          onClick={() => {
            setActiveTab("subs");
            setSearch("");
          }}
        >
          Subscribers
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-3 text-center text-md-start">
        <input
          type="text"
          className="form-control"
          placeholder={
            activeTab === "users"
              ? "Search users by email or username..."
              : "Search subscribers by email..."
          }
          style={{ maxWidth: "350px" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* USERS TABLE */}
      {activeTab === "users" && (
        <div className="card shadow-sm admin-table-card">
          <div className="card-body">
            <h5 className="fw-bold mb-3">Registered Users</h5>

            {filteredUsers.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped align-middle">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Username</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id}>
                        <td>{u.email}</td>
                        <td>{u.username}</td>
                        <td>
                          {new Date(u.date_joined).toLocaleDateString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBSCRIBERS TABLE */}
      {activeTab === "subs" && (
        <div className="card shadow-sm admin-table-card">
          <div className="card-body">
            <h5 className="fw-bold mb-3">Subscribers</h5>

            {filteredSubs.length === 0 ? (
              <p>No subscribers found.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Subscribed On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubs.map((s) => (
                      <tr key={s.id}>
                        <td>{s.email}</td>
                        <td>
                          {new Date(s.created_at).toLocaleDateString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MOBILE RESPONSIVE FIX */}
      <style>
        {`
        @media (max-width: 576px) {
          .admin-table-card {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }

          .admin-table-card .card-body {
            padding: 10px !important;
          }

          table {
            width: 100% !important;
            font-size: 13px !important;
          }

          th, td {
            padding: 8px !important;
            white-space: nowrap;
          }
        }
      `}
      </style>
    </div>
  );
};

export default AdminUsersAndSubscribers;

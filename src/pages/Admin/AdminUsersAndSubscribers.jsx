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
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadSubscriptions = async () => {
    try {
      const data = await fetchAdminSubscriptions();
      setSubs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  /* FILTER USERS */
  const filteredUsers = users.filter(
    (u) =>
      u?.email?.toLowerCase().includes(search.toLowerCase()) ||
      u?.username?.toLowerCase().includes(search.toLowerCase())
  );

  /* FILTER SUBSCRIBERS */
  const filteredSubs = subs.filter((s) =>
    s?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid py-4">

      <h4 className="fw-bold mb-4">Users & Subscribers</h4>

      {/* TABS */}
      <div className="d-flex gap-3 border-bottom pb-3 mb-3">
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

      {/* SEARCH */}
      <div className="mb-3" style={{ maxWidth: "350px" }}>
        <input
          type="text"
          className="form-control"
          placeholder={
            activeTab === "users"
              ? "Search users..."
              : "Search subscribers..."
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ================= USERS TABLE ================= */}
      {activeTab === "users" && (
        <div className="table-scroll">
          <table className="table table-striped align-middle mb-0">
            <thead>
              <tr>
                <th>Email</th>
                <th>Username</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>{u.email}</td>
                    <td>{u.username}</td>
                    <td>
                      {new Date(u.date_joined).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= SUBSCRIBERS TABLE ================= */}
      {activeTab === "subs" && (
        <div className="table-scroll">
          <table className="table table-bordered align-middle mb-0">
            <thead>
              <tr>
                <th>Email</th>
                <th>Subscribed On</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubs.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center py-4">
                    No subscribers found
                  </td>
                </tr>
              ) : (
                filteredSubs.map((s) => (
                  <tr key={s.id}>
                    <td>{s.email}</td>
                    <td>
                      {new Date(s.created_at).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= STYLES ================= */}
      <style>
        {`
        .table-scroll {
          max-height: 68vh;
          overflow-y: auto;
          overflow-x: auto;
          border-radius: 12px;
          border: 1px solid #eee;
        }

        .table-scroll thead th {
          position: sticky;
          top: 0;
          background: #f8f9fa;
          z-index: 2;
        }

        @media (max-width: 768px) {
          .table-scroll {
            max-height: 75vh;
          }

          table {
            font-size: 13px;
          }

          th, td {
            white-space: nowrap;
          }
        }
      `}
      </style>

    </div>
  );
};

export default AdminUsersAndSubscribers;
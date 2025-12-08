// src/pages/Admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { fetchDashboardStats } from "../../api/admin";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const data = await fetchDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("Dashboard error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (!stats) {
    return <div className="text-danger">Failed to load dashboard.</div>;
  }

  return (
    <div>
      <h3 className="mb-4">Dashboard Overview</h3>

      <div className="row g-3">
        <div className="col-6 col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="text-muted small">Total Users</div>
              <div className="fs-4 fw-bold">{stats.total_users}</div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="text-muted small">Total Orders</div>
              <div className="fs-4 fw-bold">{stats.total_orders}</div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="text-muted small">Revenue</div>
              <div className="fs-5 fw-bold">₹{stats.total_revenue}</div>
            </div>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="text-muted small">Today Orders</div>
              <div className="fs-4 fw-bold">{stats.todays_orders}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Low stock + best sellers etc you can add later with charts */}
    </div>
  );
};

export default Dashboard;

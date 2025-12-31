import React, { useEffect, useState } from "react";
import {
  fetchAdminDashboardStats,
  fetchLowStockProducts,
} from "../../api/admin";

/* ================= DASHBOARD ================= */

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    loadDashboard();
    loadLowStock();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await fetchAdminDashboardStats();
      setStats(data);
    } catch {
      alert("Failed to load dashboard");
    }
  };

  const loadLowStock = async () => {
    try {
      const data = await fetchLowStockProducts();
      setLowStock(data.results || []);
    } catch {
      alert("Failed to load low stock products");
    }
  };

  if (!stats) {
    return (
      <p className="text-center py-5 fw-semibold">
        Loading Dashboard…
      </p>
    );
  }

  return (
    <div className="container-fluid py-4">

      {/* ================= HEADER ================= */}
      <div className="mb-4">
        <h3 className="fw-bold mb-1">Admin Dashboard</h3>
        <small className="text-muted">
          Business overview & performance
        </small>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="row g-3 mb-4">
        <StatCard title="Users" value={stats.total_users} icon="people" color="#4e73df" />
        <StatCard title="Orders" value={stats.total_orders} icon="bag-check" color="#1cc88a" />
        <StatCard title="Revenue" value={`₹${stats.total_revenue}`} icon="currency-rupee" color="#36b9cc" />
        <StatCard title="Today Orders" value={stats.todays_orders} icon="calendar-check" color="#f6c23e" />
        <StatCard title="Today Revenue" value={`₹${stats.todays_revenue}`} icon="graph-up" color="#20c997" />
        <StatCard title="Pending" value={stats.pending_orders} icon="clock-history" color="#fd7e14" />
        <StatCard title="Delivered" value={stats.delivered_orders} icon="truck" color="#198754" />
        <StatCard title="Subscribers" value={stats.total_subscribers} icon="envelope" color="#6f42c1" />
      </div>

      {/* ================= BEST SELLERS ================= */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <SectionHeader title="Best Selling Products" />

          {stats.best_selling_products.length === 0 ? (
            <p className="text-muted mb-0">No sales yet</p>
          ) : (
            <table className="table table-hover align-middle mb-0">
              <tbody>
                {stats.best_selling_products.map((item) => (
                  <tr key={item.variant__product_id}>
                    <td className="d-flex align-items-center gap-3">
                      <img
                        src={item.image || "/placeholder.png"}
                        alt=""
                        width="48"
                        height="48"
                        className="rounded"
                        style={{ objectFit: "cover" }}
                      />
                      <span className="fw-semibold">
                        {item.variant__product__name}
                      </span>
                    </td>
                    <td className="text-end fw-bold">
                      {item.total_sold} sold
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ================= LOW STOCK ================= */}
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <SectionHeader
            title="Low Stock Products"
            subtitle={`Below ${stats.low_stock_threshold}`}
          />

          {lowStock.length === 0 ? (
            <p className="text-muted mb-0">
              All products have healthy stock
            </p>
          ) : (
            <table className="table table-hover align-middle mb-0">
              <tbody>
                {lowStock.map((p) => (
                  <tr key={p.id}>
                    <td className="d-flex align-items-center gap-3">
                      <img
                        src={
                          p.images?.length
                            ? p.images[0].image_url
                            : "/placeholder.png"
                        }
                        width="46"
                        height="46"
                        className="rounded"
                        style={{ objectFit: "cover" }}
                      />
                      <span className="fw-semibold">{p.name}</span>
                    </td>
                    <td>
                      {p.variants.map((v) => (
                        <span
                          key={v.id}
                          className={`badge rounded-pill me-2 ${
                            v.stock <= stats.low_stock_threshold
                              ? "bg-danger"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {v.size}: {v.stock}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

/* ================= STAT CARD ================= */

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="col-6 col-sm-6 col-lg-3">
      <div
        className="card border-0 shadow-sm h-100 text-white"
        style={{
          background: `linear-gradient(135deg, ${color}, #00000040)`,
        }}
      >
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <small className="opacity-75">{title}</small>
            <h4 className="fw-bold mb-0">{value}</h4>
          </div>
          <i className={`bi bi-${icon} fs-1 opacity-50`}></i>
        </div>
      </div>
    </div>
  );
};

/* ================= SECTION HEADER ================= */

const SectionHeader = ({ title, subtitle }) => {
  return (
    <div className="mb-3">
      <h5 className="fw-bold mb-0">{title}</h5>
      {subtitle && (
        <small className="text-muted">{subtitle}</small>
      )}
    </div>
  );
};


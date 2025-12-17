import React, { useEffect, useState } from "react";
import {
  fetchAdminDashboardStats,
  fetchLowStockProducts,
} from "../../api/admin";

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
      setLowStock(data.results);
    } catch {
      alert("Failed to load low-stock products");
    }
  };

  if (!stats)
    return (
      <p className="text-center py-5 fw-semibold">
        Loading Dashboard…
      </p>
    );

  return (
    <div className="container-fluid py-4">

      {/* ================= HEADER ================= */}
      <div className="mb-4">
        <h3 className="fw-semibold mb-1">Admin Dashboard</h3>
        <small className="text-muted">
          Overview of store performance
        </small>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="row g-3 mb-4">
        <StatCard icon="people" title="Users" value={stats.total_users} color="primary" />
        <StatCard icon="bag-check" title="Orders" value={stats.total_orders} color="success" />
        <StatCard icon="currency-rupee" title="Revenue" value={`₹${stats.total_revenue}`} color="dark" />
        <StatCard icon="calendar-check" title="Today's Orders" value={stats.todays_orders} color="warning" />
        <StatCard icon="graph-up" title="Today's Revenue" value={`₹${stats.todays_revenue}`} color="info" />
        <StatCard icon="clock-history" title="Pending Orders" value={stats.pending_orders} color="secondary" />
        <StatCard icon="truck" title="Delivered Orders" value={stats.delivered_orders} color="success" />
        <StatCard icon="envelope" title="Subscribers" value={stats.total_subscribers} color="primary" />
      </div>

      {/* ================= BEST SELLERS ================= */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white border-bottom">
          <h5 className="mb-0 fw-semibold">Best Selling Products</h5>
        </div>

        <div className="card-body">
          {stats.best_selling_products.length === 0 ? (
            <p className="text-muted mb-0">No sales yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Product</th>
                    <th>Image</th>
                    <th>Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.best_selling_products.map((item) => (
                    <tr key={item.product_id}>
                      <td className="fw-medium">{item.product__name}</td>
                      <td>
                        <img
                          src={item.image || "/placeholder.png"}
                          alt=""
                          width="56"
                          height="56"
                          className="rounded border"
                          style={{ objectFit: "cover" }}
                        />
                      </td>
                      <td className="fw-bold">{item.total_sold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ================= LOW STOCK ================= */}
      <div className="card shadow-sm border-0 mb-5">
        <div className="card-header bg-white border-bottom">
          <h5 className="mb-0 fw-semibold">
            Low Stock Products
            <span className="text-muted fw-normal ms-2">
              (Below {stats.low_stock_threshold})
            </span>
          </h5>
        </div>

        <div className="card-body">
          {lowStock.length === 0 ? (
            <p className="text-muted mb-0">
              All products have healthy stock.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Product</th>
                    <th>Image</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStock.map((p) => (
                    <tr key={p.id}>
                      <td className="fw-medium">{p.name}</td>
                      <td>
                        <img
                          src={
                            p.images?.length
                              ? p.images[0].image_url
                              : "/placeholder.png"
                          }
                          alt=""
                          width="52"
                          height="52"
                          className="rounded border"
                          style={{ objectFit: "cover" }}
                        />
                      </td>
                      <td className="fw-bold text-danger">
                        {p.stock}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

/* ================= KPI CARD ================= */

const StatCard = ({ icon, title, value, color }) => {
  return (
    <div className="col-6 col-md-4 col-xl-3">
      <div className={`card shadow-sm h-100 border-start border-4 border-${color}`}>
        <div className="card-body d-flex align-items-center gap-3">
          <div
            className={`rounded-circle bg-${color}-subtle d-flex align-items-center justify-content-center`}
            style={{ width: 48, height: 48 }}
          >
            <i className={`bi bi-${icon} fs-4 text-${color}`}></i>
          </div>

          <div>
            <small className="text-muted">{title}</small>
            <h5 className="fw-bold mb-0">{value}</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

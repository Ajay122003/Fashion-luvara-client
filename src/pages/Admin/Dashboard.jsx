import React, { useEffect, useState } from "react";
import { fetchAdminDashboardStats, fetchLowStockProducts } from "../../api/admin";

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
    } catch (err) {
      alert("Failed to load dashboard data");
    }
  };

  const loadLowStock = async () => {
    try {
      const data = await fetchLowStockProducts();
      setLowStock(data.results);
    } catch (err) {
      alert("Failed to load low-stock products");
    }
  };

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4">Admin Dashboard</h3>

      {/* TOP STATS */}
      <div className="row g-3 mb-3">
        <DashboardCard title="Total Users" value={stats.total_users} color="primary" />
        <DashboardCard title="Total Orders" value={stats.total_orders} color="success" />
        <DashboardCard title="Revenue" value={`₹${stats.total_revenue}`} color="dark" />
        <DashboardCard title="Today's Orders" value={stats.todays_orders} color="warning" />
        <DashboardCard title="Today's Revenue" value={`₹${stats.todays_revenue}`} color="info" />
        <DashboardCard title="Pending Orders" value={stats.pending_orders} color="secondary" />
        <DashboardCard title="Delivered Orders" value={stats.delivered_orders} color="success" />
      </div>

      {/* BEST SELLERS */}
      <div className="card shadow-sm mt-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Best Selling Products</h5>

          {stats.best_selling_products.length === 0 ? (
            <p>No sales yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Image</th>
                    <th>Sold</th>
                  </tr>
                </thead>

                <tbody>
                  {stats.best_selling_products.map((item) => (
                    <tr key={item.product_id}>
                      <td>{item.product__name}</td>

                      {/* IMAGE */}
                      <td>
                        <img
                          src={item.image || "/placeholder.png"}
                          alt="product"
                          className="rounded"
                          width="60"
                          height="60"
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

      {/* LOW STOCK PRODUCTS */}
      <div className="card shadow-sm mt-4 mb-5">
        <div className="card-body">
          <h5 className="fw-bold mb-3">
            Low Stock Products (Below {stats.low_stock_threshold})
          </h5>

          {lowStock.length === 0 ? (
            <p>All products have good stock levels.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Image</th>
                    <th>Stock</th>
                  </tr>
                </thead>

                <tbody>
                  {lowStock.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>

                      <td>
                        <img
                          src={p.images?.length ? p.images[0].image_url : "/placeholder.png"}
                          alt="product"
                          width="50"
                          height="50"
                          className="rounded"
                          style={{ objectFit: "cover" }}
                        />
                      </td>

                      <td className="fw-bold text-danger">{p.stock}</td>
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


/* ----- CARD COMPONENT ----- */

const DashboardCard = ({ title, value, color }) => {
  return (
    <div className="col-6 col-md-4 col-lg-3">
      <div className={`card shadow-sm border-${color} border-2`}>
        <div className="card-body text-center py-3">
          <h6 className="fw-semibold">{title}</h6>
          <h4 className={`fw-bold text-${color}`}>{value}</h4>
        </div>
      </div>
    </div>
  );
};

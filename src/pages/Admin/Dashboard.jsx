import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadDashboardStats } from "../../features/dashboard/dashboardSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { loading, error, stats } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(loadDashboardStats());
  }, [dispatch]);

  return (
    <div>
      <h2 className="mb-3">Dashboard Overview</h2>

      {loading && <p>Loading...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {stats && (
        <>
          <div className="row g-3 mb-3">
            <div className="col-6 col-md-3">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <p className="text-muted mb-1 small">Total Users</p>
                  <h4>{stats.total_users}</h4>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <p className="text-muted mb-1 small">Total Orders</p>
                  <h4>{stats.total_orders}</h4>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <p className="text-muted mb-1 small">Total Revenue</p>
                  <h4>₹{stats.total_revenue}</h4>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <p className="text-muted mb-1 small">Today Orders</p>
                  <h4>{stats.todays_orders}</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-8">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h5 className="card-title mb-3">Best Selling Products</h5>
                  {stats.best_selling_products.length === 0 && (
                    <p className="text-muted small mb-0">No sales data yet.</p>
                  )}
                  {stats.best_selling_products.length > 0 && (
                    <ul className="list-group list-group-flush">
                      {stats.best_selling_products.map((p) => (
                        <li
                          key={p.product_id}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <span>{p["product__name"]}</span>
                          <span className="badge bg-primary rounded-pill">
                            {p.total_sold} sold
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm border-0 mb-3">
                <div className="card-body">
                  <h6 className="card-title mb-2">Order Status</h6>
                  <p className="mb-1 small">
                    Pending: <b>{stats.pending_orders}</b>
                  </p>
                  <p className="mb-0 small">
                    Delivered: <b>{stats.delivered_orders}</b>
                  </p>
                </div>
              </div>

              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h6 className="card-title mb-2">Inventory</h6>
                  <p className="mb-1 small">
                    Total Products: <b>{stats.total_products}</b>
                  </p>
                  <p className="mb-1 small">
                    Active Products: <b>{stats.active_products}</b>
                  </p>
                  <p className="mb-0 small">
                    Low Stock (&lt;= {stats.low_stock_threshold}):{" "}
                    <b>{stats.low_stock_count}</b>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

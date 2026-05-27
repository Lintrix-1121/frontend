import React, { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import useAdminDashboardStore from "../../stores/admin/useAdminDashboardStore";
import AdminDashboardController from "../../controllers/admin/AdminDashboardController";
import InventoryAlerts from "../../components/shared/InventoryAlerts";
import RecentActivity from "../../components/shared/RecentActivity";
import TopProducts from "../../components/shared/TopProducts";

const DashboardView = () => {
  const dashboardStore = useAdminDashboardStore();
  const [controller] = useState(() => new AdminDashboardController(dashboardStore));
  const [period, setPeriod] = useState("30d");

  useEffect(() => {
    controller.initializeDashboard(period);
  }, [period]);

  if (dashboardStore.isLoading && !dashboardStore.overview) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" />
          <p className="mt-3 text-muted">Loading dashboard…</p>
        </div>
      </div>
    ); 
  }

  const overview = dashboardStore.overview;
  const revenueChartData = controller.getRevenueChartData();
  const inventoryAlerts = controller.getInventoryAlerts();
  const recentActivities = controller.getRecentActivities();
  const topProducts = controller.getTopProducts();

  return (
    <div className="container-fluid">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-0">Dashboard</h3>
          <small className="text-muted">Overview of your store performance</small>
        </div>

        <select
          className="form-select w-auto"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* STATS */}
      <div className="row g-3 mb-4">
        {[
          { title: "Revenue", value: overview?.getFormattedRevenue(), icon: "bi-cash-stack", color: "primary" },
          { title: "Orders", value: overview?.totalOrders, icon: "bi-cart", color: "success" },
          { title: "Products", value: overview?.totalProducts, icon: "bi-box", color: "purple" },
          { title: "Customers", value: overview?.totalCustomers, icon: "bi-people", color: "warning" },
        ].map((stat, i) => (
          <div key={i} className="col-md-6 col-lg-3">
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex justify-content-between">
                <div>
                  <small className="text-muted">{stat.title}</small>
                  <h4 className="fw-bold">{stat.value || 0}</h4>
                </div>
                <i className={`bi ${stat.icon} fs-2 text-${stat.color}`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="row g-4 mb-4">

        {/* REVENUE */}
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="fw-bold mb-3">Revenue Trend</h6>

              <div style={{ height: 300 }}>
                {revenueChartData && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={revenueChartData.labels.map((label, i) => ({
                        date: label,
                        revenue: revenueChartData.datasets[0].data[i],
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line dataKey="revenue" stroke="#0d6efd" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CATEGORY PIE */}
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="fw-bold mb-3">Sales by Category</h6>

              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardStore.salesByCategory}
                      dataKey="value"
                      outerRadius={90}
                      label
                    >
                      {dashboardStore.salesByCategory?.map((_, i) => (
                        <Cell key={i} fill={["#0d6efd", "#198754", "#ffc107", "#dc3545"][i % 4]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM GRID */}
      <div className="row g-4">
        <div className="col-lg-4">
          <InventoryAlerts alerts={inventoryAlerts} />
        </div>
        <div className="col-lg-4">
          <TopProducts products={topProducts} />
        </div>
        <div className="col-lg-4">
          <RecentActivity activities={recentActivities} />
        </div>
      </div>

    </div>
  );
};

export default DashboardView;


import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Calendar,
  Download,
  Filter,
  TrendingUp,
  Users,
  ShoppingBag,
  Banknote
} from 'lucide-react';
import StatCard from '../../components/shared/StatCard';
import RecentActivity from '../../components/shared/RecentActivity';

const AnalyticsView = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [salesData, setSalesData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const generateSalesData = () => {
      if (timeRange === 'week') {
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
          day,
          sales: Math.floor(Math.random() * 100) + 50
        }));
      }
      if (timeRange === 'month') {
        return Array.from({ length: 30 }, (_, i) => ({
          day: i + 1,
          sales: Math.floor(Math.random() * 150) + 100
        }));
      }
      return [];
    };

    const generateRevenueData = () => {
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(month => ({
        month,
        revenue: Math.floor(Math.random() * 50000) + 20000
      }));
    };

    const generateCategoryData = () => ([
      { name: 'Electronics', value: 35, color: '#0088FE' },
      { name: 'Clothing', value: 25, color: '#00C49F' },
      { name: 'Home', value: 20, color: '#FFBB28' },
      { name: 'Books', value: 15, color: '#FF8042' },
      { name: 'Sports', value: 5, color: '#8884D8' }
    ]);

    setSalesData(generateSalesData());
    setRevenueData(generateRevenueData());
    setCategoryData(generateCategoryData());
  }, [timeRange]);

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Analytics Dashboard</h2>

        <div className="d-flex gap-2">
          <select
            className="form-select"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>

          <button className="btn btn-outline-secondary d-flex align-items-center">
            <Download size={16} className="me-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <StatCard
            title="Total Revenue"
            value="USh. 124,580"
            icon={Banknote}
            trend="+12.5%"
          />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatCard
            title="Total Orders"
            value="1,245"
            icon={ShoppingBag}
            trend="+8.2%"
          />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatCard
            title="New Customers"
            value="342"
            icon={Users}
            trend="+15.3%"
          />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatCard
            title="Conversion Rate"
            value="4.8%"
            icon={TrendingUp}
            trend="+2.1%"
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="row g-4 mb-4">
        {/* Sales Chart */}
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-semibold mb-0">Sales Overview</h5>
                <Filter size={18} className="text-muted" />
              </div>

              <div style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#008000" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-semibold mb-0">Revenue Trend</h5>
                <Calendar size={18} className="text-muted" />
              </div>

              <div style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(v) => [`Shs ${v}`, 'Revenue']} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#198754"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="row g-4">
        {/* Category Pie */}
        <div className="col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-semibold mb-4">Sales by Category</h5>

              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v}%`, 'Share']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-3">
                {categoryData.map((item, index) => (
                  <div
                    key={index}
                    className="d-flex justify-content-between align-items-center mb-2"
                  >
                    <div className="d-flex align-items-center">
                      <span
                        className="rounded-circle me-2"
                        style={{
                          width: 10,
                          height: 10,
                          backgroundColor: item.color
                        }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <strong>{item.value}%</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-lg-8">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;


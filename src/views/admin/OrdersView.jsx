import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  EyeIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const OrdersView = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderNumber: 'ORD-001',
      customer: 'John Doe',
      email: 'john@example.com',
      date: '2024-01-15',
      status: 'processing',
      paymentStatus: 'paid',
      total: 299.99,
      items: 3
    },
    {
      id: 2,
      orderNumber: 'ORD-002',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      date: '2024-01-14',
      status: 'pending',
      paymentStatus: 'pending',
      total: 149.5,
      items: 2
    },
    {
      id: 3,
      orderNumber: 'ORD-003',
      customer: 'Bob Johnson',
      email: 'bob@example.com',
      date: '2024-01-13',
      status: 'completed',
      paymentStatus: 'paid',
      total: 499.99,
      items: 5
    },
    {
      id: 4,
      orderNumber: 'ORD-004',
      customer: 'Alice Brown',
      email: 'alice@example.com',
      date: '2024-01-12',
      status: 'cancelled',
      paymentStatus: 'refunded',
      total: 89.99,
      items: 1
    }
  ]);

  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    search: ''
  });

  const statusBadge = (status) => {
    const map = {
      pending: 'warning',
      processing: 'primary',
      completed: 'success',
      cancelled: 'danger'
    };
    return `badge bg-${map[status] || 'secondary'}-subtle text-${map[status] || 'secondary'}`;
  };

  const paymentBadge = (status) => {
    const map = {
      paid: 'success',
      pending: 'warning',
      refunded: 'info',
      failed: 'danger'
    };
    return `badge bg-${map[status] || 'secondary'}-subtle text-${map[status] || 'secondary'}`;
  };

  const filteredOrders = orders.filter(order =>
    (!filters.status || order.status === filters.status) &&
    (!filters.paymentStatus || order.paymentStatus === filters.paymentStatus) &&
    (!filters.search ||
      order.orderNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
      order.customer.toLowerCase().includes(filters.search.toLowerCase()) ||
      order.email.toLowerCase().includes(filters.search.toLowerCase()))
  );

  return (
    <div className="container-fliud py-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Orders</h2>
        <p className="text-muted mb-0">Manage customer orders</p>
      </div>

      {/* Filters */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label">Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search orders..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Order Status</label>
              <select
                className="form-select"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Payment Status</label>
              <select
                className="form-select"
                value={filters.paymentStatus}
                onChange={(e) =>
                  setFilters({ ...filters, paymentStatus: e.target.value })
                }
              >
                <option value="">All Payments</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="refunded">Refunded</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div className="col-md-3">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() =>
                  setFilters({ status: '', paymentStatus: '', search: '' })
                }
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Total</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>
                    <div className="fw-medium">{order.orderNumber}</div>
                    <small className="text-muted">{order.items} items</small>
                  </td>

                  <td>
                    <div className="d-flex align-items-center">
                      <div className="bg-light rounded-circle p-2 me-3">
                        <UserIcon width={20} className="text-muted" />
                      </div>
                      <div>
                        <div className="fw-medium">{order.customer}</div>
                        <small className="text-muted">{order.email}</small>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="d-flex align-items-center">
                      <CalendarIcon width={16} className="me-2 text-muted" />
                      {order.date}
                    </div>
                  </td>

                  <td>
                    <span className={statusBadge(order.status)}>
                      {order.status}
                    </span>
                  </td>

                  <td>
                    <span className={paymentBadge(order.paymentStatus)}>
                      {order.paymentStatus}
                    </span>
                  </td>

                  <td className="fw-semibold">
                    USh {order.total.toFixed(2)}
                  </td>

                  <td className="text-end">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      <EyeIcon width={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-5">
          <h5 className="fw-medium">No orders found</h5>
          <p className="text-muted">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};

export default OrdersView;




import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  Package,
  Star,
  Shield,
  Activity,
  Edit,
  Trash2,
  Send,
  RefreshCw,
  UserCheck,
  UserX,
  CreditCard,
  Clock,
  Award,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import useUserStore from '../../stores/admin/userStore';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import ErrorAlert from '../../components/admin/ErrorAlert';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

// Utility function to format currency in UGX
const formatUGX = (amount) => {
  if (amount === null || amount === undefined) return 'UGX 0';
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount).replace('UGX', 'UGX').trim();
};

// Utility function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-UG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Utility function to get customer tier based on total spent (UGX)
const getCustomerTier = (totalSpent) => {
  if (totalSpent >= 10000000) return { name: 'Platinum', color: 'purple', icon: Award }; // 10M+
  if (totalSpent >= 5000000) return { name: 'Gold', color: 'yellow', icon: Award };      // 5M+
  if (totalSpent >= 1000000) return { name: 'Silver', color: 'gray', icon: Star };       // 1M+
  if (totalSpent >= 500000) return { name: 'Bronze', color: 'orange', icon: Star };      // 500K
  return { name: 'Regular', color: 'blue', icon: Star };
};

// Utility function to get activity status based on last login
const getActivityStatus = (lastLoginAt) => {
  if (!lastLoginAt) return { status: 'Inactive', color: 'gray', icon: Minus };
  
  const daysSinceLastLogin = Math.floor((new Date() - new Date(lastLoginAt)) / (1000 * 60 * 60 * 24));
  
  if (daysSinceLastLogin <= 7) return { status: 'Active', color: 'green', icon: TrendingUp };
  if (daysSinceLastLogin <= 30) return { status: 'Recently Active', color: 'blue', icon: Activity };
  return { status: 'Inactive', color: 'gray', icon: TrendingDown };
};

// Utility function to get customer since
const getCustomerSince = (createdAt) => {
  if (!createdAt) return 'New customer';
  
  const months = Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24 * 30));
  if (months < 1) return 'New customer';
  if (months === 1) return '1 month';
  if (months < 12) return `${months} months`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? 's' : ''}`;
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, trend, trendUp, subtitle }) => (
  <div className="card shadow-sm h-100">
    <div className="card-body">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <h6 className="text-muted mb-0">{title}</h6>
        <div className="bg-light rounded p-2">
          <Icon size={20} className="text-primary" />
        </div>
      </div>
      <h4 className="fw-bold mb-1">{value}</h4>
      {trend && (
        <small className={trendUp ? 'text-success' : 'text-danger'}>
          {trendUp ? '↑' : '↓'} {trend}
        </small>
      )}
      {subtitle && <small className="text-muted d-block">{subtitle}</small>}
    </div>
  </div>
);

const CustomerDetailsView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    selectedCustomer,
    customerOrders,
    customerActivity,
    loading,
    error,
    fetchCustomerById,
    fetchCustomerOrders,
    fetchCustomerActivity,
    toggleUserStatus,
    updateUserRole,
    deleteCustomer,
    sendCustomerEmail,
    clearError
  } = useUserStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleToUpdate, setRoleToUpdate] = useState('');
  const [emailData, setEmailData] = useState({
    subject: '',
    message: ''
  });
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersLimit] = useState(10);

  useEffect(() => {
    if (id) {
      fetchCustomerById(id);
    }
  }, [id]);

  useEffect(() => {
    if (activeTab === 'orders' && selectedCustomer) {
      fetchCustomerOrders(selectedCustomer.id, { page: ordersPage, limit: ordersLimit });
    } else if (activeTab === 'activity' && selectedCustomer) {
      fetchCustomerActivity(selectedCustomer.id);
    }
  }, [activeTab, selectedCustomer, ordersPage]);

  const handleToggleStatus = async () => {
    try {
      await toggleUserStatus(selectedCustomer.id);
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  const handleDeleteCustomer = async () => {
    try {
      await deleteCustomer(selectedCustomer.id);
      navigate('/admin/customers');
    } catch (error) {
      console.error('Failed to delete customer:', error);
    }
  };

  const handleRoleUpdate = async () => {
    try {
      await updateUserRole(selectedCustomer.id, roleToUpdate);
      setShowRoleModal(false);
      setRoleToUpdate('');
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  const handleSendEmail = async () => {
    try {
      await sendCustomerEmail(selectedCustomer.id, emailData);
      setShowEmailModal(false);
      setEmailData({ subject: '', message: '' });
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  const handleEditProfile = () => {
    navigate(`/admin/customers/${id}/edit`);
  };

  const handleViewOrder = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  if (loading && !selectedCustomer) {
    return <LoadingSpinner />;
  }

  if (!selectedCustomer && !loading) {
    return (
      <div className="container py-5 text-center">
        <h3>Customer not found</h3>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => navigate('/admin/customers')}
        >
          Back to Customers
        </button>
      </div>
    );
  }

  const customer = selectedCustomer;
  const tier = getCustomerTier(customer.totalSpent || 0);
  const activity = getActivityStatus(customer.lastLoginAt);
  const TierIcon = tier.icon;
  const ActivityIcon = activity.icon;

  return (
    <div className="container-fluid py-4">
      {/* Error Alert */}
      {error && <ErrorAlert message={error} onClose={clearError} />}

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate('/admin/customers')}
          >
            <ArrowLeft size={18} />
          </button>

          <div className="d-flex align-items-center gap-3">
            <img
              src={customer.profilePicture || `https://ui-avatars.com/api/?name=${customer.userName || 'User'}&background=random&size=64`}
              alt={customer.userName}
              className="rounded-circle"
              width="64"
              height="64"
              style={{ objectFit: 'cover' }}
            />
            
            <div>
              <h3 className="fw-bold mb-1">{customer.userName}</h3>
              <div className="d-flex gap-2 flex-wrap">
                <span
                  className={`badge ${
                    customer.isActive 
                      ? 'bg-success' 
                      : 'bg-secondary'
                  } text-white`}
                >
                  {customer.isActive ? 'Active' : 'Inactive'}
                </span>
                
                <span className="badge bg-info text-white text-capitalize">
                  {customer.role || 'user'}
                </span>
                
                {customer.provider && customer.provider !== 'local' && (
                  <span className="badge bg-primary text-white">
                    {customer.provider}
                  </span>
                )}
                
                <span className={`badge bg-${tier.color} text-white`}>
                  <TierIcon size={12} className="me-1" />
                  {tier.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex gap-2">
          <button 
            className={`btn ${customer.isActive ? 'btn-warning' : 'btn-success'} d-flex align-items-center`}
            onClick={handleToggleStatus}
          >
            {customer.isActive ? (
              <>
                <UserX size={16} className="me-2" />
                Deactivate
              </>
            ) : (
              <>
                <UserCheck size={16} className="me-2" />
                Activate
              </>
            )}
          </button>
          
          <button 
            className="btn btn-outline-primary d-flex align-items-center"
            onClick={() => setShowEmailModal(true)}
          >
            <Send size={16} className="me-2" />
            Send Email
          </button>
          
          <div className="dropdown">
            <button 
              className="btn btn-outline-secondary dropdown-toggle" 
              type="button" 
              data-bs-toggle="dropdown"
            >
              More
            </button>
            <ul className="dropdown-menu">
              <li>
                <button 
                  className="dropdown-item d-flex align-items-center"
                  onClick={handleEditProfile}
                >
                  <Edit size={14} className="me-2" />
                  Edit Profile
                </button>
              </li>
              <li>
                <button 
                  className="dropdown-item d-flex align-items-center"
                  onClick={() => {
                    setShowRoleModal(true);
                    setRoleToUpdate(customer.role);
                  }}
                >
                  <Shield size={14} className="me-2" />
                  Change Role
                </button>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button 
                  className="dropdown-item text-danger d-flex align-items-center"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 size={14} className="me-2" />
                  Delete Customer
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <StatCard
            title="Total Orders"
            value={customer.totalOrders?.toString() || '0'}
            icon={ShoppingBag}
          />
        </div>
        
        <div className="col-sm-6 col-lg-3">
          <StatCard
            title="Total Spent"
            value={formatUGX(customer.totalSpent)}
            icon={DollarSign}
          />
        </div>
        
        <div className="col-sm-6 col-lg-3">
          <StatCard
            title="Avg Order Value"
            value={formatUGX(customer.averageOrderValue)}
            icon={Package}
          />
        </div>
        
        <div className="col-sm-6 col-lg-3">
          <StatCard
            title="Customer Since"
            value={formatDate(customer.createdAt)}
            icon={Calendar}
            subtitle={getCustomerSince(customer.createdAt)}
          />
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders ({customer.totalOrders || 0})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            Activity
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
        </li>
      </ul>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Contact Information */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="fw-semibold mb-4">
                Contact Information
              </h5>

              <div className="row g-4">
                <div className="col-md-6 d-flex">
                  <Mail size={20} className="text-muted me-3" />
                  <div>
                    <small className="text-muted">Email</small>
                    <div className="fw-medium">{customer.email}</div>
                  </div>
                </div>

                <div className="col-md-6 d-flex">
                  <Phone size={20} className="text-muted me-3" />
                  <div>
                    <small className="text-muted">Phone</small>
                    <div className="fw-medium">{customer.phone || 'Not provided'}</div>
                  </div>
                </div>

                <div className="col-md-6 d-flex">
                  <MapPin size={20} className="text-muted me-3" />
                  <div>
                    <small className="text-muted">Address</small>
                    <div className="fw-medium">
                      {customer.address || 'Not provided'}
                    </div>
                  </div>
                </div>

                <div className="col-md-6 d-flex">
                  <Calendar size={20} className="text-muted me-3" />
                  <div>
                    <small className="text-muted">Member Since</small>
                    <div className="fw-medium">
                      {formatDate(customer.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="fw-semibold mb-4">
                Account Information
              </h5>

              <div className="row g-4">
                <div className="col-md-6 d-flex">
                  <Shield size={20} className="text-muted me-3" />
                  <div>
                    <small className="text-muted">Role</small>
                    <div className="fw-medium text-capitalize">
                      {customer.role || 'user'}
                    </div>
                  </div>
                </div>

                <div className="col-md-6 d-flex">
                  <Award size={20} className="text-muted me-3" />
                  <div>
                    <small className="text-muted">Customer Tier</small>
                    <div className="fw-medium">
                      <span className={`badge bg-${tier.color} text-white`}>
                        <TierIcon size={12} className="me-1" />
                        {tier.name}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 d-flex">
                  <Clock size={20} className="text-muted me-3" />
                  <div>
                    <small className="text-muted">Last Login</small>
                    <div className="fw-medium">
                      {customer.lastLoginAt 
                        ? formatDate(customer.lastLoginAt)
                        : 'Never'}
                    </div>
                  </div>
                </div>

                <div className="col-md-6 d-flex">
                  <Activity size={20} className="text-muted me-3" />
                  <div>
                    <small className="text-muted">Activity Status</small>
                    <div className="fw-medium">
                      <span className={`badge bg-${activity.color} text-white`}>
                        <ActivityIcon size={12} className="me-1" />
                        {activity.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="fw-semibold mb-3">Order History</h5>
            
            {customerOrders && customerOrders.length > 0 ? (
              <>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Total (UGX)</th>
                        <th>Payment Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerOrders.map((order) => {
                        const orderTotal = order.totalAmount || order.total || 0;
                        return (
                          <tr key={order.id || order.orderId}>
                            <td>#{order.orderNumber || order.id}</td>
                            <td>{formatDate(order.createdAt)}</td>
                            <td>
                              <span className={`badge bg-${
                                order.status === 'completed' ? 'success' :
                                order.status === 'processing' ? 'info' :
                                order.status === 'pending' ? 'warning' :
                                order.status === 'cancelled' ? 'danger' : 'secondary'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td>{formatUGX(orderTotal)}</td>
                            <td>
                              <span className={`badge bg-${
                                order.paymentStatus === 'paid' ? 'success' :
                                order.paymentStatus === 'pending' ? 'warning' :
                                order.paymentStatus === 'failed' ? 'danger' : 'secondary'
                              }`}>
                                {order.paymentStatus || 'pending'}
                              </span>
                            </td>
                            <td>
                              <button 
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleViewOrder(order.id || order.orderId)}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination for orders */}
                {customerOrders.length >= ordersLimit && (
                  <div className="d-flex justify-content-center mt-3">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => setOrdersPage(prev => Math.max(1, prev - 1))}
                      disabled={ordersPage === 1}
                    >
                      Previous
                    </button>
                    <span className="mx-3">Page {ordersPage}</span>
                    <button
                      className="btn btn-sm btn-outline-primary ms-2"
                      onClick={() => setOrdersPage(prev => prev + 1)}
                      disabled={customerOrders.length < ordersLimit}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-5">
                <ShoppingBag size={48} className="text-muted mb-3" />
                <p className="text-muted">No orders found for this customer</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="fw-semibold mb-3">Recent Activity</h5>
            
            {customerActivity && customerActivity.length > 0 ? (
              <div className="list-group">
                {customerActivity.map((activity) => (
                  <div key={activity.id} className="list-group-item">
                    <div className="d-flex align-items-center gap-3">
                      <Activity size={16} className="text-muted" />
                      <div className="grow">
                        <div>{activity.description}</div>
                        <small className="text-muted">
                          {formatDate(activity.createdAt)}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <Activity size={48} className="text-muted mb-3" />
                <p className="text-muted">No activity found for this customer</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Details Tab */}
      {activeTab === 'details' && (
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="fw-semibold mb-3">Account Details</h5>
                
                <dl className="row mb-0">
                  <dt className="col-sm-4">User ID</dt>
                  <dd className="col-sm-8">{customer.id}</dd>
                  
                  <dt className="col-sm-4">Provider</dt>
                  <dd className="col-sm-8 text-capitalize">{customer.provider || 'local'}</dd>
                  
                  <dt className="col-sm-4">Provider ID</dt>
                  <dd className="col-sm-8">{customer.providerId || 'N/A'}</dd>
                  
                  <dt className="col-sm-4">Created</dt>
                  <dd className="col-sm-8">{formatDate(customer.createdAt)}</dd>
                  
                  <dt className="col-sm-4">Last Updated</dt>
                  <dd className="col-sm-8">{formatDate(customer.updatedAt)}</dd>
                </dl>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="fw-semibold mb-3">Statistics</h5>
                
                <dl className="row mb-0">
                  <dt className="col-sm-6">Total Orders</dt>
                  <dd className="col-sm-6">{customer.totalOrders || 0}</dd>
                  
                  <dt className="col-sm-6">Total Spent</dt>
                  <dd className="col-sm-6">{formatUGX(customer.totalSpent)}</dd>
                  
                  <dt className="col-sm-6">Average Order Value</dt>
                  <dd className="col-sm-6">{formatUGX(customer.averageOrderValue)}</dd>
                  
                  <dt className="col-sm-6">Wishlist Items</dt>
                  <dd className="col-sm-6">{customer.wishlistCount || 0}</dd>
                  
                  <dt className="col-sm-6">Last Order</dt>
                  <dd className="col-sm-6">
                    {customer.lastOrderDate ? formatDate(customer.lastOrderDate) : 'N/A'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        show={showDeleteConfirm}
        title="Delete Customer"
        message={`Are you sure you want to delete ${customer.userName}? This action cannot be undone.`}
        onConfirm={handleDeleteCustomer}
        onCancel={() => setShowDeleteConfirm(false)}
        variant="danger"
      />

      {/* Email Modal */}
      {showEmailModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Send Email to {customer.userName}</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowEmailModal(false)}
                />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    value={emailData.subject}
                    onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                    placeholder="Enter email subject"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-control"
                    rows="5"
                    value={emailData.message}
                    onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                    placeholder="Type your message here..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowEmailModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleSendEmail}
                  disabled={!emailData.subject || !emailData.message}
                >
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Update Modal */}
      {showRoleModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Role for {customer.userName}</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowRoleModal(false)}
                />
              </div>
              <div className="modal-body">
                <p>Current role: <strong className="text-capitalize">{customer.role || 'user'}</strong></p>
                <select 
                  className="form-select"
                  value={roleToUpdate}
                  onChange={(e) => setRoleToUpdate(e.target.value)}
                >
                  <option value="">Select new role...</option>
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowRoleModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleRoleUpdate}
                  disabled={!roleToUpdate}
                >
                  Update Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {(showEmailModal || showRoleModal) && (
        <div className="modal-backdrop show" />
      )}
    </div>
  );
};

export default CustomerDetailsView;


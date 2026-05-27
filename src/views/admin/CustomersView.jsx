import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  UserPlus, 
  Mail, 
  Phone, 
  Calendar,
  Download,
  RefreshCw,
  MoreVertical,
  CheckCircle,
  XCircle,
  UserX,
  UserCheck,
  Shield,
  Star,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingBag,
  DollarSign,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../stores/admin/userStore';
import Pagination from '../../components/admin/Pagination';
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
    day: 'numeric'
  });
};

// Utility function to get customer tier based on total spent (UGX)
const getCustomerTier = (totalSpent) => {
  if (totalSpent >= 10000000) return { name: 'Platinum', color: 'purple' }; // 10M+
  if (totalSpent >= 5000000) return { name: 'Gold', color: 'yellow' };      // 5M+
  if (totalSpent >= 1000000) return { name: 'Silver', color: 'gray' };      // 1M+
  if (totalSpent >= 500000) return { name: 'Bronze', color: 'orange' };     // 500K
  return { name: 'Regular', color: 'blue' };
};

// Utility function to get activity status based on last login
const getActivityStatus = (lastLoginAt) => {
  if (!lastLoginAt) return { status: 'Inactive', color: 'gray' };
  
  const daysSinceLastLogin = Math.floor((new Date() - new Date(lastLoginAt)) / (1000 * 60 * 60 * 24));
  
  if (daysSinceLastLogin <= 7) return { status: 'Active', color: 'green' };
  if (daysSinceLastLogin <= 30) return { status: 'Recently Active', color: 'blue' };
  return { status: 'Inactive', color: 'gray' };
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

const CustomerView = () => {
  const {
    customers,
    stats,
    loading,
    error,
    pagination,
    filters,
    selectedCustomers,
    fetchCustomers,
    fetchStats,
    toggleUserStatus,
    updateUserRole,
    deleteCustomer,
    bulkUpdateCustomers,
    exportCustomers,
    setFilters,
    resetFilters,
    selectCustomer,
    selectAllCustomers,
    clearSelection
  } = useUserStore();

  const navigate = useNavigate();
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedCustomerForAction, setSelectedCustomerForAction] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleToUpdate, setRoleToUpdate] = useState('');
  const [exportFormat, setExportFormat] = useState('csv');

  useEffect(() => {
    fetchCustomers();
    fetchStats();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    
    if (searchTimeout) clearTimeout(searchTimeout);
    
    setSearchTimeout(setTimeout(() => {
      setFilters({ search: value });
    }, 500));
  };

  const handleStatusFilter = (status) => {
    setFilters({ 
      isActive: status === 'all' ? null : status === 'active' 
    });
  };

  const handleSort = (field) => {
    setFilters({
      sortBy: field,
      sortOrder: filters.sortBy === field && filters.sortOrder === 'ASC' ? 'DESC' : 'ASC'
    });
  };

  const handleToggleStatus = async (customer) => {
    try {
      await toggleUserStatus(customer.id);
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  const handleDeleteCustomer = async () => {
    try {
      await deleteCustomer(selectedCustomerForAction.id);
      setShowDeleteConfirm(false);
      setSelectedCustomerForAction(null);
    } catch (error) {
      console.error('Failed to delete customer:', error);
    }
  };

  const handleRoleUpdate = async () => {
    try {
      await updateUserRole(selectedCustomerForAction.id, roleToUpdate);
      setShowRoleModal(false);
      setSelectedCustomerForAction(null);
      setRoleToUpdate('');
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedCustomers.length === 0) return;

    try {
      if (action === 'delete') {
        if (window.confirm(`Delete ${selectedCustomers.length} selected customers?`)) {
          await bulkUpdateCustomers('delete', { userIds: selectedCustomers });
          clearSelection();
        }
      } else if (action === 'activate') {
        await bulkUpdateCustomers('activate', { userIds: selectedCustomers });
        clearSelection();
      } else if (action === 'deactivate') {
        await bulkUpdateCustomers('deactivate', { userIds: selectedCustomers });
        clearSelection();
      }
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };

  const handleExport = async () => {
    try {
      await exportCustomers({ format: exportFormat });
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleViewDetails = (customerId) => {
    navigate(`/admin/customers/${customerId}`);
  };

  const handleAddCustomer = () => {
    navigate('/admin/customers/add');
  };

  if (loading && customers.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container-fluid py-4">
      {/* Error Alert */}
      {error && <ErrorAlert message={error} onClose={() => useUserStore.getState().clearError()} />}

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Customers</h2>
          <p className="text-muted mb-0">
            Manage your customer relationships
          </p>
        </div>
        
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-secondary d-flex align-items-center"
            onClick={() => fetchCustomers()}
          >
            <RefreshCw size={16} className="me-2" />
            Refresh
          </button>
          
          <button 
            className="btn btn-success d-flex align-items-center"
            onClick={handleAddCustomer}
          >
            <UserPlus size={16} className="me-2" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Stats Cards - Using Real Data */}
      {stats && (
        <div className="row g-3 mb-4">
          <div className="col-sm-6 col-lg-3">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="text-white-50 mb-2">Total Customers</h6>
                    <h3 className="mb-0">{stats.total || 0}</h3>
                    <small className="text-white-50">
                      {stats.active || 0} active · {stats.inactive || 0} inactive
                    </small>
                  </div>
                  <Users size={24} className="text-white-50" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-sm-6 col-lg-3">
            <div className="card bg-success text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="text-white-50 mb-2">Active Now</h6>
                    <h3 className="mb-0">
                      {stats.recentlyActive || 0}
                    </h3>
                    <small className="text-white-50">Last 30 minutes</small>
                  </div>
                  <Clock size={24} className="text-white-50" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-sm-6 col-lg-3">
            <div className="card bg-info text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="text-white-50 mb-2">Avg Order Value</h6>
                    <h3 className="mb-0">{formatUGX(stats.orders?.avgOrderValue || 0)}</h3>
                    <small className="text-white-50">
                      {stats.orders?.totalOrders || 0} total orders
                    </small>
                  </div>
                  <ShoppingBag size={24} className="text-white-50" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-sm-6 col-lg-3">
            <div className="card bg-warning text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="text-white-50 mb-2">Total Revenue</h6>
                    <h3 className="mb-0">{formatUGX(stats.orders?.totalRevenue || 0)}</h3>
                    <small className="text-white-50">Lifetime value</small>
                  </div>
                  <DollarSign size={24} className="text-white-50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-5 position-relative">
              <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Search customers by name, email, phone..."
                defaultValue={filters.search}
                onChange={handleSearch}
              />
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={filters.isActive === null ? 'all' : filters.isActive ? 'active' : 'inactive'}
                onChange={(e) => handleStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.provider || 'all'}
                onChange={(e) => setFilters({ provider: e.target.value === 'all' ? null : e.target.value })}
              >
                <option value="all">All Providers</option>
                <option value="local">Local</option>
                <option value="google">Google</option>
                <option value="apple">Apple</option>
              </select>
            </div>

            <div className="col-md-2 d-flex gap-2">
              <button 
                className={`btn ${showFilters ? 'btn-primary' : 'btn-outline-secondary'} d-flex align-items-center flex-1`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} className="me-2" />
                Filters
              </button>

              <div className="dropdown">
                <button 
                  className="btn btn-outline-secondary dropdown-toggle" 
                  type="button" 
                  data-bs-toggle="dropdown"
                >
                  <Download size={16} />
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button 
                      className="dropdown-item" 
                      onClick={() => {
                        setExportFormat('csv');
                        handleExport();
                      }}
                    >
                      Export as CSV
                    </button>
                  </li>
                  <li>
                    <button 
                      className="dropdown-item" 
                      onClick={() => {
                        setExportFormat('excel');
                        handleExport();
                      }}
                    >
                      Export as Excel
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="row mt-3 pt-3 border-top">
              <div className="col-md-3">
                <label className="form-label">Min Spent (UGX)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="0"
                  value={filters.minSpent || ''}
                  onChange={(e) => setFilters({ minSpent: e.target.value || null })}
                />
              </div>
              
              <div className="col-md-3">
                <label className="form-label">Max Spent (UGX)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="10000000"
                  value={filters.maxSpent || ''}
                  onChange={(e) => setFilters({ maxSpent: e.target.value || null })}
                />
              </div>
              
              <div className="col-md-3">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={filters.startDate || ''}
                  onChange={(e) => setFilters({ startDate: e.target.value || null })}
                />
              </div>
              
              <div className="col-md-3">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={filters.endDate || ''}
                  onChange={(e) => setFilters({ endDate: e.target.value || null })}
                />
              </div>
              
              <div className="col-12 mt-3">
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={resetFilters}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedCustomers.length > 0 && (
        <div className="card bg-light mb-4">
          <div className="card-body py-2">
            <div className="d-flex align-items-center justify-content-between">
              <span>
                <strong>{selectedCustomers.length}</strong> customers selected
              </span>
              
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-sm btn-success"
                  onClick={() => handleBulkAction('activate')}
                >
                  <UserCheck size={14} className="me-1" />
                  Activate
                </button>
                
                <button 
                  className="btn btn-sm btn-warning"
                  onClick={() => handleBulkAction('deactivate')}
                >
                  <UserX size={14} className="me-1" />
                  Deactivate
                </button>
                
                <button 
                  className="btn btn-sm btn-danger"
                  onClick={() => handleBulkAction('delete')}
                >
                  Delete
                </button>
                
                <button 
                  className="btn btn-sm btn-outline-secondary"
                  onClick={clearSelection}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Cards */}
      <div className="row g-4">
        {customers.map((customer) => {
          const tier = getCustomerTier(customer.totalSpent || 0);
          const activity = getActivityStatus(customer.lastLoginAt);
          const customerSince = getCustomerSince(customer.createdAt);
          
          return (
            <div key={customer.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm hover-shadow">
                <div className="card-body">
                  {/* Selection Checkbox */}
                  <div className="form-check mb-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={() => selectCustomer(customer.id)}
                    />
                  </div>

                  <div 
                    className="text-decoration-none text-dark"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleViewDetails(customer.id)}
                  >
                    <div className="d-flex justify-content-between mb-3">
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={customer.profilePicture || `https://ui-avatars.com/api/?name=${customer.userName || 'User'}&background=random`}
                          alt={customer.userName}
                          className="rounded-circle"
                          width="48"
                          height="48"
                          style={{ objectFit: 'cover' }}
                        />
                        <div>
                          <h5 className="fw-bold mb-1">{customer.userName}</h5>
                          <div className="d-flex gap-2 flex-wrap">
                            <span
                              className={`badge ${
                                customer.isActive 
                                  ? 'bg-success-subtle text-success' 
                                  : 'bg-secondary-subtle text-secondary'
                              }`}
                            >
                              {customer.isActive ? 'Active' : 'Inactive'}
                            </span>
                            
                            {customer.provider && customer.provider !== 'local' && (
                              <span className="badge bg-info-subtle text-info">
                                {customer.provider}
                              </span>
                            )}
                            
                            {customer.role && customer.role !== 'user' && (
                              <span className="badge bg-primary-subtle text-primary">
                                {customer.role}
                              </span>
                            )}
                            
                            <span className={`badge bg-${tier.color}-subtle text-${tier.color}`}>
                              {tier.name}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="dropdown">
                        <button 
                          className="btn btn-link text-dark p-0" 
                          type="button" 
                          data-bs-toggle="dropdown"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical size={18} />
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <button 
                              className="dropdown-item d-flex align-items-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCustomerForAction(customer);
                                handleToggleStatus(customer);
                              }}
                            >
                              {customer.isActive ? (
                                <>
                                  <UserX size={14} className="me-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <UserCheck size={14} className="me-2" />
                                  Activate
                                </>
                              )}
                            </button>
                          </li>
                          <li>
                            <button 
                              className="dropdown-item d-flex align-items-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCustomerForAction(customer);
                                setShowRoleModal(true);
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
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCustomerForAction(customer);
                                setShowDeleteConfirm(true);
                              }}
                            >
                              <UserX size={14} className="me-2" />
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="small text-muted mb-2 d-flex align-items-center">
                      <Mail size={14} className="me-2" />
                      {customer.email}
                    </div>
                    
                    <div className="small text-muted mb-2 d-flex align-items-center">
                      <Phone size={14} className="me-2" />
                      {customer.phone || 'No phone provided'}
                    </div>
                    
                    <div className="small text-muted mb-3 d-flex align-items-center">
                      <Calendar size={14} className="me-2" />
                      Joined {formatDate(customer.createdAt)}
                    </div>

                    {/* Stats */}
                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <div className="bg-light rounded p-2 text-center">
                          <small className="text-muted d-block">Orders</small>
                          <strong>{customer.totalOrders || 0}</strong>
                        </div>
                      </div>
                      
                      <div className="col-6">
                        <div className="bg-light rounded p-2 text-center">
                          <small className="text-muted d-block">Spent</small>
                          <strong>{formatUGX(customer.totalSpent)}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Activity Status */}
                    <div className="d-flex align-items-center gap-2">
                      <span className={`badge bg-${activity.color} text-white`}>
                        {activity.status}
                      </span>
                      
                      {customer.lastOrderDate && (
                        <small className="text-muted">
                          Last order: {formatDate(customer.lastOrderDate)}
                        </small>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className="card-footer bg-white d-flex justify-content-between align-items-center"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleViewDetails(customer.id)}
                >
                  <div className="text-muted small">
                    <Star size={14} className="me-1 text-warning" />
                    {customerSince}
                  </div>

                  <span className="text-primary fw-medium">
                    View Details →
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {customers.length === 0 && !loading && (
        <div className="text-center py-5">
          <UserPlus size={64} className="text-muted mb-3" />
          <h5>No customers found</h5>
          <p className="text-muted">
            Try adjusting your search filters or add a new customer
          </p>
          <button 
            className="btn btn-primary"
            onClick={handleAddCustomer}
          >
            <UserPlus size={16} className="me-2" />
            Add Customer
          </button>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={(page) => fetchCustomers(page)}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        show={showDeleteConfirm}
        title="Delete Customer"
        message={`Are you sure you want to delete ${selectedCustomerForAction?.userName}? This action cannot be undone.`}
        onConfirm={handleDeleteCustomer}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setSelectedCustomerForAction(null);
        }}
        variant="danger"
      />

      {/* Role Update Modal */}
      {showRoleModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update User Role</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => {
                    setShowRoleModal(false);
                    setSelectedCustomerForAction(null);
                  }}
                />
              </div>
              <div className="modal-body">
                <p>Update role for <strong>{selectedCustomerForAction?.userName}</strong></p>
                
                <select 
                  className="form-select"
                  value={roleToUpdate}
                  onChange={(e) => setRoleToUpdate(e.target.value)}
                >
                  <option value="">Select role...</option>
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowRoleModal(false);
                    setSelectedCustomerForAction(null);
                  }}
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
      
      {/* Modal Backdrop for role modal */}
      {showRoleModal && <div className="modal-backdrop show" />}
    </div>
  );
};

export default CustomerView;


// import React, { useState, useEffect } from 'react';
// import { 
//   Search, 
//   Filter, 
//   UserPlus, 
//   Mail, 
//   Phone, 
//   Calendar,
//   Download,
//   RefreshCw,
//   MoreVertical,
//   CheckCircle,
//   XCircle,
//   UserX,
//   UserCheck,
//   Shield,
//   Star
// } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import useUserStore from '../../stores/admin/userStore';
// // import AdminCustomerModel from '../models/AdminCustomerModel';
// import Pagination from '../../components/admin/Pagination';
// import LoadingSpinner from '../../components/admin/LoadingSpinner';
// import ErrorAlert from '../../components/admin/ErrorAlert';
// import ConfirmDialog from '../../components/admin/ConfirmDialog';

// const CustomerView = () => {
//   const {
//     customers,
//     stats,
//     loading,
//     error,
//     pagination,
//     filters,
//     selectedCustomers,
//     fetchCustomers,
//     fetchStats,
//     toggleUserStatus,
//     updateUserRole,
//     deleteCustomer,
//     bulkUpdateCustomers,
//     exportCustomers,
//     setFilters,
//     resetFilters,
//     selectCustomer,
//     selectAllCustomers,
//     clearSelection
//   } = useUserStore();

//   const [searchTimeout, setSearchTimeout] = useState(null);
//   const [showFilters, setShowFilters] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [selectedCustomerForAction, setSelectedCustomerForAction] = useState(null);
//   const [showRoleModal, setShowRoleModal] = useState(false);
//   const [roleToUpdate, setRoleToUpdate] = useState('');
//   const [exportFormat, setExportFormat] = useState('csv');
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchCustomers();
//     fetchStats();
//   }, []);

//   const handleSearch = (e) => {
//     const value = e.target.value;
    
//     if (searchTimeout) clearTimeout(searchTimeout);
    
//     setSearchTimeout(setTimeout(() => {
//       setFilters({ search: value });
//     }, 500));
//   };

//   const handleStatusFilter = (status) => {
//     setFilters({ 
//       isActive: status === 'all' ? null : status === 'active' 
//     });
//   };

//   const handleSort = (field) => {
//     setFilters({
//       sortBy: field,
//       sortOrder: filters.sortBy === field && filters.sortOrder === 'ASC' ? 'DESC' : 'ASC'
//     });
//   };

//   const handleToggleStatus = async (customer) => {
//     try {
//       await toggleUserStatus(customer.id);
//     } catch (error) {
//       console.error('Failed to toggle status:', error);
//     }
//   };

//   const handleDeleteCustomer = async () => {
//     try {
//       await deleteCustomer(selectedCustomerForAction.id);
//       setShowDeleteConfirm(false);
//       setSelectedCustomerForAction(null);
//     } catch (error) {
//       console.error('Failed to delete customer:', error);
//     }
//   };

//   const handleRoleUpdate = async () => {
//     try {
//       await updateUserRole(selectedCustomerForAction.id, roleToUpdate);
//       setShowRoleModal(false);
//       setSelectedCustomerForAction(null);
//       setRoleToUpdate('');
//     } catch (error) {
//       console.error('Failed to update role:', error);
//     }
//   };

//   const handleBulkAction = async (action) => {
//     if (selectedCustomers.length === 0) return;

//     try {
//       if (action === 'delete') {
//         if (window.confirm(`Delete ${selectedCustomers.length} selected customers?`)) {
//           await bulkUpdateCustomers('delete', { userIds: selectedCustomers });
//           clearSelection();
//         }
//       } else if (action === 'activate') {
//         await bulkUpdateCustomers('activate', { userIds: selectedCustomers });
//         clearSelection();
//       } else if (action === 'deactivate') {
//         await bulkUpdateCustomers('deactivate', { userIds: selectedCustomers });
//         clearSelection();
//       }
//     } catch (error) {
//       console.error('Bulk action failed:', error);
//     }
//   };

//   const handleExport = async () => {
//     try {
//       await exportCustomers({ format: exportFormat });
//     } catch (error) {
//       console.error('Export failed:', error);
//     }
//   };

//   if (loading && customers.length === 0) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div className="container-fluid py-4">
//       {/* Error Alert */}
//       {error && <ErrorAlert message={error} onClose={() => useUserStore.getState().clearError()} />}

//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h2 className="fw-bold mb-1">Customers</h2>
//           <p className="text-muted mb-0">
//             Manage your customer relationships
//           </p>
//         </div>
        
//         <div className="d-flex gap-2">
//           <button 
//             className="btn btn-outline-secondary d-flex align-items-center"
//             onClick={() => fetchCustomers()}
//           >
//             <RefreshCw size={16} className="me-2" />
//             Refresh
//           </button>
          
//           <button 
//             className="btn btn-success d-flex align-items-center"
//             data-bs-toggle="modal"
//             data-bs-target="#addCustomerModal"
//           >
//             <UserPlus size={16} className="me-2" />
//             Add Customer
//           </button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       {stats && (
//         <div className="row g-3 mb-4">
//           <div className="col-sm-6 col-lg-3">
//             <div className="card bg-primary text-white">
//               <div className="card-body">
//                 <h6 className="text-white-50 mb-2">Total Customers</h6>
//                 <h3 className="mb-0">{stats.byRole?.user || 0}</h3>
//                 <small className="text-white-50">
//                   {stats.active} active · {stats.inactive} inactive
//                 </small>
//               </div>
//             </div>
//           </div>
          
//           <div className="col-sm-6 col-lg-3">
//             <div className="card bg-success text-white">
//               <div className="card-body">
//                 <h6 className="text-white-50 mb-2">Active Now</h6>
//                 <h3 className="mb-0">24</h3>
//                 <small className="text-white-50">Last 30 minutes</small>
//               </div>
//             </div>
//           </div>
          
//           <div className="col-sm-6 col-lg-3">
//             <div className="card bg-info text-white">
//               <div className="card-body">
//                 <h6 className="text-white-50 mb-2">Avg Order Value</h6>
//                 <h3 className="mb-0">$156.32</h3>
//                 <small className="text-white-50">↑ 12% from last month</small>
//               </div>
//             </div>
//           </div>
          
//           <div className="col-sm-6 col-lg-3">
//             <div className="card bg-warning text-white">
//               <div className="card-body">
//                 <h6 className="text-white-50 mb-2">Loyal Customers</h6>
//                 <h3 className="mb-0">347</h3>
//                 <small className="text-white-50">5+ orders</small>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Search & Filters */}
//       <div className="card shadow-sm mb-4">
//         <div className="card-body">
//           <div className="row g-3">
//             <div className="col-md-5 position-relative">
//               <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
//               <input
//                 type="text"
//                 className="form-control ps-5"
//                 placeholder="Search customers by name, email, phone..."
//                 defaultValue={filters.search}
//                 onChange={handleSearch}
//               />
//             </div>

//             <div className="col-md-3">
//               <select
//                 className="form-select"
//                 value={filters.isActive === null ? 'all' : filters.isActive ? 'active' : 'inactive'}
//                 onChange={(e) => handleStatusFilter(e.target.value)}
//               >
//                 <option value="all">All Status</option>
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>
//             </div>

//             <div className="col-md-2">
//               <select
//                 className="form-select"
//                 value={filters.provider || 'all'}
//                 onChange={(e) => setFilters({ provider: e.target.value === 'all' ? null : e.target.value })}
//               >
//                 <option value="all">All Providers</option>
//                 <option value="local">Local</option>
//                 <option value="google">Google</option>
//                 <option value="apple">Apple</option>
//               </select>
//             </div>

//             <div className="col-md-2 d-flex gap-2">
//               <button 
//                 className={`btn ${showFilters ? 'btn-primary' : 'btn-outline-secondary'} d-flex align-items-center flex-1`}
//                 onClick={() => setShowFilters(!showFilters)}
//               >
//                 <Filter size={16} className="me-2" />
//                 Filters
//               </button>

//               <div className="dropdown">
//                 <button 
//                   className="btn btn-outline-secondary dropdown-toggle" 
//                   type="button" 
//                   data-bs-toggle="dropdown"
//                 >
//                   <Download size={16} />
//                 </button>
//                 <ul className="dropdown-menu">
//                   <li>
//                     <button 
//                       className="dropdown-item" 
//                       onClick={() => {
//                         setExportFormat('csv');
//                         handleExport();
//                       }}
//                     >
//                       Export as CSV
//                     </button>
//                   </li>
//                   <li>
//                     <button 
//                       className="dropdown-item" 
//                       onClick={() => {
//                         setExportFormat('excel');
//                         handleExport();
//                       }}
//                     >
//                       Export as Excel
//                     </button>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>

//           {/* Advanced Filters */}
//           {showFilters && (
//             <div className="row mt-3 pt-3 border-top">
//               <div className="col-md-3">
//                 <label className="form-label">Min Spent</label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   placeholder="0"
//                   value={filters.minSpent || ''}
//                   onChange={(e) => setFilters({ minSpent: e.target.value || null })}
//                 />
//               </div>
              
//               <div className="col-md-3">
//                 <label className="form-label">Max Spent</label>
//                 <input
//                   type="number"
//                   className="form-control"
//                   placeholder="10000"
//                   value={filters.maxSpent || ''}
//                   onChange={(e) => setFilters({ maxSpent: e.target.value || null })}
//                 />
//               </div>
              
//               <div className="col-md-3">
//                 <label className="form-label">Start Date</label>
//                 <input
//                   type="date"
//                   className="form-control"
//                   value={filters.startDate || ''}
//                   onChange={(e) => setFilters({ startDate: e.target.value || null })}
//                 />
//               </div>
              
//               <div className="col-md-3">
//                 <label className="form-label">End Date</label>
//                 <input
//                   type="date"
//                   className="form-control"
//                   value={filters.endDate || ''}
//                   onChange={(e) => setFilters({ endDate: e.target.value || null })}
//                 />
//               </div>
              
//               <div className="col-12 mt-3">
//                 <button 
//                   className="btn btn-outline-secondary btn-sm"
//                   onClick={resetFilters}
//                 >
//                   Reset Filters
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Bulk Actions */}
//       {selectedCustomers.length > 0 && (
//         <div className="card bg-light mb-4">
//           <div className="card-body py-2">
//             <div className="d-flex align-items-center justify-content-between">
//               <span>
//                 <strong>{selectedCustomers.length}</strong> customers selected
//               </span>
              
//               <div className="d-flex gap-2">
//                 <button 
//                   className="btn btn-sm btn-success"
//                   onClick={() => handleBulkAction('activate')}
//                 >
//                   <UserCheck size={14} className="me-1" />
//                   Activate
//                 </button>
                
//                 <button 
//                   className="btn btn-sm btn-warning"
//                   onClick={() => handleBulkAction('deactivate')}
//                 >
//                   <UserX size={14} className="me-1" />
//                   Deactivate
//                 </button>
                
//                 <button 
//                   className="btn btn-sm btn-danger"
//                   onClick={() => handleBulkAction('delete')}
//                 >
//                   Delete
//                 </button>
                
//                 <button 
//                   className="btn btn-sm btn-outline-secondary"
//                   onClick={clearSelection}
//                 >
//                   Clear
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Customer Cards */}
//       <div className="row g-4">
//         {customers.map((customer) => (
//           <div key={customer.id} className="col-md-6 col-lg-4">
//             <div className="card h-100 shadow-sm hover-shadow">
//               <div className="card-body">
//                 {/* Selection Checkbox */}
//                 <div className="form-check mb-2">
//                   <input
//                     type="checkbox"
//                     className="form-check-input"
//                     checked={selectedCustomers.includes(customer.id)}
//                     onChange={() => selectCustomer(customer.id)}
//                   />
//                 </div>

//                 <Link
//                   to={`/admin/customers/${customer.id}`}
//                   className="text-decoration-none text-dark"
//                 >
//                   <div className="d-flex justify-content-between mb-3">
//                     <div className="d-flex align-items-center gap-3">
//                       <img
//                         src={customer.profilePicture || `https://ui-avatars.com/api/?name=${customer.userName}&background=random`}
//                         alt={customer.userName}
//                         className="rounded-circle"
//                         width="48"
//                         height="48"
//                         style={{ objectFit: 'cover' }}
//                       />
//                       <div>
//                         <h5 className="fw-bold mb-1">{customer.userName}</h5>
//                         <div className="d-flex gap-2">
//                           <span
//                             className={`badge ${
//                               customer.isActive 
//                                 ? 'bg-success-subtle text-success' 
//                                 : 'bg-secondary-subtle text-secondary'
//                             }`}
//                           >
//                             {customer.isActive ? 'Active' : 'Inactive'}
//                           </span>
                          
//                           {customer.provider !== 'local' && (
//                             <span className="badge bg-info-subtle text-info">
//                               {customer.provider}
//                             </span>
//                           )}
                          
//                           <span className={`badge ${customer.getTierColor()} text-white`}>
//                             {customer.getCustomerTier()}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div className="dropdown">
//                       <button 
//                         className="btn btn-link text-dark p-0" 
//                         type="button" 
//                         data-bs-toggle="dropdown"
//                       >
//                         <MoreVertical size={18} />
//                       </button>
//                       <ul className="dropdown-menu">
//                         <li>
//                           <button 
//                             className="dropdown-item d-flex align-items-center"
//                             onClick={() => {
//                               setSelectedCustomerForAction(customer);
//                               handleToggleStatus(customer);
//                             }}
//                           >
//                             {customer.isActive ? (
//                               <>
//                                 <UserX size={14} className="me-2" />
//                                 Deactivate
//                               </>
//                             ) : (
//                               <>
//                                 <UserCheck size={14} className="me-2" />
//                                 Activate
//                               </>
//                             )}
//                           </button>
//                         </li>
//                         <li>
//                           <button 
//                             className="dropdown-item d-flex align-items-center"
//                             onClick={() => {
//                               setSelectedCustomerForAction(customer);
//                               setShowRoleModal(true);
//                             }}
//                           >
//                             <Shield size={14} className="me-2" />
//                             Change Role
//                           </button>
//                         </li>
//                         <li><hr className="dropdown-divider" /></li>
//                         <li>
//                           <button 
//                             className="dropdown-item text-danger d-flex align-items-center"
//                             onClick={() => {
//                               setSelectedCustomerForAction(customer);
//                               setShowDeleteConfirm(true);
//                             }}
//                           >
//                             <UserX size={14} className="me-2" />
//                             Delete
//                           </button>
//                         </li>
//                       </ul>
//                     </div>
//                   </div>

//                   <div className="small text-muted mb-2 d-flex align-items-center">
//                     <Mail size={14} className="me-2" />
//                     {customer.email}
//                   </div>
                  
//                   <div className="small text-muted mb-2 d-flex align-items-center">
//                     <Phone size={14} className="me-2" />
//                     {customer.phone || 'No phone provided'}
//                   </div>
                  
//                   <div className="small text-muted mb-3 d-flex align-items-center">
//                     <Calendar size={14} className="me-2" />
//                     Joined {customer.createdAt.toLocaleDateString()}
//                   </div>

//                   {/* Stats */}
//                   <div className="row g-2 mb-3">
//                     <div className="col-6">
//                       <div className="bg-light rounded p-2 text-center">
//                         <small className="text-muted d-block">Orders</small>
//                         <strong>{customer.totalOrders}</strong>
//                       </div>
//                     </div>
                    
//                     <div className="col-6">
//                       <div className="bg-light rounded p-2 text-center">
//                         <small className="text-muted d-block">Spent</small>
//                         <strong>{customer.getLifetimeValue()}</strong>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Activity Status */}
//                   <div className="d-flex align-items-center gap-2">
//                     <span className={`badge ${customer.getActivityColor()} text-white`}>
//                       {customer.getActivityStatus()}
//                     </span>
                    
//                     {customer.lastOrderDate && (
//                       <small className="text-muted">
//                         Last order: {customer.lastOrderDate.toLocaleDateString()}
//                       </small>
//                     )}
//                   </div>
//                 </Link>
//               </div>


//               <div
//                 className="card-footer bg-white d-flex justify-content-between align-items-center"
//                 style={{ cursor: "pointer" }}
//                 onClick={() => navigate(`admin/customers/${customer.id}`)}
//               >
//                 <div className="text-muted small">
//                   <Star size={14} className="me-1 text-warning" />
//                   {customer.getCustomerSince()}
//                 </div>

//                 <span className="text-primary fw-medium">
//                   View Details →
//                 </span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Empty State */}
//       {customers.length === 0 && !loading && (
//         <div className="text-center py-5">
//           <UserPlus size={64} className="text-muted mb-3" />
//           <h5>No customers found</h5>
//           <p className="text-muted">
//             Try adjusting your search filters or add a new customer
//           </p>
//           <button 
//             className="btn btn-primary"
//             data-bs-toggle="modal"
//             data-bs-target="#addCustomerModal"
//           >
//             <UserPlus size={16} className="me-2" />
//             Add Customer
//           </button>
//         </div>
//       )}

//       {/* Pagination */}
//       {pagination.pages > 1 && (
//         <div className="mt-4">
//           <Pagination
//             currentPage={pagination.page}
//             totalPages={pagination.pages}
//             onPageChange={(page) => fetchCustomers(page)}
//           />
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       <ConfirmDialog
//         show={showDeleteConfirm}
//         title="Delete Customer"
//         message={`Are you sure you want to delete ${selectedCustomerForAction?.userName}? This action cannot be undone.`}
//         onConfirm={handleDeleteCustomer}
//         onCancel={() => {
//           setShowDeleteConfirm(false);
//           setSelectedCustomerForAction(null);
//         }}
//         variant="danger"
//       />

//       {/* Role Update Modal */}
//       {showRoleModal && (
//         <div className="modal show d-block" tabIndex="-1">
//           <div className="modal-dialog">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">Update User Role</h5>
//                 <button 
//                   type="button" 
//                   className="btn-close"
//                   onClick={() => {
//                     setShowRoleModal(false);
//                     setSelectedCustomerForAction(null);
//                   }}
//                 />
//               </div>
//               <div className="modal-body">
//                 <p>Update role for <strong>{selectedCustomerForAction?.userName}</strong></p>
                
//                 <select 
//                   className="form-select"
//                   value={roleToUpdate}
//                   onChange={(e) => setRoleToUpdate(e.target.value)}
//                 >
//                   <option value="">Select role...</option>
//                   <option value="user">User</option>
//                   <option value="moderator">Moderator</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </div>
//               <div className="modal-footer">
//                 <button 
//                   type="button" 
//                   className="btn btn-secondary"
//                   onClick={() => {
//                     setShowRoleModal(false);
//                     setSelectedCustomerForAction(null);
//                   }}
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   type="button" 
//                   className="btn btn-primary"
//                   onClick={handleRoleUpdate}
//                   disabled={!roleToUpdate}
//                 >
//                   Update Role
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomerView;
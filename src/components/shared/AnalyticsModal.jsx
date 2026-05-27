import React, { useState, useEffect } from 'react';
import { XMarkIcon, ChartBarIcon, ArrowTrendingUpIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

const AnalyticsModal = ({ isOpen, onClose, productId, productName, onLoadAnalytics }) => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    if (isOpen && productId && onLoadAnalytics) {
      loadAnalytics();
    }
  }, [isOpen, productId, period]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const data = await onLoadAnalytics(productId, period);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const periods = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ];

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <ChartBarIcon width={20} />
              {productName} - Analytics
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <div className="modal-body">
            {/* Period Selector */}
            <div className="mb-4">
              <div className="btn-group" role="group">
                {periods.map(p => (
                  <button
                    key={p.value}
                    className={`btn btn-outline-secondary ${period === p.value ? 'active' : ''}`}
                    onClick={() => setPeriod(p.value)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : analytics ? (
              <div className="row g-3">
                {/* Sales Metrics */}
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <h6 className="card-title d-flex align-items-center gap-2">
                        <ShoppingCartIcon width={16} />
                        Sales Performance
                      </h6>
                      <div className="mt-3">
                        <div className="d-flex justify-content-between mb-2">
                          <span>Total Sales</span>
                          <strong className="text-primary">
                            ${analytics.totalSales?.toFixed(2) || '0.00'}
                          </strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Units Sold</span>
                          <strong>{analytics.unitsSold || 0}</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Average Order Value</span>
                          <strong>${analytics.averageOrderValue?.toFixed(2) || '0.00'}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Views & Engagement */}
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <h6 className="card-title d-flex align-items-center gap-2">
                        <EyeIcon width={16} />
                        Engagement
                      </h6>
                      <div className="mt-3">
                        <div className="d-flex justify-content-between mb-2">
                          <span>Page Views</span>
                          <strong>{analytics.pageViews || 0}</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Add to Cart Rate</span>
                          <strong>{(analytics.addToCartRate || 0).toFixed(1)}%</strong>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Conversion Rate</span>
                          <strong>{(analytics.conversionRate || 0).toFixed(1)}%</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                {analytics.recentActivity && (
                  <div className="col-12">
                    <div className="card">
                      <div className="card-body">
                        <h6 className="card-title">Recent Activity</h6>
                        <div className="table-responsive">
                          <table className="table table-sm">
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Action</th>
                                <th>Details</th>
                              </tr>
                            </thead>
                            <tbody>
                              {analytics.recentActivity.map((activity, index) => (
                                <tr key={index}>
                                  <td>{new Date(activity.date).toLocaleDateString()}</td>
                                  <td>{activity.action}</td>
                                  <td>{activity.details}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-5">
                <p className="text-muted">No analytics data available</p>
              </div>
            )}
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={loadAnalytics} disabled={isLoading}>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModal;
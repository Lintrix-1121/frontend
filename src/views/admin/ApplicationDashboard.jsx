// pages/admin/career/AdminCareerDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCareerStore from '../../stores/shared/careerStore';

const ApplicationDashboard = () => {
  const navigate = useNavigate();
  const {
    applications,
    jobs,
    loading,
    error,
    fetchApplications,
    fetchJobs,
    updateApplicationStatus
  } = useCareerStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({ status: '', notes: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      fetchApplications(),
      fetchJobs({ isActive: undefined })
    ]);
  };

  const handleStatusUpdate = async (applicationId) => {
    if (!statusUpdate.status) return;

    const result = await updateApplicationStatus(
      applicationId,
      statusUpdate.status,
      statusUpdate.notes
    );

    if (result.success) {
      setShowApplicationModal(false);
      setSelectedApplication(null);
      setStatusUpdate({ status: '', notes: '' });
      await fetchApplications();
    }
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      'APPLIED': 'bg-primary',
      'REVIEWED': 'bg-info',
      'SHORTLISTED': 'bg-success',
      'INTERVIEW_SCHEDULED': 'bg-warning text-dark',
      'INTERVIEWED': 'bg-secondary',
      'OFFERED': 'bg-success',
      'REJECTED': 'bg-danger',
      'WITHDRAWN': 'bg-dark'
    };
    return classes[status] || 'bg-secondary';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPLIED': return 'fa-file-alt';
      case 'REVIEWED': return 'fa-eye';
      case 'SHORTLISTED': return 'fa-check-circle';
      case 'INTERVIEW_SCHEDULED': return 'fa-calendar';
      case 'INTERVIEWED': return 'fa-users';
      case 'OFFERED': return 'fa-chart-line';
      case 'REJECTED': return 'fa-times-circle';
      case 'WITHDRAWN': return 'fa-exclamation-circle';
      default: return 'fa-file-alt';
    }
  };

  // Calculate statistics
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(app => 
    ['APPLIED', 'REVIEWED'].includes(app.status)
  ).length;
  const shortlistedApplications = applications.filter(app => 
    ['SHORTLISTED', 'INTERVIEW_SCHEDULED', 'INTERVIEWED'].includes(app.status)
  ).length;
  const hiredApplications = applications.filter(app => app.status === 'OFFERED').length;
  const rejectedApplications = applications.filter(app => app.status === 'REJECTED').length;

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.applicantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || app.status === statusFilter;
    const matchesDepartment = !departmentFilter || app.job?.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const uniqueDepartments = [...new Set(jobs.map(job => job.department))];

  return (
    <div className="bg-light min-vh-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container-fluid py-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h2 mb-1">Application Management</h1>
              <p className="text-muted mb-0">Track and manage all job applications</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row g-3 mt-4">
            <div className="col-md-2">
              <div className="card bg-primary bg-opacity-10 border-0">
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-primary small fw-bold mb-1">Total</p>
                      <h4 className="fw-bold mb-0">{totalApplications}</h4>
                    </div>
                    <i className="fas fa-file-alt fa-2x text-primary opacity-50"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-2">
              <div className="card bg-warning bg-opacity-10 border-0">
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-warning small fw-bold mb-1">Pending</p>
                      <h4 className="fw-bold mb-0">{pendingApplications}</h4>
                    </div>
                    <i className="fas fa-clock fa-2x text-warning opacity-50"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-2">
              <div className="card bg-info bg-opacity-10 border-0">
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-info small fw-bold mb-1">Shortlisted</p>
                      <h4 className="fw-bold mb-0">{shortlistedApplications}</h4>
                    </div>
                    <i className="fas fa-check-circle fa-2x text-info opacity-50"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-2">
              <div className="card bg-success bg-opacity-10 border-0">
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-success small fw-bold mb-1">Hired</p>
                      <h4 className="fw-bold mb-0">{hiredApplications}</h4>
                    </div>
                    <i className="fas fa-trophy fa-2x text-success opacity-50"></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-2">
              <div className="card bg-danger bg-opacity-10 border-0">
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-danger small fw-bold mb-1">Rejected</p>
                      <h4 className="fw-bold mb-0">{rejectedApplications}</h4>
                    </div>
                    <i className="fas fa-times-circle fa-2x text-danger opacity-50"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-fluid py-4">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="alert alert-danger">
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

        {/* Filters */}
        {!loading && !error && (
          <>
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <i className="fas fa-search text-muted"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name, email, or job title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">All Statuses</option>
                      <option value="APPLIED">Applied</option>
                      <option value="REVIEWED">Reviewed</option>
                      <option value="SHORTLISTED">Shortlisted</option>
                      <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                      <option value="INTERVIEWED">Interviewed</option>
                      <option value="OFFERED">Offered</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="WITHDRAWN">Withdrawn</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select"
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                    >
                      <option value="">All Departments</option>
                      {uniqueDepartments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <button
                      onClick={() => {
                        const csv = [
                          ['Name', 'Email', 'Job', 'Department', 'Status', 'Applied Date'],
                          ...filteredApplications.map(app => [
                            app.applicantName,
                            app.email,
                            app.job?.title,
                            app.job?.department,
                            app.status,
                            new Date(app.createdAt).toLocaleDateString()
                          ])
                        ].map(row => row.join(',')).join('\n');
                        
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `applications_${new Date().toISOString().split('T')[0]}.csv`;
                        a.click();
                      }}
                      className="btn btn-outline-secondary w-100"
                    >
                      <i className="fas fa-download me-2"></i>
                      Export
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Applications Table */}
            <div className="card shadow-sm">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0">
                  Applications List 
                  <span className="badge bg-secondary ms-2">{filteredApplications.length}</span>
                </h5>
              </div>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="px-4 py-3">Applicant</th>
                      <th className="px-4 py-3">Job Position</th>
                      <th className="px-4 py-3">Department</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Experience</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Applied Date</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map(app => (
                      <tr key={app.id}>
                        <td className="px-4 py-3">
                          <div className="fw-bold">{app.applicantName}</div>
                          <small className="text-muted">{app.currentTitle || 'N/A'}</small>
                          {app.currentCompany && (
                            <div><small className="text-muted">{app.currentCompany}</small></div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="fw-bold">{app.job?.title}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="badge bg-light text-dark">{app.job?.department || 'N/A'}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div>{app.email}</div>
                          <small className="text-muted">{app.phone}</small>
                        </td>
                        <td className="px-4 py-3">
                          <div>{app.yearsOfExperience ? `${app.yearsOfExperience} years` : 'N/A'}</div>
                          {app.salaryExpectation && (
                            <small className="text-muted">
                              {app.salaryExpectation.toLocaleString()} UGX
                            </small>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge ${getStatusBadgeClass(app.status)} d-inline-flex align-items-center gap-1`}>
                            <i className={`fas ${getStatusIcon(app.status)} me-1`}></i>
                            {app.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="btn-group btn-group-sm">
                            <button
                              onClick={() => {
                                setSelectedApplication(app);
                                setShowApplicationModal(true);
                                setStatusUpdate({ status: app.status, notes: app.notes || '' });
                              }}
                              className="btn btn-outline-primary"
                              title="View Details"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            {app.resumeUrl && (
                              <a
                                href={app.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline-success"
                                title="View Resume"
                              >
                                <i className="fas fa-file-pdf"></i>
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredApplications.length === 0 && (
                <div className="text-center py-5">
                  <i className="fas fa-users fa-3x text-muted mb-3"></i>
                  <h5 className="text-muted">No applications found</h5>
                  <p className="text-muted">Try adjusting your search filters</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Application Detail Modal */}
      {showApplicationModal && selectedApplication && (
        <div 
          className="modal show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} 
          onClick={() => {
            setShowApplicationModal(false);
            setSelectedApplication(null);
          }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Application Details - {selectedApplication.applicantName}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowApplicationModal(false);
                    setSelectedApplication(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  {/* Left Column - Personal & Professional Info */}
                  <div className="col-md-8">
                    {/* Personal Information */}
                    <div className="mb-4">
                      <h6 className="fw-bold mb-3">
                        <i className="fas fa-user me-2 text-primary"></i>
                        Personal Information
                      </h6>
                      <div className="bg-light p-3 rounded">
                        <div className="row g-3">
                          <div className="col-sm-6">
                            <small className="text-muted d-block">Full Name</small>
                            <p className="fw-bold mb-0">{selectedApplication.applicantName}</p>
                          </div>
                          <div className="col-sm-6">
                            <small className="text-muted d-block">Email</small>
                            <p className="fw-bold mb-0">
                              <a href={`mailto:${selectedApplication.email}`}>{selectedApplication.email}</a>
                            </p>
                          </div>
                          <div className="col-sm-6">
                            <small className="text-muted d-block">Phone</small>
                            <p className="fw-bold mb-0">
                              <a href={`tel:${selectedApplication.phone}`}>{selectedApplication.phone}</a>
                            </p>
                          </div>
                          <div className="col-sm-6">
                            <small className="text-muted d-block">Applied Date</small>
                            <p className="fw-bold mb-0">
                              {new Date(selectedApplication.createdAt).toLocaleDateString()} 
                              <small className="text-muted ms-2">
                                ({new Date(selectedApplication.createdAt).toLocaleTimeString()})
                              </small>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div className="mb-4">
                      <h6 className="fw-bold mb-3">
                        <i className="fas fa-briefcase me-2 text-primary"></i>
                        Professional Information
                      </h6>
                      <div className="bg-light p-3 rounded">
                        <div className="row g-3">
                          <div className="col-sm-6">
                            <small className="text-muted d-block">Current Company</small>
                            <p className="fw-bold mb-0">{selectedApplication.currentCompany || 'N/A'}</p>
                          </div>
                          <div className="col-sm-6">
                            <small className="text-muted d-block">Current Title</small>
                            <p className="fw-bold mb-0">{selectedApplication.currentTitle || 'N/A'}</p>
                          </div>
                          <div className="col-sm-6">
                            <small className="text-muted d-block">Years of Experience</small>
                            <p className="fw-bold mb-0">{selectedApplication.yearsOfExperience || 'N/A'}</p>
                          </div>
                          <div className="col-sm-6">
                            <small className="text-muted d-block">Notice Period</small>
                            <p className="fw-bold mb-0">
                              {selectedApplication.noticePeriod ? `${selectedApplication.noticePeriod} days` : 'N/A'}
                            </p>
                          </div>
                          <div className="col-sm-6">
                            <small className="text-muted d-block">Salary Expectation</small>
                            <p className="fw-bold mb-0">
                              {selectedApplication.salaryExpectation 
                                ? `${selectedApplication.salaryExpectation.toLocaleString()} UGX/month`
                                : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cover Letter */}
                    <div className="mb-4">
                      <h6 className="fw-bold mb-3">
                        <i className="fas fa-file-alt me-2 text-primary"></i>
                        Cover Letter
                      </h6>
                      <div className="bg-light p-3 rounded">
                        <p className="mb-0" style={{ whiteSpace: 'pre-line' }}>
                          {selectedApplication.coverLetter || 'No cover letter provided'}
                        </p>
                      </div>
                    </div>

                    {/* Online Profiles */}
                    {(selectedApplication.portfolioUrl || selectedApplication.linkedinUrl || selectedApplication.githubUrl) && (
                      <div className="mb-4">
                        <h6 className="fw-bold mb-3">
                          <i className="fas fa-link me-2 text-primary"></i>
                          Online Profiles
                        </h6>
                        <div className="bg-light p-3 rounded">
                          {selectedApplication.portfolioUrl && (
                            <div className="mb-2">
                              <small className="text-muted d-block">
                                <i className="fas fa-globe me-1"></i> Portfolio
                              </small>
                              <a href={selectedApplication.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-primary">
                                {selectedApplication.portfolioUrl}
                              </a>
                            </div>
                          )}
                          {selectedApplication.linkedinUrl && (
                            <div className="mb-2">
                              <small className="text-muted d-block">
                                <i className="fab fa-linkedin me-1"></i> LinkedIn
                              </small>
                              <a href={selectedApplication.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary">
                                {selectedApplication.linkedinUrl}
                              </a>
                            </div>
                          )}
                          {selectedApplication.githubUrl && (
                            <div>
                              <small className="text-muted d-block">
                                <i className="fab fa-github me-1"></i> GitHub
                              </small>
                              <a href={selectedApplication.githubUrl} target="_blank" rel="noopener noreferrer" className="text-primary">
                                {selectedApplication.githubUrl}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Status & Actions */}
                  <div className="col-md-4">
                    {/* Current Status */}
                    <div className="mb-4">
                      <h6 className="fw-bold mb-3">
                        <i className="fas fa-info-circle me-2 text-primary"></i>
                        Current Status
                      </h6>
                      <div className="bg-light p-3 rounded">
                        <div className="d-flex align-items-center mb-3">
                          <span className={`badge ${getStatusBadgeClass(selectedApplication.status)} p-2 fs-6 w-100`}>
                            <i className={`fas ${getStatusIcon(selectedApplication.status)} me-2`}></i>
                            {selectedApplication.status.replace('_', ' ')}
                          </span>
                        </div>
                        {selectedApplication.notes && (
                          <div>
                            <small className="text-muted d-block mb-1">Previous Notes:</small>
                            <p className="bg-white p-2 rounded small">{selectedApplication.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Update Status */}
                    <div className="mb-4">
                      <h6 className="fw-bold mb-3">
                        <i className="fas fa-edit me-2 text-primary"></i>
                        Update Status
                      </h6>
                      <div className="bg-light p-3 rounded">
                        <div className="mb-3">
                          <label className="form-label small fw-bold">Select New Status</label>
                          <select
                            className="form-select"
                            value={statusUpdate.status}
                            onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                          >
                            <option value="">Choose status...</option>
                            <option value="APPLIED">Applied</option>
                            <option value="REVIEWED">Reviewed</option>
                            <option value="SHORTLISTED">Shortlisted</option>
                            <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                            <option value="INTERVIEWED">Interviewed</option>
                            <option value="OFFERED">Offered</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="WITHDRAWN">Withdrawn</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label className="form-label small fw-bold">Add Notes</label>
                          <textarea
                            className="form-control"
                            rows="4"
                            value={statusUpdate.notes}
                            onChange={(e) => setStatusUpdate({ ...statusUpdate, notes: e.target.value })}
                            placeholder="Add notes about this update (optional)..."
                          ></textarea>
                        </div>
                        <button
                          onClick={() => handleStatusUpdate(selectedApplication.id)}
                          className="btn btn-primary w-100"
                          disabled={!statusUpdate.status}
                        >
                          <i className="fas fa-save me-2"></i>
                          Update Status
                        </button>
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="mb-4">
                      <h6 className="fw-bold mb-3">
                        <i className="fas fa-file me-2 text-primary"></i>
                        Documents
                      </h6>
                      <div className="bg-light p-3 rounded">
                        {selectedApplication.resumeUrl ? (
                          <a
                            href={selectedApplication.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center"
                          >
                            <i className="fas fa-file-pdf me-2"></i>
                            View Resume/CV
                          </a>
                        ) : (
                          <p className="text-muted small text-center mb-0">No resume uploaded</p>
                        )}
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="mb-4">
                      <h6 className="fw-bold mb-3">
                        <i className="fas fa-briefcase me-2 text-primary"></i>
                        Job Details
                      </h6>
                      <div className="bg-light p-3 rounded">
                        <p className="fw-bold mb-2">{selectedApplication.job?.title}</p>
                        <div className="small">
                          <div className="mb-1">
                            <i className="fas fa-building me-2 text-muted"></i>
                            {selectedApplication.job?.department}
                          </div>
                          <div className="mb-1">
                            <i className="fas fa-map-marker-alt me-2 text-muted"></i>
                            {selectedApplication.job?.location}
                          </div>
                          <div className="mb-1">
                            <i className="fas fa-clock me-2 text-muted"></i>
                            {selectedApplication.job?.employmentType}
                          </div>
                          <div>
                            <i className="fas fa-layer-group me-2 text-muted"></i>
                            {selectedApplication.job?.experienceLevel}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-4">
                      <h6 className="fw-bold mb-3">
                        <i className="fas fa-bolt me-2 text-primary"></i>
                        Quick Actions
                      </h6>
                      <div className="bg-light p-3 rounded">
                        <div className="d-grid gap-2">
                          <a
                            href={`mailto:${selectedApplication.email}`}
                            className="btn btn-outline-primary"
                          >
                            <i className="fas fa-envelope me-2"></i>
                            Send Email
                          </a>
                          {selectedApplication.phone && (
                            <a
                              href={`tel:${selectedApplication.phone}`}
                              className="btn btn-outline-primary"
                            >
                              <i className="fas fa-phone me-2"></i>
                              Call Applicant
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowApplicationModal(false);
                    setSelectedApplication(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationDashboard;


// // pages/admin/career/AdminCareerDashboard.jsx
// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import useCareerStore from '../../stores/shared/careerStore';

// const ApplicationDashboard = () => {
//   const navigate = useNavigate();
//   const {
//     jobs,
//     applications,
//     dashboardData,
//     loading,
//     error,
//     fetchJobs,
//     fetchApplications,
//     fetchDashboardData,
//     fetchCareerStats,
//     stats,
//     updateApplicationStatus
//   } = useCareerStore();

//   const [activeTab, setActiveTab] = useState('overview');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [departmentFilter, setDepartmentFilter] = useState('');
//   const [selectedApplication, setSelectedApplication] = useState(null);
//   const [showApplicationModal, setShowApplicationModal] = useState(false);
//   const [statusUpdate, setStatusUpdate] = useState({ status: '', notes: '' });

//   useEffect(() => {
//     loadDashboardData();
//   }, []);

//   const loadDashboardData = async () => {
//     await Promise.all([
//       fetchDashboardData(),
//       fetchJobs({ isActive: undefined }),
//       fetchApplications(),
//       fetchCareerStats()
//     ]);
//   };

//   const handleStatusUpdate = async (applicationId) => {
//     if (!statusUpdate.status) return;

//     const result = await updateApplicationStatus(
//       applicationId,
//       statusUpdate.status,
//       statusUpdate.notes
//     );

//     if (result.success) {
//       setShowApplicationModal(false);
//       setSelectedApplication(null);
//       setStatusUpdate({ status: '', notes: '' });
//       loadDashboardData();
//     }
//   };

//   const getStatusBadgeClass = (status) => {
//     const classes = {
//       'APPLIED': 'bg-primary',
//       'REVIEWED': 'bg-info',
//       'SHORTLISTED': 'bg-success',
//       'INTERVIEW_SCHEDULED': 'bg-warning text-dark',
//       'INTERVIEWED': 'bg-secondary',
//       'OFFERED': 'bg-success',
//       'REJECTED': 'bg-danger',
//       'WITHDRAWN': 'bg-dark'
//     };
//     return classes[status] || 'bg-secondary';
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'APPLIED':
//         return 'fa-file-alt';
//       case 'REVIEWED':
//         return 'fa-eye';
//       case 'SHORTLISTED':
//         return 'fa-check-circle';
//       case 'INTERVIEW_SCHEDULED':
//         return 'fa-calendar';
//       case 'INTERVIEWED':
//         return 'fa-users';
//       case 'OFFERED':
//         return 'fa-chart-line';
//       case 'REJECTED':
//         return 'fa-times-circle';
//       case 'WITHDRAWN':
//         return 'fa-exclamation-circle';
//       default:
//         return 'fa-file-alt';
//     }
//   };

//   const filteredApplications = applications.filter(app => {
//     const matchesSearch = 
//       app.applicantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesStatus = !statusFilter || app.status === statusFilter;
//     const matchesDepartment = !departmentFilter || app.job?.department === departmentFilter;

//     return matchesSearch && matchesStatus && matchesDepartment;
//   });

//   const uniqueDepartments = [...new Set(jobs.map(job => job.department))];

//   return (
//     <div className="bg-light min-vh-100">
//       {/* Header */}
//       <div className="bg-white shadow-sm">
//         <div className="container-fluid py-4">
//           <div className="d-flex justify-content-between align-items-center">
//             <div>
//               <h1 className="h2 mb-1">Career Management</h1>
//               <p className="text-muted mb-0">Manage job postings and applications</p>
//             </div>
//             <Link
//               to="/admin/careers/jobs/create"
//               className="btn btn-primary"
//             >
//               <i className="fas fa-plus me-2"></i>
//               Post New Job
//             </Link>
//           </div>

//           {/* Stats Cards */}
//           {stats && (
//             <div className="row g-3 mt-4">
//               <div className="col-md">
//                 <div className="card bg-primary bg-opacity-10 border-0">
//                   <div className="card-body">
//                     <div className="d-flex justify-content-between align-items-center">
//                       <div>
//                         <p className="text-primary small fw-bold mb-1">Total Jobs</p>
//                         <h3 className="fw-bold mb-0">{stats.totalJobs || 0}</h3>
//                       </div>
//                       <i className="fas fa-briefcase fa-2x text-primary opacity-50"></i>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="col-md">
//                 <div className="card bg-success bg-opacity-10 border-0">
//                   <div className="card-body">
//                     <div className="d-flex justify-content-between align-items-center">
//                       <div>
//                         <p className="text-success small fw-bold mb-1">Active Jobs</p>
//                         <h3 className="fw-bold mb-0">{stats.activeJobs || 0}</h3>
//                       </div>
//                       <i className="fas fa-check-circle fa-2x text-success opacity-50"></i>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="col-md">
//                 <div className="card bg-purple bg-opacity-10 border-0">
//                   <div className="card-body">
//                     <div className="d-flex justify-content-between align-items-center">
//                       <div>
//                         <p className="text-purple small fw-bold mb-1">Applications</p>
//                         <h3 className="fw-bold mb-0">{stats.applications || 0}</h3>
//                       </div>
//                       <i className="fas fa-users fa-2x text-purple opacity-50"></i>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="col-md">
//                 <div className="card bg-warning bg-opacity-10 border-0">
//                   <div className="card-body">
//                     <div className="d-flex justify-content-between align-items-center">
//                       <div>
//                         <p className="text-warning small fw-bold mb-1">Departments</p>
//                         <h3 className="fw-bold mb-0">{stats.departments || 0}</h3>
//                       </div>
//                       <i className="fas fa-building fa-2x text-warning opacity-50"></i>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="col-md">
//                 <div className="card bg-info bg-opacity-10 border-0">
//                   <div className="card-body">
//                     <div className="d-flex justify-content-between align-items-center">
//                       <div>
//                         <p className="text-info small fw-bold mb-1">Locations</p>
//                         <h3 className="fw-bold mb-0">{stats.locations || 0}</h3>
//                       </div>
//                       <i className="fas fa-map-marker-alt fa-2x text-info opacity-50"></i>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="container-fluid py-4">
//         <ul className="nav nav-tabs">
//           <li className="nav-item">
//             <button
//               className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
//               onClick={() => setActiveTab('overview')}
//             >
//               Overview
//             </button>
//           </li>
//           <li className="nav-item">
//             <button
//               className={`nav-link ${activeTab === 'jobs' ? 'active' : ''}`}
//               onClick={() => setActiveTab('jobs')}
//             >
//               Job Postings
//             </button>
//           </li>
//           <li className="nav-item">
//             <button
//               className={`nav-link ${activeTab === 'applications' ? 'active' : ''}`}
//               onClick={() => setActiveTab('applications')}
//             >
//               Applications
//             </button>
//           </li>
//         </ul>

//         {/* Loading State */}
//         {loading && (
//           <div className="text-center py-5">
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">Loading...</span>
//             </div>
//           </div>
//         )}

//         {/* Error State */}
//         {error && (
//           <div className="alert alert-danger mt-3">
//             <i className="fas fa-exclamation-circle me-2"></i>
//             {error}
//           </div>
//         )}

//         {/* Overview Tab */}
//         {activeTab === 'overview' && !loading && dashboardData && (
//           <div className="mt-4">
//             <div className="row g-4">
//               {/* Applications by Status */}
//               <div className="col-md-6">
//                 <div className="card shadow-sm">
//                   <div className="card-header bg-white">
//                     <h5 className="mb-0">Applications by Status</h5>
//                   </div>
//                   <div className="card-body">
//                     {['APPLIED', 'REVIEWED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'OFFERED', 'REJECTED'].map(status => {
//                       const count = applications.filter(app => app.status === status).length;
//                       const percentage = applications.length > 0 
//                         ? Math.round((count / applications.length) * 100) 
//                         : 0;
                      
//                       return (
//                         <div key={status} className="mb-3">
//                           <div className="d-flex justify-content-between small mb-1">
//                             <span className="text-muted">{status.replace('_', ' ')}</span>
//                             <span className="fw-bold">{count} ({percentage}%)</span>
//                           </div>
//                           <div className="progress" style={{ height: '8px' }}>
//                             <div
//                               className="progress-bar bg-primary"
//                               style={{ width: `${percentage}%` }}
//                             ></div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </div>

//               {/* Applications by Department */}
//               <div className="col-md-6">
//                 <div className="card shadow-sm">
//                   <div className="card-header bg-white">
//                     <h5 className="mb-0">Applications by Department</h5>
//                   </div>
//                   <div className="card-body">
//                     {uniqueDepartments.slice(0, 5).map(dept => {
//                       const deptJobs = jobs.filter(j => j.department === dept).map(j => j.id);
//                       const count = applications.filter(app => deptJobs.includes(app.CareerJobId)).length;
//                       const percentage = applications.length > 0 
//                         ? Math.round((count / applications.length) * 100) 
//                         : 0;
                      
//                       return (
//                         <div key={dept} className="mb-3">
//                           <div className="d-flex justify-content-between small mb-1">
//                             <span className="text-muted">{dept}</span>
//                             <span className="fw-bold">{count} ({percentage}%)</span>
//                           </div>
//                           <div className="progress" style={{ height: '8px' }}>
//                             <div
//                               className="progress-bar bg-success"
//                               style={{ width: `${percentage}%` }}
//                             ></div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Recent Applications */}
//             <div className="card shadow-sm mt-4">
//               <div className="card-header bg-white">
//                 <h5 className="mb-0">Recent Applications</h5>
//               </div>
//               <div className="list-group list-group-flush">
//                 {applications.slice(0, 5).map(app => (
//                   <div key={app.id} className="list-group-item">
//                     <div className="d-flex justify-content-between align-items-center">
//                       <div>
//                         <h6 className="mb-1">{app.applicantName}</h6>
//                         <p className="text-muted small mb-1">{app.email}</p>
//                         <p className="text-muted small mb-0">
//                           Applied for: {app.job?.title} • {new Date(app.createdAt).toLocaleDateString()}
//                         </p>
//                       </div>
//                       <div className="d-flex align-items-center gap-3">
//                         <span className={`badge ${getStatusBadgeClass(app.status)} d-flex align-items-center gap-1`}>
//                           <i className={`fas ${getStatusIcon(app.status)} me-1`}></i>
//                           {app.status.replace('_', ' ')}
//                         </span>
//                         <button
//                           onClick={() => {
//                             setSelectedApplication(app);
//                             setShowApplicationModal(true);
//                             setStatusUpdate({ status: app.status, notes: app.notes || '' });
//                           }}
//                           className="btn btn-sm btn-outline-primary"
//                         >
//                           View
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Jobs Tab */}
//         {activeTab === 'jobs' && !loading && (
//           <div className="mt-4">
//             <div className="card shadow-sm">
//               <div className="table-responsive">
//                 <table className="table table-hover mb-0">
//                   <thead className="bg-light">
//                     <tr>
//                       <th className="px-4 py-3">Job Title</th>
//                       <th className="px-4 py-3">Department</th>
//                       <th className="px-4 py-3">Location</th>
//                       <th className="px-4 py-3">Type</th>
//                       <th className="px-4 py-3">Applications</th>
//                       <th className="px-4 py-3">Status</th>
//                       <th className="px-4 py-3">Posted</th>
//                       <th className="px-4 py-3">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {jobs.map(job => (
//                       <tr key={job.id}>
//                         <td className="px-4 py-3">
//                           <div className="fw-bold">{job.title}</div>
//                           <small className="text-muted">{job.slug}</small>
//                         </td>
//                         <td className="px-4 py-3 text-muted">{job.department}</td>
//                         <td className="px-4 py-3 text-muted">{job.location}</td>
//                         <td className="px-4 py-3 text-muted">{job.employmentType}</td>
//                         <td className="px-4 py-3">
//                           <span className="badge bg-info rounded-pill">
//                             {job.applicationsCount}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3">
//                           <span className={`badge ${job.isActive ? 'bg-success' : 'bg-secondary'}`}>
//                             {job.isActive ? 'Active' : 'Inactive'}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3 text-muted">
//                           {new Date(job.createdAt).toLocaleDateString()}
//                         </td>
//                         <td className="px-4 py-3">
//                           <div className="btn-group btn-group-sm">
//                             <button
//                               onClick={() => navigate(`/admin/careers/jobs/edit/${job.id}`)}
//                               className="btn btn-outline-primary"
//                               title="Edit"
//                             >
//                               <i className="fas fa-edit"></i>
//                             </button>
//                             <button
//                               onClick={() => navigate(`/admin/careers/jobs/${job.id}/applications`)}
//                               className="btn btn-outline-info"
//                               title="View Applications"
//                             >
//                               <i className="fas fa-users"></i>
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Applications Tab */}
//         {activeTab === 'applications' && !loading && (
//           <div className="mt-4">
//             {/* Filters */}
//             <div className="card shadow-sm mb-4">
//               <div className="card-body">
//                 <div className="row g-3">
//                   <div className="col-md-4">
//                     <div className="input-group">
//                       <span className="input-group-text bg-white">
//                         <i className="fas fa-search text-muted"></i>
//                       </span>
//                       <input
//                         type="text"
//                         className="form-control"
//                         placeholder="Search by name, email, or job title..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                       />
//                     </div>
//                   </div>
//                   <div className="col-md-3">
//                     <select
//                       className="form-select"
//                       value={statusFilter}
//                       onChange={(e) => setStatusFilter(e.target.value)}
//                     >
//                       <option value="">All Statuses</option>
//                       <option value="APPLIED">Applied</option>
//                       <option value="REVIEWED">Reviewed</option>
//                       <option value="SHORTLISTED">Shortlisted</option>
//                       <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
//                       <option value="INTERVIEWED">Interviewed</option>
//                       <option value="OFFERED">Offered</option>
//                       <option value="REJECTED">Rejected</option>
//                       <option value="WITHDRAWN">Withdrawn</option>
//                     </select>
//                   </div>
//                   <div className="col-md-3">
//                     <select
//                       className="form-select"
//                       value={departmentFilter}
//                       onChange={(e) => setDepartmentFilter(e.target.value)}
//                     >
//                       <option value="">All Departments</option>
//                       {uniqueDepartments.map(dept => (
//                         <option key={dept} value={dept}>{dept}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="col-md-2">
//                     <button
//                       onClick={() => {
//                         const csv = [
//                           ['Name', 'Email', 'Job', 'Status', 'Applied Date'],
//                           ...filteredApplications.map(app => [
//                             app.applicantName,
//                             app.email,
//                             app.job?.title,
//                             app.status,
//                             new Date(app.createdAt).toLocaleDateString()
//                           ])
//                         ].map(row => row.join(',')).join('\n');
                        
//                         const blob = new Blob([csv], { type: 'text/csv' });
//                         const url = window.URL.createObjectURL(blob);
//                         const a = document.createElement('a');
//                         a.href = url;
//                         a.download = 'applications.csv';
//                         a.click();
//                       }}
//                       className="btn btn-outline-secondary w-100"
//                     >
//                       <i className="fas fa-download me-2"></i>
//                       Export
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Applications Table */}
//             <div className="card shadow-sm">
//               <div className="table-responsive">
//                 <table className="table table-hover mb-0">
//                   <thead className="bg-light">
//                     <tr>
//                       <th className="px-4 py-3">Applicant</th>
//                       <th className="px-4 py-3">Job</th>
//                       <th className="px-4 py-3">Contact</th>
//                       <th className="px-4 py-3">Experience</th>
//                       <th className="px-4 py-3">Status</th>
//                       <th className="px-4 py-3">Applied</th>
//                       <th className="px-4 py-3">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredApplications.map(app => (
//                       <tr key={app.id}>
//                         <td className="px-4 py-3">
//                           <div className="fw-bold">{app.applicantName}</div>
//                           <small className="text-muted">{app.currentTitle || 'N/A'}</small>
//                           {app.currentCompany && (
//                             <div><small className="text-muted">{app.currentCompany}</small></div>
//                           )}
//                         </td>
//                         <td className="px-4 py-3">
//                           <div className="fw-bold">{app.job?.title}</div>
//                           <small className="text-muted">{app.job?.department}</small>
//                         </td>
//                         <td className="px-4 py-3">
//                           <div>{app.email}</div>
//                           <small className="text-muted">{app.phone}</small>
//                         </td>
//                         <td className="px-4 py-3">
//                           <div>{app.yearsOfExperience ? `${app.yearsOfExperience} years` : 'N/A'}</div>
//                           {app.salaryExpectation && (
//                             <small className="text-muted">
//                               {app.salaryExpectation.toLocaleString()} UGX
//                             </small>
//                           )}
//                         </td>
//                         <td className="px-4 py-3">
//                           <span className={`badge ${getStatusBadgeClass(app.status)} d-flex align-items-center gap-1 w-auto d-inline-flex`}>
//                             <i className={`fas ${getStatusIcon(app.status)} me-1`}></i>
//                             {app.status.replace('_', ' ')}
//                           </span>
//                         </td>
//                         <td className="px-4 py-3 text-muted">
//                           {new Date(app.createdAt).toLocaleDateString()}
//                         </td>
//                         <td className="px-4 py-3">
//                           <div className="btn-group btn-group-sm">
//                             <button
//                               onClick={() => {
//                                 setSelectedApplication(app);
//                                 setShowApplicationModal(true);
//                                 setStatusUpdate({ status: app.status, notes: app.notes || '' });
//                               }}
//                               className="btn btn-outline-primary"
//                               title="View"
//                             >
//                               <i className="fas fa-eye"></i>
//                             </button>
//                             {app.resumeUrl && (
//                               <a
//                                 href={app.resumeUrl}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="btn btn-outline-success"
//                                 title="Resume"
//                               >
//                                 <i className="fas fa-file-pdf"></i>
//                               </a>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {filteredApplications.length === 0 && (
//                 <div className="text-center py-5">
//                   <i className="fas fa-users fa-3x text-muted mb-3"></i>
//                   <h5 className="text-muted">No applications found</h5>
//                   <p className="text-muted">Try adjusting your search filters</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Application Detail Modal */}
//       {showApplicationModal && selectedApplication && (
//         <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowApplicationModal(false)}>
//           <div className="modal-dialog modal-xl modal-dialog-centered" onClick={e => e.stopPropagation()}>
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">Application Details</h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => {
//                     setShowApplicationModal(false);
//                     setSelectedApplication(null);
//                   }}
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <div className="row">
//                   {/* Left Column - Personal Info */}
//                   <div className="col-md-8">
//                     <div className="mb-4">
//                       <h6 className="fw-bold mb-3">Personal Information</h6>
//                       <div className="bg-light p-3 rounded">
//                         <div className="row g-3">
//                           <div className="col-sm-6">
//                             <small className="text-muted d-block">Full Name</small>
//                             <p className="fw-bold mb-0">{selectedApplication.applicantName}</p>
//                           </div>
//                           <div className="col-sm-6">
//                             <small className="text-muted d-block">Email</small>
//                             <p className="fw-bold mb-0">{selectedApplication.email}</p>
//                           </div>
//                           <div className="col-sm-6">
//                             <small className="text-muted d-block">Phone</small>
//                             <p className="fw-bold mb-0">{selectedApplication.phone}</p>
//                           </div>
//                           <div className="col-sm-6">
//                             <small className="text-muted d-block">Applied Date</small>
//                             <p className="fw-bold mb-0">
//                               {new Date(selectedApplication.createdAt).toLocaleDateString()}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="mb-4">
//                       <h6 className="fw-bold mb-3">Professional Information</h6>
//                       <div className="bg-light p-3 rounded">
//                         <div className="row g-3">
//                           <div className="col-sm-6">
//                             <small className="text-muted d-block">Current Company</small>
//                             <p className="fw-bold mb-0">{selectedApplication.currentCompany || 'N/A'}</p>
//                           </div>
//                           <div className="col-sm-6">
//                             <small className="text-muted d-block">Current Title</small>
//                             <p className="fw-bold mb-0">{selectedApplication.currentTitle || 'N/A'}</p>
//                           </div>
//                           <div className="col-sm-6">
//                             <small className="text-muted d-block">Years of Experience</small>
//                             <p className="fw-bold mb-0">{selectedApplication.yearsOfExperience || 'N/A'}</p>
//                           </div>
//                           <div className="col-sm-6">
//                             <small className="text-muted d-block">Notice Period</small>
//                             <p className="fw-bold mb-0">
//                               {selectedApplication.noticePeriod ? `${selectedApplication.noticePeriod} days` : 'N/A'}
//                             </p>
//                           </div>
//                           <div className="col-sm-6">
//                             <small className="text-muted d-block">Salary Expectation</small>
//                             <p className="fw-bold mb-0">
//                               {selectedApplication.salaryExpectation 
//                                 ? `${selectedApplication.salaryExpectation.toLocaleString()} UGX`
//                                 : 'N/A'}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="mb-4">
//                       <h6 className="fw-bold mb-3">Cover Letter</h6>
//                       <div className="bg-light p-3 rounded">
//                         <p className="mb-0" style={{ whiteSpace: 'pre-line' }}>
//                           {selectedApplication.coverLetter || 'No cover letter provided'}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="mb-4">
//                       <h6 className="fw-bold mb-3">Links</h6>
//                       <div className="bg-light p-3 rounded">
//                         {selectedApplication.portfolioUrl && (
//                           <div className="mb-2">
//                             <small className="text-muted d-block">Portfolio</small>
//                             <a href={selectedApplication.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-primary">
//                               {selectedApplication.portfolioUrl}
//                             </a>
//                           </div>
//                         )}
//                         {selectedApplication.linkedinUrl && (
//                           <div className="mb-2">
//                             <small className="text-muted d-block">LinkedIn</small>
//                             <a href={selectedApplication.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary">
//                               {selectedApplication.linkedinUrl}
//                             </a>
//                           </div>
//                         )}
//                         {selectedApplication.githubUrl && (
//                           <div>
//                             <small className="text-muted d-block">GitHub</small>
//                             <a href={selectedApplication.githubUrl} target="_blank" rel="noopener noreferrer" className="text-primary">
//                               {selectedApplication.githubUrl}
//                             </a>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Right Column - Status & Actions */}
//                   <div className="col-md-4">
//                     <div className="mb-4">
//                       <h6 className="fw-bold mb-3">Application Status</h6>
//                       <div className="bg-light p-3 rounded">
//                         <div className="mb-3">
//                           <label className="form-label small fw-bold">Update Status</label>
//                           <select
//                             className="form-select"
//                             value={statusUpdate.status}
//                             onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
//                           >
//                             <option value="APPLIED">Applied</option>
//                             <option value="REVIEWED">Reviewed</option>
//                             <option value="SHORTLISTED">Shortlisted</option>
//                             <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
//                             <option value="INTERVIEWED">Interviewed</option>
//                             <option value="OFFERED">Offered</option>
//                             <option value="REJECTED">Rejected</option>
//                             <option value="WITHDRAWN">Withdrawn</option>
//                           </select>
//                         </div>
//                         <div className="mb-3">
//                           <label className="form-label small fw-bold">Notes</label>
//                           <textarea
//                             className="form-control"
//                             rows="4"
//                             value={statusUpdate.notes}
//                             onChange={(e) => setStatusUpdate({ ...statusUpdate, notes: e.target.value })}
//                             placeholder="Add notes about this application..."
//                           ></textarea>
//                         </div>
//                         <button
//                           onClick={() => handleStatusUpdate(selectedApplication.id)}
//                           className="btn btn-primary w-100"
//                         >
//                           <i className="fas fa-save me-2"></i>
//                           Update Status
//                         </button>
//                       </div>
//                     </div>

//                     <div className="mb-4">
//                       <h6 className="fw-bold mb-3">Documents</h6>
//                       <div className="bg-light p-3 rounded">
//                         {selectedApplication.resumeUrl && (
//                           <a
//                             href={selectedApplication.resumeUrl}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center"
//                           >
//                             <i className="fas fa-file-pdf me-2"></i>
//                             View Resume
//                           </a>
//                         )}
//                       </div>
//                     </div>

//                     <div className="mb-4">
//                       <h6 className="fw-bold mb-3">Job Details</h6>
//                       <div className="bg-light p-3 rounded">
//                         <p className="fw-bold mb-2">{selectedApplication.job?.title}</p>
//                         <p className="text-muted small mb-1">{selectedApplication.job?.department}</p>
//                         <p className="text-muted small mb-1">{selectedApplication.job?.location}</p>
//                         <p className="text-muted small mt-2 mb-0">{selectedApplication.job?.employmentType}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={() => {
//                     setShowApplicationModal(false);
//                     setSelectedApplication(null);
//                   }}
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Custom CSS for additional Bootstrap-like utilities */}
//       <style jsx="true">{`
//         .bg-purple {
//           background-color: #6f42c1 !important;
//         }
//         .bg-purple.bg-opacity-10 {
//           background-color: rgba(111, 66, 193, 0.1) !important;
//         }
//         .text-purple {
//           color: #6f42c1 !important;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ApplicationDashboard;



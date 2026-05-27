// components/career/CareerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCareerStore from '../../stores/shared/careerStore';

const CareerDashboard = () => {
  const { 
    dashboardData, 
    stats, 
    jobs, 
    applications,
    fetchDashboardData, 
    fetchCareerStats,
    fetchJobs,
    fetchApplications,
    deleteJob,
    updateApplicationStatus,
    loading 
  } = useCareerStore();

  const [timeRange, setTimeRange] = useState('monthly');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState({ status: '', notes: '' });

  useEffect(() => {
    const loadDashboardData = async () => {
      await Promise.all([
        fetchDashboardData(),
        fetchCareerStats(),
        fetchJobs(),
        fetchApplications()
      ]);
    };

    loadDashboardData();
  }, []);

  const navigate = useNavigate();

  // Handle job deletion
  const handleDeleteJob = async () => {
    if (jobToDelete) {
      await deleteJob(jobToDelete.id);
      setShowDeleteModal(false);
      setJobToDelete(null);
      // Refresh jobs list
      await fetchJobs();
    }
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    if (selectedApplication && statusUpdate.status) {
      await updateApplicationStatus(
        selectedApplication.id,
        statusUpdate.status,
        statusUpdate.notes
      );
      setShowStatusModal(false);
      setSelectedApplication(null);
      setStatusUpdate({ status: '', notes: '' });
      // Refresh applications
      await fetchApplications();
    }
  };

  // Mock data based on your image (fallback if API not ready)
  const mockDashboardData = {
    summary: {
      totalApplications: 132000,
      shortlisted: 10900,
      onHold: 3100,
      monthlyGrowth: 34,
      growthMonth: 'February 2026'
    },
    activeJobs: [
      { id: 1, title: 'Project Manager', department: 'Management', applications: 45, shortlisted: 12, status: 'active' },
      { id: 2, title: 'Sales Manager', department: 'Sales', applications: 38, shortlisted: 8, status: 'active' },
      { id: 3, title: 'Machine Instrument', department: 'Engineering', applications: 22, shortlisted: 5, status: 'active' },
      { id: 4, title: 'Operation Manager', department: 'Operations', applications: 31, shortlisted: 9, status: 'active' }
    ],
    monthlyStats: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      applications: [65, 78, 90, 81, 56, 55, 40, 45, 78, 90, 100, 110],
      shortlisted: [12, 19, 15, 25, 12, 13, 10, 15, 20, 22, 25, 30]
    },
    recentApplications: [
      { id: 1, name: 'Sophia Doe', job: 'Advertising Intern', jobId: 5, date: '2024-02-15', status: 'APPLIED' },
      { id: 2, name: 'Mason Clark', job: 'Project Coordinator', jobId: 1, date: '2024-02-14', status: 'SHORTLISTED' },
      { id: 3, name: 'Emily Paton', job: 'Layout Expert', jobId: 3, date: '2024-02-14', status: 'REVIEWED' },
      { id: 4, name: 'Daniel Breth', job: 'Interior Architect', jobId: 4, date: '2024-02-13', status: 'APPLIED' }
    ],
    scheduledMeetings: [
      { day: 'Thu', date: 8, title: 'Interview', time: '09:00am - 11:30am' },
      { day: 'Fri', date: 10, title: 'Organizational meeting', time: '09:00am - 10:30am' },
      { day: 'Mon', date: 17, title: 'Meeting with the manager', time: '09:00am - 11:30am' },
      { day: 'Set', date: 18, title: 'Interview', time: '09:00am - 11:30am' },
      { day: 'Fri', date: 22, title: 'Organizational meeting', time: '09:00am - 10:30am' }
    ],
    applicationTrends: {
      labels: ['Sep', 'Oct', 'Nov', 'Dec'],
      applications: [88, 96, 105, 110],
      shortlisted: [22, 25, 28, 30],
      onHold: [8, 10, 12, 15],
      rejected: [15, 18, 20, 25]
    }
  };

  const data = dashboardData || mockDashboardData;
  const careerStats = stats || { totals: { jobs: jobs.length, applications: applications.length } };

  if (loading && !dashboardData) {
    return (
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <h1 className="h2 mb-0">Career Dashboard</h1>
          <p className="text-muted">Overview of your career portal statistics</p>
        </div>
        <div className="col-auto">
          <div className="btn-group" role="group">
            <button 
              type="button" 
              className={`btn btn-outline-secondary ${timeRange === 'weekly' ? 'active' : ''}`}
              onClick={() => setTimeRange('weekly')}
            >
              Weekly
            </button>
            <button 
              type="button" 
              className={`btn btn-outline-secondary ${timeRange === 'monthly' ? 'active' : ''}`}
              onClick={() => setTimeRange('monthly')}
            >
              Monthly
            </button>
            <button 
              type="button" 
              className={`btn btn-outline-secondary ${timeRange === 'yearly' ? 'active' : ''}`}
              onClick={() => setTimeRange('yearly')}
            >
              Yearly
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Applications
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {data.summary.totalApplications.toLocaleString()}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-file-alt fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Shortlisted
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {data.summary.shortlisted.toLocaleString()}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-check-circle fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    On Hold
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {data.summary.onHold.toLocaleString()}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-pause-circle fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Growth ({data.summary.growthMonth})
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {data.summary.monthlyGrowth}%
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-chart-line fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row mb-4">
        {/* Active Jobs Chart with Management Icons */}
        <div className="col-xl-8 col-lg-7 mb-4">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Active Jobs</h6>
              <div className="dropdown no-arrow">
                <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" 
                   data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                </a>
                <ul className="dropdown-menu dropdown-menu-right shadow animated--fade-in" 
                    aria-labelledby="dropdownMenuLink">
                  <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/careers/new'); }}>Post New Job</a></li>
                  <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); window.location.href = '/admin/careers/jobs/export'; }}>Export Data</a></li>
                </ul>
              </div>
            </div>
            <div className="card-body">
              <div className="chart-bar">
                <div className="table-responsive">
                  <table className="table table-bordered" width="100%" cellSpacing="0">
                    <thead>
                      <tr>
                        <th>Job Title</th>
                        <th>Department</th>
                        <th>Applications</th>
                        <th>Shortlisted</th>
                        <th>Conversion Rate</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(jobs.length > 0 ? jobs : data.activeJobs).map((job, index) => (
                        <tr key={job.id || index}>
                          <td>
                            <div className="d-flex align-items-center">
                              <i className="fas fa-briefcase text-primary me-2"></i>
                              {job.title}
                            </div>
                          </td>
                          <td>{job.department || 'N/A'}</td>
                          <td>
                            <span className="badge bg-info rounded-pill">
                              {job.applications || job.applicationsCount || 0}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-success rounded-pill">
                              {job.shortlisted || 0}
                            </span>
                          </td>
                          <td>
                            <div className="progress" style={{ height: '20px' }}>
                              <div 
                                className="progress-bar bg-success" 
                                role="progressbar" 
                                style={{ width: `${((job.shortlisted || 0) / (job.applications || job.applicationsCount || 1)) * 100}%` }}
                                aria-valuenow={((job.shortlisted || 0) / (job.applications || job.applicationsCount || 1)) * 100}
                                aria-valuemin="0" 
                                aria-valuemax="100"
                              >
                                {Math.round(((job.shortlisted || 0) / (job.applications || job.applicationsCount || 1)) * 100)}%
                              </div>
                            </div>
                          </td>
                          <td className="text-center">
                            <div className="btn-group" role="group">
                              <button 
                                className="btn btn-sm btn-outline-primary" 
                                title="View Job"
                                onClick={() => navigate(`/careers/${job.id}`)}
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-warning" 
                                title="Edit Job"
                                onClick={() => navigate(`/admin/careers/jobs/edit/${job.id}`)}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger" 
                                title="Delete Job"
                                onClick={() => {
                                  setJobToDelete(job);
                                  setShowDeleteModal(true);
                                }}
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-info" 
                                title="View Applications"
                                onClick={() => navigate(`/admin/careers/jobs/${job.id}/applications`)}
                              >
                                <i className="fas fa-users"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-secondary" 
                                title="Duplicate Job"
                                onClick={() => navigate(`/admin/careers/jobs/create?duplicate=${job.id}`)}
                              >
                                <i className="fas fa-copy"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scheduled Meetings */}
        <div className="col-xl-4 col-lg-5 mb-4">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex justify-content-between align-items-center">
              <h6 className="m-0 font-weight-bold text-primary">Scheduled Meetings</h6>
              <button className="btn btn-sm btn-outline-primary">
                <i className="fas fa-plus"></i> Schedule
              </button>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                {data.scheduledMeetings.map((meeting, index) => (
                  <div key={index} className="list-group-item d-flex align-items-center py-3">
                    <div className="me-3 text-center">
                      <div className="text-muted small">{meeting.day}</div>
                      <div className="h4 mb-0">{meeting.date}</div>
                    </div>
                    <div className="grow">
                      <div className="font-weight-bold">{meeting.title}</div>
                      <div className="text-muted small">{meeting.time}</div>
                    </div>
                    <div className="btn-group">
                      <button className="btn btn-sm btn-outline-primary">Join</button>
                      <button className="btn btn-sm btn-outline-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown">
                        <span className="visually-hidden">Toggle Dropdown</span>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li><a className="dropdown-item" href="#"><i className="fas fa-edit me-2"></i>Reschedule</a></li>
                        <li><a className="dropdown-item" href="#"><i className="fas fa-users me-2"></i>Add Attendees</a></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><a className="dropdown-item text-danger" href="#"><i className="fas fa-trash-alt me-2"></i>Cancel</a></li>
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications & Job Stats */}
      <div className="row">
        {/* Recent Applications with Management Icons */}
        <div className="col-xl-6 col-lg-6 mb-4">
          <div className="card shadow">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">Recent Applications</h6>
              <div>
                <button className="btn btn-sm btn-outline-secondary me-2" title="Export">
                  <i className="fas fa-download"></i>
                </button>
                <a href="/careers/applications" className="btn btn-sm btn-primary">View All</a>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Applicant</th>
                      <th>Applied For</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(applications.length > 0 ? applications : data.recentApplications).map((application, index) => (
                      <tr key={application.id || index}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-circle-sm bg-primary text-white me-2">
                              {application.name ? application.name.charAt(0) : (application.applicantName ? application.applicantName.charAt(0) : '?')}
                            </div>
                            <div>{application.name || application.applicantName}</div>
                          </div>
                        </td>
                        <td>
                          {application.job?.title || application.jobTitle || application.position || 
                          (typeof application.job === 'string' ? application.job : 'N/A')}
                        </td>
                        {/* <td>{application.job || (application.job?.title) || 'N/A'}</td> */}
                        <td>{application.date || new Date(application.createdAt).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge bg-${getStatusColor(application.status)}`}>
                            {application.status}
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="btn-group" role="group">
                            <button 
                              className="btn btn-sm btn-outline-primary" 
                              title="View Application"
                              onClick={() => navigate(`/admin/careers/applications/${application.id}`)}
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-success" 
                              title="Update Status"
                              onClick={() => {
                                setSelectedApplication(application);
                                setStatusUpdate({ status: application.status, notes: application.notes || '' });
                                setShowStatusModal(true);
                              }}
                            >
                              <i className="fas fa-sync-alt"></i>
                            </button>
                            {application.resumeUrl && (
                              <a 
                                href={application.resumeUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline-info"
                                title="View Resume"
                              >
                                <i className="fas fa-file-pdf"></i>
                              </a>
                            )}
                            <button 
                              className="btn btn-sm btn-outline-secondary" 
                              title="Send Email"
                              onClick={() => window.location.href = `mailto:${application.email || application.email}`}
                            >
                              <i className="fas fa-envelope"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Job Statistics */}
        <div className="col-xl-6 col-lg-6 mb-4">
          <div className="card shadow">
            <div className="card-header py-3 d-flex justify-content-between align-items-center">
              <h6 className="m-0 font-weight-bold text-primary">Job Statistics</h6>
              <button className="btn btn-sm btn-outline-secondary">
                <i className="fas fa-chart-bar me-1"></i> Generate Report
              </button>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="card border-left-primary shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                            Total Jobs
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            {careerStats.totals?.jobs || jobs.length || 0}
                          </div>
                        </div>
                        <div className="col-auto">
                          <i className="fas fa-briefcase fa-2x text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="card border-left-success shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                            Active Jobs
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            {jobs.filter(j => j.isActive).length || data.activeJobs.length}
                          </div>
                        </div>
                        <div className="col-auto">
                          <i className="fas fa-check fa-2x text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h6 className="mb-3">Applications by Status</h6>
                <div className="d-flex justify-content-between mb-2">
                  <span>Applied</span>
                  <span className="font-weight-bold">{data.summary.totalApplications.toLocaleString()}</span>
                </div>
                <div className="progress mb-3">
                  <div 
                    className="progress-bar bg-primary" 
                    role="progressbar" 
                    style={{ width: '100%' }}
                  ></div>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shortlisted</span>
                  <span className="font-weight-bold">{data.summary.shortlisted.toLocaleString()}</span>
                </div>
                <div className="progress mb-3">
                  <div 
                    className="progress-bar bg-success" 
                    role="progressbar" 
                    style={{ width: `${(data.summary.shortlisted / data.summary.totalApplications) * 100}%` }}
                  ></div>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>On Hold</span>
                  <span className="font-weight-bold">{data.summary.onHold.toLocaleString()}</span>
                </div>
                <div className="progress mb-3">
                  <div 
                    className="progress-bar bg-warning" 
                    role="progressbar" 
                    style={{ width: `${(data.summary.onHold / data.summary.totalApplications) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Quick Actions</h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-3">
                  <button 
                    className="btn btn-primary btn-block w-100"
                    onClick={() => navigate('/admin/careers/new')}
                  >
                    <i className="fas fa-plus me-2"></i> Post New Job
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button 
                    className="btn btn-success btn-block w-100"
                    onClick={() => navigate('/admin/careers/applications')}
                  >
                    <i className="fas fa-users me-2"></i> View Applications
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button 
                    className="btn btn-info btn-block w-100"
                    onClick={() => navigate('/admin/careers/analytics')}
                  >
                    <i className="fas fa-chart-line me-2"></i> Analytics
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button 
                    className="btn btn-warning btn-block w-100"
                    onClick={() => navigate('/admin/careers/settings')}
                  >
                    <i className="fas fa-cog me-2"></i> Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete the job "<strong>{jobToDelete?.title}</strong>"?</p>
                <p className="text-danger">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteJob}>
                  <i className="fas fa-trash-alt me-2"></i>Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedApplication && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Application Status</h5>
                <button type="button" className="btn-close" onClick={() => setShowStatusModal(false)}></button>
              </div>
              <div className="modal-body">
                <p className="mb-3">
                  Update status for <strong>{selectedApplication.name || selectedApplication.applicantName}</strong>
                </p>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select 
                    className="form-select"
                    value={statusUpdate.status}
                    onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                  >
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
                  <label className="form-label">Notes</label>
                  <textarea 
                    className="form-control"
                    rows="3"
                    value={statusUpdate.notes}
                    onChange={(e) => setStatusUpdate({ ...statusUpdate, notes: e.target.value })}
                    placeholder="Add any notes about this update..."
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowStatusModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleStatusUpdate}>
                  <i className="fas fa-save me-2"></i>Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function for status colors
const getStatusColor = (status) => {
  switch (status) {
    case 'APPLIED':
      return 'primary';
    case 'REVIEWED':
      return 'info';
    case 'SHORTLISTED':
      return 'success';
    case 'INTERVIEW_SCHEDULED':
      return 'warning';
    case 'INTERVIEWED':
      return 'secondary';
    case 'OFFERED':
      return 'success';
    case 'REJECTED':
      return 'danger';
    case 'WITHDRAWN':
      return 'dark';
    default:
      return 'secondary';
  }
};

// Avatar circle style
const avatarCircleStyle = `
  .avatar-circle-sm {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
  }
`;

export default CareerDashboard;



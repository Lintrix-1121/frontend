// src/pages/JobDetailsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useCareerStore from '../../stores/shared/careerStore';
// import ApplicationForm from '../components/career/ApplicationForm';

const JobDetailsPage = () => {
  const { slugOrId } = useParams();
  const navigate = useNavigate();
  const { 
    currentJob, 
    loading, 
    error, 
    fetchJob, 
    clearCurrentJob 
  } = useCareerStore();
  
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  useEffect(() => {
      console.log('🔍 JobDetailsPage mounted with jobId:', slugOrId);
      
      const loadJob = async () => {
        if (slugOrId) {
          const result = await fetchJob(slugOrId);
          console.log('📦 Load job result:', result);
        }
      };
      
      loadJob();

      // Cleanup function - this runs when component unmounts
      return () => {
        console.log('🧹 Cleaning up job details');
        clearCurrentJob();
      };
    }, [slugOrId, fetchJob, clearCurrentJob]); // Include dependencies

  
  // Calculate days ago from createdAt
  const getDaysAgo = (dateString) => {
    if (!dateString) return 'N/A';
    const posted = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Format salary for display
  const formatSalary = (min, max, currency = 'USD') => {
    if (!min && !max) return 'Not specified';
    const currencySymbol = currency === 'USD' ? '$' : currency;
    if (min && max) return `${currencySymbol}${min.toLocaleString()} - ${currencySymbol}${max.toLocaleString()}`;
    if (min) return `From ${currencySymbol}${min.toLocaleString()}`;
    if (max) return `Up to ${currencySymbol}${max.toLocaleString()}`;
    return 'Not specified';
  };

  // Format experience level for display
  const formatExperienceLevel = (level) => {
    const levels = {
      'ENTRY': 'Entry Level',
      'JUNIOR': '1-2 years',
      'MID': '2-5 years',
      'SENIOR': '5+ years',
      'LEAD': '8+ years',
      'MANAGER': '5+ years',
      'DIRECTOR': '10+ years'
    };
    return levels[level] || level || 'Not specified';
  };

  // Format employment type for display
  const formatEmploymentType = (type) => {
    const types = {
      'FULL_TIME': 'Full Time',
      'PART_TIME': 'Part Time',
      'CONTRACT': 'Contract',
      'INTERNSHIP': 'Internship',
      'REMOTE': 'Remote',
      'HYBRID': 'Hybrid'
    };
    return types[type] || type || 'Not specified';
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentJob) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" style={{ borderRadius: 0 }}>
          {error || 'Job not found'}
          <button 
            className="btn btn-link p-0 ms-2" 
            onClick={() => navigate('/careers')}
          >
            Back to Careers
          </button>
        </div>
      </div>
    );
  }

  console.log('📦 Rendering job:', currentJob);

  return (
    <div>
      {/* Breadcrumb */}
      {/* <nav className="bg-light py-3">
        <div className="container">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <a href="/careers" style={{ textDecoration: 'none' }}>Careers</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {currentJob.title}
            </li>
          </ol>
        </div>
      </nav> */}

      <div className="container py-5">
        <div className="row">
          {/* Job Details */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 0 }}>
              <div className="card-body p-4" style={{ borderRadius: 0 }}>
                {/* Job Header */}
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="badge bg-success" style={{ borderRadius: 0 }}>{currentJob.department || 'General'}</span>
                      {currentJob.isRemote && (
                        <span className="badge bg-success" style={{ borderRadius: 0 }}>Remote Available</span>
                      )}
                    </div>
                    <h1 className="h2 mb-2">{currentJob.title}</h1>
                    <div className="d-flex flex-wrap gap-3 text-muted mb-3">
                      <span>
                        <i className="bi bi-geo-alt me-1"></i>
                        {currentJob.location || 'Location not specified'}
                      </span>
                      <span>
                        <i className="bi bi-clock me-1"></i>
                        {formatEmploymentType(currentJob.employmentType)}
                      </span>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="h4 text-success mb-1">
                      {formatSalary(currentJob.salaryRangeMin, currentJob.salaryRangeMax, currentJob.salaryCurrency)}
                    </div>
                    {currentJob.salaryRangeMin && currentJob.salaryRangeMax && (
                      <small className="text-muted">per month</small>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <div className="border p-3 text-center" style={{ borderRadius: 0 }}>
                      <div className="h5 mb-1">{currentJob.numberOfOpenings || 1}</div>
                      <small className="text-muted">Open Positions</small>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="border p-3 text-center" style={{ borderRadius: 0 }}>
                      <div className="h5 mb-1">{formatExperienceLevel(currentJob.experienceLevel)}</div>
                      <small className="text-muted">Experience Required</small>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="border p-3 text-center" style={{ borderRadius: 0 }}>
                      <div className="h5 mb-1">{getDaysAgo(currentJob.createdAt)} days</div>
                      <small className="text-muted">Posted Ago</small>
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div className="mb-5">
                  <h3 className="h4 mb-3">Job Description</h3>
                  <div className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                    {currentJob.description || 'No description provided.'}
                  </div>
                </div>

                {/* Requirements */}
                {currentJob.requirements && currentJob.requirements.length > 0 && (
                  <div className="mb-5">
                    <h3 className="h4 mb-3">Requirements</h3>
                    <ul className="list-unstyled">
                      {currentJob.requirements.map((req, index) => (
                        <li key={index} className="mb-2">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Responsibilities */}
                {currentJob.responsibilities && currentJob.responsibilities.length > 0 && (
                  <div className="mb-5">
                    <h3 className="h4 mb-3">Key Responsibilities</h3>
                    <ul className="list-unstyled">
                      {currentJob.responsibilities.map((resp, index) => (
                        <li key={index} className="mb-2">
                          <i className="bi bi-arrow-right-circle text-primary me-2"></i>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Benefits */}
                {currentJob.benefits && currentJob.benefits.length > 0 && (
                  <div className="mb-4">
                    <h3 className="h4 mb-3">Benefits & Perks</h3>
                    <div className="row g-2">
                      {currentJob.benefits.map((benefit, index) => (
                        <div key={index} className="col-md-6">
                          <div className="border p-3 bg-light" style={{ borderRadius: 0 }}>
                            <i className="bi bi-check-circle text-success me-2"></i>
                            {benefit}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Application Deadline */}
                {currentJob.applicationDeadline && (
                  <div className="alert alert-warning mb-4" style={{ borderRadius: 0 }}>
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Application deadline: {new Date(currentJob.applicationDeadline).toLocaleDateString()}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="d-flex gap-3 mt-5 pt-4 border-top">
                  <button
                    className="btn btn-success btn-lg grow"
                    onClick={() => navigate(`/careers/apply/${currentJob.slug || currentJob.id}`)}
                    // onClick={() => setShowApplicationForm(true)}
                    style={{ borderRadius: 0 }}
                  >
                    <i className="bi bi-send me-2"></i> Apply Now
                  </button>
                  <button className="btn btn-outline-success btn-lg" style={{ borderRadius: 0 }}>
                    <i className="bi bi-star me-2"></i> Save Job
                  </button>
                  <button className="btn btn-outline-secondary btn-lg" style={{ borderRadius: 0 }}>
                    <i className="bi bi-share me-2"></i> Share
                  </button>
                  <button
                    className="btn btn-success btn-lg grow"
                    onClick={() => navigate('/careers')}
                    style={{ borderRadius: 0 }}
                  >
                    <i className="bi bi-briefcase me-2"></i> Back To Careers
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div style={{ position: 'sticky', top: '20px' }}>
              {/* Company Info */}
              <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 0 }}>
                <div className="card-body p-4" style={{ borderRadius: 0 }}>
                  <h5 className="card-title mb-3">About Our Company</h5>
                  <p className="text-muted small mb-0">
                    We are a leading company in our industry, committed to excellence and innovation.
                    Join us to build your career with a team that values growth and collaboration.
                  </p>
                </div>
              </div>

              {/* Job Summary */}
              <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 0 }}>
                <div className="card-body p-4" style={{ borderRadius: 0 }}>
                  <h5 className="card-title mb-3">Job Summary</h5>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-3 d-flex justify-content-between">
                      <span className="text-muted">Department:</span>
                      <strong>{currentJob.department || 'General'}</strong>
                    </li>
                    <li className="mb-3 d-flex justify-content-between">
                      <span className="text-muted">Location:</span>
                      <strong>{currentJob.location || 'Not specified'}</strong>
                    </li>
                    <li className="mb-3 d-flex justify-content-between">
                      <span className="text-muted">Type:</span>
                      <strong>{formatEmploymentType(currentJob.employmentType)}</strong>
                    </li>
                    <li className="mb-3 d-flex justify-content-between">
                      <span className="text-muted">Experience:</span>
                      <strong>{formatExperienceLevel(currentJob.experienceLevel)}</strong>
                    </li>
                    <li className="mb-3 d-flex justify-content-between">
                      <span className="text-muted">Salary:</span>
                      <strong>{formatSalary(currentJob.salaryRangeMin, currentJob.salaryRangeMax, currentJob.salaryCurrency)}</strong>
                    </li>
                    <li className="mb-3 d-flex justify-content-between">
                      <span className="text-muted">Applications:</span>
                      <strong>{currentJob.applicationsCount || 0}</strong>
                    </li>
                    <li className="d-flex justify-content-between">
                      <span className="text-muted">Posted:</span>
                      <strong>{getDaysAgo(currentJob.createdAt)} days ago</strong>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Contact Info */}
              <div className="card border-0 shadow-sm" style={{ borderRadius: 0 }}>
                <div className="card-body p-4" style={{ borderRadius: 0 }}>
                  <h5 className="card-title mb-3">Have Questions?</h5>
                  <p className="small text-muted mb-3">
                    Contact our HR department for more information about this position.
                  </p>
                  <div className="d-grid">
                    <a href="mailto: hr@natgasuganda.com" className="btn btn-outline-success" style={{ borderRadius: 0 }}>
                      <i className="bi bi-envelope me-2"></i> Email HR
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div 
          className="modal show d-block" 
          tabIndex="-1" 
          role="dialog" 
          style={{ 
            backgroundColor: 'rgba(0,0,0,0.5)',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1055
          }}
        >
          <div 
            className="modal-dialog modal-lg modal-dialog-centered"
            style={{ 
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div className="modal-content" style={{ borderRadius: 0 }}>
              <div className="modal-header" style={{ borderRadius: 0 }}>
                <h5 className="modal-title">Apply for {currentJob.title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowApplicationForm(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {/* <ApplicationForm
                  jobId={currentJob.id}
                  jobTitle={currentJob.title}
                  onSuccess={() => {
                    setShowApplicationForm(false);
                  }}
                /> */}
                <p className="text-center py-4">Application form coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS for sharp corners */}
      <style jsx>{`
        .card, .card-body, .alert, .badge, .btn, 
        .border, .modal-content, .modal-header,
        div[class*="bg-"] {
          border-radius: 0 !important;
        }
        
        /* Override any Bootstrap classes that might add border-radius */
        :global(.rounded), :global(.rounded-1), :global(.rounded-2), 
        :global(.rounded-3), :global(.rounded-4), :global(.rounded-5),
        :global(.rounded-pill), :global(.rounded-circle) {
          border-radius: 0 !important;
        }
        
        /* Ensure all elements have sharp corners */
        * {
          border-radius: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default JobDetailsPage;



import React from 'react';
import { useNavigate } from 'react-router-dom';

const JobListItem = ({ job }) => {
  const navigate = useNavigate();

  // Calculate days ago from createdAt
  const getDaysAgo = (dateString) => {
    if (!dateString) return '30';
    const posted = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Format experience level for display
  const formatExperienceLevel = (level) => {
    const levels = {
      'ENTRY': 'Entry',
      'JUNIOR': '1-2',
      'MID': '2-5',
      'SENIOR': '5+',
      'LEAD': '8+',
      'MANAGER': '5+',
      'DIRECTOR': '10+'
    };
    return levels[level] || level || '2';
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
    return types[type] || type || 'Full Time';
  };

  // Format salary for display
  const formatSalary = (min, max, currency = 'UGX') => {
    if (!min && !max) return 'Not specified';
    const currencySymbol = currency === 'UGX' ? 'USh' : currency;
    if (min && max) return `${currencySymbol}${min.toLocaleString()} - ${currencySymbol}${max.toLocaleString()}`;
    if (min) return `From ${currencySymbol}${min.toLocaleString()}`;
    if (max) return `Up to ${currencySymbol}${max.toLocaleString()}`;
    return 'Not specified';
  };

  const getDepartmentColor = (department) => {
    const colors = {
      'Web Developer': 'bg-info',
      'Accounting/Finance': 'bg-success',
      'Construction/Facilities': 'bg-warning',
      'Design & Multimedia': 'bg-primary',
      'Education Training': 'bg-primary',
      'Health': 'bg-danger',
      'Restaurant/Food Service': 'bg-secondary',
      'Telecommunications': 'bg-info',
      'Estate Agency': 'bg-secondary'
    };
    return colors[department] || 'bg-secondary';
  };

  return (
    <div 
      className="list-group-item list-group-item-action border-0 py-4"
      style={{
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        borderRadius: 0 // Sharp corners for list item
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f8f9fa';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'white';
      }}
      onClick={() => navigate(`/careers/jobs/${job.id}`)}
    >
      <div className="row align-items-center">
        <div className="col-lg-8">
          <div className="d-flex align-items-start">
            {/* Company Logo/Icon */}
            <div className="shrink-0 me-3">
              <div 
                className="bg-success text-white d-flex align-items-center justify-content-center" 
                style={{ 
                  width: '50px', 
                  height: '50px',
                  borderRadius: 0 
                }}
              >
                <i className="bi bi-building fs-4"></i>
              </div>
            </div>
            
            {/* Job Details */}
            <div className="grow">
              <h5 className="mb-1">{job.title}</h5>
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span className={`badge ${getDepartmentColor(job.department)} text-white`} style={{ borderRadius: 0 }}>
                  {job.department || 'General'}
                </span>
                <span className="text-muted">
                  <i className="bi bi-geo-alt me-1"></i>
                  {job.location || 'Location not specified'}
                </span>
                <span className="text-muted">
                  <i className="bi bi-clock me-1"></i>
                  {formatEmploymentType(job.employmentType)}
                </span>
                {job.isRemote && (
                  <span className="badge bg-success" style={{ borderRadius: 0 }}>Remote</span>
                )}
              </div>
              
              {/* Quick Info */}
              <div className="d-flex gap-4 flex-wrap">
                <div>
                  <small className="text-muted">Salary</small>
                  <div className="fw-bold small">
                    {formatSalary(job.salaryRangeMin, job.salaryRangeMax, job.salaryCurrency)}
                  </div>
                </div>
                <div>
                  <small className="text-muted">Experience</small>
                  <div className="fw-bold small">{formatExperienceLevel(job.experienceLevel)}+ years</div>
                </div>
                <div>
                  <small className="text-muted">Applications</small>
                  <div className="fw-bold small">{job.applicationsCount || 0}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="d-flex flex-column align-items-end gap-2">
            <small className="text-muted">
              <i className="bi bi-clock-history me-1"></i>
              Posted {getDaysAgo(job.createdAt)} days ago
            </small>
            {job.applicationDeadline && (
              <small className="text-warning">
                <i className="bi bi-exclamation-triangle me-1"></i>
                Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
              </small>
            )}
            <div className="d-flex gap-2">
              <button 
                className="btn btn-success btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/careers/jobs/${job.id}`);
                }}
                style={{ borderRadius: 0 }}
              >
                <i className="bi bi-eye me-1"></i> View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS to ensure no border-radius anywhere */}
      <style jsx>{`
        .list-group-item, .badge, .btn, div[class*="bg-"] {
          border-radius: 0 !important;
        }
        
        /* Override any Bootstrap classes that might add border-radius */
        :global(.rounded), :global(.rounded-1), :global(.rounded-2), 
        :global(.rounded-3), :global(.rounded-4), :global(.rounded-5),
        :global(.rounded-circle), :global(.rounded-pill) {
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

export default JobListItem;



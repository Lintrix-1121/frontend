// src/components/career/JobCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    console.log('🖱️ JobCard clicked - navigating to:', `/careers/jobs/${job.id}`);
    console.log('🖱️ Job ID being sent:', job.id);
    navigate(`/careers/jobs/${job.id}`);
  };

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
    return types[type] || type || 'Full Time';
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

  const getDepartmentColor = (department) => {
    const colors = {
      'Web Developer': 'success',
      'Accounting/Finance': 'success',
      'Construction/Facilities': 'warning',
      'Design & Multimedia': 'primary',
      'Education Training': 'primary',
      'Health': 'danger',
      'Restaurant/Food Service': 'secondary',
      'Telecommunications': 'info',
      'Estate Agency': 'secondary'
    };
    return colors[department] || 'secondary';
  };

  return (
    <div 
      className="h-100 p-4"
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
        e.currentTarget.style.borderColor = 'rgba(40, 167, 69, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.1)';
      }}
      onClick={handleViewDetails}
    >
      {/* Department Badge */}
      <div className="d-flex gap-2 mb-3">
        <span 
          className="badge"
          style={{
            background: `rgba(40, 167, 69, 0.1)`,
            color: '#28a745',
            padding: '0.5rem 1rem',
            fontWeight: 'normal'
          }}
        >
          {job.department || 'General'}
        </span>
        {job.isRemote && (
          <span 
            className="badge"
            style={{
              background: 'rgba(23, 162, 184, 0.1)',
              color: '#17a2b8',
              padding: '0.5rem 1rem',
              fontWeight: 'normal'
            }}
          >
            Remote
          </span>
        )}
      </div>

      {/* Job Title */}
      <h5 
        className="fw-semibold mb-2 text-dark"
        style={{ 
          transition: 'color 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.target.style.color = '#28a745'}
        onMouseLeave={(e) => e.target.style.color = '#212529'}
      >
        {job.title}
      </h5>

      {/* Location */}
      <div className="d-flex align-items-center mb-3">
        <i className="bi bi-geo-alt text-secondary me-2" style={{ fontSize: '0.9rem' }}></i>
        <small className="text-muted">{job.location || 'Location not specified'}</small>
      </div>

      {/* Job Details */}
      <div className="vstack gap-2 mb-4">
        <div className="d-flex align-items-center">
          <i className="bi bi-cash text-success me-2" style={{ fontSize: '0.9rem' }}></i>
          <small>
            <span className="fw-medium">Salary:</span>{' '}
            <span className="text-muted">{formatSalary(job.salaryRangeMin, job.salaryRangeMax, job.salaryCurrency)}</span>
          </small>
        </div>
        <div className="d-flex align-items-center">
          <i className="bi bi-briefcase text-success me-2" style={{ fontSize: '0.9rem' }}></i>
          <small>
            <span className="fw-medium">Type:</span>{' '}
            <span className="text-muted">{formatEmploymentType(job.employmentType)}</span>
          </small>
        </div>
        <div className="d-flex align-items-center">
          <i className="bi bi-clock text-success me-2" style={{ fontSize: '0.9rem' }}></i>
          <small>
            <span className="fw-medium">Experience:</span>{' '}
            <span className="text-muted">{formatExperienceLevel(job.experienceLevel)}</span>
          </small>
        </div>
        {job.numberOfOpenings > 1 && (
          <div className="d-flex align-items-center">
            <i className="bi bi-people text-success me-2" style={{ fontSize: '0.9rem' }}></i>
            <small>
              <span className="fw-medium">Openings:</span>{' '}
              <span className="text-muted">{job.numberOfOpenings}</span>
            </small>
          </div>
        )}
      </div>

      {/* Posted Date and Applications */}
      <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top" 
        style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}>
        <small className="text-muted">
          <i className="bi bi-clock-history me-1"></i>
          Posted {getDaysAgo(job.createdAt)} days ago
        </small>
        <span 
          className="badge"
          style={{
            background: 'rgba(108, 117, 125, 0.1)',
            color: '#6c757d',
            padding: '0.5rem 1rem',
            fontWeight: 'normal'
          }}
        >
          {job.applicationsCount || 0} applications
        </span>
      </div>

      {/* Application Deadline if exists */}
      {job.applicationDeadline && (
        <div className="mt-3">
          <small className="text-warning">
            <i className="bi bi-exclamation-triangle me-1"></i>
            Apply by: {new Date(job.applicationDeadline).toLocaleDateString()}
          </small>
        </div>
      )}

      {/* Action Buttons */}
      <div className="d-grid mt-4">
        <button 
          className="btn"
          style={{
            background: 'rgba(40, 167, 69, 0.1)',
            color: '#28a745',
            border: '1px solid rgba(40, 167, 69, 0.2)',
            transition: 'all 0.3s ease'
          }}
          onClick={(e) => {
            e.stopPropagation();  
            handleViewDetails();
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#28a745';
            e.target.style.color = 'white';
            e.target.style.borderColor = '#28a745';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(40, 167, 69, 0.1)';
            e.target.style.color = '#28a745';
            e.target.style.borderColor = 'rgba(40, 167, 69, 0.2)';
          }}
        >
          <i className="bi bi-eye me-2"></i>
          View Details
        </button>
      </div>
    </div>
  );
};

export default JobCard;// // src/components/career/JobCard.jsx
// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const JobCard = ({ job }) => {
//   const navigate = useNavigate();

//   // const handleViewDetails = () => {
//   //   navigate(`/careers/jobs/${job.id}`);
//   // };
//   const handleViewDetails = () => {
//     console.log('🖱️ JobCard clicked - navigating to:', `/careers/jobs/${job.id}`);
//     console.log('🖱️ Job ID being sent:', job.id);
//     navigate(`/careers/jobs/${job.id}`);
//   };

//   // Calculate days ago from createdAt
//   const getDaysAgo = (dateString) => {
//     if (!dateString) return '30';
//     const posted = new Date(dateString);
//     const now = new Date();
//     const diffTime = Math.abs(now - posted);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays;
//   };

//   // Format experience level for display
//   const formatExperienceLevel = (level) => {
//     const levels = {
//       'ENTRY': 'Entry Level',
//       'JUNIOR': '1-2 years',
//       'MID': '2-5 years',
//       'SENIOR': '5+ years',
//       'LEAD': '8+ years',
//       'MANAGER': '5+ years',
//       'DIRECTOR': '10+ years'
//     };
//     return levels[level] || level || 'Not specified';
//   };

//   // Format employment type for display
//   const formatEmploymentType = (type) => {
//     const types = {
//       'FULL_TIME': 'Full Time',
//       'PART_TIME': 'Part Time',
//       'CONTRACT': 'Contract',
//       'INTERNSHIP': 'Internship',
//       'REMOTE': 'Remote',
//       'HYBRID': 'Hybrid'
//     };
//     return types[type] || type || 'Full Time';
//   };

//   // Format salary for display
//   const formatSalary = (min, max, currency = 'USD') => {
//     if (!min && !max) return 'Not specified';
//     const currencySymbol = currency === 'USD' ? '$' : currency;
//     if (min && max) return `${currencySymbol}${min.toLocaleString()} - ${currencySymbol}${max.toLocaleString()}`;
//     if (min) return `From ${currencySymbol}${min.toLocaleString()}`;
//     if (max) return `Up to ${currencySymbol}${max.toLocaleString()}`;
//     return 'Not specified';
//   };

//   const getDepartmentColor = (department) => {
//     const colors = {
//       'Web Developer': 'bg-info',
//       'Accounting/Finance': 'bg-success',
//       'Construction/Facilities': 'bg-warning',
//       'Design & Multimedia': 'bg-primary',
//       'Education Training': 'bg-primary',
//       'Health': 'bg-danger',
//       'Restaurant/Food Service': 'bg-secondary',
//       'Telecommunications': 'bg-info',
//       'Estate Agency': 'bg-secondary'
//     };
//     return colors[department] || 'bg-secondary';
//   };

//   return (
//     <div 
//       className="card h-100 border-0 shadow-sm" 
//       style={{ 
//         transition: 'transform 0.2s ease, box-shadow 0.2s ease',
//         cursor: 'pointer',
//         borderRadius: 0 // Added sharp corners
//       }}
//       onMouseEnter={(e) => {
//         e.currentTarget.style.transform = 'translateY(-5px)';
//         e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
//       }}
//       onMouseLeave={(e) => {
//         e.currentTarget.style.transform = 'translateY(0)';
//         e.currentTarget.style.boxShadow = '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)';
//       }}
//       onClick={handleViewDetails}
//     >
//       <div className="card-body d-flex flex-column" style={{ borderRadius: 0 }}>
//         {/* Department Badge */}
//         <div className="mb-3">
//           <span className={`badge ${getDepartmentColor(job.department)} text-white`} style={{ borderRadius: 0 }}>
//             {job.department || 'General'}
//           </span>
//           {job.isRemote && (
//             <span className="badge bg-success ms-2" style={{ borderRadius: 0 }}>Remote</span>
//           )}
//         </div>

//         {/* Job Title */}
//         <h5 className="card-title mb-2">{job.title}</h5>

//         {/* Location */}
//         <div className="d-flex align-items-center mb-3">
//           <small className="text-muted">
//             <i className="bi bi-geo-alt me-1"></i>
//             {job.location || 'Location not specified'}
//           </small>
//         </div>

//         {/* Job Details */}
//         <ul className="list-unstyled mb-4">
//           <li className="mb-2">
//             <i className="bi bi-cash text-primary me-2"></i>
//             <strong>Salary:</strong> {formatSalary(job.salaryRangeMin, job.salaryRangeMax, job.salaryCurrency)}
//           </li>
//           <li className="mb-2">
//             <i className="bi bi-briefcase text-primary me-2"></i>
//             <strong>Type:</strong> {formatEmploymentType(job.employmentType)}
//           </li>
//           <li className="mb-2">
//             <i className="bi bi-clock text-primary me-2"></i>
//             <strong>Experience:</strong> {formatExperienceLevel(job.experienceLevel)}
//           </li>
//           {job.numberOfOpenings > 1 && (
//             <li className="mb-2">
//               <i className="bi bi-people text-primary me-2"></i>
//               <strong>Openings:</strong> {job.numberOfOpenings}
//             </li>
//           )}
//         </ul>

//         {/* Posted Date and Applications */}
//         <div className="d-flex justify-content-between align-items-center mt-auto">
//           <small className="text-muted">
//             <i className="bi bi-clock-history me-1"></i>
//             Posted {getDaysAgo(job.createdAt)} days ago
//           </small>
//           <span className="badge bg-light text-dark border" style={{ borderRadius: 0 }}>
//             {job.applicationsCount || 0} applications
//           </span>
//         </div>

//         {/* Application Deadline if exists */}
//         {job.applicationDeadline && (
//           <div className="mt-2">
//             <small className="text-warning">
//               <i className="bi bi-exclamation-triangle me-1"></i>
//               Apply by: {new Date(job.applicationDeadline).toLocaleDateString()}
//             </small>
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="d-grid gap-2 mt-4">
//           <button 
//             className="btn btn-success" 
//             onClick={(e) => {
//               e.stopPropagation();  
//               handleViewDetails();
//             }}
//             style={{ borderRadius: 0 }}
//           >
//             <i className="bi bi-eye me-1"></i> View Details
//           </button>
//         </div>
//       </div>

//       {/* Add CSS to ensure no border-radius anywhere */}
//       <style jsx>{`
//         .card, .card-body, .badge, .btn, div[class*="bg-"] {
//           border-radius: 0 !important;
//         }
        
//         /* Override any Bootstrap classes that might add border-radius */
//         :global(.rounded), :global(.rounded-1), :global(.rounded-2), 
//         :global(.rounded-3), :global(.rounded-4), :global(.rounded-5),
//         :global(.rounded-pill), :global(.rounded-circle) {
//           border-radius: 0 !important;
//         }
        
//         /* Ensure all elements have sharp corners */
//         * {
//           border-radius: 0 !important;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default JobCard;





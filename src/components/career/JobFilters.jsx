// src/components/career/JobFilters.jsx
import React, { useState, useRef, useEffect } from 'react';

const JobFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef(null);

  const departments = [
    'Web Developer',
    'Accounting/Finance',
    'Construction/Facilities',
    'Design & Multimedia',
    'Education Training',
    'Health',
    'Restaurant/Food Service',
    'Telecommunications',
    'Estate Agency'
  ];

  const locations = [
    'New York',
    'Nevada',
    'Remote',
    'California',
    'Texas',
    'Florida',
    'Illinois'
  ];

  const employmentTypes = [
    'Full Time',
    'Part Time',
    'Contract',
    'Temporary',
    'Internship'
  ];

  const experienceLevels = [
    'Entry Level',
    '1-2 years',
    '2-5 years',
    '5+ years',
    '10+ years'
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="position-relative" ref={filterRef}>
      <button
        className="btn btn-outline-secondary"
        onClick={() => setShowFilters(!showFilters)}
        type="button"
      >
        <i className="bi bi-funnel me-1"></i>
        Filters {Object.values(filters).filter(Boolean).length > 0 && (
          <span className="badge bg-primary ms-1">
            {Object.values(filters).filter(Boolean).length}
          </span>
        )}
      </button>

      {showFilters && (
        <div 
          className="bg-white border rounded shadow-lg p-3" 
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '0.5rem',
            zIndex: 1050,
            width: '280px'
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0 fw-bold">Filter Jobs</h6>
            <button
              className="btn btn-sm btn-outline-secondary border-0 p-0"
              onClick={() => setShowFilters(false)}
              type="button"
              style={{ width: '24px', height: '24px' }}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {/* Department Filter */}
          <div className="mb-3">
            <label className="form-label small fw-bold mb-1">Department</label>
            <select
              className="form-select form-select-sm"
              value={filters.department || ''}
              onChange={(e) => onFilterChange({ department: e.target.value || '' })}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div className="mb-3">
            <label className="form-label small fw-bold mb-1">Location</label>
            <select
              className="form-select form-select-sm"
              value={filters.location || ''}
              onChange={(e) => onFilterChange({ location: e.target.value || '' })}
            >
              <option value="">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Employment Type */}
          <div className="mb-3">
            <label className="form-label small fw-bold mb-1">Employment Type</label>
            <select
              className="form-select form-select-sm"
              value={filters.employmentType || ''}
              onChange={(e) => onFilterChange({ employmentType: e.target.value || '' })}
            >
              <option value="">All Types</option>
              {employmentTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Experience Level */}
          <div className="mb-3">
            <label className="form-label small fw-bold mb-1">Experience Level</label>
            <select
              className="form-select form-select-sm"
              value={filters.experienceLevel || ''}
              onChange={(e) => onFilterChange({ experienceLevel: e.target.value || '' })}
            >
              <option value="">Any Experience</option>
              {experienceLevels.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          {/* Remote Work */}
          <div className="mb-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={filters.isRemote === true}
                onChange={(e) => onFilterChange({ isRemote: e.target.checked ? true : null })}
                id="remoteCheck"
              />
              <label className="form-check-label small ms-2" htmlFor="remoteCheck">
                Remote Jobs Only
              </label>
            </div>
          </div>

          {/* Active Jobs Filter */}
          <div className="mb-4">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={filters.isActive === true} // Only true when explicitly true
                onChange={(e) => {
                  // When checked: set isActive: true
                  // When unchecked: remove the filter completely (null/undefined)
                  onFilterChange({ isActive: e.target.checked ? true : null });
                }}
                id="activeCheck"
              />
              <label className="form-check-label small ms-2" htmlFor="activeCheck">
                Show Only Active Jobs
              </label>
            </div>
            {/* Optional: Add a small helper text */}
            <small className="text-muted d-block mt-1">
              {filters.isActive === true 
                ? "Showing only active positions" 
                : "Showing all positions (active and inactive)"}
            </small>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary btn-sm grow"
              onClick={() => {
                onClearFilters();
                setShowFilters(false);
              }}
              type="button"
            >
              Clear All
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowFilters(false)}
              type="button"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobFilters;
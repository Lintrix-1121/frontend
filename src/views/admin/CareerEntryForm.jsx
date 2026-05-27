// src/components/career/CareerEntryForm.jsx
import React, { useState } from 'react';
import useCareerStore from '../../stores/shared/careerStore';

const CareerEntryForm = ({ onSuccess, editJob = null }) => {
  const { createJob, updateJob, loading, error } = useCareerStore();
  const [formData, setFormData] = useState({
    title: editJob?.title || '',
    department: editJob?.department || '',
    location: editJob?.location || '',
    description: editJob?.description || '',
    requirements: editJob?.requirements || '',
    responsibilities: editJob?.responsibilities || '',
    salaryMin: editJob?.salaryMin || '',
    salaryMax: editJob?.salaryMax || '',
    employmentType: editJob?.employmentType || 'Full Time',
    experienceLevel: editJob?.experienceLevel || '2+ years',
    openings: editJob?.openings || '1',
    isRemote: editJob?.isRemote || false,
    isActive: editJob?.isActive !== false,
    applicationDeadline: editJob?.applicationDeadline || '',
    benefits: editJob?.benefits || ''
  });

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

  const employmentTypes = [
    'Full Time',
    'Part Time',
    'Contract',
    'Temporary',
    'Internship'
  ];

  const experienceLevels = [
    'Entry Level',
    '1+ year',
    '2+ years',
    '3+ years',
    '5+ years',
    '10+ years'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = editJob 
      ? await updateJob(editJob.id, formData)
      : await createJob(formData);
    
    if (result.success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="card border-0 shadow">
      <div className="card-body p-4">
        <h4 className="card-title mb-4">{editJob ? 'Edit Job' : 'Create New Job Posting'}</h4>
        
        {error && (
          <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => useCareerStore.getState().clearError()}></button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Job Title *</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Department *</label>
              <select
                className="form-select"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Location *</label>
              <input
                type="text"
                className="form-control"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Employment Type</label>
              <select
                className="form-select"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
              >
                {employmentTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Salary Range</label>
              <div className="row g-2">
                <div className="col">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Min"
                    name="salaryMin"
                    value={formData.salaryMin}
                    onChange={handleChange}
                  />
                </div>
                <div className="col">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Max"
                    name="salaryMax"
                    value={formData.salaryMax}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Experience Level</label>
              <select
                className="form-select"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
              >
                {experienceLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Number of Openings</label>
              <input
                type="number"
                className="form-control"
                name="openings"
                value={formData.openings}
                onChange={handleChange}
                min="1"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Application Deadline</label>
              <input
                type="date"
                className="form-control"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 mb-3">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  name="isRemote"
                  checked={formData.isRemote}
                  onChange={handleChange}
                  id="remoteSwitch"
                />
                <label className="form-check-label" htmlFor="remoteSwitch">
                  Remote Position Available
                </label>
              </div>
            </div>

            <div className="col-12 mb-3">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  id="activeSwitch"
                />
                <label className="form-check-label" htmlFor="activeSwitch">
                  Active Listing
                </label>
              </div>
            </div>

            <div className="col-12 mb-3">
              <label className="form-label">Job Description *</label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>

            <div className="col-12 mb-3">
              <label className="form-label">Requirements</label>
              <textarea
                className="form-control"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows="3"
                placeholder="List job requirements (one per line or comma separated)"
              />
            </div>

            <div className="col-12 mb-3">
              <label className="form-label">Responsibilities</label>
              <textarea
                className="form-control"
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                rows="3"
                placeholder="List key responsibilities"
              />
            </div>

            <div className="col-12 mb-4">
              <label className="form-label">Benefits & Perks</label>
              <textarea
                className="form-control"
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                rows="2"
                placeholder="List benefits offered"
              />
            </div>

            <div className="col-12">
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => onSuccess && onSuccess()}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      {editJob ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editJob ? 'Update Job' : 'Create Job'
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CareerEntryForm;



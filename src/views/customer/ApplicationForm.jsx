// pages/careers/JobApplicationPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useCareerStore from '../../stores/shared/careerStore';
import { 
  Briefcase, 
  MapPin, 
  Calendar,
  Upload,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  DollarSign,
  Building,
  Linkedin,
  Github,
  Globe,
  FileText
} from 'lucide-react';

const ApplicationForm = () => {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const { 
    currentJob, 
    loading, 
    error,
    fetchJob,
    applyForJob,
    clearCurrentJob
  } = useCareerStore();

  const [formData, setFormData] = useState({
    applicantName: '',
    email: '',
    phone: '',
    currentCompany: '',
    currentTitle: '',
    yearsOfExperience: '',
    noticePeriod: '',
    salaryExpectation: '',
    coverLetter: '',
    portfolioUrl: '',
    linkedinUrl: '',
    githubUrl: '',
    consentDataProcessing: false,
    consentPrivacyPolicy: false,
    source: 'CAREER_PAGE',
    CareerJobId: ''
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileName, setResumeFileName] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (idOrSlug) {
      fetchJob(idOrSlug);
    }

    return () => {
      clearCurrentJob();
    };
  }, [idOrSlug]);

  useEffect(() => {
    if (currentJob) {
      setFormData(prev => ({
        ...prev,
        CareerJobId: currentJob.id
      }));
    }
  }, [currentJob]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        setFormErrors(prev => ({ 
          ...prev, 
          resume: 'Please upload a PDF or Word document' 
        }));
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({ 
          ...prev, 
          resume: 'File size must be less than 5MB' 
        }));
        return;
      }
      
      setResumeFile(file);
      setResumeFileName(file.name);
      setFormErrors(prev => ({ ...prev, resume: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Required fields
    if (!formData.applicantName.trim()) {
      errors.applicantName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }

    if (!resumeFile) {
      errors.resume = 'Resume is required';
    }

    if (!formData.consentDataProcessing) {
      errors.consentDataProcessing = 'You must consent to data processing';
    }

    if (!formData.consentPrivacyPolicy) {
      errors.consentPrivacyPolicy = 'You must accept the privacy policy';
    }

    // Optional fields validation
    if (formData.yearsOfExperience && (formData.yearsOfExperience < 0 || formData.yearsOfExperience > 50)) {
      errors.yearsOfExperience = 'Please enter a valid number of years';
    }

    if (formData.noticePeriod && formData.noticePeriod < 0) {
      errors.noticePeriod = 'Please enter a valid notice period';
    }

    if (formData.salaryExpectation && formData.salaryExpectation < 0) {
      errors.salaryExpectation = 'Please enter a valid salary expectation';
    }

    if (formData.portfolioUrl && !isValidUrl(formData.portfolioUrl)) {
      errors.portfolioUrl = 'Please enter a valid URL';
    }

    if (formData.linkedinUrl && !isValidUrl(formData.linkedinUrl)) {
      errors.linkedinUrl = 'Please enter a valid URL';
    }

    if (formData.githubUrl && !isValidUrl(formData.githubUrl)) {
      errors.githubUrl = 'Please enter a valid URL';
    }

    return errors;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const result = await applyForJob(formData, resumeFile);
      
      if (result.success) {
        setSubmitSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setSubmitError(result.error || 'Failed to submit application');
      }
    } catch (error) {
      setSubmitError(error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatEmploymentType = (type) => {
    const types = {
      'FULL_TIME': 'Full Time',
      'PART_TIME': 'Part Time',
      'CONTRACT': 'Contract',
      'INTERNSHIP': 'Internship',
      'REMOTE': 'Remote',
      'HYBRID': 'Hybrid'
    };
    return types[type] || type;
  };

  const formatExperienceLevel = (level) => {
    const levels = {
      'ENTRY': 'Entry Level',
      'JUNIOR': 'Junior',
      'MID': 'Mid Level',
      'SENIOR': 'Senior',
      'LEAD': 'Lead',
      'MANAGER': 'Manager',
      'DIRECTOR': 'Director'
    };
    return levels[level] || level;
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-linear-to-r from-blue-50 to-indigo-50 d-flex align-items-center justify-content-center">
        <div className="glass-card p-5 text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mb-0">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !currentJob) {
    return (
      <div className="min-vh-100 bg-linear-to-r from-blue-50 to-indigo-50 d-flex align-items-center justify-content-center p-3">
        <div className="glass-card p-5 text-center" style={{ maxWidth: '500px' }}>
          <div className="bg-danger-soft rounded-circle d-inline-flex p-3 mb-4">
            <AlertCircle size={48} className="text-danger" />
          </div>
          <h2 className="h2 fw-bold text-gray-900 mb-3">Job Not Found</h2>
          <p className="text-muted mb-4">{error || 'The job you\'re looking for doesn\'t exist or is no longer available.'}</p>
          <Link
            to="/careers"
            className="btn btn-primary rounded-pill px-4 py-2"
          >
            <ArrowLeft size={18} className="me-2" />
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="min-vh-100 bg-linear-to-r from-blue-50 to-indigo-50 d-flex align-items-center justify-content-center p-3">
        <div className="glass-card p-5 text-center" style={{ maxWidth: '500px' }}>
          <div className="bg-success-soft rounded-circle d-inline-flex p-3 mb-4">
            <CheckCircle size={48} className="text-success" />
          </div>
          <h2 className="h2 fw-bold text-gray-900 mb-3">Application Submitted!</h2>
          <p className="text-muted mb-4">
            Thank you for applying to {currentJob.title} position. We'll review your application and get back to you soon.
          </p>
          <div className="bg-info-soft rounded-3 p-3 mb-4 text-start">
            <p className="small text-info mb-0">
              <strong>Next steps:</strong> You'll receive a confirmation email at {formData.email}. 
              Our team will review your application and contact you if your qualifications match our requirements.
            </p>
          </div>
          <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
            <Link
              to="/careers"
              className="btn btn-primary rounded-pill px-4"
            >
              Browse More Jobs
            </Link>
            <Link
              to="/"
              className="btn btn-outline-secondary rounded-pill px-4"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-linear-to-r from-blue-50 to-indigo-50 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            {/* Back Button */}
            <Link
              to={`/careers/${currentJob.slug || currentJob.id}`}
              className="d-inline-flex align-items-center text-decoration-none text-secondary mb-4 hover-lift"
            >
              <ArrowLeft size={20} className="me-2" />
              Back to Job Details
            </Link>

            {/* Job Summary - Glass Card */}
            <div className="glass-card mb-4">
              <div className="card-body p-4">
                <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-3">
                  <h1 className="h2 fw-bold text-gray-900 mb-0">{currentJob.title}</h1>
                  <div className="d-flex gap-2">
                    <span className="badge bg-primary-soft text-primary px-3 py-2 rounded-pill">
                      <Briefcase size={14} className="me-1" />
                      {currentJob.department}
                    </span>
                    {currentJob.isRemote && (
                      <span className="badge bg-success-soft text-success px-3 py-2 rounded-pill">
                        Remote
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="d-flex flex-wrap gap-4 text-secondary mb-3">
                  <span className="d-flex align-items-center">
                    <MapPin size={16} className="me-1 text-primary" />
                    {currentJob.location}
                  </span>
                  {currentJob.salaryRangeMin && currentJob.salaryRangeMax && (
                    <span className="d-flex align-items-center">
                      <DollarSign size={16} className="me-1 text-success" />
                      {currentJob.salaryCurrency} {currentJob.salaryRangeMin.toLocaleString()} - {currentJob.salaryRangeMax.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="d-flex flex-wrap gap-2">
                  <span className="badge bg-info-soft text-info px-3 py-2 rounded-pill">
                    {formatEmploymentType(currentJob.employmentType)}
                  </span>
                  <span className="badge bg-purple-soft text-purple px-3 py-2 rounded-pill">
                    {formatExperienceLevel(currentJob.experienceLevel)}
                  </span>
                  {currentJob.numberOfOpenings > 1 && (
                    <span className="badge bg-warning-soft text-warning px-3 py-2 rounded-pill">
                      {currentJob.numberOfOpenings} openings
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Application Form - Glass Card */}
            <div className="glass-card">
              <div className="card-body p-4 p-lg-5">
                <h2 className="h3 fw-bold text-gray-900 mb-4">Application Form</h2>

                {submitError && (
                  <div className="alert alert-danger border-0 rounded-3 mb-4 d-flex align-items-center" role="alert">
                    <AlertCircle size={18} className="me-2 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Personal Information */}
                  <div className="mb-4">
                    <h3 className="h5 fw-semibold text-gray-900 mb-3">Personal Information</h3>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label text-secondary small fw-semibold">
                          Full Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="applicantName"
                          value={formData.applicantName}
                          onChange={handleChange}
                          className={`form-control glass-input ${formErrors.applicantName ? 'is-invalid' : ''}`}
                          placeholder="John Doe"
                        />
                        {formErrors.applicantName && (
                          <div className="invalid-feedback">{formErrors.applicantName}</div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label text-secondary small fw-semibold">
                          Email Address <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`form-control glass-input ${formErrors.email ? 'is-invalid' : ''}`}
                          placeholder="john@example.com"
                        />
                        {formErrors.email && (
                          <div className="invalid-feedback">{formErrors.email}</div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label text-secondary small fw-semibold">
                          Phone Number <span className="text-danger">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`form-control glass-input ${formErrors.phone ? 'is-invalid' : ''}`}
                          placeholder="+256 XXX XXX XXX"
                        />
                        {formErrors.phone && (
                          <div className="invalid-feedback">{formErrors.phone}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="mb-4">
                    <h3 className="h5 fw-semibold text-gray-900 mb-3">Professional Information</h3>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label text-secondary small fw-semibold">
                          Current Company
                        </label>
                        <input
                          type="text"
                          name="currentCompany"
                          value={formData.currentCompany}
                          onChange={handleChange}
                          className="form-control glass-input"
                          placeholder="Company name"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label text-secondary small fw-semibold">
                          Current Title
                        </label>
                        <input
                          type="text"
                          name="currentTitle"
                          value={formData.currentTitle}
                          onChange={handleChange}
                          className="form-control glass-input"
                          placeholder="Job title"
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label text-secondary small fw-semibold">
                          Years of Experience
                        </label>
                        <input
                          type="number"
                          name="yearsOfExperience"
                          value={formData.yearsOfExperience}
                          onChange={handleChange}
                          className={`form-control glass-input ${formErrors.yearsOfExperience ? 'is-invalid' : ''}`}
                          min="0"
                          max="50"
                          placeholder="0"
                        />
                        {formErrors.yearsOfExperience && (
                          <div className="invalid-feedback">{formErrors.yearsOfExperience}</div>
                        )}
                      </div>

                      <div className="col-md-4">
                        <label className="form-label text-secondary small fw-semibold">
                          Notice Period (days)
                        </label>
                        <input
                          type="number"
                          name="noticePeriod"
                          value={formData.noticePeriod}
                          onChange={handleChange}
                          className={`form-control glass-input ${formErrors.noticePeriod ? 'is-invalid' : ''}`}
                          min="0"
                          placeholder="30"
                        />
                        {formErrors.noticePeriod && (
                          <div className="invalid-feedback">{formErrors.noticePeriod}</div>
                        )}
                      </div>

                      <div className="col-md-4">
                        <label className="form-label text-secondary small fw-semibold">
                          Salary Expectation (UGX)
                        </label>
                        <input
                          type="number"
                          name="salaryExpectation"
                          value={formData.salaryExpectation}
                          onChange={handleChange}
                          className={`form-control glass-input ${formErrors.salaryExpectation ? 'is-invalid' : ''}`}
                          min="0"
                          placeholder="0"
                        />
                        {formErrors.salaryExpectation && (
                          <div className="invalid-feedback">{formErrors.salaryExpectation}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Resume Upload */}
                  <div className="mb-4">
                    <h3 className="h5 fw-semibold text-gray-900 mb-3">Resume/CV</h3>
                    <div className={`glass-upload p-4 text-center ${formErrors.resume ? 'border-danger' : ''}`}>
                      <input
                        type="file"
                        id="resume"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="d-none"
                      />
                      <label htmlFor="resume" className="cursor-pointer d-block mb-0">
                        <Upload size={32} className="text-primary mb-2" />
                        <p className="text-secondary mb-1">
                          {resumeFileName || 'Click to upload or drag and drop'}
                        </p>
                        <p className="small text-muted mb-0">
                          PDF, DOC, DOCX (Max 5MB)
                        </p>
                      </label>
                    </div>
                    {formErrors.resume && (
                      <p className="text-danger small mt-2">
                        <AlertCircle size={14} className="me-1" />
                        {formErrors.resume}
                      </p>
                    )}
                    {resumeFileName && (
                      <p className="text-success small mt-2 d-flex align-items-center">
                        <CheckCircle size={14} className="me-1" />
                        {resumeFileName} uploaded
                      </p>
                    )}
                  </div>

                  {/* Cover Letter */}
                  <div className="mb-4">
                    <h3 className="h5 fw-semibold text-gray-900 mb-3">Cover Letter</h3>
                    <textarea
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleChange}
                      rows="4"
                      className="form-control glass-input"
                      placeholder="Tell us about your relevant experience and why you'd be a great fit..."
                    />
                  </div>

                  {/* Online Profiles */}
                  <div className="mb-4">
                    <h3 className="h5 fw-semibold text-gray-900 mb-3">Online Profiles</h3>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="input-group">
                          <span className="input-group-text bg-transparent border-end-0">
                            <Globe size={16} className="text-secondary" />
                          </span>
                          <input
                            type="url"
                            name="portfolioUrl"
                            value={formData.portfolioUrl}
                            onChange={handleChange}
                            className={`form-control glass-input border-start-0 ${formErrors.portfolioUrl ? 'is-invalid' : ''}`}
                            placeholder="Portfolio website"
                          />
                        </div>
                        {formErrors.portfolioUrl && (
                          <div className="text-danger small mt-1">{formErrors.portfolioUrl}</div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <div className="input-group">
                          <span className="input-group-text bg-transparent border-end-0">
                            <Linkedin size={16} className="text-primary" />
                          </span>
                          <input
                            type="url"
                            name="linkedinUrl"
                            value={formData.linkedinUrl}
                            onChange={handleChange}
                            className={`form-control glass-input border-start-0 ${formErrors.linkedinUrl ? 'is-invalid' : ''}`}
                            placeholder="LinkedIn profile"
                          />
                        </div>
                        {formErrors.linkedinUrl && (
                          <div className="text-danger small mt-1">{formErrors.linkedinUrl}</div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <div className="input-group">
                          <span className="input-group-text bg-transparent border-end-0">
                            <Github size={16} className="text-dark" />
                          </span>
                          <input
                            type="url"
                            name="githubUrl"
                            value={formData.githubUrl}
                            onChange={handleChange}
                            className={`form-control glass-input border-start-0 ${formErrors.githubUrl ? 'is-invalid' : ''}`}
                            placeholder="GitHub profile"
                          />
                        </div>
                        {formErrors.githubUrl && (
                          <div className="text-danger small mt-1">{formErrors.githubUrl}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Consents */}
                  <div className="mb-4">
                    <div className="glass-consent p-3 rounded-3">
                      <div className="form-check mb-3">
                        <input
                          type="checkbox"
                          name="consentDataProcessing"
                          checked={formData.consentDataProcessing}
                          onChange={handleChange}
                          className="form-check-input"
                          id="consentData"
                        />
                        <label className="form-check-label small" htmlFor="consentData">
                          I consent to the processing of my personal data for recruitment purposes. <span className="text-danger">*</span>
                        </label>
                        {formErrors.consentDataProcessing && (
                          <p className="text-danger small mt-1 mb-0">{formErrors.consentDataProcessing}</p>
                        )}
                      </div>

                      <div className="form-check">
                        <input
                          type="checkbox"
                          name="consentPrivacyPolicy"
                          checked={formData.consentPrivacyPolicy}
                          onChange={handleChange}
                          className="form-check-input"
                          id="consentPrivacy"
                        />
                        <label className="form-check-label small" htmlFor="consentPrivacy">
                          I have read and agree to the Privacy Policy and Terms of Use. <span className="text-danger">*</span>
                        </label>
                        {formErrors.consentPrivacyPolicy && (
                          <p className="text-danger small mt-1 mb-0">{formErrors.consentPrivacyPolicy}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="text-center">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary btn-lg rounded-pill px-5 py-3 hover-lift"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Submitting Application...
                        </>
                      ) : (
                        'Submit Application'
                      )}
                    </button>
                    <p className="text-muted small mt-3 mb-0">
                      <span className="text-danger">*</span> Required fields
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for Glassmorphism and effects */}
      <style jsx="true">{`
        .bg-gradient-to-r {
          background: linear-gradient(135deg, #f5f7ff 0%, #f0f3ff 100%);
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
        }

        .glass-input {
          background: rgba(255, 255, 255, 0.8) !important;
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
          border-radius: 10px !important;
          padding: 0.75rem 1rem !important;
          transition: all 0.3s ease;
        }

        .glass-input:focus {
          background: white !important;
          border-color: #0d6efd !important;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.1) !important;
          transform: translateY(-2px);
        }

        .glass-input.is-invalid {
          border-color: #dc3545 !important;
        }

        .glass-upload {
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          border: 2px dashed rgba(13, 110, 253, 0.3);
          border-radius: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .glass-upload:hover {
          background: rgba(255, 255, 255, 0.8);
          border-color: #0d6efd;
          transform: translateY(-2px);
        }

        .glass-upload.border-danger {
          border-color: #dc3545 !important;
        }

        .glass-consent {
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .bg-primary-soft {
          background: rgba(13, 110, 253, 0.1);
        }
        
        .bg-success-soft {
          background: rgba(25, 135, 84, 0.1);
        }
        
        .bg-info-soft {
          background: rgba(13, 202, 240, 0.1);
        }
        
        .bg-warning-soft {
          background: rgba(255, 193, 7, 0.1);
        }
        
        .bg-purple-soft {
          background: rgba(111, 66, 193, 0.1);
        }

        .bg-danger-soft {
          background: rgba(220, 53, 69, 0.1);
        }

        .text-purple {
          color: #6f42c1 !important;
        }

        .cursor-pointer {
          cursor: pointer;
        }

        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hover-lift:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
        }

        .input-group-text {
          background: rgba(255, 255, 255, 0.8) !important;
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
          border-right: none !important;
        }

        .form-check-input {
          border-radius: 0.25em !important;
          border: 1px solid rgba(0, 0, 0, 0.25) !important;
        }

        .form-check-input:checked {
          background-color: #0d6efd !important;
          border-color: #0d6efd !important;
        }

        .badge {
          font-weight: 500 !important;
        }

        /* Smooth scrolling */
        * {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default ApplicationForm;// // pages/careers/JobApplicationPage.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import useCareerStore from '../../stores/shared/careerStore';
// import { 
//   Briefcase, 
//   MapPin, 
//   Calendar,
//   Upload,
//   CheckCircle,
//   AlertCircle,
//   ArrowLeft,
//   DollarSign,
//   Building,
//   Linkedin,
//   Github,
//   Globe,
//   FileText
// } from 'lucide-react';

// const ApplicationForm = () => {
//   const { idOrSlug } = useParams();
//   const navigate = useNavigate();
//   const { 
//     currentJob, 
//     loading, 
//     error,
//     fetchJob,
//     applyForJob,
//     clearCurrentJob
//   } = useCareerStore();

//   const [formData, setFormData] = useState({
//     applicantName: '',
//     email: '',
//     phone: '',
//     currentCompany: '',
//     currentTitle: '',
//     yearsOfExperience: '',
//     noticePeriod: '',
//     salaryExpectation: '',
//     coverLetter: '',
//     portfolioUrl: '',
//     linkedinUrl: '',
//     githubUrl: '',
//     consentDataProcessing: false,
//     consentPrivacyPolicy: false,
//     source: 'CAREER_PAGE',
//     CareerJobId: ''
//   });

//   const [resumeFile, setResumeFile] = useState(null);
//   const [resumeFileName, setResumeFileName] = useState('');
//   const [formErrors, setFormErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitSuccess, setSubmitSuccess] = useState(false);
//   const [submitError, setSubmitError] = useState('');

//   useEffect(() => {
//     if (idOrSlug) {
//       fetchJob(idOrSlug);
//     }

//     return () => {
//       clearCurrentJob();
//     };
//   }, [idOrSlug]);

//   useEffect(() => {
//     if (currentJob) {
//       setFormData(prev => ({
//         ...prev,
//         CareerJobId: currentJob.id
//       }));
//     }
//   }, [currentJob]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
    
//     // Clear error for this field
//     if (formErrors[name]) {
//       setFormErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Validate file type
//       const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
//       if (!validTypes.includes(file.type)) {
//         setFormErrors(prev => ({ 
//           ...prev, 
//           resume: 'Please upload a PDF or Word document' 
//         }));
//         return;
//       }
      
//       // Validate file size (5MB max)
//       if (file.size > 5 * 1024 * 1024) {
//         setFormErrors(prev => ({ 
//           ...prev, 
//           resume: 'File size must be less than 5MB' 
//         }));
//         return;
//       }
      
//       setResumeFile(file);
//       setResumeFileName(file.name);
//       setFormErrors(prev => ({ ...prev, resume: '' }));
//     }
//   };

//   const validateForm = () => {
//     const errors = {};

//     // Required fields
//     if (!formData.applicantName.trim()) {
//       errors.applicantName = 'Full name is required';
//     }

//     if (!formData.email.trim()) {
//       errors.email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       errors.email = 'Invalid email address';
//     }

//     if (!formData.phone.trim()) {
//       errors.phone = 'Phone number is required';
//     }

//     if (!resumeFile) {
//       errors.resume = 'Resume is required';
//     }

//     if (!formData.consentDataProcessing) {
//       errors.consentDataProcessing = 'You must consent to data processing';
//     }

//     if (!formData.consentPrivacyPolicy) {
//       errors.consentPrivacyPolicy = 'You must accept the privacy policy';
//     }

//     // Optional fields validation
//     if (formData.yearsOfExperience && (formData.yearsOfExperience < 0 || formData.yearsOfExperience > 50)) {
//       errors.yearsOfExperience = 'Please enter a valid number of years';
//     }

//     if (formData.noticePeriod && formData.noticePeriod < 0) {
//       errors.noticePeriod = 'Please enter a valid notice period';
//     }

//     if (formData.salaryExpectation && formData.salaryExpectation < 0) {
//       errors.salaryExpectation = 'Please enter a valid salary expectation';
//     }

//     if (formData.portfolioUrl && !isValidUrl(formData.portfolioUrl)) {
//       errors.portfolioUrl = 'Please enter a valid URL';
//     }

//     if (formData.linkedinUrl && !isValidUrl(formData.linkedinUrl)) {
//       errors.linkedinUrl = 'Please enter a valid URL';
//     }

//     if (formData.githubUrl && !isValidUrl(formData.githubUrl)) {
//       errors.githubUrl = 'Please enter a valid URL';
//     }

//     return errors;
//   };

//   const isValidUrl = (url) => {
//     try {
//       new URL(url);
//       return true;
//     } catch {
//       return false;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const errors = validateForm();
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//       return;
//     }

//     setIsSubmitting(true);
//     setSubmitError('');

//     try {
//       const result = await applyForJob(formData, resumeFile);
      
//       if (result.success) {
//         setSubmitSuccess(true);
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//       } else {
//         setSubmitError(result.error || 'Failed to submit application');
//       }
//     } catch (error) {
//       setSubmitError(error.message || 'An unexpected error occurred');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const formatEmploymentType = (type) => {
//     const types = {
//       'FULL_TIME': 'Full Time',
//       'PART_TIME': 'Part Time',
//       'CONTRACT': 'Contract',
//       'INTERNSHIP': 'Internship',
//       'REMOTE': 'Remote',
//       'HYBRID': 'Hybrid'
//     };
//     return types[type] || type;
//   };

//   const formatExperienceLevel = (level) => {
//     const levels = {
//       'ENTRY': 'Entry Level',
//       'JUNIOR': 'Junior',
//       'MID': 'Mid Level',
//       'SENIOR': 'Senior',
//       'LEAD': 'Lead',
//       'MANAGER': 'Manager',
//       'DIRECTOR': 'Director'
//     };
//     return levels[level] || level;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (error || !currentJob) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
//           <p className="text-gray-600 mb-6">{error || 'The job you\'re looking for doesn\'t exist or is no longer available.'}</p>
//           <Link
//             to="/careers"
//             className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             <ArrowLeft className="w-5 h-5 mr-2" />
//             Back to Jobs
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   if (submitSuccess) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
//         <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
//           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//             <CheckCircle className="w-10 h-10 text-green-600" />
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
//           <p className="text-gray-600 mb-6">
//             Thank you for applying to {currentJob.title} position. We'll review your application and get back to you soon.
//           </p>
//           <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
//             <p className="text-sm text-blue-800">
//               <strong>Next steps:</strong> You'll receive a confirmation email at {formData.email}. 
//               Our team will review your application and contact you if your qualifications match our requirements.
//             </p>
//           </div>
//           <div className="flex flex-col sm:flex-row gap-3 justify-center">
//             <Link
//               to="/careers"
//               className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               Browse More Jobs
//             </Link>
//             <Link
//               to="/"
//               className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
//             >
//               Go to Home
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Back Button */}
//         <Link
//           to={`/careers/${currentJob.slug || currentJob.id}`}
//           className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
//         >
//           <ArrowLeft className="w-5 h-5 mr-2" />
//           Back to Job Details
//         </Link>

//         {/* Job Summary */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//           <h1 className="text-2xl font-bold text-gray-900 mb-2">{currentJob.title}</h1>
//           <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
//             <span className="flex items-center">
//               <Briefcase className="w-4 h-4 mr-1" />
//               {currentJob.department}
//             </span>
//             <span className="flex items-center">
//               <MapPin className="w-4 h-4 mr-1" />
//               {currentJob.location} {currentJob.isRemote && '(Remote)'}
//             </span>
//             {currentJob.salaryRangeMin && currentJob.salaryRangeMax && (
//               <span className="flex items-center text-green-600">
//                 <DollarSign className="w-4 h-4 mr-1" />
//                 {currentJob.salaryCurrency} {currentJob.salaryRangeMin.toLocaleString()} - {currentJob.salaryRangeMax.toLocaleString()}
//               </span>
//             )}
//           </div>
//           <div className="flex flex-wrap gap-2">
//             <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
//               {formatEmploymentType(currentJob.employmentType)}
//             </span>
//             <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
//               {formatExperienceLevel(currentJob.experienceLevel)}
//             </span>
//             {currentJob.numberOfOpenings > 1 && (
//               <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
//                 {currentJob.numberOfOpenings} openings
//               </span>
//             )}
//           </div>
//         </div>

//         {/* Application Form */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-xl font-bold text-gray-900 mb-6">Application Form</h2>

//           {submitError && (
//             <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//               {submitError}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Personal Information */}
//             <div>
//               <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Full Name *
//                   </label>
//                   <input
//                     type="text"
//                     name="applicantName"
//                     value={formData.applicantName}
//                     onChange={handleChange}
//                     className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
//                       formErrors.applicantName ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                   />
//                   {formErrors.applicantName && (
//                     <p className="mt-1 text-sm text-red-600">{formErrors.applicantName}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Email Address *
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
//                       formErrors.email ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                   />
//                   {formErrors.email && (
//                     <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Phone Number *
//                   </label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
//                       formErrors.phone ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                   />
//                   {formErrors.phone && (
//                     <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Professional Information */}
//             <div className="pt-4 border-t">
//               <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Current Company
//                   </label>
//                   <input
//                     type="text"
//                     name="currentCompany"
//                     value={formData.currentCompany}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Current Title
//                   </label>
//                   <input
//                     type="text"
//                     name="currentTitle"
//                     value={formData.currentTitle}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Years of Experience
//                   </label>
//                   <input
//                     type="number"
//                     name="yearsOfExperience"
//                     value={formData.yearsOfExperience}
//                     onChange={handleChange}
//                     min="0"
//                     max="50"
//                     className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
//                       formErrors.yearsOfExperience ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                   />
//                   {formErrors.yearsOfExperience && (
//                     <p className="mt-1 text-sm text-red-600">{formErrors.yearsOfExperience}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Notice Period (days)
//                   </label>
//                   <input
//                     type="number"
//                     name="noticePeriod"
//                     value={formData.noticePeriod}
//                     onChange={handleChange}
//                     min="0"
//                     className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
//                       formErrors.noticePeriod ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                   />
//                   {formErrors.noticePeriod && (
//                     <p className="mt-1 text-sm text-red-600">{formErrors.noticePeriod}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Salary Expectation (UGX)
//                   </label>
//                   <input
//                     type="number"
//                     name="salaryExpectation"
//                     value={formData.salaryExpectation}
//                     onChange={handleChange}
//                     min="0"
//                     className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
//                       formErrors.salaryExpectation ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                   />
//                   {formErrors.salaryExpectation && (
//                     <p className="mt-1 text-sm text-red-600">{formErrors.salaryExpectation}</p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Resume Upload */}
//             <div className="pt-4 border-t">
//               <h3 className="text-lg font-medium text-gray-900 mb-4">Resume/CV</h3>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Upload Resume *
//                 </label>
//                 <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
//                   formErrors.resume ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400'
//                 }`}>
//                   <input
//                     type="file"
//                     id="resume"
//                     accept=".pdf,.doc,.docx"
//                     onChange={handleFileChange}
//                     className="hidden"
//                   />
//                   <label htmlFor="resume" className="cursor-pointer">
//                     <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
//                     <p className="text-gray-600 mb-1">
//                       {resumeFileName || 'Click to upload or drag and drop'}
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       PDF, DOC, DOCX (Max 5MB)
//                     </p>
//                   </label>
//                 </div>
//                 {formErrors.resume && (
//                   <p className="mt-1 text-sm text-red-600">{formErrors.resume}</p>
//                 )}
//                 {resumeFileName && (
//                   <p className="mt-2 text-sm text-green-600 flex items-center">
//                     <CheckCircle className="w-4 h-4 mr-1" />
//                     {resumeFileName} uploaded
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Cover Letter */}
//             <div className="pt-4 border-t">
//               <h3 className="text-lg font-medium text-gray-900 mb-4">Cover Letter</h3>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Why are you interested in this position?
//                 </label>
//                 <textarea
//                   name="coverLetter"
//                   value={formData.coverLetter}
//                   onChange={handleChange}
//                   rows="6"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   placeholder="Tell us about your relevant experience and why you'd be a great fit..."
//                 />
//               </div>
//             </div>

//             {/* Online Profiles */}
//             <div className="pt-4 border-t">
//               <h3 className="text-lg font-medium text-gray-900 mb-4">Online Profiles</h3>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1 items-center">
//                     <Globe className="w-4 h-4 mr-2 text-gray-500" />
//                     Portfolio Website
//                   </label>
//                   <input
//                     type="url"
//                     name="portfolioUrl"
//                     value={formData.portfolioUrl}
//                     onChange={handleChange}
//                     className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
//                       formErrors.portfolioUrl ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                     placeholder="https://..."
//                   />
//                   {formErrors.portfolioUrl && (
//                     <p className="mt-1 text-sm text-red-600">{formErrors.portfolioUrl}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1 items-center">
//                     <Linkedin className="w-4 h-4 mr-2 text-blue-600" />
//                     LinkedIn Profile
//                   </label>
//                   <input
//                     type="url"
//                     name="linkedinUrl"
//                     value={formData.linkedinUrl}
//                     onChange={handleChange}
//                     className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
//                       formErrors.linkedinUrl ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                     placeholder="https://linkedin.com/in/..."
//                   />
//                   {formErrors.linkedinUrl && (
//                     <p className="mt-1 text-sm text-red-600">{formErrors.linkedinUrl}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1 items-center">
//                     <Github className="w-4 h-4 mr-2 text-gray-800" />
//                     GitHub Profile
//                   </label>
//                   <input
//                     type="url"
//                     name="githubUrl"
//                     value={formData.githubUrl}
//                     onChange={handleChange}
//                     className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
//                       formErrors.githubUrl ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                     placeholder="https://github.com/..."
//                   />
//                   {formErrors.githubUrl && (
//                     <p className="mt-1 text-sm text-red-600">{formErrors.githubUrl}</p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Consents */}
//             <div className="pt-4 border-t">
//               <div className="space-y-4">
//                 <div className="flex items-start">
//                   <div className="flex items-center h-5">
//                     <input
//                       type="checkbox"
//                       name="consentDataProcessing"
//                       checked={formData.consentDataProcessing}
//                       onChange={handleChange}
//                       className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                     />
//                   </div>
//                   <div className="ml-3">
//                     <label className="text-sm text-gray-700">
//                       I consent to the processing of my personal data for recruitment purposes. *
//                     </label>
//                     {formErrors.consentDataProcessing && (
//                       <p className="mt-1 text-sm text-red-600">{formErrors.consentDataProcessing}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex items-start">
//                   <div className="flex items-center h-5">
//                     <input
//                       type="checkbox"
//                       name="consentPrivacyPolicy"
//                       checked={formData.consentPrivacyPolicy}
//                       onChange={handleChange}
//                       className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                     />
//                   </div>
//                   <div className="ml-3">
//                     <label className="text-sm text-gray-700">
//                       I have read and agree to the Privacy Policy and Terms of Use. *
//                     </label>
//                     {formErrors.consentPrivacyPolicy && (
//                       <p className="mt-1 text-sm text-red-600">{formErrors.consentPrivacyPolicy}</p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="pt-4">
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
//               >
//                 {isSubmitting ? (
//                   <>
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                     Submitting Application...
//                   </>
//                 ) : (
//                   'Submit Application'
//                 )}
//               </button>
//               <p className="text-xs text-gray-500 text-center mt-3">
//                 * Required fields
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ApplicationForm;






// // // src/components/career/ApplicationForm.jsx
// // import React, { useState } from 'react';
// // import useCareerStore from '../../stores/shared/careerStore';

// // const ApplicationForm = ({ jobId, jobTitle, onSuccess }) => {
// //   const { applyForJob, loading, error } = useCareerStore();
// //   const [formData, setFormData] = useState({
// //     applicantName: '',
// //     email: '',
// //     phone: '',
// //     coverLetter: '',
// //     consentDataProcessing: false,
// //     consentPrivacyPolicy: false,
// //     CareerJobId: jobId
// //   });
// //   const [resumeFile, setResumeFile] = useState(null);
// //   const [resumeFileName, setResumeFileName] = useState('');

// //   const handleChange = (e) => {
// //     const { name, value, type, checked } = e.target;
// //     setFormData({
// //       ...formData,
// //       [name]: type === 'checkbox' ? checked : value
// //     });
// //   };

// //   const handleFileChange = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       if (file.size > 5 * 1024 * 1024) { // 5MB limit
// //         alert('File size must be less than 5MB');
// //         return;
// //       }
// //       setResumeFile(file);
// //       setResumeFileName(file.name);
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
    
// //     if (!resumeFile) {
// //       alert('Please upload your resume');
// //       return;
// //     }

// //     if (!formData.consentDataProcessing || !formData.consentPrivacyPolicy) {
// //       alert('You must accept both consent statements');
// //       return;
// //     }

// //     const result = await applyForJob(formData, resumeFile);
    
// //     if (result.success) {
// //       alert('Application submitted successfully!');
// //       onSuccess();
// //     }
// //   };

// //   return (
// //     <div className='container'>
// //       <div className="alert alert-info mb-4">
// //         <h6 className="alert-heading">Applying for: {jobTitle}</h6>
// //         <p className="mb-0 small">Please fill in all required fields (*)</p>
// //       </div>

// //       {error && (
// //         <div className="alert alert-danger mb-4">
// //           {error}
// //         </div>
// //       )}

// //       <form onSubmit={handleSubmit}>
// //         <div className="row">
// //           <div className="col-md-6 mb-3">
// //             <label className="form-label">
// //               Full Name *
// //             </label>
// //             <input
// //               type="text"
// //               className="form-control"
// //               name="applicantName"
// //               value={formData.applicantName}
// //               onChange={handleChange}
// //               required
// //             />
// //           </div>

// //           <div className="col-md-6 mb-3">
// //             <label className="form-label">
// //               Email Address *
// //             </label>
// //             <input
// //               type="email"
// //               className="form-control"
// //               name="email"
// //               value={formData.email}
// //               onChange={handleChange}
// //               required
// //             />
// //           </div>

// //           <div className="col-md-6 mb-3">
// //             <label className="form-label">
// //               Phone Number
// //             </label>
// //             <input
// //               type="tel"
// //               className="form-control"
// //               name="phone"
// //               value={formData.phone}
// //               onChange={handleChange}
// //             />
// //           </div>

// //           <div className="col-md-6 mb-4">
// //             <label className="form-label">
// //               Resume/CV *
// //             </label>
// //             <div className="input-group">
// //               <input
// //                 type="file"
// //                 className="form-control"
// //                 accept=".pdf,.doc,.docx"
// //                 onChange={handleFileChange}
// //                 required
// //               />
// //             </div>
// //             <small className="text-muted">Accepted formats: PDF, DOC, DOCX (Max 5MB)</small>
// //             {resumeFileName && (
// //               <div className="mt-2">
// //                 <span className="badge bg-info">
// //                   <i className="bi bi-file-earmark me-1"></i>
// //                   {resumeFileName}
// //                 </span>
// //               </div>
// //             )}
// //           </div>

// //           <div className="col-12 mb-4">
// //             <label className="form-label">
// //               Cover Letter
// //             </label>
// //             <textarea
// //               className="form-control"
// //               name="coverLetter"
// //               value={formData.coverLetter}
// //               onChange={handleChange}
// //               rows="4"
// //               placeholder="Tell us why you're the right candidate for this position..."
// //             />
// //           </div>

// //           <div className="col-12 mb-4">
// //             <div className="form-check mb-2">
// //               <input
// //                 className="form-check-input"
// //                 type="checkbox"
// //                 name="consentDataProcessing"
// //                 checked={formData.consentDataProcessing}
// //                 onChange={handleChange}
// //                 id="consent1"
// //                 required
// //               />
// //               <label className="form-check-label small" htmlFor="consent1">
// //                 I consent to the processing of my personal data for recruitment purposes as described in the privacy policy. *
// //               </label>
// //             </div>
            
// //             <div className="form-check">
// //               <input
// //                 className="form-check-input"
// //                 type="checkbox"
// //                 name="consentPrivacyPolicy"
// //                 checked={formData.consentPrivacyPolicy}
// //                 onChange={handleChange}
// //                 id="consent2"
// //                 required
// //               />
// //               <label className="form-check-label small" htmlFor="consent2">
// //                 I have read and agree to the terms of the privacy policy. *
// //               </label>
// //             </div>
// //           </div>

// //           <div className="col-12">
// //             <div className="d-flex justify-content-end gap-3">
// //               <button
// //                 type="button"
// //                 className="btn btn-outline-secondary"
// //                 onClick={onSuccess}
// //               >
// //                 Cancel
// //               </button>
// //               <button
// //                 type="submit"
// //                 className="btn btn-primary"
// //                 disabled={loading}
// //               >
// //                 {loading ? (
// //                   <>
// //                     <span className="spinner-border spinner-border-sm me-2" role="status"></span>
// //                     Submitting...
// //                   </>
// //                 ) : (
// //                   'Submit Application'
// //                 )}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </form>
// //     </div>
// //   );
// // };

// // export default ApplicationForm;
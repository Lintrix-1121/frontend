// src/pages/admin/career/EditJobPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CareerEntryForm from '../../views/admin/CareerEntryForm';
import useCareerStore from '../../stores/shared/careerStore';

const EditJobPage = () => {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const { fetchJob, currentJob, loading, error, clearCurrentJob } = useCareerStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadJob = async () => {
      if (idOrSlug) {
        console.log('📋 [EDIT PAGE] Fetching job with identifier:', idOrSlug);
        setIsLoading(true);
        await fetchJob(idOrSlug);
        setIsLoading(false);
      }
    };

    loadJob();

    // Cleanup
    return () => {
      clearCurrentJob();
    };
  }, [idOrSlug, fetchJob, clearCurrentJob]);

  const handleSuccess = (updatedJob) => {
    console.log('✅ [EDIT PAGE] Job updated successfully:', updatedJob);
    navigate('/admin/careers');
  };

  const handleCancel = () => {
    navigate('/admin/careers');
  };

  if (isLoading || loading) {
    return (
      <div className="container-fluid py-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentJob) {
    return (
      <div className="container-fluid py-5">
        <div className="alert alert-danger text-center" role="alert" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
          <h4 className="alert-heading">Job Not Found</h4>
          <p>{error || 'The job you\'re trying to edit could not be found.'}</p>
          <hr />
          <button 
            className="btn btn-outline-danger"
            onClick={() => navigate('/admin/careers')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col">
          <h2 className="mb-0">Edit Job Posting</h2>
          <p className="text-muted">Update the job details below</p>
        </div>
      </div>
      
      <CareerEntryForm 
        editJob={currentJob} 
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default EditJobPage;
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import useServiceStore from '../../stores/shared/useServiceStore';
import toast from 'react-hot-toast';

const ServiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const {
    currentService,
    loading,
    error,
    createService,
    updateService,
    fetchService,
    clearCurrentService
  } = useServiceStore();

  const [formData, setFormData] = useState({
    title: '',
    subTitle: '',
    description: '',
    icon: '',
    order: 0,
    isActive: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Debug logging
  console.log('ServiceForm Render State:', {
    id,
    isEditMode,
    currentService,
    formData,
    formTitle: formData.title,
    loading,
    error,
    isInitialized
  });

  useEffect(() => {
    console.log('Fetching service with ID:', id, 'Parsed:', parseInt(id));
    
    if (isEditMode) {
      fetchService(parseInt(id));
    } else {
      // For new service, mark as initialized immediately
      setIsInitialized(true);
    }
    
    return () => {
      clearCurrentService();
    };
  }, [id, isEditMode]);

  useEffect(() => {
    console.log('Current Service Effect:', {
      isEditMode,
      currentService,
      hasCurrentService: !!currentService,
      currentServiceKeys: currentService ? Object.keys(currentService) : []
    });
    
    if (isEditMode && currentService && Object.keys(currentService).length > 0) {
      console.log('Setting form data from currentService:', currentService);
      
      setFormData({
        title: currentService.title || '',
        subTitle: currentService.subTitle || '',
        description: currentService.description || '',
        icon: currentService.icon || '',
        order: currentService.order || 0,
        isActive: currentService.isActive ?? true,
      });
      
      if (currentService.imageUrl) {
        setImagePreview(currentService.imageUrl);
      }
      
      setIsInitialized(true);
    }
  }, [currentService, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    console.log(`Input changed: ${name} = ${newValue}`);
    
    setFormData({
      ...formData,
      [name]: newValue,
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Image file selected:', file.name, file.type, file.size);
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    console.log('Removing image');
    setImageFile(null);
    setImagePreview('');
  };

  const validateForm = () => {
    console.log('Validating form with data:', formData);
    console.log('Title value:', formData.title, 'Trimmed:', formData.title.trim());
    console.log('Title length:', formData.title.length);
    
    const newErrors = {};
    
    // Check if title is empty or only whitespace
    const trimmedTitle = formData.title.trim();
    if (!trimmedTitle) {
      console.log('Title validation failed - empty after trim');
      newErrors.title = 'Title is required';
    } else if (trimmedTitle.length < 3) {
      console.log('Title validation failed - too short');
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    if (formData.order < 0) {
      newErrors.order = 'Order cannot be negative';
    }
    
    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };




  const handleSubmit = async (e) => {
  e.preventDefault();
  
  console.log('Form submitted with data:', formData);
  
  if (!validateForm()) {
    toast.error('Please fix the errors in the form');
    return;
  }
  
  setIsSubmitting(true);
  
  try {
    //Use a different variable name
    const data = new FormData();
    
    // Append all form data using the state variable
    data.append('title', formData.title.trim()); //formData is the state variable
    console.log(' Appended title:', formData.title.trim());
    
    if (formData.subTitle) {
      data.append('subTitle', formData.subTitle.trim());
      console.log(' Appended subTitle:', formData.subTitle.trim());
    }
    
    if (formData.description) {
      data.append('description', formData.description.trim());
      console.log(' Appended description:', formData.description.trim());
    }
    
    if (formData.icon) {
      data.append('icon', formData.icon.trim());
      console.log(' Appended icon:', formData.icon.trim());
    }
    
    data.append('order', formData.order.toString());
    console.log(' Appended order:', formData.order.toString());
    
    data.append('isActive', formData.isActive.toString());
    console.log(' Appended isActive:', formData.isActive.toString());
    
    if (imageFile) {
      console.log(' Appending image file:', imageFile.name);
      data.append('image', imageFile);
    } else {
      console.log(' No image file to append');
    }
    
    // Debug: Log what's actually in FormData
    console.log(' Final FormData contents:');
    let hasEntries = false;
    for (let [key, value] of data.entries()) {
      hasEntries = true;
      console.log(`  ${key}:`, value instanceof File ? `File: ${value.name}` : value);
    }
    
    if (!hasEntries) {
      console.error(' FormData is empty!');
      toast.error('Form data is incomplete');
      setIsSubmitting(false);
      return;
    }
    
    let result;
    
    if (isEditMode) {
      console.log(' Updating service ID:', id);
      const serviceId = parseInt(id);
      result = await updateService(serviceId, data); // Pass the FormData object
    } else {
      console.log(' Creating new service');
      result = await createService(data); // Pass the FormData object
    }
    
    console.log(' Result:', result);
    
    if (result.success) {
      const message = isEditMode ? 'Service updated successfully' : 'Service created successfully';
      toast.success(message);
      resetForm();
      navigate('/admin/services');
    } else {
      toast.error(result.error || 'Operation failed');
    }
  } catch (error) {
    console.error(' Unexpected error:', error);
    toast.error('An unexpected error occurred');
  } finally {
    setIsSubmitting(false);
  }
};

  const resetForm = () => {
    setFormData({
      title: '',
      subTitle: '',
      description: '',
      icon: '',
      order: 0,
      isActive: true,
    });
    setImageFile(null);
    setImagePreview('');
    setErrors({});
  };

  const handleCancel = () => {
    console.log('Canceling form');
    resetForm();
    navigate('/admin/services');
  };

  // Loading state for edit mode
  if (isEditMode && loading && !isInitialized) {
    console.log('Showing loading state');
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading service details...</p>
      </div>
    );
  }

  // Show error state if fetch failed
  if (isEditMode && error && !currentService) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <h5 className="alert-heading">Error Loading Service</h5>
          <p>{error}</p>
          <Link to="/admin/services" className="btn btn-outline-danger">
            <i className="bi bi-arrow-left me-2"></i>
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex align-items-center mb-3">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-outline-secondary me-3"
              disabled={isSubmitting}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Services
            </button>
            <h1 className="h2 mb-0">
              {isEditMode ? 'Edit Service' : 'Create New Service'}
            </h1>
            {isEditMode && currentService && (
              <span className="badge bg-info ms-3">
                ID: {currentService.serviceId}
              </span>
            )}
          </div>
          <p className="text-muted">
            {isEditMode 
              ? 'Update your service details below'
              : 'Fill in the details to create a new service'
            }
          </p>
          {!isInitialized && isEditMode && (
            <div className="alert alert-info alert-dismissible fade show mt-3" role="alert">
              <i className="bi bi-info-circle me-2"></i>
              Loading service data...
            </div>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-body">
              {error && (
                <div className="alert alert-danger mb-4">
                  <h5 className="alert-heading">Error</h5>
                  <p className="mb-0">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <div className="mb-4">
                  <h5 className="mb-3">Basic Information</h5>
                  
                  <div className="mb-3">
                    <label className="form-label">
                      Title <span className="text-danger">*</span>
                      {errors.title && (
                        <span className="text-danger ms-2">
                          <i className="bi bi-exclamation-triangle me-1"></i>
                          {errors.title}
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter service title"
                      disabled={isSubmitting || (isEditMode && !isInitialized)}
                      required
                    />
                    {!errors.title && (
                      <div className="form-text">
                        Required. At least 3 characters.
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Subtitle</label>
                    <input
                      type="text"
                      className="form-control"
                      name="subTitle"
                      value={formData.subTitle}
                      onChange={handleInputChange}
                      placeholder="Enter service subtitle"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter service description"
                      disabled={isSubmitting}
                    ></textarea>
                  </div>
                </div>

                {/* Icon and Order */}
                <div className="mb-4">
                  <h5 className="mb-3">Display Settings</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Icon Class</label>
                        <input
                          type="text"
                          className="form-control"
                          name="icon"
                          value={formData.icon}
                          onChange={handleInputChange}
                          placeholder="e.g., bi bi-code, fas fa-cogs"
                          disabled={isSubmitting}
                        />
                        <div className="form-text">
                          Use Bootstrap Icons (bi), Font Awesome (fas), or Material Icons class names
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Display Order</label>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          className={`form-control ${errors.order ? 'is-invalid' : ''}`}
                          name="order"
                          value={formData.order}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                        />
                        {errors.order && (
                          <div className="invalid-feedback">
                            {errors.order}
                          </div>
                        )}
                        <div className="form-text">
                          Lower numbers appear first
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="mb-4">
                  <h5 className="mb-3">Service Image</h5>
                  <div className="mb-3">
                    <label className="form-label">Upload Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isSubmitting}
                    />
                    <div className="form-text">
                      Recommended: 800x600px, JPG, PNG, or WebP format
                    </div>
                  </div>

                  {imagePreview && (
                    <div className="mt-3">
                      <p className="mb-2">Image Preview:</p>
                      <div className="position-relative" style={{ maxWidth: '300px' }}>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="img-fluid rounded border"
                          style={{ maxHeight: '200px' }}
                        />
                        <button
                          type="button"
                          className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                          onClick={removeImage}
                          disabled={isSubmitting}
                        >
                          <i className="bi bi-x"></i>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="mb-4">
                  <h5 className="mb-3">Status</h5>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                    <label className="form-check-label" htmlFor="isActive">
                      Active Service
                    </label>
                  </div>
                  <div className="form-text">
                    Inactive services won't be visible to customers
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCancel}
                    disabled={isSubmitting || (isEditMode && !isInitialized)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting || (isEditMode && !isInitialized)}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {isEditMode ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <i className="bi bi-save me-2"></i>
                        {isEditMode ? 'Update Service' : 'Create Service'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-header">
              <h6 className="mb-0">Tips</h6>
            </div>
            <div className="card-body">
              <ul className="mb-0 ps-3">
                <li>Keep titles clear and descriptive</li>
                <li>Use subtitles to highlight key benefits</li>
                <li>Add detailed descriptions for better SEO</li>
                <li>Choose relevant icons for visual appeal</li>
                <li>Set appropriate order for display priority</li>
              </ul>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Quick Stats</h6>
            </div>
            <div className="card-body">
              {isEditMode && currentService ? (
                <div>
                  <p>
                    <strong>Created:</strong>{' '}
                    {new Date(currentService.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Last Updated:</strong>{' '}
                    {new Date(currentService.updatedAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Related Services:</strong>{' '}
                    {currentService.relatedServices?.length || 0}
                  </p>
                </div>
              ) : (
                <p className="text-muted mb-0">
                  Service statistics will appear here after creation
                </p>
              )}
            </div>
          </div>
          
          {/* Debug Panel (remove in production) */}
          <div className="card mt-4 border-info">
            <div className="card-header bg-info text-white">
              <h6 className="mb-0">Debug Info</h6>
            </div>
            <div className="card-body">
              <small className="text-muted">
                <div><strong>Mode:</strong> {isEditMode ? 'Edit' : 'Create'}</div>
                <div><strong>Service ID:</strong> {id || 'N/A'}</div>
                <div><strong>Initialized:</strong> {isInitialized ? 'Yes' : 'No'}</div>
                <div><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</div>
                <div><strong>Title Length:</strong> {formData.title.length}</div>
                <div><strong>Title Trimmed:</strong> "{formData.title.trim()}"</div>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceForm;




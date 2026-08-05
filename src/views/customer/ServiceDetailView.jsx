import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import useServiceStore from '../../stores/shared/useServiceStore';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/admin/LoadingSpinner';

const ServiceDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  
  // Check if this is an admin view
  const isAdminView = pathname.includes('/admin/');
  
  const {
    currentService,
    loading,
    error,
    services,
    fetchService,
    deleteService,
    addRelatedService,
    removeRelatedService,
    clearCurrentService
  } = useServiceStore();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [relationType, setRelationType] = useState('similar');

  useEffect(() => {
    if (id) {
      fetchService(parseInt(id));
    }
    
    return () => {
      clearCurrentService();
    };
  }, [id]);

  const handleDelete = async () => {
    const result = await deleteService(parseInt(id));
    if (result.success) {
      toast.success('Service deleted successfully');
      navigate(isAdminView ? '/admin/services' : '/services');
    } else {
      toast.error(result.error || 'Failed to delete service');
    }
    setShowDeleteModal(false);
  };

  const handleAddRelatedService = async () => {
    if (!selectedServiceId) {
      toast.error('Please select a service');
      return;
    }

    const result = await addRelatedService(
      parseInt(id),
      parseInt(selectedServiceId),
      relationType
    );

    if (result.success) {
      toast.success('Service linked successfully');
      setShowLinkModal(false);
      setSelectedServiceId('');
      setRelationType('similar');
    } else {
      toast.error(result.error || 'Failed to link service');
    }
  };

  const handleRemoveRelatedService = async (relatedServiceId) => {
    if (window.confirm('Are you sure you want to remove this related service?')) {
      const result = await removeRelatedService(parseInt(id), relatedServiceId);
      if (result.success) {
        toast.success('Service unlinked successfully');
      } else {
        toast.error(result.error || 'Failed to unlink service');
      }
    }
  };

  // Get services that are not already related
  const availableServices = services.filter(service => 
    service.serviceId !== parseInt(id) &&
    !currentService?.relatedServices?.some(rs => rs.serviceId === service.serviceId)
  );

  // Helper to build full image URL for customer view
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;

    const backendUrl = 'https://api.logiphix.tech';
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${backendUrl}/${cleanPath}`;
  };

  // Use appropriate image URL based on view
  const displayImageUrl = isAdminView 
    ? currentService?.imageUrl 
    : getImageUrl(currentService?.imageUrl);

  const backUrl = isAdminView ? '/admin/services' : '/services';
  const editUrl = isAdminView ? `/admin/services/edit/${id}` : '#';

  if (loading && !currentService) 
    return <LoadingSpinner />;
    
  if (!currentService && !loading) {
    return (
      <div className="container py-5 text-center" style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: '100vh'
      }}>
        <div className="p-4" style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '0'
        }}>
          <h4 className="text-dark mb-3">Service Not Found</h4>
          <p className="mb-4 text-muted">The service you're looking for doesn't exist or has been removed.</p>
          <Link to={backUrl} className="btn" style={{
            background: 'rgba(255, 193, 7, 0.8)',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            borderRadius: '0',
            padding: '0.75rem 1.5rem',
            fontWeight: '500',
            textDecoration: 'none'
          }}>
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex align-items-center mb-3">
            <Link
              to={backUrl}
              className="btn me-3"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                color: 'rgba(0, 0, 0, 0.7)',
                borderRadius: '0',
                padding: '0.75rem 1.5rem',
                fontWeight: '500',
                textDecoration: 'none'
              }}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Services
            </Link>
            <h1 className="h2 mb-0 text-dark" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
              {currentService?.title}
            </h1>
            {isAdminView && (
              <span className="badge ms-3" style={{
                background: currentService?.isActive 
                  ? 'rgba(40, 167, 69, 0.8)' 
                  : 'rgba(108, 117, 125, 0.8)',
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '0',
                padding: '0.5rem 1rem',
                fontWeight: '500'
              }}>
                {currentService?.isActive ? 'Active' : 'Inactive'}
              </span>
            )}
          </div>
          {currentService?.subTitle && (
            <p className="lead" style={{ color: 'rgba(0, 0, 0, 0.7)' }}>
              {currentService.subTitle}
            </p>
          )}
        </div>
        
        {/* Admin Actions*/}
        {isAdminView && (
          <div className="col-auto">
            <div className="d-flex gap-2">
              <Link
                to={editUrl}
                className="btn"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(13, 110, 253, 0.3)',
                  color: 'rgba(13, 110, 253, 0.9)',
                  borderRadius: '0',
                  padding: '0.75rem 1.5rem',
                  fontWeight: '500',
                  textDecoration: 'none'
                }}
              >
                <i className="bi bi-pencil me-2"></i>
                Edit
              </Link>
              <button
                className="btn"
                onClick={() => setShowDeleteModal(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(220, 53, 69, 0.3)',
                  color: 'rgba(220, 53, 69, 0.9)',
                  borderRadius: '0',
                  padding: '0.75rem 1.5rem',
                  fontWeight: '500'
                }}
              >
                <i className="bi bi-trash me-2"></i>
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4" style={{
          background: 'rgba(220, 53, 69, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(220, 53, 69, 0.2)',
          borderRadius: '0'
        }}>
          <h4 className="text-dark mb-2">Error</h4>
          <p className="mb-0 text-dark">{error}</p>
        </div>
      )}

      <div className="row">
        {/* Main Content */}
        <div className="col-lg-8">
          <div className="row">
            {/* Image */}
            {displayImageUrl && (
              <div className="col-12 mb-4">
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '0',
                  overflow: 'hidden'
                }}>
                  <img
                    src={displayImageUrl}
                    alt={currentService.title}
                    className="w-100"
                    style={{ 
                      maxHeight: '400px', 
                      objectFit: 'cover',
                      borderRadius: '0'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Description */}
            <div className="col-12 mb-4">
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '0'
              }}>
                <div className="p-4 border-bottom" style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}>
                  <h5 className="mb-0 text-dark">Description</h5>
                </div>
                <div className="p-4">
                  {currentService?.description ? (
                    <div className="service-description text-dark" style={{ lineHeight: '1.6' }}>
                      {currentService.description.split('\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-3">{paragraph}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="mb-0" style={{ color: 'rgba(0, 0, 0, 0.5)' }}>
                      No description provided
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Related Services show in admin view */}
            {isAdminView && currentService?.relatedServices && (
              <div className="col-12">
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '0'
                }}>
                  <div className="p-4 border-bottom d-flex justify-content-between align-items-center" 
                       style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}>
                    <h5 className="mb-0 text-dark">Related Services</h5>
                    <button
                      className="btn btn-sm"
                      onClick={() => setShowLinkModal(true)}
                      style={{
                        background: 'rgba(13, 110, 253, 0.8)',
                        backdropFilter: 'blur(5px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        borderRadius: '0',
                        padding: '0.5rem 1rem',
                        fontWeight: '500'
                      }}
                    >
                      <i className="bi bi-link me-2"></i>
                      Link Service
                    </button>
                  </div>
                  <div className="p-4">
                    {currentService.relatedServices.length > 0 ? (
                      <div className="list-group" style={{ borderRadius: '0' }}>
                        {currentService.relatedServices.map((relatedService) => (
                          <div
                            key={relatedService.serviceId}
                            className="d-flex justify-content-between align-items-center p-3 mb-2"
                            style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(0, 0, 0, 0.1)',
                              borderRadius: '0'
                            }}
                          >
                            <div>
                              <strong className="text-dark">{relatedService.title}</strong>
                              {relatedService.subTitle && (
                                <div className="small" style={{ color: 'rgba(0, 0, 0, 0.5)' }}>
                                  {relatedService.subTitle}
                                </div>
                              )}
                            </div>
                            <div>
                              <Link
                                to={`/admin/services/${relatedService.serviceId}`}
                                className="btn btn-sm me-2"
                                style={{
                                  background: 'rgba(23, 162, 184, 0.8)',
                                  backdropFilter: 'blur(5px)',
                                  border: '1px solid rgba(255, 255, 255, 0.2)',
                                  color: 'white',
                                  borderRadius: '0',
                                  padding: '0.375rem 0.75rem',
                                  textDecoration: 'none'
                                }}
                              >
                                View
                              </Link>
                              <button
                                className="btn btn-sm"
                                onClick={() => handleRemoveRelatedService(relatedService.serviceId)}
                                style={{
                                  background: 'rgba(220, 53, 69, 0.8)',
                                  backdropFilter: 'blur(5px)',
                                  border: '1px solid rgba(255, 255, 255, 0.2)',
                                  color: 'white',
                                  borderRadius: '0',
                                  padding: '0.375rem 0.75rem'
                                }}
                              >
                                <i className="bi bi-unlink"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <i className="bi bi-link mb-3" style={{ 
                          fontSize: '3rem',
                          color: 'rgba(0, 0, 0, 0.3)'
                        }}></i>
                        <h5 className="text-dark mb-2">No related services</h5>
                        <p className="mb-4" style={{ color: 'rgba(0, 0, 0, 0.5)' }}>
                          Link this service to other related services
                        </p>
                        <button
                          className="btn"
                          onClick={() => setShowLinkModal(true)}
                          style={{
                            background: 'rgba(13, 110, 253, 0.8)',
                            backdropFilter: 'blur(5px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            borderRadius: '0',
                            padding: '0.75rem 1.5rem',
                            fontWeight: '500'
                          }}
                        >
                          <i className="bi bi-plus me-2"></i>
                          Link Your First Service
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          {/* Details Card to Show different info based on view */}
          <div className="mb-4" style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '0'
          }}>
            <div className="p-3 border-bottom" style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}>
              <h6 className="mb-0 text-dark">Service Details</h6>
            </div>
            <div className="p-0">
              {isAdminView && (
                <>
                  <div className="p-3 border-bottom d-flex justify-content-between" 
                       style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}>
                    <span style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Service ID</span>
                    <span className="text-dark">{currentService?.serviceId}</span>
                  </div>
                  <div className="p-3 border-bottom d-flex justify-content-between" 
                       style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}>
                    <span style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Display Order</span>
                    <span className="badge" style={{
                      background: 'rgba(23, 162, 184, 0.8)',
                      backdropFilter: 'blur(5px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '0',
                      padding: '0.25rem 0.5rem'
                    }}>
                      {currentService?.order}
                    </span>
                  </div>
                  <div className="p-3 border-bottom d-flex justify-content-between" 
                       style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}>
                    <span style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Status</span>
                    <span className="badge" style={{
                      background: currentService?.isActive 
                        ? 'rgba(40, 167, 69, 0.8)' 
                        : 'rgba(108, 117, 125, 0.8)',
                      backdropFilter: 'blur(5px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '0',
                      padding: '0.25rem 0.75rem'
                    }}>
                      {currentService?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </>
              )}
              <div className="p-3 border-bottom d-flex justify-content-between" 
                   style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}>
                <span style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                  <i className="bi bi-calendar me-2"></i>
                  {isAdminView ? 'Created' : 'Date'}
                </span>
                <span className="text-dark">
                  {currentService?.createdAt &&
                    new Date(currentService.createdAt).toLocaleDateString()}
                </span>
              </div>
              {isAdminView && currentService?.updatedAt && (
                <div className="p-3 d-flex justify-content-between">
                  <span style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Last Updated</span>
                  <span className="text-dark">
                    {new Date(currentService.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Icon Preview */}
          {currentService?.icon && (
            <div className="mb-4" style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '0'
            }}>
              <div className="p-3 border-bottom" style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}>
                <h6 className="mb-0 text-dark">Icon Preview</h6>
              </div>
              <div className="p-4 text-center">
                <div className="display-1 mb-3">
                  <i className={currentService.icon} style={{ color: 'rgba(13, 110, 253, 0.9)' }}></i>
                </div>
                {isAdminView && (
                  <code className="d-block mt-2" style={{ 
                    color: 'rgba(0, 0, 0, 0.5)',
                    fontSize: '0.875rem'
                  }}>
                    {currentService.icon}
                  </code>
                )}
              </div>
            </div>
          )}

          {/* Quick Actions show in admin view */}
          {isAdminView && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '0'
            }}>
              <div className="p-3 border-bottom" style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}>
                <h6 className="mb-0 text-dark">Quick Actions</h6>
              </div>
              <div className="p-3">
                <div className="d-grid gap-2">
                  <Link
                    to={editUrl}
                    className="btn"
                    style={{
                      background: 'rgba(13, 110, 253, 0.8)',
                      backdropFilter: 'blur(5px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      borderRadius: '0',
                      padding: '0.75rem',
                      fontWeight: '500',
                      textDecoration: 'none',
                      textAlign: 'center'
                    }}
                  >
                    <i className="bi bi-pencil me-2"></i>
                    Edit Service
                  </Link>
                  <button
                    className="btn"
                    onClick={() => setShowLinkModal(true)}
                    style={{
                      background: 'rgba(40, 167, 69, 0.8)',
                      backdropFilter: 'blur(5px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      borderRadius: '0',
                      padding: '0.75rem',
                      fontWeight: '500'
                    }}
                  >
                    <i className="bi bi-link me-2"></i>
                    Link Service
                  </button>
                  <button
                    className="btn"
                    onClick={() => setShowDeleteModal(true)}
                    style={{
                      background: 'rgba(220, 53, 69, 0.8)',
                      backdropFilter: 'blur(5px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      borderRadius: '0',
                      padding: '0.75rem',
                      fontWeight: '500'
                    }}
                  >
                    <i className="bi bi-trash me-2"></i>
                    Delete Service
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Contact/Enquiry Button for Customer View */}
          {!isAdminView && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '0'
            }}>
              <div className="p-3 border-bottom" style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}>
                <h6 className="mb-0 text-dark">Interested in this service?</h6>
              </div>
              <div className="p-3">
                <div className="d-grid gap-2">
                  <Link
                    to="/contact"
                    className="btn"
                    state={{ 
                      serviceName: currentService?.title,
                      serviceId: currentService?.serviceId 
                    }}
                    style={{
                      background: 'rgba(13, 110, 253, 0.8)',
                      backdropFilter: 'blur(5px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      borderRadius: '0',
                      padding: '0.75rem',
                      fontWeight: '500',
                      textDecoration: 'none',
                      textAlign: 'center'
                    }}
                  >
                    <i className="bi bi-envelope me-2"></i>
                    Request More Information
                  </Link>
                  <Link
                    to="/serv"
                    className="btn"
                    style={{
                      background: 'rgba(108, 117, 125, 0.8)',
                      backdropFilter: 'blur(5px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      borderRadius: '0',
                      padding: '0.75rem',
                      fontWeight: '500',
                      textDecoration: 'none',
                      textAlign: 'center'
                    }}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    View All Services
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal Only for admin */}
      {isAdminView && (
        <>
          <div className={`modal ${showDeleteModal ? 'show' : ''}`} style={{ 
            display: showDeleteModal ? 'block' : 'none',
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)'
          }}>
            <div className="modal-dialog">
              <div className="modal-content" style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '0'
              }}>
                <div className="modal-header border-0">
                  <h5 className="modal-title text-dark">Confirm Delete</h5>
                  <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p className="text-dark">
                    Are you sure you want to delete <strong>{currentService?.title}</strong>?
                  </p>
                  <p className="text-danger">
                    This action cannot be undone. All related service links will be removed.
                  </p>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn" onClick={() => setShowDeleteModal(false)}
                    style={{
                      background: 'rgba(108, 117, 125, 0.8)',
                      backdropFilter: 'blur(5px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      borderRadius: '0',
                      padding: '0.5rem 1rem',
                      fontWeight: '500'
                    }}>
                    Cancel
                  </button>
                  <button type="button" className="btn" onClick={handleDelete}
                    style={{
                      background: 'rgba(220, 53, 69, 0.8)',
                      backdropFilter: 'blur(5px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      borderRadius: '0',
                      padding: '0.5rem 1rem',
                      fontWeight: '500'
                    }}>
                    Delete Service
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Link Service Modal - Only for admin */}
      {isAdminView && (
        <>
          <div className={`modal ${showLinkModal ? 'show' : ''}`} style={{ 
            display: showLinkModal ? 'block' : 'none',
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)'
          }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content" style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '0'
              }}>
                <div className="modal-header border-0">
                  <h5 className="modal-title text-dark">Link Related Service</h5>
                  <button type="button" className="btn-close" onClick={() => setShowLinkModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label text-dark">Select Service to Link</label>
                    <select
                      className="form-select"
                      value={selectedServiceId}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                      style={{
                        borderRadius: '0',
                        border: '1px solid rgba(0, 0, 0, 0.2)',
                        background: 'rgba(255, 255, 255, 0.9)'
                      }}
                    >
                      <option value="">Choose a service...</option>
                      {availableServices.map(service => (
                        <option key={service.serviceId} value={service.serviceId}>
                          {service.title} {service.subTitle && `- ${service.subTitle}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-dark">Relation Type</label>
                    <select
                      className="form-select"
                      value={relationType}
                      onChange={(e) => setRelationType(e.target.value)}
                      style={{
                        borderRadius: '0',
                        border: '1px solid rgba(0, 0, 0, 0.2)',
                        background: 'rgba(255, 255, 255, 0.9)'
                      }}
                    >
                      <option value="similar">Similar Service</option>
                      <option value="complementary">Complementary Service</option>
                      <option value="upsell">Upsell Service</option>
                      <option value="cross-sell">Cross-sell Service</option>
                    </select>
                  </div>

                  {selectedServiceId && (
                    <div className="p-3 mt-3" style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '0'
                    }}>
                      <h6 className="text-dark mb-2">Selected Service:</h6>
                      {(() => {
                        const selected = availableServices.find(
                          s => s.serviceId === parseInt(selectedServiceId)
                        );
                        return selected ? (
                          <div>
                            <strong className="text-dark">{selected.title}</strong>
                            {selected.subTitle && (
                              <p className="mb-0" style={{ color: 'rgba(0, 0, 0, 0.5)' }}>
                                {selected.subTitle}
                              </p>
                            )}
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn" onClick={() => setShowLinkModal(false)}
                    style={{
                      background: 'rgba(108, 117, 125, 0.8)',
                      backdropFilter: 'blur(5px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      borderRadius: '0',
                      padding: '0.5rem 1rem',
                      fontWeight: '500'
                    }}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={handleAddRelatedService}
                    disabled={!selectedServiceId}
                    style={{
                      background: 'rgba(13, 110, 253, 0.8)',
                      backdropFilter: 'blur(5px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      borderRadius: '0',
                      padding: '0.5rem 1rem',
                      fontWeight: '500',
                      opacity: !selectedServiceId ? 0.5 : 1
                    }}
                  >
                    <i className="bi bi-link me-2"></i>
                    Link Service
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ServiceDetailView;



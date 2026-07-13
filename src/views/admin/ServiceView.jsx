
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useServiceStore from '../../stores/shared/useServiceStore';
import toast from 'react-hot-toast';

const ServicesView = () => {
  const {
    services,
    loading,
    error,
    searchQuery,
    fetchServices,
    deleteService,
    setSearchQuery,
    getFilteredServices,
    getOrderedServices
  } = useServiceStore();

  const [showInactive, setShowInactive] = useState(false);
  const [sortBy, setSortBy] = useState('order');

  useEffect(() => {
    console.log('🔍 Initial services data:', {
      services: services,
      firstService: services[0],
      firstServiceImageUrl: services[0]?.imageUrl,
      totalServices: services.length
    });
    
    fetchServices(showInactive);
  }, [showInactive]);

  // Helper function to construct proper image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return as-is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Your backend URL (adjust as needed)
    const backendUrl = 'https://api.logiphix.tech';
    
    // Clean the path - remove leading slash if present
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    
    // Construct full URL
    return `${backendUrl}/${cleanPath}`;
  };

  // Test image URLs when services change
  useEffect(() => {
    const testImageAccessibility = async () => {
      services.forEach(async (service) => {
        if (service.imageUrl) {
          const fullUrl = getImageUrl(service.imageUrl);
          try {
            const response = await fetch(fullUrl, { method: 'HEAD' });
            console.log(` Image accessibility check for ${fullUrl}:`, {
              accessible: response.ok,
              status: response.status
            });
          } catch (error) {
            console.error(` Cannot access image ${fullUrl}:`, error.message);
          }
        }
      });
    };

    if (services.length > 0) {
      testImageAccessibility();
    }
  }, [services]);

  const handleDelete = async (serviceId, serviceTitle) => {
    if (window.confirm(`Are you sure you want to delete "${serviceTitle}"?`)) {
      const result = await deleteService(serviceId);
      if (result.success) {
        toast.success('Service deleted successfully');
      } else {
        toast.error(result.error || 'Failed to delete service');
      }
    }
  };

  const filteredServices = getFilteredServices();
  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'date') return new Date(b.createdAt) - new Date(a.createdAt);
    return a.order - b.order;
  });

  // Fallback UI for when image fails to load
  const renderImageFallback = (service) => {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center h-100 bg-light">
        {service.icon ? (
          <i className={`${service.icon} text-muted`} style={{ fontSize: '3rem' }}></i>
        ) : (
          <i className="bi bi-gear text-muted" style={{ fontSize: '3rem' }}></i>
        )}
        <p className="text-muted mt-2 mb-0 text-center px-2">{service.title}</p>
      </div>
    );
  };

  // Handle image loading errors
  const handleImageError = (e, service) => {
    console.error(` Failed to load image for service "${service.title}":`, service.imageUrl);
    
    // Replace the image with fallback UI
    const container = e.target.parentElement;
    
    // Create fallback content
    const fallback = document.createElement('div');
    fallback.className = 'd-flex flex-column align-items-center justify-content-center h-100 bg-light';
    
    if (service.icon) {
      const icon = document.createElement('i');
      icon.className = service.icon + ' text-muted';
      icon.style.fontSize = '3rem';
      fallback.appendChild(icon);
    } else {
      const defaultIcon = document.createElement('i');
      defaultIcon.className = 'bi bi-gear text-muted';
      defaultIcon.style.fontSize = '3rem';
      fallback.appendChild(defaultIcon);
    }
    
    const title = document.createElement('p');
    title.className = 'text-muted mt-2 mb-0 text-center px-2';
    title.textContent = service.title;
    fallback.appendChild(title);
    
    // Replace the image with fallback
    container.innerHTML = '';
    container.appendChild(fallback);
  };

  if (loading && services.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading services...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Debug info (remove in production) */}
      <div className="alert alert-info d-flex align-items-center mb-3">
        <i className="bi bi-info-circle me-2"></i>
        <small>
          Showing {sortedServices.length} of {services.length} services. 
          {services[0]?.imageUrl && (
            <span className="ms-2">
              First image URL: <code>{services[0]?.imageUrl}</code>
            </span>
          )}
        </small>
      </div>

      {/* Header */}
      <div className="row mb-4 align-items-center">
        <div className="col">
          <h1 className="fw-bold mb-1">Services</h1>
          <p className="text-muted">Manage your services and offerings</p>
        </div>
        <div className="col-auto">
          <Link to="new" className="btn btn-success">
            <i className="bi bi-plus me-2"></i>
            Add New Service
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">
                  <i className="bi bi-funnel me-2"></i>
                  Search Services
                </label>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search by title, subtitle, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <label className="form-label">Sort By</label>
                <select 
                  className="form-select" 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="order">Display Order</option>
                  <option value="title">Title</option>
                  <option value="date">Date Created</option>
                </select>
              </div>
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="show-inactive"
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="show-inactive">
                  Show Inactive
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger mb-4">
          <h5 className="alert-heading">Error Loading Services</h5>
          <p className="mb-0">{error}</p>
          <button 
            className="btn btn-sm btn-outline-danger mt-2"
            onClick={() => fetchServices(showInactive)}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            Retry
          </button>
        </div>
      )}

      {/* Services Grid */}
      {sortedServices.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="bi bi-inboxes text-muted" style={{ fontSize: '3rem' }}></i>
            <h5 className="text-muted mt-3">No services found</h5>
            <p className="text-muted mb-0">
              {searchQuery ? 'Try a different search term' : 'Add your first service to get started'}
            </p>
            {searchQuery && (
              <button 
                className="btn btn-outline-secondary mt-3"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {sortedServices.map((service) => {
            const fullImageUrl = getImageUrl(service.imageUrl);
            
            return (
              <div className="col" key={service.serviceId}>
                <div className="card h-100 shadow-sm hover-shadow">
                  {/* Image Section */}
                  <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
                    {fullImageUrl ? (
                      <img
                        src={fullImageUrl}
                        className="card-img-top"
                        alt={service.title}
                        style={{ 
                          height: '100%', 
                          width: '100%', 
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                        onError={(e) => handleImageError(e, service)}
                        onLoad={() => console.log(`✅ Image loaded: ${service.title} - ${fullImageUrl}`)}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      />
                    ) : (
                      renderImageFallback(service)
                    )}
                    
                    {/* Status Badge */}
                    <div className="position-absolute top-0 end-0 m-2">
                      <span className={`badge ${service.isActive ? 'bg-success' : 'bg-secondary'}`}>
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    {/* Order Badge */}
                    <div className="position-absolute top-0 start-0 m-2">
                      <span className="badge bg-info">
                        Order: {service.order}
                      </span>
                    </div>
                  </div>
                  
                  {/* Card Body */}
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title mb-0">{service.title}</h5>
                      {service.icon && (
                        <i className={`${service.icon} text-primary`} style={{ fontSize: '1.5rem' }}></i>
                      )}
                    </div>
                    
                    {service.subTitle && (
                      <h6 className="card-subtitle mb-2 text-muted">
                        <i className="bi bi-tag me-1"></i>
                        {service.subTitle}
                      </h6>
                    )}
                    
                    <p className="card-text grow">
                      {service.description ? (
                        <>
                          {service.description.substring(0, 100)}
                          {service.description.length > 100 ? '...' : ''}
                        </>
                      ) : (
                        <span className="text-muted fst-italic">No description provided</span>
                      )}
                    </p>
                    
                    <div className="mt-3 small text-muted">
                      <div className="d-flex justify-content-between">
                        <span>
                          <i className="bi bi-calendar me-1"></i>
                          {new Date(service.createdAt).toLocaleDateString()}
                        </span>
                        <span>
                          <i className="bi bi-link me-1"></i>
                          {service.relatedServices?.length || 0} related
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card Footer */}
                  <div className="card-footer bg-transparent border-top-0">
                    <div className="d-flex justify-content-between">
                      <Link
                        to={`/${service.serviceId}`}
                        className="btn btn-outline-primary btn-sm"
                      >
                        <i className="bi bi-eye me-1"></i>
                        View
                      </Link>
                      <div>
                        <Link
                          to={`/admin/services/${service.serviceId}/edit`}
                          className="btn btn-outline-secondary btn-sm me-2"
                        >
                          <i className="bi bi-pencil me-1"></i>
                          Edit
                        </Link>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(service.serviceId, service.title)}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stats */}
      <div className="row mt-4">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 mb-3 mb-md-0">
                  <div className="text-center">
                    <h3 className="text-success">
                      {services.filter(s => s.isActive).length}
                    </h3>
                    <p className="text-muted mb-0">
                      <i className="bi bi-check-circle me-1"></i>
                      Active Services
                    </p>
                  </div>
                </div>
                <div className="col-md-4 mb-3 mb-md-0">
                  <div className="text-center">
                    <h3 className="text-secondary">
                      {services.filter(s => !s.isActive).length}
                    </h3>
                    <p className="text-muted mb-0">
                      <i className="bi bi-pause-circle me-1"></i>
                      Inactive Services
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="text-center">
                    <h3 className="text-primary">
                      {services.length}
                    </h3>
                    <p className="text-muted mb-0">
                      <i className="bi bi-collection me-1"></i>
                      Total Services
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Debug Panel (remove in production) */}
      <div className="card mt-4 border-info">
        <div className="card-header bg-info text-white">
          <h6 className="mb-0">
            <i className="bi bi-bug me-2"></i>
            Debug Information
          </h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h6>Service Data:</h6>
              <pre className="bg-light p-2 rounded small">
                {JSON.stringify({
                  totalServices: services.length,
                  filteredServices: filteredServices.length,
                  sortedServices: sortedServices.length,
                  showInactive,
                  sortBy,
                  searchQuery
                }, null, 2)}
              </pre>
            </div>
            <div className="col-md-6">
              <h6>Image URLs:</h6>
              <div className="small">
                {services.slice(0, 3).map((service, index) => (
                  <div key={index} className="mb-2">
                    <strong>{service.title}:</strong><br />
                    <code className="text-break">
                      Raw: {service.imageUrl || 'No image'}<br />
                      Full: {getImageUrl(service.imageUrl) || 'No image'}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesView;


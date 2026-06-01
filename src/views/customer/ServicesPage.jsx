import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useServiceStore from '../../stores/shared/useServiceStore';
import ChooseUs from '../../components/customer/ChooseUs';
import schematic from '../../assets/schematic.jpg'

const ServicesPage = () => {
  const { services, loading, fetchServices } = useServiceStore();

  useEffect(() => {
    fetchServices(false);
  }, []);

  // Helper to build full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;

    const backendUrl = 'http://localhost:2090';
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${backendUrl}/${cleanPath}`;
  };

  if (loading && services.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" style={{ borderRadius: '0' }} />
        <p className="mt-3">Loading services...</p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    }}>
      <div className="container py-5 min-vh-100">
        {/* Section Header with Glass Morphism */}
        
        <div className="text-center mb-5" style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          padding: '2.5rem',
          borderRadius: '0'
        }}>
          <h2 className="display-4 fw-bold text-dark mb-3">
            Our Company <span style={{ 
              color: 'rgba(13, 110, 253, 0.9)',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>Services</span>
          </h2>
          <p className="mt-3 mx-auto mb-0" style={{ 
            maxWidth: '720px',
            color: 'rgba(0, 0, 0, 0.7)',
            fontSize: '1.1rem',
            lineHeight: '1.6'
          }}>
            SynerPhix delivers innovative technology solutions that helps businesses, organizations and communities thrive in
             a rapidly evolving digital world. Our expertise spans ICT infrastructure, software development, electronics engineering
             and smart connected systems enabling us to provide end-to-end solutions tailored to your unique needs.
          </p>
        </div>

        {/* Services Grid with Glass Morphism */}
        <div className="row g-4">
          {services.map((service) => {
            const imageUrl = getImageUrl(service.imageUrl);

            return (
              <div
                key={service.serviceId}
                className="col-12 col-md-6 col-lg-4"
              >
                <div className="h-100" style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '0',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  overflow: 'hidden'
                }}>
                  {/* Image Container - No Border Radius */}
                  <div style={{ 
                    height: '220px', 
                    overflow: 'hidden',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '0'
                  }}>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={service.title}
                        className="w-100 h-100"
                        style={{ 
                          objectFit: 'cover',
                          borderRadius: '0',
                          transition: 'transform 0.5s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    ) : (
                      <div className="h-100 d-flex align-items-center justify-content-center" style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '0'
                      }}>
                        <i className="bi bi-image" style={{ 
                          fontSize: '2rem',
                          color: 'rgba(0, 0, 0, 0.3)'
                        }} />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 d-flex flex-column text-center" style={{ height: 'calc(100% - 220px)' }}>
                    <h5 className="fw-semibold mb-3 text-dark" style={{
                      fontSize: '1.25rem',
                      minHeight: '3rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {service.title}
                    </h5>

                    <p className="mb-4 grow" style={{
                      color: 'rgba(0, 0, 0, 0.7)',
                      lineHeight: '1.6',
                      fontSize: '0.95rem'
                    }}>
                      {service.description
                        ? (service.description.length > 120 
                            ? service.description.substring(0, 120) + '...'
                            : service.description)
                        : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
                    </p>

                    {/* Button */}
                    <div className="mt-auto">
                      <Link
                        to={`/services/${service.serviceId}`}
                        className="btn w-100"
                        style={{
                          background: 'green',
                          backdropFilter: 'blur(5px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          borderRadius: '0',
                          padding: '0.75rem',
                          fontWeight: '500',
                          transition: 'all 0.3s ease',
                          textDecoration: 'none',
                          display: 'block'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(13, 110, 253, 0.9)';
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 4px 12px rgba(13, 110, 253, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'green';
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {services.length === 0 && !loading && (
          <div className="text-center py-5" style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '0',
            padding: '3rem'
          }}>
            <i className="bi bi-inboxes display-1" style={{ 
              color: 'rgba(0, 0, 0, 0.2)',
              marginBottom: '1rem'
            }}></i>
            <h4 className="text-dark mb-3">No Services Available</h4>
            <p className="text-muted mb-0">
              Check back later for our service offerings.
            </p>
          </div>
        )}
      </div>

      {/* ChooseUs Component */}
      <ChooseUs />
    </div>
  );
};

export default ServicesPage;




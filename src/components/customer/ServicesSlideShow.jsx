import React, { useEffect, useState } from 'react';
import useServiceStore from '../../stores/shared/useServiceStore';

const ServiceSlideshow = () => {
  const { 
    services, 
    loading, 
    error, 
    fetchServices,
    getOrderedServices 
  } = useServiceStore();
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeServices, setActiveServices] = useState([]);

  // Helper to build full image URL (SAME AS YOUR SERVICES PAGE)
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
    
    const backendUrl = 'http://localhost:2090';
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${backendUrl}/${cleanPath}`;
  };

  // Fetch services on component mount
  useEffect(() => {
    console.log('📋 [Slideshow] Fetching services...');
    const loadServices = async () => {
      try {
        await fetchServices(false);
        console.log('✅ [Slideshow] Services fetched successfully');
      } catch (err) {
        console.error('❌ [Slideshow] Error fetching services:', err);
      }
    };
    
    loadServices();
  }, [fetchServices]);

  // Update active services when store changes
  useEffect(() => {
    console.log('📦 [Slideshow] Services data:', {
      totalServices: services?.length || 0,
      services: services
    });
    
    if (services && services.length > 0) {
      // Get ordered services
      const ordered = getOrderedServices ? getOrderedServices() : services;
      
      // Debug: Check image URLs
      console.log('🔍 [Slideshow] Image URLs for each service:');
      ordered.forEach((service, index) => {
        const originalUrl = service.imageUrl;
        const fullUrl = getImageUrl(originalUrl);
        console.log(`Service ${index} (${service.title}):`, {
          originalImageUrl: originalUrl,
          fullImageUrl: fullUrl,
          hasImage: !!originalUrl
        });
      });
      
      // Filter only active services
      const active = ordered.filter(service => 
        service && service.isActive !== false
      );
      
      console.log(`✅ [Slideshow] ${active.length} active services found`);
      setActiveServices(active);
    }
  }, [services, getOrderedServices]);

  // Handle slide navigation
  const handlePrev = () => {
    if (activeServices.length === 0) return;
    
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? activeServices.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    if (activeServices.length === 0) return;
    
    setActiveIndex((prevIndex) => 
      prevIndex === activeServices.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Handle indicator click
  const handleIndicatorClick = (index) => {
    setActiveIndex(index);
  };

  // Auto-rotate slides
  useEffect(() => {
    if (activeServices.length <= 1) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [activeServices.length]);

  // Get current service image URL
  const getCurrentImageUrl = () => {
    if (!activeServices[activeIndex]) return null;
    
    const currentService = activeServices[activeIndex];
    const imageUrl = getImageUrl(currentService.imageUrl);
    
    console.log('🖼️ [Slideshow] Current slide image:', {
      serviceTitle: currentService.title,
      imageUrl: imageUrl,
      originalPath: currentService.imageUrl
    });
    
    // Fallback placeholder if no image
    if (!imageUrl) {
      const placeholders = [
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      ];
      return placeholders[activeIndex % placeholders.length];
    }
    
    return imageUrl;
  };

  // Loading state
  if (loading && activeServices.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '500px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="alert alert-danger text-center m-4" role="alert">
        <h4>Error Loading Services</h4>
        <p>{error}</p>
        <button 
          className="btn btn-outline-danger mt-2"
          onClick={() => fetchServices(false)}
        >
          Retry
        </button>
      </div>
    );
  }

  // No services state
  if (!activeServices || activeServices.length === 0) {
    return (
      <div className="text-center py-5 bg-light" style={{ minHeight: '300px' }}>
        <h3>No Services Available</h3>
        <p>Check back later for our service offerings.</p>
      </div>
    );
  }

  const currentService = activeServices[activeIndex] || activeServices[0];
  const imageUrl = getCurrentImageUrl();

  return (
    <div className="service-slideshow-container position-relative">
      {/* Debug info (only in development) */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="position-absolute top-0 start-0 m-3 bg-dark bg-opacity-50 text-white p-2 rounded z-3">
          <small>
            Debug: Slide {activeIndex + 1} of {activeServices.length}
            <br />
            Image: {currentService.imageUrl ? '✅' : '❌'}
          </small>
        </div>
      )} */}
      
      {/* Main Slideshow Carousel */}
      <div id="serviceCarousel" className="carousel slide" data-bs-ride="carousel">
        {/* Indicators */}
        {activeServices.length > 1 && (
          <div className="carousel-indicators">
            {activeServices.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#serviceCarousel"
                data-bs-slide-to={index}
                className={index === activeIndex ? 'active' : ''}
                aria-current={index === activeIndex ? 'true' : 'false'}
                aria-label={`Slide ${index + 1}`}
                onClick={() => handleIndicatorClick(index)}
              />
            ))}
          </div>
        )}
        
        {/* Carousel Items */}
        <div className="carousel-inner">
          <div 
            className="carousel-item active"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              minHeight: '500px',
              position: 'relative'
            }}
          >
            {/* Backup img tag for better error handling */}
            <img
              src={imageUrl}
              alt={currentService.title}
              style={{ display: 'none' }}
              onError={(e) => {
                console.error('❌ [Slideshow] Failed to load image:', imageUrl);
                e.target.style.display = 'none';
              }}
              onLoad={() => console.log('✅ [Slideshow] Image loaded successfully:', imageUrl)}
            />
            
            {/* Overlay for better text readability */}
            <div 
              className="position-absolute top-0 start-0 w-100 h-100" 
              style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)'
              }}
            />
            
            {/* Content Container */}
            <div className="container h-100 d-flex align-items-center">
              <div className="row w-100">
                <div className="col-lg-8 col-md-10 mx-auto text-white p-4 p-md-5">
                  {/* Service Title */}
                  <h1 className="display-4 fw-bold mb-3">
                    {currentService.title || 'Our Service'}
                  </h1>
                  
                  {/* Service Subtitle */}
                  {currentService.subTitle && (
                    <h2 className="h3 mb-4 text-warning">
                      {currentService.subTitle}
                    </h2>
                  )}
                  
                  {/* Service Description */}
                  <p className="lead mb-4">
                    {currentService.description || 'Professional service with quality assurance.'}
                  </p>
                  
                  {/* Additional Info */}
                  {currentService.features && (
                    <div className="mb-4">
                      <ul className="list-unstyled">
                        {currentService.features.split(',').map((feature, idx) => (
                          <li key={idx} className="mb-2">
                            <i className="bi bi-check-circle-fill text-warning me-2"></i>
                            {feature.trim()}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="d-flex flex-wrap gap-3">
                    <button className="btn btn-primary btn-lg px-4 py-2">
                      <i className="bi bi-chat-left-text me-2"></i>
                      Get Quote
                    </button>
                    <button className="btn btn-outline-light btn-lg px-4 py-2">
                      <i className="bi bi-info-circle me-2"></i>
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Arrows */}
        {activeServices.length > 1 && (
          <>
            <button 
              className="carousel-control-prev" 
              type="button" 
              onClick={handlePrev}
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button 
              className="carousel-control-next" 
              type="button" 
              onClick={handleNext}
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </>
        )}
      </div>
      
      {/* Service Counter */}
      {/* <div className="position-absolute bottom-0 end-0 m-3 text-white bg-dark bg-opacity-50 rounded-pill px-3 py-2">
        <small>
          <span className="fw-bold">{activeIndex + 1}</span> / {activeServices.length}
        </small>
      </div> */}
      
      {/* Service Titles Preview */}
      {/* {activeServices.length > 1 && (
        <div className="d-none d-md-block position-absolute bottom-0 start-0 w-100 p-3">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="d-flex justify-content-center gap-2 flex-wrap">
                  {activeServices.map((service, index) => (
                    <button
                      key={service.serviceId}
                      className={`btn btn-sm ${index === activeIndex ? 'btn-warning' : 'btn-outline-light'} rounded-pill px-3`}
                      onClick={() => handleIndicatorClick(index)}
                    >
                      {service.title || `Service ${index + 1}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ServiceSlideshow;



// import { useEffect } from 'react';
// import useServiceStore from '../../stores/shared/useServiceStore';

// const ServiceHeroSlider = () => {
//   const {
//     services,
//     loading,
//     fetchServices,
//     getActiveServices
//   } = useServiceStore();

//   useEffect(() => {
//     fetchServices(false);
//   }, [fetchServices]);

//   const activeServices = getActiveServices();

//   if (loading) {
//     return (
//       <div className="text-center py-5">
//         <div className="spinner-border text-warning" />
//       </div>
//     );
//   }

//   if (!activeServices.length) {
//     return null;
//   }

//   return (
//     <div
//       id="serviceHeroCarousel"
//       className="carousel slide"
//       data-bs-ride="carousel"
//     >
//       {/* Indicators */}
//       <div className="carousel-indicators">
//         {activeServices.map((_, index) => (
//           <button
//             key={index}
//             type="button"
//             data-bs-target="#serviceHeroCarousel"
//             data-bs-slide-to={index}
//             className={index === 0 ? 'active' : ''}
//             aria-current={index === 0}
//           />
//         ))}
//       </div>

//       {/* Slides */}
//       <div className="carousel-inner">
//         {activeServices.map((service, index) => (
//           <div
//             key={service.serviceId}
//             className={`carousel-item ${index === 0 ? 'active' : ''}`}
//           >
//             {/* Background Image */}
//             <div
//               style={{
//                 height: '85vh',
//                 backgroundImage: `linear-gradient(
//                   rgba(0,0,0,0.55),
//                   rgba(0,0,0,0.55)
//                 ), url(${service.imageUrl})`,
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center',
//                 display: 'flex',
//                 alignItems: 'center'
//               }}
//             >
//               {/* Content */}
//               <div
//                 className="container"
//                 style={{ maxWidth: '700px' }}
//               >
//                 <h1
//                   style={{
//                     color: '#fff',
//                     fontWeight: '700',
//                     fontSize: '3rem',
//                     marginBottom: '1rem'
//                   }}
//                 >
//                   {service.title}
//                 </h1>

//                 {service.subTitle && (
//                   <h5
//                     style={{
//                       color: '#f1f1f1',
//                       marginBottom: '1rem'
//                     }}
//                   >
//                     {service.subTitle}
//                   </h5>
//                 )}

//                 <p
//                   style={{
//                     color: '#ddd',
//                     fontSize: '1.05rem',
//                     lineHeight: '1.7',
//                     marginBottom: '2rem'
//                   }}
//                 >
//                   {service.description}
//                 </p>

//                 <div className="d-flex gap-3">
//                   <button
//                     className="btn btn-warning px-4 py-2"
//                     style={{ fontWeight: 600 }}
//                   >
//                     Get Quote
//                   </button>

//                   <button
//                     className="btn btn-outline-light px-4 py-2"
//                   >
//                     Learn More
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Controls */}
//       <button
//         className="carousel-control-prev"
//         type="button"
//         data-bs-target="#serviceHeroCarousel"
//         data-bs-slide="prev"
//       >
//         <span className="carousel-control-prev-icon" />
//       </button>

//       <button
//         className="carousel-control-next"
//         type="button"
//         data-bs-target="#serviceHeroCarousel"
//         data-bs-slide="next"
//       >
//         <span className="carousel-control-next-icon" />
//       </button>
//     </div>
//   );
// };

// export default ServiceHeroSlider;

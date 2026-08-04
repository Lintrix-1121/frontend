import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useServiceStore from '../../stores/shared/useServiceStore';

const ServicesHomeComponent = () => {
  const { services, loading, fetchServices } = useServiceStore();

  useEffect(() => {
    fetchServices(true); // true for all services including inactive
  }, []);

  // Helper to build full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;

    const backendUrl = 'https://api.logiphix.tech';
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${backendUrl}/${cleanPath}`;
  };

  // Get only active services and sort by order
  const activeServices = services
    .filter(service => service.isActive)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .slice(0, 6); // Show only first 6 services on homepage

  if (loading && activeServices.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading our services...</p>
      </div>
    );
  }

  return (
    <section className="py-5">
      <div className="container">

        {/* Services Gallery */}
        <div className="row g-4">
          {activeServices.map((service, index) => {
            const imageUrl = getImageUrl(service.imageUrl);
            
            return (
              <div key={service.serviceId} className="col-md-6 col-lg-4">
                <Link 
                  to={`/services/${service.serviceId}`}
                  className="text-decoration-none"
                >
                  <div className="service-card position-relative overflow-hidden shadow-sm h-100">
                    <div className="position-relative" style={{ height: '250px' }}>
                      {imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt={service.title}
                          className="w-100 h-100"
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="w-100 h-100 bg-secondary d-flex align-items-center justify-content-center">
                          {service.icon ? (
                            <i className={`bi ${service.icon} text-white fs-1`}></i>
                          ) : (
                            <i className="bi bi-gear text-white fs-1"></i>
                          )}
                        </div>
                      )}
                      <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50 transition-opacity"></div>
                      <div className="position-absolute bottom-0 start-0 w-100 p-4 text-white">
                        <h4 className="fw-bold mb-2">{service.title}</h4>
                        {/* {service.subTitle && (
                          <p className="mb-2 opacity-75 small">{service.subTitle}</p>
                        )} */}
                        <div className="d-flex align-items-center">
                          {/* <span className="badge bg-primary me-2">
                            {service.order ? `Priority ${service.order}` : 'Service'}
                          </span> */}
                          <span className="small">
                            Explore <i className="bi bi-arrow-right ms-1"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        {services.length > 6 && (
          <div className="row mt-5">
            <div className="col-12 text-center">
              <Link to="/services" className="btn btn-outline-primary btn-lg px-5">
                View All Services ({services.length})
              </Link>
            </div>
          </div>
        )}

      </div>

      <style >{`
        .service-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
        }
        
        .service-card:hover .transition-opacity {
          opacity: 0.3;
        }
        
        .service-card::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #0d6efd, #20c997);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        
        .service-card:hover::after {
          transform: scaleX(1);
        }
      `}</style>
    </section>
  );
};

export default ServicesHomeComponent;









// import React, { useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import useServiceStore from '../../stores/shared/useServiceStore';

// const ServicesHomeComponent = () => {
//   const { services, loading, fetchServices } = useServiceStore();

//   useEffect(() => {
//     fetchServices(true); // true for all services including inactive
//   }, []);

//   // Helper to build full image URL
//   const getImageUrl = (imagePath) => {
//     if (!imagePath) return null;
//     if (imagePath.startsWith('http')) return imagePath;

//     const backendUrl = 'https://api.logiphix.tech';
//     const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
//     return `${backendUrl}/${cleanPath}`;
//   };

//   // Get only active services and sort by order
//   const activeServices = services
//     .filter(service => service.isActive)
//     .sort((a, b) => (a.order || 0) - (b.order || 0))
//     .slice(0, 6); // Show only first 6 services on homepage

//   if (loading && activeServices.length === 0) {
//     return (
//       <div className="container py-5 text-center">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//         <p className="mt-3">Loading our services...</p>
//       </div>
//     );
//   }

//   return (
//     <section className="py-5">
//       <div className="container">

//         {/* Services Gallery */}
//         <div className="row g-4">
//           {activeServices.map((service, index) => {
//             const imageUrl = getImageUrl(service.imageUrl);
            
//             return (
//               <div key={service.serviceId} className="col-md-6 col-lg-4">
//                 <Link 
//                   to={`/services/${service.serviceId}`}
//                   className="text-decoration-none"
//                 >
//                   <div className="service-card position-relative overflow-hidden rounded-3 shadow-sm h-100">
//                     <div className="position-relative" style={{ height: '250px' }}>
//                       {imageUrl ? (
//                         <img 
//                           src={imageUrl} 
//                           alt={service.title}
//                           className="w-100 h-100"
//                           style={{ objectFit: 'cover' }}
//                         />
//                       ) : (
//                         <div className="w-100 h-100 bg-secondary d-flex align-items-center justify-content-center">
//                           {service.icon ? (
//                             <i className={`bi ${service.icon} text-white fs-1`}></i>
//                           ) : (
//                             <i className="bi bi-gear text-white fs-1"></i>
//                           )}
//                         </div>
//                       )}
//                       <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50 transition-opacity"></div>
//                       <div className="position-absolute bottom-0 start-0 w-100 p-4 text-white">
//                         <h4 className="fw-bold mb-2">{service.title}</h4>
//                         {/* {service.subTitle && (
//                           <p className="mb-2 opacity-75 small">{service.subTitle}</p>
//                         )} */}
//                         <div className="d-flex align-items-center">
//                           {/* <span className="badge bg-primary me-2">
//                             {service.order ? `Priority ${service.order}` : 'Service'}
//                           </span> */}
//                           <span className="small">
//                             Explore <i className="bi bi-arrow-right ms-1"></i>
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </Link>
//               </div>
//             );
//           })}
//         </div>

//         {/* View All Button */}
//         {services.length > 6 && (
//           <div className="row mt-5">
//             <div className="col-12 text-center">
//               <Link to="/services" className="btn btn-outline-primary btn-lg px-5">
//                 View All Services ({services.length})
//               </Link>
//             </div>
//           </div>
//         )}

//       </div>

//       <style jsx>{`
//         .service-card {
//           transition: transform 0.3s ease, box-shadow 0.3s ease;
//         }
        
//         .service-card:hover {
//           transform: translateY(-5px);
//           box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
//         }
        
//         .service-card:hover .transition-opacity {
//           opacity: 0.3;
//         }
        
//         .service-card::after {
//           content: '';
//           position: absolute;
//           bottom: 0;
//           left: 0;
//           width: 100%;
//           height: 4px;
//           background: linear-gradient(90deg, #0d6efd, #20c997);
//           transform: scaleX(0);
//           transform-origin: left;
//           transition: transform 0.3s ease;
//         }
        
//         .service-card:hover::after {
//           transform: scaleX(1);
//         }
//       `}</style>
//     </section>
//   );
// };

// export default ServicesHomeComponent;


import React from 'react';
import prime from '../../assets/partners/prime.jpg';

const ChooseUs = () => {
  // Statistics data
  const statistics = [
    { id: 1, number: "257+", label: "Project Completed", icon: "bi bi-check-circle-fill" },
    { id: 2, number: "30+", label: "Team Members", icon: "bi bi-people-fill" },
    { id: 3, number: "130+", label: "Satisfied Clients", icon: "bi bi-emoji-smile-fill" },
    { id: 4, number: "05", label: "Total Branches", icon: "bi bi-building-fill" }
  ];

  return (
    <section className="py-5" style={{ background: '#f8f9fa' }}>
      <div className="container">
        <div className="row align-items-center">
          
          {/* Left Content Column */}
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="pe-lg-5">
              {/* Subheading */}
              <div className="d-flex align-items-center mb-3">
                <div 
                  className="me-2" 
                  style={{ 
                    width: '30px', 
                    height: '2px', 
                    background: '#dc3545' 
                  }}
                />
                <small className="text-uppercase text-info fw-bold" style={{ color: 'bg-info', letterSpacing: '1.5px' }}>
                  WHY CHOOSE US
                </small>
              </div>
              
              {/* Main Heading */}
              <h2 className="display-6 fw-bold mb-4">
                Why You Should<br />Hire Us
              </h2>
              
              {/* Description */}
              <p className="text-muted mb-5" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                Strategies to ensure proactive domination. At the end of the day, 
                User generated content in real-time will have multiple touchpoints for offshoring.
              </p>
              
              {/* Features Grid - No shadow, cleaner look */}
              <div className="row g-4">
                {[
                  { icon: "bi-calendar-check", title: "Over 5 Years Of Experience", desc: "Our LPG systems simply works better than any other product on the market and is the result." },
                  { icon: "bi-award", title: "High Quality Materials", desc: "Our LPG systems simply works better than any other product on the market and is the result." },
                  { icon: "bi-geo-alt", title: "Local Service Areas", desc: "Our LPG systems simply works better than any other product on the market and is the result." },
                  { icon: "bi-person-check", title: "Professional Standards", desc: "Our LPG systems simply works better than any other product on the market and is the result." }
                ].map((feature, index) => (
                  <div key={index} className="col-md-6">
                    <div className="d-flex">
                      <div className="me-3">
                        <i className={`bi ${feature.icon} fs-2 text-info`}></i>
                      </div>
                      <div>
                        <h5 className="fw-bold mb-2">{feature.title}</h5>
                        <p className="text-muted mb-0">{feature.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Image Column */}
          <div className="col-lg-6">
            <div 
              className="position-relative rounded overflow-hidden"
              style={{ 
                height: '450px',
                background: 'linear-gradient(45deg, #dc3545 0%, #c82333 100%)'
              }}
            >
              {/* Main Image */}
              <div 
                className="position-absolute w-100 h-100"
                style={{
                  backgroundImage: `url(${prime})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transform: 'skewX(-8deg) translateX(40px)',
                  borderLeft: '10px solid white',
                  borderTop: '10px solid white'
                }}
              />
              
              {/* Decorative circle */}
              <div 
                className="position-absolute rounded-circle d-none d-lg-block"
                style={{
                  width: '150px',
                  height: '150px',
                  border: '8px solid rgba(255,255,255,0.2)',
                  bottom: '30px',
                  left: '-30px'
                }}
              />
              
              {/* Years of experience badge */}
              <div 
                className="position-absolute bg-white rounded shadow p-3 d-none d-lg-block"
                style={{
                  bottom: '40px',
                  right: '30px',
                  maxWidth: '180px'
                }}
              >
                <div className="text-center">
                  <div className="text-info fw-bold small">SINCE 2020</div>
                  <div className="display-6 fw-bold text-dark">5+</div>
                  <div className="text-muted">Years</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Statistics Section - Improved design */}
        <div className="row mt-5 pt-5 g-4" style={{ borderTop: '1px solid #dee2e6' }}>
          {statistics.map((stat) => (
            <div key={stat.id} className="col-6 col-md-3 text-center">
              {/* Icon with background */}
              <div className="mb-3">
                <div 
                  className="mx-auto rounded-circle d-flex align-items-center justify-content-center"
                  style={{ 
                    width: '70px', 
                    height: '70px', 
                    background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)'
                  }}
                >
                  <i className={`${stat.icon} fs-4 text-white`}></i>
                </div>
              </div>
              
              {/* Number */}
              <div className="display-5 fw-bold text-dark mb-2">
                {stat.number}
              </div>
              
              {/* Label */}
              <div className="text-uppercase fw-semibold" style={{ 
                color: '#6c757d', 
                letterSpacing: '1.5px', 
                fontSize: '0.8rem' 
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChooseUs;

// import React from 'react';
// import prime from '../../assets/partners/prime.jpg';

// const ChooseUs = () => {
//   // Statistics data
//   const statistics = [
//     { id: 1, number: "7041", label: "Project Completed", icon: "bi bi-check-circle" },
//     { id: 2, number: "30+", label: "Team Members", icon: "bi bi-people" },
//     { id: 3, number: "1700+", label: "Satisfied Clients", icon: "bi bi-emoji-smile" },
//     { id: 4, number: "05", label: "Total Branches", icon: "bi bi-building" }
//   ];

//   return (
//     <section className="py-5" style={{ background: '#f8f9fa' }}>
//       <div className="container">
//         <div className="row align-items-center">
          
//           {/* Left Content Column */}
//           <div className="col-lg-6 mb-4 mb-lg-0">
//             <div className="pe-lg-5">
//               {/* Subheading */}
//               <div className="d-flex align-items-center mb-3">
//                 <div 
//                   className="me-2" 
//                   style={{ 
//                     width: '30px', 
//                     height: '2px', 
//                     background: '#dc3545' 
//                   }}
//                 />
//                 <small className="text-uppercase fw-bold" style={{ color: '#dc3545', letterSpacing: '1.5px' }}>
//                   WHY CHOOSE US
//                 </small>
//               </div>
              
//               {/* Main Heading */}
//               <h2 className="display-6 fw-bold mb-4">
//                 Why You Should<br />Hire Us
//               </h2>
              
//               {/* Description */}
//               <p className="text-muted mb-5" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
//                 Strategies to ensure proactive domination. At the end of the day, 
//                 User generated content in real-time will have multiple touchpoints for offshoring.
//               </p>
              
//               {/* Features Grid - 2 columns layout */}
//               <div className="row g-4">
//                 {/* Feature 1 */}
//                 <div className="col-md-6">
//                   <div className="bg-white p-4 h-100 rounded">
//                     <div className="mb-3">
//                       <i className="bi bi-calendar-check fs-2 text-danger"></i>
//                     </div>
//                     <h5 className="fw-bold mb-3">
//                       Over 28 Years<br />Of Experience
//                     </h5>
//                     <p className="text-muted mb-0">
//                       Our gutter protection simply works better than any other product on the market and is the result.
//                     </p>
//                   </div>
//                 </div>
                
//                 {/* Feature 2 */}
//                 <div className="col-md-6">
//                   <div className="bg-white p-4 h-100 rounded">
//                     <div className="mb-3">
//                       <i className="bi bi-award fs-2 text-danger"></i>
//                     </div>
//                     <h5 className="fw-bold mb-3">
//                       High Quality<br />Materials
//                     </h5>
//                     <p className="text-muted mb-0">
//                       Our gutter protection simply works better than any other product on the market and is the result.
//                     </p>
//                   </div>
//                 </div>
                
//                 {/* Feature 3 */}
//                 <div className="col-md-6">
//                   <div className="bg-white p-4 h-100 rounded">
//                     <div className="mb-3">
//                       <i className="bi bi-geo-alt fs-2 text-danger"></i>
//                     </div>
//                     <h5 className="fw-bold mb-3">
//                       Local Service<br />Areas
//                     </h5>
//                     <p className="text-muted mb-0">
//                       Our gutter protection simply works better than any other product on the market and is the result.
//                     </p>
//                   </div>
//                 </div>
                
//                 {/* Feature 4 */}
//                 <div className="col-md-6">
//                   <div className="bg-white p-4 h-100 rounded">
//                     <div className="mb-3">
//                       <i className="bi bi-person-check fs-2 text-danger"></i>
//                     </div>
//                     <h5 className="fw-bold mb-3">
//                       Professional<br />Standards
//                     </h5>
//                     <p className="text-muted mb-0">
//                       Our gutter protection simply works better than any other product on the market and is the result.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Right Image Column */}
//           <div className="col-lg-6">
//             <div 
//               className="position-relative rounded overflow-hidden"
//               style={{ 
//                 height: '450px',
//                 background: 'linear-gradient(45deg, #dc3545 0%, #c82333 100%)'
//               }}
//             >
//               {/* Main Image */}
//               <div 
//                 className="position-absolute w-100 h-100"
//                 style={{
//                   backgroundImage: `url(${prime})`,
//                   backgroundSize: 'cover',
//                   backgroundPosition: 'center',
//                   transform: 'skewX(-8deg) translateX(40px)',
//                   borderLeft: '10px solid white',
//                   borderTop: '10px solid white'
//                 }}
//               />
              
//               {/* Decorative circle */}
//               <div 
//                 className="position-absolute rounded-circle d-none d-lg-block"
//                 style={{
//                   width: '150px',
//                   height: '150px',
//                   border: '8px solid rgba(255,255,255,0.2)',
//                   bottom: '30px',
//                   left: '-30px'
//                 }}
//               />
              
//               {/* Years of experience badge */}
//               <div 
//                 className="position-absolute bg-white rounded shadow p-3 d-none d-lg-block"
//                 style={{
//                   bottom: '40px',
//                   right: '30px',
//                   maxWidth: '180px'
//                 }}
//               >
//                 <div className="text-center">
//                   <div className="text-danger fw-bold small">SINCE 1996</div>
//                   <div className="display-6 fw-bold text-dark">28+</div>
//                   <div className="text-muted">Years</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {/* Statistics Section - New addition from your screenshot */}
//         <div className="row mt-5 pt-4 g-4">
//           {statistics.map((stat) => (
//             <div key={stat.id} className="col-6 col-md-3">
//               <div className="text-center">
//                 {/* Icon */}
//                 <div className="mb-3">
//                   <i className={`${stat.icon} fs-1 text-danger`}></i>
//                 </div>
//                 {/* Number */}
//                 <div className="display-6 fw-bold text-dark mb-2">
//                   {stat.number}
//                 </div>
//                 {/* Label */}
//                 <div className="text-muted text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.9rem' }}>
//                   {stat.label}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ChooseUs;
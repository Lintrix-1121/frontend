import React from 'react';
import breadboard from '../../assets/breadboard.jpg';

const ChooseUs = () => {
  // Statistics data
  const statistics = [
    { id: 1, number: "20+", label: "Project Completed", icon: "bi bi-check-circle-fill" },
    { id: 2, number: "15+", label: "Team Members", icon: "bi bi-people-fill" },
    { id: 3, number: "10+", label: "Satisfied Clients", icon: "bi bi-emoji-smile-fill" },
    { id: 4, number: "05+", label: "Total Partners", icon: "bi bi-building-fill" }
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
              <h2 className="display-7 fw-bold mb-4">
                Why You Should<br />Hire Us
              </h2>
              
              {/* Description */}
              <p className="text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                We combine deep technical expertise with practical business understanding to deliver 
                solutions that drive measurable results.
              </p>
              
              {/* Features Grid - No shadow, cleaner look */}
              <div className="row g-3">
                {[
                  { icon: "bi-diagram-3", title: "End-to-End Technology Expertise", 
                    desc: "From ICT infrastructure & software development to embedded systems and IoT solutions, we provide integrated services under one roof." },
                  { icon: "bi-puzzle", title: "Engineering Innovation into Solutions", 
                    desc: "Our team designs and implements scalable and secure technology tailored to your operational needs." },
                  { icon: "bi-shield-check", title: "Trusted Technology Partner", 
                    desc: "We build relationships by providing relaible support, transparent communication and solutions that grow with your business." },
                  { icon: "bi-rocket-takeoff", title: "Future-Ready Solutions", 
                    desc: "Our services help organizations adapt to evolving technologies and market demands." }
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
                  backgroundImage: `url(${breadboard})`,
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
                  <div className="text-info fw-bold small">Electronics</div>
                  <div className="display-6 fw-bold text-dark">+</div>
                  <div className="text-muted"></div>
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

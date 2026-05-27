// src/pages/ContactPage.jsx
import React from 'react';
import ContactForm from '../../components/customer/ContactForm';
import ContactInfo from '../../components/customer/ContactInfo';
import MapComponent from '../../components/customer/MapComponent';
import back from '../../assets/back.png';

const ContactPage = () => {
  const features = [
    { icon: "⭐", title: "Quick Response", desc: "We reply within 24 hours" },
    { icon: "✓", title: "Expert Team", desc: "Skilled professionals" },
    { icon: "🕒", title: "24/7 Support", desc: "Always here to help" }
  ];

  return (
    <div style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      {/* <Header /> */}
      
      {/* Hero Section with Glass Morphism */}
      <section 
        className="position-relative overflow-hidden mb-5"
        style={{
          backgroundImage: `url(${back})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark overlay */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1
          }}
        />
        
        {/* Glass morphism overlay */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(5px) saturate(180%)',
            WebkitBackdropFilter: 'blur(5px) saturate(180%)',
            zIndex: 2
          }}
        />
        
        {/* Content */}
        <div className="container position-relative py-5" style={{ zIndex: 3 }}>
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold text-success mb-4">
                Get in <span className="text-warning">Touch</span>
              </h1>
              <p className="lead text-white mb-0 opacity-75">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end">
              {/* Stats Card */}
              <div 
                className="p-4"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <div className="row g-4 text-center">
                  <div className="col-6">
                    <div className="text-white fs-4 fw-bold">24/7</div>
                    <div className="text-white-50 small">Support</div>
                  </div>
                  <div className="col-6">
                    <div className="text-white fs-4 fw-bold">100%</div>
                    <div className="text-white-50 small">Response Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <div className="container py-5">
        {/* Feature Cards - Glass morphism design */}
        <div className="row g-4 mb-5">
          {features.map((feature, index) => (
            <div key={index} className="col-md-4">
              <div 
                className="h-100 p-4"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
                  e.currentTarget.style.borderColor = 'rgba(40, 167, 69, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.1)';
                }}
              >
                <div className="d-flex align-items-center">
                  <div 
                    className="p-3 me-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: '60px',
                      height: '60px',
                      background: 'rgba(40, 167, 69, 0.1)',
                      border: '1px solid rgba(40, 167, 69, 0.2)'
                    }}
                  >
                    <span style={{ color: '#28a745', fontSize: '1.5rem' }}>{feature.icon}</span>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">{feature.title}</h5>
                    <small className="text-muted">{feature.desc}</small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Contact Form and Info Section */}
        <div className="row g-4 mb-5">
          <div className="col-lg-7">
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                padding: '2rem',
                height: '100%'
              }}
            >
              <ContactForm />
            </div>
          </div>
          <div className="col-lg-5">
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                padding: '2rem',
                height: '100%'
              }}
            >
              <ContactInfo />
            </div>
          </div>
        </div>
      </div>
      
      {/* Map Component - Full width with glass effect */}
      <div 
        className="w-100"
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          position: 'relative'
        }}
      >
        {/* Optional glass overlay on map */}
        <div 
          className="position-absolute top-0 start-0 w-100"
          style={{
            height: '10px',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)',
            backdropFilter: 'blur(5px)',
            zIndex: 2,
            pointerEvents: 'none'
          }}
        />
        <MapComponent />
      </div>
    </div>
  );
};

export default ContactPage;


// src/pages/AboutPage.jsx
import React from 'react';
//import Header from '../../components/shared/Header';
import Footer from '../../components/shared/Footer';
import CompanyStory from '../../components/customer/CompanyStory';
import PartnersSection from '../../components/customer/PartnersSection';
import back from '../../assets/back.png'

const AboutPage = () => {
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
                About <span className="text-warning">SynerPhix</span>
              </h1>
              <p className="lead text-white mb-0 opacity-75">
                Pioneering LPG systems solutions and gas distribution since 2020
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
                    <div className="text-white fs-4 fw-bold">2020</div>
                    <div className="text-white-50 small">Founded</div>
                  </div>
                  <div className="col-6">
                    <div className="text-white fs-4 fw-bold">5+</div>
                    <div className="text-white-50 small">Countries</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <div className="container py-5">
        <CompanyStory />
        
        {/* Mission & Vision */}
        <div className="row g-4 mt-5">
          <div className="col-lg-4">
            <div 
              className="h-100 d-flex flex-column p-4 p-lg-5"
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
              <div className="text-center mb-4">
                <div 
                  className="p-3 d-inline-flex mb-3"
                  style={{
                    background: 'rgba(13, 110, 253, 0.1)',
                    border: '1px solid rgba(13, 110, 253, 0.2)'
                  }}
                >
                  <i className="bi bi-eye" style={{ color: '#0d6efd', fontSize: '2rem' }}></i>
                </div>
                <h3 className="fw-bold mb-3">Our Vision</h3>
                <p className="text-muted">
                  To be the leading indigenous service company in Oil and Gas Industry. 
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div 
              className="h-100 d-flex flex-column p-4 p-lg-5"
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
              <div className="text-center mb-4">
                <div 
                  className="p-3 d-inline-flex mb-3"
                  style={{
                    background: 'rgba(40, 167, 69, 0.1)',
                    border: '1px solid rgba(40, 167, 69, 0.2)'
                  }}
                >
                  <i className="bi bi-bullseye" style={{ color: '#28a745', fontSize: '2rem' }}></i>
                </div>
                <h3 className="fw-bold mb-3">Our Mission</h3>
                <p className="text-muted">
                  To provide our customers with Safe, quality, reliable, professional, and innovative LPG solutions.
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div 
              className="h-100 d-flex flex-column p-4 p-lg-5"
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
              <div className="text-center mb-4">
                <div 
                  className="p-3 d-inline-flex mb-3"
                  style={{
                    background: 'rgba(255, 193, 7, 0.1)',
                    border: '1px solid rgba(255, 193, 7, 0.2)'
                  }}
                >
                  <i className="bi bi-heart" style={{ color: '#ffc107', fontSize: '2rem' }}></i>
                </div>
                <h3 className="fw-bold mb-3">Our Values</h3>
                <ul className="list-unstyled text-start">
                  <li className="mb-2 d-flex align-items-center">
                    <i className="bi bi-check-circle-fill me-2" style={{ color: '#28a745', fontSize: '0.9rem' }}></i>
                    <span className="text-muted">Integrity and Trust</span>
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <i className="bi bi-check-circle-fill me-2" style={{ color: '#28a745', fontSize: '0.9rem' }}></i>
                    <span className="text-muted">Safety</span>
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <i className="bi bi-check-circle-fill me-2" style={{ color: '#28a745', fontSize: '0.9rem' }}></i>
                    <span className="text-muted">Loyalty & Teamwork</span>
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <i className="bi bi-check-circle-fill me-2" style={{ color: '#28a745', fontSize: '0.9rem' }}></i>
                    <span className="text-muted">Entrepreneurial Spirit</span>
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <i className="bi bi-check-circle-fill me-2" style={{ color: '#28a745', fontSize: '0.9rem' }}></i>
                    <span className="text-muted">Culture of Learning</span>
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <i className="bi bi-check-circle-fill me-2" style={{ color: '#28a745', fontSize: '0.9rem' }}></i>
                    <span className="text-muted">Perseverance</span>
                  </li>
                  <li className="mb-2 d-flex align-items-center">
                    <i className="bi bi-check-circle-fill me-2" style={{ color: '#28a745', fontSize: '0.9rem' }}></i>
                    <span className="text-muted">Excellence</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Founder Section */}
        <div className="row align-items-center g-4 mt-5">
          <div className="col-lg-4">
            <div 
              className="overflow-hidden"
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
              <div className="p-4 text-center">
                <div className="mb-4">
                  <div 
                    className="overflow-hidden mx-auto d-flex align-items-center justify-content-center"
                    style={{
                      width: '200px',
                      height: '200px',
                      background: 'rgba(13, 110, 253, 0.1)',
                      border: '1px solid rgba(13, 110, 253, 0.2)'
                    }}
                  >
                    <i className="bi bi-person-circle" style={{ color: '#0d6efd', fontSize: '100px' }}></i>
                  </div>
                </div>
                <h4 className="fw-bold mb-1">Livingstone Obbo</h4>
                <p className="fw-medium mb-3" style={{ color: '#0d6efd' }}>FOUNDER & CEO</p>
                <p className="text-muted mb-0">
                  Leading the vision with passion and innovation, driving SynerPhix mission across Africa.
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-lg-8">
            <div 
              className="overflow-hidden p-4 p-lg-5"
              style={{
                background: 'rgba(255, 193, 7, 0.1)',
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(255, 193, 7, 0.2)'
              }}
            >
              <blockquote className="mb-0">
                <i className="bi bi-quote" style={{ color: '#ffc107', opacity: 0.5, fontSize: '3rem', display: 'block', marginBottom: '1rem' }}></i>
                <p className="fs-4 fst-italic mb-4" style={{ color: '#212529' }}>
                  "We are committed to providing our clients the best designs, installation and NDT inspections, 
                  maintenance and repairs, LPG equipment and accessory supplies, consultancy services.
                  Recognizing the development and industry trends in Uganda, there is an increased need for safe and 
                  cost-effective technical energy solutions.
                  At SynerPhix, we don't just follow trends – we create them. Our journey is about building 
                  solutions that last and making a meaningful impact in the communities we serve."
                </p>
                <footer className="mt-3 fw-semibold" style={{ color: '#6c757d' }}>
                  Livingstone Obbo, Founder & CEO
                </footer>
              </blockquote>
            </div>
          </div>
        </div>

      </div>
      
    </div>
  );
};

export default AboutPage;


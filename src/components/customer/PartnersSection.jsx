// src/components/PartnersSection.jsx
import React from 'react';
import back from '../../assets/breadboard.jpg'

/* =========================
   Partner Logos Imports
   ========================= */
import total from '../../assets/partners/total.png';
import royal from '../../assets/partners/royal.jpeg';
import equity from '../../assets/partners/equity.png';
import upik from '../../assets/partners/upik.jpeg';
import unoc from '../../assets/partners/unoc.png';
import vivo from '../../assets/partners/vivo.png';
import serena from '../../assets/partners/serena.png';
import spiners from '../../assets/partners/spiners.jpeg';
import stabex from '../../assets/partners/stabex.png';
import prime from '../../assets/partners/prime.jpg';
import ubl from '../../assets/partners/ubl.jpeg';
import nicolete from '../../assets/partners/nicolete.png';
import harris from '../../assets/partners/harris.jpg';

const PartnersSection = () => {
  const partners = [
    // { company: "Total Energies", product: "Steel Pipes", logo: total, region: "Global" },
    // { company: "Royal Netherlands Embassy", product: "Gas Detectors & Control Panels", logo: royal, region: "Global" },
    // { company: "Equity Bank", product: "Vaporizers & SNG Modules", logo: equity, region: "UG" },
    // { company: "UPIK", product: "Copper Pipes", logo: upik, region: "UG" },
    // { company: "UNOC", product: "Gas Tanks", logo: unoc, region: "UG" },
    // { company: "Shell", product: "Gas Meters & Regulators", logo: vivo, region: "Global" },
    // { company: "Serena Hotel", product: "Pumps & Valves", logo: serena, region: "UG" },
    // { company: "Fine Spinners", product: "Pressure Vessels & Storage Tanks", logo: spiners, region: "UG" },
    // { company: "Stabex", product: "Tankers", logo: stabex, region: "Global" },
    // { company: "Prime Concepts", product: "Valves & Safety Regulators", logo: prime, region: "UG" },
    // { company: "UBL", product: "Coupling Assemblies & Filters", logo: ubl, region: "EU" },
    // { company: "Nicollete International Schools", product: "Gas Meters & Detectors", logo: nicolete, region: "Global" },
    // { company: "Hariss International", product: "Winches & Handling Systems", logo: harris, region: "Global" },
  ];

  // Group by Region
  const groupedPartners = partners.reduce((groups, partner) => {
    if (!groups[partner.region]) groups[partner.region] = [];
    groups[partner.region].push(partner);
    return groups;
  }, {});

  return (
    <div style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
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
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
              <h2 className="display-4 fw-bold text-success mb-4">
                Our Global <span className="text-warning">Partners</span>
              </h2>
              <p className="lead text-white mb-0 opacity-75">
                Powering Innovation Through Strategic Alliances.
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
                    <div className="text-white fs-4 fw-bold">{partners.length}</div>
                    <div className="text-white-50 small">Total Partners</div>
                  </div>
                  <div className="col-6">
                    <div className="text-white fs-4 fw-bold">
                      {Object.keys(groupedPartners).length}
                    </div>
                    <div className="text-white-50 small">Regions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container py-5">
        {/* Header Badges */}
        <div className="d-flex justify-content-center flex-wrap gap-2 mb-5">
          <span 
            className="px-3 py-2"
            style={{
              background: 'rgba(40, 167, 69, 0.1)',
              color: '#28a745',
              border: '1px solid rgba(40, 167, 69, 0.2)',
              fontSize: '0.875rem'
            }}
          >
            <i className="bi bi-globe me-1"></i> Global Network
          </span>
          <span 
            className="px-3 py-2"
            style={{
              background: 'rgba(13, 110, 253, 0.1)',
              color: '#0d6efd',
              border: '1px solid rgba(13, 110, 253, 0.2)',
              fontSize: '0.875rem'
            }}
          >
            <i className="bi bi-shield-check me-1"></i> Trusted Partners
          </span>
          <span 
            className="px-3 py-2"
            style={{
              background: 'rgba(255, 193, 7, 0.1)',
              color: '#ffc107',
              border: '1px solid rgba(255, 193, 7, 0.2)',
              fontSize: '0.875rem'
            }}
          >
            <i className="bi bi-award me-1"></i> Quality Assured
          </span>
        </div>

        {/* Partners by Region */}
        {Object.entries(groupedPartners).map(([region, regionPartners]) => (
          <div key={region} className="mb-5">
            <div className="d-flex align-items-center mb-4">
              <div 
                className="p-2 me-3"
                style={{
                  background: 'rgba(40, 167, 69, 0.1)',
                  border: '1px solid rgba(40, 167, 69, 0.2)'
                }}
              >
                <i className="bi bi-geo-alt" style={{ color: '#28a745', fontSize: '1.5rem' }}></i>
              </div>
              <h3 className="fw-bold mb-0">{region} Partners</h3>
              <span 
                className="ms-3 px-2 py-1"
                style={{
                  background: 'rgba(40, 167, 69, 0.1)',
                  color: '#28a745',
                  border: '1px solid rgba(40, 167, 69, 0.2)',
                  fontSize: '0.875rem'
                }}
              >
                {regionPartners.length}
              </span>
            </div>

            <div className="row g-4">
              {regionPartners.map((partner, index) => (
                <div key={index} className="col-md-6 col-lg-4">
                  <div 
                    className="h-100 d-flex flex-column"
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
                    <div className="p-4 d-flex flex-column grow">
                      <div className="d-flex align-items-center mb-3">
                        {/* Logo container */}
                        <div
                          className="d-flex align-items-center justify-content-center overflow-hidden"
                          style={{ 
                            width: '80px',
                            height: '80px',
                            flexShrink: 0,
                            background: 'rgba(255, 255, 255, 0.5)',
                            border: '1px solid rgba(0, 0, 0, 0.05)'
                          }}
                        >
                          <img
                            src={partner.logo}
                            alt={`${partner.company} logo`}
                            loading="lazy"
                            className="img-fluid"
                            style={{ 
                              maxHeight: '60px',
                              maxWidth: '60px',
                              objectFit: 'contain'
                            }}
                          />
                        </div>

                        <div className="ms-3">
                          <h5 className="fw-bold mb-1">{partner.company}</h5>
                          <span 
                            className="small px-2 py-1"
                            style={{
                              background: 'rgba(108, 117, 125, 0.1)',
                              color: '#6c757d',
                              border: '1px solid rgba(108, 117, 125, 0.2)'
                            }}
                          >
                            {partner.region}
                          </span>
                        </div>
                      </div>

                      <p className="text-muted small mb-3">
                        <span className="fw-medium text-dark">Products:</span> {partner.product}
                      </p>

                      <div className="mt-auto d-flex justify-content-between align-items-center pt-3 border-top"
                        style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}
                      >
                        <span 
                          className="small d-flex align-items-center"
                          style={{ color: '#28a745' }}
                        >
                          <i className="bi bi-check-circle-fill me-1" style={{ fontSize: '0.8rem' }}></i>
                          Certified Partner
                        </span>
                        <button 
                          className="btn btn-sm"
                          style={{
                            background: 'rgba(40, 167, 69, 0.1)',
                            color: '#28a745',
                            border: '1px solid rgba(40, 167, 69, 0.2)',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#28a745';
                            e.target.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(40, 167, 69, 0.1)';
                            e.target.style.color = '#28a745';
                          }}
                        >
                          <i className="bi bi-link-45deg me-1"></i>
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* CTA Section */}
        <div 
          className="mt-5 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(40, 167, 69, 0.95), rgba(32, 201, 151, 0.95))',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <div className="p-4 p-lg-5 text-white">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h3 className="fw-bold mb-2">Become a Partner</h3>
                <p className="mb-0 opacity-75">
                  Join us in delivering innovative technology solutions, unlocking new opportunities and 
                  creating lasting value together.
                </p>
              </div>
              <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                <button 
                  className="btn btn-lg fw-bold px-4"
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    color: '#28a745',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'white';
                    e.target.style.color = '#198754';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                    e.target.style.color = '#28a745';
                  }}
                >
                  <i className="bi bi-handshake me-2"></i>
                  Partner With Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnersSection;



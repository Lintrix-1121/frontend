import React from 'react';

const CompanyStory = () => {
  return (
    <section className="py-5">
      <div className="row align-items-center g-5">
        <div className="col-lg-6">
          <div className="position-relative">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="card-body p-0">
                <div className="bg-success bg-gradient p-5">
                  <div className="text-center">
                    <h2 className="display-5 fw-bold text-white mb-4">Our Story</h2>
                    <div className="bg-white bg-opacity-25 p-4 rounded-4">
                      <p className="text-white mb-0 fs-5">
                        Founded in 2020 To be the leading indigenous service company in Oil and Gas Industry.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="row g-3 mt-4">
              <div className="col-6">
                <div className="card border-0 bg-success bg-opacity-10 rounded-4 h-100">
                  <div className="card-body p-4 text-center">
                    <h3 className="display-4 fw-bold text-success mb-2">5+</h3>
                    <p className="text-dark fw-medium mb-0">Years of Excellence</p>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="card border-0 bg-primary bg-opacity-10 rounded-4 h-100">
                  <div className="card-body p-4 text-center">
                    <h3 className="display-4 fw-bold text-primary mb-2">50+</h3>
                    <p className="text-dark fw-medium mb-0">Projects Commissioned</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-6">
          <div className="ps-lg-4">
            <h2 className="fw-bold text-dark mb-4">Building the Future Together</h2>
            
            <div className="timeline">
              <div className="timeline-item mb-4">
                <div className="timeline-marker bg-primary rounded-circle"></div>
                <div className="timeline-content">
                  <h5 className="fw-bold text-dark">2020 - The Beginning</h5>
                  <p className="text-muted mb-0">
                    SynerPhix was founded with a vision to be the leading indigenous service 
                    company in Oil and Gas Industry.
                  </p>
                </div>
              </div>
              
              <div className="timeline-item mb-4">
                <div className="timeline-marker bg-success rounded-circle"></div>
                <div className="timeline-content">
                  <h5 className="fw-bold text-dark">2021-2022 - Growth & Expansion</h5>
                  <p className="text-muted mb-0">
                    Introduced our own services in the market, collaborated with local entities 
                    and contributed to the petroleum ecosystem in Uganda.
                  </p>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-marker bg-warning rounded-circle"></div>
                <div className="timeline-content">
                  <h5 className="fw-bold text-dark">2023-Present - Innovation Leader</h5>
                  <p className="text-muted mb-0">
                    Expanding across the globe with new range of product and services, 
                    bringing revolution in this evolving market.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-light rounded-4 border-start border-4 border-info">
              <p className="text-dark mb-0">
                <strong>Our Commitment:</strong> We design, install and maintain LPG systems with 
                with expertise  create lasting impact across Africa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyStory;
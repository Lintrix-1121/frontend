import React from 'react';

const CompanyStory = () => {
  return (
    <section className="py-5">
      <div className="row align-items-center g-5">
        <div className="col-lg-6">
          <div className="position-relative">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="card-body p-0">
                <div className="bg-success bg-gradient p-4">
                  <div className="">
                    <h2 className="display-6 fw-bold text-white mb-4">Our Story</h2>
                    <div className="bg-white bg-opacity-25 p-3 rounded-4">
                      <p className="text-white mb-0 fs-5.5">
                        In an increasingly connected world, technology is no longer just a tool - it is the foundation of innovation, 
                        efficiency and growth. 
                      </p>
                      <p className='text-white mb-0 fs-5.5'>
                        With a clear mission, what began as a paaion for solving complex technical challenges has evolved into a multidisciplinary 
                        technology company specializing in ICT Infrastructure, Software Development, Electronics & Embedded Systems Engineering, IoT & Smart 
                        Systems Integration
                      </p>
                      <p className='text-white mb-0 fs-5.5'>
                        Our team believes that every business, institution and community deserves access to technology that drives transformation. Whether 
                        designing robust ICT infrastructure, developing custom software, engineering embedded electronics or deploying connected IoT ecosystems, 
                        we forcus on delivering solutions that are innovative, practical and built for the future.
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
                    <h3 className="display-4 fw-bold text-success mb-2">2+</h3>
                    <p className="text-dark fw-medium mb-0">Years of Excellence</p>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="card border-0 bg-primary bg-opacity-10 rounded-4 h-100">
                  <div className="card-body p-4 text-center">
                    <h3 className="display-4 fw-bold text-primary mb-2">20+</h3>
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
                  <h5 className="fw-bold text-dark">The Beginning</h5>
                  <p className="text-muted mb-0">
                    As a startup, we embrace agility, innovation and continuous learning. We are not constrained by traditional approaches 
                    but rather driven by curiosity, collaboration and the desire to build technologies that make businesses smarter, operations 
                    more efficient and communities more connected. 
                  </p>
                </div>
              </div>
              
              <div className="timeline-item mb-4">
                <div className="timeline-marker bg-success rounded-circle"></div>
                <div className="timeline-content">
                  <h5 className="fw-bold text-dark">Growth & Expansion</h5>
                  <p className="text-muted mb-0">
                    Today we are growing into a trusted technology partner for organizations seeking digital transformation. Our vision extends beyond 
                    delivering products and services; we aim to create intelligent ecosystems where infrastructure, software, devices and data work seamlessly 
                    together to unlock new opportunities.
                  </p>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-marker bg-warning rounded-circle"></div>
                <div className="timeline-content">
                  <h5 className="fw-bold text-dark">Innovation Leader</h5>
                  <p className="text-muted mb-0">
                    The journey is only beginning. As technology continues to evolve, we remain committed to pushing boundaries, solving complex challenges 
                    and helping shape a smarter, more connected future.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-light rounded-4 border-start border-4 border-info">
              <p className="text-dark mb-0">
                <strong>Our Commitment:</strong> We build technology with purpose - creating solutions that are reliable, scalable, 
                innovative and designed for the future.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyStory;
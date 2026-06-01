import React from 'react';
import ServiceSlideshow from './ServicesSlideShow';
import schematic from '../../assets/schematic.jpg';
import ServicesHomeComponent from './ServiceComponent';
import HomeBlogComponent from './BlogComponent';
import OurApproach from './OurApproach';
import ContactPage from '../../views/customer/ContactPage';
import { Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const backgroundImage = schematic; 
  return (
    <>
      {/* Background with gradient overlay */}
      <div 
        className="position-fixed top-0 start-0 w-100 h-100 z-n1"
        style={{
          backgroundImage: `linear-gradient(rgba(11, 44, 93, 0.1), rgba(15, 76, 129, 0.1)), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(0px) brightness(1.1)'
        }}
      />

      {/* Overlay gradient for depth */}
      <div 
        className="position-fixed top-0 start-0 w-100 h-100 z-n1"
        style={{
          background: 'linear-gradient(135deg, rgba(11, 44, 93, 0.03) 0%, rgba(15, 76, 129, 0.03) 100%)',
        }}
      />

      {/* <ServiceSlideshow /> */}

      {/* HERO SECTION with Glass Effect */}
      <section className="py-5 text-white position-relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'radial-gradient(circle at 30% 20%, rgba(11, 44, 93, 0.3) 0%, rgba(15, 76, 129, 0.2) 25%, transparent 50%)',
            animation: 'pulse 10s ease-in-out infinite alternate'
          }}
        />
        
        {/* Glass overlay */}
        <div className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: 'rgba(11, 44, 93, 0.6)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        />
        
        <div className="container py-5 position-relative z-1">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="p-4 p-lg-5"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
              >
                <h1 className="fw-bold display-5 mb-4">
                  Engineering Intelligent Systems for a Connected Future.
                </h1>
                <p className="lead mb-4 opacity-90">
                  SynerPhix delivers integrated ICT infrastructure, custom software development, electronics and embedded systems engineering and IoT 
                  smart solutions designed to power digital transformation.
                </p>
                
              </div>
            </div>

            <div className="col-lg-6 text-center mt-5 mt-lg-0">
              <div className="position-relative">
                <div className="p-5 d-inline-block"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <i
                    className="bi bi-fire position-relative z-1"
                    style={{ fontSize: '180px', color: '#ff6b6b', filter: 'drop-shadow(0 0 20px rgba(217, 4, 41, 0.3))' }}
                  />
                </div>
                <div className="position-absolute top-50 start-50 translate-middle"
                  style={{
                    width: '280px',
                    height: '280px',
                    background: 'radial-gradient(circle, rgba(217, 4, 41, 0.4) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(20px)',
                    animation: 'pulse 4s ease-in-out infinite'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES - Glass Background */}
      <section className="py-5 position-relative overflow-hidden">
        {/* Background texture */}
        <div className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(11, 44, 93, 0.03) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
        
        {/* Frosted glass overlay */}
        <div className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(30px) saturate(200%)',
            WebkitBackdropFilter: 'blur(30px) saturate(200%)',
            borderTop: '1px solid rgba(255, 255, 255, 0.5)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.5)'
          }}
        />
        
        {/* Subtle gradient overlay */}
        <div className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'linear-gradient(135deg, rgba(11, 44, 93, 0.02) 0%, rgba(15, 76, 129, 0.02) 100%)',
          }}
        />
        
        <div className="container position-relative z-1 py-5">
          <div className="text-start mb-5">
            <div className="p-4 d-inline-block"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.4)'
              }}
            >
              <h2 className="fw-bold display-4 mb-3" style={{ color: '#0b2c5d' }}>
                Our Core Services
              </h2>
            </div>
            <p className="lead text-danger text-start mt-3">
              We provide comprehensive engineering solutions across multiple industries. 
              Our expertise ensures proactive domination and streamlined solutions for 
              your business needs.
             
            </p>
          </div>

          <div className="row g-4">
            {[
              {
                icon: 'bi-diagram-3',
                title: 'ICT Infrastructure',
                desc: 'Building secure and scalable communication networks.',
                color: '#d90429'
              },
              {
                icon: 'bi-window-stack',
                title: 'Software Solutions',
                desc: 'Developing custom applications that power business growth.',
                color: '#0b2c5d'
              },
              {
                icon: 'bi-motherboard',
                title: 'Electronics & Embedded Systems',
                desc: 'Designing and developing reliable hardware systems.',
                color: '#28a745'
              },
               {
                icon: 'bi-cpu-fill',
                title: 'IoT & Smart Systems',
                desc: 'Connecting devices and transforming data into actionable intelligence.',
                color: '#28a745'
              }
            ].map((s, i) => (
              <div className="col-md-3" key={i}>
                <div
                  className="h-100 p-5 text-center"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
                  }}
                >
                  <div 
                    className="d-inline-flex align-items-center justify-content-center mb-4 p-3"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      border: `2px solid ${s.color}30`,
                      width: '100px',
                      height: '100px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <i
                      className={`bi ${s.icon}`}
                      style={{ 
                        fontSize: '3rem', 
                        color: s.color,
                        filter: `drop-shadow(0 2px 4px ${s.color}30)`
                      }}
                    />
                  </div>
                  <h4 className="fw-bold mb-3" style={{ color: '#0b2c5d' }}>{s.title}</h4>
                  <p className="text-muted mb-0">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='bg-light'>
          <ServicesHomeComponent />
        </div>
      </section>

      {/* <ServicesHomeComponent /> */}

      {/* PROJECTS - Glass Section */}
      <section className="py-5 position-relative">
        <div className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: 'rgba(11, 44, 93, 0.05)',
            backdropFilter: 'blur(0px)',
          }}
        />
        
        <div className="container py-5 position-relative z-1">
          <div className="p-4 p-lg-5 mb-5"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              maxWidth: '600px'
            }}
          >
            <h2 className="display-4 fw-bold" style={{ color: '#0b2c5d' }}>Our Projects</h2>
            <p className="text-muted">Innovative solutions for diverse industries</p>
          </div>
        </div>
      </section>
      <OurApproach />


      {/* WHY CHOOSE US - Glass Background */}
      <section className="py-5 position-relative">
        {/* Glass background effect */}
        <div className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: 'rgba(11, 44, 93, 0.08)',
            backdropFilter: 'blur(25px) saturate(180%)',
            WebkitBackdropFilter: 'blur(25px) saturate(180%)',
            borderTop: '1px solid rgba(255, 255, 255, 0.3)'
          }}
        />
        
        <div className="container position-relative z-1 py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="p-4 p-lg-5 mb-4"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.4)'
                }}
              >
                <h2 className="fw-bold display-4 mb-4" style={{ color: '#0b2c5d' }}>
                  Why Choose Us?
                </h2>
               
              </div>

              <div className="row g-3">
                {[
                  { icon: 'bi-diagram-3', text: 'Integrated end_to_end solution' },
                  { icon: 'bi-lightbulb', text: 'Skilled multidisciplinary engineers' },
                  { icon: 'bi-clock-history', text: 'Scalable system architecture' },
                  { icon: 'bi-rocket-takeoff', text: 'Secure & future-ready technology' }
                ].map((item, i) => (
                  <div className="col-md-6" key={i}>
                    <div className="d-flex align-items-start p-4 h-100"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
                        e.currentTarget.style.transform = 'translateX(5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <i
                        className={`bi ${item.icon} me-3 shrink-0`}
                        style={{ 
                          fontSize: '1.8rem', 
                          color: '#d90429',
                          filter: 'drop-shadow(0 2px 3px rgba(217, 4, 41, 0.2))'
                        }}
                      />
                      <span className="fw-medium" style={{ color: '#0b2c5d' }}>{item.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-6 text-center">
              <div className="position-relative">
                <div className="p-5"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(25px)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div className="mb-4">
                    <i
                      className="bi bi-building-gear"
                      style={{ 
                        fontSize: '100px', 
                        color: '#0b2c5d',
                        filter: 'drop-shadow(0 5px 15px rgba(11, 44, 93, 0.2))'
                      }}
                    />
                  </div>
                  <h4 className="fw-bold mb-3" style={{ color: '#0b2c5d' }}>
                    Industry Certified
                  </h4>
                  <p className="text-muted mb-0">
                    Our solutions meet international standards including ISO 
                     and local regulatory compliance.
                  </p>
                </div>
                
                {/* Decorative elements */}
                <div className="position-absolute top-0 start-0 translate-middle"
                  style={{
                    width: '200px',
                    height: '200px',
                    background: 'radial-gradient(circle, rgba(217, 4, 41, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(20px)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS - Glass Cards */}
      <section className="py-5 position-relative">
        <div className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'linear-gradient(135deg, rgba(11, 93, 44, 0.7), rgba(15, 129, 76, 0.7))',
            backdropFilter: 'blur(10px)'
          }}
        />
        
        <div className="container position-relative z-1">
          <div className="row text-center g-4">
            {[
              { number: '2+', label: 'Years Experience', icon: 'bi-calendar-check' },
              { number: '20+', label: 'Installed Systems', icon: 'bi-gear-wide-connected' },
              { number: '100%', label: 'Safety Compliance', icon: 'bi-shield-check' },
              { number: '24/7', label: 'Support Availability', icon: 'bi-clock' }
            ].map((stat, i) => (
              <div className="col-6 col-md-3" key={i}>
                <div className="p-4 p-lg-5 h-100"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(15px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                    e.currentTarget.style.transform = 'translateY(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <i
                    className={`bi ${stat.icon} mb-3`}
                    style={{ 
                      fontSize: '2.5rem', 
                      color: '#ff6b6b',
                      filter: 'drop-shadow(0 0 10px rgba(255, 107, 107, 0.3))'
                    }}
                  />
                  <h2 className="fw-bold mb-2">{stat.number}</h2>
                  <p className="mb-0 opacity-90 fw-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HomeBlogComponent />

     
      {/* CTA - Glass Effect */}
      <section className="py-5 position-relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'radial-gradient(circle at 70% 30%, rgba(217, 4, 41, 0.15) 0%, rgba(11, 44, 93, 0.1) 50%, transparent 100%)',
          }}
        />
        
        {/* Frosted glass overlay */}
        <div className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: 'rgba(217, 4, 41, 0.08)',
            backdropFilter: 'blur(40px) saturate(200%)',
            WebkitBackdropFilter: 'blur(40px) saturate(200%)',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        />
        
        <div className="container text-center position-relative z-1 py-5">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="p-5 p-lg-6"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(30px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Glass refraction effect */}
                <div className="position-absolute top-0 start-0 w-100 h-100"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                    transform: 'skewX(-15deg)',
                    animation: 'shimmer 3s infinite'
                  }}
                />
                
                <div className="position-relative z-1">
                  <h2 className="fw-bold display-4 mb-4" style={{ color: '#0b2c5d' }}>
                    Need Tech Solutions?
                  </h2>
                  <p className="lead text-muted mb-4 mx-auto" style={{ maxWidth: '700px' }}>
                    Talk to our certified engineers today and get a customized tech solution tailored to your needs.
                  </p>
                  
                  <div className="d-flex flex-wrap justify-content-center gap-3">
                    {[
                      { icon: 'bi-telephone-outbound', text: 'Call Now', variant: 'danger', outline: false, link: "/call" },
                      { icon: 'bi-envelope', text: 'Email Us', variant: 'primary', outline: true, link: "/contact" },
                      { icon: 'bi-chat-left-text', text: 'Live Chat', variant: 'dark', outline: true, link: "/chat" }
                    ].map((btn, i) => (
                      <button 
                        key={i}
                        className={`btn ${btn.outline ? 'btn-outline-' + btn.variant : 'btn-' + btn.variant} btn-lg px-5 py-3 fw-bold`}
                        onClick={() => Navigate(btn.link)}
                        style={{
                          backdropFilter: 'blur(10px)',
                          border: btn.outline ? '2px solid' : 'none',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        
                      >
                        <i className={`bi ${btn.icon} me-2`}></i>
                        {btn.text}
                      </button>
                    ))}
                  </div>
                  


                  <div className="mt-5 pt-3">
                    <div className="d-inline-flex align-items-center gap-3 p-3"
                      style={{
                        backgroundColor: 'rgba(11, 44, 93, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(11, 44, 93, 0.2)'
                      }}
                    >
                      <i className="bi bi-info-circle fs-5" style={{ color: '#0b2c5d' }}></i>
                      <small className="text-muted fw-medium">
                        Average response time: <strong className="text-dark">15 minutes</strong>
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.5; }
          100% { opacity: 0.8; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(100%) skewX(-15deg); }
        }
        
        @media (max-width: 768px) {
          .position-fixed {
            background-attachment: scroll !important;
          }
          
          .display-5, .display-4 {
            font-size: 2rem !important;
          }
          
          .btn-lg {
            width: 100% !important;
            margin-bottom: 10px !important;
          }
          
          .d-flex.gap-3 {
            flex-direction: column !important;
            gap: 10px !important;
          }
          
          .col-6 {
            margin-bottom: 20px !important;
          }
          
          .p-5 {
            padding: 2rem !important;
          }
        }
        
        @media (max-width: 576px) {
          .display-5, .display-4 {
            font-size: 1.75rem !important;
          }
          
          .lead {
            font-size: 1rem !important;
          }
        }
      `}</style>
    </>
  );
};

export default Home;




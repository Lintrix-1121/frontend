import React from 'react';

const Footer = () => {
  const socialLinks = [
    { icon: <i className="bi bi-facebook"></i>, name: 'Facebook', color: '#1877F2' },
    { icon: <i className="bi bi-twitter"></i>, name: 'Twitter', color: '#1DA1F2' },
    { icon: <i className="bi bi-linkedin"></i>, name: 'LinkedIn', color: '#0A66C2' },
    { icon: <i className="bi bi-instagram"></i>, name: 'Instagram', color: '#E4405F' }
  ];

  const footerLinks = [
    {
      title: "Company",
      links: ["About Us", "Our Team", "Careers", "Blog", "Press"]
    },
    {
      title: "Services",
      links: ["LPG Systems Design", "LPG Systems and Pipeline Installation", "NDT and DT Testing", "LPG Gas Supply and Distribution", "LPG Consultancy Services"]
    },
    {
      title: "Legal",
      links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Disclaimer"]
    }
  ];

  return (
    // <footer className="bg-dark text-white pt-5 pb-4 mt-5">
    <footer
      className="text-white pt-5 pb-4 mt-5"
      style={{
        background: 'linear-gradient(to right, #134e5e, #71b280)'

      }}
    >

      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 mb-4 mb-lg-0">
            <div className="mb-4">
              <h3 className="fw-bold mb-3">
                <span className="text-info">Syner</span>
                <span className="text-white">Phix</span>
              </h3>
              <p className="text-white-50 mb-4">
                Leading the way in innovative safe solutions for your LPG systems. 
                We transform ideas into reality with expert services.
              </p>
            </div>
            
            <div className="d-flex gap-3">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="bg-white bg-opacity-10 p-2 rounded-circle d-flex align-items-center justify-content-center text-white text-decoration-none"
                  style={{ width: '40px', height: '40px', transition: 'all 0.3s' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = social.color;
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          <div className="col-lg-6">
            <div className="row">
              {footerLinks.map((section, index) => (
                <div className="col-md-4 mb-4 mb-md-0" key={index}>
                  <h6 className="fw-bold mb-3 text-white">{section.title}</h6>
                  <ul className="list-unstyled">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex} className="mb-2">
                        <a 
                          href="#" 
                          className="text-white-50 text-decoration-none d-flex align-items-center"
                          style={{ transition: 'all 0.2s' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.paddingLeft = '5px';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                            e.currentTarget.style.paddingLeft = '0';
                          }}
                        >
                          <span className="bg-primary bg-opacity-25 rounded-circle p-1 me-2 d-inline-flex">
                            <span className="bg-primary rounded-circle" style={{ width: '4px', height: '4px' }}></span>
                          </span>
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          
          <div className="col-lg-2">
            <h6 className="fw-bold mb-3 text-white">Contact Info</h6>
            <ul className="list-unstyled">
              <li className="mb-3">
                <a href="#" className="text-white-50 text-decoration-none d-flex align-items-start">
                  <i className="bi bi-geo-alt me-2 mt-1 text-primary"></i>
                  <span>
                    Mall, Kawuku - Nakawuka Road<br />
                    P.O Box _ , Entebbe
                  </span>
                </a>
              </li>
              <li className="mb-3">
                <a href="tel:+256702059944" className="text-white-50 text-decoration-none d-flex align-items-center">
                  <i className="bi bi-telephone me-2 text-primary"></i>
                  +256 786687764
                </a>
              </li>
              <li>
                <a href="mailto:info@qriscorp.com" className="text-white-50 text-decoration-none d-flex align-items-center">
                  <i className="bi bi-envelope me-2 text-primary"></i>
                  info@synerphix.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <hr className="my-4 border-white-50" />
        
        <div className="row align-items-center">
          <div className="col-md-6 mb-3 mb-md-0">
            <p className="text-white-50 mb-0">
              &copy; {new Date().getFullYear()} SynerPhix. All rights reserved.
            </p>
          </div>
          <div className="col-md-6">
            <div className="d-flex flex-wrap gap-3 justify-content-md-end">
              <a href="#" className="text-white-50 text-decoration-none small">Privacy Policy</a>
              <a href="#" className="text-white-50 text-decoration-none small">Terms of Service</a>
              <a href="#" className="text-white-50 text-decoration-none small">Cookie Policy</a>
              <a href="#" className="text-white-50 text-decoration-none small">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

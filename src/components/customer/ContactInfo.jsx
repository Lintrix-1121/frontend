// src/components/customer/ContactInfo.jsx
import React from 'react';

const ContactInfo = () => {
  const contactItems = [
    {
      icon: <i className="bi bi-geo-alt"></i>,
      title: "Address",
      content: "Mall, Kawuku-Nakawuka Road. P.O Box _, Entebbe, Uganda",
      color: '#0d6efd'
    },
    {
      icon: <i className="bi bi-telephone"></i>,
      title: "Phone",
      content: "+256 786687764",
      color: '#28a745'
    },
    {
      icon: <i className="bi bi-envelope"></i>,
      title: "Email",
      content: "info@synerphix.com",
      color: '#dc3545'
    }
  ];

  const businessHours = [
    { day: "Monday - Friday", time: "8:30am to 5pm" },
    { day: "Saturday", time: "Closed" },
    { day: "Sunday", time: "Closed" }
  ];

  return (
    <div 
      className="h-100"
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="p-4 p-lg-5">
        <div className="text-center mb-4">
          <div 
            className="p-3 d-inline-flex mb-3"
            style={{
              background: 'rgba(40, 167, 69, 0.1)',
              border: '1px solid rgba(40, 167, 69, 0.2)'
            }}
          >
            <i className="bi bi-building" style={{ color: '#28a745', fontSize: '1.5rem' }}></i>
          </div>
          <h3 className="fw-bold mb-3" style={{ color: '#28a745' }}>Our Office</h3>
        </div>
        
        {/* Contact Items */}
        <div className="mb-5">
          {contactItems.map((item, index) => (
            <div key={index} className="d-flex align-items-start mb-4">
              <div 
                className="p-3 me-3 d-flex align-items-center justify-content-center"
                style={{
                  width: '50px',
                  height: '50px',
                  background: `${item.color}10`,
                  border: `1px solid ${item.color}20`
                }}
              >
                <span style={{ color: item.color, fontSize: '1.2rem' }}>{item.icon}</span>
              </div>
              <div>
                <h6 className="fw-bold mb-1">{item.title}</h6>
                <p className="text-muted mb-0">{item.content}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Business Hours */}
        <div className="mb-5">
          <h5 className="fw-bold mb-4 d-flex align-items-center">
            <div 
              className="p-2 me-2"
              style={{
                background: 'rgba(255, 193, 7, 0.1)',
                border: '1px solid rgba(255, 193, 7, 0.2)'
              }}
            >
              <i className="bi bi-clock" style={{ color: '#ffc107' }}></i>
            </div>
            Business Hours
          </h5>
          
          <div 
            className="overflow-hidden"
            style={{
              border: '1px solid rgba(0, 0, 0, 0.1)'
            }}
          >
            {businessHours.map((item, index) => (
              <div 
                key={index}
                className="d-flex justify-content-between align-items-center py-3 px-3"
                style={{
                  borderBottom: index < businessHours.length - 1 ? '1px solid rgba(0, 0, 0, 0.05)' : 'none',
                  background: index === 0 ? 'rgba(40, 167, 69, 0.02)' : 'transparent'
                }}
              >
                <div className="d-flex align-items-center">
                  <i className="bi bi-calendar me-2" style={{ color: index === 0 ? '#28a745' : '#6c757d' }}></i>
                  <span className="fw-medium">{item.day}</span>
                </div>
                <span style={{ 
                  color: item.time === 'Closed' ? '#dc3545' : '#28a745',
                  fontWeight: '500'
                }}>
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Get in Touch Card */}
        <div 
          className="p-4"
          style={{
            background: 'rgba(13, 202, 240, 0.05)',
            border: '1px solid rgba(13, 202, 240, 0.1)'
          }}
        >
          <div className="d-flex align-items-start">
            <div 
              className="p-3 me-3"
              style={{
                background: 'rgba(13, 202, 240, 0.1)',
                border: '1px solid rgba(13, 202, 240, 0.2)'
              }}
            >
              <i className="bi bi-chat-square-text" style={{ color: '#0dcaf0', fontSize: '1.2rem' }}></i>
            </div>
            <div>
              <h6 className="fw-bold mb-2" style={{ color: '#0dcaf0' }}>Get in Touch</h6>
              <p className="text-muted small mb-0">
                At SynerPhix, we value open communication and are always eager to connect with you. 
                Whether you have inquiries about our products, services, or collaboration opportunities, 
                our team is ready to assist you.
              </p>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-5 pt-3 border-top" style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}>
          <h6 className="fw-bold mb-3">Follow Us</h6>
          <div className="d-flex gap-2">
            {['facebook', 'twitter', 'linkedin', 'instagram'].map((social) => (
              <a
                key={social}
                href="#"
                className="d-flex align-items-center justify-content-center text-decoration-none"
                style={{
                  width: '40px',
                  height: '40px',
                  background: 'rgba(40, 167, 69, 0.1)',
                  border: '1px solid rgba(40, 167, 69, 0.2)',
                  color: '#28a745',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#28a745';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(40, 167, 69, 0.1)';
                  e.currentTarget.style.color = '#28a745';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <i className={`bi bi-${social}`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;


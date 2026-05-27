// src/components/customer/ContactForm.jsx
import React, { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    
    setTimeout(() => {
      setFormData({
        fullName: '',
        email: '',
        subject: '',
        message: ''
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div 
      className="h-100"
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease'
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
            <i className="bi bi-chat-dots" style={{ color: '#28a745', fontSize: '1.5rem' }}></i>
          </div>
          <h3 className="fw-bold mb-2" style={{ color: '#28a745' }}>Send Us a Message</h3>
          <p className="text-muted mb-4">
            Feel free to ask for details, don't save any questions!
          </p>
        </div>
        
        {submitted && (
          <div 
            className="alert d-flex align-items-center justify-content-between mb-4"
            style={{
              background: 'rgba(40, 167, 69, 0.1)',
              border: '1px solid rgba(40, 167, 69, 0.2)',
              color: '#28a745'
            }}
            role="alert"
          >
            <div className="d-flex align-items-center">
              <i className="bi bi-send me-2"></i>
              <span className="fw-medium">Thank you! Your message has been sent successfully.</span>
            </div>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setSubmitted(false)}
              style={{ fontSize: '0.8rem' }}
            ></button>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="fw-semibold d-flex align-items-center mb-2">
              <i className="bi bi-person me-2" style={{ color: '#28a745' }}></i> 
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="form-control py-3 px-4"
              style={{
                borderRadius: 0,
                border: '1px solid rgba(0, 0, 0, 0.1)',
                background: 'rgba(255, 255, 255, 0.7)'
              }}
              onMouseEnter={(e) => e.target.style.borderColor = '#28a745'}
              onMouseLeave={(e) => e.target.style.borderColor = 'rgba(0, 0, 0, 0.1)'}
            />
          </div>
          
          <div className="mb-4">
            <label className="fw-semibold d-flex align-items-center mb-2">
              <i className="bi bi-envelope me-2" style={{ color: '#28a745' }}></i> 
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="form-control py-3 px-4"
              style={{
                borderRadius: 0,
                border: '1px solid rgba(0, 0, 0, 0.1)',
                background: 'rgba(255, 255, 255, 0.7)'
              }}
              onMouseEnter={(e) => e.target.style.borderColor = '#28a745'}
              onMouseLeave={(e) => e.target.style.borderColor = 'rgba(0, 0, 0, 0.1)'}
            />
          </div>
          
          <div className="mb-4">
            <label className="fw-semibold mb-2">Subject *</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject of your message"
              required
              className="form-control py-3 px-4"
              style={{
                borderRadius: 0,
                border: '1px solid rgba(0, 0, 0, 0.1)',
                background: 'rgba(255, 255, 255, 0.7)'
              }}
              onMouseEnter={(e) => e.target.style.borderColor = '#28a745'}
              onMouseLeave={(e) => e.target.style.borderColor = 'rgba(0, 0, 0, 0.1)'}
            />
          </div>
          
          <div className="mb-5">
            <label className="fw-semibold mb-2">Message *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message here..."
              rows={6}
              required
              className="form-control py-3 px-4"
              style={{
                borderRadius: 0,
                border: '1px solid rgba(0, 0, 0, 0.1)',
                background: 'rgba(255, 255, 255, 0.7)',
                resize: 'vertical'
              }}
              onMouseEnter={(e) => e.target.style.borderColor = '#28a745'}
              onMouseLeave={(e) => e.target.style.borderColor = 'rgba(0, 0, 0, 0.1)'}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn w-100 py-3 fw-bold d-flex align-items-center justify-content-center"
            style={{
              background: 'rgba(40, 167, 69, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontSize: '1.1rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#28a745';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 5px 15px rgba(40, 167, 69, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(40, 167, 69, 0.9)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <i className="bi bi-send me-2"></i> Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;

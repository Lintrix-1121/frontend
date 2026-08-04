import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import useServiceStore from '../../stores/shared/useServiceStore';
import ChooseUs from '../../components/customer/ChooseUs';
import schematic from '../../assets/schematic.jpg'
import RelatedTechnologies from '../../components/customer/RelatedTechnologies';


const ServicesPage = () => {
  const { services, loading, fetchServices } = useServiceStore();

  useEffect(() => {
    fetchServices(false);
  }, []);

  // Helper to build full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;

    const backendUrl = 'https://api.logiphix.tech';
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${backendUrl}/${cleanPath}`;
  };

  if (loading && services.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" style={{ borderRadius: '0' }} />
        <p className="mt-3">Loading services...</p>
      </div>
    );
  }

  const [openFaq, setOpenFaq] = useState(0); //First FAQ open by default

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };
  
  const industries = [
    {
      slug: "agriculture",
      title: "Agriculture",
      icon: "bi bi-tree",
      description:
        "Smart irrigation, farm automation and agricultural monitoring.",
        services: [
          "IoT Smart Systems",
          "Embedded Systems",
          "Software Development",
          "Cloud Solutions"
        ]
    },
    {
      slug: "healthcare",
      title: "Healthcare",
      icon: "bi bi-hospital",
      description:
        "Hospital management systems and medical IoT.",
        services: [
          "Hospital Management Systems",
          "IoT Patient Monitoring",
          "Network Infrastructure"
        ]
    },
    {
      slug: "education",
      title: "Education",
      icon: "bi bi-mortarboard",
      description:
        "E-learning platforms and campus networking.",
        services: [
          "School Management Systems",
          "Campus Networking",
          "Cloud Services"
        ]
    },
    {
      slug: "government",
      title: "Government",
      icon: "bi bi-bank",
      description:
        "Digital transformation and secure ICT infrastructure.",
        services: [
          "ICT Infrastructure",
          "Cybersecurity",
          "Enterprise Software"
        ]
    },
    {
      slug: "manufacturing",
      title: "Manufacturing",
      icon: "bi bi-gear-wide-connected",
      description:
        "Industrial automation and production monitoring.",
        services: [
          "Industrial Automation",
          "PLC Integration",
          "Embedded Systems"
        ]
    },
    {
      slug: "finance",
      title: "Financial Services",
      icon: "bi bi-credit-card-2-front",
      description:
        "Secure software and payment integration.",
        services: [
          "Payment Systems",
          "SACCO & Loan Systems",
          "Cybersecurity",
          "Cloud Infrastructure"
        ]
    }
  ];

  const faqs=[

    {

    question:
    "Do you develop custom software?",

    answer:
    "Yes. We design custom enterprise software, web applications, mobile applications, ERP systems, CRM platforms and cloud solutions tailored to your business."

    },

    {

    question:
    "Do you provide ICT infrastructure installation?",

    answer:
    "Yes. We install structured cabling, enterprise networking, wireless systems, servers, firewalls and data center infrastructure."

    },

    {

    question:
    "Can SynerPhix build IoT systems?",

    answer:
    "Yes. We design smart sensors, embedded systems, industrial monitoring systems, smart agriculture solutions and IoT dashboards."

    },

    {

    question:
    "Do you work outside Kampala?",

    answer:
    "Yes. We serve clients throughout Uganda and East Africa."

    },

    {

    question:
    "How do I request a quotation?",

    answer:
    "Simply contact us through our website, email or telephone and our engineers will schedule a consultation."
  }

  ];

  return (
    <>
      <Helmet>
      <title>
        Engineering Services | ICT Infrastructure, Software Development & IoT | SynerPhix Uganda
      </title>
      <meta
        name="description"
        content="Explore SynerPhix engineering services including ICT Infrastructure, Software Development, Electronics Engineering, Embedded Systems, Industrial Automation, IoT Smart Systems and IT Consultancy across Uganda."
      />
      <meta
        name="keywords"
        content="Software Development Uganda, ICT Infrastructure Uganda, IoT Uganda, Electronics Engineering Uganda, Embedded Systems Uganda"
      />
      <link
        rel="canonical"
        href="https://logiphix.tech/services"
      />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context":"https://schema.org",
          "@type":"OfferCatalog",
          "name":"Engineering Services",
          "provider":{
          "@id":"https://logiphix.tech/#business"
          },
          "itemListElement":
          services.map(service=>({
            "@type":"Offer",
            "itemOffered":{
            "@type":"Service",
            "name":service.title,
            "description":service.description,
            "url":`https://logiphix.tech/services/${service.serviceId}`
            }})
          )
        })}        
      </script>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context":"https://schema.org",
          "@type":"FAQPage",
          mainEntity:faqs.map(faq=>({
          "@type":"Question",
          name:faq.question,
          acceptedAnswer:{
          "@type":"Answer",
          text:faq.answer
          }
          }))
        })}
      </script>

      </Helmet>

      <div style={{
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    }}>
      <div className="container py-5 min-vh-100">
        {/* Section Header with Glass Morphism */}
        
        <div className="text-left mb-5" style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.0)',
          padding: '2.5rem',
          borderRadius: '0'
        }}>
          <h2 className="display-4 fw-bold text-dark mb-3">
            Engineering services in <span style={{ 
              color: 'rgba(13, 110, 253, 0.9)',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>Uganda</span>
          </h2>
          <p className="mt-3 mb-0" style={{ 
            // maxWidth: '720px',
            color: 'rgba(0, 0, 0, 0.7)',
            fontSize: '1.1rem',
            lineHeight: '1.6'
          }}>
            SynerPhix delivers innovative technology solutions that helps businesses, organizations and communities thrive in
             a rapidly evolving digital world. Our expertise spans <Link to ="">ICT infrastructure</Link>, <Link to ="">software development</Link>, <Link to ="">electronics engineering</Link>, 
             and <Link to ="">IoT & smart connected systems</Link> enabling us to provide end-to-end solutions tailored to your unique needs.
          </p>
        </div>

        {/* Services Grid with Glass Morphism */}
        <div className="row g-4">
          {services.map((service) => {
            const imageUrl = getImageUrl(service.imageUrl);

            return (
              <article
                key={service.serviceId}
                className="col-12 col-md-6 col-lg-4"
                itemScope
                itemType='https://schema.org/Service'
              >
                <div className="h-100" style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '0',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  overflow: 'hidden'
                }}>
                  {/* Image Container - No Border Radius */}
                  <div style={{ 
                    height: '220px', 
                    overflow: 'hidden',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '0'
                  }}>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        loading='lazy'
                        alt={service.title}
                        className="w-100 h-100"
                        style={{ 
                          objectFit: 'cover',
                          borderRadius: '0',
                          transition: 'transform 0.5s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    ) : (
                      <div className="h-100 d-flex align-items-center justify-content-center" style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '0'
                      }}>
                        <i className="bi bi-image" style={{ 
                          fontSize: '2rem',
                          color: 'rgba(0, 0, 0, 0.3)'
                        }} />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 d-flex flex-column text-center"
                  itemProp='name' 
                  style={{ height: 'calc(100% - 220px)' }}>
                    <h5 className="fw-semibold mb-3 text-dark" style={{
                      fontSize: '1.25rem',
                      minHeight: '3rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {service.title}
                    </h5>

                    <p className="mb-4 grow" 
                    itemProp='description'
                    style={{
                      color: 'rgba(0, 0, 0, 0.7)',
                      lineHeight: '1.6',
                      fontSize: '0.95rem'
                    }}>
                      {service.description
                        ? (service.description.length > 120 
                            ? service.description.substring(0, 120) + '...'
                            : service.description)
                        : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
                    </p>

                    {/* Button */}
                    <div className="mt-auto">
                      <Link
                        to={`/services/${service.serviceId}`}
                        className="btn w-100"
                        style={{
                          background: 'green',
                          backdropFilter: 'blur(5px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          borderRadius: '0',
                          padding: '0.75rem',
                          fontWeight: '500',
                          transition: 'all 0.3s ease',
                          textDecoration: 'none',
                          display: 'block'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(13, 110, 253, 0.9)';
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 4px 12px rgba(13, 110, 253, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'green';
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Empty State */}
        {services.length === 0 && !loading && (
          <div className="text-center py-5" style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '0',
            padding: '3rem'
          }}>
            <i className="bi bi-inboxes display-1" style={{ 
              color: 'rgba(0, 0, 0, 0.2)',
              marginBottom: '1rem'
            }}></i>
            <h4 className="text-dark mb-3">No Services Available</h4>
            <p className="text-muted mb-0">
              Check back later for our service offerings.
            </p>
          </div>
        )}
      </div>

      <RelatedTechnologies />
      <section className="container py-5">
        <h2 className="mb-5 text-center">
          Industries We Serve
        </h2>
        <div className="row">
          {industries.map(industry=>(
            <div
            className="col-lg-4 mb-4"
            key={industry.slug}>
              <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h4 className="d-flex align-items-center mb-3">
                  <i
                    className={`${industry.icon} me-2 text-primary`}
                    style={{ fontSize: "1.8rem" }}
                  ></i>
                  {industry.title}
                </h4>
                  <p>
                    {industry.description}
                  </p>
                <h6>
                  Popular Services
                </h6>
                <ul>
                  {industry.services.map(service=>(
                  <li key={service}>
                  {service}
                </li>
                ))}
                </ul>
                  <Link
                  to={`/industries/${industry.slug}`}
                  >
                  Learn More →
                </Link>
              </div>
            </div>
          </div>
          ))}
        </div>

      </section>

      {/* ChooseUs Component */}
      <ChooseUs />


      <section className="container py-5">
        <h2 className="mb-4">Frequently Asked Questions</h2>

        <div className="accordion">
          {faqs.map((faq, index) => (
            <div className="accordion-item" key={index}>
              <h2 className="accordion-header">
                <button
                  type="button"
                  className={`accordion-button ${
                    openFaq === index ? "" : "collapsed"
                  }`}
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openFaq === index}
                >
                  {faq.question}
                </button>
              </h2>

              <div
                className={`accordion-collapse collapse ${
                  openFaq === index ? "show" : ""
                }`}
              >
                <div className="accordion-body">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section
        className="py-5 text-center text-white"
        style={{
        background:"#0d6efd"
        }}
        >
          <div className="container">
            <h2>
            Ready to Transform Your Business?
            </h2>
            <p className="lead">
            Talk to our engineers about your next software,
            network,
            electronics or IoT project.
            </p>
            <div className="mt-4">
              <Link
                to="/contact"
                className="btn btn-light btn-lg me-3">
                Request Consultation
              </Link>
              <Link
                to="/quote"
                className="btn btn-outline-light btn-lg">
                Get Free Quote
              </Link>
            </div>
          </div>
        </section>
    </div>

...
    </>
    
  );
};

export default ServicesPage;




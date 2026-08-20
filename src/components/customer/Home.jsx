import React, { useState, useEffect} from 'react';
import { Helmet } from 'react-helmet-async';
import ServiceSlideshow from './ServicesSlideShow';
import schematic from '../../assets/schematic.jpg';
import ServicesHomeComponent from './ServiceComponent';
import HomeBlogComponent from './BlogComponent';
import OurApproach from './OurApproach';
import ContactPage from '../../views/customer/ContactPage';
import { Route, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ProductsCarousel from './ProductsCarousel';
import { Import } from 'lucide-react';
import useCartStore from '../../stores/customer/useCartStore';
import useProductStore from '../../stores/customer/useProductStore';
import ProductController from '../../controllers/customer/ProductController';


const Home = () => {
  const backgroundImage = schematic; 
  const cartStore = useCartStore;
  const productStore = useProductStore();
  const navigate = useNavigate();

  const [controller] = useState(
      () => new ProductController(
          productStore,
          //cartStore
      )
    );
    useEffect(()=>{
      controller.initializeProductsPage();
  },[controller]);

  const [openFaq, setOpenFaq] = useState(1);

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  
  return (
    <>
    <Helmet>
        <title>
            SynerPhix | ICT Infrastructure, Software Development, Electronics & IoT Solutions
        </title>
        <meta
            name="description"
            content="SynerPhix provides ICT Infrastructure, Software Engineering, Electronics Design, Embedded Systems, IoT Smart Solutions, Industrial Automation and Technology Consultancy."
        />
        <meta
            name="keywords"
            content="ICT Infrastructure Uganda, Software Development Uganda, Embedded Systems, IoT, Electronics Engineering, Industrial Automation, Smart Systems"
        />
        <link
            rel="canonical"
            href="https://logiphix.tech/"
        />
        <meta
          property="og:type"
          content="website"
        />
        <meta
          property="og:title"
          content="SynerPhix Engineering"
        />
        <meta
          property="og:description"
          content="Engineering Intelligent Systems for a Connected Future."
        />
        <meta
          property="og:url"
          content="https://logiphix.tech"
        />
        <meta
          property="og:image"
          content="https://logiphix.tech/images/hero.jpg"
        />
        <meta
          name="twitter:card"
          content="summary_large_image"
        />
        <meta
          name="twitter:title"
          content="SynerPhix"
        />
        <meta
          name="twitter:description"
          content="Engineering Intelligent Systems for a Connected Future."
        />
        <meta
          name="twitter:image"
          content="https://logiphix.tech/images/hero.jpg"
        />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context":"https://schema.org",
            "@type": [
              "ProfessionalService",
              "Organization",
            ],
            "name":"SynerPhix",
            "url":"https://logiphix.tech",
            "logo":"https://logiphix.tech/logo.png",
            "description":"ICT Infrastructure, Software Development, Electronics Engineering and IoT Solutions.",
            "email":"synerphixtechnologies@gmail.com",
            "telephone":"+256708849489"
          })}
        </script>

        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": "https://logiphix.tech/#business",
          "name": "SynerPhix",
          "description":
            "SynerPhix is a Ugandan technology company specializing in ICT infrastructure, software development, electronics engineering, embedded systems, IoT solutions, industrial automation and IT consultancy.",
          "url": "https://logiphix.tech",
          "telephone": "+256700123456",
          "email": "synerphixtechnologies@gmail.com",
          "image": [
            "https://logiphix.tech/logo.png",
            "https://logiphix.tech/images/office.jpg"
          ],
          "logo": "https://logiphix.tech/logo.png",
          "priceRange": "$$",
          "currenciesAccepted": "UGX",
          "paymentAccepted": [
            "Cash",
            "Bank Transfer",
            "Visa",
            "MasterCard",
            "Mobile Money"
          ],
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Plot XX, Example Road",
            "addressLocality": "Kampala",
            "addressRegion": "Central Region",
            "postalCode": "256",
            "addressCountry": "UG"
          },

          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 0.347596,
            "longitude": 32.582520
          },

          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
              ],
              "opens": "08:00",
              "closes": "17:00"
            }
          ],

          "areaServed": [
            {
              "@type": "Country",
              "name": "Uganda"
            },
            {
              "@type": "AdministrativeArea",
              "name": "East Africa"
            }
          ],

          "sameAs": [
            "https://www.facebook.com/synerphix",
            "https://www.linkedin.com/company/synerphix",
            "https://x.com/synerphix",
            "https://github.com/Lintrix-1121"
          ],

          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Engineering Services",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "ICT Infrastructure"
                }
              },

              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Software Development"
                }
              },

              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Embedded Systems"
                }
              },

              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Electronics Engineering"
                }
              },

              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "IoT Smart Systems"
                }
              }
            ]
          }
        })}
        </script>

        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What services does SynerPhix provide?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "SynerPhix provides ICT infrastructure, software development, electronics engineering, embedded systems, IoT smart solutions, industrial automation, cloud solutions and IT consultancy."
              }
            },
            {
              "@type": "Question",
              "name": "Do you build custom software?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. We develop custom web applications, mobile apps, enterprise systems, ERP solutions and AI-powered software."
              }
            }
          ]
        })}
        </script>

    </Helmet>

...
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
      
      {/* HERO SECTION with Glass Effect */}
      <section className="py-5 text-white position-relative overflow-hidden">
        {/* Animated background gradient */}
        <section className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'radial-gradient(circle at 30% 20%, rgba(11, 44, 93, 0.3) 0%, rgba(15, 76, 129, 0.2) 25%, transparent 50%)',
            animation: 'pulse 10s ease-in-out infinite alternate'
          }}
        />
        
        {/* Glass overlay */}
        <section className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: 'rgba(11, 44, 93, 0.6)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        />
        
        <main className="container py-5 position-relative z-1">
          <section className="row align-items-center">
            <section className="p-4 p-lg-5"
                style={{
                  //backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.0)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
              >
                <h2 className="fw-bold mb-4">
                  Engineering Intelligent Systems for a Connected Future with Expertise in 
                  <Link style={{ textDecoration: 'none' }} to =""> ICT Infrastructure</Link> • <Link  style={{ textDecoration: 'none' }} to ="">Custom Software Development</Link> • 
                  <Link style={{ textDecoration: 'none' }} to =""> Embedded Systems</Link> • <Link style={{ textDecoration: 'none' }} to ="" >Industrial Automation</Link> • <Link style={{ textDecoration: 'none' }} to ="">IoT Smart Solutions</Link>.
                </h2>
                <p className="lead mb-4 opacity-90">
                  SynerPhix is a technology engineering company providing ICT infrastructure 
                  deployment, enterprise software development, electronics engineering, embedded systems, 
                  IoT smart solutions, industrial automation and professional IT consultancy throughout Uganda and East Africa.
                </p>
                
              </section>
            {/* <section className="col-lg-6">
              
            </section> */}

            <section className="col-lg-6 text-center mt-5 mt-lg-0">
              <section className="position-relative">                
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
              </section>
            </section>
                <section className="container py-5">
                  <h2 className="mb-4">Frequently Asked Questions</h2>

                  <div className="accordion">

                    {/* FAQ 1 */}
                    <div className="accordion-item">
                      <h2 className="accordion-header">
                        <button
                          type="button"
                          className={`accordion-button ${openFaq === 1 ? '' : 'collapsed'}`}
                          onClick={() => toggleFaq(1)}
                        >
                          What services does SynerPhix provide?
                        </button>
                      </h2>

                      <div
                        className={`accordion-collapse collapse ${
                          openFaq === 1 ? 'show' : ''
                        }`}
                      >
                        <div className="accordion-body">
                          We provide ICT Infrastructure, Software Development,
                          Electronics Engineering, Embedded Systems, Industrial
                          Automation, IoT Smart Systems, Cloud Solutions,
                          IT Consultancy, and Electronic Components Supply.
                        </div>
                      </div>
                    </div>

                    {/* FAQ 2 */}
                    <div className="accordion-item">
                      <h2 className="accordion-header">
                        <button
                          type="button"
                          className={`accordion-button ${openFaq === 2 ? '' : 'collapsed'}`}
                          onClick={() => toggleFaq(2)}
                        >
                          Do you build custom software?
                        </button>
                      </h2>

                      <div
                        className={`accordion-collapse collapse ${
                          openFaq === 2 ? 'show' : ''
                        }`}
                      >
                        <div className="accordion-body">
                          Yes. We design and develop web applications, mobile apps,
                          enterprise software, ERP systems, AI solutions, and cloud
                          platforms.
                        </div>
                      </div>
                    </div>

                    {/* FAQ 3 */}
                    <div className="accordion-item">
                      <h2 className="accordion-header">
                        <button
                          type="button"
                          className={`accordion-button ${openFaq === 3 ? '' : 'collapsed'}`}
                          onClick={() => toggleFaq(3)}
                        >
                          Do you provide IoT and embedded systems?
                        </button>
                      </h2>

                      <div
                        className={`accordion-collapse collapse ${
                          openFaq === 3 ? 'show' : ''
                        }`}
                      >
                        <div className="accordion-body">
                          Yes. We develop smart sensors, industrial monitoring
                          systems, automation platforms, and custom embedded
                          electronics.
                        </div>
                      </div>
                    </div>

                  </div>
                </section>
                </section>
              </main>
            </section>
      <section >

      
      </section>

      {/* SERVICES - Glass Background */}
      <section className="py-5 position-relative overflow-hidden">
        {/* Background texture */}
        <section className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(11, 44, 93, 0.03) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
        
        {/* Frosted glass overlay */}
        <section className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(30px) saturate(200%)',
            WebkitBackdropFilter: 'blur(30px) saturate(200%)',
            borderTop: '1px solid rgba(255, 255, 255, 0.5)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.5)'
          }}
        />
        
        {/* Subtle gradient overlay */}
        <section className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'linear-gradient(135deg, rgba(11, 44, 93, 0.02) 0%, rgba(15, 76, 129, 0.02) 100%)',
          }}
        />
        
        <section className="container position-relative z-1 py-5">
          <section className="text-start mb-5">
            
             <h2 className="fw-bold display-4 mb-3" style={{ color: '#0b2c5d' }}>
                Our Core Services
              </h2>
            <p className="lead text-danger text-start mt-3">
              We provide comprehensive engineering solutions across multiple industries. 
              Our expertise ensures proactive domination and streamlined solutions for 
              your business needs.
             
            </p>
          </section>

          {/* <div className="row g-4">
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
        <div className='bg-light'> */}
          <ServicesHomeComponent />
        </section>
      </section>

      {/* PROJECTS - Glass Section */}
      <section className="py-5 position-relative">
        <section className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: 'rgba(11, 44, 93, 0.05)',
            backdropFilter: 'blur(0px)',
          }}
        />
        
        <section className="container py-5 position-relative z-1">
          <section className="p-4 p-lg-5 mb-5"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              maxWidth: '600px'
            }}
          >
            <h2 className="display-4 fw-bold" style={{ color: '#0b2c5d' }}>Our Projects</h2>
            <p className="text-muted">Innovative solutions for diverse industries</p>
          </section>
        </section>
        <section className="container py-4">
      {/* Just import the carousel – it fetches its own products */}
        <ProductsCarousel
          products={productStore.products}
      />
        </section>

      </section>
      <OurApproach />


      {/* WHY CHOOSE US - Glass Background */}
      <section className="py-5 position-relative">
        {/* Glass background effect */}
        <section className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: 'rgba(11, 44, 93, 0.08)',
            backdropFilter: 'blur(25px) saturate(180%)',
            WebkitBackdropFilter: 'blur(25px) saturate(180%)',
            borderTop: '1px solid rgba(255, 255, 255, 0.3)'
          }}
        />
        
        <section className="container position-relative z-1 py-5">
          <section className="row align-items-center">
            <section className="col-lg-6 mb-4 mb-lg-0">
              <section className="p-4 p-lg-5 mb-4"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.4)'
                }}
              >
                <h2 className="fw-bold display-4 mb-4" style={{ color: '#0b2c5d' }}>
                  Why Choose Us?
                </h2>
               
              </section>

              <section className="row g-3">
                {[
                  { icon: 'bi-diagram-3', text: 'Integrated end_to_end solution' },
                  { icon: 'bi-lightbulb', text: 'Skilled multidisciplinary engineers' },
                  { icon: 'bi-clock-history', text: 'Scalable system architecture' },
                  { icon: 'bi-rocket-takeoff', text: 'Secure & future-ready technology' }
                ].map((item, i) => (
                  <section className="col-md-6" key={i}>
                    <section className="d-flex align-items-start p-4 h-100"
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
                    </section>
                  </section>
                ))}
              </section>
            </section>

            <section className="col-lg-6 text-center">
              <section className="position-relative">
                <section className="p-5"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(25px)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <section className="mb-4">
                    <i
                      className="bi bi-building-gear"
                      style={{ 
                        fontSize: '100px', 
                        color: '#0b2c5d',
                        filter: 'drop-shadow(0 5px 15px rgba(11, 44, 93, 0.2))'
                      }}
                    />
                  </section>
                  <h4 className="fw-bold mb-3" style={{ color: '#0b2c5d' }}>
                    Industry Certified
                  </h4>
                  <p className="text-muted mb-0">
                    Our solutions meet international standards including ISO 
                     and local regulatory compliance.
                  </p>
                </section>
                
                {/* Decorative elements */}
                <section className="position-absolute top-0 start-0 translate-middle"
                  style={{
                    width: '200px',
                    height: '200px',
                    background: 'radial-gradient(circle, rgba(217, 4, 41, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(20px)'
                  }}
                />
              </section>
            </section>
          </section>
        </section>
      </section>

      {/* STATS - Glass Cards */}
      <section className="py-5 position-relative">
        <section className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'linear-gradient(135deg, rgba(11, 93, 44, 0.7), rgba(15, 129, 76, 0.7))',
            backdropFilter: 'blur(10px)'
          }}
        />
        
        <section className="container position-relative z-1">
          <section className="row text-center g-4">
            {[
              { number: '100%', label: 'Quality Assurance', icon: 'bi-calendar-check' },
              { number: '99+', label: 'Installed Systems', icon: 'bi-gear-wide-connected' },
              { number: '100%', label: 'Safety Compliance', icon: 'bi-shield-check' },
              { number: '24/7', label: 'Support Availability', icon: 'bi-clock' }
            ].map((stat, i) => (
              <section className="col-6 col-md-3" key={i}>
                <section className="p-4 p-lg-5 h-100"
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
                </section>
              </section>
            ))}
          </section>
        </section>
      </section>

      <HomeBlogComponent />

     
      {/* CTA - Glass Effect */}
      <section className="py-5 position-relative overflow-hidden">
        {/* Animated background gradient */}
        <section className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'radial-gradient(circle at 70% 30%, rgba(217, 4, 41, 0.15) 0%, rgba(11, 44, 93, 0.1) 50%, transparent 100%)',
          }}
        />
        
        {/* Frosted glass overlay */}
        <section className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: 'rgba(217, 4, 41, 0.08)',
            backdropFilter: 'blur(40px) saturate(200%)',
            WebkitBackdropFilter: 'blur(40px) saturate(200%)',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        />
        
        <section className="container text-center position-relative z-1 py-5">
          <section className="row justify-content-center">
            <section className="col-lg-10">
              <section className="p-5 p-lg-6"
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
                <section className="position-absolute top-0 start-0 w-100 h-100"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                    transform: 'skewX(-15deg)',
                    animation: 'shimmer 3s infinite'
                  }}
                />
                
                <section className="position-relative z-1">
                  <h2 className="fw-bold display-4 mb-4" style={{ color: '#0b2c5d' }}>
                    Need Tech Solutions?
                  </h2>
                  <p className="lead text-muted mb-4 mx-auto" style={{ maxWidth: '700px' }}>
                    Talk to our certified engineers today and get a customized tech solution tailored to your needs.
                  </p>
                  
                  <section className="d-flex flex-wrap justify-content-center gap-3">
                    {[
                      { icon: 'bi-telephone-outbound', text: 'Request ICT Consultation', variant: 'danger', outline: false, link: "/call" },
                      { icon: 'bi-envelope', text: 'Contact Software Engineers', variant: 'primary', outline: true, link: "contactform" },
                      { icon: 'bi-chat-left-text', text: 'Talk to an IoT Expert', variant: 'dark', outline: true, link: "contactform" }
                    ].map((btn, i) => (
                      <button 
                        key={i}
                        className={`btn ${btn.outline ? 'btn-outline-' + btn.variant : 'btn-' + btn.variant} btn-lg px-5 py-3 fw-bold`}
                        onClick={() => navigate(btn.link)}
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
                  </section>
                  


                  <section className="mt-5 pt-3">
                    <section className="d-inline-flex align-items-center gap-3 p-3"
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
                    </section>
                  </section>
                </section>
              </section>
            </section>
          </section>
        </section>
      </section>

      {/* CSS Animations */}
      <style >{`
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




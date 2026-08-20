import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react";
import useCartStore from "../stores/customer/useCartStore";
import logo from "../assets/logo/logo.png";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();

  const { cart, isLoading, initialize, isInitialized } = useCartStore();

  useEffect(() => {
    if (!isInitialized) initialize();
  }, [initialize, isInitialized]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1200) {
        setIsMobileMenuOpen(false);
        document.body.style.overflow = "unset";
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  const mainNavLinks = [
    { name: "Home", path: "/home" },
    { name: "Shop", path: "/shop" },
    { name: "Services", path: "/services" },
    {
      name: "Our Products",
      path: "/products",
      hasDropdown: true,
      dropdownItems: [
        { name: "Crestune Music", path: "https://crestune.logiphix.tech" },
        { name: "Digital School", path: "https://schmgt.logiphix.tech" },
        { name: "Net-SACCO", path: "https://sacci.logiphix.tech" }
      ]
    },
    { name: "Projects", path: "/projects" },
    { name: "Blogs", path: "/blog/all" },
    { name: "Careers", path: "/careers" },
    { name: "Partners", path: "/partners" },
    {
      name: "About",
      path: "/about",
      hasDropdown: true,
      dropdownItems: [
        { name: "About Us", path: "/about" },
        { name: "Our Projects", path: "/projects" },
        { name: "Our Team", path: "/team" }
      ]
    },
    { name: "Contact", path: "/contact" }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setOpenDropdown(null);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'unset';
    setOpenDropdown(null);
  };

  const isActiveLink = (path) => location.pathname === path;
  const isDropdownActive = (dropdownItems) =>
    dropdownItems.some(item => location.pathname === item.path);

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  return (
    <header
      className="sticky-top"
      style={{
        background: 'linear-gradient(to right, #134e5e, #71b280)',
        zIndex: 1030,
        boxShadow: isScrolled ? '0 10px 30px rgba(0,0,0,0.15)' : '0 2px 10px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
      }}
    >
      <div className="container">
        <div
          className="d-flex justify-content-between align-items-center py-2"
          style={{ minHeight: "72px", gap: "1rem" }}
        >
          {/* Logo + Desktop Nav */}
          <div className="d-flex align-items-center">
            <button
              className="d-xl-none btn btn-link text-white p-0 me-3"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
              style={{ fontSize: '1.5rem' }}
            >
              {isMobileMenuOpen ? (
                <X style={{ width: "clamp(20px,2vw,24px)", height: "clamp(20px,2vw,24px)" }} />
              ) : (
                <Menu style={{ width: "clamp(20px,2vw,24px)", height: "clamp(20px,2vw,24px)" }} />
              )}
            </button>

            <Link to="/home" className="shrink-0">
              <img
                src={logo}
                alt="SynerPhix"
                className="img-fluid"
                style={{
                  height: "clamp(42px,6vw,64px)",
                  width: "auto",
                  maxWidth: "100%"
                }}
              />
            </Link>

            <nav
              className="d-none d-xl-flex align-items-center"
              style={{
                gap: "1rem",
                whiteSpace: "nowrap",
                flexShrink: 0
              }}
            >
              {mainNavLinks.map((link) => (
                <div key={link.name} className="position-relative dropdown-container">
                  {link.hasDropdown ? (
                    <>
                      <button
                        className="d-flex align-items-center gap-1 bg-transparent border-0 fw-medium"
                        onClick={() => toggleDropdown(link.name)}
                        onMouseEnter={() => {
                          if (window.innerWidth >= 1200) setOpenDropdown(link.name);
                        }}
                        style={{
                          color: isDropdownActive(link.dropdownItems) ? '#ffc107' : 'white',
                          fontSize: "clamp(.82rem,.9vw,.95rem)",
                          paddingBottom: '4px',
                          borderBottom: isDropdownActive(link.dropdownItems) ? '2px solid #ffc107' : '2px solid transparent',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer'
                        }}
                      >
                        {link.name}
                        {/* <ChevronDown
                          style={{
                            width: "clamp(20px,2vw,24px)",
                            height: "clamp(20px,2vw,24px)",
                            transition: 'transform 0.2s ease',
                            transform: openDropdown === link.name ? 'rotate(180deg)' : 'rotate(0)'
                          }}
                        /> */}
                      </button>

                      {openDropdown === link.name && (
                        <div
                          className="position-absolute top-100 mt-2"
                          style={{
                            left: 0,
                            right: "auto",
                            minWidth: 220,
                            maxWidth: 280,
                            zIndex: 1060,
                            pointerEvents: 'auto'
                          }}
                          onMouseLeave={() => setOpenDropdown(null)}
                        >
                          <div
                            className="py-2"
                            style={{
                              background: 'rgba(255, 255, 255, 0.98)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(40, 167, 69, 0.2)',
                              boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                            }}
                          >
                            {link.dropdownItems.map((item) => (
                              <Link
                                key={item.name}
                                to={item.path}
                                className="d-block text-decoration-none px-4 py-2"
                                style={{
                                  color: isActiveLink(item.path) ? '#28a745' : '#495057',
                                  background: isActiveLink(item.path) ? 'rgba(40, 167, 69, 0.05)' : 'transparent',
                                  borderLeft: isActiveLink(item.path) ? '3px solid #28a745' : '3px solid transparent',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={link.path}
                      className="text-decoration-none fw-medium"
                      style={{
                        color: isActiveLink(link.path) ? '#ffc107' : 'white',
                        fontSize: "clamp(.82rem,.9vw,.95rem)",
                        paddingBottom: '4px',
                        borderBottom: isActiveLink(link.path) ? '2px solid #ffc107' : '2px solid transparent',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Right side icons */}
          <div
            className="d-flex align-items-center gap-3 gap-md-4"
            style={{ flexShrink: 0 }}
          >
            <div className="d-none d-xl-block position-relative">
              <input
                type="text"
                placeholder="Search products..."
                className="form-control ps-5 py-2"
                style={{
                  width: "clamp(140px,16vw,250px)",
                  borderRadius: 0,
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.15)',
                  color: 'white'
                }}
              />
              <Search
                size={18}
                className="position-absolute top-50 start-0 translate-middle-y ms-3"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              />
            </div>

            <button
              className="d-xl-none btn btn-link text-white p-0"
              aria-label="Search"
            >
              <Search style={{ width: "clamp(20px,2vw,24px)", height: "clamp(20px,2vw,24px)" }} />
            </button>

            <Link
              to="/cart"
              className="position-relative"
              style={{
                color: isActiveLink('/cart') ? '#ffc107' : 'white',
                transition: 'color 0.2s ease'
              }}
            >
              <ShoppingCart style={{ width: "clamp(20px,2vw,24px)", height: "clamp(20px,2vw,24px)" }} />
              {cart?.itemCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge"
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.5rem'
                  }}
                >
                  {cart.itemCount}
                </span>
              )}
            </Link>

            <Link
              to="/login"
              style={{
                color: isActiveLink('/login') ? '#ffc107' : 'white',
                transition: 'color 0.2s ease'
              }}
            >
              <User size={24} />
            </Link>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="d-xl-none pb-3">
          <div className="position-relative">
            <input
              type="text"
              placeholder="Search products..."
              className="form-control ps-5 py-2"
              style={{
                borderRadius: 0,
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.15)',
                color: 'white'
              }}
            />
            <Search
              size={18}
              className="position-absolute top-50 start-0 translate-middle-y ms-3"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className="d-xl-none position-fixed top-0 start-0 h-100 bg-white shadow-lg"
        style={{
          zIndex: 1040,
          transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
          width: "min(90vw,360px)",
          overflowY: 'auto',
          transition: 'transform .35s cubic-bezier(.4,0,.2,1)',
          pointerEvents: isMobileMenuOpen ? 'auto' : 'none'
        }}
      >
        <div className="p-3 p-sm-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h5 className="fw-bold mb-0" style={{ color: '#134e5e' }}>Menu</h5>
            <button
              className="btn btn-link text-dark p-0"
              onClick={closeMobileMenu}
              aria-label="Close menu"
              style={{ fontSize: '1.5rem' }}
            >
              <X style={{ width: "clamp(20px,2vw,24px)", height: "clamp(20px,2vw,24px)" }} />
            </button>
          </div>

          <nav className="d-flex flex-column gap-2">
            {mainNavLinks.map((link) => (
              <div key={link.name}>
                {link.hasDropdown ? (
                  <>
                    <button
                      className="d-flex align-items-center justify-content-between w-100 bg-transparent border-0 fw-medium"
                      onClick={() => toggleDropdown(`mobile-${link.name}`)}
                      style={{
                        padding: "16px 18px",
                        fontSize: "1rem",
                        color: isDropdownActive(link.dropdownItems) ? '#28a745' : '#495057',
                        background: isDropdownActive(link.dropdownItems) ? 'rgba(40, 167, 69, 0.05)' : 'transparent',
                        borderLeft: isDropdownActive(link.dropdownItems) ? '3px solid #28a745' : '3px solid transparent',
                        borderBottom: '1px solid #e9ecef',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span>{link.name}</span>
                      <ChevronDown
                        style={{
                          width: "clamp(20px,2vw,24px)",
                          height: "clamp(20px,2vw,24px)",
                          transition: 'transform 0.2s ease',
                          transform: openDropdown === `mobile-${link.name}` ? 'rotate(180deg)' : 'rotate(0)'
                        }}
                      />
                    </button>

                    {openDropdown === `mobile-${link.name}` && (
                      /* Added class "dropdown-container" so outside‑click handler ignores clicks inside this block */
                      <div
                        className="dropdown-container ps-4 mt-1"
                        style={{
                          pointerEvents: 'auto',
                          position: 'relative',
                          zIndex: 1
                        }}
                      >
                        {link.dropdownItems.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            onClick={closeMobileMenu}
                            /* Stop mousedown propagation to prevent outside‑click handler from closing dropdown before the click event */
                            onMouseDown={(e) => e.stopPropagation()}
                            className="d-block text-decoration-none"
                            style={{
                              padding: "14px 18px",
                              fontSize: "1rem",
                              color: isActiveLink(item.path) ? '#28a745' : '#6c757d',
                              background: isActiveLink(item.path) ? 'rgba(40, 167, 69, 0.05)' : 'transparent',
                              borderLeft: isActiveLink(item.path) ? '3px solid #28a745' : '3px solid transparent',
                              transition: 'all 0.2s ease',
                              pointerEvents: 'auto',
                              cursor: 'pointer'
                            }}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={link.path}
                    className="text-decoration-none fw-medium"
                    onClick={closeMobileMenu}
                    style={{
                      padding: "16px 18px",
                      fontSize: "1rem",
                      color: isActiveLink(link.path) ? '#28a745' : '#495057',
                      background: isActiveLink(link.path) ? 'rgba(40, 167, 69, 0.05)' : 'transparent',
                      borderLeft: isActiveLink(link.path) ? '3px solid #28a745' : '3px solid transparent',
                      borderBottom: '1px solid #e9ecef',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Cart summary */}
          <div className="mt-4 p-3" style={{ background: '#f8f9fa' }}>
            <h6 className="fw-bold mb-2" style={{ color: '#134e5e' }}>Cart Summary</h6>
            <div className="d-flex align-items-center justify-content-between">
              <span>Items in cart:</span>
              <span
                className="badge"
                style={{
                  background: '#28a745',
                  color: 'white',
                  padding: '0.25rem 0.5rem'
                }}
              >
                {cart?.itemCount ?? 0}
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between mt-2">
              <span>Total:</span>
              <span className="fw-bold">UGX {(cart?.totalAmount ?? 0).toLocaleString()}</span>
            </div>
            <Link
              to="/cart"
              className="btn w-100 mt-3 py-2"
              onClick={closeMobileMenu}
              style={{
                background: 'rgba(40, 167, 69, 0.1)',
                color: '#28a745',
                border: '1px solid rgba(40, 167, 69, 0.2)',
                borderRadius: 0,
                transition: 'all 0.3s ease'
              }}
            >
              View Cart
            </Link>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            zIndex: 1035,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)'
          }}
          onClick={closeMobileMenu}
        />
      )}

      <style>{`
        input::placeholder {
          color: rgba(255, 255, 255, 0.7) !important;
        }
        ::-webkit-scrollbar {
          width: 5px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        ::-webkit-scrollbar-thumb {
          background: #134e5e;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #0d3b48;
        }
      `}</style>
    </header>
  );
}




// components/Header.jsx
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
  
  // Get cart data from store
  const { cart, isLoading, initialize, isInitialized } = useCartStore();
  
  // Initialize cart store on component mount
  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [initialize, isInitialized]);

  // Handle scroll effect for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
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
    { name: "Services", path: "/serv" }, 
    { name: "Projects", path: "projects"},
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
    // Prevent body scroll when menu is open
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setOpenDropdown(null); // Close any open dropdowns when closing mobile menu
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'unset';
    setOpenDropdown(null);
  };

  // Check if link is active
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  // Check if any dropdown item is active
  const isDropdownActive = (dropdownItems) => {
    return dropdownItems.some(item => location.pathname === item.path);
  };

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
        transition: 'all 0.3s ease'
      }}
    >
      <div className="container">
        <div className="d-flex align-items-center justify-content-between py-2 py-md-3">
          {/* Logo and Mobile Menu Toggle */}
          <div className="d-flex align-items-center">
            {/* Mobile Menu Toggle Button */}
            <button 
              className="d-md-none btn btn-link text-white p-0 me-3"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
              style={{ fontSize: '1.5rem' }}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            <Link to="/home" className="d-flex align-items-center">
              <img 
                src={logo} 
                alt="Logo" 
                height={window.innerWidth < 768 ? "45" : "60"} 
                className="me-3 me-md-5"
              />
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="d-none d-md-flex align-items-center gap-3 gap-lg-4">
              {mainNavLinks.map((link) => (
                <div key={link.name} className="position-relative dropdown-container">
                  {link.hasDropdown ? (
                    <>
                      <button
                        className="d-flex align-items-center gap-1 bg-transparent border-0 fw-medium"
                        onClick={() => toggleDropdown(link.name)}
                        onMouseEnter={() => setOpenDropdown(link.name)}
                        style={{
                          color: isDropdownActive(link.dropdownItems) ? '#ffc107' : 'white',
                          fontSize: '0.95rem',
                          paddingBottom: '4px',
                          borderBottom: isDropdownActive(link.dropdownItems) ? '2px solid #ffc107' : '2px solid transparent',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer'
                        }}
                      >
                        {link.name}
                        <ChevronDown 
                          size={16} 
                          style={{
                            transition: 'transform 0.2s ease',
                            transform: openDropdown === link.name ? 'rotate(180deg)' : 'rotate(0)'
                          }}
                        />
                      </button>

                      {/* Dropdown Menu */}
                      {openDropdown === link.name && (
                        <div 
                          className="position-absolute top-100 start-0 mt-2"
                          style={{ 
                            zIndex: 1050,
                            minWidth: '200px'
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
                                onMouseEnter={(e) => {
                                  if (!isActiveLink(item.path)) {
                                    e.target.style.background = 'rgba(40, 167, 69, 0.02)';
                                    e.target.style.paddingLeft = '20px';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isActiveLink(item.path)) {
                                    e.target.style.background = 'transparent';
                                    e.target.style.paddingLeft = '16px';
                                  }
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
                        fontSize: '0.95rem',
                        paddingBottom: '4px',
                        borderBottom: isActiveLink(link.path) ? '2px solid #ffc107' : '2px solid transparent',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActiveLink(link.path)) {
                          e.target.style.color = '#ffc107';
                          e.target.style.borderBottomColor = '#ffc107';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActiveLink(link.path)) {
                          e.target.style.color = 'white';
                          e.target.style.borderBottomColor = 'transparent';
                        }
                      }}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Right side: Search, Cart, Account */}
          <div className="d-flex align-items-center gap-3 gap-md-4">
            {/* Search Bar - Desktop */}
            <div className="d-none d-lg-block position-relative">
              <input
                type="text"
                placeholder="Search products..."
                className="form-control ps-5 py-2"
                style={{ 
                  width: "280px",
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

            {/* Search Icon - Mobile/Tablet */}
            <button 
              className="d-lg-none btn btn-link text-white p-0"
              aria-label="Search"
              style={{ transition: 'opacity 0.2s ease' }}
              onMouseEnter={(e) => e.target.style.opacity = '0.8'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              <Search size={22} />
            </button>

            {/* Cart Icon with Dynamic Count */}
            <Link 
              to="/cart" 
              className="position-relative"
              style={{ 
                color: isActiveLink('/cart') ? '#ffc107' : 'white',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#ffc107'}
              onMouseLeave={(e) => e.target.style.color = isActiveLink('/cart') ? '#ffc107' : 'white'}
            >
              <ShoppingCart size={24} />
              {cart.itemCount > 0 && (
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

            {/* Account Icon */}
            <Link 
              to="/login" 
              style={{ 
                color: isActiveLink('/login') ? '#ffc107' : 'white',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#ffc107'}
              onMouseLeave={(e) => e.target.style.color = isActiveLink('/login') ? '#ffc107' : 'white'}
            >
              <User size={24} />
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="d-lg-none pb-3">
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

      {/* Mobile Drawer Navigation */}
      <div 
        className="d-md-none position-fixed top-0 start-0 h-100 bg-white shadow-lg"
        style={{ 
          zIndex: 1040,
          transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
          maxWidth: '300px',
          width: '75%',
          overflowY: 'auto',
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        <div className="p-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h5 className="fw-bold mb-0" style={{ color: '#134e5e' }}>Menu</h5>
            <button 
              className="btn btn-link text-dark p-0"
              onClick={closeMobileMenu}
              aria-label="Close menu"
              style={{ fontSize: '1.5rem' }}
            >
              <X size={24} />
            </button>
          </div>

          <nav className="d-flex flex-column gap-2">
            {mainNavLinks.map((link) => (
              <div key={link.name}>
                {link.hasDropdown ? (
                  <>
                    <button
                      className="d-flex align-items-center justify-content-between w-100 bg-transparent border-0 py-3 px-3 fw-medium border-bottom"
                      onClick={() => toggleDropdown(`mobile-${link.name}`)}
                      style={{
                        color: isDropdownActive(link.dropdownItems) ? '#28a745' : '#495057',
                        background: isDropdownActive(link.dropdownItems) ? 'rgba(40, 167, 69, 0.05)' : 'transparent',
                        borderLeft: isDropdownActive(link.dropdownItems) ? '3px solid #28a745' : '3px solid transparent',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span>{link.name}</span>
                      <ChevronDown 
                        size={16}
                        style={{
                          transition: 'transform 0.2s ease',
                          transform: openDropdown === `mobile-${link.name}` ? 'rotate(180deg)' : 'rotate(0)'
                        }}
                      />
                    </button>

                    {/* Mobile Dropdown Items */}
                    {openDropdown === `mobile-${link.name}` && (
                      <div className="ps-4 mt-1">
                        {link.dropdownItems.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            className="d-block text-decoration-none py-2 px-3"
                            onClick={closeMobileMenu}
                            style={{
                              color: isActiveLink(item.path) ? '#28a745' : '#6c757d',
                              background: isActiveLink(item.path) ? 'rgba(40, 167, 69, 0.05)' : 'transparent',
                              borderLeft: isActiveLink(item.path) ? '3px solid #28a745' : '3px solid transparent',
                              transition: 'all 0.2s ease'
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
                    className="text-decoration-none py-3 px-3 fw-medium border-bottom"
                    onClick={closeMobileMenu}
                    style={{ 
                      fontSize: '1.1rem',
                      color: isActiveLink(link.path) ? '#28a745' : '#495057',
                      background: isActiveLink(link.path) ? 'rgba(40, 167, 69, 0.05)' : 'transparent',
                      borderLeft: isActiveLink(link.path) ? '3px solid #28a745' : '3px solid transparent',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActiveLink(link.path)) {
                        e.target.style.background = '#f8f9fa';
                        e.target.style.paddingLeft = '20px';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActiveLink(link.path)) {
                        e.target.style.background = 'transparent';
                        e.target.style.paddingLeft = '16px';
                      }
                    }}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Cart Summary in Mobile Menu */}
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
                {cart.itemCount}
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between mt-2">
              <span>Total:</span>
              <span className="fw-bold">UGX {cart.totalAmount.toLocaleString()}</span>
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
              onMouseEnter={(e) => {
                e.target.style.background = '#28a745';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(40, 167, 69, 0.1)';
                e.target.style.color = '#28a745';
              }}
            >
              View Cart
            </Link>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile menu */}
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

      {/* Global style overrides using inline style tag */}
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




// // components/Header.jsx
// import React, { useState, useEffect } from 'react';
// import { Link, useLocation } from "react-router-dom";
// import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
// import useCartStore from "../stores/customer/useCartStore";
// import logo from "../assets/logo/logo.png";

// export default function Header() {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const location = useLocation();
  
//   // Get cart data from store
//   const { cart, isLoading, initialize, isInitialized } = useCartStore();
  
//   // Initialize cart store on component mount
//   useEffect(() => {
//     if (!isInitialized) {
//       initialize();
//     }
//   }, [initialize, isInitialized]);

//   // Handle scroll effect for header styling
//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const mainNavLinks = [
//     { name: "Home", path: "/home" },
//     { name: "Shop", path: "/shop" },
//     { name: "Services", path: "/serv" }, 
//     { name: "Blogs", path: "/blog/all" },
//     { name: "Careers", path: "/careers" },
//     { name: "Partners", path: "/partners" },
//     { name: "About Us", path: "/about" },
//     { name: "Contact", path: "/contact" }
//   ];

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//     // Prevent body scroll when menu is open
//     if (!isMobileMenuOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
//   };

//   const closeMobileMenu = () => {
//     setIsMobileMenuOpen(false);
//     document.body.style.overflow = 'unset';
//   };

//   // Check if link is active
//   const isActiveLink = (path) => {
//     return location.pathname === path;
//   };

//   return (
//     <header 
//       className="sticky-top"
//       style={{
//         background: 'linear-gradient(to right, #134e5e, #71b280)',
//         zIndex: 1030,
//         boxShadow: isScrolled ? '0 10px 30px rgba(0,0,0,0.15)' : '0 2px 10px rgba(0,0,0,0.1)',
//         transition: 'all 0.3s ease'
//       }}
//     >
//       <div className="container">
//         <div className="d-flex align-items-center justify-content-between py-2 py-md-3">
//           {/* Logo and Mobile Menu Toggle */}
//           <div className="d-flex align-items-center">
//             {/* Mobile Menu Toggle Button */}
//             <button 
//               className="d-md-none btn btn-link text-white p-0 me-3"
//               onClick={toggleMobileMenu}
//               aria-label="Toggle menu"
//               style={{ fontSize: '1.5rem' }}
//             >
//               {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
//             </button>

//             <Link to="/home" className="d-flex align-items-center">
//               <img 
//                 src={logo} 
//                 alt="Logo" 
//                 height={window.innerWidth < 768 ? "45" : "60"} 
//                 className="me-3 me-md-5"
//               />
//             </Link>
            
//             {/* Desktop Navigation */}
//             <nav className="d-none d-md-flex align-items-center gap-3 gap-lg-4">
//               {mainNavLinks.map((link) => (
//                 <Link
//                   key={link.name}
//                   to={link.path}
//                   className="text-decoration-none fw-medium"
//                   style={{
//                     color: isActiveLink(link.path) ? '#ffc107' : 'white',
//                     fontSize: '0.95rem',
//                     paddingBottom: '4px',
//                     borderBottom: isActiveLink(link.path) ? '2px solid #ffc107' : '2px solid transparent',
//                     transition: 'all 0.2s ease'
//                   }}
//                   onMouseEnter={(e) => {
//                     if (!isActiveLink(link.path)) {
//                       e.target.style.color = '#ffc107';
//                       e.target.style.borderBottomColor = '#ffc107';
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (!isActiveLink(link.path)) {
//                       e.target.style.color = 'white';
//                       e.target.style.borderBottomColor = 'transparent';
//                     }
//                   }}
//                 >
//                   {link.name}
//                 </Link>
//               ))}
//             </nav>
//           </div>

//           {/* Right side: Search, Cart, Account */}
//           <div className="d-flex align-items-center gap-3 gap-md-4">
//             {/* Search Bar - Desktop */}
//             <div className="d-none d-lg-block position-relative">
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 className="form-control ps-5 py-2"
//                 style={{ 
//                   width: "280px",
//                   borderRadius: 0,
//                   border: '1px solid rgba(255,255,255,0.2)',
//                   background: 'rgba(255,255,255,0.15)',
//                   color: 'white'
//                 }}
//               />
//               <Search
//                 size={18}
//                 className="position-absolute top-50 start-0 translate-middle-y ms-3"
//                 style={{ color: 'rgba(255,255,255,0.7)' }}
//               />
//             </div>

//             {/* Search Icon - Mobile/Tablet */}
//             <button 
//               className="d-lg-none btn btn-link text-white p-0"
//               aria-label="Search"
//               style={{ transition: 'opacity 0.2s ease' }}
//               onMouseEnter={(e) => e.target.style.opacity = '0.8'}
//               onMouseLeave={(e) => e.target.style.opacity = '1'}
//             >
//               <Search size={22} />
//             </button>

//             {/* Cart Icon with Dynamic Count */}
//             <Link 
//               to="/cart" 
//               className="position-relative"
//               style={{ 
//                 color: isActiveLink('/cart') ? '#ffc107' : 'white',
//                 transition: 'color 0.2s ease'
//               }}
//               onMouseEnter={(e) => e.target.style.color = '#ffc107'}
//               onMouseLeave={(e) => e.target.style.color = isActiveLink('/cart') ? '#ffc107' : 'white'}
//             >
//               <ShoppingCart size={24} />
//               {cart.itemCount > 0 && (
//                 <span 
//                   className="position-absolute top-0 start-100 translate-middle badge"
//                   style={{
//                     background: '#dc3545',
//                     color: 'white',
//                     fontSize: '0.75rem',
//                     padding: '0.25rem 0.5rem'
//                   }}
//                 >
//                   {cart.itemCount}
//                 </span>
//               )}
//             </Link>

//             {/* Account Icon */}
//             <Link 
//               to="/login" 
//               style={{ 
//                 color: isActiveLink('/login') ? '#ffc107' : 'white',
//                 transition: 'color 0.2s ease'
//               }}
//               onMouseEnter={(e) => e.target.style.color = '#ffc107'}
//               onMouseLeave={(e) => e.target.style.color = isActiveLink('/login') ? '#ffc107' : 'white'}
//             >
//               <User size={24} />
//             </Link>
//           </div>
//         </div>

//         {/* Mobile Search Bar */}
//         <div className="d-lg-none pb-3">
//           <div className="position-relative">
//             <input
//               type="text"
//               placeholder="Search products..."
//               className="form-control ps-5 py-2"
//               style={{ 
//                 borderRadius: 0,
//                 border: '1px solid rgba(255,255,255,0.2)',
//                 background: 'rgba(255,255,255,0.15)',
//                 color: 'white'
//               }}
//             />
//             <Search
//               size={18}
//               className="position-absolute top-50 start-0 translate-middle-y ms-3"
//               style={{ color: 'rgba(255,255,255,0.7)' }}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Mobile Drawer Navigation */}
//       <div 
//         className="d-md-none position-fixed top-0 start-0 h-100 bg-white shadow-lg"
//         style={{ 
//           zIndex: 1040,
//           transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
//           maxWidth: '300px',
//           width: '75%',
//           overflowY: 'auto',
//           transition: 'transform 0.3s ease-in-out'
//         }}
//       >
//         <div className="p-4">
//           <div className="d-flex align-items-center justify-content-between mb-4">
//             <h5 className="fw-bold mb-0" style={{ color: '#134e5e' }}>Menu</h5>
//             <button 
//               className="btn btn-link text-dark p-0"
//               onClick={closeMobileMenu}
//               aria-label="Close menu"
//               style={{ fontSize: '1.5rem' }}
//             >
//               <X size={24} />
//             </button>
//           </div>

//           <nav className="d-flex flex-column gap-2">
//             {mainNavLinks.map((link) => (
//               <Link
//                 key={link.name}
//                 to={link.path}
//                 className="text-decoration-none py-3 px-3 fw-medium border-bottom"
//                 onClick={closeMobileMenu}
//                 style={{ 
//                   fontSize: '1.1rem',
//                   color: isActiveLink(link.path) ? '#28a745' : '#495057',
//                   background: isActiveLink(link.path) ? 'rgba(40, 167, 69, 0.05)' : 'transparent',
//                   borderLeft: isActiveLink(link.path) ? '3px solid #28a745' : '3px solid transparent',
//                   transition: 'all 0.2s ease'
//                 }}
//                 onMouseEnter={(e) => {
//                   if (!isActiveLink(link.path)) {
//                     e.target.style.background = '#f8f9fa';
//                     e.target.style.paddingLeft = '20px';
//                   }
//                 }}
//                 onMouseLeave={(e) => {
//                   if (!isActiveLink(link.path)) {
//                     e.target.style.background = 'transparent';
//                     e.target.style.paddingLeft = '16px';
//                   }
//                 }}
//               >
//                 {link.name}
//               </Link>
//             ))}
//           </nav>

//           {/* Cart Summary in Mobile Menu */}
//           <div className="mt-4 p-3" style={{ background: '#f8f9fa' }}>
//             <h6 className="fw-bold mb-2" style={{ color: '#134e5e' }}>Cart Summary</h6>
//             <div className="d-flex align-items-center justify-content-between">
//               <span>Items in cart:</span>
//               <span 
//                 className="badge"
//                 style={{
//                   background: '#28a745',
//                   color: 'white',
//                   padding: '0.25rem 0.5rem'
//                 }}
//               >
//                 {cart.itemCount}
//               </span>
//             </div>
//             <div className="d-flex align-items-center justify-content-between mt-2">
//               <span>Total:</span>
//               <span className="fw-bold">UGX {cart.totalAmount.toLocaleString()}</span>
//             </div>
//             <Link 
//               to="/cart" 
//               className="btn w-100 mt-3 py-2"
//               onClick={closeMobileMenu}
//               style={{
//                 background: 'rgba(40, 167, 69, 0.1)',
//                 color: '#28a745',
//                 border: '1px solid rgba(40, 167, 69, 0.2)',
//                 borderRadius: 0,
//                 transition: 'all 0.3s ease'
//               }}
//               onMouseEnter={(e) => {
//                 e.target.style.background = '#28a745';
//                 e.target.style.color = 'white';
//               }}
//               onMouseLeave={(e) => {
//                 e.target.style.background = 'rgba(40, 167, 69, 0.1)';
//                 e.target.style.color = '#28a745';
//               }}
//             >
//               View Cart
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Backdrop for mobile menu */}
//       {isMobileMenuOpen && (
//         <div 
//           className="position-fixed top-0 start-0 w-100 h-100"
//           style={{ 
//             zIndex: 1035,
//             background: 'rgba(0, 0, 0, 0.5)',
//             backdropFilter: 'blur(5px)'
//           }}
//           onClick={closeMobileMenu}
//         />
//       )}

//       {/* Global style overrides using inline style tag */}
//       <style>{`
//         input::placeholder {
//           color: rgba(255, 255, 255, 0.7) !important;
//         }
        
//         ::-webkit-scrollbar {
//           width: 5px;
//         }
        
//         ::-webkit-scrollbar-track {
//           background: #f1f1f1;
//         }
        
//         ::-webkit-scrollbar-thumb {
//           background: #134e5e;
//         }
        
//         ::-webkit-scrollbar-thumb:hover {
//           background: #0d3b48;
//         }
//       `}</style>
//     </header>
//   );
// }


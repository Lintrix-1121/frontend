import React, { useEffect, useState } from 'react';
import { Funnel, X } from 'react-bootstrap-icons';
import useProductStore from '../../stores/customer/useProductStore';
import useCartStore from '../../stores/customer/useCartStore';
import ProductController from '../../controllers/customer/ProductController';
import ProductCard from '../../components/customer/ProductCard';
import FilterSidebar from '../../components/customer/FilterSidebar';
import SortDropdown from '../../components/customer/SortDropdown';
import Pagination from '../../components/customer/Pagination';
import back from '../../assets/breadboard.jpg';
import Hero from '../../components/customer/Hero';
import HorizontalNav from '../../components/HorizontalNav';
import LoadingSpinner from '../../components/admin/LoadingSpinner';

const ProductListingView = () => {
  const productStore = useProductStore();
  const cartStore = useCartStore();
  const [controller] = useState(() => new ProductController(productStore, cartStore));

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        await controller.initializeProductsPage();
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [controller]);

  const handleAddToCart = async (product) => {
    console.log('Adding product to cart:', product);
    
    try {
      const result = await cartStore.addToCart(product);
      
      if (result.success) {
        console.log('Product added to cart successfully');
      } else {
        console.error('Failed to add to cart:', result.message);
        alert(result.message);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    }
  };

  const isProductInCart = (productId) => {
    if (!productId || !cartStore.cart?.items || !Array.isArray(cartStore.cart.items)) {
      return false;
    }
    
    return cartStore.cart.items.some(item => {
      if (item.productId === productId) return true;
      if (item.product && item.product.id === productId) return true;
      return false;
    });
  };

  const getCartItemQuantity = (productId) => {
    if (!productId || !cartStore.cart?.items || !Array.isArray(cartStore.cart.items)) {
      return 0;
    }
    
    const item = cartStore.cart.items.find(item => {
      if (item.productId === productId) return true;
      if (item.product && item.product.id === productId) return true;
      return false;
    });
    
    return item?.quantity || 0;
  };

  // Loading state with glass design
  if (loading) 
    return <LoadingSpinner />; 
  
  // Error state with glass design
  if (error) {
    return (
      <div className="container py-5">
        <div 
          className="alert border-0 p-4"
          style={{
            background: 'rgba(220, 53, 69, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(220, 53, 69, 0.2)'
          }}
          role="alert"
        >
          <h4 className="alert-heading text-danger">Error Loading Products</h4>
          <p className="text-secondary">{error}</p>
          <hr className="opacity-25" />
          <button 
            className="btn btn-outline-danger"
            onClick={() => window.location.reload()}
            style={{ borderRadius: 0 }}
          >
            Try Again <i className="bi bi-arrow-repeat ms-2"></i>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      {/* Header with Glass Morphism - Matching Blog Design */}
      <header 
        className="position-relative overflow-hidden py-5 mb-"
        style={{
          backgroundImage: `url(${back})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark overlay */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 1
          }}
        />
        
        {/* Glass morphism overlay */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(5px) saturate(180%)',
            WebkitBackdropFilter: 'blur(5px) saturate(180%)',
            zIndex: 2
          }}
        />
        
        {/* Content */}
        <div className="container position-relative" style={{ zIndex: 3 }}>
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold text-success mb-3">
                Our <span className="text-warning">Products</span>
              </h1>
              <p className="lead text-white mb-0 opacity-75">
                Discover our curated collection of high-quality products designed to enhance your experience
              </p>
            </div>
            <div className="col-lg-6 mt-4 mt-lg-0">
              {/* Stats Card */}
              <div 
                className="p-4"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <div className="row g-4 text-center">
                  <div className="col-4">
                    <div className="text-white fs-4 fw-bold">{productStore.products?.length || 0}</div>
                    <div className="text-white-50 small">Products</div>
                  </div>
                  <div className="col-4">
                    <div className="text-white fs-4 fw-bold">{productStore.categories?.length || 0}</div>
                    <div className="text-white-50 small">Categories</div>
                  </div>
                  <div className="col-4">
                    <div className="text-white fs-4 fw-bold">{productStore.pagination?.totalPages || 1}</div>
                    <div className="text-white-50 small">Pages</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <Hero />
      <HorizontalNav />

      <div className="container pb-5">
        {/* Mobile Filter Button */}
        <div className="d-lg-none mb-4">
          <button
            className="btn d-flex align-items-center gap-2"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: 0
            }}
            onClick={() => setShowMobileFilters(true)}
          >
            <Funnel /> Filters
            {Object.values(productStore.filters || {}).filter(v => v && v !== '').length > 0 && (
              <span 
                className="badge ms-2"
                style={{
                  background: 'rgba(40, 167, 69, 0.1)',
                  color: '#28a745',
                  padding: '0.25rem 0.5rem'
                }}
              >
                {Object.values(productStore.filters || {}).filter(v => v && v !== '').length}
              </span>
            )}
          </button>
        </div>

        <div className="row g-4">
          {/* Sidebar */}
          <aside className="col-lg-3 d-none d-lg-block">
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                padding: '1.5rem'
              }}
            >
              <FilterSidebar
                categories={productStore.categories || []}
                selectedCategory={productStore.selectedCategory}
                priceRange={priceRange}
                filters={productStore.filters || {}}
                onCategorySelect={(c) => controller.selectCategory(c)}
                onPriceRangeChange={(min, max) => controller.applyFilters({ minPrice: min, maxPrice: max })}
                onFilterChange={(k, v) => controller.applyFilters({ [k]: v })}
                onClearFilters={() => controller.clearFilters()}
              />
            </div>
          </aside>

          {/* Products Section */}
          <section className="col-lg-9">
            {/* Toolbar */}
            <div 
              className="d-flex flex-wrap justify-content-between align-items-center mb-4 p-3"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                position: 'relative',
                zIndex: 10
              }}
            >
              <div style={{ position: 'relative', zIndex: 20 }}>
                <SortDropdown
                  currentSort={productStore.filters?.sortBy}
                  currentOrder={productStore.filters?.sortOrder}
                  onChange={(by, order) => controller.sortProducts(by, order)}
                />
              </div>

              <div className="d-flex align-items-center gap-3">
                <span className="text-muted small">
                  Page <span className="fw-bold text-dark">{productStore.pagination?.currentPage || 1}</span> of{' '}
                  <span className="fw-bold text-dark">{productStore.pagination?.totalPages || 1}</span>
                </span>
                
                {Object.values(productStore.filters || {}).filter(v => v && v !== '').length > 0 && (
                  <button
                    className="btn btn-sm"
                    style={{
                      color: '#dc3545',
                      background: 'rgba(220, 53, 69, 0.1)',
                      border: '1px solid rgba(220, 53, 69, 0.2)',
                      borderRadius: 0
                    }}
                    onClick={() => controller.clearFilters()}
                  >
                    <X className="me-1" /> Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Products Grid */}
            {productStore.products && productStore.products.length > 0 ? (
              <div className="row g-4">
                {productStore.products.map(product => {
                  if (!product) return null;
                  
                  const productId = product.productId || product.id;
                  if (!productId) {
                    console.warn('Product missing ID:', product);
                    return null;
                  }
                  
                  return (
                    <div
                      key={productId}
                      className="col-6 col-md-4 col-xl-3"
                    >
                      <div
                        onMouseEnter={() => setHoveredCard(productId)}
                        onMouseLeave={() => setHoveredCard(null)}
                        style={{
                          transition: 'all 0.3s ease',
                          transform: hoveredCard === productId ? 'translateY(-5px)' : 'translateY(0)',
                          boxShadow: hoveredCard === productId ? '0 10px 30px rgba(0,0,0,0.15)' : 'none'
                        }}
                      >
                        <ProductCard
                          product={product}
                          onAddToCart={handleAddToCart}
                          isInCart={isProductInCart(productId)}
                          cartQuantity={getCartItemQuantity(productId)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div 
                className="text-center py-5"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  padding: '3rem'
                }}
              >
                <i className="bi bi-box" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
                <h3 className="fw-bold mt-3 mb-3">No Products Found</h3>
                <p className="text-muted mb-4">
                  Try adjusting your search or filter criteria to find what you're looking for.
                </p>
                <button 
                  className="btn btn-outline-success px-4"
                  onClick={() => controller.clearFilters()}
                  style={{ borderRadius: 0 }}
                >
                  Clear All Filters <X className="ms-2" />
                </button>
              </div>
            )}

            {/* Pagination */}
            {productStore.pagination?.totalPages > 1 && (
              <div className="mt-5">
                <Pagination
                  currentPage={productStore.pagination.currentPage}
                  totalPages={productStore.pagination.totalPages}
                  onPageChange={(p) => controller.changePage(p)}
                />
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(5px)',
              zIndex: 1040
            }}
            onClick={() => setShowMobileFilters(false)}
          />

          <div 
            className="position-fixed top-0 start-0 h-100 p-4 shadow-lg"
            style={{ 
              width: 320, 
              zIndex: 1050,
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(10px)',
              borderRight: '1px solid rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Filters</h5>
              <button 
                className="btn btn-sm"
                style={{
                  background: 'rgba(108, 117, 125, 0.1)',
                  border: '1px solid rgba(108, 117, 125, 0.2)',
                  borderRadius: 0,
                  padding: '0.5rem 1rem'
                }}
                onClick={() => setShowMobileFilters(false)}
              >
                <X />
              </button>
            </div>

            <FilterSidebar
              categories={productStore.categories || []}
              selectedCategory={productStore.selectedCategory}
              priceRange={priceRange}
              filters={productStore.filters || {}}
              onCategorySelect={(c) => {
                controller.selectCategory(c);
                setShowMobileFilters(false);
              }}
              onPriceRangeChange={(min, max) => controller.applyFilters({ minPrice: min, maxPrice: max })}
              onFilterChange={(k, v) => controller.applyFilters({ [k]: v })}
              onClearFilters={() => {
                controller.clearFilters();
                setShowMobileFilters(false);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProductListingView;



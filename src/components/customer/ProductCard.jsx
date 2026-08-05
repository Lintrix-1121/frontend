import React, { useState } from 'react';
import { Cart } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
    
console.count("ProductCard rendered");

const ProductCard = ({ product, onAddToCart, isInCart, cartQuantity, basePath = '/products' }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // Format price (UGX)
  const formatPrice = (price) => {
    if (!price && price !== 0) return 'UGX 0';
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const isOnSale = product.isOnSale && product.salePrice && product.salePrice < product.price;
  const discountPercentage = isOnSale 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  // Build product detail link – prefer slug, fallback to ID
  const getProductLink = () => {
    if (product.slug) return `${basePath}/${product.slug}`;
    if (product.id) return `${basePath}/${product.id}`;
    return '#'; // fallback
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // prevent navigation
    onAddToCart(product);
  };

  const handleCardClick = () => {
    const link = getProductLink();
    if (link !== '#') navigate(link);
  };

  return (

    <div
      className="h-100 d-flex flex-column"
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e9ecef',
        boxShadow: isHovered 
          ? '0 8px 25px rgba(0,0,0,0.10)' 
          : '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'all 0.25s ease',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        cursor: 'pointer',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
    >
      {/* Image – 4:3 aspect ratio, no fixed height */}
      <div className="position-relative" style={{ paddingTop: '75%', overflow: 'hidden' }}>
        <img
          src={product.thumbnail || product.images?.[0] || '/placeholder-image.jpg'}
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
            transform: isHovered ? 'scale(1.04)' : 'scale(1)'
          }}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/placeholder-image.jpg';
          }}
          // onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
        />

        {/* Sale badge */}
        {isOnSale && (
          <span
            className="position-absolute top-0 start-0 m-2 px-3 py-1"
            style={{
              background: '#dc3545',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: '700',
              borderRadius: '20px',
              letterSpacing: '0.5px'
            }}
          >
            -{discountPercentage}%
          </span>
        )}

        {/* Out of Stock overlay */}
        {product.stockQuantity === 0 && (
          <div
            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}
          >
            <span
              className="text-white fw-bold px-4 py-2"
              style={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(5px)',
                borderRadius: '30px',
                border: '1px solid rgba(255,255,255,0.3)',
                fontSize: '0.9rem'
              }}
            >
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3 d-flex flex-column grow">
        {/* Category */}
        <small
          className="text-uppercase text-muted mb-1"
          style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}
        >
          {product.category?.name || product.category || 'General'}
        </small>

        {/* Title */}
        <h6
          className="fw-semibold mb-2"
          style={{
            fontSize: '0.95rem',
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.8rem'
          }}
        >
          {product.name}
        </h6>

        {/* Pricing */}
        <div className="mb-2">
          <span className="fw-bold" style={{ color: '#28a745', fontSize: '1.1rem' }}>
            {formatPrice(isOnSale ? product.salePrice : product.price)}
          </span>
          {isOnSale && (
            <small className="text-muted text-decoration-line-through ms-2">
              {formatPrice(product.price)}
            </small>
          )}
        </div>

        {/* Low stock warning */}
        {product.stockQuantity > 0 && product.stockQuantity <= 5 && (
          <small className="text-warning mb-2" style={{ fontSize: '0.8rem' }}>
             Only {product.stockQuantity} left
          </small>
        )}

        {/* Spacer to push button down */}
        <div className="grow"></div>

        {/*Cart Button - stops event propagation */}
        <button
          className="btn w-100 py-2 mt-2"
          style={{
            background: isInCart 
              ? '#28a745' 
              : product.stockQuantity === 0 
                ? '#f8f9fa' 
                : 'transparent',
            color: isInCart 
              ? '#fff' 
              : product.stockQuantity === 0 
                ? '#adb5bd' 
                : '#28a745',
            border: isInCart 
              ? '1px solid #28a745' 
              : product.stockQuantity === 0 
                ? '1px solid #dee2e6' 
                : '1px solid #28a745',
            borderRadius: '50px',
            fontWeight: '500',
            fontSize: '0.9rem',
            transition: 'all 0.2s ease',
            cursor: product.stockQuantity === 0 ? 'not-allowed' : 'pointer',
            opacity: product.stockQuantity === 0 ? 0.6 : 1
          }}
          onClick={handleAddToCart}
          disabled={product.stockQuantity === 0}
          onMouseEnter={(e) => {
            if (product.stockQuantity === 0) return;
            if (isInCart) {
              e.target.style.background = '#218838';
            } else {
              e.target.style.background = '#28a745';
              e.target.style.color = '#fff';
            }
          }}
          onMouseLeave={(e) => {
            if (product.stockQuantity === 0) return;
            if (isInCart) {
              e.target.style.background = '#28a745';
            } else {
              e.target.style.background = 'transparent';
              e.target.style.color = '#28a745';
            }
          }}
        >
          <Cart size={16} className="me-2" />
          {product.stockQuantity === 0 
            ? 'Out of Stock' 
            : isInCart 
              ? `In Cart (${cartQuantity || 1})` 
              : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
// src/components/customer/ProductCard.jsx
import React, { useState } from 'react';
import { Cart } from 'react-bootstrap-icons';

const ProductCard = ({ product, onAddToCart, isInCart, cartQuantity }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price || 0);
  };

  const isOnSale =
    product.isOnSale &&
    product.salePrice &&
    product.salePrice < product.price;

  const discountPercentage = isOnSale 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <div 
      className="h-100 d-flex flex-column"
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 10px 30px rgba(0,0,0,0.15)' : 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
        <img
          src={product.thumbnail || product.images?.[0] || '/placeholder-image.jpg'}
          className="w-100 h-100"
          style={{ 
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)'
          }}
          alt={product.name}
          onError={(e) => {
            e.target.src = '/placeholder-image.jpg';
          }}
        />

        {/* Sale Badge */}
        {isOnSale && (
          <span 
            className="position-absolute top-0 start-0 m-3"
            style={{
              background: 'rgba(220, 53, 69, 0.9)',
              backdropFilter: 'blur(5px)',
              color: 'white',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            SALE {discountPercentage}% OFF
          </span>
        )}

        {/* Out of Stock Overlay */}
        {product.stockQuantity === 0 && (
          <div 
            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(3px)'
            }}
          >
            <span 
              className="text-white fw-bold"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(5px)',
                padding: '0.75rem 1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3 d-flex flex-column grow">
        {/* Category */}
        <small 
          className="text-muted text-truncate mb-2"
          style={{ fontSize: '0.8rem' }}
        >
          {product.category?.name || product.category || 'General'}
        </small>

        {/* Product Name */}
        <h6 
          className="fw-semibold mb-2 text-dark"
          style={{ 
            fontSize: '1rem',
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            transition: 'color 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.color = '#28a745'}
          onMouseLeave={(e) => e.target.style.color = '#212529'}
        >
          {product.name}
        </h6>

        {/* Price Section */}
        <div className="mb-3">
          <span className="fw-bold" style={{ color: '#28a745', fontSize: '1.2rem' }}>
            {formatPrice(isOnSale ? product.salePrice : product.price)}
          </span>
          
          {isOnSale && (
            <>
              <small className="text-muted text-decoration-line-through ms-2">
                {formatPrice(product.price)}
              </small>
              <span 
                className="ms-2 small"
                style={{
                  background: 'rgba(40, 167, 69, 0.1)',
                  color: '#28a745',
                  padding: '0.25rem 0.5rem'
                }}
              >
                -{discountPercentage}%
              </span>
            </>
          )}
        </div>

        {/* Stock Status */}
        {product.stockQuantity > 0 && product.stockQuantity <= 5 && (
          <small className="text-warning mb-2">
            <i className="bi bi-exclamation-triangle me-1"></i>
            Only {product.stockQuantity} left
          </small>
        )}

        {/* Add to Cart Button */}
        <div className="mt-auto">
          <button
            className="btn w-100"
            style={{
              background: isInCart 
                ? 'rgba(40, 167, 69, 0.9)' 
                : product.stockQuantity === 0 
                  ? 'rgba(108, 117, 125, 0.1)' 
                  : 'rgba(40, 167, 69, 0.1)',
              color: isInCart 
                ? 'white' 
                : product.stockQuantity === 0 
                  ? '#6c757d' 
                  : '#28a745',
              border: isInCart 
                ? '1px solid rgba(255, 255, 255, 0.2)' 
                : product.stockQuantity === 0 
                  ? '1px solid rgba(108, 117, 125, 0.2)' 
                  : '1px solid rgba(40, 167, 69, 0.2)',
              transition: 'all 0.3s ease',
              opacity: product.stockQuantity === 0 ? 0.6 : 1,
              cursor: product.stockQuantity === 0 ? 'not-allowed' : 'pointer'
            }}
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0}
            onMouseEnter={(e) => {
              if (product.stockQuantity === 0) return;
              if (isInCart) {
                e.target.style.background = '#218838';
              } else {
                e.target.style.background = '#28a745';
                e.target.style.color = 'white';
              }
            }}
            onMouseLeave={(e) => {
              if (product.stockQuantity === 0) return;
              if (isInCart) {
                e.target.style.background = 'rgba(40, 167, 69, 0.9)';
              } else {
                e.target.style.background = 'rgba(40, 167, 69, 0.1)';
                e.target.style.color = '#28a745';
              }
            }}
          >
            <Cart size={16} className="me-2" />
            {product.stockQuantity === 0 
              ? 'Out of Stock' 
              : isInCart 
                ? `In Cart (${cartQuantity || 1})` 
                : 'Add to Cart'
            }
          </button>
        </div>

        {/* Quick View Indicator */}
        {isHovered && (
          <div 
            className="position-absolute bottom-0 start-0 w-100 text-center py-2"
            style={{
              background: 'rgba(40, 167, 69, 0.9)',
              backdropFilter: 'blur(5px)',
              color: 'white',
              fontSize: '0.875rem',
              transform: 'translateY(0)',
              transition: 'transform 0.3s ease',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            Click for details <i className="bi bi-arrow-right ms-2"></i>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
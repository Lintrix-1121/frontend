// src/components/customer/ProductCard.jsx
import React, { useState } from 'react';
import { Cart } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart, isInCart, cartQuantity }) => {
  const navigate = useNavigate();
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
    e.stopPropagation(); // Prevent navigating to details
    onAddToCart(product);
  };

  const handleCardClick = () => {
    navigate(`/products/${product.id}`); // Adjust route as needed
  };

  return (
    <div
      className="h-100 d-flex flex-column"
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 10px 30px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
    >
      {/* Image Container – responsive aspect ratio */}
      <div className="position-relative" style={{ paddingTop: '75%', overflow: 'hidden' }}>
        <img
          src={product.thumbnail || product.images?.[0] || '/placeholder-image.jpg'}
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ 
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
          alt={product.name}
          onError={(e) => {
            e.target.src = '/placeholder-image.jpg';
          }}
        />

        {/* Sale Badge */}
        {isOnSale && (
          <span 
            className="position-absolute top-0 start-0 m-2 px-3 py-1"
            style={{
              background: 'rgba(220, 53, 69, 0.9)',
              backdropFilter: 'blur(5px)',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: '600',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            -{discountPercentage}%
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
              className="text-white fw-bold px-4 py-2"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(5px)',
                borderRadius: '4px',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3 d-flex flex-column flex-grow-1">
        {/* Category */}
        <small 
          className="text-muted text-truncate mb-1"
          style={{ fontSize: '0.75rem' }}
        >
          {product.category?.name || product.category || 'General'}
        </small>

        {/* Product Name */}
        <h6 
          className="fw-semibold mb-2 text-dark"
          style={{ 
            fontSize: '0.95rem',
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {product.name}
        </h6>

        {/* Price Section */}
        <div className="mb-2">
          <span className="fw-bold" style={{ color: '#28a745', fontSize: '1.1rem' }}>
            {formatPrice(isOnSale ? product.salePrice : product.price)}
          </span>
          
          {isOnSale && (
            <>
              <small className="text-muted text-decoration-line-through ms-2">
                {formatPrice(product.price)}
              </small>
            </>
          )}
        </div>

        {/* Stock Status – only if low stock */}
        {product.stockQuantity > 0 && product.stockQuantity <= 5 && (
          <small className="text-warning mb-2">
            ⚠️ Only {product.stockQuantity} left
          </small>
        )}

        {/* Add to Cart Button – stops propagation */}
        <div className="mt-auto pt-2">
          <button
            className="btn w-100 py-2"
            style={{
              background: isInCart 
                ? '#28a745' 
                : product.stockQuantity === 0 
                  ? '#e9ecef' 
                  : 'transparent',
              color: isInCart 
                ? 'white' 
                : product.stockQuantity === 0 
                  ? '#6c757d' 
                  : '#28a745',
              border: isInCart 
                ? '1px solid #28a745' 
                : product.stockQuantity === 0 
                  ? '1px solid #dee2e6' 
                  : '1px solid #28a745',
              borderRadius: '50px',
              transition: 'all 0.3s ease',
              fontWeight: '500',
              fontSize: '0.9rem'
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
                : 'Add to Cart'
            }
          </button>
        </div>
      </div>

      {/* Quick View Indicator – only on desktop hover */}
      {isHovered && (
        <div 
          className="d-none d-md-block position-absolute bottom-0 start-0 w-100 text-center py-2"
          style={{
            background: 'rgba(40, 167, 69, 0.9)',
            backdropFilter: 'blur(5px)',
            color: 'white',
            fontSize: '0.85rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            pointerEvents: 'none' // So it doesn't block clicks
          }}
        >
          Click for details →
        </div>
      )}
    </div>
  );
};

export default ProductCard;
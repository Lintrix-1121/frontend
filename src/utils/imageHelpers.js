// utils/imageHelpers.js

/**
 * Get product thumbnail URL
 * @param {Object} product - Product object
 * @param {string} backendUrl - Backend base URL (default: https://api.logiphix.tech)
 * @returns {string} Thumbnail URL
 */
export const getProductThumbnail = (product, backendUrl = 'https://api.logiphix.tech') => {
  if (!product) return 'https://via.placeholder.com/400';
  
  if (product.thumbnail && 
      product.thumbnail !== 'null' && 
      typeof product.thumbnail === 'string') {
    
    let thumbnail = product.thumbnail.trim();
    
    // Remove /api/ prefix if present
    if (thumbnail.startsWith('/api/')) {
      thumbnail = thumbnail.replace(/^\/api\//, '/');
    }
    
    // Convert relative URL to absolute
    if (thumbnail.startsWith('/')) {
      return `${backendUrl}${thumbnail}`;
    }
    
    return thumbnail;
  }
  
  // If we have images array, try to get thumbnail from there
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    // Find thumbnail image or use first image
    const thumbnailImage = product.images.find(img => img.isThumbnail) || product.images[0];
    if (thumbnailImage) {
      let thumbnail = thumbnailImage.url || thumbnailImage;
      
      // Convert relative URL to absolute
      if (thumbnail && thumbnail.startsWith('/')) {
        return `${backendUrl}${thumbnail}`;
      }
      
      return thumbnail;
    }
  }
  
  // Fallback
  return 'https://via.placeholder.com/400';
};

/**
 * Get all product images as URLs
 * @param {Object} product - Product object
 * @param {string} backendUrl - Backend base URL
 * @returns {Array} Array of image URLs
 */
export const getProductImages = (product, backendUrl = 'https://api.logiphix.tech') => {
  if (!product) return [];
  
  let images = [];
  
  // If images is a string, parse it
  if (product.images && typeof product.images === 'string') {
    try {
      images = JSON.parse(product.images);
    } catch (error) {
      console.warn('Failed to parse images string:', error);
      images = [];
    }
  } else if (Array.isArray(product.images)) {
    images = product.images;
  }
  
  // Convert all image URLs to absolute
  return images.map(img => {
    if (typeof img === 'string') {
      let url = img.trim();
      // Remove /api/ prefix
      if (url.startsWith('/api/')) {
        url = url.replace(/^\/api\//, '/');
      }
      // Convert to absolute URL
      if (url.startsWith('/')) {
        return `${backendUrl}${url}`;
      }
      return url;
    } else if (img && typeof img === 'object' && img.url) {
      let url = img.url.trim();
      // Remove /api/ prefix
      if (url.startsWith('/api/')) {
        url = url.replace(/^\/api\//, '/');
      }
      // Convert to absolute URL
      if (url.startsWith('/')) {
        url = `${backendUrl}${url}`;
      }
      return url;
    }
    return null;
  }).filter(url => url);
};

/**
 * Get main product image (thumbnail or first image)
 * @param {Object} product - Product object
 * @param {string} backendUrl - Backend base URL
 * @returns {string} Main image URL
 */
export const getMainProductImage = (product, backendUrl = 'https://api.logiphix.tech') => {
  return getProductThumbnail(product, backendUrl);
};
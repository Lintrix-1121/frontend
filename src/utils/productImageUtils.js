// utils/productImageUtils.js

/**
 * Parse product images from string or array
 * @param {Object} product - Product object
 * @param {string} backendUrl - Backend base URL
 * @returns {Object} Product with parsed images
 */
export const parseProductImages = (product, backendUrl = 'http://localhost:2090') => {
  if (!product) return product;
  
  const processedProduct = { ...product };
  
  // Parse images if they're a string
  if (processedProduct.images && typeof processedProduct.images === 'string') {
    try {
      processedProduct.images = JSON.parse(processedProduct.images);
    } catch (error) {
      console.warn('Failed to parse images string:', error);
      processedProduct.images = [];
    }
  } else if (!processedProduct.images) {
    processedProduct.images = [];
  }
  
  // Clean and convert thumbnail URL
  if (processedProduct.thumbnail && typeof processedProduct.thumbnail === 'string') {
    const thumbnail = processedProduct.thumbnail.trim();
    
    // Remove /api/ prefix if present
    let cleanThumbnail = thumbnail;
    if (cleanThumbnail.startsWith('/api/')) {
      cleanThumbnail = cleanThumbnail.replace(/^\/api\//, '/');
    }
    
    // Convert relative URL to absolute
    if (cleanThumbnail.startsWith('/') && !cleanThumbnail.startsWith('//')) {
      processedProduct.thumbnail = `${backendUrl}${cleanThumbnail}`;
    }
  }
  
  // Convert all image URLs in the array to absolute
  if (Array.isArray(processedProduct.images)) {
    processedProduct.images = processedProduct.images.map(img => {
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
        return { ...img, url };
      }
      return img;
    });
  }
  
  return processedProduct;
};

/**
 * Parse array of products
 * @param {Array} products - Array of product objects
 * @param {string} backendUrl - Backend base URL
 * @returns {Array} Array of products with parsed images
 */
export const parseProductImagesArray = (products, backendUrl = 'http://localhost:2090') => {
  if (!Array.isArray(products)) return [];
  return products.map(product => parseProductImages(product, backendUrl));
};

/**
 * Get product thumbnail URL
 * @param {Object} product - Product object
 * @param {string} backendUrl - Backend base URL
 * @returns {string} Thumbnail URL
 */
export const getProductThumbnail = (product, backendUrl = 'http://localhost:2090') => {
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
  
  return 'https://via.placeholder.com/400';
};
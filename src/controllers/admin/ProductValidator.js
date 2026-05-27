class ProductValidator {
  static validateCreateData(productData) {
    const errors = [];
    
    // Required fields
    if (!productData.name || productData.name.trim() === '') {
      errors.push('Product name is required');
    }
    
    if (!productData.sku || productData.sku.trim() === '') {
      errors.push('SKU is required');
    }
    
    if (!productData.price || productData.price <= 0) {
      errors.push('Valid price is required');
    }
    
    if (!productData.quantity || productData.quantity < 0) {
      errors.push('Valid quantity is required');
    }
    
    // Price validation
    if (productData.comparePrice && productData.comparePrice <= productData.price) {
      errors.push('Compare price must be greater than regular price');
    }
    
    if (productData.salePrice && productData.salePrice >= productData.price) {
      errors.push('Sale price must be less than regular price');
    }
    
    // Date validation
    if (productData.saleStart && productData.saleEnd) {
      const startDate = new Date(productData.saleStart);
      const endDate = new Date(productData.saleEnd);
      if (startDate >= endDate) {
        errors.push('Sale end date must be after sale start date');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateImages(images) {
    const errors = [];
    
    if (!Array.isArray(images)) {
      errors.push('Images must be an array');
      return { isValid: false, errors };
    }
    
    // Check individual images
    images.forEach((img, index) => {
      if (img.file) {
        // Validate file
        if (img.file.size > 5 * 1024 * 1024) {
          errors.push(`Image ${index + 1}: File size exceeds 5MB limit`);
        }
        
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(img.file.type)) {
          errors.push(`Image ${index + 1}: Invalid file type. Allowed: ${validTypes.join(', ')}`);
        }
      } else if (img.url && !img.url.startsWith('blob:')) {
        // Validate URL format
        try {
          new URL(img.url);
        } catch {
          errors.push(`Image ${index + 1}: Invalid URL format`);
        }
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateUpdateData(productData) {
    const errors = [];
    
    // SKU uniqueness would be validated on server
    if (productData.sku && productData.sku.trim() === '') {
      errors.push('SKU cannot be empty');
    }
    
    if (productData.price !== undefined && productData.price <= 0) {
      errors.push('Price must be greater than 0');
    }
    
    if (productData.quantity !== undefined && productData.quantity < 0) {
      errors.push('Quantity cannot be negative');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default ProductValidator;

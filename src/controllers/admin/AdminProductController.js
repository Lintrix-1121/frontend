import AdminProductService from '../../services/admin/AdminProductService';
import ProductValidator from './ProductValidator';

class AdminProductController { 
  constructor(productStore) {
    if (!productStore) {
      throw new Error('ProductStore is required for AdminProductController');
    }
    this.store = productStore;
    this._isInitializing = false; // Prevent concurrent initialization
  }

  /**
   * Initialize products page (safe version)
   */
  async initializeProductsPage() {
    try {
      // Prevent multiple concurrent initializations
      if (this._isInitializing) return;
      
      this._isInitializing = true;
      await this.store.initializeProducts();
    } catch (error) {
      console.error('Failed to initialize products:', error);
      throw error;
    } finally {
      this._isInitializing = false;
    }
  }

  /**
   * Apply filters from form
   */
  applyFilters(formFilters) {
    // Map form filter values to store filters
    const storeFilters = {
      search: formFilters.search || '',
      categoryId: formFilters.categoryId || null,
      brand: formFilters.brand || '',
      minPrice: formFilters.minPrice || null,
      maxPrice: formFilters.maxPrice || null,
      minQuantity: formFilters.minQuantity || null,
      maxQuantity: formFilters.maxQuantity || null,
      inStock: formFilters.inStock !== '' ? formFilters.inStock === 'true' : null,
      isActive: formFilters.isActive === 'true',
      isFeatured: formFilters.isFeatured !== '' ? formFilters.isFeatured === 'true' : null,
      isOnSale: formFilters.isOnSale !== '' ? formFilters.isOnSale === 'true' : null,
      sortBy: formFilters.sortBy || 'createdAt',
      sortOrder: formFilters.sortOrder || 'DESC',
      page: 1,
      limit: 20
    };

    // Use debounced set filters for user input
    this.store.debouncedSetFilters(storeFilters);
  }

  /**
   * Clear all filters
   */
  clearFilters() {
    this.store.clearFilters();
    return this.store.loadProducts();
  }

  /**
   * Delete a product
   */
  async deleteProduct(productId) {
    try {
      await this.store.deleteProduct(productId);
      return { success: true };
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  }

  /**
   * Bulk update products
   */
  async bulkUpdateProducts(productIds, updates) {
    try {
      await this.store.bulkUpdateProducts(productIds, updates);
      return { success: true };
    } catch (error) {
      console.error('Failed to bulk update products:', error);
      throw error;
    }
  }

  /**
   * Bulk delete products
   */
  async bulkDeleteProducts(productIds) {
    try {
      await this.store.bulkDeleteProducts(productIds);
      return { success: true };
    } catch (error) {
      console.error('Failed to bulk delete products:', error);
      throw error;
    }
  }

  /**
   * Export products
   */
  async exportProducts(format = 'csv') {
    try {
      const blob = await this.store.exportProducts(format);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return { success: true };
    } catch (error) {
      console.error('Failed to export products:', error);
      throw error;
    }
  }

  /**
   * Import products
   */
  async importProducts(file, importType = 'upsert') {
    try {
      const result = await this.store.importProducts(file, importType);
      
      // Reload products after import
      await this.store.loadProducts(true); // Force refresh
      
      return result;
    } catch (error) {
      console.error('Failed to import products:', error);
      throw error;
    }
  }

  /**
   * Sync product to Odoo
   */
  async syncToOdoo(productId) {
    try {
      const result = await this.store.syncToOdoo(productId);
      return result;
    } catch (error) {
      console.error('Failed to sync to Odoo:', error);
      throw error;
    }
  }

  /**
   * Change page
   */
  async changePage(page) {
    try {
      await this.store.changePage(page);
      return { success: true };
    } catch (error) {
      console.error('Failed to change page:', error);
      throw error;
    }
  }

  /**
   * Toggle product selection
   */
  toggleProductSelection(productId) {
    this.store.toggleProductSelection(productId);
  }

  /**
   * Select all products 
   */
  selectAllProducts() {
    this.store.selectAllProducts();
  }

  /**
   * Clear selection
   */
  clearSelection() {
    this.store.clearSelection();
  }

  /**
   * Get product analytics
   */
  async getProductAnalytics(productId, period = '30d') {
    try {
      return await this.store.getProductAnalytics(productId, period);
    } catch (error) {
      console.error('Failed to get product analytics:', error);
      throw error;
    }
  }

  /**
   * Create product
   */
  async createProduct(productData) {
    try {
      console.log('📤 Creating product with data:', productData);
      
      const formData = new FormData();
      
      // Add all fields to FormData
      Object.keys(productData).forEach(key => {
        if (key === 'images' && Array.isArray(productData[key])) {
          // Handle images separately
          const imageFiles = productData[key]
            .filter(img => img.file instanceof File)
            .map(img => img.file);
          
          // Add each file to FormData
          imageFiles.forEach((file, index) => {
            formData.append('images', file);
          });
          
          // Add image metadata as JSON
          const imageMetadata = productData[key].map(img => ({
            url: img.url,
            isThumbnail: img.isThumbnail || false
          }));
          formData.append('imageMetadata', JSON.stringify(imageMetadata));
        } else if (typeof productData[key] === 'object' && productData[key] !== null) {
          // Stringify objects
          formData.append(key, JSON.stringify(productData[key]));
        } else if (productData[key] !== undefined && productData[key] !== null) {
          // Add other fields
          formData.append(key, productData[key]);
        }
      });
      
      // Log FormData contents for debugging
      console.log('📋 FormData contents:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ', pair[1]);
      }
      
      const response = await api.post('/admin/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('✅ Product created successfully:', response.data);
      return AdminProductModel.fromApi(response.data.data);
    } catch (error) {
      console.error('❌ Error creating product:', error);
      
      // Log detailed error response
      if (error.response) {
        console.error('📝 Error response data:', error.response.data);
        console.error('📝 Error response status:', error.response.status);
        console.error('📝 Error response headers:', error.response.headers);
      }
      
      throw error;
    }
  }
  
  /**
   * Update product
   */
  async updateProduct(productId, productData) {
    try {
      const product = await this.store.updateProduct(productId, productData);
      return product;
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  }
  
  /**
   * Load product by ID
   */
  async loadProductById(productId) {
    try {
      const product = await this.store.loadProductById(productId);
      return product;
    } catch (error) {
      console.error('Failed to load product:', error);
      throw error;
    }
  }

  /**
   * Get current filters
   */
  getCurrentFilters() {
    return this.store.filters;
  }

  /**
   * Get store state
   */
  getState() {
    return {
      products: this.store.products,
      isLoading: this.store.isLoading,
      error: this.store.error,
      pagination: this.store.pagination,
      bulkSelection: this.store.bulkSelection,
      filters: this.store.filters,
      _isInitialized: this.store._isInitialized
    };
  }

  /**
   * Reset store initialization (for testing or force refresh)
   */
  resetInitialization() {
    this.store.resetInitialization();
  }

  /**
   * Manually load products with optional force refresh
   */
  async loadProducts(forceRefresh = false) {
    return await this.store.loadProducts(forceRefresh);
  }

  // ==================== IMAGE MANAGEMENT METHODS ====================

  /**
   * Upload product images
   */
  async uploadProductImages(productId, files) {
    try {
      const result = await AdminProductService.uploadProductImages(productId, files);
      // Refresh product data
      await this.store.loadProductById(productId);
      return result;
    } catch (error) {
      console.error('Failed to upload images:', error);
      throw error;
    }
  }

  /**
   * Set product thumbnail
   */
  async setProductThumbnail(productId, imageUrl) {
    try {
      const result = await AdminProductService.setProductThumbnail(productId, imageUrl);
      // Refresh product data
      await this.store.loadProductById(productId);
      return result;
    } catch (error) {
      console.error('Failed to set thumbnail:', error);
      throw error;
    }
  }

  /**
   * Delete product image
   */
  async deleteProductImage(productId, imageUrl) {
    try {
      const result = await AdminProductService.deleteProductImage(productId, imageUrl);
      // Refresh product data
      await this.store.loadProductById(productId);
      return result;
    } catch (error) {
      console.error('Failed to delete image:', error);
      throw error;
    }
  }

  /**
   * Get product images
   */
  async getProductImages(productId) {
    try {
      return await AdminProductService.getProductImages(productId);
    } catch (error) {
      console.error('Failed to get product images:', error);
      throw error;
    }
  }

  /**
   * Debug: Get raw product data (for troubleshooting)
   */
  async debugGetProductData(productId) {
    try {
      const response = await api.get(`/products/${productId}?raw=true`);
      console.log('🔍 Raw product data:', {
        id: productId,
        images: response.data.data.images,
        imagesType: typeof response.data.data.images,
        thumbnail: response.data.data.thumbnail
      });
      return response.data.data;
    } catch (error) {
      console.error('Debug failed:', error);
      throw error;
    }
  }
}

export default AdminProductController;


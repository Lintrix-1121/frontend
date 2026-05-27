class ProductController {
  constructor(productStore, cartStore) {
    this.productStore = productStore;
    this.cartStore = cartStore;
  }

  // Initialize products page
  async initializeProductsPage() {
    await this.productStore.loadCategories();
    await this.productStore.loadProducts();
    await this.productStore.loadFeaturedProducts();
    await this.productStore.loadSaleProducts();
    await this.cartStore.loadCart();
  }

  // Initialize product detail page
  async initializeProductDetailPage(productId) {
    await this.productStore.loadProductById(productId);
    await this.productStore.loadRelatedProducts(productId);
    await this.cartStore.loadCart();
  }

  // Apply filters
  async applyFilters(filters) {
    this.productStore.setFilters(filters);
    await this.productStore.loadProducts();
  } 

  // Clear filters
  async clearFilters() {
    this.productStore.clearFilters();
    await this.productStore.loadProducts();
  }

  // Select category
  async selectCategory(category) {
    this.productStore.setSelectedCategory(category);
    this.productStore.setFilters({ categoryId: category?.id || null });
    await this.productStore.loadProducts();
  }

  // Add product to cart
 async addToCart(product) {
  try {
    console.log('ProductController.addToCart called with:', product);
    
    // Just pass the product object to cartStore
    return await this.cartStore.addToCart(product, 1);
    
    } catch (error) {
      console.error('ProductController.addToCart error:', error);
      throw error;
    }
  }

  // Search products
  async searchProducts(query) {
    await this.productStore.searchProducts(query);
  }

  // Sort products
  async sortProducts(sortBy, sortOrder = 'DESC') {
    await this.productStore.sortProducts(sortBy, sortOrder);
  }

  // Change page
  async changePage(page) {
    await this.productStore.changePage(page);
  }

  // Load products by category
  async loadProductsByCategory(categorySlug) {
    await this.productStore.loadProductsByCategory(categorySlug);
  }

  // Get product thumbnail URL (helper for views)
  getProductThumbnail(product) {
    return this.productStore.getProductThumbnail(product);
  }

  // Get product images
  getProductImages(product) {
    if (!product || !product.images) return [];
    
    // Ensure images is an array
    let images = product.images;
    if (typeof images === 'string') {
      try {
        images = JSON.parse(images);
      } catch (error) {
        console.warn('Failed to parse images:', error);
        images = [];
      }
    }
    
    // Convert to array of URLs
    return images.map(img => {
      if (typeof img === 'string') {
        return img;
      } else if (img && img.url) {
        return img.url;
      }
      return null;
    }).filter(url => url);
  }

  // Get main image (thumbnail or first image)
  getMainImage(product) {
    if (!product) return 'https://via.placeholder.com/400';
    
    // Try thumbnail first
    if (product.thumbnail && product.thumbnail !== 'null') {
      return product.thumbnail;
    }
    
    // Try images array
    const images = this.getProductImages(product);
    if (images.length > 0) {
      return images[0];
    }
    
    return 'https://via.placeholder.com/400';
  }

  // Get current filters
  getCurrentFilters() {
    return this.productStore.filters;
  }

  // Get cart item count
  getCartItemCount() {
    return this.cartStore.cart.itemCount;
  }

  // Get product store state
  getProductState() {
    return {
      products: this.productStore.products,
      featuredProducts: this.productStore.featuredProducts,
      saleProducts: this.productStore.saleProducts,
      relatedProducts: this.productStore.relatedProducts,
      selectedProduct: this.productStore.selectedProduct,
      categories: this.productStore.categories,
      selectedCategory: this.productStore.selectedCategory,
      isLoading: this.productStore.isLoading,
      error: this.productStore.error,
      pagination: this.productStore.pagination
    };
  }

  // Clear selected product
  clearSelectedProduct() {
    this.productStore.clearSelectedProduct();
  }

  // Clear related products
  clearRelatedProducts() {
    this.productStore.clearRelatedProducts();
  }
}

export default ProductController;






































// // src/controllers/ProductController.js
// class ProductController {
//   constructor(productStore, cartStore) {
//     this.productStore = productStore;
//     this.cartStore = cartStore;
//   }

//   // Initialize products page with optional category slug
//   async initializeProductsPage(categorySlug = null) {
//     try {
//       console.log('🎯 Controller: Initializing products page', categorySlug ? `for category: ${categorySlug}` : '');
      
//       // Set current category slug in store
//       if (categorySlug) {
//         this.productStore.setCurrentCategorySlug(categorySlug);
//       }
      
//       // Load categories first
//       await this.productStore.loadCategories();
      
//       // If categorySlug is provided, load products for that category
//       if (categorySlug) {
//         await this.productStore.loadProductsByCategory(categorySlug);
//       } else {
//         // Load all products
//         await this.productStore.loadProducts();
//       }
      
//       // Load featured and sale products in parallel
//       await Promise.all([
//         this.productStore.loadFeaturedProducts(),
//         this.productStore.loadSaleProducts()
//       ]);
      
//       // Load cart if not loaded
//       if (!this.cartStore.isInitialized) {
//         await this.cartStore.loadCart();
//       }
      
//     } catch (error) {
//       console.error('❌ Controller Error initializing products page:', error);
//       throw error;
//     }
//   }

//   // Initialize product detail page
//   async initializeProductDetailPage(productId) {
//     try {
//       await this.productStore.loadProductById(productId);
//       await this.productStore.loadRelatedProducts(productId);
//       await this.cartStore.loadCart();
//     } catch (error) {
//       console.error('❌ Controller Error initializing product detail page:', error);
//       throw error;
//     }
//   }

//   // Apply filters
//   async applyFilters(filters) {
//     this.productStore.setFilters(filters);
//     await this.productStore.loadProducts();
//   }

//   // Clear filters
//   async clearFilters() {
//     this.productStore.clearFilters();
//     await this.productStore.loadProducts();
//   }

//   // Select category by object
//   async selectCategory(category) {
//     try {
//       this.productStore.setSelectedCategory(category);
      
//       if (category && category.slug) {
//         // Update URL or reload with category slug
//         window.history.pushState({}, '', `/category/${category.slug}`);
//         await this.productStore.loadProductsByCategory(category.slug);
//       } else {
//         // Navigate to all products
//         window.history.pushState({}, '', '/products');
//         await this.productStore.loadProducts();
//       }
//     } catch (error) {
//       console.error('❌ Controller Error selecting category:', error);
//       throw error;
//     }
//   }

//   // Load products by category slug (for direct navigation)
//   async loadProductsByCategory(categorySlug) {
//     try {
//       await this.productStore.loadProductsByCategory(categorySlug);
//     } catch (error) {
//       console.error('❌ Controller Error loading products by category:', error);
//       throw error;
//     }
//   }

//   // Add product to cart
//   async addToCart(product) {
//     try {
//       console.log('🛒 Controller: Adding product to cart:', product.name);
//       return await this.cartStore.addToCart(product, 1);
//     } catch (error) {
//       console.error('❌ Controller Error adding to cart:', error);
//       throw error;
//     }
//   }

//   // Search products
//   async searchProducts(query) {
//     try {
//       await this.productStore.searchProducts(query);
//     } catch (error) {
//       console.error('❌ Controller Error searching products:', error);
//       throw error;
//     }
//   }

//   // Sort products
//   async sortProducts(sortBy, sortOrder = 'DESC') {
//     try {
//       await this.productStore.sortProducts(sortBy, sortOrder);
//     } catch (error) {
//       console.error('❌ Controller Error sorting products:', error);
//       throw error;
//     }
//   }

//   // Change page
//   async changePage(page) {
//     try {
//       await this.productStore.changePage(page);
//     } catch (error) {
//       console.error('❌ Controller Error changing page:', error);
//       throw error;
//     }
//   }

//   // Get product thumbnail URL (helper for views)
//   getProductThumbnail(product) {
//     return this.productStore.getProductThumbnail(product);
//   }

//   // Get product images
//   getProductImages(product) {
//     if (!product || !product.images) return [];
    
//     // Ensure images is an array
//     let images = product.images;
//     if (typeof images === 'string') {
//       try {
//         images = JSON.parse(images);
//       } catch (error) {
//         console.warn('Failed to parse images:', error);
//         images = [];
//       }
//     }
    
//     // Convert to array of URLs
//     return images.map(img => {
//       if (typeof img === 'string') {
//         return img;
//       } else if (img && img.url) {
//         return img.url;
//       }
//       return null;
//     }).filter(url => url);
//   }

//   // Get main image (thumbnail or first image)
//   getMainImage(product) {
//     if (!product) return 'https://via.placeholder.com/400';
    
//     // Try thumbnail first
//     if (product.thumbnail && product.thumbnail !== 'null') {
//       return product.thumbnail;
//     }
    
//     // Try images array
//     const images = this.getProductImages(product);
//     if (images.length > 0) {
//       return images[0];
//     }
    
//     return 'https://via.placeholder.com/400';
//   }

//   // Get current filters
//   getCurrentFilters() {
//     return this.productStore.filters;
//   }

//   // Get cart item count
//   getCartItemCount() {
//     return this.cartStore.cart?.itemCount || 0;
//   }

//   // Get product store state
//   getProductState() {
//     return {
//       products: this.productStore.products,
//       featuredProducts: this.productStore.featuredProducts,
//       saleProducts: this.productStore.saleProducts,
//       relatedProducts: this.productStore.relatedProducts,
//       selectedProduct: this.productStore.selectedProduct,
//       categories: this.productStore.categories,
//       allCategoriesFlat: this.productStore.allCategoriesFlat,
//       selectedCategory: this.productStore.selectedCategory,
//       currentCategorySlug: this.productStore.currentCategorySlug,
//       isLoading: this.productStore.isLoading,
//       error: this.productStore.error,
//       pagination: this.productStore.pagination
//     };
//   }

//   // Clear selected product
//   clearSelectedProduct() {
//     this.productStore.clearSelectedProduct();
//   }

//   // Clear related products
//   clearRelatedProducts() {
//     this.productStore.clearRelatedProducts();
//   }

//   // Get category by slug
//   getCategoryBySlug(slug) {
//     return this.productStore.getCategoryBySlug(slug);
//   }
// }

// export default ProductController;
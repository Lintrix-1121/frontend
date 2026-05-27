import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import AdminProductService from '../../services/admin/AdminProductService';
import { debounce } from 'lodash';

// Helper function to parse product images
// Update the parseProductImages function in your store
// In useAdminProductStore.js, update the parseProductImages function:
const parseProductImages = (product) => {
  if (!product) return product;
  
  console.log('🔄 Parsing product images for product:', product.id);
  
  const processedProduct = { ...product };
  
  // Parse images if they're a string
  if (processedProduct.images && typeof processedProduct.images === 'string') {
    try {
      processedProduct.images = JSON.parse(processedProduct.images);
    } catch (error) {
      console.warn('Failed to parse images string for product:', processedProduct.id, error);
      processedProduct.images = [];
    }
  } else if (!processedProduct.images) {
    processedProduct.images = [];
  }
  
  // Define backend URL - MAKE SURE THIS MATCHES YOUR BACKEND
  const BACKEND_URL = 'http://localhost:2090'; // Update this
  
  // Convert thumbnail URL to absolute
  if (processedProduct.thumbnail && typeof processedProduct.thumbnail === 'string') {
    // If it's a relative URL starting with /
    if (processedProduct.thumbnail.startsWith('/') && !processedProduct.thumbnail.startsWith('//')) {
      processedProduct.thumbnail = `${BACKEND_URL}${processedProduct.thumbnail}`;
    }
    console.log('🔧 Processed thumbnail URL:', processedProduct.thumbnail);
  }
  
  // Convert all image URLs in the images array to absolute
  if (Array.isArray(processedProduct.images)) {
    processedProduct.images = processedProduct.images.map(img => {
      if (typeof img === 'string') {
        if (img.startsWith('/') && !img.startsWith('//')) {
          return `${BACKEND_URL}${img}`;
        }
        return img;
      } else if (img && typeof img === 'object' && img.url) {
        return {
          ...img,
          url: img.url.startsWith('/') && !img.url.startsWith('//') ? 
               `${BACKEND_URL}${img.url}` : img.url
        };
      }
      return img;
    });
  }
  
  // Set thumbnail from images if missing or invalid
  if (!processedProduct.thumbnail || 
      processedProduct.thumbnail === 'null' || 
      processedProduct.thumbnail === 'undefined') {
    
    if (processedProduct.images && processedProduct.images.length > 0) {
      const thumbnailImage = processedProduct.images.find(img => img.isThumbnail) || processedProduct.images[0];
      
      if (thumbnailImage) {
        const url = thumbnailImage.url || thumbnailImage;
        processedProduct.thumbnail = url;
      }
    }
  }
  
  // Fallback thumbnail
  if (!processedProduct.thumbnail || 
      processedProduct.thumbnail === 'null' || 
      processedProduct.thumbnail === 'undefined') {
    
    processedProduct.thumbnail = 'https://via.placeholder.com/400';
  }
  
  return processedProduct;
};


// Helper to parse array of products
const parseProductImagesArray = (products) => {
  if (!Array.isArray(products)) return [];
  return products.map(parseProductImages);
};

const useAdminProductStore = create(
  devtools((set, get) => ({
    products: [],
    selectedProduct: null,
    filters: {
      search: '',
      categoryId: null,
      brand: '',
      minPrice: null,
      maxPrice: null,
      minQuantity: null,
      maxQuantity: null,
      inStock: null,
      isActive: false,
      isFeatured: null,
      isOnSale: null,
      sortBy: 'createdAt',
      sortOrder: 'DESC',
      page: 1,
      limit: 20
    },
    pagination: {
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      pageSize: 20 
    },
    isLoading: false,
    isInitializing: false,
    error: null,
    bulkSelection: [],
    importResult: null,
    cache: new Map(),
    cacheTimeout: 5 * 60 * 1000, // 5 minutes

    // Initialize flag to prevent re-initialization
    _isInitialized: false,

    // Set filters without debounce (for initialization)
    setFilters: (newFilters) => {
      set(state => ({
        filters: { ...state.filters, ...newFilters, page: 1 }
      }));
    },

    // Debounced filter application for user input
    debouncedSetFilters: debounce((newFilters) => {
      const { filters } = get();
      // Only update if filters actually changed
      if (JSON.stringify({ ...filters, ...newFilters, page: 1 }) !== JSON.stringify(filters)) {
        set(state => ({
          filters: { ...state.filters, ...newFilters, page: 1 }
        }));
        get().loadProducts();
      }
    }, 500),

    // Manual load for immediate refresh
    setFiltersImmediate: (newFilters) => {
      set(state => ({
        filters: { ...state.filters, ...newFilters, page: 1 }
      }));
      return get().loadProducts();
    },

    // Clear filters
    clearFilters: () => {
      set({
        filters: {
          search: '',
          categoryId: null,
          brand: '',
          minPrice: null,
          maxPrice: null,
          minQuantity: null,
          maxQuantity: null,
          inStock: null,
          isActive: true,
          isFeatured: null,
          isOnSale: null,
          sortBy: 'createdAt',
          sortOrder: 'DESC',
          page: 1,
          limit: 20
        },
      });
    },


    loadProducts: async (forceRefresh = false) => {
      console.log('🚀 loadProducts called, forceRefresh:', forceRefresh);
      
      try {
        const { filters, cache, cacheTimeout } = get();
        
        // Create cache key from filters
        const cacheKey = JSON.stringify(filters);
        
        const cached = cache.get(cacheKey);
        
        // Return cached data if valid and not forcing refresh
        if (!forceRefresh && cached && Date.now() - cached.timestamp < cacheTimeout) {
          console.log('✅ Using cached data');
          set({
            products: cached.products,
            pagination: cached.pagination,
            isLoading: false
          });
          return;
        }
        
        console.log('🔄 Fetching from server...');
        set({ isLoading: true, error: null });
        
        const result = await AdminProductService.getProducts(filters);
        console.log('📥 Server response received');
        
        // DEEP DEBUG LOGGING - Add this
        console.log('🔍 DEEP DEBUG - First product raw data:', {
          rawFirstProduct: result.products?.[0],
          imagesRaw: result.products?.[0]?.images,
          imagesType: typeof result.products?.[0]?.images,
          thumbnailRaw: result.products?.[0]?.thumbnail,
          thumbnailType: typeof result.products?.[0]?.thumbnail,
          productKeys: Object.keys(result.products?.[0] || {})
        });
        
        // Parse images for each product
        const processedProducts = parseProductImagesArray(result.products || []);
        
        // DEBUG: Log processed data
        console.log('🔍 DEEP DEBUG - First product processed:', {
          processedProduct: processedProducts[0],
          processedImages: processedProducts[0]?.images,
          processedThumbnail: processedProducts[0]?.thumbnail,
          imagesAfterParse: processedProducts[0]?.images,
          imagesArrayCheck: Array.isArray(processedProducts[0]?.images)
        });
        
        // Update cache with processed products
        cache.set(cacheKey, {
          products: processedProducts,
          pagination: result.pagination,
          timestamp: Date.now()
        });
        
        set({
          products: processedProducts,
          pagination: result.pagination,
          isLoading: false,
          cache,
          _isInitialized: true
        });
        
        console.log('✅ Data loaded successfully');
        
        return processedProducts;
      } catch (error) {
        console.error('❌ Error loading products:', error);
        set({ error: error.message, isLoading: false });
        throw error;
      }
    },

    // Initialize products (only once)
    initializeProducts: async () => {
      const { _isInitialized, isLoading } = get();
      
      // Skip if already initialized or currently loading
      if (_isInitialized || isLoading) return;
      
      // Set initialization flag immediately
      set({ _isInitialized: false, isLoading: true });
      
      try {
        await get().loadProducts();
      } catch (error) {
        // Reset initialization flag on error
        set({ _isInitialized: false, error: error.message, isLoading: false });
        throw error;
      }
    },

    // Reset initialization (for when you want to force re-initialization)
    resetInitialization: () => {
      set({ _isInitialized: false });
    },

    // Load product by ID with image parsing
    loadProductById: async (productId) => {
      try {
        set({ isLoading: true, error: null });
        const product = await AdminProductService.getProductById(productId);
        const processedProduct = parseProductImages(product);
        set({ selectedProduct: processedProduct, isLoading: false });
        return processedProduct;
      } catch (error) {
        set({ error: error.message, isLoading: false });
        throw error;
      }
    },

    // Create product
    createProduct: async (productData) => {
      try {
        set({ isLoading: true, error: null });
        const product = await AdminProductService.createProduct(productData);
        const processedProduct = parseProductImages(product);
        
        set(state => ({
          products: [processedProduct, ...state.products],
          selectedProduct: processedProduct,
          isLoading: false
        }));
        
        // Clear cache since data changed
        set({ cache: new Map() });
        return processedProduct;
      } catch (error) {
        set({ error: error.message, isLoading: false });
        throw error;
      }
    },



    updateProduct: async (productId, productData) => {
      const { products } = get();
      
      // First, try to find in current products
      let currentProduct = products.find(p => p.id === productId);
      
      // If not found, fetch it from the API
      if (!currentProduct) {
        console.log(`🔄 Product ${productId} not in store, fetching...`);
        try {
          currentProduct = await AdminProductService.getProductById(productId);
        } catch (fetchError) {
          throw new Error(`Product ${productId} not found and could not be fetched: ${fetchError.message}`);
        }
      }
      
      const optimisticProduct = parseProductImages({ ...currentProduct, ...productData });
      
      set(state => ({
        products: state.products.map(p => 
          p.id === productId ? optimisticProduct : p
        ),
        selectedProduct: optimisticProduct,
        isLoading: true,
        error: null
      }));
      
      try {
        const product = await AdminProductService.updateProduct(productId, productData);
        const processedProduct = parseProductImages(product);
        
        set(state => ({
          products: state.products.map(p => 
            p.id === productId ? processedProduct : p
          ),
          selectedProduct: processedProduct,
          isLoading: false
        }));
        
        // Clear cache since data changed
        set({ cache: new Map() });
        return processedProduct;
      } catch (error) {
        // Rollback on error
        set(state => ({
          products: state.products.map(p => 
            p.id === productId ? currentProduct : p
          ),
          selectedProduct: currentProduct,
          error: error.message,
          isLoading: false
        }));
        throw error;
      }
    },
    // Optimistic update for product with image parsing


    // updateProduct: async (productId, productData) => {
    //   const { products } = get();
      
    //   const currentProduct = products.find(p => p.id === productId);
    //   if (!currentProduct) throw new Error('Product not found');
      
    //   const optimisticProduct = parseProductImages({ ...currentProduct, ...productData });
      
    //   set(state => ({
    //     products: state.products.map(p => 
    //       p.id === productId ? optimisticProduct : p
    //     ),
    //     selectedProduct: optimisticProduct,
    //     isLoading: true,
    //     error: null
    //   }));
      
    //   try {
    //     const product = await AdminProductService.updateProduct(productId, productData);
    //     const processedProduct = parseProductImages(product);
        
    //     set(state => ({
    //       products: state.products.map(p => 
    //         p.id === productId ? processedProduct : p
    //       ),
    //       selectedProduct: processedProduct,
    //       isLoading: false
    //     }));
        
    //     // Clear cache since data changed
    //     set({ cache: new Map() });
    //     return processedProduct;
    //   } catch (error) {
    //     // Rollback on error
    //     set(state => ({
    //       products: state.products.map(p => 
    //         p.id === productId ? currentProduct : p
    //       ),
    //       selectedProduct: currentProduct,
    //       error: error.message,
    //       isLoading: false
    //     }));
    //     throw error;
    //   }
    // },

    // Delete product
    deleteProduct: async (productId) => {
      try {
        set({ isLoading: true, error: null });
        await AdminProductService.deleteProduct(productId);
        set(state => ({
          products: state.products.filter(p => p.id !== productId),
          selectedProduct: null,
          isLoading: false
        }));
        // Clear cache since data changed
        set({ cache: new Map() });
      } catch (error) {
        set({ error: error.message, isLoading: false });
        throw error;
      }
    },

    // Bulk update with image parsing
    bulkUpdateProducts: async (productIds, updates) => {
      try {
        set({ isLoading: true, error: null });
        await AdminProductService.bulkUpdateProducts(productIds, updates);
        
        // Parse images for updated products
        set(state => ({
          products: state.products.map(p => 
            productIds.includes(p.id) ? parseProductImages({ ...p, ...updates }) : p
          ),
          bulkSelection: [],
          isLoading: false
        }));
        
        // Clear cache since data changed
        set({ cache: new Map() });
      } catch (error) {
        set({ error: error.message, isLoading: false });
        throw error;
      }
    },

    // Bulk delete
    bulkDeleteProducts: async (productIds) => {
      try {
        set({ isLoading: true, error: null });
        for (const productId of productIds) {
          await AdminProductService.deleteProduct(productId);
        }
        
        set(state => ({
          products: state.products.filter(p => !productIds.includes(p.id)),
          bulkSelection: [],
          isLoading: false
        }));
        
        // Clear cache since data changed
        set({ cache: new Map() });
      } catch (error) {
        set({ error: error.message, isLoading: false });
        throw error;
      }
    },

    // Toggle product selection
    toggleProductSelection: (productId) => {
      set(state => {
        const isSelected = state.bulkSelection.includes(productId);
        return {
          bulkSelection: isSelected
            ? state.bulkSelection.filter(id => id !== productId)
            : [...state.bulkSelection, productId]
        };
      });
    },

    // Select all products
    selectAllProducts: () => {
      const { products } = get();
      set({ bulkSelection: products.map(p => p.id) });
    },

    // Clear selection
    clearSelection: () => {
      set({ bulkSelection: [] });
    },

    // Import products
    importProducts: async (file, importType = 'upsert') => {
      try {
        set({ isLoading: true, error: null, importResult: null });
        const result = await AdminProductService.importProducts(file, importType);
        set({ importResult: result, isLoading: false });
        // Clear cache since data changed
        set({ cache: new Map() });
        return result;
      } catch (error) {
        set({ error: error.message, isLoading: false });
        throw error;
      }
    },

    // Export products
    exportProducts: async (format = 'csv') => {
      try {
        const { filters } = get();
        return await AdminProductService.exportProducts(format, filters);
      } catch (error) {
        set({ error: error.message });
        throw error;
      }
    },

    // Sync to Odoo
    syncToOdoo: async (productId) => {
      try {
        set({ isLoading: true, error: null });
        const result = await AdminProductService.syncToOdoo(productId);
        
        set(state => ({
          products: state.products.map(p => 
            p.id === productId 
              ? parseProductImages({ 
                  ...p, 
                  odooProductId: result.data.odooProductId,
                  lastSyncedAt: new Date()
                })
              : p
          ),
          isLoading: false
        }));
        
        return result;
      } catch (error) {
        set({ error: error.message, isLoading: false });
        throw error;
      }
    },

    // Get product analytics
    getProductAnalytics: async (productId, period = '30d') => {
      try {
        return await AdminProductService.getProductAnalytics(productId, period);
      } catch (error) {
        set({ error: error.message });
        throw error;
      }
    },

    // Change page
    changePage: async (page) => {
      const { filters } = get();
      set(state => ({
        filters: { ...state.filters, page }
      }));
      await get().loadProducts();
    },

    // Clear selected product
    clearSelectedProduct: () => {
      set({ selectedProduct: null });
    },

    // Clear error
    clearError: () => {
      set({ error: null });
    },

    clearCache: () => {
      set({ cache: new Map() });
    },

    // Helper method to manually parse images (useful for debugging)
    parseProductImagesManually: (product) => {
      return parseProductImages(product);
    }

  }))
);

export default useAdminProductStore;


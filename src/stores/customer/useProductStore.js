import { create } from 'zustand';
import ProductService from '../../services/ProductService';

// Helper function to parse product images
const parseProductImages = (product) => {
  if (!product) return product;
  
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
  
  // Define backend URL
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:2090';
  
  // Convert thumbnail URL to absolute
  if (processedProduct.thumbnail && typeof processedProduct.thumbnail === 'string') {
    const thumbnail = processedProduct.thumbnail.trim();
    
    // Skip if already absolute URL
    if (thumbnail.startsWith('http')) {
      // Already absolute URL, keep as is
    } else {
      // Remove /api/ prefix if present
      let cleanThumbnail = thumbnail;
      if (cleanThumbnail.startsWith('/api/')) {
        cleanThumbnail = cleanThumbnail.replace(/^\/api\//, '/');
      }
      
      // Convert relative URL to absolute
      if (cleanThumbnail.startsWith('/')) {
        processedProduct.thumbnail = `${BACKEND_URL}${cleanThumbnail}`;
      } else {
        // Add slash if missing
        processedProduct.thumbnail = `${BACKEND_URL}/${cleanThumbnail}`;
      }
    }
  }
  
  // Convert all image URLs in the array to absolute
  if (Array.isArray(processedProduct.images)) {
    processedProduct.images = processedProduct.images.map(img => {
      if (typeof img === 'string') {
        let url = img.trim();
        // Skip if already absolute
        if (url.startsWith('http')) {
          return url;
        }
        // Remove /api/ prefix
        if (url.startsWith('/api/')) {
          url = url.replace(/^\/api\//, '/');
        }
        // Convert to absolute URL
        if (url.startsWith('/')) {
          return `${BACKEND_URL}${url}`;
        }
        return `${BACKEND_URL}/${url}`;
      } else if (img && typeof img === 'object' && img.url) {
        let url = img.url.trim();
        // Skip if already absolute
        if (url.startsWith('http')) {
          return { ...img, url };
        }
        // Remove /api/ prefix
        if (url.startsWith('/api/')) {
          url = url.replace(/^\/api\//, '/');
        }
        // Convert to absolute URL
        if (url.startsWith('/')) {
          url = `${BACKEND_URL}${url}`;
        } else {
          url = `${BACKEND_URL}/${url}`;
        }
        return { ...img, url };
      }
      return img;
    });
  }
  
  // Set thumbnail from images if missing or invalid
  if (!processedProduct.thumbnail || 
      processedProduct.thumbnail === 'null' || 
      processedProduct.thumbnail === 'undefined' ||
      processedProduct.thumbnail === '') {
    
    if (processedProduct.images && processedProduct.images.length > 0) {
      const thumbnailImage = processedProduct.images.find(img => img.isThumbnail) || 
                           processedProduct.images.find(img => img.isPrimary) || 
                           processedProduct.images[0];
      
      if (thumbnailImage) {
        const url = thumbnailImage.url || thumbnailImage;
        // Convert to absolute URL if needed
        if (url && !url.startsWith('http') && url.startsWith('/')) {
          processedProduct.thumbnail = `${BACKEND_URL}${url}`;
        } else {
          processedProduct.thumbnail = url;
        }
      }
    }
  }
  
  // Fallback thumbnail
  if (!processedProduct.thumbnail || 
      processedProduct.thumbnail === 'null' || 
      processedProduct.thumbnail === 'undefined' ||
      processedProduct.thumbnail.length < 5) {
    
    processedProduct.thumbnail = 'https://via.placeholder.com/400';
  }
  
  return processedProduct;
};

// Helper to parse array of products
const parseProductImagesArray = (products) => {
  if (!Array.isArray(products)) return [];
  return products.map(parseProductImages);
};

const useProductStore = create((set, get) => ({
  products: [],
  categories: [],
  featuredProducts: [],
  saleProducts: [],
  relatedProducts: [],
  selectedCategory: null,
  selectedProduct: null,
  filters: {
    categoryId: null,
    subCategoryId: null,
    minPrice: null,
    maxPrice: null,
    brand: null,
    search: '',
    tags: [],
    isFeatured: false,
    isOnSale: false,
    inStock: false,
    isActive: true,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
    page: 1,
    limit: 15
  },
  pagination: {
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 15,
    hasNextPage: false,
    hasPreviousPage: false
  },
  isLoading: false,
  isInitialized: false,
  error: null,

  // Initialize store
  initialize: async () => {
    try {
      console.log('🔄 Product Store: Initializing...');
      set({ isLoading: true, error: null });
      
      // Load categories first
      await get().loadCategories();
      
      // Load products with default filters
      await get().loadProducts();
      
      // Load featured and sale products in parallel
      await Promise.all([
        get().loadFeaturedProducts(),
        get().loadSaleProducts()
      ]);
      
      set({ isInitialized: true, isLoading: false });
      console.log('✅ Product Store: Initialized successfully');
      
    } catch (error) {
      console.error('❌ Product Store: Failed to initialize:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  // Set filters
  setFilters: (newFilters) => {
    console.log('🎛️ Store: Setting filters:', newFilters);
    set(state => ({
      filters: { ...state.filters, ...newFilters, page: 1 } // Reset to page 1 when filters change
    }));
  },

  // Clear filters
  clearFilters: () => {
    console.log('🎛️ Store: Clearing filters');
    set({
      filters: {
        categoryId: null,
        subCategoryId: null,
        minPrice: null,
        maxPrice: null,
        brand: null,
        search: '',
        tags: [],
        isFeatured: false,
        isOnSale: false,
        inStock: false,
        isActive: true,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
        page: 1,
        limit: 15
      }
    });
  },

  // Set selected category
  setSelectedCategory: (category) => {
    console.log('🎯 Store: Setting selected category:', category?.name);
    set({ selectedCategory: category });
  },

  // Load products with current filters
  loadProducts: async () => {
    try {
      const { filters } = get();
      console.log('🛒 Store: Loading products with filters:', filters);
      set({ isLoading: true, error: null });
      
      const result = await ProductService.getProducts(filters);
      console.log('🛒 Store: Service returned result:', result);
      
      // Handle undefined result
      if (!result) {
        console.warn('⚠️ Store: ProductService returned undefined result');
        set({
          products: [],
          pagination: get().pagination,
          isLoading: false
        });
        return;
      }
      
      // Parse images for each product
      const processedProducts = parseProductImagesArray(result.products || []);
      console.log('🛒 Store: Processed products:', processedProducts.length);
      
      set({
        products: processedProducts,
        pagination: result.pagination || get().pagination,
        isLoading: false
      });
      
    } catch (error) {
      console.error('❌ Store Error loading products:', error);
      set({ 
        error: error.message, 
        isLoading: false,
        products: []
      });
    }
  },
 
  // Load single product by ID
  loadProductById: async (productId) => {
    try {
      console.log('🛒 Store: Loading product by ID:', productId);
      set({ isLoading: true, error: null });
      const product = await ProductService.getProductById(productId);
      const processedProduct = parseProductImages(product);
      
      console.log('🛒 Store: Product loaded:', processedProduct.name);
      
      set({
        selectedProduct: processedProduct,
        isLoading: false
      });
      
      return processedProduct;
    } catch (error) {
      console.error('❌ Store Error loading product by ID:', error);
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Load categories
  loadCategories: async () => {
    try {
      console.log('📂 Store: Loading categories...');
      set({ isLoading: true, error: null });
      const categories = await ProductService.getCategories();
      console.log('📂 Store: Categories loaded:', categories.length);
      set({ categories, isLoading: false });
    } catch (error) {
      console.error('❌ Store Error loading categories:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  // Load featured products
  loadFeaturedProducts: async (limit = 10) => {
    try {
      console.log('⭐ Store: Loading featured products...');
      set({ isLoading: true, error: null });
      const featuredProducts = await ProductService.getFeaturedProducts(limit);
      const processedProducts = parseProductImagesArray(featuredProducts || []);
      console.log('⭐ Store: Featured products loaded:', processedProducts.length);
      set({ featuredProducts: processedProducts, isLoading: false });
    } catch (error) {
      console.error('❌ Store Error loading featured products:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  // Load sale products
  loadSaleProducts: async (limit = 10) => {
    try {
      console.log('💰 Store: Loading sale products...');
      set({ isLoading: true, error: null });
      const saleProducts = await ProductService.getSaleProducts(limit);
      const processedProducts = parseProductImagesArray(saleProducts || []);
      console.log('💰 Store: Sale products loaded:', processedProducts.length);
      set({ saleProducts: processedProducts, isLoading: false });
    } catch (error) {
      console.error('❌ Store Error loading sale products:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  // Load related products
  loadRelatedProducts: async (productId, limit = 5) => {
    try {
      console.log('🔄 Store: Loading related products for:', productId);
      set({ isLoading: true, error: null });
      const relatedProducts = await ProductService.getRelatedProducts(productId, limit);
      const processedProducts = parseProductImagesArray(relatedProducts || []);
      console.log('🔄 Store: Related products loaded:', processedProducts.length);
      set({ relatedProducts: processedProducts, isLoading: false });
    } catch (error) {
      console.error('❌ Store Error loading related products:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  // Load products by category
  loadProductsByCategory: async (categorySlug) => {
    try {
      const { filters } = get();
      console.log('📂 Store: Loading products by category:', categorySlug);
      set({ isLoading: true, error: null });
      
      const result = await ProductService.getProductsByCategory(categorySlug, filters);
      
      // Parse images for products
      const processedProducts = parseProductImagesArray(result.products || []);
      console.log('📂 Store: Category products loaded:', processedProducts.length);
      
      set({
        products: processedProducts,
        selectedCategory: result.category,
        categories: [result.category, ...(result.subCategories || [])],
        pagination: result.pagination,
        isLoading: false
      });
    } catch (error) {
      console.error('❌ Store Error loading category products:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  // Search products
  searchProducts: async (query) => {
    try {
      const { filters } = get();
      console.log('🔍 Store: Searching products for:', query);
      set({ isLoading: true, error: null });
      
      const result = await ProductService.searchProducts(query, {
        page: filters.page,
        limit: filters.limit
      });
      
      // Parse images for products
      const processedProducts = parseProductImagesArray(result.products || []);
      console.log('🔍 Store: Search results:', processedProducts.length);
      
      set({
        products: processedProducts,
        pagination: result.pagination,
        filters: { ...filters, search: query },
        isLoading: false
      });
    } catch (error) {
      console.error('❌ Store Error searching products:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  // Change page
  changePage: async (page) => {
    console.log('📄 Store: Changing to page:', page);
    const { filters } = get();
    set(state => ({
      filters: { ...state.filters, page }
    }));
    await get().loadProducts();
  },

  // Sort products
  sortProducts: async (sortBy, sortOrder = 'DESC') => {
    console.log('📊 Store: Sorting by:', sortBy, sortOrder);
    const { filters } = get();
    set(state => ({
      filters: { ...state.filters, sortBy, sortOrder, page: 1 }
    }));
    await get().loadProducts();
  },

  // Clear selected product
  clearSelectedProduct: () => {
    console.log('❌ Store: Clearing selected product');
    set({ selectedProduct: null });
  },

  // Clear related products
  clearRelatedProducts: () => {
    console.log('❌ Store: Clearing related products');
    set({ relatedProducts: [] });
  },

  // Helper to get thumbnail URL (for components)
  getProductThumbnail: (product) => {
    if (!product) return 'https://via.placeholder.com/400';
    
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:2090';
    
    if (product.thumbnail && 
        product.thumbnail !== 'null' && 
        product.thumbnail !== 'undefined' &&
        product.thumbnail !== '' &&
        typeof product.thumbnail === 'string') {
      
      let thumbnail = product.thumbnail.trim();
      
      // If already absolute URL, return as is
      if (thumbnail.startsWith('http')) {
        return thumbnail;
      }
      
      // Remove /api/ prefix if present
      if (thumbnail.startsWith('/api/')) {
        thumbnail = thumbnail.replace(/^\/api\//, '/');
      }
      
      // Convert relative URL to absolute
      if (thumbnail.startsWith('/')) {
        return `${BACKEND_URL}${thumbnail}`;
      }
      
      return `${BACKEND_URL}/${thumbnail}`;
    }
    
    return 'https://via.placeholder.com/400';
  },

  // Reset store state
  reset: () => {
    console.log('🔄 Store: Resetting product store');
    set({
      products: [],
      categories: [],
      featuredProducts: [],
      saleProducts: [],
      relatedProducts: [],
      selectedCategory: null,
      selectedProduct: null,
      filters: {
        categoryId: null,
        subCategoryId: null,
        minPrice: null,
        maxPrice: null,
        brand: null,
        search: '',
        tags: [],
        isFeatured: false,
        isOnSale: false,
        inStock: false,
        isActive: true,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
        page: 1,
        limit: 15
      },
      pagination: {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: 15,
        hasNextPage: false,
        hasPreviousPage: false
      },
      isLoading: false,
      isInitialized: false,
      error: null
    });
  }
}));
 
export default useProductStore;

















// // src/stores/useProductStore.js
// import { create } from 'zustand';
// import ProductService from '../services/ProductService';

// // Helper function to parse product images (keep as is)
// const parseProductImages = (product) => {
//   if (!product) return product;
  
//   const processedProduct = { ...product };
  
//   // Parse images if they're a string
//   if (processedProduct.images && typeof processedProduct.images === 'string') {
//     try {
//       processedProduct.images = JSON.parse(processedProduct.images);
//     } catch (error) {
//       console.warn('Failed to parse images string for product:', processedProduct.id, error);
//       processedProduct.images = [];
//     }
//   } else if (!processedProduct.images) {
//     processedProduct.images = [];
//   }
  
//   // Define backend URL
//   const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:2090';
  
//   // Convert thumbnail URL to absolute
//   if (processedProduct.thumbnail && typeof processedProduct.thumbnail === 'string') {
//     const thumbnail = processedProduct.thumbnail.trim();
    
//     // Skip if already absolute URL
//     if (thumbnail.startsWith('http')) {
//       // Already absolute URL, keep as is
//     } else {
//       // Remove /api/ prefix if present
//       let cleanThumbnail = thumbnail;
//       if (cleanThumbnail.startsWith('/api/')) {
//         cleanThumbnail = cleanThumbnail.replace(/^\/api\//, '/');
//       }
      
//       // Convert relative URL to absolute
//       if (cleanThumbnail.startsWith('/')) {
//         processedProduct.thumbnail = `${BACKEND_URL}${cleanThumbnail}`;
//       } else {
//         // Add slash if missing
//         processedProduct.thumbnail = `${BACKEND_URL}/${cleanThumbnail}`;
//       }
//     }
//   }
  
//   // Convert all image URLs in the array to absolute
//   if (Array.isArray(processedProduct.images)) {
//     processedProduct.images = processedProduct.images.map(img => {
//       if (typeof img === 'string') {
//         let url = img.trim();
//         // Skip if already absolute
//         if (url.startsWith('http')) {
//           return url;
//         }
//         // Remove /api/ prefix
//         if (url.startsWith('/api/')) {
//           url = url.replace(/^\/api\//, '/');
//         }
//         // Convert to absolute URL
//         if (url.startsWith('/')) {
//           return `${BACKEND_URL}${url}`;
//         }
//         return `${BACKEND_URL}/${url}`;
//       } else if (img && typeof img === 'object' && img.url) {
//         let url = img.url.trim();
//         // Skip if already absolute
//         if (url.startsWith('http')) {
//           return { ...img, url };
//         }
//         // Remove /api/ prefix
//         if (url.startsWith('/api/')) {
//           url = url.replace(/^\/api\//, '/');
//         }
//         // Convert to absolute URL
//         if (url.startsWith('/')) {
//           url = `${BACKEND_URL}${url}`;
//         } else {
//           url = `${BACKEND_URL}/${url}`;
//         }
//         return { ...img, url };
//       }
//       return img;
//     });
//   }
  
//   // Set thumbnail from images if missing or invalid
//   if (!processedProduct.thumbnail || 
//       processedProduct.thumbnail === 'null' || 
//       processedProduct.thumbnail === 'undefined' ||
//       processedProduct.thumbnail === '') {
    
//     if (processedProduct.images && processedProduct.images.length > 0) {
//       const thumbnailImage = processedProduct.images.find(img => img.isThumbnail) || 
//                            processedProduct.images.find(img => img.isPrimary) || 
//                            processedProduct.images[0];
      
//       if (thumbnailImage) {
//         const url = thumbnailImage.url || thumbnailImage;
//         // Convert to absolute URL if needed
//         if (url && !url.startsWith('http') && url.startsWith('/')) {
//           processedProduct.thumbnail = `${BACKEND_URL}${url}`;
//         } else {
//           processedProduct.thumbnail = url;
//         }
//       }
//     }
//   }
  
//   // Fallback thumbnail
//   if (!processedProduct.thumbnail || 
//       processedProduct.thumbnail === 'null' || 
//       processedProduct.thumbnail === 'undefined' ||
//       processedProduct.thumbnail.length < 5) {
    
//     processedProduct.thumbnail = 'https://via.placeholder.com/400';
//   }
  
//   return processedProduct;
// };

// // Helper to parse array of products
// const parseProductImagesArray = (products) => {
//   if (!Array.isArray(products)) return [];
//   return products.map(parseProductImages);
// };

// const useProductStore = create((set, get) => ({
//   products: [],
//   categories: [],
//   allCategoriesFlat: [], // New: Flat list of all categories for navigation
//   featuredProducts: [],
//   saleProducts: [],
//   relatedProducts: [],
//   selectedCategory: null,
//   selectedProduct: null,
//   currentCategorySlug: null, // Track current category slug from URL
//   filters: {
//     categoryId: null,
//     categorySlug: null, // New: Support category slug filtering
//     subCategoryId: null,
//     minPrice: null,
//     maxPrice: null,
//     brand: null,
//     search: '',
//     tags: [],
//     isFeatured: false,
//     isOnSale: false,
//     inStock: false,
//     isActive: true,
//     sortBy: 'createdAt',
//     sortOrder: 'DESC',
//     page: 1,
//     limit: 15
//   },
//   pagination: {
//     totalItems: 0,
//     totalPages: 0,
//     currentPage: 1,
//     pageSize: 15,
//     hasNextPage: false,
//     hasPreviousPage: false
//   },
//   isLoading: false,
//   isInitialized: false,
//   error: null,

//   // Initialize store with optional category slug
//   initialize: async (categorySlug = null) => {
//     try {
//       console.log('🔄 Product Store: Initializing...', categorySlug ? `with category: ${categorySlug}` : '');
//       set({ isLoading: true, error: null });
      
//       // Load categories first
//       await get().loadCategories();
      
//       // If categorySlug is provided, load products for that category
//       if (categorySlug) {
//         await get().loadProductsByCategory(categorySlug);
//       } else {
//         // Load all products with default filters
//         await get().loadProducts();
//       }
      
//       // Load featured and sale products in parallel
//       await Promise.all([
//         get().loadFeaturedProducts(),
//         get().loadSaleProducts()
//       ]);
      
//       set({ 
//         isInitialized: true, 
//         isLoading: false,
//         currentCategorySlug: categorySlug 
//       });
//       console.log('✅ Product Store: Initialized successfully');
      
//     } catch (error) {
//       console.error('❌ Product Store: Failed to initialize:', error);
//       set({ error: error.message, isLoading: false });
//     }
//   },

//   // Set filters
//   setFilters: (newFilters) => {
//     console.log('🎛️ Store: Setting filters:', newFilters);
//     set(state => ({
//       filters: { ...state.filters, ...newFilters, page: 1 } // Reset to page 1 when filters change
//     }));
//   },

//   // Clear filters
//   clearFilters: () => {
//     console.log('🎛️ Store: Clearing filters');
//     const { currentCategorySlug } = get();
    
//     // Keep category slug if we're in a category view
//     set({
//       filters: {
//         categoryId: null,
//         categorySlug: currentCategorySlug,
//         subCategoryId: null,
//         minPrice: null,
//         maxPrice: null,
//         brand: null,
//         search: '',
//         tags: [],
//         isFeatured: false,
//         isOnSale: false,
//         inStock: false,
//         isActive: true,
//         sortBy: 'createdAt',
//         sortOrder: 'DESC',
//         page: 1,
//         limit: 15
//       }
//     });
//   },

//   // Set selected category
//   setSelectedCategory: (category) => {
//     console.log('🎯 Store: Setting selected category:', category?.name);
//     set({ selectedCategory: category });
    
//     // Update filters with category ID
//     if (category) {
//       const categoryId = category.categoryId || category.id;
//       set(state => ({
//         filters: { ...state.filters, categoryId, categorySlug: category.slug }
//       }));
//     } else {
//       set(state => ({
//         filters: { ...state.filters, categoryId: null, categorySlug: null }
//       }));
//     }
//   },

//   // Load products with current filters
//   loadProducts: async () => {
//     try {
//       const { filters, currentCategorySlug } = get();
//       console.log('🛒 Store: Loading products with filters:', filters);
//       set({ isLoading: true, error: null });
      
//       let result;
      
//       // If we have a category slug from URL, use category-specific endpoint
//       if (currentCategorySlug && !filters.search) {
//         console.log('📂 Store: Using category endpoint for:', currentCategorySlug);
//         result = await ProductService.getProductsByCategory(currentCategorySlug, filters);
        
//         // Parse images for products
//         const processedProducts = parseProductImagesArray(result.products || []);
        
//         set({
//           products: processedProducts,
//           selectedCategory: result.category || null,
//           categories: result.subCategories || [],
//           pagination: result.pagination,
//           isLoading: false
//         });
//       } else {
//         // Use regular products endpoint
//         result = await ProductService.getProducts(filters);
        
//         // Handle undefined result
//         if (!result) {
//           console.warn('⚠️ Store: ProductService returned undefined result');
//           set({
//             products: [],
//             pagination: get().pagination,
//             isLoading: false
//           });
//           return;
//         }
        
//         // Parse images for each product
//         const processedProducts = parseProductImagesArray(result.products || []);
        
//         set({
//           products: processedProducts,
//           pagination: result.pagination || get().pagination,
//           isLoading: false
//         });
//       }
      
//     } catch (error) {
//       console.error('❌ Store Error loading products:', error);
//       set({ 
//         error: error.message, 
//         isLoading: false,
//         products: []
//       });
//     }
//   },
 
//   // Load single product by ID
//   loadProductById: async (productId) => {
//     try {
//       console.log('🛒 Store: Loading product by ID:', productId);
//       set({ isLoading: true, error: null });
//       const product = await ProductService.getProductById(productId);
//       const processedProduct = parseProductImages(product);
      
//       console.log('🛒 Store: Product loaded:', processedProduct.name);
      
//       set({
//         selectedProduct: processedProduct,
//         isLoading: false
//       });
      
//       return processedProduct;
//     } catch (error) {
//       console.error('❌ Store Error loading product by ID:', error);
//       set({ error: error.message, isLoading: false });
//       throw error;
//     }
//   },

//   // Load categories
//   loadCategories: async () => {
//     try {
//       console.log('📂 Store: Loading categories...');
//       set({ isLoading: true, error: null });
//       const categories = await ProductService.getCategories();
//       console.log('📂 Store: Categories loaded:', categories.length);
      
//       // Create flat list for navigation
//       const flattenCategories = (cats, level = 0) => {
//         let result = [];
//         cats.forEach(cat => {
//           result.push({
//             ...cat,
//             level,
//             fullName: '  '.repeat(level) + cat.name // Indentation for display
//           });
//           if (cat.children && cat.children.length > 0) {
//             result = [...result, ...flattenCategories(cat.children, level + 1)];
//           }
//         });
//         return result;
//       };
      
//       const allCategoriesFlat = flattenCategories(categories);
      
//       set({ 
//         categories, 
//         allCategoriesFlat,
//         isLoading: false 
//       });
//     } catch (error) {
//       console.error('❌ Store Error loading categories:', error);
//       set({ error: error.message, isLoading: false });
//     }
//   },

//   // Load featured products
//   loadFeaturedProducts: async (limit = 10) => {
//     try {
//       console.log('⭐ Store: Loading featured products...');
//       set({ isLoading: true, error: null });
//       const featuredProducts = await ProductService.getFeaturedProducts(limit);
//       const processedProducts = parseProductImagesArray(featuredProducts || []);
//       console.log('⭐ Store: Featured products loaded:', processedProducts.length);
//       set({ featuredProducts: processedProducts, isLoading: false });
//     } catch (error) {
//       console.error('❌ Store Error loading featured products:', error);
//       set({ error: error.message, isLoading: false });
//     }
//   },

//   // Load sale products
//   loadSaleProducts: async (limit = 10) => {
//     try {
//       console.log('💰 Store: Loading sale products...');
//       set({ isLoading: true, error: null });
//       const saleProducts = await ProductService.getSaleProducts(limit);
//       const processedProducts = parseProductImagesArray(saleProducts || []);
//       console.log('💰 Store: Sale products loaded:', processedProducts.length);
//       set({ saleProducts: processedProducts, isLoading: false });
//     } catch (error) {
//       console.error('❌ Store Error loading sale products:', error);
//       set({ error: error.message, isLoading: false });
//     }
//   },

//   // Load related products
//   loadRelatedProducts: async (productId, limit = 5) => {
//     try {
//       console.log('🔄 Store: Loading related products for:', productId);
//       set({ isLoading: true, error: null });
//       const relatedProducts = await ProductService.getRelatedProducts(productId, limit);
//       const processedProducts = parseProductImagesArray(relatedProducts || []);
//       console.log('🔄 Store: Related products loaded:', processedProducts.length);
//       set({ relatedProducts: processedProducts, isLoading: false });
//     } catch (error) {
//       console.error('❌ Store Error loading related products:', error);
//       set({ error: error.message, isLoading: false });
//     }
//   },

//   // Load products by category slug
//   loadProductsByCategory: async (categorySlug) => {
//     try {
//       const { filters } = get();
//       console.log('📂 Store: Loading products by category slug:', categorySlug);
//       set({ 
//         isLoading: true, 
//         error: null,
//         currentCategorySlug: categorySlug
//       });
      
//       const result = await ProductService.getProductsByCategory(categorySlug, filters);
      
//       // Parse images for products
//       const processedProducts = parseProductImagesArray(result.products || []);
//       console.log('📂 Store: Category products loaded:', processedProducts.length);
      
//       set({
//         products: processedProducts,
//         selectedCategory: result.category,
//         categories: result.subCategories || [],
//         pagination: result.pagination,
//         filters: { ...filters, categorySlug },
//         isLoading: false
//       });
//     } catch (error) {
//       console.error('❌ Store Error loading category products:', error);
//       set({ 
//         error: error.message, 
//         isLoading: false,
//         currentCategorySlug: null
//       });
//     }
//   },

//   // Search products
//   searchProducts: async (query) => {
//     try {
//       const { filters, currentCategorySlug } = get();
//       console.log('🔍 Store: Searching products for:', query);
//       set({ isLoading: true, error: null });
      
//       let result;
      
//       // If we're in a category view, search within category
//       if (currentCategorySlug && query) {
//         const categoryFilters = { ...filters, search: query };
//         result = await ProductService.getProductsByCategory(currentCategorySlug, categoryFilters);
//       } else {
//         result = await ProductService.searchProducts(query, {
//           page: filters.page,
//           limit: filters.limit
//         });
//       }
      
//       // Parse images for products
//       const processedProducts = parseProductImagesArray(result.products || []);
//       console.log('🔍 Store: Search results:', processedProducts.length);
      
//       set({
//         products: processedProducts,
//         pagination: result.pagination,
//         filters: { ...filters, search: query },
//         isLoading: false
//       });
//     } catch (error) {
//       console.error('❌ Store Error searching products:', error);
//       set({ error: error.message, isLoading: false });
//     }
//   },

//   // Change page
//   changePage: async (page) => {
//     console.log('📄 Store: Changing to page:', page);
//     const { filters } = get();
//     set(state => ({
//       filters: { ...state.filters, page }
//     }));
//     await get().loadProducts();
//   },

//   // Sort products
//   sortProducts: async (sortBy, sortOrder = 'DESC') => {
//     console.log('📊 Store: Sorting by:', sortBy, sortOrder);
//     const { filters } = get();
//     set(state => ({
//       filters: { ...state.filters, sortBy, sortOrder, page: 1 }
//     }));
//     await get().loadProducts();
//   },

//   // Set current category slug
//   setCurrentCategorySlug: (slug) => {
//     console.log('📍 Store: Setting current category slug:', slug);
//     set({ currentCategorySlug: slug });
    
//     if (slug) {
//       set(state => ({
//         filters: { ...state.filters, categorySlug: slug }
//       }));
//     }
//   },

//   // Clear selected product
//   clearSelectedProduct: () => {
//     console.log('❌ Store: Clearing selected product');
//     set({ selectedProduct: null });
//   },

//   // Clear related products
//   clearRelatedProducts: () => {
//     console.log('❌ Store: Clearing related products');
//     set({ relatedProducts: [] });
//   },

//   // Helper to get thumbnail URL (for components)
//   getProductThumbnail: (product) => {
//     if (!product) return 'https://via.placeholder.com/400';
    
//     const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:2090';
    
//     if (product.thumbnail && 
//         product.thumbnail !== 'null' && 
//         product.thumbnail !== 'undefined' &&
//         product.thumbnail !== '' &&
//         typeof product.thumbnail === 'string') {
      
//       let thumbnail = product.thumbnail.trim();
      
//       // If already absolute URL, return as is
//       if (thumbnail.startsWith('http')) {
//         return thumbnail;
//       }
      
//       // Remove /api/ prefix if present
//       if (thumbnail.startsWith('/api/')) {
//         thumbnail = thumbnail.replace(/^\/api\//, '/');
//       }
      
//       // Convert relative URL to absolute
//       if (thumbnail.startsWith('/')) {
//         return `${BACKEND_URL}${thumbnail}`;
//       }
      
//       return `${BACKEND_URL}/${thumbnail}`;
//     }
    
//     return 'https://via.placeholder.com/400';
//   },

//   // Get category by slug from flat list
//   getCategoryBySlug: (slug) => {
//     const { allCategoriesFlat } = get();
//     return allCategoriesFlat.find(cat => cat.slug === slug) || null;
//   },

//   // Reset store state
//   reset: () => {
//     console.log('🔄 Store: Resetting product store');
//     set({
//       products: [],
//       categories: [],
//       allCategoriesFlat: [],
//       featuredProducts: [],
//       saleProducts: [],
//       relatedProducts: [],
//       selectedCategory: null,
//       selectedProduct: null,
//       currentCategorySlug: null,
//       filters: {
//         categoryId: null,
//         categorySlug: null,
//         subCategoryId: null,
//         minPrice: null,
//         maxPrice: null,
//         brand: null,
//         search: '',
//         tags: [],
//         isFeatured: false,
//         isOnSale: false,
//         inStock: false,
//         isActive: true,
//         sortBy: 'createdAt',
//         sortOrder: 'DESC',
//         page: 1,
//         limit: 15
//       },
//       pagination: {
//         totalItems: 0,
//         totalPages: 0,
//         currentPage: 1,
//         pageSize: 15,
//         hasNextPage: false,
//         hasPreviousPage: false
//       },
//       isLoading: false,
//       isInitialized: false,
//       error: null
//     });
//   },

//   // Clear all products (for cleanup)
//   clearProducts: () => {
//     console.log('🗑️ Store: Clearing all products');
//     set({ products: [] });
//   }
// }));

// export default useProductStore;
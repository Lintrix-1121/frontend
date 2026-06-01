import api from './api';
import ProductModel from '../models/ProductModel';
import CategoryModel from '../models/CategoryModel';

class ProductService { 
  // Get products with filters
  async getProducts(filters = {}) {
    try {
      console.log('📡 ProductService: Getting products with filters:', filters);
      const params = this.buildQueryParams(filters);
      console.log('📡 ProductService: Sending request to /products with params:', params);
      
      const response = await api.get('/products', { params });
      console.log('📡 ProductService: Raw response received:', {
        status: response.status,
        data: response.data
      });
      
      // Handle different response structures
      if (!response.data) {
        console.error('❌ ProductService: No response data received');
        throw new Error('No data received from server');
      }
      
      // Check for success field (common in many APIs)
      if (response.data.success === false) {
        console.error('❌ ProductService: API returned error:', response.data.message);
        throw new Error(response.data.message || 'API request failed');
      }
      
      // Extract data from common response structures
      let productsData = [];
      let paginationData = {};
      
      if (response.data.data) {
        // Structure: { success: true, data: { products: [], pagination: {} } }
        productsData = response.data.data.products || response.data.data || [];
        paginationData = response.data.data.pagination || {};
      } else if (Array.isArray(response.data)) {
        // Structure: [{}, {}] - direct array of products
        productsData = response.data;
      } else {
        // Structure: { products: [], pagination: {} }
        productsData = response.data.products || [];
        paginationData = response.data.pagination || {};
      }
      
      console.log('📡 ProductService: Extracted products:', productsData.length);
      console.log('📡 ProductService: Extracted pagination:', paginationData);
      
      return {
        products: Array.isArray(productsData) ? productsData : [],
        pagination: {
          totalItems: paginationData.totalItems || paginationData.total || 0,
          totalPages: paginationData.totalPages || 1,
          currentPage: paginationData.currentPage || paginationData.page || 1,
          pageSize: paginationData.pageSize || paginationData.limit || 15,
          hasNextPage: paginationData.hasNextPage || false,
          hasPreviousPage: paginationData.hasPreviousPage || false
        }
      };
      
    } catch (error) {
      console.error('❌ ProductService Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          params: error.config?.params
        }
      });
      
      // Return empty results instead of throwing to prevent UI crashes
      return {
        products: [],
        pagination: {
          totalItems: 0,
          totalPages: 0,
          currentPage: 1,
          pageSize: 15,
          hasNextPage: false,
          hasPreviousPage: false
        }
      };
    }
  }

  
  // Get single product
  async getProductById(productId) {
    try {
      const response = await api.get(`/products/${productId}`);
      const productData = response.data.data;
      
      // Parse images
      const processedProduct = this.parseProductImages(productData);
      
      return ProductModel.fromApi(processedProduct);
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  // Get categories
  async getCategories() {
    try {
      const response = await api.get('/categories');
      const categories = CategoryModel.fromArray(response.data.data);
      const categoryModel = new CategoryModel({});
      return categoryModel.buildHierarchy(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
 
  // Get products by category
  async getProductsByCategory(categorySlug, filters = {}) {
    try {
      const params = this.buildQueryParams(filters);
      const response = await api.get(`/categories/${categorySlug}/products`, { params });
      
      // Parse images for products
      const rawProducts = response.data.data?.products || [];
      const processedProducts = this.parseProductImagesArray(rawProducts);
      
      return {
        category: CategoryModel.fromApi(response.data.data.category),
        subCategories: CategoryModel.fromArray(response.data.data.subCategories),
        products: ProductModel.fromArray(processedProducts),
        pagination: response.data.data.pagination
      };
    } catch (error) {
      console.error('Error fetching category products:', error);
      throw error;
    }
  }

  // Search products
  async searchProducts(query, pagination = {}) {
    try {
      const params = { query, ...pagination };
      const response = await api.get('/products/search', { params });
      
      // Parse images for products
      const rawProducts = response.data.data?.products || [];
      const processedProducts = this.parseProductImagesArray(rawProducts);
      
      return {
        products: ProductModel.fromArray(processedProducts),
        pagination: response.data.data.pagination
      };
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  // Get featured products
  async getFeaturedProducts(limit = 10) {
    try {
      const response = await api.get('/products/featured', { params: { limit } });
      const rawProducts = response.data.data || [];
      const processedProducts = this.parseProductImagesArray(rawProducts);
      return ProductModel.fromArray(processedProducts);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }

  // Get sale products
  async getSaleProducts(limit = 10) {
    try {
      const response = await api.get('/products/sale', { params: { limit } });
      const rawProducts = response.data.data || [];
      const processedProducts = this.parseProductImagesArray(rawProducts);
      return ProductModel.fromArray(processedProducts);
    } catch (error) {
      console.error('Error fetching sale products:', error);
      throw error;
    }
  }

  // Get related products
  async getRelatedProducts(productId, limit = 5) {
    try {
      const response = await api.get(`/products/${productId}/related`, { params: { limit } });
      const rawProducts = response.data.data || [];
      const processedProducts = this.parseProductImagesArray(rawProducts);
      return ProductModel.fromArray(processedProducts);
    } catch (error) {
      console.error('Error fetching related products:', error);
      throw error;
    }
  }

  // Get product images separately (if needed)
  async getProductImages(productId) {
    try {
      const response = await api.get(`/products/${productId}/images`);
      const imagesData = response.data.data;
      const processedImages = this.parseProductImages({ images: imagesData.images });
      return { ...imagesData, images: processedImages.images };
    } catch (error) {
      console.error('Error fetching product images:', error);
      throw error;
    }
  }

  // Helper to parse product images
  parseProductImages(product) {
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
    
    // Convert thumbnail to absolute URL
    if (processedProduct.thumbnail && typeof processedProduct.thumbnail === 'string') {
      const thumbnail = processedProduct.thumbnail.trim();
      if (thumbnail.startsWith('/') && !thumbnail.startsWith('//')) {
        // Convert relative URL to absolute (use your backend URL)
        const backendUrl = import.meta.env.VITE_API_URL || 'https://api.logiphix.tech';
        // Remove /api/ prefix if present
        const cleanThumbnail = thumbnail.startsWith('/api/') ? 
          thumbnail.replace(/^\/api\//, '/') : thumbnail;
        processedProduct.thumbnail = `${backendUrl}${cleanThumbnail}`;
      }
    }
    
    // Convert image URLs to absolute
    if (Array.isArray(processedProduct.images)) {
      const backendUrl = import.meta.env.VITE_API_URL || 'https://api.logiphix.tech';
      
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
  }

  // Helper to parse array of products
  parseProductImagesArray(products) {
    if (!Array.isArray(products)) return [];
    return products.map(product => this.parseProductImages(product));
  }


   buildQueryParams(filters) {
    const params = new URLSearchParams();
    
    // Always include isActive for customer-facing queries
    params.append('isActive', 'true');
    
    // Add other filters
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.subCategoryId) params.append('subCategoryId', filters.subCategoryId);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.brand) params.append('brand', filters.brand);
    if (filters.search) params.append('search', filters.search);
    if (filters.tags && filters.tags.length > 0) params.append('tags', filters.tags.join(','));
    if (filters.isFeatured) params.append('isFeatured', 'true');
    if (filters.isOnSale) params.append('isOnSale', 'true');
    if (filters.inStock) params.append('inStock', 'true');
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    console.log('🔧 ProductService: Built query params:', Object.fromEntries(params));
    return Object.fromEntries(params);
  }

  
}

export default new ProductService();














// // src/services/ProductService.js
// import api from './api';
// import ProductModel from '../models/ProductModel';
// import CategoryModel from '../models/CategoryModel';

// class ProductService {
//   // Get products with filters
//   async getProducts(filters = {}) {
//     try {
//       console.log('📡 ProductService: Getting products with filters:', filters);
//       const params = this.buildQueryParams(filters);
//       console.log('📡 ProductService: Sending request to /products with params:', params);
      
//       const response = await api.get('/products', { params });
//       console.log('📡 ProductService: Raw response received:', {
//         status: response.status,
//         data: response.data
//       });
      
//       // Handle different response structures
//       if (!response.data) {
//         console.error('❌ ProductService: No response data received');
//         throw new Error('No data received from server');
//       }
      
//       // Check for success field
//       if (response.data.success === false) {
//         console.error('❌ ProductService: API returned error:', response.data.message);
//         throw new Error(response.data.message || 'API request failed');
//       }
      
//       // Extract data from response
//       let productsData = [];
//       let paginationData = {};
      
//       if (response.data.data) {
//         productsData = response.data.data.products || response.data.data || [];
//         paginationData = response.data.data.pagination || {};
//       } else if (Array.isArray(response.data)) {
//         productsData = response.data;
//       } else {
//         productsData = response.data.products || [];
//         paginationData = response.data.pagination || {};
//       }
      
//       console.log('📡 ProductService: Extracted products:', productsData.length);
//       console.log('📡 ProductService: Extracted pagination:', paginationData);
      
//       return {
//         products: Array.isArray(productsData) ? productsData : [],
//         pagination: {
//           totalItems: paginationData.totalItems || paginationData.total || 0,
//           totalPages: paginationData.totalPages || 1,
//           currentPage: paginationData.currentPage || paginationData.page || 1,
//           pageSize: paginationData.pageSize || paginationData.limit || 15,
//           hasNextPage: paginationData.hasNextPage || false,
//           hasPreviousPage: paginationData.hasPreviousPage || false
//         }
//       };
      
//     } catch (error) {
//       console.error('❌ ProductService Error:', {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status
//       });
      
//       // Return empty results
//       return {
//         products: [],
//         pagination: {
//           totalItems: 0,
//           totalPages: 0,
//           currentPage: 1,
//           pageSize: 15,
//           hasNextPage: false,
//           hasPreviousPage: false
//         }
//       };
//     }
//   }

//   // Get single product
//   async getProductById(productId) {
//     try {
//       const response = await api.get(`/products/${productId}`);
//       const productData = response.data.data;
      
//       // Parse images
//       const processedProduct = this.parseProductImages(productData);
      
//       return ProductModel.fromApi(processedProduct);
//     } catch (error) {
//       console.error('Error fetching product:', error);
//       throw error;
//     }
//   }

//   // Get categories
//   async getCategories() {
//     try {
//       const response = await api.get('/categories');
//       const categories = CategoryModel.fromArray(response.data.data);
//       const categoryModel = new CategoryModel({});
//       return categoryModel.buildHierarchy(categories);
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//       throw error;
//     }
//   }

//   // Get products by category slug
//   async getProductsByCategory(categorySlug, filters = {}) {
//     try {
//       console.log('📂 ProductService: Getting products for category:', categorySlug);
      
//       // First, get category details
//       const categoryResponse = await api.get(`/categories/${categorySlug}`);
//       const category = categoryResponse.data.data;
      
//       if (!category) {
//         throw new Error(`Category "${categorySlug}" not found`);
//       }
      
//       // Build query params with category ID
//       const params = this.buildQueryParams({
//         ...filters,
//         categoryId: category.categoryId || category.id
//       });
      
//       // Get products for this category
//       const productsResponse = await api.get('/products', { params });
      
//       let productsData = [];
//       let paginationData = {};
      
//       if (productsResponse.data.data) {
//         productsData = productsResponse.data.data.products || productsResponse.data.data || [];
//         paginationData = productsResponse.data.data.pagination || {};
//       } else if (Array.isArray(productsResponse.data)) {
//         productsData = productsResponse.data;
//       } else {
//         productsData = productsResponse.data.products || [];
//         paginationData = productsResponse.data.pagination || {};
//       }
      
//       // Get subcategories if any
//       const subCategories = category.children || [];
      
//       console.log('📂 ProductService: Category products loaded:', productsData.length);
      
//       return {
//         category: CategoryModel.fromApi(category),
//         subCategories: CategoryModel.fromArray(subCategories),
//         products: Array.isArray(productsData) ? productsData : [],
//         pagination: {
//           totalItems: paginationData.totalItems || paginationData.total || 0,
//           totalPages: paginationData.totalPages || 1,
//           currentPage: paginationData.currentPage || paginationData.page || 1,
//           pageSize: paginationData.pageSize || paginationData.limit || 15,
//           hasNextPage: paginationData.hasNextPage || false,
//           hasPreviousPage: paginationData.hasPreviousPage || false
//         }
//       };
      
//     } catch (error) {
//       console.error('❌ ProductService Error fetching category products:', error);
      
//       // Return empty results
//       return {
//         category: null,
//         subCategories: [],
//         products: [],
//         pagination: {
//           totalItems: 0,
//           totalPages: 0,
//           currentPage: 1,
//           pageSize: 15,
//           hasNextPage: false,
//           hasPreviousPage: false
//         }
//       };
//     }
//   }

//   // Search products
//   async searchProducts(query, pagination = {}) {
//     try {
//       const params = { query, ...pagination };
//       const response = await api.get('/products/search', { params });
      
//       // Parse images for products
//       const rawProducts = response.data.data?.products || [];
//       const processedProducts = this.parseProductImagesArray(rawProducts);
      
//       return {
//         products: ProductModel.fromArray(processedProducts),
//         pagination: response.data.data.pagination
//       };
//     } catch (error) {
//       console.error('Error searching products:', error);
//       throw error;
//     }
//   }

//   // Get featured products
//   async getFeaturedProducts(limit = 10) {
//     try {
//       const response = await api.get('/products/featured', { params: { limit } });
//       const rawProducts = response.data.data || [];
//       const processedProducts = this.parseProductImagesArray(rawProducts);
//       return ProductModel.fromArray(processedProducts);
//     } catch (error) {
//       console.error('Error fetching featured products:', error);
//       throw error;
//     }
//   }

//   // Get sale products
//   async getSaleProducts(limit = 10) {
//     try {
//       const response = await api.get('/products/sale', { params: { limit } });
//       const rawProducts = response.data.data || [];
//       const processedProducts = this.parseProductImagesArray(rawProducts);
//       return ProductModel.fromArray(processedProducts);
//     } catch (error) {
//       console.error('Error fetching sale products:', error);
//       throw error;
//     }
//   }

//   // Get related products
//   async getRelatedProducts(productId, limit = 5) {
//     try {
//       const response = await api.get(`/products/${productId}/related`, { params: { limit } });
//       const rawProducts = response.data.data || [];
//       const processedProducts = this.parseProductImagesArray(rawProducts);
//       return ProductModel.fromArray(processedProducts);
//     } catch (error) {
//       console.error('Error fetching related products:', error);
//       throw error;
//     }
//   }

//   // Get product images
//   async getProductImages(productId) {
//     try {
//       const response = await api.get(`/products/${productId}/images`);
//       const imagesData = response.data.data;
//       const processedImages = this.parseProductImages({ images: imagesData.images });
//       return { ...imagesData, images: processedImages.images };
//     } catch (error) {
//       console.error('Error fetching product images:', error);
//       throw error;
//     }
//   }

//   // Helper to parse product images
//   parseProductImages(product) {
//     if (!product) return product;
    
//     const processedProduct = { ...product };
    
//     // Parse images if they're a string
//     if (processedProduct.images && typeof processedProduct.images === 'string') {
//       try {
//         processedProduct.images = JSON.parse(processedProduct.images);
//       } catch (error) {
//         console.warn('Failed to parse images string:', error);
//         processedProduct.images = [];
//       }
//     } else if (!processedProduct.images) {
//       processedProduct.images = [];
//     }
    
//     // Convert thumbnail to absolute URL
//     if (processedProduct.thumbnail && typeof processedProduct.thumbnail === 'string') {
//       const thumbnail = processedProduct.thumbnail.trim();
//       if (thumbnail.startsWith('/') && !thumbnail.startsWith('//')) {
//         const backendUrl = import.meta.env.VITE_API_URL || 'https://api.logiphix.tech';
//         const cleanThumbnail = thumbnail.startsWith('/api/') ? 
//           thumbnail.replace(/^\/api\//, '/') : thumbnail;
//         processedProduct.thumbnail = `${backendUrl}${cleanThumbnail}`;
//       }
//     }
    
//     // Convert image URLs to absolute
//     if (Array.isArray(processedProduct.images)) {
//       const backendUrl = import.meta.env.VITE_API_URL || 'https://api.logiphix.tech';
      
//       processedProduct.images = processedProduct.images.map(img => {
//         if (typeof img === 'string') {
//           let url = img.trim();
//           if (url.startsWith('/api/')) {
//             url = url.replace(/^\/api\//, '/');
//           }
//           if (url.startsWith('/')) {
//             return `${backendUrl}${url}`;
//           }
//           return url;
//         } else if (img && typeof img === 'object' && img.url) {
//           let url = img.url.trim();
//           if (url.startsWith('/api/')) {
//             url = url.replace(/^\/api\//, '/');
//           }
//           if (url.startsWith('/')) {
//             url = `${backendUrl}${url}`;
//           }
//           return { ...img, url };
//         }
//         return img;
//       });
//     }
    
//     return processedProduct;
//   }

//   // Helper to parse array of products
//   parseProductImagesArray(products) {
//     if (!Array.isArray(products)) return [];
//     return products.map(product => this.parseProductImages(product));
//   }

//   // Build query parameters
//   buildQueryParams(filters) {
//     const params = new URLSearchParams();
    
//     // Always include isActive for customer-facing queries
//     params.append('isActive', 'true');
    
//     // Add other filters
//     if (filters.categoryId) params.append('categoryId', filters.categoryId);
//     if (filters.categorySlug) params.append('categorySlug', filters.categorySlug);
//     if (filters.subCategoryId) params.append('subCategoryId', filters.subCategoryId);
//     if (filters.minPrice) params.append('minPrice', filters.minPrice);
//     if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
//     if (filters.brand) params.append('brand', filters.brand);
//     if (filters.search) params.append('search', filters.search);
//     if (filters.tags && filters.tags.length > 0) params.append('tags', filters.tags.join(','));
//     if (filters.isFeatured) params.append('isFeatured', 'true');
//     if (filters.isOnSale) params.append('isOnSale', 'true');
//     if (filters.inStock) params.append('inStock', 'true');
//     if (filters.sortBy) params.append('sortBy', filters.sortBy);
//     if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
//     if (filters.page) params.append('page', filters.page);
//     if (filters.limit) params.append('limit', filters.limit);

//     console.log('🔧 ProductService: Built query params:', Object.fromEntries(params));
//     return Object.fromEntries(params);
//   }
// }

// export default new ProductService();
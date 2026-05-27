import api from '../api';
import AdminProductModel from '../../models/admin/AdminProductModel';
import axios from 'axios';
import CategoryModel from '../../models/CategoryModel';

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
  
  // Set thumbnail from images if missing
  if (!processedProduct.thumbnail && processedProduct.images.length > 0) {
    // Find thumbnail image or use first image
    const thumbnailImage = processedProduct.images.find(img => img.isThumbnail) || processedProduct.images[0];
    if (thumbnailImage) {
      processedProduct.thumbnail = thumbnailImage.url || thumbnailImage;
    }
  }
  
  // Ensure thumbnail is a string (not an object)
  if (processedProduct.thumbnail && typeof processedProduct.thumbnail === 'object') {
    processedProduct.thumbnail = processedProduct.thumbnail.url || processedProduct.thumbnail;
  }
  
  // Fallback thumbnail
  if (!processedProduct.thumbnail || processedProduct.thumbnail === 'null') {
    processedProduct.thumbnail = 'https://via.placeholder.com/400';
  }
  
  return processedProduct;
};

// Helper to parse array of products
const parseProductImagesArray = (products) => {
  if (!Array.isArray(products)) return [];
  return products.map(parseProductImages);
};

class AdminProductService {
  constructor() {
    this.cancelTokenSource = null;
    this.maxRetries = 3;
    this.retryDelay = 1000;
  }

  cancelPreviousRequest() {
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel('Request cancelled due to new request');
    }
  }

  // ==================== ENHANCED PRODUCT METHODS WITH IMAGE PARSING ====================

  async getProducts(filters = {}) {
    try {
      this.cancelPreviousRequest();
      
      this.cancelTokenSource = axios.CancelToken.source();
      
      const params = this.buildQueryParams(filters);
      console.log('📡 Fetching products with params:', params);
      
      const response = await api.get('/products', {
        params,
        cancelToken: this.cancelTokenSource.token
      });
       
      const rawProducts = response.data.data?.products || [];
      const pagination = response.data.data?.pagination || {};
      
      console.log('📥 Raw products received:', rawProducts.length);
      
      // Parse images for each product
      const processedProducts = parseProductImagesArray(rawProducts);
      console.log('🖼️ Products after image parsing:', processedProducts.length);
      
      return {
        products: AdminProductModel.fromArray(processedProducts),
        pagination
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request cancelled:', error.message);
        return null;
      }
      return this.handleError(error, 'Error fetching admin products');
    }
  }

  async getProductById(productId) {
    try {
      console.log(`📡 Fetching product ${productId}...`);
      const response = await api.get(`/products/${productId}`);
      const productData = response.data.data;
      
      console.log('📥 Raw product data received:', {
        id: productData.id,
        name: productData.name,
        imagesType: typeof productData.images,
        thumbnail: productData.thumbnail
      });
      
      // Parse images
      const processedProduct = parseProductImages(productData);
      
      // If we need to fetch images separately (fallback)
      if ((!processedProduct.images || processedProduct.images.length === 0) && 
          (!processedProduct.thumbnail || processedProduct.thumbnail.includes('placeholder'))) {
        try {
          console.log('🔄 Fetching images separately...');
          const imagesResponse = await this.getProductImages(productId);
          processedProduct.images = imagesResponse.images || [];
          if (!processedProduct.thumbnail && processedProduct.images.length > 0) {
            processedProduct.thumbnail = processedProduct.images[0].url || processedProduct.images[0];
          }
        } catch (imageError) {
          console.warn('Failed to fetch separate images:', imageError);
        }
      }
      
      console.log('✅ Processed product:', {
        id: processedProduct.id,
        name: processedProduct.name,
        imagesCount: processedProduct.images?.length || 0,
        thumbnail: processedProduct.thumbnail
      });
      
      return AdminProductModel.fromApi(processedProduct);
    } catch (error) {
      console.error('Error fetching admin product:', error);
      throw error;
    }
  }

  // Create new product with image upload support
  async createProduct(productData) {
    try {
      console.log('📤 Creating product with data:', productData);
      
      // Check if we have files to upload
      const filesToUpload = [];
      if (productData.images && Array.isArray(productData.images)) {
        productData.images.forEach(img => {
          if (img.file instanceof File) {
            filesToUpload.push({
              file: img.file,
              isThumbnail: img.isThumbnail || false
            });
          }
        });
      }
      
      if (filesToUpload.length === 0) {
        // No files to upload - send as JSON
        console.log('📦 No files to upload, sending JSON');
        
        const jsonData = {
          name: productData.name,
          sku: productData.sku,
          price: productData.price,
          comparePrice: productData.comparePrice,
          cost: productData.cost,
          quantity: productData.quantity,
          description: productData.description,
          categoryId: productData.categoryId,
          subCategoryId: productData.subCategoryId,
          brand: productData.brand,
          images: productData.images || [],
          thumbnail: productData.thumbnail || null,
          specifications: productData.specifications || {},
          tags: productData.tags || [],
          isActive: productData.isActive !== undefined ? productData.isActive : true,
          isFeatured: productData.isFeatured || false,
          isOnSale: productData.isOnSale || false,
          salePrice: productData.salePrice,
          saleStart: productData.saleStart,
          saleEnd: productData.saleEnd,
          weight: productData.weight,
          dimensions: productData.dimensions || {},
          metaTitle: productData.metaTitle,
          metaDescription: productData.metaDescription
        };
        
        console.log('📦 JSON data:', jsonData);
        
        const response = await api.post('/admin/products', jsonData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const processedProduct = parseProductImages(response.data.data);
        console.log('✅ Product created successfully (no images)');
        return AdminProductModel.fromApi(processedProduct);
      } else {
        // We have files to upload - use FormData
        console.log('📦 Uploading files with FormData');
        
        const formData = new FormData();
        
        // Add all product data as JSON string
        const productJson = {
          name: productData.name,
          sku: productData.sku,
          price: productData.price,
          comparePrice: productData.comparePrice,
          cost: productData.cost,
          quantity: productData.quantity,
          description: productData.description,
          categoryId: productData.categoryId,
          subCategoryId: productData.subCategoryId,
          brand: productData.brand,
          specifications: productData.specifications || {},
          tags: productData.tags || [],
          isActive: productData.isActive !== undefined ? productData.isActive : true,
          isFeatured: productData.isFeatured || false,
          isOnSale: productData.isOnSale || false,
          salePrice: productData.salePrice,
          saleStart: productData.saleStart,
          saleEnd: productData.saleEnd,
          weight: productData.weight,
          dimensions: productData.dimensions || {},
          metaTitle: productData.metaTitle,
          metaDescription: productData.metaDescription
        };
        
        formData.append('productData', JSON.stringify(productJson));
        
        // Add files
        filesToUpload.forEach((fileObj, index) => {
          formData.append('images', fileObj.file);
          // Add metadata if needed
          if (fileObj.isThumbnail) {
            formData.append('thumbnailIndex', index.toString());
          }
        });
        
        // Log FormData for debugging
        console.log('📋 FormData entries:');
        for (let [key, value] of formData.entries()) {
          if (key === 'images') {
            console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
          } else {
            console.log(`${key}:`, value);
          }
        }
        
        const response = await api.post('/admin/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        const processedProduct = parseProductImages(response.data.data);
        console.log('✅ Product created successfully (with images)');
        return AdminProductModel.fromApi(processedProduct);
      }
    } catch (error) {
      console.error('❌ Error creating product:', error);
      
      if (error.response) {
        console.error('📝 Error response:', {
          status: error.response.status,
          data: error.response.data,
          message: error.response.data?.message || error.response.data
        });
      }
      
      throw error;
    }
  }

  // Update product with image support
  async updateProduct(productId, productData) {
    try {
      const formData = new FormData();
      const imagesToUpload = [];

      // Separate files from other data
      Object.keys(productData).forEach(key => {
        if (key === 'images' && Array.isArray(productData[key])) {
          // Process new images
          productData[key].forEach((img, index) => {
            if (img.file) {
              // This is a new file that needs to be uploaded
              imagesToUpload.push(img.file);
            }
          });
          // Add existing image URLs as JSON
          const existingImages = productData[key]
            .filter(img => !img.file && img.url)
            .map(img => ({
              url: img.url,
              isThumbnail: img.isThumbnail || false
            }));
          formData.append('images', JSON.stringify(existingImages));
        } else if (typeof productData[key] === 'object') {
          formData.append(key, JSON.stringify(productData[key]));
        } else {
          formData.append(key, productData[key]);
        }
      });

      // Update product data
      const response = await api.put(`/admin/products/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Upload new images if any
      if (imagesToUpload.length > 0) {
        const imageFormData = new FormData();
        imagesToUpload.forEach((file, index) => {
          imageFormData.append('images', file);
        });

        await api.post(`/admin/products/${productId}/images`, imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      // Update thumbnail if specified
      if (productData.thumbnail) {
        await api.put(`/admin/products/${productId}/thumbnail`, {
          imageUrl: productData.thumbnail
        });
      }

      const processedProduct = parseProductImages(response.data.data);
      return AdminProductModel.fromApi(processedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Upload images to existing product
  async uploadProductImages(productId, files) {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await api.post(`/admin/products/${productId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading product images:', error);
      throw error;
    }
  }

  // Set product thumbnail
  async setProductThumbnail(productId, imageUrl) {
    try {
      const response = await api.put(`/admin/products/${productId}/thumbnail`, {
        imageUrl
      });
      return response.data;
    } catch (error) {
      console.error('Error setting thumbnail:', error);
      throw error;
    }
  }

  // Delete product image
  async deleteProductImage(productId, imageUrl) {
    try {
      const response = await api.delete(`/admin/products/${productId}/images`, {
        data: { imageUrl }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting product image:', error);
      throw error;
    }
  }

  // Get product images
  async getProductImages(productId) {
    try {
      const response = await api.get(`/products/${productId}/images`);
      const imagesData = response.data.data;
      const processedImages = parseProductImages({ images: imagesData.images });
      return { ...imagesData, images: processedImages.images };
    } catch (error) {
      console.error('Error fetching product images:', error);
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

  // ==================== EXISTING METHODS ====================

  async deleteProduct(productId) {
    try {
      const response = await api.delete(`/admin/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  async bulkUpdateProducts(productIds, updates) {
    try {
      const response = await api.put('/admin/products/bulk-update', {
        productIds,
        updates
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating products:', error);
      throw error;
    }
  }

  async importProducts(file, importType = 'upsert') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('importType', importType);

      const response = await api.post('/admin/products/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error importing products:', error);
      throw error;
    }
  }

  async exportProducts(format = 'csv', filters = {}) {
    try {
      const params = this.buildQueryParams(filters);
      const response = await api.get('/admin/products/export', {
        params: { ...params, format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting products:', error);
      throw error;
    }
  }

  async syncToOdoo(productId) {
    try {
      const response = await api.post(`/admin/products/${productId}/sync-odoo`);
      return response.data;
    } catch (error) {
      console.error('Error syncing to Odoo:', error);
      throw error;
    }
  }

  async getProductAnalytics(productId, period = '30d') {
    try {
      const response = await api.get(`/admin/products/${productId}/analytics`, {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting product analytics:', error);
      throw error;
    }
  }

  // ==================== UTILITY METHODS ====================

  handleError(error, context = '') {
    let errorMessage = 'An error occurred';
    let errorCode = 'UNKNOWN_ERROR';

    if (error.response) {
      errorCode = error.response.data?.code || `HTTP_${error.response.status}`;
      errorMessage = error.response.data?.message || error.response.statusText;
      
      switch (error.response.status) {
        case 401:
          errorMessage = 'Authentication required';
          break;
        case 403:
          errorMessage = 'You don\'t have permission to perform this action';
          break;
        case 404:
          errorMessage = 'Product not found';
          break;
        case 429:
          errorMessage = 'Too many requests. Please try again later';
          break;
        case 413:
          errorMessage = 'File too large. Maximum size is 5MB';
          break;
        case 415:
          errorMessage = 'Invalid file type. Only images are allowed';
          break;
      }
    } else if (error.request) {
      errorMessage = 'Network error. Please check your connection';
      errorCode = 'NETWORK_ERROR';
    }

    const fullMessage = context ? `${context}: ${errorMessage}` : errorMessage;
    
    console.error(`[AdminProductService] ${fullMessage}`, {
      code: errorCode,
      originalError: error
    });

    throw new Error(fullMessage);
  }

  buildQueryParams(filters) {
    const params = {};
    
    if (filters.search) params.search = filters.search;
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.brand) params.brand = filters.brand;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.minQuantity) params.minQuantity = filters.minQuantity;
    if (filters.maxQuantity) params.maxQuantity = filters.maxQuantity;
    if (filters.inStock !== undefined) params.inStock = filters.inStock;
    if (filters.isActive !== undefined) params.isActive = filters.isActive;
    if (filters.isFeatured !== undefined) params.isFeatured = filters.isFeatured;
    if (filters.isOnSale !== undefined) params.isOnSale = filters.isOnSale;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortOrder) params.sortOrder = filters.sortOrder;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;

    return params;
  }

  // Convert File to base64 for preview
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  // Validate image file
  validateImageFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      throw new Error(`Invalid file type: ${file.type}. Allowed types: ${validTypes.join(', ')}`);
    }

    if (file.size > maxSize) {
      throw new Error(`File too large: ${(file.size / (1024 * 1024)).toFixed(2)}MB. Maximum size: 5MB`);
    }

    return true;
  }
}

export default new AdminProductService();



// import api from '../api';
// import AdminProductModel from '../../models/admin/AdminProductModel';
// import axios from 'axios'; // Make sure axios is imported
// import CategoryModel from '../../models/CategoryModel';

// class AdminProductService {
//   constructor() {
//     this.cancelTokenSource = null;
//     this.maxRetries = 3;
//     this.retryDelay = 1000;
//   }

//   cancelPreviousRequest() {
//     if (this.cancelTokenSource) {
//       this.cancelTokenSource.cancel('Request cancelled due to new request');
//     }
//   }

//   // ==================== ENHANCED PRODUCT METHODS WITH IMAGE SUPPORT ====================

//   // Create new product with image upload support
//   async createProduct(productData) {
//     try {
//       console.log('📤 Creating product with data:', productData);
      
//       // Check if we have files to upload
//       const filesToUpload = [];
//       if (productData.images && Array.isArray(productData.images)) {
//         productData.images.forEach(img => {
//           if (img.file instanceof File) {
//             filesToUpload.push({
//               file: img.file,
//               isThumbnail: img.isThumbnail || false
//             });
//           }
//         });
//       }
      
//       if (filesToUpload.length === 0) {
//         // No files to upload - send as JSON
//         console.log('📦 No files to upload, sending JSON');
        
//         const jsonData = {
//           name: productData.name,
//           sku: productData.sku,
//           price: productData.price,
//           comparePrice: productData.comparePrice,
//           cost: productData.cost,
//           quantity: productData.quantity,
//           description: productData.description,
//           categoryId: productData.categoryId,
//           subCategoryId: productData.subCategoryId,
//           brand: productData.brand,
//           images: [], // Empty array for now
//           thumbnail: null, // Will be set after image upload
//           specifications: productData.specifications || {},
//           tags: productData.tags || [],
//           isActive: productData.isActive !== undefined ? productData.isActive : true,
//           isFeatured: productData.isFeatured || false,
//           isOnSale: productData.isOnSale || false,
//           salePrice: productData.salePrice,
//           saleStart: productData.saleStart,
//           saleEnd: productData.saleEnd,
//           weight: productData.weight,
//           dimensions: productData.dimensions || {},
//           metaTitle: productData.metaTitle,
//           metaDescription: productData.metaDescription
//         };
        
//         console.log('📦 JSON data:', jsonData);
        
//         const response = await api.post('/admin/products', jsonData, {
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         });
        
//         console.log('✅ Product created successfully (no images)');
//         return AdminProductModel.fromApi(response.data.data);
//       } else {
//         // We have files to upload - use FormData
//         console.log('📦 Uploading files with FormData');
        
//         const formData = new FormData();
        
//         // Add all product data as JSON string
//         const productJson = {
//           name: productData.name,
//           sku: productData.sku,
//           price: productData.price,
//           comparePrice: productData.comparePrice,
//           cost: productData.cost,
//           quantity: productData.quantity,
//           description: productData.description,
//           categoryId: productData.categoryId,
//           subCategoryId: productData.subCategoryId,
//           brand: productData.brand,
//           specifications: productData.specifications || {},
//           tags: productData.tags || [],
//           isActive: productData.isActive !== undefined ? productData.isActive : true,
//           isFeatured: productData.isFeatured || false,
//           isOnSale: productData.isOnSale || false,
//           salePrice: productData.salePrice,
//           saleStart: productData.saleStart,
//           saleEnd: productData.saleEnd,
//           weight: productData.weight,
//           dimensions: productData.dimensions || {},
//           metaTitle: productData.metaTitle,
//           metaDescription: productData.metaDescription
//         };
        
//         formData.append('productData', JSON.stringify(productJson));
        
//         // Add files
//         filesToUpload.forEach((fileObj, index) => {
//           formData.append('images', fileObj.file);
//           // Add metadata if needed
//           if (fileObj.isThumbnail) {
//             formData.append('thumbnailIndex', index.toString());
//           }
//         });
        
//         // Log FormData for debugging
//         console.log('📋 FormData entries:');
//         for (let [key, value] of formData.entries()) {
//           if (key === 'images') {
//             console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
//           } else {
//             console.log(`${key}:`, value);
//           }
//         }
        
//         const response = await api.post('/admin/products', formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         });
        
//         console.log('✅ Product created successfully (with images)');
//         return AdminProductModel.fromApi(response.data.data);
//       }
//     } catch (error) {
//       console.error('❌ Error creating product:', error);
      
//       if (error.response) {
//         console.error('📝 Error response:', {
//           status: error.response.status,
//           data: error.response.data,
//           message: error.response.data?.message || error.response.data
//         });
//       }
      
//       throw error;
//     }
//   }
 
//   // Update product with image support
//   async updateProduct(productId, productData) {
//     try {
//       const formData = new FormData();
//       const imagesToUpload = [];

//       // Separate files from other data
//       Object.keys(productData).forEach(key => {
//         if (key === 'images' && Array.isArray(productData[key])) {
//           // Process new images
//           productData[key].forEach((img, index) => {
//             if (img.file) {
//               // This is a new file that needs to be uploaded
//               imagesToUpload.push(img.file);
//             }
//           });
//           // Add existing image URLs as JSON
//           const existingImages = productData[key]
//             .filter(img => !img.file && img.url)
//             .map(img => ({
//               url: img.url,
//               isThumbnail: img.isThumbnail || false
//             }));
//           formData.append('images', JSON.stringify(existingImages));
//         } else if (typeof productData[key] === 'object') {
//           formData.append(key, JSON.stringify(productData[key]));
//         } else {
//           formData.append(key, productData[key]);
//         }
//       });

//       // Update product data
//       const response = await api.put(`/admin/products/${productId}`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       // Upload new images if any
//       if (imagesToUpload.length > 0) {
//         const imageFormData = new FormData();
//         imagesToUpload.forEach((file, index) => {
//           imageFormData.append('images', file);
//         });

//         await api.post(`/admin/products/${productId}/images`, imageFormData, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         });
//       }

//       // Update thumbnail if specified
//       if (productData.thumbnail) {
//         await api.put(`/admin/products/${productId}/thumbnail`, {
//           imageUrl: productData.thumbnail
//         });
//       }

//       return AdminProductModel.fromApi(response.data.data);
//     } catch (error) {
//       console.error('Error updating product:', error);
//       throw error;
//     }
//   }

//   // Upload images to existing product
//   async uploadProductImages(productId, files) {
//     try {
//       const formData = new FormData();
//       files.forEach(file => {
//         formData.append('images', file);
//       });

//       const response = await api.post(`/admin/products/${productId}/images`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       return response.data;
//     } catch (error) {
//       console.error('Error uploading product images:', error);
//       throw error;
//     }
//   }

//   // Set product thumbnail
//   async setProductThumbnail(productId, imageUrl) {
//     try {
//       const response = await api.put(`/admin/products/${productId}/thumbnail`, {
//         imageUrl
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error setting thumbnail:', error);
//       throw error;
//     }
//   }

//   // Delete product image
//   async deleteProductImage(productId, imageUrl) {
//     try {
//       const response = await api.delete(`/admin/products/${productId}/images`, {
//         data: { imageUrl }
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error deleting product image:', error);
//       throw error;
//     }
//   }

//   // Get product images
//   async getProductImages(productId) {
//     try {
//       const response = await api.get(`/products/${productId}/images`);
//       return response.data.data;
//     } catch (error) {
//       console.error('Error fetching product images:', error);
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
 

//   // ==================== EXISTING METHODS (UPDATED) ====================

//   async getProducts(filters = {}) {
//     try {
//       this.cancelPreviousRequest();
      
//       this.cancelTokenSource = axios.CancelToken.source();
      
//       const params = this.buildQueryParams(filters);
//       const response = await api.get('/products', {
//         params,
//         cancelToken: this.cancelTokenSource.token
//       });
       
//       return {
//         products: AdminProductModel.fromArray(response.data.data.products),
//         pagination: response.data.data.pagination
//       };
//     } catch (error) {
//       if (axios.isCancel(error)) {
//         console.log('Request cancelled:', error.message);
//         return null;
//       }
//       return this.handleError(error, 'Error fetching admin products');
//     }
//   }

//   async getProductById(productId) {
//     try {
//       const response = await api.get(`/products/${productId}`);
//       const productData = response.data.data;
      
//       // If we need to fetch images separately
//       if (!productData.images || productData.images.length === 0) {
//         const imagesResponse = await this.getProductImages(productId);
//         productData.images = imagesResponse.images || [];
//         productData.thumbnail = imagesResponse.thumbnail || null;
//       }
      
//       return AdminProductModel.fromApi(productData);
//     } catch (error) {
//       console.error('Error fetching admin product:', error);
//       throw error;
//     }
//   }

//   // ... rest of your existing methods remain the same

//   handleError(error, context = '') {
//     let errorMessage = 'An error occurred';
//     let errorCode = 'UNKNOWN_ERROR';

//     if (error.response) {
//       errorCode = error.response.data?.code || `HTTP_${error.response.status}`;
//       errorMessage = error.response.data?.message || error.response.statusText;
      
//       switch (error.response.status) {
//         case 401:
//           errorMessage = 'Authentication required';
//           break;
//         case 403:
//           errorMessage = 'You don\'t have permission to perform this action';
//           break;
//         case 404:
//           errorMessage = 'Product not found';
//           break;
//         case 429:
//           errorMessage = 'Too many requests. Please try again later';
//           break;
//         case 413:
//           errorMessage = 'File too large. Maximum size is 5MB';
//           break;
//         case 415:
//           errorMessage = 'Invalid file type. Only images are allowed';
//           break;
//       }
//     } else if (error.request) {
//       errorMessage = 'Network error. Please check your connection';
//       errorCode = 'NETWORK_ERROR';
//     }

//     const fullMessage = context ? `${context}: ${errorMessage}` : errorMessage;
    
//     console.error(`[AdminProductService] ${fullMessage}`, {
//       code: errorCode,
//       originalError: error
//     });

//     throw new Error(fullMessage);
//   }

//   buildQueryParams(filters) {
//     const params = {};
    
//     if (filters.search) params.search = filters.search;
//     if (filters.categoryId) params.categoryId = filters.categoryId;
//     if (filters.brand) params.brand = filters.brand;
//     if (filters.minPrice) params.minPrice = filters.minPrice;
//     if (filters.maxPrice) params.maxPrice = filters.maxPrice;
//     if (filters.minQuantity) params.minQuantity = filters.minQuantity;
//     if (filters.maxQuantity) params.maxQuantity = filters.maxQuantity;
//     if (filters.inStock !== undefined) params.inStock = filters.inStock;
//     if (filters.isActive !== undefined) params.isActive = filters.isActive;
//     if (filters.isFeatured !== undefined) params.isFeatured = filters.isFeatured;
//     if (filters.isOnSale !== undefined) params.isOnSale = filters.isOnSale;
//     if (filters.sortBy) params.sortBy = filters.sortBy;
//     if (filters.sortOrder) params.sortOrder = filters.sortOrder;
//     if (filters.page) params.page = filters.page;
//     if (filters.limit) params.limit = filters.limit;

//     return params;
//   }

//   // ==================== UTILITY METHODS ====================

//   // Convert File to base64 for preview
//   fileToBase64(file) {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = error => reject(error);
//     });
//   }

//   // Validate image file
//   validateImageFile(file) {
//     const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
//     const maxSize = 5 * 1024 * 1024; // 5MB

//     if (!validTypes.includes(file.type)) {
//       throw new Error(`Invalid file type: ${file.type}. Allowed types: ${validTypes.join(', ')}`);
//     }

//     if (file.size > maxSize) {
//       throw new Error(`File too large: ${(file.size / (1024 * 1024)).toFixed(2)}MB. Maximum size: 5MB`);
//     }

//     return true;
//   }
// }

// export default new AdminProductService();

// api/categoryApi.js
import api from '../api'; // Import the shared axios instance

class CategoryService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 30000; // 30 seconds cache
  }

  // Clear cache for specific endpoint or all
  clearCache(endpoint = null) {
    if (endpoint) {
      this.cache.delete(endpoint);
    } else {
      this.cache.clear();
    }
  }

  // Get all categories with caching
  async getCategories(forceRefresh = false) {
    const cacheKey = 'categories_all';
    
    // Check cache first
    if (!forceRefresh && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheExpiry) {
        console.log('📦 Returning cached categories');
        return cached.data;
      }
    }

    try {
      console.log('🌐 Fetching categories from API...');
      const response = await api.get('/categories');
      
      if (response.data.success) {
        const categories = response.data.data;
        
        // Cache the result
        this.cache.set(cacheKey, {
          data: categories,
          timestamp: Date.now()
        });
        
        return categories;
      }
      
      throw new Error(response.data.message || 'Failed to fetch categories');
      
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      
      // Return cached data even if expired on error
      if (this.cache.has(cacheKey)) {
        console.log('⚠️ Using expired cache due to error');
        return this.cache.get(cacheKey).data;
      }
      
      throw error;
    }
  }

  // Get category by slug
  async getCategoryBySlug(slug) {
    if (!slug) throw new Error('Slug is required');
    
    try {
      const response = await api.get(`/categories/${slug}`);
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Category not found');
      
    } catch (error) {
      console.error(`❌ Error fetching category ${slug}:`, error);
      
      // Handle 404 specifically
      if (error.response?.status === 404) {
        return null;
      }
      
      throw error;
    }
  }

  // Check if slug exists (for validation)
  async checkSlugExists(slug) {
    try {
      await api.get(`/categories/${slug}`);
      return true; // Exists if no error
    } catch (error) {
      if (error.response?.status === 404) {
        return false; // Doesn't exist
      }
      throw error; // Other errors
    }
  }

  // Create new category
  async createCategory(categoryData) {
    // Validate required fields
    if (!categoryData.name || !categoryData.slug) {
      throw new Error('Name and slug are required');
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(categoryData.slug)) {
      throw new Error('Slug can only contain lowercase letters, numbers, and hyphens');
    }

    try {
      // Prepare payload for backend
      const payload = {
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description || '',
        parentId: categoryData.parentId || null,
        image: categoryData.image || '',
        isActive: categoryData.isActive !== undefined ? categoryData.isActive : true,
        displayOrder: categoryData.displayOrder || 0,
        metaTitle: categoryData.metaTitle || '',
        metaDescription: categoryData.metaDescription || ''
      };

      console.log('📝 Creating category:', payload);
      const response = await api.post('/categories', payload);
      
      if (response.data.success) {
        // Clear categories cache
        this.clearCache('categories_all');
        
        console.log('✅ Category created successfully');
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to create category');
      
    } catch (error) {
      console.error('❌ Error creating category:', error);
      
      // Provide more specific error messages
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      if (error.response?.status === 409) {
        throw new Error('A category with this slug already exists');
      }
      
      throw error;
    }
  }

  // Update category
  async updateCategory(id, categoryData) {
    if (!id) throw new Error('Category ID is required');
    
    try {
      // Validate slug if provided
      if (categoryData.slug) {
        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(categoryData.slug)) {
          throw new Error('Slug can only contain lowercase letters, numbers, and hyphens');
        }
      }

      console.log(`📝 Updating category ${id}:`, categoryData);
      const response = await api.put(`/categories/${id}`, categoryData);
      
      if (response.data.success) {
        // Clear categories cache
        this.clearCache('categories_all');
        
        console.log('✅ Category updated successfully');
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to update category');
      
    } catch (error) {
      console.error(`❌ Error updating category ${id}:`, error);
      
      if (error.response?.status === 404) {
        throw new Error('Category not found');
      }
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw error;
    }
  }

  // Delete category
  async deleteCategory(id) {
    if (!id) throw new Error('Category ID is required');
    
    try {
      console.log(`🗑️ Deleting category ${id}...`);
      const response = await api.delete(`/categories/${id}`);
      
      if (response.data.success) {
        // Clear categories cache
        this.clearCache('categories_all');
        
        console.log('✅ Category deleted successfully');
        return response.data;
      }
      
      throw new Error(response.data.message || 'Failed to delete category');
      
    } catch (error) {
      console.error(`❌ Error deleting category ${id}:`, error);
      
      if (error.response?.status === 404) {
        throw new Error('Category not found');
      }
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw error;
    }
  }

  // Get category by ID
  async getCategoryById(id) {
    if (!id) throw new Error('Category ID is required');
    
    try {
      // Try the specific endpoint first if available
      const response = await api.get(`/categories/id/${id}`);
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Category not found');
      
    } catch (error) {
      // Fallback: fetch all and filter
      if (error.response?.status === 404) {
        console.log('⚠️ Direct ID endpoint not found, falling back to filter');
        const categories = await this.getCategories();
        return categories.find(cat => cat.categoryId === id || cat.id === id) || null;
      }
      
      console.error(`❌ Error fetching category by ID ${id}:`, error);
      throw error;
    }
  }

  // Get categories with hierarchy (if backend supports it)
  async getCategoriesHierarchy() {
    try {
      // If you have a specific hierarchy endpoint
      const response = await api.get('/categories/hierarchy');
      
      if (response.data.success) {
        return response.data.data;
      }
      
      // Fallback: build hierarchy client-side
      const categories = await this.getCategories();
      return this.buildHierarchy(categories);
      
    } catch (error) {
      // If hierarchy endpoint doesn't exist, build locally
      if (error.response?.status === 404) {
        const categories = await this.getCategories();
        return this.buildHierarchy(categories);
      }
      
      throw error;
    }
  }

  // Helper: Build hierarchy from flat list
  buildHierarchy(categories) {
    const categoryMap = new Map();
    const rootCategories = [];
    
    // Create map of all categories
    categories.forEach(cat => {
      categoryMap.set(cat.categoryId || cat.id, { ...cat, children: [] });
    });
    
    // Build hierarchy
    categories.forEach(cat => {
      const category = categoryMap.get(cat.categoryId || cat.id);
      if (cat.parentId && categoryMap.has(cat.parentId)) {
        categoryMap.get(cat.parentId).children.push(category);
      } else {
        rootCategories.push(category);
      }
    });
    
    return rootCategories;
  }

  // Get all parent categories (categories without parent)
  async getParentCategories() {
    try {
      const categories = await this.getCategories();
      return categories.filter(cat => !cat.parentId);
    } catch (error) {
      console.error('❌ Error getting parent categories:', error);
      throw error;
    }
  }

  // Get subcategories for a parent
  async getSubcategories(parentId) {
    if (!parentId) return [];
    
    try {
      const categories = await this.getCategories();
      return categories.filter(cat => cat.parentId === parentId);
    } catch (error) {
      console.error(`❌ Error getting subcategories for ${parentId}:`, error);
      throw error;
    }
  }
}

// Export as singleton instance
export default new CategoryService();
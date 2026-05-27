import api from '../api';
import { Blog, BlogComment, BlogLike } from '../../models/shared/Blog';

class BlogService {
  // Create blog

  // In blogService.js, update the createBlog method:
async createBlog(formData) {
  try {
    console.log('📤 [BLOG SERVICE] Creating blog with form data');
    
    // Validate FormData
    if (!formData || !(formData instanceof FormData)) {
      throw new Error('Invalid form data');
    }
    
    // Check if FormData has content
    console.log('📋 FormData validation:');
    console.log('FormData size:', formData.size);
    
    let hasRequiredFields = false;
    let hasContent = false;
    
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value instanceof File ? 
        `File - ${value.name} (${value.size} bytes)` : 
        `"${value}" (${typeof value})`);
      
      if (key === 'title' && value) hasRequiredFields = true;
      if (key === 'content' && value) hasContent = true;
    }
    
    if (!hasRequiredFields) {
      throw new Error('Title is required');
    }
    
    if (!hasContent) {
      throw new Error('Content is required');
    }
    
    console.log('✅ FormData validated successfully');
    
    // Send request
    console.log('🚀 Sending request to /blogs endpoint');
    const response = await api.post('/blogs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 second timeout
    });
    
    console.log('✅ [BLOG SERVICE] Blog created:', response.data);
    return new Blog(response.data.data);
    
  } catch (error) {
    console.error('❌ [BLOG SERVICE] Error creating blog:');
    console.error('  Request URL:', error.config?.url);
    console.error('  Method:', error.config?.method);
    console.error('  Headers:', error.config?.headers);
    console.error('  Status:', error.response?.status);
    console.error('  Status Text:', error.response?.statusText);
    console.error('  Response Data:', error.response?.data);
    console.error('  Message:', error.message);
    
    let errorMessage = 'Failed to create blog';
    
    if (error.response?.data) {
      const apiError = error.response.data;
      console.log('🔍 API Error object:', apiError);
      
      if (apiError.message) {
        errorMessage = apiError.message;
      } else if (apiError.error) {
        errorMessage = apiError.error;
      } else if (typeof apiError === 'string') {
        errorMessage = apiError;
      }
    }
    
    // Check for specific error types
    if (error.message?.includes('Network Error')) {
      errorMessage = 'Network error. Please check your connection.';
    } else if (error.message?.includes('timeout')) {
      errorMessage = 'Request timeout. Server is taking too long to respond.';
    }
    
    const detailedError = new Error(errorMessage);
    detailedError.response = error.response;
    throw detailedError;
  }
}

  // Get all blogs with filters
  async getAllBlogs(options = {}) {
    try {
      const {
        status = 'published',
        authorId = null,
        featured = null,
        limit = 10,
        offset = 0,
        sortBy = 'publishedAt',
        sortOrder = 'DESC',
        search = null
      } = options;

      console.log('📋 [BLOG SERVICE] Fetching blogs with options:', options);

      const params = {
        status,
        limit,
        offset,
        sortBy,
        sortOrder
      };

      if (authorId) params.author = authorId;
      if (featured !== null) params.featured = featured.toString();
      if (search) params.search = search;

      const response = await api.get('/blogs', { params });
      
      console.log('✅ [BLOG SERVICE] Blogs fetched:', response.data.count, 'items');
      
      return {
        success: true,
        data: (response.data.data || []).map(blog => new Blog(blog)),
        count: response.data.count || 0,
        total: response.data.total || 0,
        currentPage: response.data.currentPage || 1,
        totalPages: response.data.totalPages || 1
      };
      
    } catch (error) {
      console.error('❌ [BLOG SERVICE] Error fetching blogs:', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message
      });
      
      // Return empty results on error
      return {
        success: false,
        data: [],
        count: 0,
        total: 0,
        currentPage: 1,
        totalPages: 1,
        error: error.message || 'Failed to fetch blogs'
      };
    }
  }

  // Get blog by ID or slug
  async getBlogByIdOrSlug(identifier, includeRelated = true, incrementViews = true) {
    try {
      console.log('🔍 [BLOG SERVICE] Fetching blog:', identifier);
      
      const response = await api.get(`/blogs/${identifier}`, {
        params: {
          includeRelated: includeRelated.toString(),
          incrementViews: incrementViews.toString()
        }
      });
      
      return new Blog(response.data.data);
    } catch (error) {
      console.error('❌ [BLOG SERVICE] Error fetching blog:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Blog not found');
      }
      
      throw error;
    }
  }

  // Update blog
  async updateBlog(id, formData) {
    try {
      console.log('✏️ [BLOG SERVICE] Updating blog ID:', id);
      const response = await api.put(`/blogs/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return new Blog(response.data.data);
    } catch (error) {
      console.error('❌ [BLOG SERVICE] Error updating blog:', error);
      throw error;
    }
  }

  // Delete blog
  async deleteBlog(id) {
    try {
      console.log('🗑️ [BLOG SERVICE] Deleting blog ID:', id);
      const response = await api.delete(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ [BLOG SERVICE] Error deleting blog:', error);
      throw error;
    }
  }

  // Increment views
  async incrementViews(blogId) {
    try {
      console.log('👁️ [BLOG SERVICE] Incrementing views for blog:', blogId);
      const response = await api.post(`/blogs/${blogId}/views`);
      return response.data;
    } catch (error) {
      console.error('❌ [BLOG SERVICE] Error incrementing views:', error);
      throw error;
    }
  }

  // Like blog
  async likeBlog(blogId) {
    try {
      console.log('❤️ [BLOG SERVICE] Liking blog:', blogId);
      const response = await api.post(`/blogs/${blogId}/like`);
      return response.data;
    } catch (error) {
      console.error('❌ [BLOG SERVICE] Error liking blog:', error);
      throw error;
    }
  }

  // Share blog
  async shareBlog(blogId) {
    try {
      console.log('📤 [BLOG SERVICE] Sharing blog:', blogId);
      const response = await api.post(`/blogs/${blogId}/share`);
      return response.data;
    } catch (error) {
      console.error('❌ [BLOG SERVICE] Error sharing blog:', error);
      throw error;
    }
  }

  // Get blogs by author
  async getBlogsByAuthor(authorId, options = {}) {
    try {
      const { status = 'published', limit = 10, offset = 0 } = options;
      
      console.log('👤 [BLOG SERVICE] Fetching blogs by author:', authorId);
      
      const response = await api.get(`/blogs/author/${authorId}`, {
        params: { status, limit, offset }
      });
      
      return {
        success: true,
        data: (response.data.data || []).map(blog => new Blog(blog)),
        count: response.data.count || 0,
        total: response.data.total || 0,
        authorId: response.data.authorId || authorId
      };
    } catch (error) {
      console.error('❌ [BLOG SERVICE] Error fetching blogs by author:', error);
      throw error;
    }
  }

  // Get featured blogs
  async getFeaturedBlogs(limit = 5, offset = 0) {
    try {
      console.log('⭐ [BLOG SERVICE] Fetching featured blogs');
      
      const response = await api.get('/blogs/featured/all', {
        params: { limit, offset }
      });
      
      return {
        success: true,
        data: (response.data.data || []).map(blog => new Blog(blog)),
        count: response.data.count || 0,
        total: response.data.total || 0
      };
    } catch (error) {
      console.error('❌ [BLOG SERVICE] Error fetching featured blogs:', error);
      throw error;
    }
  }

  // Search blogs
  async searchBlogs(query, limit = 10, offset = 0) {
    try {
      console.log('🔍 [BLOG SERVICE] Searching blogs:', query);
      
      const response = await api.get('/blogs/search/all', {
        params: { q: query, limit, offset }
      });
      
      return {
        success: true,
        data: (response.data.data || []).map(blog => new Blog(blog)),
        count: response.data.count || 0,
        total: response.data.total || 0,
        query: response.data.query || query
      };
    } catch (error) {
      console.error('❌ [BLOG SERVICE] Error searching blogs:', error);
      throw error;
    }
  }



  async getBlogStats() {
    try {
      console.log('📊 [BLOG SERVICE] Fetching blog statistics');
      console.log('🌐 [BLOG SERVICE] Making request to /blogs/stats/all');
      
      const response = await api.get('/blogs/stats/all');
      
      console.log('✅ [BLOG SERVICE] Stats response:', {
        status: response.status,
        data: response.data
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ [BLOG SERVICE] Error fetching blog statistics:', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // Try alternative endpoints
      try {
        console.log('🔄 [BLOG SERVICE] Trying alternative endpoint: /api/blogs/stats');
        const altResponse = await api.get('/api/blogs/stats');
        return altResponse.data;
      } catch (altError) {
        console.error('❌ [BLOG SERVICE] Alternative endpoint also failed:', altError);
        throw error;
      }
    }
  }
  // Get blog statistics
  // async getBlogStats() {
  //   try {
  //     console.log('📊 [BLOG SERVICE] Fetching blog statistics');
  //     const response = await api.get('/blogs/stats/all');
  //     return response.data;
  //   } catch (error) {
  //     console.error('❌ [BLOG SERVICE] Error fetching blog statistics:', error);
  //     throw error;
  //   }
  // }

  // Health check
  async healthCheck() {
    try {
      console.log('🏥 [BLOG SERVICE] Checking blog health');
      const response = await api.get('/blogs/health/check');
      return response.data;
    } catch (error) {
      console.error('❌ [BLOG SERVICE] Blog health check failed:', error);
      throw error;
    }
  }

  // Get published blogs (convenience method)
  async getPublishedBlogs(limit = 10, offset = 0) {
    return this.getAllBlogs({
      status: 'published',
      limit,
      offset
    });
  }

  // Get draft blogs (convenience method)
  async getDraftBlogs(limit = 10, offset = 0) {
    return this.getAllBlogs({
      status: 'draft',
      limit,
      offset
    });
  }

  // Get recent blogs
  async getRecentBlogs(limit = 5) {
    return this.getAllBlogs({
      status: 'published',
      limit,
      offset: 0,
      sortBy: 'createdAt',
      sortOrder: 'DESC'
    });
  }

  // Get most viewed blogs
  async getMostViewedBlogs(limit = 5) {
    return this.getAllBlogs({
      status: 'published',
      limit,
      offset: 0,
      sortBy: 'views',
      sortOrder: 'DESC'
    });
  }

  // Get most liked blogs
  async getMostLikedBlogs(limit = 5) {
    return this.getAllBlogs({
      status: 'published',
      limit,
      offset: 0,
      sortBy: 'likes',
      sortOrder: 'DESC'
    });
  }
}

// Export as singleton instance
export default new BlogService();
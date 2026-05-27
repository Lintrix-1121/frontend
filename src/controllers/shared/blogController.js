import blogService from '../../services/shared/blogService';
import { Blog } from '../../models/shared/Blog';

class BlogController {
  // Create blog
  async createBlog(blogData, featuredImageFile) {
    try {
      console.log('🎯 [BLOG CONTROLLER] createBlog called');
      
      // Check what type of data we received
      console.log('📦 [BLOG CONTROLLER] Input type:', typeof blogData);
      console.log('📦 [BLOG CONTROLLER] Is FormData?', blogData instanceof FormData);
      
      if (blogData instanceof FormData) {
        console.log('📋 [BLOG CONTROLLER] Processing FormData');
        console.log('🔍 FormData contents:');
        for (let [key, value] of blogData.entries()) {
          console.log(`  ${key}:`, value instanceof File ? `File: ${value.name}` : value);
        }
      } else {
        console.log('📦 [BLOG CONTROLLER] blogData:', blogData);
        console.log('🖼️ [BLOG CONTROLLER] featuredImageFile:', featuredImageFile);
      }
      
      // Make sure we return a proper object
      const result = await blogService.createBlog(blogData);
      
      console.log('📨 [BLOG CONTROLLER] blogService returned:', result);
      
      // Check if blogService returned anything
      if (!result) {
        console.error('❌ [BLOG CONTROLLER] blogService returned undefined!');
        return {
          success: false,
          error: 'Service layer did not return a response',
          data: null
        };
      }
      
      // Return the expected format
      return {
        success: true,
        data: result,
        message: 'Blog created successfully'
      };
      
    } catch (error) {
      console.error('❌ [BLOG CONTROLLER] Error in createBlog:', error);
      console.error('❌ Error stack:', error.stack);
      
      // Extract error message
      let errorMessage = 'Failed to create blog';
      
      if (error.response?.data) {
        const apiError = error.response.data;
        console.error('🔍 API Error details:', apiError);
        errorMessage = apiError.message || apiError.error || error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // ALWAYS return an object
      return {
        success: false,
        error: errorMessage,
        data: null,
        details: error.response?.data || null
      };
    }
  }

  // Update blog
  async updateBlog(blogId, blogData, featuredImageFile) {
    try {
      if (!blogId) {
        throw new Error('Blog ID is required');
      }

      const blog = Blog.createFromForm(blogData);
      const formData = blog.toFormData(featuredImageFile);
      
      const result = await blogService.updateBlog(blogId, formData);
      return { success: true, data: result, message: 'Blog updated successfully' };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to update blog',
        details: error.response?.data || null
      };
    }
  }

  // Delete blog
  async deleteBlog(blogId) {
    try {
      if (!blogId) {
        throw new Error('Blog ID is required');
      }

      const result = await blogService.deleteBlog(blogId);
      return { success: true, message: result.message || 'Blog deleted successfully' };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to delete blog',
        details: error.response?.data || null
      };
    }
  }

  // Fetch all blogs
  async fetchBlogs(options = {}) {
    try {
      const result = await blogService.getAllBlogs(options);
      return result;
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to fetch blogs',
        data: [],
        count: 0,
        total: 0
      };
    }
  }

  // Fetch single blog
  async fetchBlog(identifier) {
    try {
      if (!identifier) {
        throw new Error('Blog identifier is required');
      }

      const blog = await blogService.getBlogByIdOrSlug(identifier);
      return { success: true, data: blog };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to fetch blog',
        data: null
      };
    }
  }

  // Increment blog views
  async incrementViews(blogId) {
    try {
      if (!blogId) {
        throw new Error('Blog ID is required');
      }

      const result = await blogService.incrementViews(blogId);
      return { success: true, message: 'Views incremented successfully', data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to increment views'
      };
    }
  }

  // Like blog
  async likeBlog(blogId) {
    try {
      if (!blogId) {
        throw new Error('Blog ID is required');
      }

      const result = await blogService.likeBlog(blogId);
      return { success: true, message: 'Blog liked successfully', data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to like blog'
      };
    }
  }

  // Share blog
  async shareBlog(blogId) {
    try {
      if (!blogId) {
        throw new Error('Blog ID is required');
      }

      const result = await blogService.shareBlog(blogId);
      return { success: true, message: 'Blog shared successfully', data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to share blog'
      };
    }
  }

  // Fetch blogs by author
  async fetchBlogsByAuthor(authorId, options = {}) {
    try {
      if (!authorId) {
        throw new Error('Author ID is required');
      }

      const result = await blogService.getBlogsByAuthor(authorId, options);
      return result;
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to fetch blogs by author',
        data: [],
        count: 0,
        total: 0
      };
    }
  }

  // Fetch featured blogs
  async fetchFeaturedBlogs(limit = 5, offset = 0) {
    try {
      const result = await blogService.getFeaturedBlogs(limit, offset);
      return result;
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to fetch featured blogs',
        data: [],
        count: 0,
        total: 0
      };
    }
  }

  // Search blogs
  async searchBlogs(query, limit = 10, offset = 0) {
    try {
      if (!query || query.trim() === '') {
        throw new Error('Search query is required');
      }

      const result = await blogService.searchBlogs(query, limit, offset);
      return result;
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to search blogs',
        data: [],
        count: 0,
        total: 0
      };
    }
  }



  async getBlogStatistics() {
    try {
      console.log('📊 [BLOG CONTROLLER] Getting blog statistics');
      const result = await blogService.getBlogStats();
      
      console.log('📈 [BLOG CONTROLLER] Service returned:', {
        success: !!result,
        data: result
      });
      
      // If service returns raw data, wrap it properly
      if (result && result.data) {
        return { 
          success: true, 
          data: result 
        };
      } else if (result) {
        // If result is already the data
        return { 
          success: true, 
          data: { data: result } 
        };
      } else {
        console.warn('⚠️ [BLOG CONTROLLER] No data returned from service');
        return { 
          success: false, 
          error: 'No statistics data available',
          data: null
        };
      }
      
    } catch (error) {
      console.error('❌ [BLOG CONTROLLER] Error in getBlogStatistics:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to get blog statistics',
        data: null
      };
    }
  }

  // Get blog statistics
  // async getBlogStatistics() {
  //   try {
  //     const result = await blogService.getBlogStats();
  //     return { success: true, data: result };
  //   } catch (error) {
  //     return { 
  //       success: false, 
  //       error: error.message || 'Failed to get blog statistics',
  //       data: null
  //     };
  //   }
  // }

  // Health check
  async healthCheck() {
    try {
      const result = await blogService.healthCheck();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to perform health check',
        data: null
      };
    }
  }

  // Convenience methods
  async fetchPublishedBlogs(limit = 10, offset = 0) {
    return this.fetchBlogs({
      status: 'published',
      limit,
      offset
    });
  }

  async fetchDraftBlogs(limit = 10, offset = 0) {
    return this.fetchBlogs({
      status: 'draft',
      limit,
      offset
    });
  }

  async fetchRecentBlogs(limit = 5) {
    return this.fetchBlogs({
      status: 'published',
      limit,
      offset: 0,
      sortBy: 'createdAt',
      sortOrder: 'DESC'
    });
  }

  async fetchMostViewedBlogs(limit = 5) {
    return this.fetchBlogs({
      status: 'published',
      limit,
      offset: 0,
      sortBy: 'views',
      sortOrder: 'DESC'
    });
  }

  async fetchMostLikedBlogs(limit = 5) {
    return this.fetchBlogs({
      status: 'published',
      limit,
      offset: 0,
      sortBy: 'likes',
      sortOrder: 'DESC'
    });
  }
}

export default new BlogController();


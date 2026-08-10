import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import BlogController from '../../controllers/shared/blogController';

// Helper functions to add to blog objects
const addBlogHelpers = (blog) => ({
  ...blog,
  getReadingTimeText() {
    const minutes = this.readingTime || Math.ceil((this.content || '').split(/\s+/).length / 200);
    return `${minutes} min read`;
  },
  getPublishedAtFormatted() {
    if (!this.publishedAt) return '';
    const date = new Date(this.publishedAt);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },
  getPublishedAtRelative() {
    if (!this.publishedAt) return '';
    const now = new Date();
    const pubDate = new Date(this.publishedAt);
    const diffMs = now - pubDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  },
  getAuthorInfo() {
    if (!this.author) return null;
    return {
      name: this.author.username || 'Anonymous',
      avatar: this.author.profilePicture || null,
      bio: this.author.bio || null
    };
  },
  getImageUrl() {
    if (!this.featuredImage && !this.featuredImageUrl) return null;
    
    const imagePath = this.featuredImage || this.featuredImageUrl;
    const baseUrl = import.meta.env.VITE_API_URL || 'https://api.logiphix.tech';
    
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return `${baseUrl}${imagePath}`;
    if (imagePath.includes('blog-')) return `${baseUrl}/uploads/blogs/${imagePath}`;
    
    return `${baseUrl}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
  },
  getExcerpt(maxLength = 160) {
    if (!this.excerpt) {
      // Generate excerpt from content
      const plainText = this.content?.replace(/<[^>]*>/g, '') || '';
      return plainText.length > maxLength 
        ? plainText.substring(0, maxLength) + '...'
        : plainText;
    }
    return this.excerpt;
  }
});

const useBlogStore = create(
  persist(
    (set, get) => ({
      // State
      blogs: [],
      currentBlog: null,
      loading: false,
      error: null,
      searchQuery: '',
      filters: {
        status: 'published',
        authorId: null,
        featured: null,
        sortBy: 'publishedAt',
        sortOrder: 'DESC'
      },
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
      },
      
      // Actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
      setPagination: (pagination) => set({ pagination: { ...get().pagination, ...pagination } }),
      
      // Fetch all blogs with filters - UPDATED
      fetchBlogs: async (options = {}) => {
        set({ loading: true, error: null });
        try {
          const result = await BlogController.fetchBlogs(options);
          
          if (result.success) {
            // Add helper methods to each blog
            const blogsWithHelpers = result.data.map(blog => addBlogHelpers(blog));
            
            set({ 
              blogs: blogsWithHelpers, 
              loading: false,
              pagination: {
                currentPage: result.currentPage || 1,
                totalPages: result.totalPages || 1,
                totalItems: result.total || 0,
                itemsPerPage: options.limit || 10
              }
            });
          } else {
            set({ error: result.error, loading: false });
          }
          
          return result;
        } catch (error) {
          console.error('[BLOG STORE] Error in fetchBlogs:', error);
          set({ 
            error: error.message || 'Failed to fetch blogs', 
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },
      
      // Fetch single blog - UPDATED
      fetchBlog: async (identifier) => {
        if (!identifier) {
          console.error(' [BLOG STORE] No identifier provided to fetchBlog');
          set({ error: 'Blog identifier is required', loading: false });
          return { success: false, error: 'Blog identifier is required' };
        }
        
        set({ loading: true, error: null });
        try {
          console.log('[BLOG STORE] Fetching blog:', identifier);
          const result = await BlogController.fetchBlog(identifier);
          
          if (result.success) {
            console.log(' [BLOG STORE] Blog fetched:', result.data);
            // Add helper methods to the blog
            const blogWithHelpers = addBlogHelpers(result.data);
            set({ currentBlog: blogWithHelpers, loading: false });
          } else {
            console.error(' [BLOG STORE] Failed to fetch blog:', result.error);
            set({ error: result.error, loading: false });
          }
          
          return result;
        } catch (error) {
          console.error(' [BLOG STORE] Error in fetchBlog:', error);
          set({ 
            error: error.message || 'Failed to fetch blog', 
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },
      
      // Create blog - UPDATED
      createBlog: async (formData) => {
        set({ loading: true, error: null });
        
        try {
          console.log('[BLOG STORE] Creating blog with formData');
          
          // Debug: Log FormData contents before sending
          console.log(' [BLOG STORE] FormData verification before sending:');
          let hasTitle = false;
          let hasContent = false;
          let hasAuthorId = false;
          
          for (let [key, value] of formData.entries()) {
            console.log(`  ${key}:`, value instanceof File ? `File: ${value.name}` : value);
            if (key === 'title') hasTitle = true;
            if (key === 'content') hasContent = true;
            if (key === 'authorId') hasAuthorId = true;
          }
          
          if (!hasTitle) {
            console.error('[BLOG STORE] Title is missing in FormData!');
            set({ error: 'Title is required', loading: false });
            return { success: false, error: 'Title is required' };
          }
          
          if (!hasContent) {
            console.error('[BLOG STORE] Content is missing in FormData!');
            set({ error: 'Content is required', loading: false });
            return { success: false, error: 'Content is required' };
          }
          
          if (!hasAuthorId) {
            console.error(' [BLOG STORE] Author ID is missing in FormData!');
            set({ error: 'Author ID is required', loading: false });
            return { success: false, error: 'Author ID is required' };
          }
          
          // Extract values for debugging
          const title = formData.get('title');
          const content = formData.get('content');
          const authorId = formData.get('authorId');
          
          console.log(' [BLOG STORE] Title value:', title);
          console.log(' [BLOG STORE] Content length:', content?.length || 0);
          console.log(' [BLOG STORE] Author ID:', authorId);
          
          // Call the controller
          console.log(' [BLOG STORE] Calling BlogController.createBlog()');
          const result = await BlogController.createBlog(formData);
          
          console.log(' [BLOG STORE] Controller returned:', result);
          
          // Check if result is undefined
          if (!result) {
            console.error(' [BLOG STORE] Controller returned undefined!');
            set({ 
              error: 'Server did not return a response', 
              loading: false 
            });
            return { 
              success: false, 
              error: 'Server did not return a response' 
            };
          }
          
          // Check if result has success property
          if (result.success === undefined) {
            console.error(' [BLOG STORE] Result missing success property:', result);
            set({ 
              error: 'Invalid response from server', 
              loading: false 
            });
            return { 
              success: false, 
              error: 'Invalid response from server' 
            };
          }
          
          if (result.success) {
            console.log(' [BLOG STORE] Blog created successfully:', result.data);
            //helper methods to the new blog
            const blogWithHelpers = addBlogHelpers(result.data);
            set((state) => ({
              blogs: [...state.blogs, blogWithHelpers],
              loading: false,
              error: null
            }));
            
            // Refresh blogs list
            await get().fetchBlogs(get().filters);
          } else {
            console.error(' [BLOG STORE] Controller returned error:', result.error);
            set({ error: result.error, loading: false });
          }
          
          return result;
        } catch (error) {
          console.error(' [BLOG STORE] Error in createBlog:', error);
          console.error(' Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
          });
          set({ 
            error: error.message || 'Failed to create blog', 
            loading: false 
          });
          return { 
            success: false, 
            error: error.message || 'Failed to create blog' 
          };
        }
      },
      
      // Update blog 
      updateBlog: async (blogId, formData) => {
        if (!blogId) {
          console.error(' [BLOG STORE] No blogId provided to updateBlog');
          set({ error: 'Blog ID is required', loading: false });
          return { success: false, error: 'Blog ID is required' };
        }
        
        set({ loading: true, error: null });
        
        try {
          console.log('🏪 [BLOG STORE] Updating blog ID:', blogId);
          
          // Debug: Log FormData contents before sending
          console.log('🔍 [BLOG STORE] FormData verification before sending:');
          for (let [key, value] of formData.entries()) {
            console.log(`  ${key}:`, value instanceof File ? `File: ${value.name}` : value);
          }
          
          const result = await BlogController.updateBlog(blogId, formData);
          
          if (result.success) {
            console.log(' [BLOG STORE] Blog updated successfully:', result.data);
            // helper methods to the updated blog
            const blogWithHelpers = addBlogHelpers(result.data);
            set((state) => ({
              blogs: state.blogs.map(blog => 
                blog.blogId === blogId ? blogWithHelpers : blog
              ),
              currentBlog: state.currentBlog?.blogId === blogId ? blogWithHelpers : state.currentBlog,
              loading: false,
              error: null
            }));
            
            // Refresh the current blog
            await get().fetchBlog(blogId);
          } else {
            console.error(' [BLOG STORE] Controller returned error:', result.error);
            set({ error: result.error, loading: false });
          }
          
          return result;
        } catch (error) {
          console.error('[BLOG STORE] Error in updateBlog:', error);
          set({ 
            error: error.message || 'Failed to update blog', 
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },
      
      // Fetch blogs by author 
      fetchBlogsByAuthor: async (authorId, options = {}) => {
        if (!authorId) {
          console.error(' [BLOG STORE] No authorId provided to fetchBlogsByAuthor');
          set({ error: 'Author ID is required', loading: false });
          return { success: false, error: 'Author ID is required' };
        }
        
        set({ loading: true, error: null });
        
        try {
          console.log(' [BLOG STORE] Fetching blogs by author:', authorId);
          const result = await BlogController.fetchBlogsByAuthor(authorId, options);
          
          if (result.success) {
            console.log(' [BLOG STORE] Blogs fetched by author:', result.data.length);
            // Add helper methods to each blog
            const blogsWithHelpers = result.data.map(blog => addBlogHelpers(blog));
            set({ 
              blogs: blogsWithHelpers, 
              loading: false,
              pagination: {
                currentPage: 1,
                totalPages: 1,
                totalItems: result.total || 0,
                itemsPerPage: options.limit || 10
              }
            });
          } else {
            console.error(' [BLOG STORE] Failed to fetch blogs by author:', result.error);
            set({ error: result.error, loading: false });
          }
          
          return result;
        } catch (error) {
          console.error(' [BLOG STORE] Error in fetchBlogsByAuthor:', error);
          set({ 
            error: error.message || 'Failed to fetch blogs by author', 
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },
      
      // Fetch featured blogs
      fetchFeaturedBlogs: async (limit = 5, offset = 0) => {
        set({ loading: true, error: null });
        
        try {
          console.log(' [BLOG STORE] Fetching featured blogs');
          const result = await BlogController.fetchFeaturedBlogs(limit, offset);
          
          if (result.success) {
            console.log(' [BLOG STORE] Featured blogs fetched:', result.data.length);
            //helper methods to each blog
            const blogsWithHelpers = result.data.map(blog => addBlogHelpers(blog));
            set({ 
              blogs: blogsWithHelpers, 
              loading: false,
              pagination: {
                currentPage: 1,
                totalPages: 1,
                totalItems: result.total || 0,
                itemsPerPage: limit
              }
            });
          } else {
            console.error(' [BLOG STORE] Failed to fetch featured blogs:', result.error);
            set({ error: result.error, loading: false });
          }
          
          return result;
        } catch (error) {
          console.error(' [BLOG STORE] Error in fetchFeaturedBlogs:', error);
          set({ 
            error: error.message || 'Failed to fetch featured blogs', 
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },
      
      // Search blogs 
      searchBlogs: async (query, limit = 10, offset = 0) => {
        if (!query || query.trim() === '') {
          console.error(' [BLOG STORE] No query provided to searchBlogs');
          set({ error: 'Search query is required', loading: false });
          return { success: false, error: 'Search query is required' };
        }
        
        set({ loading: true, error: null });
        
        try {
          console.log(' [BLOG STORE] Searching blogs:', query);
          const result = await BlogController.searchBlogs(query, limit, offset);
          
          if (result.success) {
            console.log(' [BLOG STORE] Search results:', result.data.length);
            // helper methods to each blog
            const blogsWithHelpers = result.data.map(blog => addBlogHelpers(blog));
            set({ 
              blogs: blogsWithHelpers, 
              loading: false,
              searchQuery: query,
              pagination: {
                currentPage: 1,
                totalPages: 1,
                totalItems: result.total || 0,
                itemsPerPage: limit
              }
            });
          } else {
            console.error(' [BLOG STORE] Failed to search blogs:', result.error);
            set({ error: result.error, loading: false });
          }
          
          return result;
        } catch (error) {
          console.error(' [BLOG STORE] Error in searchBlogs:', error);
          set({ 
            error: error.message || 'Failed to search blogs', 
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },

        // Delete blog
      deleteBlog: async (blogId) => {
        if (!blogId) {
          console.error(' [BLOG STORE] No blogId provided to deleteBlog');
          set({ error: 'Blog ID is required', loading: false });
          return { success: false, error: 'Blog ID is required' };
        }
        
        set({ loading: true, error: null });
        
        try {
          console.log(' [BLOG STORE] Deleting blog ID:', blogId);
          const result = await BlogController.deleteBlog(blogId);
          
          if (result.success) {
            console.log(' [BLOG STORE] Blog deleted successfully');
            set((state) => ({
              blogs: state.blogs.filter(blog => blog.blogId !== blogId),
              currentBlog: state.currentBlog?.blogId === blogId ? null : state.currentBlog,
              loading: false,
              error: null
            }));
          } else {
            console.error(' [BLOG STORE] Controller returned error:', result.error);
            set({ error: result.error, loading: false });
          }
          
          return result;
        } catch (error) {
          console.error(' [BLOG STORE] Error in deleteBlog:', error);
          set({ 
            error: error.message || 'Failed to delete blog', 
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },
      
      // Increment blog views
      incrementViews: async (blogId) => {
        if (!blogId) {
          console.error(' [BLOG STORE] No blogId provided to incrementViews');
          set({ error: 'Blog ID is required', loading: false });
          return { success: false, error: 'Blog ID is required' };
        }
        
        set({ loading: true, error: null });
        
        try {
          console.log(' [BLOG STORE] Incrementing views for blog:', blogId);
          const result = await BlogController.incrementViews(blogId);
          
          if (result.success) {
            console.log(' [BLOG STORE] Views incremented successfully');
            // Update current blog if it's the one being viewed
            if (get().currentBlog?.blogId === blogId) {
              set((state) => ({
                currentBlog: {
                  ...state.currentBlog,
                  views: (state.currentBlog.views || 0) + 1
                },
                loading: false,
                error: null
              }));
            }
          } else {
            console.error(' [BLOG STORE] Controller returned error:', result.error);
            set({ error: result.error, loading: false });
          }
          
          return result;
        } catch (error) {
          console.error(' [BLOG STORE] Error in incrementViews:', error);
          set({ 
            error: error.message || 'Failed to increment views', 
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },
      
      // Like blog
      likeBlog: async (blogId) => {
        if (!blogId) {
          console.error(' [BLOG STORE] No blogId provided to likeBlog');
          set({ error: 'Blog ID is required', loading: false });
          return { success: false, error: 'Blog ID is required' };
        }
        
        set({ loading: true, error: null });
        
        try {
          console.log(' [BLOG STORE] Liking blog:', blogId);
          const result = await BlogController.likeBlog(blogId);
          
          if (result.success) {
            console.log('[BLOG STORE] Blog liked successfully');
            // Update current blog if it's the one being liked
            if (get().currentBlog?.blogId === blogId) {
              set((state) => ({
                currentBlog: {
                  ...state.currentBlog,
                  likes: (state.currentBlog.likes || 0) + 1
                },
                loading: false,
                error: null
              }));
            }
          } else {
            console.error(' [BLOG STORE] Controller returned error:', result.error);
            set({ error: result.error, loading: false });
          }
          
          return result;
        } catch (error) {
          console.error(' [BLOG STORE] Error in likeBlog:', error);
          set({ 
            error: error.message || 'Failed to like blog', 
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },
      
      // Share blog
      shareBlog: async (blogId) => {
        if (!blogId) {
          console.error(' [BLOG STORE] No blogId provided to shareBlog');
          set({ error: 'Blog ID is required', loading: false });
          return { success: false, error: 'Blog ID is required' };
        }
        
        set({ loading: true, error: null });
        
        try {
          console.log(' [BLOG STORE] Sharing blog:', blogId);
          const result = await BlogController.shareBlog(blogId);
          
          if (result.success) {
            console.log(' [BLOG STORE] Blog shared successfully');
            // Update current blog if it's the one being shared
            if (get().currentBlog?.blogId === blogId) {
              set((state) => ({
                currentBlog: {
                  ...state.currentBlog,
                  shares: (state.currentBlog.shares || 0) + 1
                },
                loading: false,
                error: null
              }));
            }
          } else {
            console.error(' [BLOG STORE] Controller returned error:', result.error);
            set({ error: result.error, loading: false });
          }
          
          return result;
        } catch (error) {
          console.error(' [BLOG STORE] Error in shareBlog:', error);
          set({ 
            error: error.message || 'Failed to share blog', 
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },
      


      // Get blog statistics
      getBlogStatistics: async () => {
        set({ loading: true, error: null });
        
        try {
          console.log(' [BLOG STORE] Fetching blog statistics');
          const result = await BlogController.getBlogStatistics();
          
          if (result.success) {
            console.log(' [BLOG STORE] Blog statistics fetched');
            set({ loading: false, error: null });
          } else {
            console.error(' [BLOG STORE] Failed to fetch blog statistics:', result.error);
            set({ error: result.error, loading: false });
          }
          
          return result;
        } catch (error) {
          console.error(' [BLOG STORE] Error in getBlogStatistics:', error);
          set({ 
            error: error.message || 'Failed to fetch blog statistics', 
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },


      // Clear current blog
      clearCurrentBlog: () => {
        console.log(' [BLOG STORE] Clearing current blog');
        set({ currentBlog: null });
      },
      
      // Clear error
      clearError: () => set({ error: null }),
      
      // Clear search query
      clearSearchQuery: () => set({ searchQuery: '' }),
      
      // Reset filters
      resetFilters: () => set({ 
        filters: {
          status: 'published',
          authorId: null,
          featured: null,
          sortBy: 'publishedAt',
          sortOrder: 'DESC'
        }
      }),

       // Get filtered blogs
      getFilteredBlogs: () => {
        const { blogs, searchQuery, filters } = get();
        
        let filteredBlogs = [...blogs];
        
        // Apply search filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          filteredBlogs = filteredBlogs.filter(blog => 
            blog.title.toLowerCase().includes(query) ||
            blog.excerpt?.toLowerCase().includes(query) ||
            blog.content?.toLowerCase().includes(query) ||
            blog.metaKeywords?.toLowerCase().includes(query)
          );
        }
        
        // Apply status filter
        if (filters.status) {
          filteredBlogs = filteredBlogs.filter(blog => blog.status === filters.status);
        }
        
        // Apply author filter
        if (filters.authorId) {
          filteredBlogs = filteredBlogs.filter(blog => blog.authorId === filters.authorId);
        }
        
        // Apply featured filter
        if (filters.featured !== null) {
          filteredBlogs = filteredBlogs.filter(blog => blog.isFeatured === filters.featured);
        }
        
        // Apply sorting
        filteredBlogs.sort((a, b) => {
          let aValue = a[filters.sortBy] || 0;
          let bValue = b[filters.sortBy] || 0;
          
          // Handle dates
          if (filters.sortBy.includes('At')) {
            aValue = new Date(aValue).getTime();
            bValue = new Date(bValue).getTime();
          }
          
          if (filters.sortOrder === 'DESC') {
            return bValue - aValue;
          } else {
            return aValue - bValue;
          }
        });
        
        return filteredBlogs;
      },
      
      // Get published blogs
      getPublishedBlogs: () => {
        const { blogs } = get();
        return blogs.filter(blog => blog.status === 'published');
      },
      
      // Get draft blogs
      getDraftBlogs: () => {
        const { blogs } = get();
        return blogs.filter(blog => blog.status === 'draft');
      },

       // Get archived blogs
      getArchivedBlogs: () => {
        const { blogs } = get();
        return blogs.filter(blog => blog.status === 'archived');
      },
      
       // Get featured blogs
      getFeaturedBlogs: () => {
        const { blogs } = get();
        return blogs.filter(blog => blog.isFeatured && blog.status === 'published');
      },
      
      // Get blog by ID
      getBlogById: (blogId) => {
        const { blogs } = get();
        return blogs.find(blog => blog.blogId === blogId);
      },
      
      // Get blog by slug
      getBlogBySlug: (slug) => {
        const { blogs } = get();
        return blogs.find(blog => blog.slug === slug);
      },
      
      // Get blogs by author
      getBlogsByAuthorId: (authorId) => {
        const { blogs } = get();
        return blogs.filter(blog => blog.authorId === authorId);
      },
      
      // Get recent blogs
      getRecentBlogs: (limit = 5) => {
        const publishedBlogs = get().getPublishedBlogs();
        return publishedBlogs
          .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
          .slice(0, limit);
      },
      
      // Get most viewed blogs
      getMostViewedBlogs: (limit = 5) => {
        const publishedBlogs = get().getPublishedBlogs();
        return publishedBlogs
          .sort((a, b) => b.views - a.views)
          .slice(0, limit);
      },
      
      // Get most liked blogs
      getMostLikedBlogs: (limit = 5) => {
        const publishedBlogs = get().getPublishedBlogs();
        return publishedBlogs
          .sort((a, b) => b.likes - a.likes)
          .slice(0, limit);
      },
      
       // Clear all data (for debugging)
      clearStore: () => {
        console.log(' [BLOG STORE] Clearing all data');
        set({ 
          blogs: [], 
          currentBlog: null, 
          loading: false, 
          error: null, 
          searchQuery: '',
          filters: {
            status: 'published',
            authorId: null,
            featured: null,
            sortBy: 'publishedAt',
            sortOrder: 'DESC'
          },
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: 10
          }
        });
      }
      //All these getter methods will With helper methods
      // because the blogs are already transformed when fetched
      
    }),
    {
      name: 'blog-storage',
      partialize: (state) => ({ 
        blogs: state.blogs,
        currentBlog: state.currentBlog,
        filters: state.filters
      }),
      onRehydrateStorage: () => {
        console.log(' [BLOG STORE] Storage rehydrated');
        return (state) => {
          if (state) {
            // Re-add helper methods to blogs loaded from storage
            if (state.blogs && state.blogs.length > 0) {
              state.blogs = state.blogs.map(blog => addBlogHelpers(blog));
            }
            if (state.currentBlog) {
              state.currentBlog = addBlogHelpers(state.currentBlog);
            }
            
            console.log(' [BLOG STORE] Loaded from storage:', {
              blogsCount: state.blogs?.length || 0,
              hasCurrentBlog: !!state.currentBlog,
              filters: state.filters
            });
          }
        };
      }
    }
  )
);

export default useBlogStore;



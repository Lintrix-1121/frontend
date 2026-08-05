import React, { useState, useEffect } from 'react';
import BlogEntryForm from '../admin/BlogForm';
import useBlogStore from '../../stores/shared/blogStore';

const BlogManagement = () => {
  // Store state and actions
  const blogs = useBlogStore(state => state.blogs);
  const loading = useBlogStore(state => state.loading);
  const error = useBlogStore(state => state.error);
  const fetchBlogs = useBlogStore(state => state.fetchBlogs);
  const deleteBlog = useBlogStore(state => state.deleteBlog);
  const clearError = useBlogStore(state => state.clearError);
  
  // Getter methods using selector pattern
  const getPublishedBlogs = useBlogStore(state => state.getPublishedBlogs);
  const getDraftBlogs = useBlogStore(state => state.getDraftBlogs);
  const getArchivedBlogs = useBlogStore(state => state.getArchivedBlogs);
  const getFeaturedBlogs = useBlogStore(state => state.getFeaturedBlogs);
  
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('publishedAt');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(viewMode === 'grid' ? 9 : 10);
  const [bulkSelection, setBulkSelection] = useState([]);
  const [imagePreviewMode, setImagePreviewMode] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [debugMode, setDebugMode] = useState(false);
  const [debugData, setDebugData] = useState(null);

  // Get base URL from environment or use current origin
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.logiphix.tech';
  const UPLOADS_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.logiphix.tech';

  // Debug logs
  useEffect(() => {
    console.log('=== BLOG MANAGEMENT DEBUG ===');
    console.log('Total blogs:', blogs.length);
    console.log('Base URLs:', { API_BASE_URL, UPLOADS_BASE_URL });
    console.log('Getter functions available:', {
      getPublishedBlogs: typeof getPublishedBlogs,
      getFeaturedBlogs: typeof getFeaturedBlogs,
      getDraftBlogs: typeof getDraftBlogs,
      getArchivedBlogs: typeof getArchivedBlogs
    });
    
    if (blogs.length > 0) {
      blogs.forEach((blog, index) => {
        const imagePath = blog.featuredImage || blog.featuredImageUrl;
        console.log(`Blog ${index + 1} (${blog.title}):`, {
          hasImage: !!imagePath,
          imagePath,
          constructedUrl: imagePath ? constructImageUrl(imagePath) : 'No image'
        });
      });
    }
  }, [blogs]);

  // Construct proper image URL
  const constructImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If already a full URL, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If it starts with /uploads, use uploads base URL
    if (imagePath.startsWith('/uploads')) {
      return `${UPLOADS_BASE_URL}${imagePath}`;
    }
    
    // If it's just a filename, construct full path
    if (imagePath.includes('blog-')) {
      return `${UPLOADS_BASE_URL}/uploads/blogs/${imagePath}`;
    }
    
    // Default: prepend uploads base URL
    return `${UPLOADS_BASE_URL}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
  };

  // Load blogs on component mount and when dependencies change
  useEffect(() => {
    loadBlogs();
  }, [activeTab, page, sortBy, sortOrder, viewMode]);

  const loadBlogs = async () => {
    const options = {
      status: activeTab === 'all' ? undefined : activeTab,
      limit: itemsPerPage,
      offset: (page - 1) * itemsPerPage,
      sortBy,
      sortOrder,
      includeImages: true
    };
    await fetchBlogs(options);
  };

  const handleCreateBlog = () => {
    setSelectedBlog(null);
    setFormMode('create');
    setShowForm(true);
  };

  const handleEditBlog = (blog) => {
    setSelectedBlog(blog);
    setFormMode('edit');
    setShowForm(true);
  };

  const handleViewBlog = (blog) => {
    setSelectedBlog(blog);
    setFormMode('view');
    setShowForm(true);
  };

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      const result = await deleteBlog(blogId);
      if (result.success) {
        loadBlogs();
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    console.log('Form submitted, reloading blogs...');
    setShowForm(false);
    await loadBlogs();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedBlog(null);
  };

  // Image preview functions
  const openImagePreview = (imageUrl, altText) => {
    setPreviewImage({ url: imageUrl, alt: altText });
    setImagePreviewMode(true);
  };

  const closeImagePreview = () => {
    setImagePreviewMode(false);
    setPreviewImage(null);
  };

  // Debug function
  const debugBlog = (blog) => {
    const imagePath = blog.featuredImage || blog.featuredImageUrl;
    const constructedUrl = constructImageUrl(imagePath);
    
    console.log('Blog debug:', {
      title: blog.title,
      blogId: blog.blogId,
      imagePath,
      constructedUrl,
      allFields: Object.keys(blog)
    });
    
    setDebugData({ ...blog, constructedUrl });
    setDebugMode(true);
  };

  const handleBulkAction = (action) => {
    if (bulkSelection.length === 0) {
      alert('Please select at least one blog post');
      return;
    }
    
    switch (action) {
      case 'delete':
        if (window.confirm(`Delete ${bulkSelection.length} selected blog posts?`)) {
          bulkSelection.forEach(blogId => {
            deleteBlog(blogId);
          });
          setBulkSelection([]);
          loadBlogs();
        }
        break;
      default:
        alert(`${action} functionality to be implemented`);
    }
  };

  const toggleBulkSelection = (blogId) => {
    setBulkSelection(prev => 
      prev.includes(blogId) 
        ? prev.filter(id => id !== blogId)
        : [...prev, blogId]
    );
  };

  const toggleSelectAll = () => {
    const currentBlogs = getFilteredBlogs();
    if (bulkSelection.length === currentBlogs.length) {
      setBulkSelection([]);
    } else {
      setBulkSelection(currentBlogs.map(blog => blog.blogId));
    }
  };

  const getFilteredBlogs = () => {
    let filtered = [...blogs];
    
    // Apply tab filter - with null checks
    if (activeTab === 'published') {
      filtered = getPublishedBlogs ? getPublishedBlogs() : filtered.filter(b => b.status === 'published');
    } else if (activeTab === 'draft') {
      filtered = getDraftBlogs ? getDraftBlogs() : filtered.filter(b => b.status === 'draft');
    } else if (activeTab === 'archived') {
      filtered = getArchivedBlogs ? getArchivedBlogs() : filtered.filter(b => b.status === 'archived');
    } else if (activeTab === 'featured') {
      filtered = getFeaturedBlogs ? getFeaturedBlogs() : filtered.filter(b => b.isFeatured && b.status === 'published');
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(blog => 
        blog.title?.toLowerCase().includes(term) ||
        blog.excerpt?.toLowerCase().includes(term) ||
        blog.content?.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy] || 0;
      let bValue = b[sortBy] || 0;
      
      if (sortBy.includes('At')) {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      return sortOrder === 'DESC' ? bValue - aValue : aValue - bValue;
    });
    
    return filtered;
  };

  // Get counts for display - with fallbacks
  const getPublishedBlogsCount = () => {
    return getPublishedBlogs ? getPublishedBlogs().length : blogs.filter(b => b.status === 'published').length;
  };

  const getFeaturedBlogsCount = () => {
    return getFeaturedBlogs ? getFeaturedBlogs().length : blogs.filter(b => b.isFeatured && b.status === 'published').length;
  };

  const getDraftBlogsCount = () => {
    return getDraftBlogs ? getDraftBlogs().length : blogs.filter(b => b.status === 'draft').length;
  };

  const getArchivedBlogsCount = () => {
    return getArchivedBlogs ? getArchivedBlogs().length : blogs.filter(b => b.status === 'archived').length;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return <span className="badge bg-success">Published</span>;
      case 'draft':
        return <span className="badge bg-secondary">Draft</span>;
      case 'archived':
        return <span className="badge bg-warning text-dark">Archived</span>;
      default:
        return <span className="badge bg-light text-dark">{status}</span>;
    }
  };

  const getFeaturedBadge = (isFeatured) => {
    return isFeatured ? (
      <span className="badge bg-warning text-dark ms-1">
        <i className="bi bi-star-fill me-1"></i>Featured
      </span>
    ) : null;
  };

  // Image display component with proper CORS handling
  const BlogImage = ({ blog, size = 'sm', className = '', previewable = true }) => {
    const sizes = {
      sm: { width: 50, height: 50 },
      md: { width: 100, height: 100 },
      lg: { width: '100%', height: 200 }
    };
    
    const sizeStyle = sizes[size] || sizes.sm;
    
    // Get image from either field name
    const imagePath = blog.featuredImage || blog.featuredImageUrl;
    const imageUrl = constructImageUrl(imagePath);
    
    if (imageUrl) {
      return (
        <div 
          className={`rounded overflow-hidden ${className} ${previewable ? 'cursor-pointer' : ''}`}
          style={{
            width: sizeStyle.width,
            height: sizeStyle.height,
            objectFit: 'cover'
          }}
          onClick={() => previewable && openImagePreview(imageUrl, blog.title)}
        >
          <img
            src={imageUrl}
            alt={blog.title}
            className="w-100 h-100"
            style={{ objectFit: 'cover' }}
            onError={(e) => {
              console.error('Image failed to load:', {
                url: imageUrl,
                blogId: blog.blogId,
                title: blog.title
              });
              
              // Show error placeholder
              e.target.style.display = 'none';
              const parent = e.target.parentElement;
              parent.innerHTML = `
                <div class="bg-light w-100 h-100 d-flex align-items-center justify-content-center">
                  <div class="text-center text-muted">
                    <i class="bi bi-exclamation-triangle text-warning fs-4"></i>
                    <div class="small mt-1">Image not found</div>
                    <button class="btn btn-sm btn-outline-secondary mt-2" onclick="console.log('Test loading image: ${imageUrl}')">
                      Debug
                    </button>
                  </div>
                </div>
              `;
            }}
            onLoad={() => console.log(' Image loaded successfully:', imageUrl)}
            crossOrigin="anonymous" //crossOrigin for CORS
          />
        </div>
      );
    }
    
    // Placeholder for blogs without images
    return (
      <div 
        className={`bg-light d-flex align-items-center justify-content-center rounded ${className}`}
        style={{
          width: sizeStyle.width,
          height: sizeStyle.height
        }}
      >
        <div className="text-center text-muted">
          <i className="bi bi-image fs-4"></i>
          <div className="small mt-1">No Image</div>
        </div>
      </div>
    );
  };

  // Calculate pagination
  const filteredBlogs = getFilteredBlogs();
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const paginatedBlogs = filteredBlogs.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Count blogs with images
  const blogsWithImages = blogs.filter(blog => blog.featuredImage || blog.featuredImageUrl).length;

  // Helper function to get formatted date
  const getPublishedAtFormatted = (blog) => {
    if (!blog.publishedAt) return 'Draft';
    try {
      const date = new Date(blog.publishedAt);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (showForm) {
    return (
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12">
            <button
              className="btn btn-outline-secondary"
              onClick={handleFormCancel}
            >
              <i className="bi bi-arrow-left me-2"></i>Back to Blog List
            </button>
          </div>
        </div>
        
        <BlogEntryForm
          initialData={selectedBlog}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          mode={formMode}
          loading={loading}
        />
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Debug Modal */}
      {debugMode && debugData && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Blog Data Debug</h5>
                <button type="button" className="btn-close" onClick={() => setDebugMode(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Image Debug Info:</h6>
                    <div className="card">
                      <div className="card-body">
                        <p><strong>Title:</strong> {debugData.title}</p>
                        <p><strong>Original Path:</strong> {debugData.featuredImage || debugData.featuredImageUrl || 'None'}</p>
                        <p><strong>Constructed URL:</strong> {debugData.constructedUrl}</p>
                        <p><strong>Uploads Base URL:</strong> {UPLOADS_BASE_URL}</p>
                        <button 
                          className="btn btn-sm btn-primary mt-2"
                          onClick={() => window.open(debugData.constructedUrl, '_blank')}
                        >
                          Open Image in New Tab
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6>Image Test:</h6>
                    {debugData.constructedUrl ? (
                      <div className="border rounded p-3">
                        <img 
                          src={debugData.constructedUrl}
                          alt="debug preview"
                          style={{ maxWidth: '100%', maxHeight: '300px' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `
                              <div class="alert alert-danger">
                                <h6>Image Failed to Load</h6>
                                <p>URL: ${debugData.constructedUrl}</p>
                                <p>Possible issues:</p>
                                <ol>
                                  <li>File doesn't exist at that path</li>
                                  <li>CORS issue (check server headers)</li>
                                  <li>Wrong port (trying port 80 instead of 3001)</li>
                                </ol>
                                <button class="btn btn-sm btn-warning" onclick="fetch('${debugData.constructedUrl}').then(r => console.log(r)).catch(e => console.error(e))">
                                  Test Fetch
                                </button>
                              </div>
                            `;
                          }}
                          crossOrigin="anonymous"
                        />
                        <div className="mt-2">
                          <small className="text-muted">
                            Testing URL: {debugData.constructedUrl}
                          </small>
                        </div>
                      </div>
                    ) : (
                      <p className="text-danger">No image data found in this blog</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {imagePreviewMode && previewImage && (
        <div 
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
          onClick={closeImagePreview}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 bg-transparent">
              <div className="modal-header border-0">
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={closeImagePreview}
                ></button>
              </div>
              <div className="modal-body text-center">
                <img
                  src={previewImage.url}
                  alt={previewImage.alt}
                  className="img-fluid rounded shadow"
                  style={{ maxHeight: '70vh' }}
                  crossOrigin="anonymous"
                />
                <p className="text-white mt-3">{previewImage.alt}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="h4 fw-bold mb-0">
                <i className="bi bi-images me-2"></i>Blog Management
              </h2>
              <p className="text-muted mb-0">
                Manage blog posts • {blogs.length} total • {blogsWithImages} with images
                <br />
                <small className="text-info">
                  Uploads URL: {UPLOADS_BASE_URL}
                </small>
              </p>
            </div>
            
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              >
                <i className={`bi bi-${viewMode === 'list' ? 'grid-3x3-gap' : 'list-ul'} me-2`}></i>
                {viewMode === 'list' ? 'Grid View' : 'List View'}
              </button>
              <button
                className="btn btn-outline-info"
                onClick={() => {
                  console.log('Current blogs:', blogs);
                  console.log('Environment:', {
                    apiUrl: API_BASE_URL,
                    uploadsUrl: UPLOADS_BASE_URL,
                    nodeEnv: process.env.NODE_ENV
                  });
                  alert('Check console for complete debug info');
                }}
                title="Debug Data"
              >
                <i className="bi bi-bug"></i>
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCreateBlog}
              >
                <i className="bi bi-plus-lg me-2"></i>Create New Post
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Posts</h6>
                  <h3 className="fw-bold mb-0">{blogs.length}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <i className="bi bi-journal-text text-primary fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">With Images</h6>
                  <h3 className="fw-bold mb-0">{blogsWithImages}</h3>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded">
                  <i className="bi bi-image text-info fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Featured</h6>
                  <h3 className="fw-bold mb-0">{getFeaturedBlogsCount()}</h3>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded">
                  <i className="bi bi-star-fill text-warning fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Published</h6>
                  <h3 className="fw-bold mb-0">{getPublishedBlogsCount()}</h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <i className="bi bi-check-circle text-success fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Error Alert */}
      {error && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
              <button 
                type="button" 
                className="btn-close" 
                onClick={clearError}
              ></button>
            </div>
          </div>
        </div>
      )}
      
      {/* Toolbar */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="row g-3 align-items-center">
                <div className="col-md-4">
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search blogs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => setSearchTerm('')}
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="col-md-5">
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setActiveTab('all')}
                    >
                      All ({blogs.length})
                    </button>
                    <button
                      className={`btn btn-sm ${activeTab === 'published' ? 'btn-success' : 'btn-outline-success'}`}
                      onClick={() => setActiveTab('published')}
                    >
                      Published ({getPublishedBlogsCount()})
                    </button>
                    <button
                      className={`btn btn-sm ${activeTab === 'draft' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                      onClick={() => setActiveTab('draft')}
                    >
                      Drafts ({getDraftBlogsCount()})
                    </button>
                    <button
                      className={`btn btn-sm ${activeTab === 'featured' ? 'btn-warning' : 'btn-outline-warning'}`}
                      onClick={() => setActiveTab('featured')}
                    >
                      Featured ({getFeaturedBlogsCount()})
                    </button>
                    <button
                      className={`btn btn-sm ${activeTab === 'archived' ? 'btn-warning' : 'btn-outline-warning'}`}
                      onClick={() => setActiveTab('archived')}
                    >
                      Archived ({getArchivedBlogsCount()})
                    </button>
                  </div>
                </div>
                
                <div className="col-md-3">
                  <div className="d-flex gap-2">
                    <select
                      className="form-select form-select-sm"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="publishedAt">Sort by Date</option>
                      <option value="title">Sort by Title</option>
                      <option value="views">Sort by Views</option>
                      <option value="likes">Sort by Likes</option>
                    </select>
                    
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setSortOrder(sortOrder === 'DESC' ? 'ASC' : 'DESC')}
                    >
                      <i className={`bi bi-sort-${sortOrder === 'DESC' ? 'down' : 'up'}`}></i>
                    </button>
                  </div>
                </div>
              </div>
              
              {bulkSelection.length > 0 && (
                <div className="row mt-3">
                  <div className="col-12">
                    <div className="alert alert-info py-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <span>
                          <i className="bi bi-check-circle me-2"></i>
                          {bulkSelection.length} posts selected
                        </span>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleBulkAction('delete')}
                          >
                            <i className="bi bi-trash me-1"></i>Delete
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => setBulkSelection([])}
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="row mb-4">
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading blog posts...</p>
          </div>
        </div>
      )}
      
      {/* Blog List/Grid */}
      {!loading && (
        <div className="row">
          <div className="col-12">
            {paginatedBlogs.length === 0 ? (
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center py-5">
                  <i className="bi bi-journal-x display-1 text-muted mb-3"></i>
                  <h4 className="text-muted">No blog posts found</h4>
                  <p className="text-muted">
                    {searchTerm 
                      ? `No results for "${searchTerm}"` 
                      : activeTab === 'all' 
                        ? 'Create your first blog post!' 
                        : `No ${activeTab} blog posts`}
                  </p>
                  {!searchTerm && (
                    <button
                      className="btn btn-primary mt-2"
                      onClick={handleCreateBlog}
                    >
                      <i className="bi bi-plus-lg me-2"></i>Create Blog Post
                    </button>
                  )}
                </div>
              </div>
            ) : viewMode === 'list' ? (
              <div className="card border-0 shadow-sm">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: '50px' }}>
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={bulkSelection.length === paginatedBlogs.length}
                              onChange={toggleSelectAll}
                            />
                          </div>
                        </th>
                        <th style={{ width: '120px' }}>Image</th>
                        <th>Title & Details</th>
                        <th style={{ width: '100px' }}>Status</th>
                        <th style={{ width: '180px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedBlogs.map(blog => {
                        const imagePath = blog.featuredImage || blog.featuredImageUrl;
                        const imageUrl = constructImageUrl(imagePath);
                        
                        return (
                          <tr key={blog.blogId}>
                            <td>
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={bulkSelection.includes(blog.blogId)}
                                  onChange={() => toggleBulkSelection(blog.blogId)}
                                />
                              </div>
                            </td>
                            <td>
                              <BlogImage 
                                blog={blog} 
                                size="md"
                                className="border"
                              />
                            </td>
                            <td>
                              <div>
                                <div className="fw-medium mb-1">{blog.title}</div>
                                <div className="text-muted small mb-1">
                                  {blog.excerpt?.substring(0, 80) || 'No excerpt'}...
                                </div>
                                <div className="small text-info">
                                  Image: {imageUrl ? (
                                    <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                      <i className="bi bi-link me-1"></i>View
                                    </a>
                                  ) : 'None'}
                                </div>
                              </div>
                            </td>
                            <td>
                              {getStatusBadge(blog.status)}
                              {getFeaturedBadge(blog.isFeatured)}
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button
                                  className="btn btn-outline-info"
                                  onClick={() => handleViewBlog(blog)}
                                  title="Preview"
                                >
                                  <i className="bi bi-eye"></i>
                                </button>
                                <button
                                  className="btn btn-outline-primary"
                                  onClick={() => handleEditBlog(blog)}
                                  title="Edit"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-outline-warning"
                                  onClick={() => debugBlog(blog)}
                                  title="Debug"
                                >
                                  <i className="bi bi-bug"></i>
                                </button>
                                <button
                                  className="btn btn-outline-danger"
                                  onClick={() => handleDeleteBlog(blog.blogId)}
                                  title="Delete"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="row g-4">
                {paginatedBlogs.map(blog => {
                  const imagePath = blog.featuredImage || blog.featuredImageUrl;
                  const imageUrl = constructImageUrl(imagePath);
                  
                  return (
                    <div key={blog.blogId} className="col-md-6 col-lg-4">
                      <div className="card h-100 border-0 shadow-sm hover-shadow">
                        <div className="position-relative">
                          <BlogImage 
                            blog={blog} 
                            size="lg"
                            className="rounded-top"
                          />
                          <div className="position-absolute top-0 end-0 m-2">
                            <div className="form-check">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={bulkSelection.includes(blog.blogId)}
                                onChange={() => toggleBulkSelection(blog.blogId)}
                              />
                            </div>
                          </div>
                          <div className="position-absolute top-0 start-0 m-2">
                            {getStatusBadge(blog.status)}
                            {getFeaturedBadge(blog.isFeatured)}
                          </div>
                        </div>
                        
                        <div className="card-body">
                          <h5 className="card-title mb-2">{blog.title}</h5>
                          
                          {blog.excerpt && (
                            <p className="card-text text-muted small mb-3">
                              {blog.excerpt.substring(0, 80)}...
                            </p>
                          )}
                          
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="small">
                              <i className="bi bi-person me-1"></i>
                              {blog.authorName || 'Unknown'}
                            </div>
                            <div className="small">
                              <i className="bi bi-calendar me-1"></i>
                              {getPublishedAtFormatted(blog)}
                            </div>
                          </div>
                          
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="text-muted small">
                              <i className="bi bi-eye me-1"></i>{blog.views || 0}
                            </div>
                            
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-info"
                                onClick={() => imageUrl && openImagePreview(imageUrl, blog.title)}
                                title="View Image"
                                disabled={!imageUrl}
                              >
                                <i className="bi bi-zoom-in"></i>
                              </button>
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => handleEditBlog(blog)}
                                title="Edit"
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDeleteBlog(blog.blogId)}
                                title="Delete"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="row mt-4">
                <div className="col-12">
                  <nav>
                    <ul className="pagination justify-content-center">
                      <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setPage(page - 1)}>
                          <i className="bi bi-chevron-left"></i>
                        </button>
                      </li>
                      
                      {[...Array(totalPages)].map((_, i) => (
                        <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => setPage(i + 1)}>
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      
                      <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setPage(page + 1)}>
                          <i className="bi bi-chevron-right"></i>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;


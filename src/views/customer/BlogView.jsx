import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useBlogStore from '../../stores/shared/blogStore';
import back from '../../assets/breadboard.jpg'

const BlogView = () => {
  const { 
    blogs, 
    loading, 
    error, 
    fetchBlogs 
  } = useBlogStore();
  
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredImage, setHoveredImage] = useState(null);

  // Get base URL for images
  const UPLOADS_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.logiphix.tech';

  // Construct image URL
  const constructImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/uploads')) {
      return `${UPLOADS_BASE_URL}${imagePath}`;
    }
    
    if (imagePath.includes('blog-')) {
      return `${UPLOADS_BASE_URL}/uploads/blogs/${imagePath}`;
    }
    
    return `${UPLOADS_BASE_URL}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
  };

  // Load blogs on component mount
  useEffect(() => {
    const loadBlogs = async () => {
      const options = {
        status: 'published',
        sortBy: 'publishedAt',
        sortOrder: 'DESC',
        includeImages: true
      };
      await fetchBlogs(options);
    };
    
    loadBlogs();
  }, []);

  // Process blogs when loaded
  useEffect(() => {
    if (blogs.length > 0) {
      const featured = blogs.find(blog => 
        blog.status === 'published' && 
        (blog.featuredImage || blog.featuredImageUrl)
      ) || blogs[0];
      setFeaturedBlog(featured);
      
      const recent = blogs
        .filter(blog => 
          blog.status === 'published' && 
          blog.blogId !== featured?.blogId
        )
        .slice(0, 8);
      setRecentBlogs(recent);
    }
  }, [blogs]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    }).replace(',', '');
  };

  // Categories
  const categories = [
    { id: 'all', name: 'All', count: blogs.filter(b => b.status === 'published').length },
    { id: 'business', name: 'Business', count: 12 },
    { id: 'technology', name: 'Technology', count: 8 },
    { id: 'design', name: 'Design', count: 15 },
    { id: 'marketing', name: 'Marketing', count: 7 }
  ];

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-secondary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-view">
      {/* Header with Glass Morphism */}
      <header 
  className="position-relative overflow-hidden py-5"
  style={{
    backgroundImage: `url(${back})`, 
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }}
>
  {/* Semi-transparent overlay */}
  <div 
    className="position-absolute top-0 start-0 w-100 h-100"
    style={{
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1
    }}
  />
  
  {/* Glass morphism overlay */}
  <div 
    className="position-absolute top-0 start-0 w-100 h-100"
    style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(5px) saturate(180%)',
      WebkitBackdropFilter: 'blur(5px) saturate(180%)',
      zIndex: 2
    }}
  />
  
  {/* Content */}
  <div className="container position-relative" style={{ zIndex: 3 }}>
    <div className="row align-items-center">
      <div className="col-lg-6">
        <h1 className="display-4 fw-bold text-success mb-3">
          Our <span className="text-warning">Blog</span>
        </h1>
        <p className="lead text-white mb-0">
          Stay updated with the latest news, insights, and industry trends
        </p>
      </div>
      <div className="col-lg-6 mt-3 mt-lg-0">
        <form onSubmit={handleSearch}>
          <div className="input-group input-group-lg shadow-lg">
            <input
              type="text"
              className="form-control border-0"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRight: 'none',
                height: '55px'
              }}
            />
            <button 
              className="btn btn-primary border-0" 
              type="submit"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderLeft: 'none',
                color: 'white',
                padding: '0 25px',
                height: '55px'
              }}
            >
              <i className="bi bi-search fs-5"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <style jsx>{`
    /* Placeholder styling for search input */
    input::placeholder {
      color: rgba(255, 255, 255, 0.7) !important;
    }
    
    /* Remove default focus outline and add custom style */
    input:focus {
      outline: none !important;
      box-shadow: none !important;
      background: rgba(255, 255, 255, 0.25) !important;
    }
    
    button:focus {
      outline: none !important;
      box-shadow: none !important;
    }
    
    /* Hover effect on search button */
    button:hover {
      background: rgba(255, 255, 255, 0.25) !important;
      transition: all 0.3s ease;
    }
  `}</style>
</header>
      {/* <header className="py-5" style={{
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-5 fw-bold text-white mb-3">Our Blog</h1>
              <p className="lead text-white-50 mb-0" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                Stay updated with the latest news, insights, and industry trends
              </p>
            </div>
            <div className="col-lg-6 mt-3 mt-lg-0">
              <form onSubmit={handleSearch}>
                <div className="input-group input-group-lg shadow-lg" style={{
                  borderRadius: '0'
                }}>
                  <input
                    type="text"
                    className="form-control border-0"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      color: 'white',
                      borderRadius: '0'
                    }}
                  />
                  <button className="btn btn-primary border-0" type="submit" style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0'
                  }}>
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </header> */}

      <div className="container py-5">
        <div className="row">
          {/* Main Content */}
          <div className="col-lg-8">
            {/* Featured Blog Post */}
            {featuredBlog && (
              <div className="featured-post mb-5">
                <div className="position-relative overflow-hidden mb-4" 
                     style={{ height: '400px', borderRadius: '0' }}
                     onMouseEnter={() => setHoveredImage(`featured-${featuredBlog.blogId}`)}
                     onMouseLeave={() => setHoveredImage(null)}>
                  <div className="w-100 h-100">
                    {featuredBlog.featuredImage || featuredBlog.featuredImageUrl ? (
                      <img
                        src={constructImageUrl(featuredBlog.featuredImage || featuredBlog.featuredImageUrl)}
                        alt={featuredBlog.title}
                        className={`w-100 h-100 object-fit-cover ${hoveredImage === `featured-${featuredBlog.blogId}` ? 'scale-110' : ''}`}
                        style={{ 
                          transition: 'transform 0.5s ease',
                          transform: hoveredImage === `featured-${featuredBlog.blogId}` ? 'scale(1.1)' : 'scale(1)',
                          borderRadius: '0'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const parent = e.target.parentElement;
                          parent.innerHTML = `
                            <div class="bg-light w-100 h-100 d-flex align-items-center justify-content-center" style="border-radius: 0">
                              <div class="text-center text-muted">
                                <i class="bi bi-newspaper display-4"></i>
                                <p class="mt-2 fw-medium">Featured Post</p>
                              </div>
                            </div>
                          `;
                        }}
                      />
                    ) : (
                      <div className="bg-light w-100 h-100 d-flex align-items-center justify-content-center" style={{ borderRadius: '0' }}>
                        <div className="text-center text-muted">
                          <i className="bi bi-newspaper display-4"></i>
                          <p className="mt-2 fw-medium">Featured Post</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="position-absolute top-0 start-0 m-3">
                    <span className="badge bg-success fs-6 py-2 px-3" style={{ 
                      background: 'rgba(0, 123, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '0',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      Featured
                    </span>
                  </div>
                </div>

                <div className="featured-content p-4" style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '0',
                  border: '1px solid rgba(0, 0, 0, 0.1)'
                }}>
                  <div className="d-flex flex-wrap align-items-center mb-3 text-muted">
                    <span className="me-4 d-flex align-items-center">
                      <i className="bi bi-calendar me-2"></i>
                      {formatDate(featuredBlog.publishedAt)}
                    </span>
                    <span className="me-4 d-flex align-items-center">
                      <i className="bi bi-person me-2"></i>
                      {featuredBlog.authorName || 'Admin'}
                    </span>
                    <span className="d-flex align-items-center">
                      <i className="bi bi-chat me-2"></i>
                      Comments: {featuredBlog.commentCount || 7}
                    </span>
                  </div>

                  <h2 className="mb-3 fw-bold text-dark">
                    <Link to={`/blog/${featuredBlog.slug || featuredBlog.blogId}`} className="text-decoration-none text-dark hover-text-primary">
                      {featuredBlog.title}
                    </Link>
                  </h2>

                  <p className="mb-4 fs-5 text-secondary" style={{ lineHeight: '1.6' }}>
                    {featuredBlog.excerpt || "Objectively innovate empowered manufactured products whereas parallel platforms. Holistically predominate extensible testing procedures for reliable supply chains."}
                  </p>

                  <Link 
                    to={`/blog/${featuredBlog.slug || featuredBlog.blogId}`}
                    className="btn btn-outline-success px-4 py-2"
                    style={{ borderRadius: '0' }}
                  >
                    Read More <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                </div>
              </div>
            )}

            {/* Recent Posts Grid */}
            <div className="recent-posts">
              <h3 className="mb-4 pb-2 fw-bold text-dark border-bottom border-success border-3 d-inline-block">Recent Articles</h3>
              
              <div className="row g-4 mt-2">
                {recentBlogs.map((blog) => {
                  const imageUrl = constructImageUrl(blog.featuredImage || blog.featuredImageUrl);
                  
                  return (
                    <div key={blog.blogId} className="col-md-6">
                      <div className="h-100" style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '0',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                      }}>
                        <div 
                          className="position-relative overflow-hidden"
                          style={{ height: '200px', borderRadius: '0' }}
                          onMouseEnter={() => setHoveredImage(`blog-${blog.blogId}`)}
                          onMouseLeave={() => setHoveredImage(null)}
                        >
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={blog.title}
                              className={`w-100 h-100 object-fit-cover ${hoveredImage === `blog-${blog.blogId}` ? 'scale-110' : ''}`}
                              style={{ 
                                transition: 'transform 0.5s ease',
                                transform: hoveredImage === `blog-${blog.blogId}` ? 'scale(1.1)' : 'scale(1)',
                                borderRadius: '0'
                              }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                const parent = e.target.parentElement;
                                parent.innerHTML = `
                                  <div class="bg-light w-100 h-100 d-flex align-items-center justify-content-center" style="border-radius: 0">
                                    <div class="text-center text-muted">
                                      <i class="bi bi-image fs-1"></i>
                                      <p class="mt-2">No Image</p>
                                    </div>
                                  </div>
                                `;
                              }}
                            />
                          ) : (
                            <div className="bg-light w-100 h-100 d-flex align-items-center justify-content-center" style={{ borderRadius: '0' }}>
                              <div className="text-center text-muted">
                                <i className="bi bi-image fs-1"></i>
                                <p className="mt-2">No Image</p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-3 p-md-4">
                          <div className="d-flex align-items-center mb-2 text-muted small">
                            <span className="me-3 d-flex align-items-center">
                              <i className="bi bi-calendar me-1"></i>
                              {formatDate(blog.publishedAt)}
                            </span>
                            <span className="d-flex align-items-center">
                              <i className="bi bi-person me-1"></i>
                              {blog.authorName || 'Admin'}
                            </span>
                          </div>
                          
                          <h5 className="mb-3 fw-semibold text-dark">
                            <Link 
                              to={`/blog/${blog.slug || blog.blogId}`}
                              className="text-decoration-none text-dark hover-text-primary"
                            >
                              {blog.title}
                            </Link>
                          </h5>
                          
                          <p className="text-muted small mb-3" style={{ lineHeight: '1.5' }}>
                            {blog.excerpt?.substring(0, 120) || "Cross-media growth strategies. Seamlessly visualize quality intellectual."}...
                          </p>
                          
                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <Link 
                              to={`/blog/${blog.id || blog.blogId}`}
                              className="text-decoration-none text-success fw-medium hover-underline"
                              style={{ fontSize: '0.9rem' }}
                            >
                              Read More <i className="bi bi-arrow-right ms-1"></i>
                            </Link>
                            
                            <span className="text-muted small d-flex align-items-center">
                              <i className="bi bi-chat me-1"></i>
                              {blog.commentCount || 7}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pagination */}
            {recentBlogs.length > 0 && (
              <nav className="mt-5">
                <ul className="pagination justify-content-center">
                  <li className="page-item disabled">
                    <span className="page-link border-0" style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '0',
                      border: '1px solid rgba(0, 0, 0, 0.1)'
                    }}>
                      <i className="bi bi-chevron-left"></i>
                    </span>
                  </li>
                  <li className="page-item active">
                    <span className="page-link border-0" style={{
                      background: 'rgba(0, 123, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '0',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      1
                    </span>
                  </li>
                  <li className="page-item">
                    <a className="page-link border-0" href="#" style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '0',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s'
                    }}>2</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link border-0" href="#" style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '0',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s'
                    }}>3</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link border-0" href="#" style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '0',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s'
                    }}>
                      <i className="bi bi-chevron-right"></i>
                    </a>
                  </li>
                </ul>
              </nav>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="blog-sidebar">
              {/* Categories */}
              <div className="mb-4" style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '0',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                padding: '1.5rem'
              }}>
                <h4 className="mb-3 fw-semibold text-dark border-bottom pb-2">Categories</h4>
                <ul className="list-unstyled mb-0">
                  {categories.map((category) => (
                    <li key={category.id} className="mb-2">
                      <button
                        className={`btn btn-link text-decoration-none text-dark p-0 d-flex justify-content-between align-items-center w-100 ${selectedCategory === category.id ? 'text-success fw-bold' : ''}`}
                        onClick={() => setSelectedCategory(category.id)}
                        style={{ fontSize: '0.95rem' }}
                      >
                        <span>{category.name}</span>
                        <span className="badge" style={{
                          background: 'rgba(0, 0, 0, 0.1)',
                          backdropFilter: 'blur(5px)',
                          borderRadius: '0'
                        }}>
                          {category.count}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popular Posts */}
              <div className="mb-4" style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '0',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                padding: '1.5rem'
              }}>
                <h4 className="mb-3 fw-semibold text-dark border-bottom pb-2">Popular Posts</h4>
                <div className="popular-posts">
                  {blogs.slice(0, 3).map((blog) => (
                    <div key={blog.blogId} className="d-flex align-items-start mb-3 pb-2 border-bottom" style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}>
                      <div className="shrink-0 me-3">
                        <div className="overflow-hidden" style={{ width: '60px', height: '60px', borderRadius: '0' }}>
                          {blog.featuredImage || blog.featuredImageUrl ? (
                            <img
                              src={constructImageUrl(blog.featuredImage || blog.featuredImageUrl)}
                              alt={blog.title}
                              className="w-100 h-100 object-fit-cover"
                              style={{ borderRadius: '0' }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = `
                                  <div class="bg-light w-100 h-100 d-flex align-items-center justify-content-center" style="border-radius: 0">
                                    <i class="bi bi-journal-text text-muted"></i>
                                  </div>
                                `;
                              }}
                            />
                          ) : (
                            <div className="bg-light w-100 h-100 d-flex align-items-center justify-content-center" style={{ borderRadius: '0' }}>
                              <i className="bi bi-journal-text text-muted"></i>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="grow">
                        <h6 className="mb-1 fw-medium">
                          <Link 
                            to={`/blog/${blog.slug || blog.blogId}`}
                            className="text-decoration-none text-dark hover-text-primary"
                            style={{ fontSize: '0.9rem' }}
                          >
                            {blog.title.length > 40 ? blog.title.substring(0, 40) + '...' : blog.title}
                          </Link>
                        </h6>
                        <div className="text-muted small">
                          {formatDate(blog.publishedAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="mb-4" style={{
                background: 'linear-gradient(135deg, rgba(253, 251, 251, 0.9) 0%, rgba(235, 237, 238, 0.9) 100%)',
                backdropFilter: 'blur(10px)',
                borderRadius: '0',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                padding: '1.5rem'
              }}>
                <h4 className="mb-3 fw-semibold text-dark">Subscribe</h4>
                <p className="text-muted small mb-3">
                  Get the latest posts delivered right to your inbox.
                </p>
                <form className="newsletter-form">
                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Your email address"
                      style={{
                        borderRadius: '0',
                        border: '1px solid rgba(0, 0, 0, 0.2)',
                        background: 'rgba(255, 255, 255, 0.7)'
                      }}
                    />
                  </div>
                  <button type="submit" className="btn btn-success w-100 py-2" style={{ borderRadius: '0' }}>
                    Subscribe
                  </button>
                </form>
              </div>

              {/* Tags */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '0',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                padding: '1.5rem'
              }}>
                <h4 className="mb-3 fw-semibold text-dark border-bottom pb-2">Tags</h4>
                <div className="d-flex flex-wrap gap-2">
                  {['Business', 'Technology', 'Design', 'Marketing', 'Development', 'Startup', 'Innovation', 'Strategy'].map((tag) => (
                    <a 
                      key={tag} 
                      href="#" 
                      className="text-decoration-none text-dark px-3 py-1 small"
                      style={{
                        background: 'rgba(0, 0, 0, 0.05)',
                        backdropFilter: 'blur(5px)',
                        borderRadius: '0',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s'
                      }}
                    >
                      {tag}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add some global styles for hover effects */}
      <style>{`
        .blog-view {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
        }
        
        .hover-shadow-lg:hover {
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
          transform: translateY(-5px);
          border-color: rgba(0, 123, 255, 0.3) !important;
        }
        
        .hover-text-primary:hover {
          color: #007bff !important;
        }
        
        .hover-underline:hover {
          text-decoration: underline !important;
        }
        
        .hover-bg-primary:hover {
          background-color: rgba(0, 123, 255, 0.8) !important;
          color: white !important;
          backdrop-filter: blur(10px);
        }
        
        .hover-text-white:hover {
          color: white !important;
        }
        
        .scale-110 {
          transform: scale(1.1);
        }
        
        .transition-all {
          transition: all 0.3s ease;
        }
        
        .object-fit-cover {
          object-fit: cover;
        }
        
        .border-gray {
          border-color: #dee2e6 !important;
        }
        
        /* Glass morphism effects */
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 0;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .glass-effect-dark {
          background: rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 0;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .glass-effect-primary {
          background: rgba(0, 123, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 0;
          border: 1px solid rgba(0, 123, 255, 0.2);
        }
        
        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(0, 123, 255, 0.3);
          border-radius: 0;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 123, 255, 0.5);
        }
        
        /* Selection color */
        ::selection {
          background-color: rgba(0, 123, 255, 0.3);
          color: white;
        }
        
        /* Smooth transitions for all interactive elements */
        a, button, input, .btn {
          transition: all 0.3s ease;
        }
        
        /* Focus states */
        a:focus, button:focus, input:focus {
          outline: 2px solid rgba(0, 123, 255, 0.5);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default BlogView;



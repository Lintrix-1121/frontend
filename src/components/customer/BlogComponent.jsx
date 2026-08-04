import React, { useState, useEffect } from 'react';
import useBlogStore from '../../stores/shared/blogStore';
import { useNavigate } from 'react-router-dom';

const HomeBlogComponent = () => {
  const { 
    blogs, 
    loading, 
    error, 
    fetchBlogs 
  } = useBlogStore();

  const navigate = useNavigate();

  const [recentBlogs, setRecentBlogs] = useState([]);

  // Get base URL for images
  const UPLOADS_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.logiphix.tech';

  // Construct image URL function
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
        limit: 2, // Changed to only fetch 2 most recent blogs
        includeImages: true
      };
      await fetchBlogs(options);
    };
    
    loadBlogs();
  }, []);

  // Process blogs when loaded
  useEffect(() => {
    if (blogs.length > 0) {
      const recent = blogs
        .filter(blog => blog.status === 'published')
        .slice(0, 2); // Only get the 2 most recent blogs
      setRecentBlogs(recent);
    }
  }, [blogs]);

  // Format date to match "18 Jan 2019" format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  if (loading) {
    return (
      <div className="container py-5 bg-white">
        <div className="text-center">
          <div className="spinner-border text-dark" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-5 bg-white">
      <div className='container'>
        {/* Header */}
        <div className="mb-5">
          <h2 className="text-uppercase text-success fw-bold fs-1 mb-2">Latest Insights & Updates</h2>
          <h3 className="text-text-muted fw-normal fs-4 mb-3">News & Press Release</h3>
          <hr className="border-2 border-dark opacity-100" style={{ width: '50px' }} />
        </div>

        {/* Two Most Recent Blogs Side by Side */}
        <div className="row g-4 mb-5">
          {recentBlogs.map((blog) => {
            const imageUrl = blog.featuredImage || blog.featuredImageUrl 
              ? constructImageUrl(blog.featuredImage || blog.featuredImageUrl) 
              : null;
            
            return (
              <div key={blog.blogId} className="col-lg-6">
                <div className="position-relative overflow-hidden h-100" style={{ minHeight: '350px' }}>
                  {/* Background Image */}
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={blog.title}
                      className="img-fluid w-100 h-100 object-fit-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                          <div class="bg-secondary bg-gradient w-100 h-100 d-flex align-items-center justify-content-center">
                            <div class="text-white text-center">
                              <i class="bi bi-newspaper fs-1"></i>
                              <p class="mt-2 small">No Image Available</p>
                            </div>
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="bg-secondary bg-gradient w-100 h-100 d-flex align-items-center justify-content-center">
                      <div className="text-white text-center">
                        <i className="bi bi-newspaper fs-1"></i>
                        <p className="mt-2 small">No Image Available</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Dark Overlay */}
                  <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: 0.4 }}></div>
                  
                  {/* Content Overlay */}
                  <div className="position-absolute bottom-0 start-0 w-100 p-4 text-white">
                    <div className="mb-3">
                      <span className="bg-primary px-3 py-1 fw-medium" style={{ fontSize: '0.9rem' }}>
                        {formatDate(blog.publishedAt)}
                      </span>
                    </div>
                    <h4 className="fw-bold mb-3" style={{ fontSize: '1.5rem', lineHeight: '1.3' }}>
                      {blog.title}
                    </h4>
                    {blog.excerpt && (
                      <p className="mb-3 opacity-75" style={{ fontSize: '0.95rem' }}>
                        {blog.excerpt.length > 150 ? `${blog.excerpt.substring(0, 150)}...` : blog.excerpt}
                      </p>
                    )}
                    <a 
                      href={`/blog/${blog.slug || blog.blogId}`}
                      className="text-white text-decoration-none fw-medium d-inline-flex align-items-center"
                      style={{ fontSize: '1rem' }}
                    >
                      Read More
                      <span className="ms-2" style={{ fontSize: '1.2rem' }}>→</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Newsletter Section - Now positioned below the blogs */}
        <div className="row">
          <div className="col-12">
            <div className="p-4 border" style={{ backgroundColor: 'white', maxWidth: '600px', margin: '0 auto' }}>
              <h3 className="text-uppercase text-success fw-bold fs-5 mb-3">Subscribe Newsletter</h3>
              <p className="text-muted mb-4" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                Subscribe to our newsletter and stay updated on ICT Infrastructure, Sotware Development, Embedded Systems, IoT and 
                the technologies shaping tomorrow.
              </p>
              <div className="mb-3">
                <input 
                  type="email" 
                  className="form-control form-control-lg mb-3"
                  placeholder="Enter your email address"
                  style={{ 
                    border: '1px solid #ddd',
                    boxShadow: 'none'
                  }}
                />
                <button 
                  className="btn btn-dark w-100 py-2 text-uppercase fw-bold"
                  style={{ fontSize: '0.9rem' }}
                >
                  Subscribe
                </button>
              </div>
                  <div className="mt-4 pt-2 text-center">
                    <button 
                      onClick = {() =>navigate('/blog/all') }
                      className="text-dark text-decoration-none fw-medium px-4 py-2 border border-dark d-inline-block bg-transparent"
                      style={{ 
                        fontSize: '0.9rem',
                        transition: 'all 0.2s ease-in-out',
                        cursor: 'pointer',
                        border: '1px solid #212529'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      ← View All Blog Posts
                    </button>
                  </div>
              {/* <div className="mt-4 pt-2 text-center">
                <a 
                  href="/blog/all" 
                  className="text-dark text-decoration-none fw-medium px-4 py-2 border border-dark d-inline-block"
                  style={{ fontSize: '0.9rem' }}
                >
                  View All Blog Posts
                </a>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Inline Styles */}
      <style>{`
        .bg-white {
          background-color: white !important;
        }
        
        .blog-posts h4, .blog-posts h5 {
          color: #fff;
        }
        
        .blog-posts .col-8 h5 {
          color: #333;
        }
        
        .blog-posts a:hover {
          color: #007bff !important;
        }
        
        hr {
          border-color: #dee2e6;
          opacity: 0.5;
        }
        
        .fs-7 {
          font-size: 0.875rem;
        }
        
        .object-fit-cover {
          object-fit: cover;
        }
        
        .bg-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .text-primary {
          color: #0d6efd !important;
        }
      `}</style>
    </div>
  );
};

export default HomeBlogComponent;





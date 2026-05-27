import React from 'react';
import { Link } from 'react-router-dom';

const BlogList = ({ blogs, showAuthor = true, showExcerpt = true, showStats = true }) => {
  if (!blogs || blogs.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-journal-x display-1 text-muted mb-3"></i>
        <h4 className="text-muted">No blog posts available</h4>
        <p className="text-muted">Check back later for new content</p>
      </div>
    );
  }

  return (
    <div className="row g-4">
      {blogs.map(blog => (
        <div key={blog.blogId} className="col-lg-6">
          <div className="card border-0 shadow-sm h-100 hover-shadow transition-all">
            <div className="row g-0 h-100">
              {/* Featured Image */}
              <div className="col-md-5">
                {blog.featuredImageUrl ? (
                  <img
                    src={blog.featuredImageUrl}
                    alt={blog.title}
                    className="img-fluid h-100"
                    style={{ objectFit: 'cover', minHeight: '200px' }}
                  />
                ) : (
                  <div className="h-100 d-flex align-items-center justify-content-center bg-light">
                    <i className="bi bi-image text-muted display-4"></i>
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="col-md-7">
                <div className="card-body d-flex flex-column h-100">
                  {/* Status Badge */}
                  <div className="mb-2">
                    {blog.status === 'published' && blog.isFeatured && (
                      <span className="badge bg-warning text-dark me-1">
                        <i className="bi bi-star-fill me-1"></i>Featured
                      </span>
                    )}
                    <span className="badge bg-light text-dark">
                      {blog.getReadingTimeText()}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h5 className="card-title fw-bold">
                    <Link 
                      to={`/blog/${blog.slug || blog.blogId}`}
                      className="text-decoration-none text-dark hover-primary"
                    >
                      {blog.title}
                    </Link>
                  </h5>
                  
                  {/* Excerpt */}
                  {showExcerpt && blog.excerpt && (
                    <p className="card-text text-muted mb-3">
                      {blog.excerpt.substring(0, 120)}...
                    </p>
                  )}
                  
                  {/* Author & Date */}
                  {showAuthor && (
                    <div className="mt-auto">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          {blog.authorAvatar && (
                            <img
                              src={blog.authorAvatar}
                              alt={blog.authorName}
                              className="rounded-circle me-2"
                              style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                            />
                          )}
                          <div>
                            <div className="small fw-medium">{blog.authorName}</div>
                            <div className="text-muted small">
                              {blog.publishedAtRelative || blog.publishedAtFormatted}
                            </div>
                          </div>
                        </div>
                        
                        {/* Stats */}
                        {showStats && (
                          <div className="text-muted small">
                            <span className="me-3">
                              <i className="bi bi-eye me-1"></i>
                              {blog.views}
                            </span>
                            <span>
                              <i className="bi bi-heart me-1"></i>
                              {blog.likes}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
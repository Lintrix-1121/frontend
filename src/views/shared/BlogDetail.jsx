import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useBlogStore from '../../stores/shared/blogStore';
import BlogList from './BlogList';
import LoadingSpinner from '../../components/admin/LoadingSpinner';

const BlogDetail = () => {
  const { slugOrId } = useParams();
  const navigate = useNavigate();
  
  // Get store state and actions using selector pattern
  const currentBlog = useBlogStore(state => state.currentBlog);
  const loading = useBlogStore(state => state.loading);
  const error = useBlogStore(state => state.error);
  const fetchBlog = useBlogStore(state => state.fetchBlog);
  const incrementViews = useBlogStore(state => state.incrementViews);
  const likeBlog = useBlogStore(state => state.likeBlog);
  const shareBlog = useBlogStore(state => state.shareBlog);
  
  // Getter methods
  const getRecentBlogs = useBlogStore(state => state.getRecentBlogs);
  const getMostViewedBlogs = useBlogStore(state => state.getMostViewedBlogs);
  
  const [isLiking, setIsLiking] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  useEffect(() => {
    if (slugOrId) {
      console.log('Fetching blog with identifier:', slugOrId);
      fetchBlog(slugOrId);
      
      // Call incrementViews after a short delay to ensure blog is loaded
      const timer = setTimeout(() => {
        if (incrementViews) {
          incrementViews(slugOrId);
        } else {
          console.error('incrementViews is not a function!');
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [slugOrId]);

  // Helper functions
  const getReadingTimeText = (blog) => {
    if (!blog) return '0 min read';
    const minutes = blog.readingTime || Math.ceil((blog.content || '').split(/\s+/).length / 200);
    return `${minutes} min read`;
  };

  const getPublishedAtFormatted = (blog) => {
    if (!blog || !blog.publishedAt) return '';
    const date = new Date(blog.publishedAt);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPublishedAtRelative = (blog) => {
    if (!blog || !blog.publishedAt) return '';
    const now = new Date();
    const pubDate = new Date(blog.publishedAt);
    const diffMs = now - pubDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const handleLike = async () => {
    if (!currentBlog || isLiking) return;
    
    setIsLiking(true);
    try {
      await likeBlog(currentBlog.blogId);
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async (platform) => {
    if (!currentBlog || isSharing) return;
    
    setIsSharing(true);
    try {
      await shareBlog(currentBlog.blogId);
      
      const shareUrl = window.location.href;
      const title = encodeURIComponent(currentBlog.title);
      const text = encodeURIComponent(currentBlog.excerpt || currentBlog.title);
      
      let shareLink = '';
      
      switch (platform) {
        case 'facebook':
          shareLink = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
          break;
        case 'twitter':
          shareLink = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${title}`;
          break;
        case 'linkedin':
          shareLink = `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${title}`;
          break;
        case 'whatsapp':
          shareLink = `https://wa.me/?text=${title}%20${shareUrl}`;
          break;
        default:
          // Fallback to Web Share API
          if (navigator.share) {
            await navigator.share({
              title: currentBlog.title,
              text: currentBlog.excerpt,
              url: shareUrl
            });
          }
          break;
      }
      
      if (shareLink) {
        window.open(shareLink, '_blank', 'noopener,noreferrer');
      }
      
      setShowShareOptions(false);
    } finally {
      setIsSharing(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) 
    return <LoadingSpinner />;

  if (error || !currentBlog) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error || 'Blog post not found'}
            </div>
            <button className="btn btn-outline-primary" onClick={handleBack}>
              <i className="bi bi-arrow-left me-2"></i>Back to Blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Safely get recent and popular blogs with null checks
  const recentBlogs = getRecentBlogs 
    ? getRecentBlogs(3).filter(blog => blog && blog.blogId !== currentBlog.blogId) 
    : [];
  
  const popularBlogs = getMostViewedBlogs 
    ? getMostViewedBlogs(3).filter(blog => blog && blog.blogId !== currentBlog.blogId) 
    : [];

  // Get author info safely
  const authorAvatar = currentBlog.author?.profilePicture || currentBlog.authorAvatar;
  const authorName = currentBlog.author?.username || currentBlog.authorName || 'Admin';
  const authorBio = currentBlog.author?.bio;

  return (
    <div className="container py-5">
      <div className="row">
        {/* Back Button */}
        <div className="col-12 mb-4">
          <button className="btn btn-outline-secondary" onClick={handleBack}>
            <i className="bi bi-arrow-left me-2"></i>Back to Blog
          </button>
        </div>
        
        {/* Main Content */}
        <div className="col-lg-8">
          {/* Featured Image */}
          {currentBlog.featuredImageUrl && (
            <div className="mb-4">
              <img
                src={currentBlog.featuredImageUrl}
                alt={currentBlog.title}
                className="img-fluid rounded shadow"
                style={{ maxHeight: '500px', objectFit: 'cover', width: '100%' }}
              />
            </div>
          )}
          
          {/* Header */}
          <div className="mb-4">
            {/* Status & Featured Badges */}
            <div className="mb-3">
              {currentBlog.isFeatured && (
                <span className="badge bg-warning text-dark me-2">
                  <i className="bi bi-star-fill me-1"></i>Featured
                </span>
              )}
              <span className="badge bg-primary me-2">
                {getReadingTimeText(currentBlog)}
              </span>
              <span className="badge bg-secondary">
                {currentBlog.status === 'published' ? 'Published' : currentBlog.status}
              </span>
            </div>
            
            {/* Title */}
            <h1 className="display-5 fw-bold mb-3">{currentBlog.title}</h1>
            
            {/* Author & Date */}
            <div className="d-flex align-items-center mb-4">
              {authorAvatar && (
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="rounded-circle me-3"
                  style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                />
              )}
              <div>
                <div className="fw-medium">{authorName}</div>
                <div className="text-muted">
                  {getPublishedAtFormatted(currentBlog)} • {getPublishedAtRelative(currentBlog)}
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="d-flex gap-4 mb-4">
              <div className="d-flex align-items-center">
                <i className="bi bi-eye me-2 text-primary fs-5"></i>
                <div>
                  <div className="fw-bold fs-5">{currentBlog.views || 0}</div>
                  <div className="text-muted small">Views</div>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <i className="bi bi-heart me-2 text-danger fs-5"></i>
                <div>
                  <div className="fw-bold fs-5">{currentBlog.likes || 0}</div>
                  <div className="text-muted small">Likes</div>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <i className="bi bi-share me-2 text-success fs-5"></i>
                <div>
                  <div className="fw-bold fs-5">{currentBlog.shares || 0}</div>
                  <div className="text-muted small">Shares</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="mb-5">
            <div 
              className="blog-content fs-5 lh-base"
              dangerouslySetInnerHTML={{ __html: currentBlog.content }}
            />
          </div>
          
          {/* Action Buttons */}
          <div className="border-top border-bottom py-4 mb-5">
            <div className="d-flex justify-content-between align-items-center">
              <button
                className={`btn btn-${isLiking ? 'secondary' : 'outline-danger'} btn-lg`}
                onClick={handleLike}
                disabled={isLiking}
              >
                {isLiking ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Liking...
                  </>
                ) : (
                  <>
                    <i className="bi bi-heart me-2"></i>
                    Like ({currentBlog.likes || 0})
                  </>
                )}
              </button>
              
              <div className="position-relative">
                <button
                  className={`btn btn-${isSharing ? 'secondary' : 'outline-success'} btn-lg`}
                  onClick={() => setShowShareOptions(!showShareOptions)}
                  disabled={isSharing}
                >
                  {isSharing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Sharing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-share me-2"></i>
                      Share ({currentBlog.shares || 0})
                    </>
                  )}
                </button>
                
                {/* Share Options Dropdown */}
                {showShareOptions && (
                  <div className="position-absolute top-100 end-0 mt-2 bg-white border rounded shadow-lg p-3"
                       style={{ minWidth: '200px', zIndex: 1000 }}>
                    <div className="d-flex flex-column gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleShare('facebook')}
                      >
                        <i className="bi bi-facebook me-2"></i>Facebook
                      </button>
                      <button
                        className="btn btn-outline-info btn-sm"
                        onClick={() => handleShare('twitter')}
                      >
                        <i className="bi bi-twitter me-2"></i>Twitter
                      </button>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleShare('linkedin')}
                      >
                        <i className="bi bi-linkedin me-2"></i>LinkedIn
                      </button>
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => handleShare('whatsapp')}
                      >
                        <i className="bi bi-whatsapp me-2"></i>WhatsApp
                      </button>
                      {navigator.share && (
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => handleShare()}
                        >
                          <i className="bi bi-share me-2"></i>Other
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Author Bio */}
          {authorBio && (
            <div className="card border-0 bg-light mb-5">
              <div className="card-body">
                <h5 className="card-title mb-3">About the Author</h5>
                <div className="d-flex align-items-start">
                  {authorAvatar && (
                    <img
                      src={authorAvatar}
                      alt={authorName}
                      className="rounded-circle me-3"
                      style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                    />
                  )}
                  <div>
                    <h6 className="fw-bold">{authorName}</h6>
                    <p className="mb-0">{authorBio}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="col-lg-4">
          {/* Recent Posts */}
          {recentBlogs.length > 0 && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">
                  <i className="bi bi-clock-history me-2"></i>Recent Posts
                </h5>
              </div>
              <div className="card-body">
                <div className="list-group list-group-flush">
                  {recentBlogs.map(blog => (
                    <a
                      key={blog.blogId}
                      href={`/blog/${blog.slug || blog.blogId}`}
                      className="list-group-item list-group-item-action border-0 py-3"
                    >
                      <div className="d-flex align-items-start">
                        {blog.featuredImageUrl && (
                          <img
                            src={blog.featuredImageUrl}
                            alt={blog.title}
                            className="rounded me-3"
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          />
                        )}
                        <div>
                          <h6 className="fw-medium mb-1">{blog.title}</h6>
                          <div className="text-muted small">
                            {getPublishedAtRelative(blog)}
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Popular Posts */}
          {popularBlogs.length > 0 && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">
                  <i className="bi bi-fire me-2"></i>Popular Posts
                </h5>
              </div>
              <div className="card-body">
                <div className="list-group list-group-flush">
                  {popularBlogs.map(blog => (
                    <a
                      key={blog.blogId}
                      href={`/blog/${blog.slug || blog.blogId}`}
                      className="list-group-item list-group-item-action border-0 py-3"
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="fw-medium mb-1">{blog.title}</h6>
                          <div className="text-muted small">
                            <i className="bi bi-eye me-1"></i>{blog.views || 0} views
                          </div>
                        </div>
                        {blog.featuredImageUrl && (
                          <img
                            src={blog.featuredImageUrl}
                            alt={blog.title}
                            className="rounded ms-3"
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          />
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Blog Stats */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">
                <i className="bi bi-bar-chart me-2"></i>Blog Stats
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Reading Time</span>
                <span className="fw-medium">{getReadingTimeText(currentBlog)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Word Count</span>
                <span className="fw-medium">{currentBlog.content.split(/\s+/).length}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Published</span>
                <span className="fw-medium">{getPublishedAtFormatted(currentBlog)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Last Updated</span>
                <span className="fw-medium">
                  {new Date(currentBlog.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Posts */}
      <div className="row mt-5">
        <div className="col-12">
          <h3 className="mb-4">You Might Also Like</h3>
          <BlogList 
            blogs={[...recentBlogs, ...popularBlogs].slice(0, 4)} 
            showAuthor={false}
            showStats={false}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;


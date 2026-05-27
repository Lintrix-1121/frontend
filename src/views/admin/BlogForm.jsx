import React, { useState, useEffect, useRef } from 'react';
import { Blog } from '../../models/shared/Blog';
import useBlogStore from '../../stores/shared/blogStore';
import { useNavigate } from 'react-router-dom';

const BlogEntryForm = ({ 
  initialData = null, 
  onCancel, 
  mode = 'create',
  loading: externalLoading = false 
}) => {
  const { createBlog, updateBlog, currentBlog, loading: storeLoading } = useBlogStore();
  const navigate = useNavigate();
  
  // Use either external loading prop or store loading
  const isLoading = externalLoading || storeLoading;
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    authorId: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    readingTime: '',
    status: 'draft',
    isFeatured: false,
    isPublished: false
  });
  
  const [featuredImage, setFeaturedImage] = useState(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const fileInputRef = useRef(null);

  // Debug logs
  useEffect(() => {
    console.log('BlogEntryForm rendered with props:', {
      initialData,
      onCancel: typeof onCancel,
      mode,
      externalLoading
    });
    
    console.log('Store actions available:', {
      hasCreateBlog: typeof createBlog === 'function',
      hasUpdateBlog: typeof updateBlog === 'function',
      storeLoading,
      currentBlog
    });
  }, []);

  // Initialize form with initial data
  useEffect(() => {
    if (initialData) {
      console.log('Initializing form with initialData:', initialData);
      setFormData({
        title: initialData.title || '',
        slug: initialData.slug || '',
        excerpt: initialData.excerpt || '',
        content: initialData.content || '',
        authorId: initialData.authorId || '',
        metaTitle: initialData.metaTitle || '',
        metaDescription: initialData.metaDescription || '',
        metaKeywords: initialData.metaKeywords || '',
        readingTime: initialData.readingTime || '',
        status: initialData.status || 'draft',
        isFeatured: initialData.isFeatured || false,
        isPublished: initialData.isPublished || false
      });
      
      if (initialData.featuredImageUrl) {
        setFeaturedImagePreview(initialData.featuredImageUrl);
      }
    } else if (currentBlog && mode === 'edit') {
      console.log('Initializing form with currentBlog from store:', currentBlog);
      setFormData({
        title: currentBlog.title || '',
        slug: currentBlog.slug || '',
        excerpt: currentBlog.excerpt || '',
        content: currentBlog.content || '',
        authorId: currentBlog.authorId || '',
        metaTitle: currentBlog.metaTitle || '',
        metaDescription: currentBlog.metaDescription || '',
        metaKeywords: currentBlog.metaKeywords || '',
        readingTime: currentBlog.readingTime || '',
        status: currentBlog.status || 'draft',
        isFeatured: currentBlog.isFeatured || false,
        isPublished: currentBlog.isPublished || false
      });
      
      if (currentBlog.featuredImageUrl) {
        setFeaturedImagePreview(currentBlog.featuredImageUrl);
      }
    }
    
    // Set current user as author if available
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (currentUser.userId && !formData.authorId) {
      console.log('Setting author from localStorage:', currentUser.userId);
      setFormData(prev => ({ ...prev, authorId: currentUser.userId.toString() }));
    }
  }, [initialData, currentBlog, mode]);

  // Calculate word count
  useEffect(() => {
    const words = formData.content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    
    // Auto-calculate reading time
    if (!formData.readingTime && words.length > 0) {
      const readingTime = Math.ceil(words.length / 200); // 200 words per minute
      setFormData(prev => ({ ...prev, readingTime: readingTime.toString() }));
    }
  }, [formData.content]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!formData.slug && formData.title && !isGeneratingSlug) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title, formData.slug, isGeneratingSlug]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ 
          ...prev, 
          featuredImage: 'Please upload a valid image (JPEG, PNG, GIF, WebP)' 
        }));
        return;
      }
      
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ 
          ...prev, 
          featuredImage: 'Image size should be less than 10MB' 
        }));
        return;
      }
      
      setFeaturedImage(file);
      setFeaturedImagePreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, featuredImage: '' }));
    }
  };

  const handleGenerateSlug = () => {
    if (formData.title) {
      setIsGeneratingSlug(true);
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      setFormData(prev => ({ ...prev, slug }));
      setTimeout(() => setIsGeneratingSlug(false), 1000);
    }
  };

  const handleRemoveImage = () => {
    setFeaturedImage(null);
    setFeaturedImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMetaTitleGenerate = () => {
    if (formData.title && !formData.metaTitle) {
      setFormData(prev => ({ 
        ...prev, 
        metaTitle: formData.title.substring(0, 60) 
      }));
    }
  };

  const handleMetaDescriptionGenerate = () => {
    if (formData.excerpt && !formData.metaDescription) {
      setFormData(prev => ({ 
        ...prev, 
        metaDescription: formData.excerpt.substring(0, 160) 
      }));
    } else if (formData.content && !formData.metaDescription) {
      const description = formData.content
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .substring(0, 160)
        .trim();
      setFormData(prev => ({ ...prev, metaDescription: description }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (!formData.authorId) {
      newErrors.authorId = 'Author is required';
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }
    
    if (formData.readingTime && (isNaN(formData.readingTime) || formData.readingTime < 0)) {
      newErrors.readingTime = 'Reading time must be a positive number';
    }
    
    setErrors(newErrors);
    console.log('Validation result:', { errors: newErrors, isValid: Object.keys(newErrors).length === 0 });
    return Object.keys(newErrors).length === 0;
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUserId = currentUser.userId;

    //Validate authorId
    let authorIdToSend = formData.authorId;

    if (!authorIdToSend || authorIdToSend === '0' || authorIdToSend === 0) {
      if (currentUser) {
        authorIdToSend = currentUserId;
        console.log('Using current user ID as author:', authorIdToSend );
      } else {
        alert('Please log in or specify a valid auther');
        return;
      }
    }
    
    console.log('Submit clicked - mode:', mode);
    
    if (!validateForm()) {
      console.log('Validation failed');
      return;
    }
    
    console.log('Form validation passed');
    
    try {
      // Create FormData with proper structure
      const formDataToSend = new FormData();
      
      // Add all text fields - use exact field names expected by backend
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('slug', formData.slug || '');
      formDataToSend.append('excerpt', formData.excerpt || '');
      formDataToSend.append('content', formData.content.trim());
      formDataToSend.append('authorId', formData.authorId.toString());
      formDataToSend.append('metaTitle', formData.metaTitle || '');
      formDataToSend.append('metaDescription', formData.metaDescription || '');
      formDataToSend.append('metaKeywords', formData.metaKeywords || '');
      formDataToSend.append('readingTime', formData.readingTime || '0');
      formDataToSend.append('status', formData.status || 'draft');
      formDataToSend.append('isFeatured', formData.isFeatured.toString());
      formDataToSend.append('isPublished', formData.isPublished.toString());
      
      // Add featured image if exists - use exact field name 'featuredImage'
      if (featuredImage) {
        console.log('Adding featured image:', featuredImage.name);
        formDataToSend.append('featuredImage', featuredImage, featuredImage.name);
      } else {
        console.log('No featured image to add');
      }
      
      // Debug FormData
      console.log('=== FORM DATA TO SEND ===');
      console.log('FormData size:', formDataToSend.size);
      console.log('Entries:');
      for (let [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File - ${value.name} (${value.size} bytes, ${value.type})`);
        } else {
          console.log(`  ${key}: "${value}"`);
        }
      }
      
      // TEMPORARY: Test without file first
      console.log('🧪 Testing without file first...');
      const testFormData = new FormData();
      testFormData.append('title', 'Test Blog ' + Date.now());
      testFormData.append('content', 'Test content');
      testFormData.append('authorId', formData.authorId || '1');
      testFormData.append('status', 'draft');
      testFormData.append('isFeatured', 'false');
      testFormData.append('isPublished', 'false');
      
      let result;
      
      if (mode === 'create') {
        console.log('Calling createBlog from store');
        // First test without file
        // result = await createBlog(testFormData);
        // If that works, try with actual data
        result = await createBlog(formDataToSend);
      } else {
        const blogId = initialData?.blogId || currentBlog?.blogId;
        if (!blogId) {
          alert('Cannot update: No blog ID found');
          return;
        }
        console.log('Calling updateBlog from store for ID:', blogId);
        result = await updateBlog(blogId, formDataToSend);
      }
      
      console.log('Store action result:', result);
      
      if (result && result.success) {
        console.log('✅ Blog saved successfully!');
        alert(`Blog ${mode === 'create' ? 'created' : 'updated'} successfully!`);
        
        if (onCancel) {
          onCancel();
        } else {
          navigate('/admin/blogs');
        }
      } else {
        const errorMsg = result?.error || 'Unknown error occurred';
        console.error('❌ Error from store:', errorMsg);
        alert(`Error: ${errorMsg}\n\nPlease check console for more details.`);
      }
    } catch (error) {
      console.error('❌ Unexpected error in handleSubmit:', error);
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      alert(`Unexpected error: ${error.message}\n\nPlease check console for more details.`);
    }
  };

  const handleCancel = () => {
    console.log('Cancel button clicked');
    if (onCancel) {
      onCancel();
    } else {
      navigate('/admin/blogs');
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3">
        <h5 className="mb-0">
          <i className="bi bi-pencil-square me-2"></i>
          {mode === 'create' ? 'Create New Blog Post' : 'Edit Blog Post'}
        </h5>
      </div>
      
      <form onSubmit={handleSubmit} className="card-body">
        {/* Basic Information */}
        <div className="row mb-4">
          <div className="col-12">
            <h6 className="border-bottom pb-2 mb-3">
              <i className="bi bi-info-circle me-2"></i>Basic Information
            </h6>
          </div>
          
          {/* Title */}
          <div className="col-md-8 mb-3">
            <label htmlFor="title" className="form-label fw-semibold">
              Title <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-card-heading"></i>
              </span>
              <input
                type="text"
                id="title"
                name="title"
                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter blog title"
                required
              />
              {errors.title && (
                <div className="invalid-feedback">{errors.title}</div>
              )}
            </div>
            <div className="form-text">
              A descriptive title for your blog post. Keep it clear and engaging.
            </div>
          </div>
          
          {/* Author */}
          <div className="col-md-4 mb-3">
            <label htmlFor="authorId" className="form-label fw-semibold">
              Author <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-person"></i>
              </span>
              <input
                type="number"
                id="authorId"
                name="authorId"
                className={`form-control ${errors.authorId ? 'is-invalid' : ''}`}
                value={formData.authorId}
                onChange={handleInputChange}
                placeholder="Author ID"
                required
              />
              {errors.authorId && (
                <div className="invalid-feedback">{errors.authorId}</div>
              )}
            </div>
            <div className="form-text">
              User ID of the author
            </div>
          </div>
          
          {/* Slug */}
          <div className="col-md-8 mb-3">
            <label htmlFor="slug" className="form-label fw-semibold">
              URL Slug <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-link-45deg"></i>
              </span>
              <input
                type="text"
                id="slug"
                name="slug"
                className={`form-control ${errors.slug ? 'is-invalid' : ''}`}
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="url-slug-for-blog"
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleGenerateSlug}
                disabled={!formData.title || isGeneratingSlug}
              >
                {isGeneratingSlug ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1"></span>
                    Generating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-magic me-1"></i>Generate
                  </>
                )}
              </button>
              {errors.slug && (
                <div className="invalid-feedback d-block">{errors.slug}</div>
              )}
            </div>
            <div className="form-text">
              URL-friendly version of the title. Use lowercase, hyphens, and no spaces.
            </div>
          </div>
          
          {/* Reading Time */}
          <div className="col-md-4 mb-3">
            <label htmlFor="readingTime" className="form-label fw-semibold">
              Reading Time (minutes)
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-clock"></i>
              </span>
              <input
                type="number"
                id="readingTime"
                name="readingTime"
                className={`form-control ${errors.readingTime ? 'is-invalid' : ''}`}
                value={formData.readingTime}
                onChange={handleInputChange}
                placeholder="Auto-calculated"
                min="0"
              />
              {errors.readingTime && (
                <div className="invalid-feedback">{errors.readingTime}</div>
              )}
            </div>
            <div className="form-text">
              Estimated reading time. Auto-calculated: {Math.ceil(wordCount / 200)} mins
            </div>
          </div>
          
          {/* Excerpt */}
          <div className="col-12 mb-3">
            <label htmlFor="excerpt" className="form-label fw-semibold">
              Excerpt
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-text-paragraph"></i>
              </span>
              <textarea
                id="excerpt"
                name="excerpt"
                className="form-control"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="Brief summary of the blog post"
                rows="2"
              />
            </div>
            <div className="form-text">
              A short summary that appears in blog listings. {formData.excerpt.length}/500 characters
            </div>
          </div>
        </div>
        
        {/* Featured Image */}
        <div className="row mb-4">
          <div className="col-12">
            <h6 className="border-bottom pb-2 mb-3">
              <i className="bi bi-image me-2"></i>Featured Image
            </h6>
          </div>
          
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">
              Upload Featured Image
            </label>
            <div className={`border rounded p-3 ${errors.featuredImage ? 'border-danger' : ''}`}>
              <div className="mb-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="form-control"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleFileChange}
                />
                {errors.featuredImage && (
                  <div className="text-danger small mt-1">{errors.featuredImage}</div>
                )}
              </div>
              
              {featuredImage && (
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div>
                    <i className="bi bi-file-image text-primary me-2"></i>
                    <span className="fw-medium">{featuredImage.name}</span>
                    <small className="text-muted ms-2">({formatFileSize(featuredImage.size)})</small>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={handleRemoveImage}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              )}
              
              <div className="form-text">
                Recommended size: 1200x800px, Max size: 10MB. Supports JPG, PNG, GIF, WebP.
              </div>
            </div>
          </div>
          
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Preview</label>
            <div className="border rounded p-3 text-center">
              {featuredImagePreview ? (
                <div className="position-relative">
                  <img
                    src={featuredImagePreview}
                    alt="Featured preview"
                    className="img-fluid rounded"
                    style={{ maxHeight: '200px' }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                    onClick={handleRemoveImage}
                    style={{ zIndex: 1 }}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              ) : (
                <div className="py-4 text-muted">
                  <i className="bi bi-image display-6 mb-2 d-block"></i>
                  <span>No image selected</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="row mb-4">
          <div className="col-12">
            <h6 className="border-bottom pb-2 mb-3">
              <i className="bi bi-file-text me-2"></i>Content <span className="text-danger">*</span>
            </h6>
          </div>
          
          <div className="col-12 mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label htmlFor="content" className="form-label fw-semibold mb-0">
                Blog Content
              </label>
              <div className="text-muted small">
                <i className="bi bi-fonts me-1"></i>
                {wordCount} words • {Math.ceil(wordCount / 200)} min read
              </div>
            </div>
            <div className={`border rounded ${errors.content ? 'border-danger' : ''}`}>
              <textarea
                id="content"
                name="content"
                className="form-control border-0"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Write your blog content here..."
                rows="12"
                required
              />
            </div>
            {errors.content && (
              <div className="text-danger small mt-1">{errors.content}</div>
            )}
            <div className="form-text mt-2">
              Use Markdown or HTML for formatting. Tip: Break content into sections with headings.
            </div>
          </div>
        </div>
        
        {/* Advanced Options Toggle */}
        <div className="row mb-4">
          <div className="col-12">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <i className={`bi bi-chevron-${showAdvanced ? 'up' : 'down'} me-2`}></i>
              {showAdvanced ? 'Hide' : 'Show'} Advanced Options
            </button>
          </div>
        </div>
        
        {/* Advanced Options */}
        {showAdvanced && (
          <div className="row mb-4">
            <div className="col-12">
              <h6 className="border-bottom pb-2 mb-3">
                <i className="bi bi-gear me-2"></i>Advanced Options
              </h6>
            </div>
            
            {/* Status & Featured */}
            <div className="col-md-6 mb-3">
              <div className="row">
                <div className="col-12 mb-3">
                  <label className="form-label fw-semibold">Status</label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input
                        type="radio"
                        id="status-draft"
                        name="status"
                        className="form-check-input"
                        value="draft"
                        checked={formData.status === 'draft'}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label" htmlFor="status-draft">
                        <span className="badge bg-secondary">Draft</span>
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        id="status-published"
                        name="status"
                        className="form-check-input"
                        value="published"
                        checked={formData.status === 'published'}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label" htmlFor="status-published">
                        <span className="badge bg-success">Published</span>
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        id="status-archived"
                        name="status"
                        className="form-check-input"
                        value="archived"
                        checked={formData.status === 'archived'}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label" htmlFor="status-archived">
                        <span className="badge bg-warning">Archived</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="col-12">
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      name="isFeatured"
                      className="form-check-input"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label fw-semibold" htmlFor="isFeatured">
                      <i className="bi bi-star-fill text-warning me-2"></i>
                      Feature this blog post
                    </label>
                  </div>
                  <div className="form-text">
                    Featured posts appear in special sections and carousels.
                  </div>
                </div>
              </div>
            </div>
            
            {/* Publish Settings */}
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Publish Settings</label>
              <div className="border rounded p-3">
                <div className="form-check form-switch mb-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    name="isPublished"
                    className="form-check-input"
                    checked={formData.isPublished}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label" htmlFor="isPublished">
                    Publish immediately
                  </label>
                </div>
                <div className="form-text small">
                  When published, the blog will be visible to all users. 
                  {formData.status === 'published' && (
                    <span className="text-success d-block mt-1">
                      <i className="bi bi-check-circle me-1"></i>
                      This post will be published
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* SEO Settings */}
            <div className="col-12 mb-3">
              <h6 className="border-bottom pb-2 mb-3">
                <i className="bi bi-search me-2"></i>SEO Settings
              </h6>
              
              <div className="row">
                {/* Meta Title */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="metaTitle" className="form-label fw-semibold">
                    Meta Title
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      id="metaTitle"
                      name="metaTitle"
                      className="form-control"
                      value={formData.metaTitle}
                      onChange={handleInputChange}
                      placeholder="SEO title for search engines"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleMetaTitleGenerate}
                    >
                      <i className="bi bi-magic"></i>
                    </button>
                  </div>
                  <div className="form-text">
                    Recommended: 50-60 characters. Current: {formData.metaTitle.length}
                    <span className={`ms-2 ${formData.metaTitle.length > 60 ? 'text-danger' : 'text-success'}`}>
                      {formData.metaTitle.length > 60 ? 'Too long!' : 'Good'}
                    </span>
                  </div>
                </div>
                
                {/* Meta Keywords */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="metaKeywords" className="form-label fw-semibold">
                    Meta Keywords
                  </label>
                  <input
                    type="text"
                    id="metaKeywords"
                    name="metaKeywords"
                    className="form-control"
                    value={formData.metaKeywords}
                    onChange={handleInputChange}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                  <div className="form-text">
                    Comma-separated keywords for SEO
                  </div>
                </div>
                
                {/* Meta Description */}
                <div className="col-12 mb-3">
                  <label htmlFor="metaDescription" className="form-label fw-semibold">
                    Meta Description
                  </label>
                  <div className="input-group">
                    <textarea
                      id="metaDescription"
                      name="metaDescription"
                      className="form-control"
                      value={formData.metaDescription}
                      onChange={handleInputChange}
                      placeholder="SEO description for search results"
                      rows="2"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleMetaDescriptionGenerate}
                    >
                      <i className="bi bi-magic"></i>
                    </button>
                  </div>
                  <div className="form-text">
                    Recommended: 150-160 characters. Current: {formData.metaDescription.length}
                    <span className={`ms-2 ${formData.metaDescription.length > 160 ? 'text-danger' : 'text-success'}`}>
                      {formData.metaDescription.length > 160 ? 'Too long!' : 'Good'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Form Actions */}
        <div className="row">
          <div className="col-12">
            <div className="border-top pt-4 d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <i className="bi bi-x-lg me-2"></i>Cancel
              </button>
              
              <div className="d-flex gap-2">
                {mode === 'edit' && (
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this blog post?')) {
                        // Handle delete through store
                        // You can add deleteBlog action call here
                        alert('Delete functionality to be implemented');
                      }
                    }}
                    disabled={isLoading}
                  >
                    <i className="bi bi-trash me-2"></i>Delete
                  </button>
                )}
                
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      {mode === 'create' ? 'Creating...' : 'Updating...'}
                    </>
                  ) : (
                    <>
                      <i className={`bi bi-${mode === 'create' ? 'plus-lg' : 'check-lg'} me-2`}></i>
                      {mode === 'create' ? 'Create Blog Post' : 'Update Blog Post'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="border rounded p-3 bg-light">
              <div className="row text-center">
                <div className="col">
                  <div className="display-6 fw-bold text-primary">{wordCount}</div>
                  <div className="text-muted small">Words</div>
                </div>
                <div className="col">
                  <div className="display-6 fw-bold text-success">
                    {Math.ceil(wordCount / 200)}
                  </div>
                  <div className="text-muted small">Minutes to read</div>
                </div>
                <div className="col">
                  <div className="display-6 fw-bold text-info">
                    {formData.excerpt.length}
                  </div>
                  <div className="text-muted small">Excerpt chars</div>
                </div>
                <div className="col">
                  <div className="display-6 fw-bold text-warning">
                    {formData.slug ? '✓' : '✗'}
                  </div>
                  <div className="text-muted small">Slug set</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BlogEntryForm;







// import React, { useState, useEffect, useRef } from 'react';
// import { Blog } from '../../models/shared/Blog';
// import useBlogStore from '../../stores/shared/blogStore';

// const BlogEntryForm = ({ 
//   initialData = null, 
//   onSubmit, 
//   onCancel, 
//   mode = 'create',
//   loading = false 
// }) => {
//   const { currentBlog } = useBlogStore();
//   const [formData, setFormData] = useState({
//     title: '',
//     slug: '',
//     excerpt: '',
//     content: '',
//     authorId: '',
//     metaTitle: '',
//     metaDescription: '',
//     metaKeywords: '',
//     readingTime: '',
//     status: 'draft',
//     isFeatured: false,
//     isPublished: false
//   });
  
//   const [featuredImage, setFeaturedImage] = useState(null);
//   const [featuredImagePreview, setFeaturedImagePreview] = useState('');
//   const [errors, setErrors] = useState({});
//   const [showAdvanced, setShowAdvanced] = useState(false);
//   const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);
//   const [wordCount, setWordCount] = useState(0);
//   const fileInputRef = useRef(null);

//   // Initialize form with initial data
//   useEffect(() => {
//     if (initialData) {
//       setFormData({
//         title: initialData.title || '',
//         slug: initialData.slug || '',
//         excerpt: initialData.excerpt || '',
//         content: initialData.content || '',
//         authorId: initialData.authorId || '',
//         metaTitle: initialData.metaTitle || '',
//         metaDescription: initialData.metaDescription || '',
//         metaKeywords: initialData.metaKeywords || '',
//         readingTime: initialData.readingTime || '',
//         status: initialData.status || 'draft',
//         isFeatured: initialData.isFeatured || false,
//         isPublished: initialData.isPublished || false
//       });
      
//       if (initialData.featuredImageUrl) {
//         setFeaturedImagePreview(initialData.featuredImageUrl);
//       }
//     } else if (currentBlog && mode === 'edit') {
//       setFormData({
//         title: currentBlog.title || '',
//         slug: currentBlog.slug || '',
//         excerpt: currentBlog.excerpt || '',
//         content: currentBlog.content || '',
//         authorId: currentBlog.authorId || '',
//         metaTitle: currentBlog.metaTitle || '',
//         metaDescription: currentBlog.metaDescription || '',
//         metaKeywords: currentBlog.metaKeywords || '',
//         readingTime: currentBlog.readingTime || '',
//         status: currentBlog.status || 'draft',
//         isFeatured: currentBlog.isFeatured || false,
//         isPublished: currentBlog.isPublished || false
//       });
      
//       if (currentBlog.featuredImageUrl) {
//         setFeaturedImagePreview(currentBlog.featuredImageUrl);
//       }
//     }
    
//     // Set current user as author if available
//     const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
//     if (currentUser.userId && !formData.authorId) {
//       setFormData(prev => ({ ...prev, authorId: currentUser.userId.toString() }));
//     }
//   }, [initialData, currentBlog, mode]);

//   // Calculate word count
//   useEffect(() => {
//     const words = formData.content.trim().split(/\s+/).filter(word => word.length > 0);
//     setWordCount(words.length);
    
//     // Auto-calculate reading time
//     if (!formData.readingTime && words.length > 0) {
//       const readingTime = Math.ceil(words.length / 200); // 200 words per minute
//       setFormData(prev => ({ ...prev, readingTime: readingTime.toString() }));
//     }
//   }, [formData.content]);

//   // Auto-generate slug from title
//   useEffect(() => {
//     if (!formData.slug && formData.title && !isGeneratingSlug) {
//       const generatedSlug = formData.title
//         .toLowerCase()
//         .replace(/[^\w\s]/gi, '')
//         .replace(/\s+/g, '-');
//       setFormData(prev => ({ ...prev, slug: generatedSlug }));
//     }
//   }, [formData.title, formData.slug, isGeneratingSlug]);

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
    
//     // Clear error for this field
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Validate file type
//       const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
//       if (!validTypes.includes(file.type)) {
//         setErrors(prev => ({ 
//           ...prev, 
//           featuredImage: 'Please upload a valid image (JPEG, PNG, GIF, WebP)' 
//         }));
//         return;
//       }
      
//       // Validate file size (10MB max)
//       if (file.size > 10 * 1024 * 1024) {
//         setErrors(prev => ({ 
//           ...prev, 
//           featuredImage: 'Image size should be less than 10MB' 
//         }));
//         return;
//       }
      
//       setFeaturedImage(file);
//       setFeaturedImagePreview(URL.createObjectURL(file));
//       setErrors(prev => ({ ...prev, featuredImage: '' }));
//     }
//   };

//   const handleGenerateSlug = () => {
//     if (formData.title) {
//       setIsGeneratingSlug(true);
//       const slug = formData.title
//         .toLowerCase()
//         .replace(/[^\w\s]/gi, '')
//         .replace(/\s+/g, '-');
//       setFormData(prev => ({ ...prev, slug }));
//       setTimeout(() => setIsGeneratingSlug(false), 1000);
//     }
//   };

//   const handleRemoveImage = () => {
//     setFeaturedImage(null);
//     setFeaturedImagePreview('');
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const handleMetaTitleGenerate = () => {
//     if (formData.title && !formData.metaTitle) {
//       setFormData(prev => ({ 
//         ...prev, 
//         metaTitle: formData.title.substring(0, 60) 
//       }));
//     }
//   };

//   const handleMetaDescriptionGenerate = () => {
//     if (formData.excerpt && !formData.metaDescription) {
//       setFormData(prev => ({ 
//         ...prev, 
//         metaDescription: formData.excerpt.substring(0, 160) 
//       }));
//     } else if (formData.content && !formData.metaDescription) {
//       const description = formData.content
//         .replace(/<[^>]*>/g, '') // Remove HTML tags
//         .substring(0, 160)
//         .trim();
//       setFormData(prev => ({ ...prev, metaDescription: description }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.title.trim()) {
//       newErrors.title = 'Title is required';
//     }
    
//     if (!formData.content.trim()) {
//       newErrors.content = 'Content is required';
//     }
    
//     if (!formData.authorId) {
//       newErrors.authorId = 'Author is required';
//     }
    
//     if (!formData.slug.trim()) {
//       newErrors.slug = 'Slug is required';
//     } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug)) {
//       newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
//     }
    
//     if (formData.readingTime && (isNaN(formData.readingTime) || formData.readingTime < 0)) {
//       newErrors.readingTime = 'Reading time must be a positive number';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };


//   const handleSubmit = (e) => {
//   e.preventDefault();
//   e.stopPropagation(); // Prevent event bubbling
  
//   console.log('Submit triggered');
  
//   if (!validateForm()) {
//     console.log('Validation failed:', errors);
//     return;
//   }
  
//   console.log('Form data before conversion:', formData);
  
//   const blog = Blog.createFromForm(formData);
//   console.log('Blog instance:', blog);
  
//   const formDataToSend = blog.toFormData(featuredImage);
//   console.log('FormData to send:', formDataToSend);
  
//   // Debug FormData contents
//   if (formDataToSend instanceof FormData) {
//     console.log('FormData entries:');
//     for (let [key, value] of formDataToSend.entries()) {
//       console.log(key, value);
//     }
//   }
  
//   if (onSubmit) {
//     console.log('Calling onSubmit callback');
//     onSubmit(formDataToSend, blog);
//   } else {
//     console.error('onSubmit prop is not defined!');
//   }
// };

//   // const handleSubmit = (e) => {
//   //   e.preventDefault();
    
//   //   if (!validateForm()) {
//   //     return;
//   //   }
    
//   //   const blog = Blog.createFromForm(formData);
//   //   const formDataToSend = blog.toFormData(featuredImage);
    
//   //   if (onSubmit) {
//   //     onSubmit(formDataToSend, blog);
//   //   }
//   // };

//   const handleCancel = () => {
//     if (onCancel) {
//       onCancel();
//     }
//   };

//   // Format file size
//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   };

//   return (
//     <div className="card shadow-sm border-0">
//       <div className="card-header bg-white py-3">
//         <h5 className="mb-0">
//           <i className="bi bi-pencil-square me-2"></i>
//           {mode === 'create' ? 'Create New Blog Post' : 'Edit Blog Post'}
//         </h5>
//       </div>
      
//       <form onSubmit={handleSubmit} className="card-body">
//         {/* Basic Information */}
//         <div className="row mb-4">
//           <div className="col-12">
//             <h6 className="border-bottom pb-2 mb-3">
//               <i className="bi bi-info-circle me-2"></i>Basic Information
//             </h6>
//           </div>
          
//           {/* Title */}
//           <div className="col-md-8 mb-3">
//             <label htmlFor="title" className="form-label fw-semibold">
//               Title <span className="text-danger">*</span>
//             </label>
//             <div className="input-group">
//               <span className="input-group-text">
//                 <i className="bi bi-card-heading"></i>
//               </span>
//               <input
//                 type="text"
//                 id="title"
//                 name="title"
//                 className={`form-control ${errors.title ? 'is-invalid' : ''}`}
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 placeholder="Enter blog title"
//                 required
//               />
//               {errors.title && (
//                 <div className="invalid-feedback">{errors.title}</div>
//               )}
//             </div>
//             <div className="form-text">
//               A descriptive title for your blog post. Keep it clear and engaging.
//             </div>
//           </div>
          
//           {/* Author */}
//           <div className="col-md-4 mb-3">
//             <label htmlFor="authorId" className="form-label fw-semibold">
//               Author <span className="text-danger">*</span>
//             </label>
//             <div className="input-group">
//               <span className="input-group-text">
//                 <i className="bi bi-person"></i>
//               </span>
//               <input
//                 type="number"
//                 id="authorId"
//                 name="authorId"
//                 className={`form-control ${errors.authorId ? 'is-invalid' : ''}`}
//                 value={formData.authorId}
//                 onChange={handleInputChange}
//                 placeholder="Author ID"
//                 required
//               />
//               {errors.authorId && (
//                 <div className="invalid-feedback">{errors.authorId}</div>
//               )}
//             </div>
//             <div className="form-text">
//               User ID of the author
//             </div>
//           </div>
          
//           {/* Slug */}
//           <div className="col-md-8 mb-3">
//             <label htmlFor="slug" className="form-label fw-semibold">
//               URL Slug <span className="text-danger">*</span>
//             </label>
//             <div className="input-group">
//               <span className="input-group-text">
//                 <i className="bi bi-link-45deg"></i>
//               </span>
//               <input
//                 type="text"
//                 id="slug"
//                 name="slug"
//                 className={`form-control ${errors.slug ? 'is-invalid' : ''}`}
//                 value={formData.slug}
//                 onChange={handleInputChange}
//                 placeholder="url-slug-for-blog"
//               />
//               <button
//                 type="button"
//                 className="btn btn-outline-secondary"
//                 onClick={handleGenerateSlug}
//                 disabled={!formData.title || isGeneratingSlug}
//               >
//                 {isGeneratingSlug ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-1"></span>
//                     Generating...
//                   </>
//                 ) : (
//                   <>
//                     <i className="bi bi-magic me-1"></i>Generate
//                   </>
//                 )}
//               </button>
//               {errors.slug && (
//                 <div className="invalid-feedback d-block">{errors.slug}</div>
//               )}
//             </div>
//             <div className="form-text">
//               URL-friendly version of the title. Use lowercase, hyphens, and no spaces.
//             </div>
//           </div>
          
//           {/* Reading Time */}
//           <div className="col-md-4 mb-3">
//             <label htmlFor="readingTime" className="form-label fw-semibold">
//               Reading Time (minutes)
//             </label>
//             <div className="input-group">
//               <span className="input-group-text">
//                 <i className="bi bi-clock"></i>
//               </span>
//               <input
//                 type="number"
//                 id="readingTime"
//                 name="readingTime"
//                 className={`form-control ${errors.readingTime ? 'is-invalid' : ''}`}
//                 value={formData.readingTime}
//                 onChange={handleInputChange}
//                 placeholder="Auto-calculated"
//                 min="0"
//               />
//               {errors.readingTime && (
//                 <div className="invalid-feedback">{errors.readingTime}</div>
//               )}
//             </div>
//             <div className="form-text">
//               Estimated reading time. Auto-calculated: {Math.ceil(wordCount / 200)} mins
//             </div>
//           </div>
          
//           {/* Excerpt */}
//           <div className="col-12 mb-3">
//             <label htmlFor="excerpt" className="form-label fw-semibold">
//               Excerpt
//             </label>
//             <div className="input-group">
//               <span className="input-group-text">
//                 <i className="bi bi-text-paragraph"></i>
//               </span>
//               <textarea
//                 id="excerpt"
//                 name="excerpt"
//                 className="form-control"
//                 value={formData.excerpt}
//                 onChange={handleInputChange}
//                 placeholder="Brief summary of the blog post"
//                 rows="2"
//               />
//             </div>
//             <div className="form-text">
//               A short summary that appears in blog listings. {formData.excerpt.length}/500 characters
//             </div>
//           </div>
//         </div>
        
//         {/* Featured Image */}
//         <div className="row mb-4">
//           <div className="col-12">
//             <h6 className="border-bottom pb-2 mb-3">
//               <i className="bi bi-image me-2"></i>Featured Image
//             </h6>
//           </div>
          
//           <div className="col-md-6 mb-3">
//             <label className="form-label fw-semibold">
//               Upload Featured Image
//             </label>
//             <div className={`border rounded p-3 ${errors.featuredImage ? 'border-danger' : ''}`}>
//               <div className="mb-3">
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   className="form-control"
//                   accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
//                   onChange={handleFileChange}
//                 />
//                 {errors.featuredImage && (
//                   <div className="text-danger small mt-1">{errors.featuredImage}</div>
//                 )}
//               </div>
              
//               {featuredImage && (
//                 <div className="d-flex align-items-center justify-content-between mb-2">
//                   <div>
//                     <i className="bi bi-file-image text-primary me-2"></i>
//                     <span className="fw-medium">{featuredImage.name}</span>
//                     <small className="text-muted ms-2">({formatFileSize(featuredImage.size)})</small>
//                   </div>
//                   <button
//                     type="button"
//                     className="btn btn-sm btn-outline-danger"
//                     onClick={handleRemoveImage}
//                   >
//                     <i className="bi bi-trash"></i>
//                   </button>
//                 </div>
//               )}
              
//               <div className="form-text">
//                 Recommended size: 1200x800px, Max size: 10MB. Supports JPG, PNG, GIF, WebP.
//               </div>
//             </div>
//           </div>
          
//           <div className="col-md-6 mb-3">
//             <label className="form-label fw-semibold">Preview</label>
//             <div className="border rounded p-3 text-center">
//               {featuredImagePreview ? (
//                 <div className="position-relative">
//                   <img
//                     src={featuredImagePreview}
//                     alt="Featured preview"
//                     className="img-fluid rounded"
//                     style={{ maxHeight: '200px' }}
//                   />
//                   <button
//                     type="button"
//                     className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
//                     onClick={handleRemoveImage}
//                     style={{ zIndex: 1 }}
//                   >
//                     <i className="bi bi-x-lg"></i>
//                   </button>
//                 </div>
//               ) : (
//                 <div className="py-4 text-muted">
//                   <i className="bi bi-image display-6 mb-2 d-block"></i>
//                   <span>No image selected</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
        
//         {/* Content */}
//         <div className="row mb-4">
//           <div className="col-12">
//             <h6 className="border-bottom pb-2 mb-3">
//               <i className="bi bi-file-text me-2"></i>Content <span className="text-danger">*</span>
//             </h6>
//           </div>
          
//           <div className="col-12 mb-3">
//             <div className="d-flex justify-content-between align-items-center mb-2">
//               <label htmlFor="content" className="form-label fw-semibold mb-0">
//                 Blog Content
//               </label>
//               <div className="text-muted small">
//                 <i className="bi bi-fonts me-1"></i>
//                 {wordCount} words • {Math.ceil(wordCount / 200)} min read
//               </div>
//             </div>
//             <div className={`border rounded ${errors.content ? 'border-danger' : ''}`}>
//               <textarea
//                 id="content"
//                 name="content"
//                 className="form-control border-0"
//                 value={formData.content}
//                 onChange={handleInputChange}
//                 placeholder="Write your blog content here..."
//                 rows="12"
//                 required
//               />
//             </div>
//             {errors.content && (
//               <div className="text-danger small mt-1">{errors.content}</div>
//             )}
//             <div className="form-text mt-2">
//               Use Markdown or HTML for formatting. Tip: Break content into sections with headings.
//             </div>
//           </div>
//         </div>
        
//         {/* Advanced Options Toggle */}
//         <div className="row mb-4">
//           <div className="col-12">
//             <button
//               type="button"
//               className="btn btn-outline-secondary w-100"
//               onClick={() => setShowAdvanced(!showAdvanced)}
//             >
//               <i className={`bi bi-chevron-${showAdvanced ? 'up' : 'down'} me-2`}></i>
//               {showAdvanced ? 'Hide' : 'Show'} Advanced Options
//             </button>
//           </div>
//         </div>
        
//         {/* Advanced Options */}
//         {showAdvanced && (
//           <div className="row mb-4">
//             <div className="col-12">
//               <h6 className="border-bottom pb-2 mb-3">
//                 <i className="bi bi-gear me-2"></i>Advanced Options
//               </h6>
//             </div>
            
//             {/* Status & Featured */}
//             <div className="col-md-6 mb-3">
//               <div className="row">
//                 <div className="col-12 mb-3">
//                   <label className="form-label fw-semibold">Status</label>
//                   <div className="d-flex gap-3">
//                     <div className="form-check">
//                       <input
//                         type="radio"
//                         id="status-draft"
//                         name="status"
//                         className="form-check-input"
//                         value="draft"
//                         checked={formData.status === 'draft'}
//                         onChange={handleInputChange}
//                       />
//                       <label className="form-check-label" htmlFor="status-draft">
//                         <span className="badge bg-secondary">Draft</span>
//                       </label>
//                     </div>
//                     <div className="form-check">
//                       <input
//                         type="radio"
//                         id="status-published"
//                         name="status"
//                         className="form-check-input"
//                         value="published"
//                         checked={formData.status === 'published'}
//                         onChange={handleInputChange}
//                       />
//                       <label className="form-check-label" htmlFor="status-published">
//                         <span className="badge bg-success">Published</span>
//                       </label>
//                     </div>
//                     <div className="form-check">
//                       <input
//                         type="radio"
//                         id="status-archived"
//                         name="status"
//                         className="form-check-input"
//                         value="archived"
//                         checked={formData.status === 'archived'}
//                         onChange={handleInputChange}
//                       />
//                       <label className="form-check-label" htmlFor="status-archived">
//                         <span className="badge bg-warning">Archived</span>
//                       </label>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="col-12">
//                   <div className="form-check form-switch">
//                     <input
//                       type="checkbox"
//                       id="isFeatured"
//                       name="isFeatured"
//                       className="form-check-input"
//                       checked={formData.isFeatured}
//                       onChange={handleInputChange}
//                     />
//                     <label className="form-check-label fw-semibold" htmlFor="isFeatured">
//                       <i className="bi bi-star-fill text-warning me-2"></i>
//                       Feature this blog post
//                     </label>
//                   </div>
//                   <div className="form-text">
//                     Featured posts appear in special sections and carousels.
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             {/* Publish Settings */}
//             <div className="col-md-6 mb-3">
//               <label className="form-label fw-semibold">Publish Settings</label>
//               <div className="border rounded p-3">
//                 <div className="form-check form-switch mb-2">
//                   <input
//                     type="checkbox"
//                     id="isPublished"
//                     name="isPublished"
//                     className="form-check-input"
//                     checked={formData.isPublished}
//                     onChange={handleInputChange}
//                   />
//                   <label className="form-check-label" htmlFor="isPublished">
//                     Publish immediately
//                   </label>
//                 </div>
//                 <div className="form-text small">
//                   When published, the blog will be visible to all users. 
//                   {formData.status === 'published' && (
//                     <span className="text-success d-block mt-1">
//                       <i className="bi bi-check-circle me-1"></i>
//                       This post will be published
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
            
//             {/* SEO Settings */}
//             <div className="col-12 mb-3">
//               <h6 className="border-bottom pb-2 mb-3">
//                 <i className="bi bi-search me-2"></i>SEO Settings
//               </h6>
              
//               <div className="row">
//                 {/* Meta Title */}
//                 <div className="col-md-6 mb-3">
//                   <label htmlFor="metaTitle" className="form-label fw-semibold">
//                     Meta Title
//                   </label>
//                   <div className="input-group">
//                     <input
//                       type="text"
//                       id="metaTitle"
//                       name="metaTitle"
//                       className="form-control"
//                       value={formData.metaTitle}
//                       onChange={handleInputChange}
//                       placeholder="SEO title for search engines"
//                     />
//                     <button
//                       type="button"
//                       className="btn btn-outline-secondary"
//                       onClick={handleMetaTitleGenerate}
//                     >
//                       <i className="bi bi-magic"></i>
//                     </button>
//                   </div>
//                   <div className="form-text">
//                     Recommended: 50-60 characters. Current: {formData.metaTitle.length}
//                     <span className={`ms-2 ${formData.metaTitle.length > 60 ? 'text-danger' : 'text-success'}`}>
//                       {formData.metaTitle.length > 60 ? 'Too long!' : 'Good'}
//                     </span>
//                   </div>
//                 </div>
                
//                 {/* Meta Keywords */}
//                 <div className="col-md-6 mb-3">
//                   <label htmlFor="metaKeywords" className="form-label fw-semibold">
//                     Meta Keywords
//                   </label>
//                   <input
//                     type="text"
//                     id="metaKeywords"
//                     name="metaKeywords"
//                     className="form-control"
//                     value={formData.metaKeywords}
//                     onChange={handleInputChange}
//                     placeholder="keyword1, keyword2, keyword3"
//                   />
//                   <div className="form-text">
//                     Comma-separated keywords for SEO
//                   </div>
//                 </div>
                
//                 {/* Meta Description */}
//                 <div className="col-12 mb-3">
//                   <label htmlFor="metaDescription" className="form-label fw-semibold">
//                     Meta Description
//                   </label>
//                   <div className="input-group">
//                     <textarea
//                       id="metaDescription"
//                       name="metaDescription"
//                       className="form-control"
//                       value={formData.metaDescription}
//                       onChange={handleInputChange}
//                       placeholder="SEO description for search results"
//                       rows="2"
//                     />
//                     <button
//                       type="button"
//                       className="btn btn-outline-secondary"
//                       onClick={handleMetaDescriptionGenerate}
//                     >
//                       <i className="bi bi-magic"></i>
//                     </button>
//                   </div>
//                   <div className="form-text">
//                     Recommended: 150-160 characters. Current: {formData.metaDescription.length}
//                     <span className={`ms-2 ${formData.metaDescription.length > 160 ? 'text-danger' : 'text-success'}`}>
//                       {formData.metaDescription.length > 160 ? 'Too long!' : 'Good'}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
        
//         {/* Form Actions */}
//         <div className="row">
//           <div className="col-12">
//             <div className="border-top pt-4 d-flex justify-content-between">
//               <button
//                 type="button"
//                 className="btn btn-outline-secondary"
//                 onClick={handleCancel}
//                 disabled={loading}
//               >
//                 <i className="bi bi-x-lg me-2"></i>Cancel
//               </button>
              
//               <div className="d-flex gap-2">
//                 {mode === 'edit' && (
//                   <button
//                     type="button"
//                     className="btn btn-outline-danger"
//                     onClick={() => {
//                       if (window.confirm('Are you sure you want to delete this blog post?')) {
//                         // Handle delete through parent component
//                       }
//                     }}
//                     disabled={loading}
//                   >
//                     <i className="bi bi-trash me-2"></i>Delete
//                   </button>
//                 )}
                
//                 <button
//                   type="submit"
//                   className="btn btn-success"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <>
//                       <span className="spinner-border spinner-border-sm me-2"></span>
//                       {mode === 'create' ? 'Creating...' : 'Updating...'}
//                     </>
//                   ) : (
//                     <>
//                       <i className={`bi bi-${mode === 'create' ? 'plus-lg' : 'check-lg'} me-2`}></i>
//                       {mode === 'create' ? 'Create Blog Post' : 'Update Blog Post'}
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {/* Quick Stats */}
//         <div className="row mt-4">
//           <div className="col-12">
//             <div className="border rounded p-3 bg-light">
//               <div className="row text-center">
//                 <div className="col">
//                   <div className="display-6 fw-bold text-primary">{wordCount}</div>
//                   <div className="text-muted small">Words</div>
//                 </div>
//                 <div className="col">
//                   <div className="display-6 fw-bold text-success">
//                     {Math.ceil(wordCount / 200)}
//                   </div>
//                   <div className="text-muted small">Minutes to read</div>
//                 </div>
//                 <div className="col">
//                   <div className="display-6 fw-bold text-info">
//                     {formData.excerpt.length}
//                   </div>
//                   <div className="text-muted small">Excerpt chars</div>
//                 </div>
//                 <div className="col">
//                   <div className="display-6 fw-bold text-warning">
//                     {formData.slug ? '✓' : '✗'}
//                   </div>
//                   <div className="text-muted small">Slug set</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default BlogEntryForm;
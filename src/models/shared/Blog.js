export class Blog {
  constructor(data = {}) {
    this.blogId = data.blogId || 0;
    this.title = data.title || '';
    this.slug = data.slug || '';
    this.excerpt = data.excerpt || '';
    this.content = data.content || '';
    this.featuredImage = data.featuredImage || '';
    this.featuredImageUrl = data.featuredImageUrl || '';
    this.authorId = data.authorId || 0;
    this.metaTitle = data.metaTitle || '';
    this.metaDescription = data.metaDescription || '';
    this.metaKeywords = data.metaKeywords || '';
    this.readingTime = data.readingTime || 0;
    this.views = data.views || 0;
    this.likes = data.likes || 0;
    this.shares = data.shares || 0;
    this.isFeatured = data.isFeatured || false;
    this.isPublished = data.isPublished || false;
    this.publishedAt = data.publishedAt || '';
    this.publishedAtFormatted = data.publishedAtFormatted || '';
    this.publishedAtRelative = data.publishedAtRelative || '';
    this.status = data.status || 'draft';
    this.createdAt = data.createdAt || '';
    this.createdAtFormatted = data.createdAtFormatted || '';
    this.updatedAt = data.updatedAt || '';
    
    // Author information (populated from include)
    this.author = data.author || null;
    this.authorName = data.authorName || '';
    this.authorAvatar = data.authorAvatar || '';
  }

  static createFromForm(formData) {
    return new Blog({
      title: formData.title,
      slug: formData.slug || '',
      excerpt: formData.excerpt || '',
      content: formData.content,
      authorId: parseInt(formData.authorId) || 0,
      metaTitle: formData.metaTitle || '',
      metaDescription: formData.metaDescription || '',
      metaKeywords: formData.metaKeywords || '',
      readingTime: parseInt(formData.readingTime) || 0,
      status: formData.status || 'draft',
      isFeatured: formData.isFeatured === 'true' || formData.isFeatured === true || formData.isFeatured === '1',
      isPublished: formData.isPublished === 'true' || formData.isPublished === true || formData.isPublished === '1'
    });
  }



  toFormData(featuredImageFile = null) {
    const formData = new FormData();
    
    // Add all required fields
    formData.append('title', this.title || '');
    formData.append('slug', this.slug || '');
    formData.append('excerpt', this.excerpt || '');
    formData.append('content', this.content || '');
    formData.append('authorId', this.authorId?.toString() || '');
    formData.append('metaTitle', this.metaTitle || '');
    formData.append('metaDescription', this.metaDescription || '');
    formData.append('metaKeywords', this.metaKeywords || '');
    formData.append('readingTime', this.readingTime?.toString() || '0');
    formData.append('status', this.status || 'draft');
    formData.append('isFeatured', this.isFeatured?.toString() || 'false');
    formData.append('isPublished', this.isPublished?.toString() || 'false');
    
    // Add featured image if exists
    if (featuredImageFile) {
      console.log('Adding featured image to FormData:', featuredImageFile.name);
      formData.append('featuredImage', featuredImageFile, featuredImageFile.name);
    } else {
      console.log('No featured image to add');
    }
    
    // Debug: Log FormData contents
    console.log('FormData created with fields:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value instanceof File ? `File: ${value.name} (${value.type})` : value);
    }
    
    return formData;
  }
  // Helper methods
  isPublishedStatus() {
    return this.status === 'published';
  }

  isDraftStatus() {
    return this.status === 'draft';
  }

  isArchivedStatus() {
    return this.status === 'archived';
  }

  getReadingTimeText() {
    if (this.readingTime <= 0) return 'Quick read';
    if (this.readingTime === 1) return '1 min read';
    return `${this.readingTime} min read`;
  }

  getViewCountText() {
    if (this.views === 0) return 'No views';
    if (this.views === 1) return '1 view';
    return `${this.views.toLocaleString()} views`;
  }

  getLikeCountText() {
    if (this.likes === 0) return 'No likes';
    if (this.likes === 1) return '1 like';
    return `${this.likes.toLocaleString()} likes`;
  }

  getShareCountText() {
    if (this.shares === 0) return 'No shares';
    if (this.shares === 1) return '1 share';
    return `${this.shares.toLocaleString()} shares`;
  }
}

export class BlogComment {
  constructor(data = {}) {
    this.commentId = data.commentId || 0;
    this.blogId = data.blogId || 0;
    this.userId = data.userId || 0;
    this.parentCommentId = data.parentCommentId || null;
    this.content = data.content || '';
    this.isApproved = data.isApproved ?? true;
    this.likes = data.likes || 0;
    this.createdAt = data.createdAt || '';
    this.updatedAt = data.updatedAt || '';
    
    // User information (populated from include)
    this.user = data.user || null;
  }
}

export class BlogLike {
  constructor(data = {}) {
    this.likeId = data.likeId || 0;
    this.blogId = data.blogId || 0;
    this.userId = data.userId || 0;
    this.createdAt = data.createdAt || '';
  }
} 



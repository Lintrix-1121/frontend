class ProjectModel {
  constructor(data = {}) {
    // Core
    this.projectId = data.projectId || null;
    this.title = data.title || '';
    this.slug = data.slug || '';
    this.clientName = data.clientName || '';
    this.clientIndustry = data.clientIndustry || '';
    this.category = data.category || 'Software Development';
    this.subCategory = data.subCategory || '';
    this.shortDescription = data.shortDescription || '';
    this.fullDescription = data.fullDescription || '';
    this.challenge = data.challenge || '';
    this.solution = data.solution || '';
    this.results = data.results || '';

    // Tech & team
    this.technologies = data.technologies || [];
    this.teamSize = data.teamSize || null;
    this.projectDuration = data.projectDuration || '';
    this.startDate = data.startDate || null;
    this.endDate = data.endDate || null;
    this.projectUrl = data.projectUrl || '';
    this.githubUrl = data.githubUrl || '';
    this.demoUrl = data.demoUrl || '';

    // Testimonials
    this.clientTestimonial = data.clientTestimonial || '';
    this.testimonialAuthor = data.testimonialAuthor || '';
    this.testimonialPosition = data.testimonialPosition || '';

    // People
    this.projectManager = data.projectManager || null; // user ID
    this.manager = data.manager || null; // populated user object
    this.teamMembers = data.teamMembers || [];
    this.stakeholders = data.stakeholders || [];
    this.createdBy = data.createdBy || null;
    this.creator = data.creator || null;
    this.updatedBy = data.updatedBy || null;
    this.approvedBy = data.approvedBy || null;
    this.approvedAt = data.approvedAt || null;

    // Financial
    this.budget = data.budget || null;
    this.currency = data.currency || 'USD';
    this.roi = data.roi || '';
    this.kpis = data.kpis || {};

    // Confidentiality
    this.isConfidential = data.isConfidential || false;
    this.confidentialityNotice = data.confidentialityNotice || '';

    // Status & progress
    this.status = data.status || 'planned';
    this.completionPercentage = data.completionPercentage || 0;
    this.milestones = data.milestones || [];
    this.priority = data.priority || 'medium';
    this.isFeatured = data.isFeatured || false;
    this.isPublished = data.isPublished || false;
    this.publishedAt = data.publishedAt || null;

    // Engagement
    this.views = data.views || 0;
    this.likes = data.likes || 0;
    this.shares = data.shares || 0;

    // SEO & metadata
    this.metaTitle = data.metaTitle || '';
    this.metaDescription = data.metaDescription || '';
    this.metaKeywords = data.metaKeywords || '';
    this.tags = data.tags || [];

    // Location
    this.location = data.location || '';
    this.country = data.country || '';
    this.notes = data.notes || '';

    // Media (from ProjectMedia association)
    this.media = data.media || [];
    this.featuredImage = data.featuredImage || '';
    this.galleryImages = data.galleryImages || [];
    this.videos = data.videos || [];
    this.videoThumbnails = data.videoThumbnails || [];
    this.documents = data.documents || [];

    // Timestamps
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;

    // Computed fields from backend 
    this.createdAtFormatted = data.createdAtFormatted || '';
    this.publishedAtFormatted = data.publishedAtFormatted || '';
    this.publishedAtRelative = data.publishedAtRelative || '';
    this.startDateFormatted = data.startDateFormatted || '';
    this.endDateFormatted = data.endDateFormatted || '';
    this.featuredImageUrl = data.featuredImageUrl || null;
    this.statusBadge = data.statusBadge || { color: 'gray', text: this.status };
    this.priorityBadge = data.priorityBadge || { color: 'gray', text: this.priority };
    this.progress = data.progress || 0;
  }

  // Computed properties (frontend only)
  get formattedStartDate() {
    return this.startDate ? new Date(this.startDate).toLocaleDateString() : 'Not set';
  }

  get formattedEndDate() {
    return this.endDate ? new Date(this.endDate).toLocaleDateString() : 'Not set';
  }

  get formattedBudget() {
    if (!this.budget) return 'Not disclosed';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.currency,
    }).format(this.budget);
  }

  get featuredMedia() {
    return this.media?.find(m => m.isFeatured) || this.media?.[0] || null;
  }

  get galleryMedia() {
    return this.media?.filter(m => !m.isFeatured) || [];
  }

  get isPlanned() { return this.status === 'planned'; }
  get isInProgress() { return this.status === 'in-progress'; }
  get isCompleted() { return this.status === 'completed'; }
  get isOnHold() { return this.status === 'on-hold'; }
  get isCancelled() { return this.status === 'cancelled'; }
  get isMaintenance() { return this.status === 'maintenance'; }

  get isLowPriority() { return this.priority === 'low'; }
  get isMediumPriority() { return this.priority === 'medium'; }
  get isHighPriority() { return this.priority === 'high'; }
  get isCriticalPriority() { return this.priority === 'critical'; }

  // Validation
  validate() {
    const errors = [];
    if (!this.title) errors.push('Title is required');
    if (!this.category) errors.push('Category is required');
    if (!this.fullDescription) errors.push('Description is required');
    return errors;
  }

  // Serialization 
  toJSON() {
    return {
      projectId: this.projectId,
      title: this.title,
      slug: this.slug,
      clientName: this.clientName,
      clientIndustry: this.clientIndustry,
      category: this.category,
      subCategory: this.subCategory,
      shortDescription: this.shortDescription,
      fullDescription: this.fullDescription,
      challenge: this.challenge,
      solution: this.solution,
      results: this.results,
      technologies: this.technologies,
      teamSize: this.teamSize,
      projectDuration: this.projectDuration,
      startDate: this.startDate,
      endDate: this.endDate,
      projectUrl: this.projectUrl,
      githubUrl: this.githubUrl,
      demoUrl: this.demoUrl,
      clientTestimonial: this.clientTestimonial,
      testimonialAuthor: this.testimonialAuthor,
      testimonialPosition: this.testimonialPosition,
      projectManager: this.projectManager,
      teamMembers: this.teamMembers,
      stakeholders: this.stakeholders,
      budget: this.budget,
      currency: this.currency,
      roi: this.roi,
      kpis: this.kpis,
      isConfidential: this.isConfidential,
      confidentialityNotice: this.confidentialityNotice,
      status: this.status,
      completionPercentage: this.completionPercentage,
      milestones: this.milestones,
      priority: this.priority,
      isFeatured: this.isFeatured,
      isPublished: this.isPublished,
      publishedAt: this.publishedAt,
      views: this.views,
      likes: this.likes,
      shares: this.shares,
      metaTitle: this.metaTitle,
      metaDescription: this.metaDescription,
      metaKeywords: this.metaKeywords,
      tags: this.tags,
      location: this.location,
      country: this.country,
      notes: this.notes,
      featuredImage: this.featuredImage,
      galleryImages: this.galleryImages,
      videos: this.videos,
      videoThumbnails: this.videoThumbnails,
      documents: this.documents,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      approvedBy: this.approvedBy,
      approvedAt: this.approvedAt,
      createdBy: this.createdBy,
      updatedBy: this.updatedBy,
    };
  }

  toFormData() {
    const formData = new FormData();
    const data = this.toJSON();
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (value === null || value === undefined) return;
      if (Array.isArray(value) || typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });
    return formData;
  }

  // Factory
  static fromApiResponse(data) {
    return new ProjectModel(data);
  }

  static fromJson(json) {
    return new ProjectModel(JSON.parse(json));
  }
}

export default ProjectModel;


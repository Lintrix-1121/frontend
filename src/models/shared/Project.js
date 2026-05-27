/**
 * Project Model - Frontend representation of Project data structure
 */
class ProjectModel {
  constructor(data = {}) {
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
    this.technologies = data.technologies || [];
    this.teamSize = data.teamSize || null;
    this.projectDuration = data.projectDuration || '';
    this.startDate = data.startDate || null;
    this.endDate = data.endDate || null;
    this.projectUrl = data.projectUrl || '';
    this.githubUrl = data.githubUrl || '';
    this.demoUrl = data.demoUrl || '';
    this.clientTestimonial = data.clientTestimonial || '';
    this.testimonialAuthor = data.testimonialAuthor || '';
    this.testimonialPosition = data.testimonialPosition || '';
    this.projectManager = data.projectManager || null;
    this.teamMembers = data.teamMembers || [];
    this.stakeholders = data.stakeholders || [];
    this.budget = data.budget || null;
    this.currency = data.currency || 'USD';
    this.roi = data.roi || '';
    this.kpis = data.kpis || {};
    this.isConfidential = data.isConfidential || false;
    this.confidentialityNotice = data.confidentialityNotice || '';
    this.status = data.status || 'planned';
    this.completionPercentage = data.completionPercentage || 0;
    this.milestones = data.milestones || [];
    this.priority = data.priority || 'medium';
    this.isFeatured = data.isFeatured || false;
    this.isPublished = data.isPublished || false;
    this.publishedAt = data.publishedAt || null;
    this.views = data.views || 0;
    this.likes = data.likes || 0;
    this.shares = data.shares || 0;
    this.tags = data.tags || [];
    this.location = data.location || '';
    this.country = data.country || '';
    this.notes = data.notes || '';
    this.media = data.media || [];
    this.creator = data.creator || null;
    this.manager = data.manager || null;
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  // Computed properties
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
      currency: this.currency
    }).format(this.budget);
  }

  get featuredImage() {
    const featured = this.media?.find(m => m.isFeatured);
    return featured?.mediaUrl || null;
  }

  get statusBadge() {
    const badges = {
      'planned': { color: 'blue', text: 'Planned' },
      'in-progress': { color: 'yellow', text: 'In Progress' },
      'completed': { color: 'green', text: 'Completed' },
      'on-hold': { color: 'orange', text: 'On Hold' },
      'cancelled': { color: 'red', text: 'Cancelled' },
      'maintenance': { color: 'purple', text: 'Maintenance' }
    };
    return badges[this.status] || { color: 'gray', text: this.status };
  }

  get priorityBadge() {
    const badges = {
      'low': { color: 'green', text: 'Low' },
      'medium': { color: 'yellow', text: 'Medium' },
      'high': { color: 'orange', text: 'High' },
      'critical': { color: 'red', text: 'Critical' }
    };
    return badges[this.priority] || { color: 'gray', text: this.priority };
  }

  // Validation
  validate() {
    const errors = [];
    if (!this.title) errors.push('Title is required');
    if (!this.category) errors.push('Category is required');
    if (!this.fullDescription) errors.push('Description is required');
    return errors;
  }

  // Convert to form data for API
  toFormData() {
    const formData = new FormData();
    
    Object.keys(this).forEach(key => {
      if (this[key] !== null && key !== 'media' && key !== 'creator' && key !== 'manager') {
        if (Array.isArray(this[key]) || typeof this[key] === 'object') {
          formData.append(key, JSON.stringify(this[key]));
        } else {
          formData.append(key, this[key]);
        }
      }
    });
    
    return formData;
  }

  // Create from API response
  static fromApiResponse(data) {
    return new ProjectModel(data);
  }
}

export default ProjectModel;


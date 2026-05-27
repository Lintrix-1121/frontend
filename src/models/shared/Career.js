export class CareerJob {
  constructor(data = {}) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.slug = data.slug || '';
    this.department = data.department || '';
    this.location = data.location || '';
    this.employmentType = data.employmentType || 'FULL_TIME';
    this.experienceLevel = data.experienceLevel || 'MID';
    this.description = data.description || '';
    this.requirements = data.requirements || [];
    this.responsibilities = data.responsibilities || [];
    this.benefits = data.benefits || [];
    this.salaryRangeMin = data.salaryRangeMin || null;
    this.salaryRangeMax = data.salaryRangeMax || null;
    this.salaryCurrency = data.salaryCurrency || 'UGX';
    this.applicationDeadline = data.applicationDeadline || null;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.isRemote = data.isRemote || false;
    this.numberOfOpenings = data.numberOfOpenings || 1;
    this.viewsCount = data.viewsCount || 0;
    this.applicationsCount = data.applicationsCount || 0;
    this.keywords = data.keywords || [];
    this.metadata = data.metadata || {};
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    
    // Formatted properties
    this.salaryFormatted = data.salaryFormatted || '';
    this.applicationDeadlineFormatted = data.applicationDeadlineFormatted || '';
    this.daysRemaining = data.daysRemaining || null;
    this.postedDate = data.postedDate || '';
  }
  
  // Convert to FormData for API calls
  toFormData() {
    const formData = new FormData();
    
    Object.keys(this).forEach(key => {
      if (this[key] !== null && this[key] !== undefined && key !== 'toFormData') {
        if (Array.isArray(this[key]) || typeof this[key] === 'object') {
          formData.append(key, JSON.stringify(this[key]));
        } else {
          formData.append(key, this[key]);
        }
      }
    });
    
    return formData;
  }
  
  // Create from form data
  static createFromForm(formData) {
    const data = {};
    
    for (let [key, value] of formData.entries()) {
      if (value !== '') {
        try {
          data[key] = JSON.parse(value);
        } catch {
          data[key] = value;
        }
      }
    }
    
    return new CareerJob(data);
  }
}

export class CareerApplication {
  constructor(data = {}) {
    this.id = data.id || '';
    this.applicantName = data.applicantName || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.resumeUrl = data.resumeUrl || '';
    this.coverLetter = data.coverLetter || '';
    this.portfolioUrl = data.portfolioUrl || '';
    this.linkedinUrl = data.linkedinUrl || '';
    this.githubUrl = data.githubUrl || '';
    this.currentCompany = data.currentCompany || '';
    this.currentTitle = data.currentTitle || '';
    this.yearsOfExperience = data.yearsOfExperience || null;
    this.noticePeriod = data.noticePeriod || null;
    this.salaryExpectation = data.salaryExpectation || null;
    this.status = data.status || 'APPLIED';
    this.source = data.source || 'CAREER_PAGE';
    this.ipAddress = data.ipAddress || '';
    this.userAgent = data.userAgent || '';
    this.consentDataProcessing = data.consentDataProcessing || false;
    this.consentPrivacyPolicy = data.consentPrivacyPolicy || false;
    this.metadata = data.metadata || {};
    this.notes = data.notes || '';
    this.CareerJobId = data.CareerJobId || '';
    this.userId = data.userId || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    
    // Relationships
    this.job = data.job ? new CareerJob(data.job) : null;
    this.user = data.user || null;
    
    // Formatted properties
    this.appliedDate = data.appliedDate || '';
    this.statusColor = data.statusColor || 'blue';
    this.statusLabel = data.statusLabel || '';
    this.salaryFormatted = data.salaryFormatted || '';
    this.noticePeriodFormatted = data.noticePeriodFormatted || '';
  }
  
  // Convert to FormData for API calls
  toFormData(resumeFile = null) {
    const formData = new FormData();
    
    Object.keys(this).forEach(key => {
      if (this[key] !== null && this[key] !== undefined && 
          key !== 'toFormData' && key !== 'job' && key !== 'user') {
        if (Array.isArray(this[key]) || typeof this[key] === 'object') {
          formData.append(key, JSON.stringify(this[key]));
        } else {
          formData.append(key, this[key]);
        }
      }
    });
    
    if (resumeFile) {
      formData.append('resume', resumeFile);
    }
    
    return formData;
  }
  
  // Create from form data
  static createFromForm(formData) {
    const data = {};
    
    for (let [key, value] of formData.entries()) {
      if (value !== '') {
        try {
          data[key] = JSON.parse(value);
        } catch {
          data[key] = value;
        }
      }
    }
    
    return new CareerApplication(data);
  }
}


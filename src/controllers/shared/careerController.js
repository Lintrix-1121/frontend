// controllers/careerController.js
import careerService from '../../services/shared/careerService';
import { CareerJob, CareerApplication } from '../../models/shared/Career';

class CareerController {

  // Create job
  async createJob(jobData) {
    try {
      console.log('🎯 [CONTROLLER] createJob called');
      
      // Validate required fields
      const requiredFields = ['title', 'department', 'location', 'description'];
      for (const field of requiredFields) {
        if (!jobData[field] || jobData[field].trim() === '') {
          throw new Error(`${field} is required`);
        }
      }
      
      const result = await careerService.createJob(jobData);
      
      return {
        success: true,
        data: result,
        message: 'Job created successfully'
      };
      
    } catch (error) {
      console.error('❌ [CONTROLLER] Error in createJob:', error);
      return {
        success: false,
        error: error.message || 'Failed to create job',
        data: null
      };
    }
  }

  // Update job
  async updateJob(jobId, jobData) {
    try {
      if (!jobId) {
        throw new Error('Job ID is required');
      }

      const result = await careerService.updateJob(jobId, jobData);
      return { success: true, data: result, message: 'Job updated successfully' };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to update job',
        details: error.response?.data || null
      };
    }
  }

  // Delete job
  async deleteJob(jobId) {
    try {
      if (!jobId) {
        throw new Error('Job ID is required');
      }

      const result = await careerService.deleteJob(jobId);
      return { success: true, message: result.message || 'Job deleted successfully' };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to delete job',
        details: error.response?.data || null
      };
    }
  }


 

  async fetchJobs(filters = {}) {
    try {
      console.log('🎯 [CONTROLLER] fetchJobs called with filters:', filters);
      console.log('🎯 [CONTROLLER] Attempting to fetch jobs from service...');
      
      const jobs = await careerService.getAllJobs(filters);
      
      console.log('✅ [CONTROLLER] Jobs fetched successfully:', jobs?.length || 0, 'jobs');
      
      // Process the jobs to parse JSON strings and convert types
      const processedJobs = (jobs || []).map(job => {
        // If job is already a CareerJob instance, use its properties
        const jobData = job instanceof CareerJob ? job : new CareerJob(job);
        
        return {
          ...jobData,
          // Ensure arrays are properly parsed
          requirements: Array.isArray(jobData.requirements) 
            ? jobData.requirements 
            : (typeof jobData.requirements === 'string' 
                ? JSON.parse(jobData.requirements) 
                : []),
          responsibilities: Array.isArray(jobData.responsibilities) 
            ? jobData.responsibilities 
            : (typeof jobData.responsibilities === 'string' 
                ? JSON.parse(jobData.responsibilities) 
                : []),
          benefits: Array.isArray(jobData.benefits) 
            ? jobData.benefits 
            : (typeof jobData.benefits === 'string' 
                ? JSON.parse(jobData.benefits) 
                : []),
          keywords: Array.isArray(jobData.keywords) 
            ? jobData.keywords 
            : (typeof jobData.keywords === 'string' 
                ? JSON.parse(jobData.keywords) 
                : []),
          // Ensure numbers are properly typed
          salaryRangeMin: jobData.salaryRangeMin ? parseFloat(jobData.salaryRangeMin) : null,
          salaryRangeMax: jobData.salaryRangeMax ? parseFloat(jobData.salaryRangeMax) : null,
          numberOfOpenings: jobData.numberOfOpenings || 1,
          viewsCount: jobData.viewsCount || 0,
          applicationsCount: jobData.applicationsCount || 0,
          // Ensure booleans are properly typed
          isActive: Boolean(jobData.isActive),
          isRemote: Boolean(jobData.isRemote)
        };
      });
      
      console.log('✅ [CONTROLLER] Jobs processed:', processedJobs.length, 'items');
      
      return { 
        success: true, 
        data: processedJobs 
      };
    } catch (error) {
      console.error('❌ [CONTROLLER] Error in fetchJobs:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });
      
      return { 
        success: false, 
        error: error.message || 'Failed to fetch jobs',
        data: []
      };
    }
  }


  async fetchJob(jobIdOrSlug) {
    try {
      console.log('🎯 [CONTROLLER] fetchJob called with:', jobIdOrSlug);
      console.log('🎯 [CONTROLLER] Identifier type:', typeof jobIdOrSlug);
      if (!jobIdOrSlug) {
        throw new Error('Job identifier is required');
      }

      const job = await careerService.getJobByIdOrSlug(jobIdOrSlug);
      
      console.log('✅ [CONTROLLER] Raw job from service:', job ? {
        id: job.id,
        title: job.title,
        exists: true
        // requirementsType: typeof job.requirements,
        // requirements: job.requirements,
        // isArray: Array.isArray(job.requirements)
      } : 'Job not found');
      
      if (!job) {
        return { 
          success: false, 
          error: 'Job not found',
          data: null
        };
      }
      
      const processedJob = {
        ...job,
        salaryRangeMin: job.salaryRangeMin ? parseFloat(job.salaryRangeMin) : null,
        salaryRangeMax: job.salaryRangeMax ? parseFloat(job.salaryRangeMax) : null,
        numberOfOpenings: job.numberOfOpenings || 1,
        viewsCount: job.viewsCount || 0,
        applicationsCount: job.applicationsCount || 0,
        isActive: Boolean(job.isActive),
        isRemote: Boolean(job.isRemote)
      };
      
      console.log('✅ [CONTROLLER] Processed job:', {
        title: processedJob.title,
        requirementsCount: processedJob.requirements?.length,
        firstRequirement: processedJob.requirements?.[0]
      });
      
      return { 
        success: true, 
        data: processedJob 
      };
    } catch (error) {
      console.error('❌ [CONTROLLER] Error in fetchJob:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to fetch job',
        data: null
      };
    }
  }

  // Fetch career stats
  async fetchCareerStats() {
    try {
      console.log('📊 [CONTROLLER] fetchCareerStats called');
      
      const stats = await careerService.getCareerStats();
      
      console.log('✅ [CONTROLLER] Stats fetched:', stats);
      
      // Ensure stats has the expected structure
      const processedStats = stats || {
        totalJobs: 0,
        activeJobs: 0,
        applications: 0,
        departments: 0
      };
      
      return { 
        success: true, 
        data: processedStats 
      };
    } catch (error) {
      console.error('❌ [CONTROLLER] Error in fetchCareerStats:', error.message);
      return { 
        success: false, 
        error: error.message || 'Failed to fetch career statistics',
        data: null
      };
    }
  }

  // Apply for job
  async applyForJob(applicationData, resumeFile) {
    try {
      console.log('📝 [CONTROLLER] applyForJob called');
      
      // Validate required fields
      const requiredFields = ['applicantName', 'email', 'CareerJobId'];
      for (const field of requiredFields) {
        if (!applicationData[field]) {
          throw new Error(`${field} is required`);
        }
      }
      
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(applicationData.email)) {
        throw new Error('Invalid email address');
      }
      
      // Validate consent
      if (!applicationData.consentDataProcessing && !applicationData.consentDataProcessing === 'true') {
        throw new Error('You must consent to data processing');
      }
      
      if (!applicationData.consentPrivacyPolicy && !applicationData.consentPrivacyPolicy === 'true') {
        throw new Error('You must accept the privacy policy');
      }
      
      const result = await careerService.createApplication(applicationData, resumeFile);
      
      return {
        success: true,
        data: result,
        message: 'Application submitted successfully'
      };
      
    } catch (error) {
      console.error('❌ [CONTROLLER] Error in applyForJob:', error);
      return {
        success: false,
        error: error.message || 'Failed to submit application',
        data: null
      };
    }
  }

  // Fetch all applications (admin only)
  async fetchApplications(filters = {}) {
    try {
      const applications = await careerService.getAllApplications(filters);
      return { success: true, data: applications };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to fetch applications',
        data: []
      };
    }
  }

  // Fetch single application
  async fetchApplication(applicationId) {
    try {
      if (!applicationId) {
        throw new Error('Application ID is required');
      }

      const application = await careerService.getApplicationById(applicationId);
      return { success: true, data: application };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to fetch application',
        data: null
      };
    }
  }

  // Update application status
  async updateApplicationStatus(applicationId, status, notes = null) {
    try {
      if (!applicationId || !status) {
        throw new Error('Application ID and status are required');
      }

      const result = await careerService.updateApplicationStatus(applicationId, status, notes);
      return { success: true, data: result, message: 'Application status updated' };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to update application status'
      };
    }
  }

  // Get applications by job
  async fetchApplicationsByJob(jobId) {
    try {
      if (!jobId) {
        throw new Error('Job ID is required');
      }

      const applications = await careerService.getApplicationsByJobId(jobId);
      return { success: true, data: applications };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to fetch applications by job',
        data: []
      };
    }
  }

  // Get my applications (for logged-in users)
  async fetchMyApplications(email) {
    try {
      if (!email) {
        throw new Error('Email is required');
      }

      const applications = await careerService.getApplicationsByEmail(email);
      return { success: true, data: applications };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to fetch your applications',
        data: []
      };
    }
  }

  // Get dashboard data
  async fetchDashboardData() {
    try {
      const dashboard = await careerService.getDashboardData();
      return { success: true, data: dashboard };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to fetch dashboard data',
        data: null
      };
    }
  }

  // Search jobs
  async searchJobs(query, filters = {}) {
    try {
      if (!query || query.trim() === '') {
        throw new Error('Search query is required');
      }

      const jobs = await careerService.searchJobs(query, filters);
      return { success: true, data: jobs };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to search jobs',
        data: []
      };
    }
  }

  // Get job departments
  async fetchDepartments() {
    try {
      const departments = await careerService.getDepartments();
      return { success: true, data: departments };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to fetch departments',
        data: []
      };
    }
  }

  // Get job locations
  async fetchLocations() {
    try {
      const locations = await careerService.getLocations();
      return { success: true, data: locations };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to fetch locations',
        data: []
      };
    }
  }
}

export default new CareerController();



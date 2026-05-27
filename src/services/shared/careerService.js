import api from '../api'; 
import { CareerJob, CareerApplication } from '../../models/shared/Career'; 

class CareerService {

  // Create job
  async createJob(jobData) {
    try {
      console.log('📤 [SERVICE] Creating job:', jobData.title);
      
      const response = await api.post('/careers/jobs', jobData);
      
      console.log('✅ [SERVICE] Job created:', response.data);
      return response.data.data;
      
    } catch (error) {
      console.error('❌ [SERVICE] Error creating job:', error.response?.data || error.message);
      
      let errorMessage = 'Failed to create job';
      if (error.response?.data) {
        const apiError = error.response.data;
        errorMessage = apiError.message || apiError.error || error.message;
      }
      
      throw new Error(errorMessage);
    }
  }



  async getAllJobs(filters = {}) {
    try {
      console.log('📋 [SERVICE] Fetching jobs with filters:', filters);
      
      // Check if token exists before making request
      const token = localStorage.getItem('token');
      console.log('🔑 [SERVICE] Token present before request:', !!token);
      
      const response = await api.get('/careers/jobs', {
        params: filters,
      });
      
      console.log('✅ [SERVICE] Response status:', response.status);
      console.log('✅ [SERVICE] Response data:', response.data);
      
      // Handle different response structures
      let jobsData = [];
      if (response.data && response.data.data) {
        jobsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        jobsData = response.data;
      } else if (response.data && response.data.jobs) {
        jobsData = response.data.jobs;
      } else {
        jobsData = response.data || [];
      }
      
      console.log('✅ [SERVICE] Jobs fetched:', jobsData.length, 'items');
      return jobsData.map(job => new CareerJob(job));
    } catch (error) {
      console.error('❌ [SERVICE] Error fetching jobs:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
      
      // Enhance error message based on status
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to view jobs.');
      } else {
        throw error;
      }
    }
  }

  async getCareerStats() {
    try {
      console.log('📊 [SERVICE] Fetching career statistics');
      
      const token = localStorage.getItem('token');
      console.log('🔑 [SERVICE] Token present for stats request:', !!token);
      
      const response = await api.get('/careers/stats');
      console.log('✅ [SERVICE] Stats response:', response.data);
      
      return response.data.data || response.data;
    } catch (error) {
      console.error('❌ [SERVICE] Error fetching career statistics:', error);
      throw error;
    }
  }

  async getJobByIdOrSlug(identifier) {
    try {
      console.log('🔍 [SERVICE] Fetching job:', identifier);
      console.log('🔍 [SERVICE] Identifier type:', typeof identifier);
      
      const response = await api.get(`/careers/jobs/${identifier}`);
      
      console.log('✅ [SERVICE] Response status:', response.status);
      console.log('✅ [SERVICE] Response data:', response.data);
      
      // Handle response structure
      let jobData = null;
      
      if (response.data && response.data.success && response.data.data) {
        jobData = response.data.data;
      } else if (response.data && response.data.data) {
        jobData = response.data.data;
      } else if (response.data) {
        jobData = response.data;
      }
      
      if (!jobData) {
        throw new Error('Job not found');
      }
      
      console.log('✅ [SERVICE] Job data received:', {
        id: jobData.id,
        title: jobData.title,
        requirementsType: typeof jobData.requirements,
        requirements: jobData.requirements,
        responsibilitiesType: typeof jobData.responsibilities,
        responsibilities: jobData.responsibilities
      });
      
      return new CareerJob(jobData);
       } catch (error) {
          console.error('❌ [SERVICE] Error fetching job:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            url: error.config?.url
          });
          throw error;
        }
      }
       //catch (error) {
  //     console.error('❌ [SERVICE] Error fetching job:', error);
  //     throw error;
  //   }
  // }
 
  // Update job
  async updateJob(id, jobData) {
    try {
      console.log('✏️ [SERVICE] Updating job ID:', id);
      const response = await api.put(`/careers/jobs/${id}`, jobData);
      return new CareerJob(response.data.data);
    } catch (error) {
      console.error('❌ [SERVICE] Error updating job:', error);
      throw error;
    }
  }

  // Delete job
  async deleteJob(id) {
    try {
      console.log('🗑️ [SERVICE] Deleting job ID:', id);
      const response = await api.delete(`/careers/jobs/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ [SERVICE] Error deleting job:', error);
      throw error;
    }
  }

  // Create application
  async createApplication(applicationData, resumeFile) {
    try {
      console.log('📤 [SERVICE] Creating application');
      
      // Create FormData
      const formData = new FormData();
      
      // Add all application data
      Object.keys(applicationData).forEach(key => {
        // Handle nested objects if needed
        if (typeof applicationData[key] === 'object' && applicationData[key] !== null) {
          formData.append(key, JSON.stringify(applicationData[key]));
        } else {
          formData.append(key, applicationData[key]);
        }
      });
      
      // Add resume file
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }
      
      // Don't set Content-Type header - let browser set it with boundary
      const response = await api.post('/careers/apply/idOrSlug', formData, {
        headers: {
          // Remove Content-Type to let browser set it with boundary
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('✅ [SERVICE] Application created:', response.data);
      
      // Handle different response structures
      let applicationData_ = response.data.data || response.data;
      
      return new CareerApplication(applicationData_);
      
    } catch (error) {
      console.error('❌ [SERVICE] Error creating application:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      let errorMessage = 'Failed to submit application';
      if (error.response?.data) {
        const apiError = error.response.data;
        errorMessage = apiError.message || apiError.error || error.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  // Get all applications - IMPROVED VERSION
  async getAllApplications(filters = {}) {
    try {
      console.log('📋 [SERVICE] Fetching applications with filters:', filters);
      const response = await api.get('/careers/applications', {
        params: filters,
      });
      
      // Handle different response structures
      let applicationsData = [];
      if (response.data && response.data.data) {
        applicationsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        applicationsData = response.data;
      } else if (response.data && response.data.applications) {
        applicationsData = response.data.applications;
      }
      
      console.log('✅ [SERVICE] Applications fetched:', applicationsData.length, 'items');
      return applicationsData.map(app => new CareerApplication(app));
    } catch (error) {
      console.error('❌ [SERVICE] Error fetching applications:', error.message);
      throw error;
    }
  }

  // Get application by ID - IMPROVED VERSION
  async getApplicationById(id) {
    try {
      console.log('🔍 [SERVICE] Fetching application ID:', id);
      const response = await api.get(`/careers/applications/${id}`);
      
      let applicationData = response.data.data || response.data;
      
      return new CareerApplication(applicationData);
    } catch (error) {
      console.error('❌ [SERVICE] Error fetching application:', error);
      throw error;
    }
  }

  // Update application status
  async updateApplicationStatus(id, status, notes = null) {
    try {
      console.log('✏️ [SERVICE] Updating application status:', { id, status, notes });
      const response = await api.put(`/careers/applications/${id}/status`, {
        status,
        notes
      });
      return new CareerApplication(response.data.data);
    } catch (error) {
      console.error('❌ [SERVICE] Error updating application status:', error);
      throw error;
    }
  }

  // Get applications by job ID - IMPROVED VERSION
  async getApplicationsByJobId(jobId) {
    try {
      console.log('🔍 [SERVICE] Fetching applications for job:', jobId);
      const response = await api.get(`/careers/jobs/${jobId}/applications`);
      
      let applicationsData = [];
      if (response.data && response.data.data) {
        applicationsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        applicationsData = response.data;
      }
      
      return applicationsData.map(app => new CareerApplication(app));
    } catch (error) {
      console.error('❌ [SERVICE] Error fetching applications by job:', error);
      throw error;
    }
  }

  // Get applications by email - IMPROVED VERSION
  async getApplicationsByEmail(email) {
    try {
      console.log('🔍 [SERVICE] Fetching applications for email:', email);
      const response = await api.get('/careers/applications/my');
      
      let applicationsData = [];
      if (response.data && response.data.data) {
        applicationsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        applicationsData = response.data;
      }
      
      console.log('✅ [SERVICE] My applications fetched:', applicationsData.length, 'items');
      return applicationsData.map(app => new CareerApplication(app));
    } catch (error) {
      console.error('❌ [SERVICE] Error fetching applications by email:', error);
      throw error;
    }
  }

  // Get dashboard data - IMPROVED VERSION
  async getDashboardData() {
    try {
      console.log('📊 [SERVICE] Fetching dashboard data');
      const response = await api.get('/careers/dashboard');
      
      let dashboardData = response.data.data || response.data;
      
      console.log('✅ [SERVICE] Dashboard data fetched');
      return dashboardData;
    } catch (error) {
      console.error('❌ [SERVICE] Error fetching dashboard data:', error);
      throw error;
    }
  }

  // Search jobs - IMPROVED VERSION
  async searchJobs(query, filters = {}) {
    try {
      console.log('🔍 [SERVICE] Searching jobs:', query);
      const response = await api.get('/careers/jobs/search', {
        params: { q: query, ...filters },
      });
      
      let jobsData = [];
      if (response.data && response.data.data) {
        jobsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        jobsData = response.data;
      }
      
      return jobsData.map(job => new CareerJob(job));
    } catch (error) {
      console.error('❌ [SERVICE] Error searching jobs:', error);
      throw error;
    }
  }

  // Get departments
  async getDepartments() {
    try {
      console.log('🏢 [SERVICE] Fetching departments');
      const response = await api.get('/careers/departments');
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('❌ [SERVICE] Error fetching departments:', error);
      throw error;
    }
  }

  // Get locations
  async getLocations() {
    try {
      console.log('📍 [SERVICE] Fetching locations');
      const response = await api.get('/careers/locations');
      return response.data.data || response.data || [];
    } catch (error) {
      console.error('❌ [SERVICE] Error fetching locations:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    try {
      console.log('🏥 [SERVICE] Checking career API health');
      const response = await api.get('/careers/health');
      return response.data;
    } catch (error) {
      console.error('❌ [SERVICE] Career health check failed:', error);
      throw error;
    }
  }

  // Test connection
  async testConnection() {
    try {
      console.log('🧪 [SERVICE] Testing career API connection');
      const response = await api.get('/careers/test');
      return response.data;
    } catch (error) {
      console.error('❌ [SERVICE] Career API connection test failed:', error);
      throw error;
    }
  }
}

// Export as singleton instance
export default new CareerService();



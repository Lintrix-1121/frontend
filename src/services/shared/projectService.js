// src/services/shared/projectService.js
import api from '../api';
import ProjectModel from '../../models/shared/Project';

class ProjectService {
  constructor() {
    console.log('🔧 ProjectService initialized');
  }

  // ============= PUBLIC ENDPOINTS =============

  /**
   * Get all projects with filters
   */
  async getAllProjects(params = {}) {
    try {
      console.log('📋 Fetching projects with params:', params);
      
      const response = await api.get('/projects', { params });
      
      return {
        success: true,
        data: response.data.data.map(p => ProjectModel.fromApiResponse(p)),
        pagination: response.data.pagination,
        total: response.data.total
      };
    } catch (error) {
      console.error('❌ Error fetching projects:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Get project by ID or slug
   */
  async getProject(identifier, options = {}) {
    try {
      console.log('🔍 Fetching project:', identifier);
      
      const response = await api.get(`/projects/${identifier}`, { params: options });
      
      return {
        success: true,
        data: ProjectModel.fromApiResponse(response.data.data)
      };
    } catch (error) {
      console.error('❌ Error fetching project:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Get featured projects
   */
  async getFeaturedProjects(limit = 6) {
    try {
      const response = await api.get('/projects/featured', {
        params: { limit }
      });
      
      return {
        success: true,
        data: response.data.data.map(p => ProjectModel.fromApiResponse(p))
      };
    } catch (error) {
      console.error('❌ Error fetching featured projects:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get projects by category
   */
  async getProjectsByCategory(category, page = 1, limit = 10) {
    try {
      const response = await api.get(`/projects/category/${category}`, {
        params: { page, limit }
      });
      
      return {
        success: true,
        data: response.data.data.map(p => ProjectModel.fromApiResponse(p)),
        pagination: {
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          total: response.data.total
        }
      };
    } catch (error) {
      console.error('❌ Error fetching projects by category:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Search projects
   */
  async searchProjects(query, filters = {}, page = 1, limit = 10) {
    try {
      const response = await api.get('/projects/search', {
        params: { q: query, ...filters, page, limit }
      });
      
      return {
        success: true,
        data: response.data.data.map(p => ProjectModel.fromApiResponse(p)),
        pagination: {
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          total: response.data.total
        }
      };
    } catch (error) {
      console.error('❌ Error searching projects:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get project statistics
   */
  async getProjectStats() {
    try {
      const response = await api.get('/projects/stats');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('❌ Error fetching project stats:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get related projects
   */
  async getRelatedProjects(projectId, limit = 4) {
    try {
      const response = await api.get(`/projects/${projectId}/related`, {
        params: { limit }
      });
      
      return {
        success: true,
        data: response.data.data.map(p => ProjectModel.fromApiResponse(p))
      };
    } catch (error) {
      console.error('❌ Error fetching related projects:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get project timeline
   */
  async getProjectTimeline(projectId) {
    try {
      const response = await api.get(`/projects/${projectId}/timeline`);
      
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('❌ Error fetching project timeline:', error);
      return { success: false, error: error.message };
    }
  }

  // ============= ADMIN/PROTECTED ENDPOINTS =============

  /**
   * Create new project (Admin)
   */
  async createProject(projectData, mediaFiles = []) {
    try {
      console.log('📝 Creating project');
      
      const formData = new FormData();
      
      // Append project data
      Object.keys(projectData).forEach(key => {
        if (projectData[key] !== null && projectData[key] !== undefined) {
          if (Array.isArray(projectData[key]) || typeof projectData[key] === 'object') {
            formData.append(key, JSON.stringify(projectData[key]));
          } else {
            formData.append(key, projectData[key]);
          }
        }
      });
      
      // Append media files
      if (mediaFiles.length > 0) {
        mediaFiles.forEach(file => {
          formData.append('media', file);
        });
      }
      
      const response = await api.post('/admin/projects', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      return {
        success: true,
        data: ProjectModel.fromApiResponse(response.data.data),
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ Error creating project:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Update project (Admin)
   */
  async updateProject(projectId, projectData, mediaFiles = []) {
    try {
      console.log('✏️ Updating project:', projectId);
      
      const formData = new FormData();
      
      Object.keys(projectData).forEach(key => {
        if (projectData[key] !== null && projectData[key] !== undefined) {
          if (Array.isArray(projectData[key]) || typeof projectData[key] === 'object') {
            formData.append(key, JSON.stringify(projectData[key]));
          } else {
            formData.append(key, projectData[key]);
          }
        }
      });
      
      if (mediaFiles.length > 0) {
        mediaFiles.forEach(file => {
          formData.append('media', file);
        });
      }
      
      const response = await api.put(`/admin/projects/${projectId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      return {
        success: true,
        data: ProjectModel.fromApiResponse(response.data.data),
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ Error updating project:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Delete project (Admin)
   */
  async deleteProject(projectId, permanent = false) {
    try {
      const response = await api.delete(`/admin/projects/${projectId}`, {
        params: { permanent }
      });
      
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ Error deleting project:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Upload project media (Admin)
   */
  async uploadProjectMedia(projectId, files, mediaData = {}) {
    try {
      const formData = new FormData();
      
      files.forEach(file => {
        formData.append('files', file);
      });
      
      Object.keys(mediaData).forEach(key => {
        formData.append(key, mediaData[key]);
      });
      
      const response = await api.post(`/admin/projects/${projectId}/media`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ Error uploading media:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Delete project media (Admin)
   */
  async deleteProjectMedia(mediaId) {
    try {
      const response = await api.delete(`/admin/projects/media/${mediaId}`);
      
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ Error deleting media:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Clone project (Admin)
   */
  async cloneProject(projectId, newTitle, createdBy) {
    try {
      const response = await api.post(`/admin/projects/${projectId}/clone`, {
        newTitle,
        createdBy
      });
      
      return {
        success: true,
        data: ProjectModel.fromApiResponse(response.data.data),
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ Error cloning project:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Export project (Admin)
   */
  async exportProject(projectId, format = 'json') {
    try {
      const response = await api.get(`/admin/projects/${projectId}/export`, {
        params: { format }
      });
      
      return {
        success: true,
        data: response.data,
        format
      };
    } catch (error) {
      console.error('❌ Error exporting project:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }
}

export default new ProjectService();// import api from '../api';
// import ProjectModel from '../../models/shared/Project';
// import { API_ENDPOINTS } from '../../services/shared/projectApi.config.js';

// class ProjectService {
//   constructor() {
//     console.log('🔧 ProjectService initialized');
//   }

//   // ============= PUBLIC ENDPOINTS =============

//   /**
//    * Get all projects with filters
//    */
//   async getAllProjects(params = {}) {
//     try {
//       console.log('📋 Fetching projects with params:', params);
      
//       const response = await api.get(API_ENDPOINTS.PROJECTS.BASE, { params });
      
//       return {
//         success: true,
//         data: response.data.data.map(p => ProjectModel.fromApiResponse(p)),
//         pagination: response.data.pagination,
//         total: response.data.total
//       };
//     } catch (error) {
//       console.error('❌ Error fetching projects:', error);
//       return {
//         success: false,
//         error: error.response?.data?.message || error.message
//       };
//     }
//   }

//   /**
//    * Get project by ID or slug
//    */
//   async getProject(identifier, options = {}) {
//     try {
//       console.log('🔍 Fetching project:', identifier);
      
//       const response = await api.get(
//         `${API_ENDPOINTS.PROJECTS.BASE}/${identifier}`,
//         { params: options }
//       );
      
//       return {
//         success: true,
//         data: ProjectModel.fromApiResponse(response.data.data)
//       };
//     } catch (error) {
//       console.error('❌ Error fetching project:', error);
//       return {
//         success: false,
//         error: error.response?.data?.message || error.message
//       };
//     }
//   }

//   /**
//    * Get featured projects
//    */
//   async getFeaturedProjects(limit = 6) {
//     try {
//       const response = await api.get(API_ENDPOINTS.PROJECTS.FEATURED, {
//         params: { limit }
//       });
      
//       return {
//         success: true,
//         data: response.data.data.map(p => ProjectModel.fromApiResponse(p))
//       };
//     } catch (error) {
//       console.error('❌ Error fetching featured projects:', error);
//       return { success: false, error: error.message };
//     }
//   }

//   /**
//    * Get projects by category
//    */
//   async getProjectsByCategory(category, page = 1, limit = 10) {
//     try {
//       const response = await api.get(
//         `${API_ENDPOINTS.PROJECTS.BY_CATEGORY}/${category}`,
//         { params: { page, limit } }
//       );
      
//       return {
//         success: true,
//         data: response.data.data.map(p => ProjectModel.fromApiResponse(p)),
//         pagination: {
//           currentPage: response.data.currentPage,
//           totalPages: response.data.totalPages,
//           total: response.data.total
//         }
//       };
//     } catch (error) {
//       console.error('❌ Error fetching projects by category:', error);
//       return { success: false, error: error.message };
//     }
//   }

//   /**
//    * Search projects
//    */
//   async searchProjects(query, filters = {}, page = 1, limit = 10) {
//     try {
//       const response = await api.get(API_ENDPOINTS.PROJECTS.SEARCH, {
//         params: { q: query, ...filters, page, limit }
//       });
      
//       return {
//         success: true,
//         data: response.data.data.map(p => ProjectModel.fromApiResponse(p)),
//         pagination: {
//           currentPage: response.data.currentPage,
//           totalPages: response.data.totalPages,
//           total: response.data.total
//         }
//       };
//     } catch (error) {
//       console.error('❌ Error searching projects:', error);
//       return { success: false, error: error.message };
//     }
//   }

//   /**
//    * Get project statistics
//    */
//   async getProjectStats() {
//     try {
//       const response = await api.get(API_ENDPOINTS.PROJECTS.STATS);
//       return {
//         success: true,
//         data: response.data.data
//       };
//     } catch (error) {
//       console.error('❌ Error fetching project stats:', error);
//       return { success: false, error: error.message };
//     }
//   }

//   /**
//    * Get related projects
//    */
//   async getRelatedProjects(projectId, limit = 4) {
//     try {
//       const response = await api.get(
//         `${API_ENDPOINTS.PROJECTS.BASE}/${projectId}/related`,
//         { params: { limit } }
//       );
      
//       return {
//         success: true,
//         data: response.data.data.map(p => ProjectModel.fromApiResponse(p))
//       };
//     } catch (error) {
//       console.error('❌ Error fetching related projects:', error);
//       return { success: false, error: error.message };
//     }
//   }

//   /**
//    * Get project timeline
//    */
//   async getProjectTimeline(projectId) {
//     try {
//       const response = await api.get(
//         `${API_ENDPOINTS.PROJECTS.BASE}/${projectId}/timeline`
//       );
      
//       return {
//         success: true,
//         data: response.data.data
//       };
//     } catch (error) {
//       console.error('❌ Error fetching project timeline:', error);
//       return { success: false, error: error.message };
//     }
//   }

//   // ============= ADMIN/PROTECTED ENDPOINTS =============

//   /**
//    * Create new project (Admin)
//    */
//   async createProject(projectData, mediaFiles = []) {
//     try {
//       console.log('📝 Creating project');
      
//       const formData = new FormData();
      
//       // Append project data
//       Object.keys(projectData).forEach(key => {
//         if (projectData[key] !== null && projectData[key] !== undefined) {
//           if (Array.isArray(projectData[key]) || typeof projectData[key] === 'object') {
//             formData.append(key, JSON.stringify(projectData[key]));
//           } else {
//             formData.append(key, projectData[key]);
//           }
//         }
//       });
      
//       // Append media files
//       if (mediaFiles.length > 0) {
//         mediaFiles.forEach(file => {
//           formData.append('media', file);
//         });
//       }
      
//       const response = await api.post(API_ENDPOINTS.ADMIN.PROJECTS.CREATE, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
      
//       return {
//         success: true,
//         data: ProjectModel.fromApiResponse(response.data.data),
//         message: response.data.message
//       };
//     } catch (error) {
//       console.error('❌ Error creating project:', error);
//       return {
//         success: false,
//         error: error.response?.data?.message || error.message
//       };
//     }
//   }

//   /**
//    * Update project (Admin)
//    */
//   async updateProject(projectId, projectData, mediaFiles = []) {
//     try {
//       console.log('✏️ Updating project:', projectId);
      
//       const formData = new FormData();
      
//       Object.keys(projectData).forEach(key => {
//         if (projectData[key] !== null && projectData[key] !== undefined) {
//           if (Array.isArray(projectData[key]) || typeof projectData[key] === 'object') {
//             formData.append(key, JSON.stringify(projectData[key]));
//           } else {
//             formData.append(key, projectData[key]);
//           }
//         }
//       });
      
//       if (mediaFiles.length > 0) {
//         mediaFiles.forEach(file => {
//           formData.append('media', file);
//         });
//       }
      
//       const response = await api.put(
//         `${API_ENDPOINTS.ADMIN.PROJECTS.UPDATE}/${projectId}`,
//         formData,
//         { headers: { 'Content-Type': 'multipart/form-data' } }
//       );
      
//       return {
//         success: true,
//         data: ProjectModel.fromApiResponse(response.data.data),
//         message: response.data.message
//       };
//     } catch (error) {
//       console.error('❌ Error updating project:', error);
//       return {
//         success: false,
//         error: error.response?.data?.message || error.message
//       };
//     }
//   }

//   /**
//    * Delete project (Admin)
//    */
//   async deleteProject(projectId, permanent = false) {
//     try {
//       const response = await api.delete(
//         `${API_ENDPOINTS.ADMIN.PROJECTS.DELETE}/${projectId}`,
//         { params: { permanent } }
//       );
      
//       return {
//         success: true,
//         message: response.data.message
//       };
//     } catch (error) {
//       console.error('❌ Error deleting project:', error);
//       return {
//         success: false,
//         error: error.response?.data?.message || error.message
//       };
//     }
//   }

//   /**
//    * Upload project media (Admin)
//    */
//   async uploadProjectMedia(projectId, files, mediaData = {}) {
//     try {
//       const formData = new FormData();
      
//       files.forEach(file => {
//         formData.append('files', file);
//       });
      
//       Object.keys(mediaData).forEach(key => {
//         formData.append(key, mediaData[key]);
//       });
      
//       const response = await api.post(
//         `${API_ENDPOINTS.ADMIN.PROJECTS.MEDIA_UPLOAD}/${projectId}/media`,
//         formData,
//         { headers: { 'Content-Type': 'multipart/form-data' } }
//       );
      
//       return {
//         success: true,
//         data: response.data.data,
//         message: response.data.message
//       };
//     } catch (error) {
//       console.error('❌ Error uploading media:', error);
//       return {
//         success: false,
//         error: error.response?.data?.message || error.message
//       };
//     }
//   }

//   /**
//    * Delete project media (Admin)
//    */
//   async deleteProjectMedia(mediaId) {
//     try {
//       const response = await api.delete(
//         `${API_ENDPOINTS.ADMIN.PROJECTS.MEDIA_DELETE}/${mediaId}`
//       );
      
//       return {
//         success: true,
//         message: response.data.message
//       };
//     } catch (error) {
//       console.error('❌ Error deleting media:', error);
//       return {
//         success: false,
//         error: error.response?.data?.message || error.message
//       };
//     }
//   }

//   /**
//    * Clone project (Admin)
//    */
//   async cloneProject(projectId, newTitle, createdBy) {
//     try {
//       const response = await api.post(
//         `${API_ENDPOINTS.ADMIN.PROJECTS.CLONE}/${projectId}/clone`,
//         { newTitle, createdBy }
//       );
      
//       return {
//         success: true,
//         data: ProjectModel.fromApiResponse(response.data.data),
//         message: response.data.message
//       };
//     } catch (error) {
//       console.error('❌ Error cloning project:', error);
//       return {
//         success: false,
//         error: error.response?.data?.message || error.message
//       };
//     }
//   }

//   /**
//    * Export project (Admin)
//    */
//   async exportProject(projectId, format = 'json') {
//     try {
//       const response = await api.get(
//         `${API_ENDPOINTS.ADMIN.PROJECTS.EXPORT}/${projectId}/export`,
//         { params: { format } }
//       );
      
//       return {
//         success: true,
//         data: response.data,
//         format
//       };
//     } catch (error) {
//       console.error('❌ Error exporting project:', error);
//       return {
//         success: false,
//         error: error.response?.data?.message || error.message
//       };
//     }
//   }
// }

// export default new ProjectService();
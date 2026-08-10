import api from '../api';
import ProjectModel from '../../models/shared/Project';

class ProjectService {
  constructor() {
    console.log(' ProjectService initialized');
  }

  //PUBLIC ENDPOINTS

  async getAllProjects(params = {}) {
    try {
      const response = await api.get('/projects', { params });
      return {
        success: true,
        data: response.data.data.map(p => ProjectModel.fromApiResponse(p)),
        pagination: response.data.pagination,
        total: response.data.total,
      };
    } catch (error) {
      console.error('Error fetching projects:', error);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  }

  async getProject(identifier, options = {}) {
    try {
      const response = await api.get(`/projects/${identifier}`, { params: options });
      return {
        success: true,
        data: ProjectModel.fromApiResponse(response.data.data),
      };
    } catch (error) {
      console.error('Error fetching project:', error);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  }

  async getFeaturedProjects(limit = 6) {
    try {
      const response = await api.get('/projects/featured', { params: { limit } });
      return {
        success: true,
        data: response.data.data.map(p => ProjectModel.fromApiResponse(p)),
      };
    } catch (error) {
      console.error('Error fetching featured projects:', error);
      return { success: false, error: error.message };
    }
  }

  async getProjectsByCategory(category, page = 1, limit = 10) {
    try {
      const response = await api.get(`/projects/category/${category}`, { params: { page, limit } });
      return {
        success: true,
        data: response.data.data.map(p => ProjectModel.fromApiResponse(p)),
        pagination: {
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          total: response.data.total,
        },
      };
    } catch (error) {
      console.error('Error fetching projects by category:', error);
      return { success: false, error: error.message };
    }
  }

  async getProjectsByTechnology(technology, limit = 10) {
    try {
      const response = await api.get(`/projects/technology/${technology}`, { params: { limit } });
      return {
        success: true,
        data: response.data.data.map(p => ProjectModel.fromApiResponse(p)),
      };
    } catch (error) {
      console.error('Error fetching projects by technology:', error);
      return { success: false, error: error.message };
    }
  }

  async searchProjects(query, filters = {}, page = 1, limit = 10) {
    try {
      const response = await api.get('/projects/search', {
        params: { q: query, ...filters, page, limit },
      });
      return {
        success: true,
        data: response.data.data.map(p => ProjectModel.fromApiResponse(p)),
        pagination: {
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          total: response.data.total,
        },
      };
    } catch (error) {
      console.error('Error searching projects:', error);
      return { success: false, error: error.message };
    }
  }

  async getProjectStats() {
    try {
      const response = await api.get('/projects/stats');
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Error fetching project stats:', error);
      return { success: false, error: error.message };
    }
  }

  async getRelatedProjects(projectId, limit = 4) {
    try {
      const response = await api.get(`/projects/${projectId}/related`, { params: { limit } });
      return {
        success: true,
        data: response.data.data.map(p => ProjectModel.fromApiResponse(p)),
      };
    } catch (error) {
      console.error('Error fetching related projects:', error);
      return { success: false, error: error.message };
    }
  }

  async getProjectTimeline(projectId) {
    try {
      const response = await api.get(`/projects/${projectId}/timeline`);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Error fetching project timeline:', error);
      return { success: false, error: error.message };
    }
  }

  //PROTECTED / ADMIN ENDPOINTS 
  async createProject(projectData, mediaFiles = []) {
    try {
      const formData = new FormData();
      Object.keys(projectData).forEach(key => {
        const val = projectData[key];
        if (val !== null && val !== undefined) {
          if (Array.isArray(val) || typeof val === 'object') {
            formData.append(key, JSON.stringify(val));
          } else {
            formData.append(key, val);
          }
        }
      });
      mediaFiles.forEach(file => formData.append('media', file));

      const response = await api.post('/admin/projects', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return {
        success: true,
        data: ProjectModel.fromApiResponse(response.data.data),
        message: response.data.message,
      };
    } catch (error) {
      console.error('Error creating project:', error);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  }

  async updateProject(projectId, projectData, mediaFiles = []) {
    try {
      const formData = new FormData();
      Object.keys(projectData).forEach(key => {
        const val = projectData[key];
        if (val !== null && val !== undefined) {
          if (Array.isArray(val) || typeof val === 'object') {
            formData.append(key, JSON.stringify(val));
          } else {
            formData.append(key, val);
          }
        }
      });
      mediaFiles.forEach(file => formData.append('media', file));

      const response = await api.put(`/admin/projects/${projectId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return {
        success: true,
        data: ProjectModel.fromApiResponse(response.data.data),
        message: response.data.message,
      };
    } catch (error) {
      console.error('Error updating project:', error);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  }

  async deleteProject(projectId, permanent = false) {
    try {
      const response = await api.delete(`/admin/projects/${projectId}`, {
        params: { permanent },
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Error deleting project:', error);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  }

  async uploadProjectMedia(projectId, files, mediaData = {}) {
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      Object.keys(mediaData).forEach(key => formData.append(key, mediaData[key]));

      const response = await api.post(`/admin/projects/${projectId}/media`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return { success: true, data: response.data.data, message: response.data.message };
    } catch (error) {
      console.error('Error uploading media:', error);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  }

  async deleteProjectMedia(mediaId) {
    try {
      const response = await api.delete(`/admin/projects/media/${mediaId}`);
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Error deleting media:', error);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  }

  async cloneProject(projectId, newTitle, createdBy) {
    try {
      const response = await api.post(`/admin/projects/${projectId}/clone`, {
        newTitle,
        createdBy,
      });
      return {
        success: true,
        data: ProjectModel.fromApiResponse(response.data.data),
        message: response.data.message,
      };
    } catch (error) {
      console.error('Error cloning project:', error);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  }

  async exportProject(projectId, format = 'json') {
    try {
      const response = await api.get(`/admin/projects/${projectId}/export`, {
        params: { format },
      });
      return { success: true, data: response.data, format };
    } catch (error) {
      console.error('Error exporting project:', error);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  }
}

export default new ProjectService();




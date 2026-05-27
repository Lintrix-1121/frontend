import useProjectStore from '../../stores/shared/projectStore';
import projectService from '../../services/shared/projectService';

class ProjectController {
  constructor() {
    console.log('🔧 ProjectController initialized');
  }

  // ============= PUBLIC VIEWS =============

  /**
   * Load projects for listing page
   */
  async loadProjectsPage(params = {}) {
    const store = useProjectStore.getState();
    await store.fetchProjects(params);
    return store.projects;
  }

  /**
   * Load single project detail page
   */
  async loadProjectDetailPage(identifier) {
    const store = useProjectStore.getState();
    const result = await store.fetchProject(identifier);
    
    if (result.success) {
      // Load related projects
      const relatedResult = await projectService.getRelatedProjects(
        result.data.projectId
      );
      
      return {
        project: result.data,
        relatedProjects: relatedResult.success ? relatedResult.data : []
      };
    }
    
    return null;
  }

  /**
   * Load homepage data
   */
  async loadHomePage() {
    const store = useProjectStore.getState();
    await store.fetchFeaturedProjects(6);
    await store.fetchProjectStats();
    
    return {
      featuredProjects: store.featuredProjects,
      stats: store.projectStats
    };
  }

  /**
   * Load category projects page
   */
  async loadCategoryPage(category, page = 1) {
    const result = await projectService.getProjectsByCategory(category, page);
    
    if (result.success) {
      return {
        projects: result.data,
        pagination: result.pagination
      };
    }
    
    return null;
  }

  /**
   * Search projects
   */
  async searchProjects(query, filters = {}, page = 1) {
    const result = await projectService.searchProjects(query, filters, page);
    
    if (result.success) {
      return {
        projects: result.data,
        pagination: result.pagination,
        query
      };
    }
    
    return null;
  }

  // ============= ADMIN VIEWS =============

  /**
   * Load admin dashboard data
   */
  async loadAdminDashboard() {
    const store = useProjectStore.getState();
    await store.fetchProjectStats();
    await store.fetchProjects({ limit: 5 });
    
    return {
      stats: store.projectStats,
      recentProjects: store.projects
    };
  }

  /**
   * Load admin projects list
   */
  async loadAdminProjectsList(params = {}) {
    const store = useProjectStore.getState();
    await store.fetchProjects({ ...params, limit: 10 });
    
    return {
      projects: store.projects,
      pagination: store.pagination
    };
  }

  /**
   * Load project form data for editing
   */
  async loadProjectForm(projectId = null) {
    const store = useProjectStore.getState();
    
    if (projectId) {
      const result = await store.fetchProject(projectId);
      return result.success ? result.data : null;
    }
    
    store.clearCurrentProject();
    return null;
  }

  /**
   * Handle project creation
   */
  async handleCreateProject(projectData, mediaFiles, navigate) {
    const store = useProjectStore.getState();
    
    // Add current user as creator
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    projectData.createdBy = user.userId;
    
    const result = await store.createProject(projectData, mediaFiles);
    
    if (result.success) {
      navigate('/admin/projects');
      return { success: true, message: result.message };
    }
    
    return { success: false, error: result.error };
  }

  /**
   * Handle project update
   */
  async handleUpdateProject(projectId, projectData, mediaFiles, navigate) {
    const store = useProjectStore.getState();
    
    // Add current user as updater
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    projectData.updatedBy = user.userId;
    
    const result = await store.updateProject(projectId, projectData, mediaFiles);
    
    if (result.success) {
      navigate('/admin/projects');
      return { success: true, message: result.message };
    }
    
    return { success: false, error: result.error };
  }

  /**
   * Handle project deletion
   */
  async handleDeleteProject(projectId, permanent = false) {
    const store = useProjectStore.getState();
    return await store.deleteProject(projectId, permanent);
  }

  /**
   * Handle media upload
   */
  async handleMediaUpload(projectId, files, mediaData = {}) {
    return await projectService.uploadProjectMedia(projectId, files, mediaData);
  }

  /**
   * Handle media deletion
   */
  async handleMediaDelete(mediaId) {
    return await projectService.deleteProjectMedia(mediaId);
  }

  /**
   * Handle project clone
   */
  async handleCloneProject(projectId, newTitle, navigate) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const result = await projectService.cloneProject(
      projectId,
      newTitle,
      user.userId
    );
    
    if (result.success) {
      navigate(`/admin/projects/edit/${result.data.projectId}`);
      return { success: true, data: result.data };
    }
    
    return { success: false, error: result.error };
  }

  /**
   * Handle project export
   */
  async handleExportProject(projectId, format = 'json') {
    const result = await projectService.exportProject(projectId, format);
    
    if (result.success) {
      if (format === 'csv') {
        // Download CSV file
        const blob = new Blob([result.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `project-${projectId}.csv`;
        a.click();
      } else {
        // Download JSON file
        const dataStr = JSON.stringify(result.data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `project-${projectId}.json`;
        a.click();
      }
      
      return { success: true };
    }
    
    return { success: false, error: result.error };
  }

  // ============= UTILITY METHODS =============

  /**
   * Get category options
   */
  getCategoryOptions() {
    return [
      { value: 'IoT', label: 'IoT' },
      { value: 'Electronics', label: 'Electronics' },
      { value: 'Mobile apps', label: 'Mobile Apps' },
      { value: 'Web apps', label: 'Web Apps' },
      { value: 'Installations', label: 'Installations' },
      { value: 'Networking', label: 'Networking' },
      { value: 'Embedded Systems', label: 'Embedded Systems' },
      { value: 'Software Development', label: 'Software Development' },
      { value: 'ICT Infrastructure', label: 'ICT Infrastructure' },
      { value: 'Security Systems', label: 'Security Systems' },
      { value: 'Cloud Computing', label: 'Cloud Computing' },
      { value: 'AI/ML', label: 'AI/ML' },
      { value: 'Blockchain', label: 'Blockchain' },
      { value: 'Robotics', label: 'Robotics' },
      { value: 'Telecommunications', label: 'Telecommunications' },
      { value: 'Data Center', label: 'Data Center' },
      { value: 'IT Consulting', label: 'IT Consulting' },
      { value: 'Hardware Design', label: 'Hardware Design' },
      { value: 'Firmware Development', label: 'Firmware Development' },
      { value: 'System Integration', label: 'System Integration' }
    ];
  }

  /**
   * Get status options
   */
  getStatusOptions() {
    return [
      { value: 'planned', label: 'Planned', color: 'blue' },
      { value: 'in-progress', label: 'In Progress', color: 'yellow' },
      { value: 'completed', label: 'Completed', color: 'green' },
      { value: 'on-hold', label: 'On Hold', color: 'orange' },
      { value: 'cancelled', label: 'Cancelled', color: 'red' },
      { value: 'maintenance', label: 'Maintenance', color: 'purple' }
    ];
  }

  /**
   * Get priority options
   */
  getPriorityOptions() {
    return [
      { value: 'low', label: 'Low', color: 'green' },
      { value: 'medium', label: 'Medium', color: 'yellow' },
      { value: 'high', label: 'High', color: 'orange' },
      { value: 'critical', label: 'Critical', color: 'red' }
    ];
  }
}

export default new ProjectController();


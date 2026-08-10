import useProjectStore from '../../stores/shared/projectStore';
import projectService from '../../services/shared/projectService';

class ProjectController {
  constructor() {
    console.log('📁 ProjectController initialized');
  }

  //PUBLIC VIEW HELPERS
  async loadProjectsPage(params = {}) {
    const store = useProjectStore.getState();
    await store.fetchProjects(params);
    return store.projects;
  }

  async loadProjectDetailPage(identifier) {
    const store = useProjectStore.getState();
    const result = await store.fetchProject(identifier);
    if (result.success) {
      await store.fetchRelatedProjects(result.data.projectId);
      await store.fetchProjectTimeline(result.data.projectId);
      return {
        project: result.data,
        relatedProjects: store.relatedProjects,
        timeline: store.timelineData,
      };
    }
    return null;
  }

  async loadHomePage() {
    const store = useProjectStore.getState();
    await store.fetchFeaturedProjects(6);
    await store.fetchProjectStats();
    return {
      featuredProjects: store.featuredProjects,
      stats: store.projectStats,
    };
  }

  async loadCategoryPage(category, page = 1) {
    const store = useProjectStore.getState();
    await store.fetchProjectsByCategory(category, page);
    return {
      projects: store.projects,
      pagination: store.pagination,
    };
  }

  async loadTechnologyPage(technology, limit = 10) {
    const store = useProjectStore.getState();
    await store.fetchProjectsByTechnology(technology, limit);
    return {
      projects: store.projects,
    };
  }

  async searchProjects(query, filters = {}, page = 1) {
    const store = useProjectStore.getState();
    await store.searchProjects(query, filters, page);
    return {
      projects: store.projects,
      pagination: store.pagination,
      query,
    };
  }

  //ADMIN VIEW HELPERS 
  async loadAdminDashboard() {
    const store = useProjectStore.getState();
    await store.fetchProjectStats();
    await store.fetchProjects({ limit: 5 });
    return {
      stats: store.projectStats,
      recentProjects: store.projects,
    };
  }

  async loadAdminProjectsList(params = {}) {
    const store = useProjectStore.getState();
    await store.fetchProjects({ ...params, limit: 10 });
    return {
      projects: store.projects,
      pagination: store.pagination,
    };
  }

  async loadProjectForm(projectId = null) {
    const store = useProjectStore.getState();
    if (projectId) {
      const result = await store.fetchProject(projectId);
      return result.success ? result.data : null;
    }
    store.clearCurrentProject();
    return null;
  }

  // CRUD OPERATIONS
  async handleCreateProject(projectData, mediaFiles, navigate) {
    const store = useProjectStore.getState();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    projectData.createdBy = user.userId;

    const result = await store.createProject(projectData, mediaFiles);
    if (result.success) {
      navigate('/admin/projects');
      return { success: true, message: result.message };
    }
    return { success: false, error: result.error };
  }

  async handleUpdateProject(projectId, projectData, mediaFiles, navigate) {
    const store = useProjectStore.getState();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    projectData.updatedBy = user.userId;

    const result = await store.updateProject(projectId, projectData, mediaFiles);
    if (result.success) {
      navigate('/admin/projects');
      return { success: true, message: result.message };
    }
    return { success: false, error: result.error };
  }

  async handleDeleteProject(projectId, permanent = false) {
    const store = useProjectStore.getState();
    return await store.deleteProject(projectId, permanent);
  }

  //MEDIA OPERATIONS
  async handleMediaUpload(projectId, files, mediaData = {}) {
    const store = useProjectStore.getState();
    return await store.uploadProjectMedia(projectId, files, mediaData);
  }

  async handleMediaDelete(mediaId) {
    const store = useProjectStore.getState();
    return await store.deleteProjectMedia(mediaId);
  }

  // CLONE & EXPORT
  async handleCloneProject(projectId, newTitle, navigate) {
    const store = useProjectStore.getState();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const result = await store.cloneProject(projectId, newTitle, user.userId);
    if (result.success) {
      navigate(`/admin/projects/edit/${result.data.projectId}`);
      return { success: true, data: result.data };
    }
    return { success: false, error: result.error };
  }

  async handleExportProject(projectId, format = 'json') {
    const store = useProjectStore.getState();
    const result = await store.exportProject(projectId, format);
    if (result.success) {
      this.downloadFile(result.data, format, projectId);
      return { success: true };
    }
    return { success: false, error: result.error };
  }

  downloadFile(data, format, projectId) {
    const mimeType = format === 'csv' ? 'text/csv' : 'application/json';
    const blob = new Blob(
      [format === 'csv' ? data : JSON.stringify(data, null, 2)],
      { type: mimeType }
    );
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-${projectId}.${format === 'csv' ? 'csv' : 'json'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  // UTILITY 
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
      { value: 'System Integration', label: 'System Integration' },
    ];
  }

  getStatusOptions() {
    return [
      { value: 'planned', label: 'Planned', color: 'blue' },
      { value: 'in-progress', label: 'In Progress', color: 'yellow' },
      { value: 'completed', label: 'Completed', color: 'green' },
      { value: 'on-hold', label: 'On Hold', color: 'orange' },
      { value: 'cancelled', label: 'Cancelled', color: 'red' },
      { value: 'maintenance', label: 'Maintenance', color: 'purple' },
    ];
  }

  getPriorityOptions() {
    return [
      { value: 'low', label: 'Low', color: 'green' },
      { value: 'medium', label: 'Medium', color: 'yellow' },
      { value: 'high', label: 'High', color: 'orange' },
      { value: 'critical', label: 'Critical', color: 'red' },
    ];
  }
}

export default new ProjectController();




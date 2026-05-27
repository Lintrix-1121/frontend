import { create } from 'zustand';
import projectService from '../../services/shared/projectService';

const useProjectStore = create((set, get) => ({
  // State
  projects: [],
  currentProject: null,
  featuredProjects: [],
  projectStats: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  },
  filters: {
    category: null,
    status: null,
    featured: null,
    search: null
  },

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Fetch all projects
  fetchProjects: async (params = {}) => {
    const store = get();
    set({ loading: true, error: null });
    
    const result = await projectService.getAllProjects({
      page: store.pagination.currentPage,
      limit: store.pagination.limit,
      ...store.filters,
      ...params
    });
    
    if (result.success) {
      set({
        projects: result.data,
        pagination: {
          ...store.pagination,
          total: result.total,
          totalPages: Math.ceil(result.total / store.pagination.limit)
        },
        loading: false
      });
    } else {
      set({ error: result.error, loading: false });
    }
  },

  // Fetch single project
  fetchProject: async (identifier) => {
    set({ loading: true, error: null });
    
    const result = await projectService.getProject(identifier);
    
    if (result.success) {
      set({ currentProject: result.data, loading: false });
    } else {
      set({ error: result.error, loading: false });
    }
    
    return result;
  },

  // Fetch featured projects
  fetchFeaturedProjects: async (limit = 6) => {
    set({ loading: true, error: null });
    
    const result = await projectService.getFeaturedProjects(limit);
    
    if (result.success) {
      set({ featuredProjects: result.data, loading: false });
    } else {
      set({ error: result.error, loading: false });
    }
  },

  // Fetch project stats
  fetchProjectStats: async () => {
    set({ loading: true, error: null });
    
    const result = await projectService.getProjectStats();
    
    if (result.success) {
      set({ projectStats: result.data, loading: false });
    } else {
      set({ error: result.error, loading: false });
    }
  },

  // Create project
  createProject: async (projectData, mediaFiles) => {
    set({ loading: true, error: null });
    
    const result = await projectService.createProject(projectData, mediaFiles);
    
    if (result.success) {
      // Refresh projects list
      await get().fetchProjects();
      set({ loading: false });
    } else {
      set({ error: result.error, loading: false });
    }
    
    return result;
  },

  // Update project
  updateProject: async (projectId, projectData, mediaFiles) => {
    set({ loading: true, error: null });
    
    const result = await projectService.updateProject(projectId, projectData, mediaFiles);
    
    if (result.success) {
      // Update current project if it's the one being edited
      if (get().currentProject?.projectId === projectId) {
        set({ currentProject: result.data });
      }
      await get().fetchProjects();
      set({ loading: false });
    } else {
      set({ error: result.error, loading: false });
    }
    
    return result;
  },

  // Delete project
  deleteProject: async (projectId, permanent = false) => {
    set({ loading: true, error: null });
    
    const result = await projectService.deleteProject(projectId, permanent);
    
    if (result.success) {
      await get().fetchProjects();
      set({ loading: false });
    } else {
      set({ error: result.error, loading: false });
    }
    
    return result;
  },

  // Set filters
  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
    get().fetchProjects();
  },

  // Set pagination
  setPage: (page) => {
    set({ pagination: { ...get().pagination, currentPage: page } });
    get().fetchProjects();
  },

  // Clear current project
  clearCurrentProject: () => set({ currentProject: null }),

  // Reset store
  reset: () => set({
    projects: [],
    currentProject: null,
    featuredProjects: [],
    projectStats: null,
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      total: 0,
      limit: 10
    },
    filters: {
      category: null,
      status: null,
      featured: null,
      search: null
    }
  })
}));

export default useProjectStore;


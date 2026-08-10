import { create } from 'zustand';
import projectService from '../../services/shared/projectService';

const useProjectStore = create((set, get) => ({
  // ---------- State ----------
  projects: [],
  currentProject: null,
  featuredProjects: [],
  relatedProjects: [],
  timelineData: null,
  projectStats: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  },
  filters: {
    category: null,
    status: null,
    featured: null,
    search: null,
  },

  // ---------- Actions ----------
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),

  // ---- Fetch all projects (with filters/pagination) ----
  fetchProjects: async (params = {}) => {
    const store = get();
    set({ loading: true, error: null });
    const result = await projectService.getAllProjects({
      page: store.pagination.currentPage,
      limit: store.pagination.limit,
      ...store.filters,
      ...params,
    });
    if (result.success) {
      set({
        projects: result.data,
        pagination: {
          ...store.pagination,
          total: result.total,
          totalPages: Math.ceil(result.total / store.pagination.limit),
        },
        loading: false,
      });
    } else {
      set({ error: result.error, loading: false });
    }
  },

  // ---- Fetch single project ----
  fetchProject: async identifier => {
    set({ loading: true, error: null });
    const result = await projectService.getProject(identifier);
    if (result.success) {
      set({ currentProject: result.data, loading: false });
    } else {
      set({ error: result.error, loading: false });
    }
    return result;
  },

  // ---- Fetch featured projects ----
  fetchFeaturedProjects: async (limit = 6) => {
    set({ loading: true, error: null });
    const result = await projectService.getFeaturedProjects(limit);
    if (result.success) {
      set({ featuredProjects: result.data, loading: false });
    } else {
      set({ error: result.error, loading: false });
    }
  },

  // ---- Fetch projects by category ----
  fetchProjectsByCategory: async (category, page = 1, limit = 10) => {
    set({ loading: true, error: null });
    const result = await projectService.getProjectsByCategory(category, page, limit);
    if (result.success) {
      set({
        projects: result.data,
        pagination: {
          currentPage: result.pagination.currentPage,
          totalPages: result.pagination.totalPages,
          total: result.pagination.total,
          limit,
        },
        loading: false,
      });
    } else {
      set({ error: result.error, loading: false });
    }
  },

  // ---- Fetch projects by technology ----
  fetchProjectsByTechnology: async (technology, limit = 10) => {
    set({ loading: true, error: null });
    const result = await projectService.getProjectsByTechnology(technology, limit);
    if (result.success) {
      set({ projects: result.data, loading: false });
    } else {
      set({ error: result.error, loading: false });
    }
  },

  // ---- Search projects ----
  searchProjects: async (query, filters = {}, page = 1, limit = 10) => {
    set({ loading: true, error: null });
    const result = await projectService.searchProjects(query, filters, page, limit);
    if (result.success) {
      set({
        projects: result.data,
        pagination: {
          currentPage: result.pagination.currentPage,
          totalPages: result.pagination.totalPages,
          total: result.pagination.total,
          limit,
        },
        loading: false,
      });
    } else {
      set({ error: result.error, loading: false });
    }
  },

  // ---- Fetch project statistics ----
  fetchProjectStats: async () => {
    set({ loading: true, error: null });
    const result = await projectService.getProjectStats();
    if (result.success) {
      set({ projectStats: result.data, loading: false });
    } else {
      set({ error: result.error, loading: false });
    }
  },

  // ---- Fetch related projects ----
  fetchRelatedProjects: async (projectId, limit = 4) => {
    set({ loading: true, error: null });
    const result = await projectService.getRelatedProjects(projectId, limit);
    if (result.success) {
      set({ relatedProjects: result.data, loading: false });
    } else {
      set({ error: result.error, loading: false });
    }
  },

  // ---- Fetch project timeline ----
  fetchProjectTimeline: async projectId => {
    set({ loading: true, error: null });
    const result = await projectService.getProjectTimeline(projectId);
    if (result.success) {
      set({ timelineData: result.data, loading: false });
    } else {
      set({ error: result.error, loading: false });
    }
  },

  // ---- CRUD operations ----
  createProject: async (projectData, mediaFiles) => {
    set({ loading: true, error: null });
    const result = await projectService.createProject(projectData, mediaFiles);
    if (result.success) {
      await get().fetchProjects();
      set({ loading: false });
    } else {
      set({ error: result.error, loading: false });
    }
    return result;
  },

  updateProject: async (projectId, projectData, mediaFiles) => {
    set({ loading: true, error: null });
    const result = await projectService.updateProject(projectId, projectData, mediaFiles);
    if (result.success) {
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

  // ---- Media operations ----
  uploadProjectMedia: async (projectId, files, mediaData = {}) => {
    set({ loading: true, error: null });
    const result = await projectService.uploadProjectMedia(projectId, files, mediaData);
    if (result.success) {
      // Refresh the current project to reflect new media
      if (get().currentProject?.projectId === projectId) {
        await get().fetchProject(projectId);
      }
      set({ loading: false });
    } else {
      set({ error: result.error, loading: false });
    }
    return result;
  },

  deleteProjectMedia: async mediaId => {
    set({ loading: true, error: null });
    const result = await projectService.deleteProjectMedia(mediaId);
    if (result.success) {
      // Refresh current project if it contains the media (hard to know, so refresh if current)
      const current = get().currentProject;
      if (current) {
        await get().fetchProject(current.projectId);
      }
      set({ loading: false });
    } else {
      set({ error: result.error, loading: false });
    }
    return result;
  },

  // ---- Clone & Export ----
  cloneProject: async (projectId, newTitle, createdBy) => {
    set({ loading: true, error: null });
    const result = await projectService.cloneProject(projectId, newTitle, createdBy);
    if (result.success) {
      await get().fetchProjects();
      set({ loading: false });
    } else {
      set({ error: result.error, loading: false });
    }
    return result;
  },

  exportProject: async (projectId, format = 'json') => {
    set({ loading: true, error: null });
    const result = await projectService.exportProject(projectId, format);
    set({ loading: false });
    return result;
  },

  // ---- Filter & pagination controls ----
  setFilters: filters => {
    set({ filters: { ...get().filters, ...filters } });
    get().fetchProjects();
  },

  setPage: page => {
    set({ pagination: { ...get().pagination, currentPage: page } });
    get().fetchProjects();
  },

  // ---- Reset / clear ----
  clearCurrentProject: () => set({ currentProject: null }),
  clearRelatedProjects: () => set({ relatedProjects: [] }),
  clearTimeline: () => set({ timelineData: null }),

  reset: () =>
    set({
      projects: [],
      currentProject: null,
      featuredProjects: [],
      relatedProjects: [],
      timelineData: null,
      projectStats: null,
      loading: false,
      error: null,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        total: 0,
        limit: 10,
      },
      filters: {
        category: null,
        status: null,
        featured: null,
        search: null,
      },
    }),
}));

export default useProjectStore;


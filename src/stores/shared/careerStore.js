import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import CareerController from '../../controllers/shared/careerController';

const useCareerStore = create(
  persist(
    (set, get) => ({
      // State
      jobs: [],
      currentJob: null,
      applications: [],
      currentApplication: null,
      myApplications: [],
      dashboardData: null,
      stats: null,
      loading: false,
      error: null,
      searchQuery: '',
      filters: {
        department: '',
        location: '',
        employmentType: '',
        experienceLevel: '',
        isRemote: null,
        isActive: true
      },
      
      // Actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
      clearFilters: () => set({ 
        filters: {
          department: '',
          location: '',
          employmentType: '',
          experienceLevel: '',
          isRemote: null,
          isActive: true
        }
      }),

      // Fetch all jobs
      fetchJobs: async (customFilters = {}) => {
        set({ loading: true, error: null });
        try {
          console.log('🏪 [STORE] Fetching jobs with filters:', customFilters);
          
          // Get current filters from state
          const currentFilters = get().filters;
          
          // Merge filters
          const filters = { 
            ...currentFilters, 
            ...customFilters,
            isActive: true // Default to active jobs
          };
          
          // Remove empty filters
          Object.keys(filters).forEach(key => {
            if (filters[key] === '' || filters[key] === null || filters[key] === undefined) {
              delete filters[key];
            }
          });
          
          console.log('🏪 [STORE] Final filters:', filters);
          
          // USE THE CONTROLLER HERE
          const result = await CareerController.fetchJobs(filters);
          
          if (result.success) {
            console.log('✅ [STORE] Jobs fetched successfully:', result.data?.length || 0);
            set({ 
              jobs: result.data || [], 
              loading: false,
              error: null
            });
            return result;
          } else {
            console.error('❌ [STORE] Failed to fetch jobs:', result.error);
            set({ 
              error: result.error || 'Failed to fetch jobs', 
              loading: false,
              jobs: []
            });
            return result;
          }
        } catch (error) {
          console.error('❌ [STORE] Error in fetchJobs:', error);
          set({ 
            error: error.message || 'Failed to fetch jobs', 
            loading: false,
            jobs: []
          });
          return { success: false, error: error.message };
        }
      },


      fetchJob: async (jobIdOrSlug) => {
        set({ loading: true, error: null, currentJob: null });
        try {
          console.log('🏪 [STORE] Fetching job:', jobIdOrSlug);
          console.log('🏪 [STORE] Type of identifier:', typeof jobIdOrSlug);
          
          const result = await CareerController.fetchJob(jobIdOrSlug);
          
          console.log('🏪 [STORE] Controller result:', {
            success: result.success,
            error: result.error,
            hasData: !!result.data,
            dataTitle: result.data?.title
          });
          
          if (result.success && result.data) {
            console.log('✅ [STORE] Setting currentJob:', result.data.title);
            set({ 
              currentJob: result.data, 
              loading: false,
              error: null 
            });
            return { success: true, data: result.data };
          } else {
            console.error('❌ [STORE] Failed to fetch job:', result.error);
            set({ 
              error: result.error || 'Job not found', 
              loading: false,
              currentJob: null 
            });
            return result;
          }
        } catch (error) {
          console.error('❌ [STORE] Error in fetchJob:', error);
          set({ 
            error: error.message || 'Failed to fetch job', 
            loading: false,
            currentJob: null 
          });
          return { success: false, error: error.message };
        }
      },

      
      // fetchJob: async (jobIdOrSlug) => {
      //   set({ loading: true, error: null, currentJob: null });
      //   try {
      //     console.log('🏪 [STORE] Fetching job:', jobIdOrSlug);
          
      //     const result = await CareerController.fetchJob(jobIdOrSlug);
          
      //     console.log('🏪 [STORE] Controller result:', {
      //       success: result.success,
      //       hasData: !!result.data,
      //       dataTitle: result.data?.title,
      //       requirementsType: result.data?.requirements ? typeof result.data.requirements : 'none',
      //       requirements: result.data?.requirements
      //     });
          
      //     if (result.success && result.data) {
      //       console.log('✅ [STORE] Setting currentJob:', result.data.title);
      //       set({ 
      //         currentJob: result.data, 
      //         loading: false,
      //         error: null 
      //       });
      //       return { success: true, data: result.data };
      //     } else {
      //       console.error('❌ [STORE] Failed to fetch job:', result.error);
      //       set({ 
      //         error: result.error || 'Job not found', 
      //         loading: false,
      //         currentJob: null 
      //       });
      //       return result;
      //     }
      //   } catch (error) {
      //     console.error('❌ [STORE] Error in fetchJob:', error);
      //     set({ 
      //       error: error.message || 'Failed to fetch job', 
      //       loading: false,
      //       currentJob: null 
      //     });
      //     return { success: false, error: error.message };
      //   }
      // },
  
      // Create job
      createJob: async (jobData) => {
        set({ loading: true, error: null });
        
        try {
          console.log('🏪 [STORE] Creating job:', jobData.title);
          const result = await CareerController.createJob(jobData);
          
          if (result.success) {
            console.log('✅ [STORE] Job created successfully:', result.data);
            set((state) => ({
              jobs: [...state.jobs, result.data],
              loading: false,
              error: null
            }));
            
            // Refresh jobs list
            await get().fetchJobs();
          } else {
            console.error('❌ [STORE] Controller returned error:', result.error);
            set({ error: result.error, loading: false });
          }
          
          return result;
        } catch (error) {
          console.error('❌ [STORE] Error in createJob:', error);
          set({ 
            error: error.message || 'Failed to create job', 
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },
      
      // Update job
      updateJob: async (jobId, jobData) => {
        if (!jobId) {
          console.error('❌ [STORE] No jobId provided to updateJob');
          set({ error: 'Job ID is required', loading: false });
          return { success: false, error: 'Job ID is required' };
        }
        
        set({ loading: true, error: null });
        
        try {
          console.log('🏪 [STORE] Updating job ID:', jobId);
          const result = await CareerController.updateJob(jobId, jobData);
          
          if (result.success) {
            console.log('✅ [STORE] Job updated successfully:', result.data);
            set((state) => ({
              jobs: state.jobs.map(job => 
                job.id === jobId ? result.data : job
              ),
              currentJob: state.currentJob?.id === jobId ? result.data : state.currentJob,
              loading: false,
              error: null
            }));
            
            // Refresh the current job
            await get().fetchJob(jobId);
          } else {
            console.error('❌ [STORE] Controller returned error:', result.error);
            set({ error: result.error, loading: false });
          }
          
          return result;
        } catch (error) {
          console.error('❌ [STORE] Error in updateJob:', error);
          set({ 
            error: error.message || 'Failed to update job', 
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },
      
      // Delete job
      deleteJob: async (jobId) => {
        if (!jobId) {
          console.error('❌ [STORE] No jobId provided to deleteJob');
          set({ error: 'Job ID is required', loading: false });
          return { success: false, error: 'Job ID is required' };
        }
        
        set({ loading: true, error: null });
        
        try {
          console.log('🗑️ [STORE] Deleting job ID:', jobId);
          const result = await CareerController.deleteJob(jobId);
          
          if (result.success) {
            console.log('✅ [STORE] Job deleted successfully');
            set((state) => ({
              jobs: state.jobs.filter(job => job.id !== jobId),
              currentJob: state.currentJob?.id === jobId ? null : state.currentJob,
              loading: false,
              error: null
            }));
          } else {
            console.error('❌ [STORE] Controller returned error:', result.error);
            set({ error: result.error, loading: false });
          }
          
          return result;
        } catch (error) {
          console.error('❌ [STORE] Error in deleteJob:', error);
          set({ 
            error: error.message || 'Failed to delete job', 
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },
      
      // Apply for job
      applyForJob: async (applicationData, resumeFile) => {
        set({ loading: true, error: null });
        
        try {
          console.log('📝 [STORE] Applying for job:', applicationData.CareerJobId);
          const result = await CareerController.applyForJob(applicationData, resumeFile);
          
          if (result.success) {
            console.log('✅ [STORE] Application submitted successfully:', result.data);
            set((state) => ({
              myApplications: [...state.myApplications, result.data],
              loading: false,
              error: null
            }));
          } else {
            console.error('❌ [STORE] Controller returned error:', result.error);
            set({ error: result.error, loading: false });
          }
          
          return result;
        } catch (error) {
          console.error('❌ [STORE] Error in applyForJob:', error);
          set({ 
            error: error.message || 'Failed to submit application', 
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },
      
      // Fetch applications
      fetchApplications: async (customFilters = {}) => {
        set({ loading: true, error: null });
        try {
          const result = await CareerController.fetchApplications(customFilters);
          
          if (result.success) {
            set({ applications: result.data, loading: false });
          } else {
            set({ error: result.error, loading: false });
          }
          
          return result;
        } catch (error) {
          console.error('❌ [STORE] Error in fetchApplications:', error);
          set({ 
            error: error.message || 'Failed to fetch applications', 
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },
      
      // Fetch single application
      fetchApplication: async (applicationId) => {
        if (!applicationId) {
          console.error('❌ [STORE] No applicationId provided');
          set({ error: 'Application ID is required', loading: false });
          return { success: false, error: 'Application ID is required' };
        }
        
        set({ loading: true, error: null });
        try {
          console.log('🔍 [STORE] Fetching application ID:', applicationId);
          const result = await CareerController.fetchApplication(applicationId);
          
          if (result.success) {
            console.log('✅ [STORE] Application fetched:', result.data);
            set({ currentApplication: result.data, loading: false });
          } else {
            console.error('❌ [STORE] Failed to fetch application:', result.error);
            set({ error: result.error, loading: false });
          }
          
          return result;
        } catch (error) {
          console.error('❌ [STORE] Error in fetchApplication:', error);
          set({ 
            error: error.message || 'Failed to fetch application', 
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },
      
      // Update application status
      updateApplicationStatus: async (applicationId, status, notes) => {
        set({ loading: true, error: null });
        
        try {
          console.log('✏️ [STORE] Updating application status:', { applicationId, status, notes });
          const result = await CareerController.updateApplicationStatus(applicationId, status, notes);
          
          if (result.success) {
            console.log('✅ [STORE] Application status updated successfully');
            set((state) => ({
              applications: state.applications.map(app => 
                app.id === applicationId ? result.data : app
              ),
              currentApplication: state.currentApplication?.id === applicationId ? result.data : state.currentApplication,
              loading: false,
              error: null
            }));
            
            // Refresh the current application
            await get().fetchApplication(applicationId);
          } else {
            console.error('❌ [STORE] Controller returned error:', result.error);
            set({ error: result.error, loading: false });
          }
          
          return result;
        } catch (error) {
          console.error('❌ [STORE] Error in updateApplicationStatus:', error);
          set({ 
            error: error.message || 'Failed to update application status', 
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },
      
      // Fetch applications by job
      fetchApplicationsByJob: async (jobId) => {
        if (!jobId) {
          console.error('❌ [STORE] No jobId provided');
          set({ error: 'Job ID is required', loading: false });
          return { success: false, error: 'Job ID is required' };
        }
        
        set({ loading: true, error: null });
        try {
          console.log('🔍 [STORE] Fetching applications for job:', jobId);
          const result = await CareerController.fetchApplicationsByJob(jobId);
          
          if (result.success) {
            console.log('✅ [STORE] Applications fetched:', result.data.length);
            set({ applications: result.data, loading: false });
          } else {
            console.error('❌ [STORE] Failed to fetch applications:', result.error);
            set({ error: result.error, loading: false });
          }
          
          return result;
        } catch (error) {
          console.error('❌ [STORE] Error in fetchApplicationsByJob:', error);
          set({ 
            error: error.message || 'Failed to fetch applications by job', 
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },
      
      // Fetch my applications
      fetchMyApplications: async (email) => {
        set({ loading: true, error: null });
        try {
          console.log('🔍 [STORE] Fetching my applications for email:', email);
          const result = await CareerController.fetchMyApplications(email);
          
          if (result.success) {
            console.log('✅ [STORE] My applications fetched:', result.data.length);
            set({ myApplications: result.data, loading: false });
          } else {
            console.error('❌ [STORE] Failed to fetch my applications:', result.error);
            set({ error: result.error, loading: false });
          }
          
          return result;
        } catch (error) {
          console.error('❌ [STORE] Error in fetchMyApplications:', error);
          set({ 
            error: error.message || 'Failed to fetch your applications', 
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },

      // Fetch career stats
      fetchCareerStats: async () => {
        set({ loading: true, error: null });
          try {
            console.log('🏪 [STORE] Fetching career stats');
            
            const result = await CareerController.fetchCareerStats();
            
            if (result.success) {
              console.log('✅ [STORE] Stats fetched successfully:', result.data);
              set({ 
                stats: result.data, 
                loading: false,
                error: null
              });
              return result;
            } else {
              console.error('❌ [STORE] Failed to fetch stats:', result.error);
              set({ 
                error: result.error || 'Failed to fetch stats', 
                loading: false,
                stats: null
              });
              return result;
            }
          } catch (error) {
            console.error('❌ [STORE] Error in fetchCareerStats:', error);
            set({ 
              error: error.message || 'Failed to fetch stats', 
              loading: false,
              stats: null
            });
            return { success: false, error: error.message };
          }
        },

      // Fetch dashboard data
      fetchDashboardData: async () => {
        set({ loading: true, error: null });
        try {
          console.log('📊 [STORE] Fetching dashboard data');
          const result = await CareerController.fetchDashboardData();
          
          if (result.success) {
            console.log('✅ [STORE] Dashboard data fetched');
            set({ dashboardData: result.data, loading: false });
          } else {
            console.error('❌ [STORE] Failed to fetch dashboard data:', result.error);
            set({ error: result.error, loading: false });
          }
          
          return result;
        } catch (error) {
          console.error('❌ [STORE] Error in fetchDashboardData:', error);
          set({ 
            error: error.message || 'Failed to fetch dashboard data', 
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },
      
      // Search jobs
      searchJobs: async (query, customFilters = {}) => {
        set({ loading: true, error: null });
        try {
          const filters = { ...get().filters, ...customFilters };
          const result = await CareerController.searchJobs(query, filters);
          
          if (result.success) {
            set({ jobs: result.data, loading: false });
          } else {
            set({ error: result.error, loading: false });
          }
          
          return result;
        } catch (error) {
          console.error('❌ [STORE] Error in searchJobs:', error);
          set({ 
            error: error.message || 'Failed to search jobs', 
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },
      
      // Clear current job
      clearCurrentJob: () => {
        console.log('🧹 [STORE] Clearing current job');
        set({ currentJob: null });
      },
      
      // Clear current application
      clearCurrentApplication: () => {
        console.log('🧹 [STORE] Clearing current application');
        set({ currentApplication: null });
      },
      
      // Clear error
      clearError: () => set({ error: null }),
      



      getFilteredJobs: () => {
        const state = get();
        
        console.log('🔍 [STORE] getFilteredJobs called with:', {
          jobsLength: state.jobs?.length,
          jobs: state.jobs,
          searchQuery: state.searchQuery,
          filters: state.filters
        });

        // If no jobs, return empty array
        if (!state.jobs || !Array.isArray(state.jobs) || state.jobs.length === 0) {
          console.log('⚠️ [STORE] No jobs to filter');
          return [];
        }

        // Start with all jobs
        let filtered = [...state.jobs];
        console.log('📊 [STORE] Starting with', filtered.length, 'jobs');

        // Apply search query (if it exists and is not empty)
        if (state.searchQuery && state.searchQuery.trim() !== '') {
          const query = state.searchQuery.toLowerCase().trim();
          filtered = filtered.filter(job => {
            const titleMatch = job.title?.toLowerCase().includes(query) || false;
            const deptMatch = job.department?.toLowerCase().includes(query) || false;
            const locMatch = job.location?.toLowerCase().includes(query) || false;
            return titleMatch || deptMatch || locMatch;
          });
          console.log('🔍 After search filter:', filtered.length);
        }

        // Apply department filter (only if it has a value)
        if (state.filters.department && state.filters.department.trim() !== '') {
          filtered = filtered.filter(job => 
            job.department === state.filters.department
          );
          console.log('🏢 After department filter:', filtered.length);
        }

        // Apply location filter (only if it has a value)
        if (state.filters.location && state.filters.location.trim() !== '') {
          filtered = filtered.filter(job => 
            job.location === state.filters.location
          );
          console.log('📍 After location filter:', filtered.length);
        }

        // Apply employment type filter (only if it has a value)
        if (state.filters.employmentType && state.filters.employmentType.trim() !== '') {
          filtered = filtered.filter(job => 
            job.employmentType === state.filters.employmentType
          );
          console.log('💼 After employment type filter:', filtered.length);
        }

        // Apply experience level filter (only if it has a value)
        if (state.filters.experienceLevel && state.filters.experienceLevel.trim() !== '') {
          filtered = filtered.filter(job => 
            job.experienceLevel === state.filters.experienceLevel
          );
          console.log('📈 After experience level filter:', filtered.length);
        }

        // Apply remote filter (only if explicitly true)
        if (state.filters.isRemote === true) {
          filtered = filtered.filter(job => job.isRemote === true);
          console.log('🏠 After remote filter:', filtered.length);
        }

        // Apply active filter (only if explicitly set)
        // IMPORTANT: If isActive is undefined or null, don't filter
        if (state.filters.isActive !== undefined && state.filters.isActive !== null) {
          filtered = filtered.filter(job => job.isActive === state.filters.isActive);
          console.log('✅ After active filter:', filtered.length);
        }

        console.log('✅ [STORE] Final filtered jobs:', filtered.length);
        return filtered;
      },
     
      // Get active jobs only
      getActiveJobs: () => {
        const { jobs } = get();
        return jobs.filter(job => job.isActive);
      },
      
      // Get remote jobs
      getRemoteJobs: () => {
        const { jobs } = get();
        return jobs.filter(job => job.isRemote);
      },
      
      // Get featured jobs (most viewed or most applications)
      getFeaturedJobs: () => {
        const { jobs } = get();
        return [...jobs]
          .filter(job => job.isActive)
          .sort((a, b) => b.viewsCount - a.viewsCount)
          .slice(0, 5);
      },
      
      // Get urgent jobs (deadline approaching)
      getUrgentJobs: () => {
        const { jobs } = get();
        return jobs
          .filter(job => job.isActive && job.daysRemaining && job.daysRemaining <= 7)
          .sort((a, b) => a.daysRemaining - b.daysRemaining);
      },
      
      // Find job by ID
      getJobById: (jobId) => {
        const { jobs } = get();
        return jobs.find(job => job.id === jobId);
      },
      
      // Find application by ID
      getApplicationById: (applicationId) => {
        const { applications } = get();
        return applications.find(app => app.id === applicationId);
      },
      
      // Get applications by status
      getApplicationsByStatus: (status) => {
        const { applications } = get();
        return applications.filter(app => app.status === status);
      },
      
      // Get job statistics
      getJobStatistics: () => {
        const { jobs } = get();
        return {
          totalJobs: jobs.length,
          activeJobs: jobs.filter(job => job.isActive).length,
          remoteJobs: jobs.filter(job => job.isRemote).length,
          departments: [...new Set(jobs.map(job => job.department))],
          locations: [...new Set(jobs.map(job => job.location))]
        };
      },
      
      // Clear all data (for debugging)
      clearStore: () => {
        console.log('🧹 [STORE] Clearing all career data');
        set({ 
          jobs: [],
          currentJob: null,
          applications: [],
          currentApplication: null,
          myApplications: [],
          dashboardData: null,
          stats: null,
          loading: false,
          error: null,
          searchQuery: '',
          filters: {
            department: '',
            location: '',
            employmentType: '',
            experienceLevel: '',
            isRemote: null,
            isActive: true
          }
        });
      }
    }),
    {
      name: 'career-storage',
      partialize: (state) => ({ 
        jobs: state.jobs,
        currentJob: state.currentJob,
        myApplications: state.myApplications,
        filters: state.filters
      }),
      onRehydrateStorage: () => {
        console.log('🔄 [STORE] Career storage rehydrated');
        return (state) => {
          if (state) {
            console.log('📦 [STORE] Career data loaded from storage:', {
              jobsCount: state.jobs?.length || 0,
              myApplicationsCount: state.myApplications?.length || 0
            });
          }
        };
      }
    }
  )
);

export default useCareerStore;



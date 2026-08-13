import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import employeeController from '../controllers/shared/employeeController';

const useEmployeeStore = create(
  persist(
    (set, get) => ({
      // State
      employees: [],
      currentEmployee: null,
      loading: false,
      error: null,
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
      filters: {
        search: '',
        status: '',
      },

      // Actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      fetchEmployees: async (params = {}) => {
        set({ loading: true, error: null });
        const mergedParams = { ...get().filters, ...params };
        const result = await employeeController.fetchAll(mergedParams);
        if (result.success) {
          set({
            employees: result.data,
            pagination: {
              page: result.page,
              limit: result.limit,
              total: result.total,
              totalPages: result.totalPages,
            },
            loading: false,
            error: null,
          });
        } else {
          set({ loading: false, error: result.error });
        }
      },

      fetchEmployee: async (id) => {
        set({ loading: true, error: null });
        const result = await employeeController.fetchById(id);
        if (result.success) {
          set({ currentEmployee: result.data, loading: false });
        } else {
          set({ loading: false, error: result.error });
        }
        return result;
      },

      createEmployee: async (data) => {
        set({ loading: true, error: null });
        const result = await employeeController.create(data);
        if (result.success) {
          // Refresh the list after creation
          await get().fetchEmployees();
          set({ loading: false });
        } else {
          set({ loading: false, error: result.error });
        }
        return result;
      },

      updateEmployee: async (id, data) => {
        set({ loading: true, error: null });
        const result = await employeeController.update(id, data);
        if (result.success) {
          // Update currentEmployee if match
          const current = get().currentEmployee;
          if (current && current.id === id) {
            set({ currentEmployee: result.data });
          }
          // Refresh list
          await get().fetchEmployees();
          set({ loading: false });
        } else {
          set({ loading: false, error: result.error });
        }
        return result;
      },

      deleteEmployee: async (id) => {
        set({ loading: true, error: null });
        const result = await employeeController.delete(id);
        if (result.success) {
          await get().fetchEmployees();
          set({ loading: false });
        } else {
          set({ loading: false, error: result.error });
        }
        return result;
      },

      uploadProfilePicture: async (id, file) => {
        set({ loading: true, error: null });
        const result = await employeeController.uploadProfilePicture(id, file);
        if (result.success) {
          // Update currentEmployee and list
          const current = get().currentEmployee;
          if (current && current.id === id) {
            set({ currentEmployee: result.data });
          }
          // Update in employees list
          const updatedEmployees = get().employees.map(emp =>
            emp.id === id ? result.data : emp
          );
          set({ employees: updatedEmployees, loading: false });
        } else {
          set({ loading: false, error: result.error });
        }
        return result;
      },

      updateEmployeeStatus: async (id, status) => {
        set({ loading: true, error: null });
        const result = await employeeController.updateStatus(id, status);
        if (result.success) {
          // Update currentEmployee and list
          const current = get().currentEmployee;
          if (current && current.id === id) {
            set({ currentEmployee: result.data });
          }
          const updatedEmployees = get().employees.map(emp =>
            emp.id === id ? result.data : emp
          );
          set({ employees: updatedEmployees, loading: false });
        } else {
          set({ loading: false, error: result.error });
        }
        return result;
      },

      // Clear current employee
      clearCurrentEmployee: () => set({ currentEmployee: null }),

      // Update filters
      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }));
        // Auto-fetch when filters change 
        get().fetchEmployees();
      },

      // Reset state
      reset: () =>
        set({
          employees: [],
          currentEmployee: null,
          loading: false,
          error: null,
          pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
          filters: { search: '', status: '' },
        }),
    }),
    {
      name: 'employee-storage', // unique name for localStorage
      partialize: (state) => ({
        // persist only filters and pagination
        filters: state.filters,
        pagination: state.pagination,
      }),
    }
  )
);

export default useEmployeeStore;
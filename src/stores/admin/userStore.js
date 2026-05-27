// store/userStore.js
import { create } from 'zustand';
import AdminCustomerAPI from '../../services/admin/UserService';
import AdminCustomerModel from '../../models/admin/AdminCustomerModel';

const api = new AdminCustomerAPI();

const useUserStore = create((set, get) => ({
  // State
  customers: [],
  selectedCustomer: null,
  customerOrders: [],
  customerActivity: [],
  stats: null,
  analytics: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  },
  filters: {
    search: '',
    isActive: null,
    provider: null,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
    startDate: null,
    endDate: null,
    minSpent: null,
    maxSpent: null
  },
  selectedCustomers: [],
  exportLoading: false,

  // Actions
  fetchCustomers: async (page = 1) => {
    const state = get();
    set({ loading: true, error: null });
    
    try {
      const response = await api.getCustomers({
        page,
        limit: state.pagination.limit,
        ...state.filters
      });

      const customerModels = AdminCustomerModel.fromArray(response.data.customers);
      
      set({
        customers: customerModels,
        pagination: response.data.pagination,
        loading: false
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch customers',
        loading: false
      });
    }
  },

  fetchCustomerById: async (customerId) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.getCustomerById(customerId);
      const customerModel = AdminCustomerModel.fromApi(response.data);
      
      set({
        selectedCustomer: customerModel,
        loading: false
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch customer',
        loading: false
      });
    }
  },

  fetchCustomerOrders: async (customerId, page = 1) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.getCustomerOrders(customerId, {
        page,
        limit: 10
      });
      
      set({
        customerOrders: response.data.orders,
        loading: false
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch orders',
        loading: false
      });
    }
  },

  fetchCustomerActivity: async (customerId) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.getCustomerActivity(customerId);
      
      set({
        customerActivity: response.data.activities,
        loading: false
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch activity',
        loading: false
      });
    }
  },

  fetchStats: async () => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.getUserStats();
      
      set({
        stats: response.data,
        loading: false
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch stats',
        loading: false
      });
    }
  },

  fetchAnalytics: async (params = {}) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.getCustomerAnalytics(params);
      
      set({
        analytics: response.data,
        loading: false
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch analytics',
        loading: false
      });
    }
  },

  createCustomer: async (customerData) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.createCustomer(customerData);
      const newCustomer = AdminCustomerModel.fromApi(response.data);
      
      set((state) => ({
        customers: [newCustomer, ...state.customers],
        pagination: {
          ...state.pagination,
          total: state.pagination.total + 1
        },
        loading: false
      }));
      
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to create customer',
        loading: false
      });
      throw error;
    }
  },

  updateCustomer: async (customerId, customerData) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.updateCustomer(customerId, customerData);
      const updatedCustomer = AdminCustomerModel.fromApi(response.data);
      
      set((state) => ({
        customers: state.customers.map(c => 
          c.id === customerId ? updatedCustomer : c
        ),
        selectedCustomer: updatedCustomer,
        loading: false
      }));
      
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update customer',
        loading: false
      });
      throw error;
    }
  },

  deleteCustomer: async (customerId) => {
    set({ loading: true, error: null });
    
    try {
      await api.deleteCustomer(customerId);
      
      set((state) => ({
        customers: state.customers.filter(c => c.id !== customerId),
        selectedCustomers: state.selectedCustomers.filter(id => id !== customerId),
        pagination: {
          ...state.pagination,
          total: state.pagination.total - 1
        },
        loading: false
      }));
      
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete customer',
        loading: false
      });
      throw error;
    }
  },

  toggleUserStatus: async (userId) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.toggleUserStatus(userId);
      
      set((state) => ({
        customers: state.customers.map(c => 
          c.id === userId ? { ...c, isActive: response.data.isActive } : c
        ),
        selectedCustomer: state.selectedCustomer?.id === userId 
          ? { ...state.selectedCustomer, isActive: response.data.isActive }
          : state.selectedCustomer,
        loading: false
      }));
      
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to toggle status',
        loading: false
      });
      throw error;
    }
  },

  updateUserRole: async (userId, role) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.updateUserRole(userId, role);
      
      set((state) => ({
        customers: state.customers.map(c => 
          c.id === userId ? { ...c, role: response.data.role } : c
        ),
        selectedCustomer: state.selectedCustomer?.id === userId 
          ? { ...state.selectedCustomer, role: response.data.role }
          : state.selectedCustomer,
        loading: false
      }));
      
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update role',
        loading: false
      });
      throw error;
    }
  },

  sendCustomerEmail: async (customerId, emailData) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.sendCustomerEmail(customerId, emailData);
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to send email',
        loading: false
      });
      throw error;
    }
  },

  bulkUpdateCustomers: async (operation, data) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.bulkUpdateCustomers(operation, data);
      await get().fetchCustomers(get().pagination.page);
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Bulk operation failed',
        loading: false
      });
      throw error;
    }
  },

  exportCustomers: async (params = {}) => {
    set({ exportLoading: true, error: null });
    
    try {
      const blob = await api.exportCustomers({
        filters: get().filters,
        ...params
      });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `customers_export_${new Date().toISOString()}.${params.format || 'csv'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      set({ exportLoading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Export failed',
        exportLoading: false
      });
      throw error;
    }
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters }
    }));
    get().fetchCustomers(1);
  },

  resetFilters: () => {
    set({
      filters: {
        search: '',
        isActive: null,
        provider: null,
        sortBy: 'createdAt',
        sortOrder: 'DESC',
        startDate: null,
        endDate: null,
        minSpent: null,
        maxSpent: null
      }
    });
    get().fetchCustomers(1);
  },

  selectCustomer: (customerId) => {
    set((state) => ({
      selectedCustomers: state.selectedCustomers.includes(customerId)
        ? state.selectedCustomers.filter(id => id !== customerId)
        : [...state.selectedCustomers, customerId]
    }));
  },

  selectAllCustomers: () => {
    set((state) => ({
      selectedCustomers: state.customers.map(c => c.id)
    }));
  },

  clearSelection: () => {
    set({ selectedCustomers: [] });
  },

  clearError: () => {
    set({ error: null });
  }
}));

export default useUserStore;
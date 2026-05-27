import { create } from 'zustand';
import AdminDashboardService from '../../services/admin/AdminDashboardService';

const useAdminDashboardStore = create((set, get) => ({
  // State
  isLoading: true,
  overview: null,
  salesByCategory: [],
  revenueData: [],
  recentOrders: [],
  inventoryAlerts: [],
  topProducts: [],
  error: null,
  
  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  
  setOverview: (overviewData) => set({ 
    overview: {
      ...overviewData,
      getFormattedRevenue: () => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'UGx'
        }).format(overviewData?.totalRevenue || 0);
      }
    }
  }),
  
  setSalesByCategory: (categories) => set({ salesByCategory: categories }),
  
  setRevenueData: (data) => set({ revenueData: data }),
  
  setRecentOrders: (orders) => set({ recentOrders: orders }),
  
  setInventoryAlerts: (alerts) => set({ inventoryAlerts: alerts }),
  
  setTopProducts: (products) => set({ topProducts: products }),
  
  setError: (error) => set({ error }),
  
  // Load overview data
  loadOverview: async (period = '30d') => {
    try {
      set({ isLoading: true, error: null });
      const overviewData = await AdminDashboardService.getDashboardOverview(period);
      set({ 
        overview: {
          ...overviewData,
          getFormattedRevenue: () => {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'UGx'
            }).format(overviewData.totalRevenue || 0);
          }
        },
        isLoading: false 
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // Load revenue analytics
  loadRevenueAnalytics: async (period = '30d') => {
    try {
      set({ isLoading: true, error: null });
      const revenueData = await AdminDashboardService.getRevenueAnalytics(period);
      set({ revenueData, isLoading: false });
      return revenueData;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // Load sales by category
  loadSalesByCategory: async (period = '30d') => {
    try {
      const salesByCategory = await AdminDashboardService.getSalesByCategory(period);
      set({ salesByCategory });
      return salesByCategory;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
  
  // Load recent orders (using recent activities)
  loadRecentOrders: async (limit = 10) => {
    try {
      const recentActivities = await AdminDashboardService.getRecentActivities(limit);
      // Assuming recentActivities contains order data
      set({ recentOrders: recentActivities });
      return recentActivities;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
  
  // Load inventory alerts
  loadInventoryAlerts: async () => {
    try {
      const inventoryAlerts = await AdminDashboardService.getInventoryAlerts();
      set({ inventoryAlerts });
      return inventoryAlerts;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
  
  // Load top products
  loadTopProducts: async (limit = 5) => {
    try {
      const topProducts = await AdminDashboardService.getTopProducts(limit);
      set({ topProducts });
      return topProducts;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
  
  // Initialize complete dashboard
  initializeDashboard: async (period = '30d') => {
    try {
      set({ isLoading: true, error: null });
      
      // Load all data in parallel for better performance
      const [
        overviewData,
        revenueData,
        salesByCategory,
        topProducts,
        inventoryAlerts,
        recentOrders
      ] = await Promise.all([
        AdminDashboardService.getDashboardOverview(period),
        AdminDashboardService.getRevenueAnalytics(period),
        AdminDashboardService.getSalesByCategory(period),
        AdminDashboardService.getTopProducts(5, period),
        AdminDashboardService.getInventoryAlerts(),
        AdminDashboardService.getRecentActivities(10)
      ]);
      
      set({
        overview: {
          ...overviewData,
          getFormattedRevenue: () => {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'UGx'
            }).format(overviewData.totalRevenue || 0);
          }
        },
        revenueData,
        salesByCategory,
        topProducts,
        inventoryAlerts,
        recentOrders,
        isLoading: false
      });
      
    } catch (error) {
      // If API fails, load mock data as fallback
      console.warn('API failed, loading mock data:', error.message);
      await get().loadMockData(period);
    }
  }, 
  
  // Fallback mock data
  loadMockData: async (period = '30d') => {
    try {
      // Generate mock data based on period
      const baseRevenue = period === '7d' ? 50000 : 
                         period === '30d' ? 250000 : 
                         period === '90d' ? 750000 : 3000000;
      
      const baseOrders = period === '7d' ? 150 : 
                        period === '30d' ? 750 : 
                        period === '90d' ? 2250 : 9000;

      const mockData = {
        overview: {
          totalRevenue: baseRevenue,
          totalOrders: baseOrders,
          totalProducts: 1250,
          totalCustomers: 5420,
          revenueGrowth: 12.5,
          ordersGrowth: 8.2,
          productsGrowth: 5.1,
          customersGrowth: 15.3
        },
        salesByCategory: [
          { name: 'Electronics', value: 45000 },
          { name: 'Clothing', value: 35000 },
          { name: 'Home & Garden', value: 28000 },
          { name: 'Books', value: 15000 },
          { name: 'Sports', value: 12000 }
        ],
        revenueData: get().generateMockRevenueData(period),
        recentOrders: [
          { id: 1, customer: 'John Doe', amount: 249.99, status: 'Delivered', date: '2024-01-15' },
          { id: 2, customer: 'Jane Smith', amount: 149.50, status: 'Processing', date: '2024-01-14' },
          { id: 3, customer: 'Bob Johnson', amount: 89.99, status: 'Shipped', date: '2024-01-13' },
          { id: 4, customer: 'Alice Brown', amount: 329.99, status: 'Delivered', date: '2024-01-12' },
          { id: 5, customer: 'Charlie Wilson', amount: 199.99, status: 'Pending', date: '2024-01-11' }
        ],
        inventoryAlerts: [
          { id: 1, product: 'Wireless Headphones', currentStock: 5, minStock: 10, status: 'low' },
          { id: 2, product: 'Smart Watch', currentStock: 3, minStock: 5, status: 'critical' },
          { id: 3, product: 'Laptop Backpack', currentStock: 12, minStock: 15, status: 'warning' },
          { id: 4, product: 'USB-C Cable', currentStock: 45, minStock: 50, status: 'warning' }
        ],
        topProducts: [
          { id: 1, name: 'Wireless Earbuds', sales: 1250, revenue: 31250 },
          { id: 2, name: 'Smartphone Case', sales: 980, revenue: 14700 },
          { id: 3, name: 'Laptop Stand', sales: 750, revenue: 22500 },
          { id: 4, name: 'Monitor', sales: 520, revenue: 104000 },
          { id: 5, name: 'Keyboard', sales: 480, revenue: 14400 }
        ]
      };
      
      set({
        overview: {
          ...mockData.overview,
          getFormattedRevenue: () => {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'UGx'
            }).format(mockData.overview.totalRevenue || 0);
          }
        },
        revenueData: mockData.revenueData,
        salesByCategory: mockData.salesByCategory,
        recentOrders: mockData.recentOrders,
        inventoryAlerts: mockData.inventoryAlerts,
        topProducts: mockData.topProducts,
        isLoading: false
      });
      
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  // Helper: Generate mock revenue data for fallback
  generateMockRevenueData: (period) => {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 12;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      let label;
      if (period === '1y') {
        label = date.toLocaleDateString('en-US', { month: 'short' });
      } else {
        label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      
      const baseValue = period === '7d' ? 5000 : 
                       period === '30d' ? 6000 : 
                       period === '90d' ? 7000 : 200000;
      const randomFactor = 0.8 + Math.random() * 0.4;
      const trendFactor = 1 + (i / days) * 0.3;
      
      data.push({
        date: label,
        revenue: Math.round(baseValue * randomFactor * trendFactor)
      });
    }
    
    return data;
  },
  
  // Change period and reload
  changePeriod: async (period = '30d') => {
    await get().initializeDashboard(period);
  },
  
  // Refresh specific data
  refreshData: async (dataType, period = '30d') => {
    try {
      set({ isLoading: true });
      
      switch (dataType) {
        case 'overview':
          await get().loadOverview(period);
          break;
        case 'revenue':
          await get().loadRevenueAnalytics(period);
          break;
        case 'categories':
          await get().loadSalesByCategory(period);
          break;
        case 'orders':
          await get().loadRecentOrders();
          break;
        case 'inventory':
          await get().loadInventoryAlerts();
          break;
        case 'products':
          await get().loadTopProducts();
          break;
        default:
          await get().initializeDashboard(period);
      }
      
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Export dashboard data
  exportDashboardData: async (period = '30d', format = 'csv') => {
    try {
      return await AdminDashboardService.exportDashboardData(period, format);
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
  
  // Clear error
  clearError: () => set({ error: null }),
  
  // Reset state
  reset: () => set({
    isLoading: true,
    overview: null,
    salesByCategory: [],
    revenueData: [],
    recentOrders: [],
    inventoryAlerts: [],
    topProducts: [],
    error: null
  })
}));

export default useAdminDashboardStore;


// import api from '../api';
// import AdminDashboardModel from '../../models/admin/AdminDashboardModel';

// class AdminDashboardService {
//   // Get dashboard overview
//   async getDashboardOverview(period = '30d') {
//     try {
//       const response = await api.get('/admin/dashboard/overview', {
//         params: { period }
//       });
//       return AdminDashboardModel.fromApi(response.data.data);
//     } catch (error) {
//       console.error('Error fetching dashboard overview:', error);
//       throw error;
//     }
//   }

//   // Get revenue analytics
//   async getRevenueAnalytics(period = '30d', groupBy = 'day') {
//     try {
//       const response = await api.get('/admin/dashboard/revenue-analytics', {
//         params: { period, groupBy }
//       });
//       return response.data.data;
//     } catch (error) {
//       console.error('Error fetching revenue analytics:', error);
//       throw error;
//     }
//   }

//   // Get sales by category
//   async getSalesByCategory(period = '30d') {
//     try {
//       const response = await api.get('/admin/dashboard/sales-by-category', {
//         params: { period }
//       });
//       return response.data.data;
//     } catch (error) {
//       console.error('Error fetching sales by category:', error);
//       throw error;
//     }
//   }

//   // Get top performing products
//   async getTopProducts(limit = 10, period = '30d') {
//     try {
//       const response = await api.get('/admin/dashboard/top-products', {
//         params: { limit, period }
//       });
//       return response.data.data;
//     } catch (error) {
//       console.error('Error fetching top products:', error);
//       throw error;
//     }
//   }

//   // Get customer acquisition
//   async getCustomerAcquisition(period = '30d') {
//     try {
//       const response = await api.get('/admin/dashboard/customer-acquisition', {
//         params: { period }
//       });
//       return response.data.data;
//     } catch (error) {
//       console.error('Error fetching customer acquisition:', error);
//       throw error;
//     }
//   }

//   // Get inventory alerts
//   async getInventoryAlerts(threshold = 10) {
//     try {
//       const response = await api.get('/admin/dashboard/inventory-alerts', {
//         params: { threshold }
//       });
//       return response.data.data;
//     } catch (error) {
//       console.error('Error fetching inventory alerts:', error);
//       throw error;
//     }
//   }

//   // Get recent activities
//   async getRecentActivities(limit = 20) {
//     try {
//       const response = await api.get('/admin/dashboard/recent-activities', {
//         params: { limit }
//       });
//       return response.data.data;
//     } catch (error) {
//       console.error('Error fetching recent activities:', error);
//       throw error;
//     }
//   }

//   // Export dashboard data
//   async exportDashboardData(period = '30d', format = 'csv') {
//     try {
//       const response = await api.get('/admin/dashboard/export', {
//         params: { period, format },
//         responseType: 'blob'
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error exporting dashboard data:', error);
//       throw error;
//     }
//   }
// }

// export default new AdminDashboardService();
import { create } from 'zustand';

const useAdminDashboardStore = create((set, get) => ({
  // State
  isLoading: true,
  overview: null,
  salesByCategory: [],
  revenueData: [],
  recentOrders: [],
  inventoryAlerts: [],
  topProducts: [],
  
  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  
  setOverview: (overviewData) => set({ 
    overview: {
      ...overviewData,
      getFormattedRevenue: () => {
        return new Intl.NumberFormat('en-UG', {
          style: 'currency',
          currency: 'UGX'
        }).format(overviewData?.totalRevenue || 0);
      }
    }
  }),


  // In your useAdminDashboardStore.js, add:
  loadOverview: async (period = '30d') => {
    set({ isLoading: true });
    try {
      // Call your API service here
      // const data = await AdminDashboardService.getOverview(period);
      
      // For now, generate mock data
      const mockData = generateMockData(period); // You'll need to define this
      
      set({
        overview: {
          ...mockData.overview,
          getFormattedRevenue: () => {
            return new Intl.NumberFormat('en-UG', {
              style: 'currency',
              currency: 'UGX'
            }).format(mockData.overview.totalRevenue || 0);
          }
        },
        salesByCategory: mockData.salesByCategory,
        revenueData: mockData.revenueData,
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
  
  setSalesByCategory: (categories) => set({ salesByCategory: categories }),
  
  setRevenueData: (data) => set({ revenueData: data }),
  
  setRecentOrders: (orders) => set({ recentOrders: orders }),
  
  setInventoryAlerts: (alerts) => set({ inventoryAlerts: alerts }),
  
  setTopProducts: (products) => set({ topProducts: products }),
  
  // Reset state
  reset: () => set({
    isLoading: true,
    overview: null,
    salesByCategory: [],
    revenueData: [],
    recentOrders: [],
    inventoryAlerts: [],
    topProducts: []
  })
}));

export default useAdminDashboardStore; 
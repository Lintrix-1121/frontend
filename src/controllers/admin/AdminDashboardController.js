import toast from 'react-hot-toast';

class AdminDashboardController {
  constructor(dashboardStore, productStore, orderStore, customerStore) {
    this.dashboardStore = dashboardStore;
    this.productStore = productStore;
    this.orderStore = orderStore;
    this.customerStore = customerStore;
    this.store = dashboardStore;
  }

  // Initialize dashboard
  async initializeDashboard(period = '30d') {
    try {
      // Try to load from API first
      await Promise.all([
        this.dashboardStore.loadOverview(period),
        this.dashboardStore.loadRevenueAnalytics(period),
        this.dashboardStore.loadSalesByCategory(period),
        this.dashboardStore.loadTopProducts(10, period),
        this.dashboardStore.loadInventoryAlerts(),
        this.dashboardStore.loadRecentActivities()
      ]);
    } catch (error) {
      console.warn('API failed, loading mock data:', error.message);
      toast.error(`Failed to load dashboard data: ${error.message}`);
      
      // Load mock data as fallback
      await this.loadMockData(period);
    }
  }

  // Load mock data as fallback
  async loadMockData(period = '30d') {
    try {
      const mockData = this.generateMockData(period);
      
      // Set data using store methods
      this.dashboardStore.setOverview({
        totalRevenue: mockData.overview.totalRevenue,
        totalOrders: mockData.overview.totalOrders,
        totalProducts: mockData.overview.totalProducts,
        totalCustomers: mockData.overview.totalCustomers,
        revenueGrowth: 12.5,
        ordersGrowth: 8.2,
        productsGrowth: 5.1,
        customersGrowth: 15.3,
        conversionRate: 3.2,
        averageOrderValue: 89.99
      });
      
      this.dashboardStore.setSalesByCategory(mockData.salesByCategory);
      this.dashboardStore.setRevenueData(mockData.revenueData);
      this.dashboardStore.setRecentOrders(mockData.recentOrders);
      this.dashboardStore.setInventoryAlerts(mockData.inventoryAlerts);
      this.dashboardStore.setTopProducts(mockData.topProducts);
      
    } catch (error) {
      toast.error(`Failed to load mock data: ${error.message}`);
      throw error;
    }
  }

  // Change period
  async changePeriod(period) {
    try {
      await this.initializeDashboard(period);
      toast.success(`Dashboard period changed to ${this.getPeriodLabel(period)}`);
    } catch (error) {
      toast.error(`Failed to change period: ${error.message}`);
      throw error;
    }
  }

  // Get period label
  getPeriodLabel(period) {
    const periods = {
      '7d': 'Last 7 days',
      '30d': 'Last 30 days',
      '90d': 'Last 90 days',
      '1y': 'Last year'
    };
    return periods[period] || period;
  }

  // Export dashboard data
  async exportDashboardData(format = 'csv') {
    try {
      const { period } = this.dashboardStore;
      const blob = await this.dashboardStore.exportDashboardData(period, format);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Dashboard data exported successfully');
    } catch (error) {
      toast.error(`Failed to export: ${error.message}`);
      throw error;
    }
  } 

  // Get quick stats
  getQuickStats() {
    const { overview } = this.dashboardStore;
    if (!overview) return null;

    return {
      revenue: overview.totalRevenue,
      orders: overview.totalOrders,
      products: overview.totalProducts,
      customers: overview.totalCustomers,
      conversionRate: overview.conversionRate || 0,
      averageOrderValue: overview.averageOrderValue || 0
    };
  }

  // Get chart data for rendering
  getRevenueChartData() {
    const revenueData = this.dashboardStore.revenueData || this.dashboardStore.revenueChart || [];
    if (!revenueData || revenueData.length === 0) return null;

    // Format data for recharts
    return {
      labels: revenueData.map(item => item.date || item.label),
      datasets: [
        {
          label: 'Revenue',
          data: revenueData.map(item => item.revenue || item.value),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true
        }
      ]
    };
  }

  // Get formatted stats for StatCard components
  getStats() {
    const overview = this.dashboardStore.overview;
    if (!overview) return null;

    return {
      revenue: {
        value: overview.getFormattedRevenue ? overview.getFormattedRevenue() : 
               new Intl.NumberFormat('en-US', {
                 style: 'currency',
                 currency: 'USD'
               }).format(overview.totalRevenue || 0),
        growth: overview.revenueGrowth || 0,
        isPositive: (overview.revenueGrowth || 0) > 0
      },
      orders: {
        value: (overview.totalOrders || 0)?.toLocaleString(),
        growth: overview.ordersGrowth || 0,
        isPositive: (overview.ordersGrowth || 0) > 0
      },
      products: {
        value: (overview.totalProducts || 0)?.toLocaleString(),
        growth: overview.productsGrowth || 0,
        isPositive: (overview.productsGrowth || 0) > 0
      },
      customers: {
        value: (overview.totalCustomers || 0)?.toLocaleString(),
        growth: overview.customersGrowth || 0,
        isPositive: (overview.customersGrowth || 0) > 0
      }
    };
  }

  // Get inventory alerts
  getInventoryAlerts() {
    return this.dashboardStore.inventoryAlerts || [];
  }

  // Get recent activities
  getRecentActivities() {
    return this.dashboardStore.recentActivities || this.dashboardStore.recentOrders || [];
  }

  // Get top products
  getTopProducts() {
    return this.dashboardStore.topProducts || [];
  }

  // Get sales by category data
  getSalesByCategoryData() {
    const salesByCategory = this.dashboardStore.salesByCategory || [];
    return salesByCategory.map((category, index) => ({
      ...category,
      color: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'][index % 5]
    }));
  }

  // Get period options for dropdown
  getPeriodOptions() {
    return [
      { value: '7d', label: 'Last 7 days' },
      { value: '30d', label: 'Last 30 days' },
      { value: '90d', label: 'Last 90 days' },
      { value: '1y', label: 'Last year' }
    ];
  }

  // Refresh specific data
  async refreshData(dataType, period = '30d') {
    try {
      switch (dataType) {
        case 'overview':
          await this.dashboardStore.loadOverview(period);
          break;
        case 'revenue':
          await this.dashboardStore.loadRevenueAnalytics(period);
          break;
        case 'categories':
          await this.dashboardStore.loadSalesByCategory(period);
          break;
        case 'orders':
          await this.dashboardStore.loadRecentActivities();
          break;
        case 'inventory':
          await this.dashboardStore.loadInventoryAlerts();
          break;
        case 'products':
          await this.dashboardStore.loadTopProducts(10, period);
          break;
        default:
          await this.initializeDashboard(period);
      }
      toast.success(`${dataType} data refreshed successfully`);
    } catch (error) {
      toast.error(`Failed to refresh ${dataType}: ${error.message}`);
      throw error;
    }
  }

  // Check loading state
  isLoading() {
    return this.dashboardStore.isLoading || false;
  }

  // Get error
  getError() {
    return this.dashboardStore.error || null;
  }

  // Clear error
  clearError() {
    this.dashboardStore.clearError?.();
  }

  // Mock data generation methods (kept from your original)
  generateMockData = (period) => {
    const baseRevenue = period === '7d' ? 50000 : 
                       period === '30d' ? 250000 : 
                       period === '90d' ? 750000 : 3000000;
    
    const baseOrders = period === '7d' ? 150 : 
                      period === '30d' ? 750 : 
                      period === '90d' ? 2250 : 9000;

    return {
      overview: {
        totalRevenue: baseRevenue,
        totalOrders: baseOrders,
        totalProducts: 1250,
        totalCustomers: 5420,
        revenueGrowth: 12.5,
        ordersGrowth: 8.2,
        productsGrowth: 5.1,
        customersGrowth: 15.3,
        conversionRate: 3.2,
        averageOrderValue: 89.99
      },
      salesByCategory: [
        { name: 'Electronics', value: 45000 },
        { name: 'Clothing', value: 35000 },
        { name: 'Home & Garden', value: 28000 },
        { name: 'Books', value: 15000 },
        { name: 'Sports', value: 12000 }
      ],
      revenueData: this.generateRevenueData(period),
      recentOrders: [
        { id: 1, customer: 'Livinstone', amount: 249.99, status: 'Delivered', date: '2024-01-15' },
        { id: 2, customer: 'Lintrix', amount: 149.50, status: 'Processing', date: '2024-01-14' },
        { id: 3, customer: 'James', amount: 89.99, status: 'Shipped', date: '2024-01-13' },
        { id: 4, customer: 'Cissy ', amount: 329.99, status: 'Delivered', date: '2024-01-12' },
        { id: 5, customer: 'Moreen', amount: 199.99, status: 'Pending', date: '2024-01-11' }
      ],
      inventoryAlerts: [
        { id: 1, product: 'Wireless Headphones', currentStock: 5, minStock: 10, status: 'low' },
        { id: 2, product: 'Smart Watch', currentStock: 3, minStock: 5, status: 'critical' },
        { id: 3, product: 'Laptop Backpack', currentStock: 12, minStock: 15, status: 'warning' },
        { id: 4, product: 'USB-C Cable', currentStock: 45, minStock: 50, status: 'warning' }
      ],
      topProducts: [
        { id: 1, name: 'Valves', sales: 1250, revenue: 31250 },
        { id: 2, name: 'Elbow', sales: 980, revenue: 14700 },
        { id: 3, name: 'Seamless ', sales: 750, revenue: 22500 },
        { id: 4, name: 'Tee', sales: 520, revenue: 104000 },
        { id: 5, name: 'Total 6kg', sales: 480, revenue: 14400 }
      ]
    };
  }
  
  generateRevenueData = (period) => {
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
  }
}

export default AdminDashboardController;



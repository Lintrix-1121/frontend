class AdminDashboardModel {
  constructor(data) {
    this.period = data.period;
    this.totalRevenue = parseFloat(data.totalRevenue) || 0;
    this.totalOrders = parseInt(data.totalOrders) || 0;
    this.totalProducts = parseInt(data.totalProducts) || 0;
    this.totalCustomers = parseInt(data.totalCustomers) || 0;
    this.averageOrderValue = parseFloat(data.averageOrderValue) || 0;
    this.conversionRate = parseFloat(data.conversionRate) || 0;
    
    // Charts data
    this.revenueChart = data.revenueChart || [];
    this.orderChart = data.orderChart || [];
    this.topProducts = data.topProducts || [];
    this.recentOrders = data.recentOrders || [];
    this.orderStatusDistribution = data.orderStatusDistribution || [];
  }

  static fromApi(data) {
    return new AdminDashboardModel(data);
  }

  getFormattedRevenue() {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'UGx'
    }).format(this.totalRevenue);
  }

  getRevenueGrowth(previousPeriod) {
    if (!previousPeriod || previousPeriod.totalRevenue === 0) return 0;
    return ((this.totalRevenue - previousPeriod.totalRevenue) / previousPeriod.totalRevenue) * 100;
  }

  getOrderGrowth(previousPeriod) {
    if (!previousPeriod || previousPeriod.totalOrders === 0) return 0;
    return ((this.totalOrders - previousPeriod.totalOrders) / previousPeriod.totalOrders) * 100;
  }
}

export default AdminDashboardModel;
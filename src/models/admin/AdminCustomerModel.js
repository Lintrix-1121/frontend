class AdminCustomerModel {
  constructor(data) {
    this.id = data.userId || data.id;
    this.userName = data.userName;
    this.email = data.email;
    this.profilePicture = data.profilePicture;
    this.provider = data.provider || 'local';
    this.providerId = data.providerId;
    this.isActive = Boolean(data.isActive);
    this.lastLoginAt = data.lastLoginAt ? new Date(data.lastLoginAt) : null;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
    
    // Statistics
    this.totalOrders = parseInt(data.totalOrders) || 0;
    this.totalSpent = parseFloat(data.totalSpent) || 0;
    this.averageOrderValue = parseFloat(data.averageOrderValue) || 0;
    this.lastOrderDate = data.lastOrderDate ? new Date(data.lastOrderDate) : null;
    this.orderIds = data.orderIds || [];
    this.wishlistCount = parseInt(data.wishlistCount) || 0;
    
    // Contact info (if available)
    this.phone = data.phone;
    this.address = data.address;
  }

  static fromApi(data) {
    return new AdminCustomerModel(data);
  }

  static fromArray(dataArray) {
    return dataArray.map(item => AdminCustomerModel.fromApi(item));
  }

  getCustomerSince() {
    const months = Math.floor((new Date() - this.createdAt) / (1000 * 60 * 60 * 24 * 30));
    if (months < 1) return 'New customer';
    if (months === 1) return '1 month';
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    return `${years} year${years > 1 ? 's' : ''}`;
  }

  getCustomerTier() {
    if (this.totalSpent >= 10000) return 'Platinum';
    if (this.totalSpent >= 5000) return 'Gold';
    if (this.totalSpent >= 1000) return 'Silver';
    return 'Bronze';
  }

  getTierColor() {
    const tier = this.getCustomerTier();
    const colors = {
      'Platinum': 'purple',
      'Gold': 'yellow',
      'Silver': 'gray',
      'Bronze': 'orange'
    };
    return colors[tier];
  }

  getActivityStatus() {
    if (!this.lastLoginAt) return 'Inactive';
    const daysSinceLastLogin = Math.floor((new Date() - this.lastLoginAt) / (1000 * 60 * 60 * 24));
    if (daysSinceLastLogin <= 7) return 'Active';
    if (daysSinceLastLogin <= 30) return 'Recently Active';
    return 'Inactive';
  }

  getActivityColor() {
    const status = this.getActivityStatus();
    const colors = {
      'Active': 'green',
      'Recently Active': 'blue',
      'Inactive': 'gray'
    };
    return colors[status];
  }

  getLifetimeValue() {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(this.totalSpent);
  }

  getAverageOrderValueFormatted() {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(this.averageOrderValue);
  }
}

export default AdminCustomerModel;
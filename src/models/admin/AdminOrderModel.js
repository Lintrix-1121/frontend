class AdminOrderModel {
  constructor(data) {
    this.id = data.orderId || data.id;
    this.orderNumber = data.orderNumber;
    this.userId = data.userId;
    this.customer = data.customer || {};
    this.status = data.status;
    this.paymentStatus = data.paymentStatus;
    this.paymentMethod = data.paymentMethod;
    this.items = data.items || [];
    this.subtotal = parseFloat(data.subtotal) || 0;
    this.discountAmount = parseFloat(data.discountAmount) || 0;
    this.shippingAmount = parseFloat(data.shippingAmount) || 0;
    this.taxAmount = parseFloat(data.taxAmount) || 0;
    this.totalAmount = parseFloat(data.totalAmount) || 0;
    this.currency = data.currency || 'USD';
    this.shippingAddress = data.shippingAddress || {};
    this.billingAddress = data.billingAddress || {};
    this.customerNotes = data.customerNotes;
    this.adminNotes = data.adminNotes;
    this.odooOrderId = data.odooOrderId;
    this.odooQuotationId = data.odooQuotationId;
    this.odooCustomerId = data.odooCustomerId;
    this.odooSyncStatus = data.odooSyncStatus;
    this.odooSyncResponse = data.odooSyncResponse;
    this.odooSyncedAt = data.odooSyncedAt ? new Date(data.odooSyncedAt) : null;
    this.metadata = data.metadata || {};
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
    
    // Calculated fields
    this.itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
    this.profit = this.calculateProfit();
  }

  static fromApi(data) {
    return new AdminOrderModel(data);
  }

  static fromArray(dataArray) {
    return dataArray.map(item => AdminOrderModel.fromApi(item));
  }

  calculateProfit() {
    // Calculate profit based on cost if available
    let totalCost = 0;
    this.items.forEach(item => {
      if (item.cost) {
        totalCost += item.cost * item.quantity;
      }
    });
    return this.totalAmount - totalCost;
  }

  getProfitMargin() {
    if (this.totalAmount === 0) return 0;
    return ((this.profit / this.totalAmount) * 100).toFixed(2);
  }

  getStatusColor() {
    const statusColors = {
      'pending': 'yellow',
      'processing': 'blue',
      'on_hold': 'orange',
      'completed': 'green',
      'cancelled': 'red',
      'refunded': 'purple',
      'failed': 'gray',
      'synced_to_odoo': 'indigo',
      'odoo_confirmed': 'teal'
    };
    return statusColors[this.status] || 'gray';
  }

  getPaymentStatusColor() {
    const statusColors = {
      'pending': 'yellow',
      'paid': 'green',
      'failed': 'red',
      'refunded': 'purple'
    };
    return statusColors[this.paymentStatus] || 'gray';
  }

  getShippingAddressFormatted() {
    if (!this.shippingAddress) return 'N/A';
    const { street, city, state, zipCode, country } = this.shippingAddress;
    return `${street}, ${city}, ${state} ${zipCode}, ${country}`;
  }

  getBillingAddressFormatted() {
    if (!this.billingAddress) return 'Same as shipping';
    const { street, city, state, zipCode, country } = this.billingAddress;
    return `${street}, ${city}, ${state} ${zipCode}, ${country}`;
  }

  canBeCancelled() {
    return ['pending', 'processing'].includes(this.status);
  }

  canBeRefunded() {
    return this.paymentStatus === 'paid' && this.status !== 'refunded';
  }

  getTimelineEvents() {
    const events = [
      {
        date: this.createdAt,
        status: 'Order Placed',
        description: 'Order was placed by customer'
      }
    ];

    if (this.status !== 'pending') {
      events.push({
        date: this.updatedAt,
        status: this.status.charAt(0).toUpperCase() + this.status.slice(1),
        description: `Order status changed to ${this.status}`
      });
    }

    if (this.odooSyncedAt) {
      events.push({
        date: this.odooSyncedAt,
        status: 'Synced to Odoo',
        description: 'Order synced to Odoo system'
      });
    }

    return events.sort((a, b) => b.date - a.date);
  }
}

export default AdminOrderModel;
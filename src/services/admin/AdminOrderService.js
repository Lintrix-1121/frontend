import api from '../api';
import AdminOrderModel from '../../models/admin/AdminOrderModel';

class AdminOrderService {
  // Get all orders with filters
  async getOrders(filters = {}) {
    try {
      const params = this.buildQueryParams(filters);
      const response = await api.get('/admin/orders', { params });
      
      return {
        orders: AdminOrderModel.fromArray(response.data.data.orders),
        pagination: response.data.data.pagination
      };
    } catch (error) {
      console.error('Error fetching admin orders:', error);
      throw error;
    }
  }

  // Get order by ID
  async getOrderById(orderId) {
    try {
      const response = await api.get(`/admin/orders/${orderId}`);
      return AdminOrderModel.fromApi(response.data.data);
    } catch (error) {
      console.error('Error fetching admin order:', error);
      throw error;
    }
  }

  // Update order status
  async updateOrderStatus(orderId, status, notes = null) {
    try {
      const response = await api.put(`/admin/orders/${orderId}/status`, {
        status,
        adminNotes: notes
      });
      return AdminOrderModel.fromApi(response.data.data);
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Update payment status
  async updatePaymentStatus(orderId, paymentStatus) {
    try {
      const response = await api.put(`/admin/orders/${orderId}/payment-status`, {
        paymentStatus
      });
      return AdminOrderModel.fromApi(response.data.data);
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  // Add admin notes
  async addAdminNotes(orderId, notes) {
    try {
      const response = await api.post(`/admin/orders/${orderId}/notes`, {
        notes
      });
      return AdminOrderModel.fromApi(response.data.data);
    } catch (error) {
      console.error('Error adding admin notes:', error);
      throw error;
    }
  }

  // Sync order to Odoo
  async syncToOdoo(orderId) {
    try {
      const response = await api.post(`/admin/orders/${orderId}/sync-odoo`);
      return response.data;
    } catch (error) {
      console.error('Error syncing order to Odoo:', error);
      throw error;
    }
  }

  // Process refund
  async processRefund(orderId, amount, reason) {
    try {
      const response = await api.post(`/admin/orders/${orderId}/refund`, {
        amount,
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  // Send order notification
  async sendNotification(orderId, notificationType) {
    try {
      const response = await api.post(`/admin/orders/${orderId}/notify`, {
        notificationType
      });
      return response.data;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  // Export orders
  async exportOrders(format = 'csv', filters = {}) {
    try {
      const params = { ...filters, format };
      const response = await api.get('/admin/orders/export', {
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting orders:', error);
      throw error;
    }
  }

  // Get order statistics
  async getOrderStats(period = '30d') {
    try {
      const response = await api.get('/admin/orders/stats', {
        params: { period }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching order stats:', error);
      throw error;
    }
  }

  // Helper to build query params
  buildQueryParams(filters) {
    const params = {};
    
    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;
    if (filters.paymentStatus) params.paymentStatus = filters.paymentStatus;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.minAmount) params.minAmount = filters.minAmount;
    if (filters.maxAmount) params.maxAmount = filters.maxAmount;
    if (filters.customerId) params.customerId = filters.customerId;
    if (filters.paymentMethod) params.paymentMethod = filters.paymentMethod;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortOrder) params.sortOrder = filters.sortOrder;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;

    return params;
  }
}

export default new AdminOrderService();
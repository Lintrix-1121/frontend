// api/adminCustomers.js
import api from '../api'; // Import the shared axios instance

class AdminCustomerAPI {
  constructor() {
    // No need to create axios instance anymore - using the shared one
    this.api = api;
  }

  // Customer Management
  async getCustomers(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 20,
        ...(params.search && { search: params.search }),
        ...(params.isActive !== undefined && { isActive: params.isActive }),
        ...(params.provider && { provider: params.provider }),
        ...(params.sortBy && { sortBy: params.sortBy }),
        ...(params.sortOrder && { sortOrder: params.sortOrder }),
        ...(params.startDate && { startDate: params.startDate }),
        ...(params.endDate && { endDate: params.endDate }),
        ...(params.minSpent && { minSpent: params.minSpent }),
        ...(params.maxSpent && { maxSpent: params.maxSpent })
      });

      const response = await this.api.get(`/admin/customers?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  async getCustomerById(customerId) {
    try {
      const response = await this.api.get(`/admin/customers/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  }

  async createCustomer(customerData) {
    try {
      const response = await this.api.post('/admin/customers', customerData);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  async updateCustomer(customerId, customerData) {
    try {
      const response = await this.api.put(`/admin/customers/${customerId}`, customerData);
      return response.data;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  }

  async deleteCustomer(customerId) {
    try {
      const response = await this.api.delete(`/admin/customers/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  }

  async toggleUserStatus(userId) {
    try {
      const response = await this.api.patch(`/admin/users/${userId}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  }

  async updateUserRole(userId, role) {
    try {
      const response = await this.api.put(`/admin/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  async getUserStats() {
    try {
      const response = await this.api.get('/admin/users/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }

  async getCustomerOrders(customerId, params = {}) {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 10,
        ...(params.status && { status: params.status })
      });

      const response = await this.api.get(`/admin/customers/${customerId}/orders?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      throw error;
    }
  }

  async getCustomerActivity(customerId, params = {}) {
    try {
      const queryParams = new URLSearchParams({
        limit: params.limit || 20,
        ...(params.type && { type: params.type })
      });

      const response = await this.api.get(`/admin/customers/${customerId}/activity?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer activity:', error);
      throw error;
    }
  }

  async sendCustomerEmail(customerId, emailData) {
    try {
      const response = await this.api.post(`/admin/customers/${customerId}/email`, emailData);
      return response.data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async bulkUpdateCustomers(operation, data) {
    try {
      const response = await this.api.post('/admin/customers/bulk', { operation, data });
      return response.data;
    } catch (error) {
      console.error('Error in bulk operation:', error);
      throw error;
    }
  }

  async exportCustomers(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        format: params.format || 'csv',
        ...(params.fields && { fields: params.fields.join(',') }),
        ...(params.filters && { filters: JSON.stringify(params.filters) })
      });

      const response = await this.api.get(`/admin/customers/export?${queryParams}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting customers:', error);
      throw error;
    }
  }

  async getCustomerAnalytics(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        ...(params.period && { period: params.period }),
        ...(params.startDate && { startDate: params.startDate }),
        ...(params.endDate && { endDate: params.endDate })
      });

      const response = await this.api.get(`/admin/customers/analytics?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer analytics:', error);
      throw error;
    }
  }
}

export default AdminCustomerAPI;






// // api/adminCustomers.js
// import axios from 'axios';

// class AdminCustomerAPI {
//   constructor(baseURL) {
//     this.api = axios.create({
//       baseURL: baseURL || '/api',
//       withCredentials: true
//     });

//     // Add token interceptor
//     this.api.interceptors.request.use((config) => {
//       const token = localStorage.getItem('accessToken');
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     });

//     // Add response interceptor for token refresh
//     this.api.interceptors.response.use(
//       (response) => response,
//       async (error) => {
//         const originalRequest = error.config;
        
//         if (error.response?.status === 401 && !originalRequest._retry) {
//           originalRequest._retry = true;
          
//           try {
//             const refreshToken = localStorage.getItem('refreshToken');
//             const response = await this.api.post('/auth/refresh-token', { refreshToken });
            
//             if (response.data.success) {
//               localStorage.setItem('accessToken', response.data.data.accessToken);
//               localStorage.setItem('refreshToken', response.data.data.refreshToken);
              
//               originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
//               return this.api(originalRequest);
//             }
//           } catch (refreshError) {
//             // Redirect to login
//             window.location.href = '/login';
//           }
//         }
        
//         return Promise.reject(error);
//       }
//     );
//   }

//   // Customer Management
//   async getCustomers(params = {}) {
//     try {
//       const queryParams = new URLSearchParams({
//         page: params.page || 1,
//         limit: params.limit || 20,
//         ...(params.search && { search: params.search }),
//         ...(params.isActive !== undefined && { isActive: params.isActive }),
//         ...(params.provider && { provider: params.provider }),
//         ...(params.sortBy && { sortBy: params.sortBy }),
//         ...(params.sortOrder && { sortOrder: params.sortOrder }),
//         ...(params.startDate && { startDate: params.startDate }),
//         ...(params.endDate && { endDate: params.endDate }),
//         ...(params.minSpent && { minSpent: params.minSpent }),
//         ...(params.maxSpent && { maxSpent: params.maxSpent })
//       });

//       const response = await this.api.get(`/admin/customers?${queryParams}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching customers:', error);
//       throw error;
//     }
//   }

//   async getCustomerById(customerId) {
//     try {
//       const response = await this.api.get(`/admin/customers/${customerId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching customer:', error);
//       throw error;
//     }
//   }

//   async createCustomer(customerData) {
//     try {
//       const response = await this.api.post('/admin/customers', customerData);
//       return response.data;
//     } catch (error) {
//       console.error('Error creating customer:', error);
//       throw error;
//     }
//   }

//   async updateCustomer(customerId, customerData) {
//     try {
//       const response = await this.api.put(`/admin/customers/${customerId}`, customerData);
//       return response.data;
//     } catch (error) {
//       console.error('Error updating customer:', error);
//       throw error;
//     }
//   }

//   async deleteCustomer(customerId) {
//     try {
//       const response = await this.api.delete(`/admin/customers/${customerId}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error deleting customer:', error);
//       throw error;
//     }
//   }

//   async toggleUserStatus(userId) {
//     try {
//       const response = await this.api.patch(`/admin/users/${userId}/toggle-status`);
//       return response.data;
//     } catch (error) {
//       console.error('Error toggling user status:', error);
//       throw error;
//     }
//   }

//   async updateUserRole(userId, role) {
//     try {
//       const response = await this.api.put(`/admin/users/${userId}/role`, { role });
//       return response.data;
//     } catch (error) {
//       console.error('Error updating user role:', error);
//       throw error;
//     }
//   }

//   async getUserStats() {
//     try {
//       const response = await this.api.get('/admin/users/stats');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching user stats:', error);
//       throw error;
//     }
//   }

//   async getCustomerOrders(customerId, params = {}) {
//     try {
//       const queryParams = new URLSearchParams({
//         page: params.page || 1,
//         limit: params.limit || 10,
//         ...(params.status && { status: params.status })
//       });

//       const response = await this.api.get(`/admin/customers/${customerId}/orders?${queryParams}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching customer orders:', error);
//       throw error;
//     }
//   }

//   async getCustomerActivity(customerId, params = {}) {
//     try {
//       const queryParams = new URLSearchParams({
//         limit: params.limit || 20,
//         ...(params.type && { type: params.type })
//       });

//       const response = await this.api.get(`/admin/customers/${customerId}/activity?${queryParams}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching customer activity:', error);
//       throw error;
//     }
//   }

//   async sendCustomerEmail(customerId, emailData) {
//     try {
//       const response = await this.api.post(`/admin/customers/${customerId}/email`, emailData);
//       return response.data;
//     } catch (error) {
//       console.error('Error sending email:', error);
//       throw error;
//     }
//   }

//   async bulkUpdateCustomers(operation, data) {
//     try {
//       const response = await this.api.post('/admin/customers/bulk', { operation, data });
//       return response.data;
//     } catch (error) {
//       console.error('Error in bulk operation:', error);
//       throw error;
//     }
//   }

//   async exportCustomers(params = {}) {
//     try {
//       const queryParams = new URLSearchParams({
//         format: params.format || 'csv',
//         ...(params.fields && { fields: params.fields.join(',') }),
//         ...(params.filters && { filters: JSON.stringify(params.filters) })
//       });

//       const response = await this.api.get(`/admin/customers/export?${queryParams}`, {
//         responseType: 'blob'
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error exporting customers:', error);
//       throw error;
//     }
//   }

//   async getCustomerAnalytics(params = {}) {
//     try {
//       const queryParams = new URLSearchParams({
//         ...(params.period && { period: params.period }),
//         ...(params.startDate && { startDate: params.startDate }),
//         ...(params.endDate && { endDate: params.endDate })
//       });

//       const response = await this.api.get(`/admin/customers/analytics?${queryParams}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching customer analytics:', error);
//       throw error;
//     }
//   }
// }

// export default AdminCustomerAPI;
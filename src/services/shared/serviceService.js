import api from '../api'; 
import { Service } from '../../models/shared/Service'; 

class ServiceService {

   async createService(formData) {
    try {
      console.log('📤 [SERVICE] Creating service with form data');
      console.log('📋 FormData contents:');
      
      // Log FormData contents
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value instanceof File ? `File: ${value.name}` : value);
      }
      
      const response = await api.post('/services', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('✅ [SERVICE] Service created:', response.data);
      return response.data.data;
      
    } catch (error) {
      console.error('❌ [SERVICE] Error creating service:');
      console.error('  Status:', error.response?.status);
      console.error('  Status Text:', error.response?.statusText);
      console.error('  Headers:', error.response?.headers);
      console.error('  Data:', error.response?.data);
      console.error('  Message:', error.message);
      console.error('  Config:', {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      });
      
      // Extract detailed error message
      let errorMessage = 'Failed to create service';
      
      if (error.response?.data) {
        const apiError = error.response.data;
        console.log('🔍 API Error object:', apiError);
        
        if (apiError.message) {
          errorMessage = apiError.message;
        } else if (apiError.error) {
          errorMessage = apiError.error;
        } else if (typeof apiError === 'string') {
          errorMessage = apiError;
        }
      }
      
      // Create error with detailed message
      const detailedError = new Error(errorMessage);
      detailedError.response = error.response;
      throw detailedError;
    }
  }
 
  // Get all services
  async getAllServices(includeInactive = false) {
    try {
      console.log('📋 Fetching services, includeInactive:', includeInactive);
      const response = await api.get('/services', {
        params: { includeInactive },
      });
      console.log('✅ Services fetched:', response.data.data?.length || 0, 'items');
      return (response.data.data || []).map(service => new Service(service));
    } catch (error) {
      console.error('❌ Error fetching services:', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message
      });
      throw error;
    }
  }

  // Get service by ID
  async getServiceById(id) {
    try {
      console.log('🔍 Fetching service ID:', id);
      const response = await api.get(`/services/${id}`);
      return new Service(response.data.data);
    } catch (error) {
      console.error('❌ Error fetching service:', error);
      throw error;
    }
  }

  // Update service
  async updateService(id, formData) {
    try {
      console.log('✏️ Updating service ID:', id);
      const response = await api.put(`/services/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return new Service(response.data.data);
    } catch (error) {
      console.error('❌ Error updating service:', error);
      throw error;
    }
  }

  // Delete service
  async deleteService(id) {
    try {
      console.log('🗑️ Deleting service ID:', id);
      const response = await api.delete(`/services/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting service:', error);
      throw error;
    }
  }

  // Add related service
  async addRelatedService(data) {
    try {
      console.log('🔗 Adding related service:', data);
      const response = await api.post('/services/related/add', data);
      return response.data.data;
    } catch (error) {
      console.error('❌ Error adding related service:', error);
      throw error;
    }
  }

  // Remove related service
  async removeRelatedService(serviceId, relatedServiceId) {
    try {
      console.log('🔗 Removing related service:', { serviceId, relatedServiceId });
      const response = await api.delete(`/services/related/${serviceId}/${relatedServiceId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error removing related service:', error);
      throw error;
    }
  }

  // Get related services
  async getRelatedServices(serviceId) {
    try {
      console.log('🔍 Getting related services for:', serviceId);
      const response = await api.get(`/services/${serviceId}/related`);
      return (response.data.data || []).map(service => new Service(service));
    } catch (error) {
      console.error('❌ Error getting related services:', error);
      throw error;
    }
  }

  // Update service order
  async updateServiceOrder(servicesOrder) {
    try {
      console.log('📊 Updating service order:', servicesOrder);
      const response = await api.put('/services/order/update', { servicesOrder });
      return response.data;
    } catch (error) {
      console.error('❌ Error updating service order:', error);
      throw error;
    }
  }

  // Search services
  async searchServices(query) {
    try {
      console.log('🔍 Searching services:', query);
      const response = await api.get('/services/search', {
        params: { q: query },
      });
      return (response.data.data || []).map(service => new Service(service));
    } catch (error) {
      console.error('❌ Error searching services:', error);
      throw error;
    }
  }

  // Get active services (convenience method)
  async getActiveServices() {
    return this.getAllServices(false);
  }

  // Health check
  async healthCheck() {
    try {
      console.log('🏥 Checking service health');
      const response = await api.get('/services/health');
      return response.data;
    } catch (error) {
      console.error('❌ Service health check failed:', error);
      throw error;
    }
  }

  // Test connection
  async testConnection() {
    try {
      console.log('🧪 Testing service API connection');
      const response = await api.get('/api/health');
      console.log('✅ API connection test passed:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ API connection test failed:', error);
      throw error;
    }
  }
}

// Export as singleton instance
export default new ServiceService();



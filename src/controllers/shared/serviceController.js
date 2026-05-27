import serviceService from '../../services/shared/serviceService';
import { Service } from '../../models/shared/Service';

class ServiceController {



  async createService(serviceData, imageFile) {
    try {
      console.log('🎯 [CONTROLLER] createService called');
      
      // Check what type of data we received
      console.log('📦 [CONTROLLER] Input type:', typeof serviceData);
      console.log('📦 [CONTROLLER] Is FormData?', serviceData instanceof FormData);
      
      if (serviceData instanceof FormData) {
        console.log('📋 [CONTROLLER] Processing FormData');
        console.log('🔍 FormData contents:');
        for (let [key, value] of serviceData.entries()) {
          console.log(`  ${key}:`, value instanceof File ? `File: ${value.name}` : value);
        }
      } else {
        console.log('📦 [CONTROLLER] serviceData:', serviceData);
        console.log('🖼️ [CONTROLLER] imageFile:', imageFile);
      }
      
      // Make sure we return a proper object
      const result = await serviceService.createService(serviceData);
      
      console.log('📨 [CONTROLLER] serviceService returned:', result);
      
      // Check if serviceService returned anything
      if (!result) {
        console.error('❌ [CONTROLLER] serviceService returned undefined!');
        return {
          success: false,
          error: 'Service layer did not return a response',
          data: null
        };
      }
      
      // Return the expected format
      return {
        success: true,
        data: result,
        message: 'Service created successfully'
      };
      
    } catch (error) {
      console.error('❌ [CONTROLLER] Error in createService:', error);
      console.error('❌ Error stack:', error.stack);
      
      // Extract error message
      let errorMessage = 'Failed to create service';
      
      if (error.response?.data) {
        const apiError = error.response.data;
        console.error('🔍 API Error details:', apiError);
        errorMessage = apiError.message || apiError.error || error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // ALWAYS return an object
      return {
        success: false,
        error: errorMessage,
        data: null,
        details: error.response?.data || null
      };
    }
  }

  // Update service
  async updateService(serviceId, serviceData, imageFile) {
    try {
      if (!serviceId) {
        throw new Error('Service ID is required');
      }

      const service = Service.createFromForm(serviceData);
      const formData = service.toFormData(imageFile);
      
      const result = await serviceService.updateService(serviceId, formData);
      return { success: true, data: result, message: 'Service updated successfully' };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to update service',
        details: error.response?.data || null
      };
    }
  }

  // Delete service
  async deleteService(serviceId) {
    try {
      if (!serviceId) {
        throw new Error('Service ID is required');
      }

      const result = await serviceService.deleteService(serviceId);
      return { success: true, message: result.message || 'Service deleted successfully' };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to delete service',
        details: error.response?.data || null
      };
    }
  }

  // Fetch all services
  async fetchServices(includeInactive = false) {
    try {
      const services = await serviceService.getAllServices(includeInactive);
      return { success: true, data: services };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to fetch services',
        data: []
      };
    }
  }

  // Fetch single service
  async fetchService(serviceId) {
    try {
      if (!serviceId) {
        throw new Error('Service ID is required');
      }

      const service = await serviceService.getServiceById(serviceId);
      return { success: true, data: service };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to fetch service',
        data: null
      };
    }
  }

  // Add related service
  async addRelatedService(serviceId, relatedServiceId, relationType = 'similar') {
    try {
      if (!serviceId || !relatedServiceId) {
        throw new Error('Both service IDs are required');
      }

      const result = await serviceService.addRelatedService({
        serviceId,
        relatedServiceId,
        relationType
      });
      
      return { success: true, data: result, message: 'Related service added successfully' };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to add related service'
      };
    }
  }

  // Remove related service
  async removeRelatedService(serviceId, relatedServiceId) {
    try {
      if (!serviceId || !relatedServiceId) {
        throw new Error('Both service IDs are required');
      }

      const result = await serviceService.removeRelatedService(serviceId, relatedServiceId);
      return { success: true, message: result.message };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to remove related service'
      };
    }
  }

  // Reorder services
  async reorderServices(orderedServices) {
    try {
      if (!Array.isArray(orderedServices)) {
        throw new Error('Ordered services must be an array');
      }

      const servicesOrder = orderedServices.map((service, index) => ({
        serviceId: service.serviceId,
        order: index
      }));

      const result = await serviceService.updateServiceOrder(servicesOrder);
      return { success: true, message: result.message || 'Services reordered successfully' };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Failed to reorder services'
      };
    }
  }
}

export default new ServiceController();



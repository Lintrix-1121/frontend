import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import ServiceController from '../../controllers/shared/serviceController';

const useServiceStore = create(
  persist(
    (set, get) => ({
      // State
      services: [],
      currentService: null,
      loading: false,
      error: null,
      searchQuery: '',
      
      // Actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      // Fetch all services
      fetchServices: async (includeInactive = false) => {
        set({ loading: true, error: null });
        try {
          const result = await ServiceController.fetchServices(includeInactive);
          
          if (result.success) {
            set({ services: result.data, loading: false });
          } else {
            set({ error: result.error, loading: false });
          }
          
          return result;
        } catch (error) {
          console.error('❌ [STORE] Error in fetchServices:', error);
          set({ 
            error: error.message || 'Failed to fetch services', 
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },
      
      // Fetch single service
      fetchService: async (serviceId) => {
        if (!serviceId) {
          console.error('❌ [STORE] No serviceId provided to fetchService');
          set({ error: 'Service ID is required', loading: false });
          return { success: false, error: 'Service ID is required' };
        }
        
        set({ loading: true, error: null });
        try {
          console.log('🔍 [STORE] Fetching service ID:', serviceId);
          const result = await ServiceController.fetchService(serviceId);
          
          if (result.success) {
            console.log('✅ [STORE] Service fetched:', result.data);
            set({ currentService: result.data, loading: false });
          } else {
            console.error('❌ [STORE] Failed to fetch service:', result.error);
            set({ error: result.error, loading: false });
          }
          
          return result;
        } catch (error) {
          console.error('❌ [STORE] Error in fetchService:', error);
          set({ 
            error: error.message || 'Failed to fetch service', 
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },
      


      createService: async (formData) => {
        set({ loading: true, error: null });
        
        try {
          console.log('🏪 [STORE] Creating service with formData');
          
          // Debug: Log FormData contents before sending
          console.log('🔍 [STORE] FormData verification before sending:');
          let hasTitle = false;
          for (let [key, value] of formData.entries()) {
            console.log(`  ${key}:`, value instanceof File ? `File: ${value.name}` : value);
            if (key === 'title') hasTitle = true;
          }
          
          if (!hasTitle) {
            console.error('❌ [STORE] Title is missing in FormData!');
            set({ error: 'Title is required', loading: false });
            return { success: false, error: 'Title is required' };
          }
          
          // Extract title for debugging
          const title = formData.get('title');
          console.log('📝 [STORE] Title value:', title);
          
          // Call the controller
          console.log('📤 [STORE] Calling ServiceController.createService()');
          const result = await ServiceController.createService(formData);
          
          console.log('📨 [STORE] Controller returned:', result);
          
          // Check if result is undefined
          if (!result) {
            console.error('❌ [STORE] Controller returned undefined!');
            set({ 
              error: 'Server did not return a response', 
              loading: false 
            });
            return { 
              success: false, 
              error: 'Server did not return a response' 
            };
          }
          
          // Check if result has success property
          if (result.success === undefined) {
            console.error('❌ [STORE] Result missing success property:', result);
            set({ 
              error: 'Invalid response from server', 
              loading: false 
            });
            return { 
              success: false, 
              error: 'Invalid response from server' 
            };
          }
          
          if (result.success) {
            console.log('✅ [STORE] Service created successfully:', result.data);
            set((state) => ({
              services: [...state.services, result.data],
              loading: false,
              error: null
            }));
            
            // Refresh services list
            await get().fetchServices();
          } else {
            console.error('❌ [STORE] Controller returned error:', result.error);
            set({ error: result.error, loading: false });
          }
          
          return result;
        } catch (error) {
          console.error('❌ [STORE] Error in createService:', error);
          console.error('❌ Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
          });
          set({ 
            error: error.message || 'Failed to create service', 
            loading: false 
          });
          return { 
            success: false, 
            error: error.message || 'Failed to create service' 
          };
        }
      },    
      // Update service
      updateService: async (serviceId, formData) => {
        if (!serviceId) {
          console.error('❌ [STORE] No serviceId provided to updateService');
          set({ error: 'Service ID is required', loading: false });
          return { success: false, error: 'Service ID is required' };
        }
        
        set({ loading: true, error: null });
        
        try {
          console.log('🏪 [STORE] Updating service ID:', serviceId);
          
          // Debug: Log FormData contents before sending
          console.log('🔍 [STORE] FormData verification before sending:');
          for (let [key, value] of formData.entries()) {
            console.log(`  ${key}:`, value instanceof File ? `File: ${value.name}` : value);
          }
          
          const result = await ServiceController.updateService(serviceId, formData);
          
          if (result.success) {
            console.log('✅ [STORE] Service updated successfully:', result.data);
            set((state) => ({
              services: state.services.map(service => 
                service.serviceId === serviceId ? result.data : service
              ),
              currentService: state.currentService?.serviceId === serviceId ? result.data : state.currentService,
              loading: false,
              error: null
            }));
            
            // Refresh the current service
            await get().fetchService(serviceId);
          } else {
            console.error('❌ [STORE] Controller returned error:', result.error);
            set({ error: result.error, loading: false });
          }
          
          return result;
        } catch (error) {
          console.error('❌ [STORE] Error in updateService:', error);
          set({ 
            error: error.message || 'Failed to update service', 
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },
      
      // Delete service
      deleteService: async (serviceId) => {
        if (!serviceId) {
          console.error('❌ [STORE] No serviceId provided to deleteService');
          set({ error: 'Service ID is required', loading: false });
          return { success: false, error: 'Service ID is required' };
        }
        
        set({ loading: true, error: null });
        
        try {
          console.log('🗑️ [STORE] Deleting service ID:', serviceId);
          const result = await ServiceController.deleteService(serviceId);
          
          if (result.success) {
            console.log('✅ [STORE] Service deleted successfully');
            set((state) => ({
              services: state.services.filter(service => service.serviceId !== serviceId),
              currentService: state.currentService?.serviceId === serviceId ? null : state.currentService,
              loading: false,
              error: null
            }));
          } else {
            console.error('❌ [STORE] Controller returned error:', result.error);
            set({ error: result.error, loading: false });
          }
          
          return result;
        } catch (error) {
          console.error('❌ [STORE] Error in deleteService:', error);
          set({ 
            error: error.message || 'Failed to delete service', 
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },
      
      // Add related service
      addRelatedService: async (serviceId, relatedServiceId, relationType) => {
        set({ loading: true, error: null });
        
        try {
          console.log('🔗 [STORE] Adding related service:', { serviceId, relatedServiceId, relationType });
          const result = await ServiceController.addRelatedService(serviceId, relatedServiceId, relationType);
          
          if (result.success) {
            console.log('✅ [STORE] Related service added successfully');
            // Refresh current service to get updated related services
            if (get().currentService?.serviceId === serviceId) {
              await get().fetchService(serviceId);
            }
            set({ loading: false, error: null });
          } else {
            console.error('❌ [STORE] Controller returned error:', result.error);
            set({ error: result.error, loading: false });
          }
          
          return result;
        } catch (error) {
          console.error('❌ [STORE] Error in addRelatedService:', error);
          set({ 
            error: error.message || 'Failed to add related service', 
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },
      
      // Remove related service
      removeRelatedService: async (serviceId, relatedServiceId) => {
        set({ loading: true, error: null });
        
        try {
          console.log('🔗 [STORE] Removing related service:', { serviceId, relatedServiceId });
          const result = await ServiceController.removeRelatedService(serviceId, relatedServiceId);
          
          if (result.success) {
            console.log('✅ [STORE] Related service removed successfully');
            // Refresh current service to get updated related services
            if (get().currentService?.serviceId === serviceId) {
              await get().fetchService(serviceId);
            }
            set({ loading: false, error: null });
          } else {
            console.error('❌ [STORE] Controller returned error:', result.error);
            set({ error: result.error, loading: false });
          }
          
          return result;
        } catch (error) {
          console.error('❌ [STORE] Error in removeRelatedService:', error);
          set({ 
            error: error.message || 'Failed to remove related service', 
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },
      
      // Reorder services
      reorderServices: async (orderedServices) => {
        set({ loading: true, error: null });
        
        try {
          console.log('📊 [STORE] Reordering services');
          const result = await ServiceController.reorderServices(orderedServices);
          
          if (result.success) {
            console.log('✅ [STORE] Services reordered successfully');
            set({ services: orderedServices, loading: false, error: null });
          } else {
            console.error('❌ [STORE] Controller returned error:', result.error);
            set({ error: result.error, loading: false });
          }
          
          return result;
        } catch (error) {
          console.error('❌ [STORE] Error in reorderServices:', error);
          set({ 
            error: error.message || 'Failed to reorder services', 
            loading: false 
          });
          return { success: false, error: error.message };
        }
      },
      
      // Clear current service
      clearCurrentService: () => {
        console.log('🧹 [STORE] Clearing current service');
        set({ currentService: null });
      },
      
      // Clear error
      clearError: () => set({ error: null }),
      
      // Get filtered services
      getFilteredServices: () => {
        const { services, searchQuery } = get();
        
        if (!searchQuery.trim()) {
          return services;
        }
        
        const query = searchQuery.toLowerCase();
        return services.filter(service => 
          service.title.toLowerCase().includes(query) ||
          service.subTitle?.toLowerCase().includes(query) ||
          service.description?.toLowerCase().includes(query)
        );
      },
      
      // Get active services only
      getActiveServices: () => {
        const { services } = get();
        return services.filter(service => service.isActive);
      },
      
      // Get services by order
      getOrderedServices: () => {
        const { services } = get();
        return [...services].sort((a, b) => a.order - b.order);
      },
      
      // Find service by ID
      getServiceById: (serviceId) => {
        const { services } = get();
        return services.find(service => service.serviceId === serviceId);
      },
      
      // Clear all data (for debugging)
      clearStore: () => {
        console.log('🧹 [STORE] Clearing all data');
        set({ 
          services: [], 
          currentService: null, 
          loading: false, 
          error: null, 
          searchQuery: '' 
        });
      }
    }),
    {
      name: 'service-storage',
      partialize: (state) => ({ 
        services: state.services,
        currentService: state.currentService 
      }),
      onRehydrateStorage: () => {
        console.log('🔄 [STORE] Storage rehydrated');
        return (state) => {
          if (state) {
            console.log('📦 [STORE] Loaded from storage:', {
              servicesCount: state.services?.length || 0,
              hasCurrentService: !!state.currentService
            });
          }
        };
      }
    }
  )
);

export default useServiceStore;





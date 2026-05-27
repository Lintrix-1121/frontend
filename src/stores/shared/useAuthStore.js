// stores/useAuthStore.js
import { create } from 'zustand';
import AuthService from '../../services/AuthService';

const useAuthStore = create((set, get) => ({
  // State
  user: null,
  isAuthenticated: false,
  isLoading: true,
  lastCheckTime: 0,
  minCheckInterval: 5000, // 5 seconds between checks
  
  // Actions
  // initializeAuth: async () => {
  //   try {
  //     const state = get();
  //     const now = Date.now();
      
  //     // Rate limiting: don't check too frequently
  //     if (now - state.lastCheckTime < state.minCheckInterval) {
  //       console.log('Skipping auth check - too frequent');
  //       return { isAuthenticated: state.isAuthenticated, user: state.user };
  //     }
      
  //     set({ isLoading: true });
      
  //     const authStatus = await AuthService.checkAuth();
      
  //     // Handle null or undefined authStatus
  //     if (!authStatus) {
  //       console.warn('AuthService.checkAuth() returned null or undefined');
  //       const fallbackStatus = { isAuthenticated: false, user: null };
        
  //       set({
  //         user: null,
  //         isAuthenticated: false,
  //         isLoading: false,
  //         lastCheckTime: now
  //       });
        
  //       return fallbackStatus;
  //     }
      
  //     set({
  //       user: authStatus.user || null,
  //       isAuthenticated: authStatus.isAuthenticated || false,
  //       isLoading: false,
  //       lastCheckTime: now
  //     });
      
  //     return authStatus;
  //   } catch (error) {
  //     console.error('Auth initialization error:', error);
      
  //     // Set safe default state
  //     set({ 
  //       user: null, 
  //       isAuthenticated: false, 
  //       isLoading: false 
  //     });
      
  //     return { isAuthenticated: false, user: null };
  //   }
  // },
  initializeAuth: async () => {
    try {
      set({ isLoading: true });
      
      // Check if we have stored auth data
      const storedUser = localStorage.getItem('auth_user');
      const storedToken = localStorage.getItem('auth_token');
      const storedTime = localStorage.getItem('auth_timestamp');
      
      // Check if stored data is recent (within 24 hours)
      const isRecent = storedTime && (Date.now() - parseInt(storedTime) < 24 * 60 * 60 * 1000);
      
      if (storedUser && storedToken && isRecent) {
        try {
          const user = JSON.parse(storedUser);
          
          // Validate stored user has required fields
          if (user && user.id && user.email && user.role) {
            set({
              user: {
                ...user,
                role: user.role || 'user' // Ensure role exists
              },
              isAuthenticated: true,
              isLoading: false,
              lastCheckTime: Date.now()
            });
            
            // Verify with server in background
            AuthService.checkAuth().then(authStatus => {
              if (authStatus?.isAuthenticated && authStatus.user) {
                set({
                  user: {
                    ...authStatus.user,
                    role: authStatus.user.role || user.role || 'user'
                  },
                  lastCheckTime: Date.now()
                });
              }
            }).catch(() => {
              // Silent fail - we still have stored data
            });
            
            return { success: true, fromCache: true };
          }
        } catch (parseError) {
          console.warn('Failed to parse stored user:', parseError);
          // Clear invalid stored data
          localStorage.removeItem('auth_user');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_timestamp');
        }
      }
      
      // No valid stored data, check with server
      const authStatus = await AuthService.checkAuth();
      
      if (authStatus?.isAuthenticated && authStatus.user) {
        const user = {
          ...authStatus.user,
          role: authStatus.user.role || 'user' // Default role if not provided
        };
        
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          lastCheckTime: Date.now()
        });
        
        // Store for future
        try {
          localStorage.setItem('auth_user', JSON.stringify(user));
          localStorage.setItem('auth_timestamp', Date.now().toString());
        } catch (storageError) {
          console.warn('Failed to save auth data:', storageError);
        }
        
        return { success: true };
      }
      
      // Not authenticated
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        lastCheckTime: Date.now()
      });
      
      return { success: false, isAuthenticated: false };
      
    } catch (error) {
      console.error('Auth initialization error:', error);
      
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Failed to initialize authentication'
      });
      
      return { 
        success: false, 
        error: error.message || 'Auth initialization failed',
        isAuthenticated: false 
      };
    }
  },


  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await AuthService.login(email, password);
      
      if (response.success) {
        // Get fresh auth status after login to ensure we have the latest user data
        const authStatus = await AuthService.checkAuth();
        
        // Extract user data with proper fallbacks
        const userData = authStatus?.user || response.data?.user || null;
        
        // Ensure we have the user object
        if (!userData) {
          console.warn('Login successful but no user data received');
          set({ 
            isLoading: false,
            error: 'Authentication successful but user data is missing'
          });
          return { 
            success: false, 
            error: 'User data not found after login'
          };
        }
        
        // Extract and validate role
        const userRole = userData.role || 'user'; // Default to 'user' if role not specified
        
        // Validate role is a string
        if (typeof userRole !== 'string') {
          console.error('Invalid role type:', userRole);
          set({ isLoading: false });
          return { 
            success: false, 
            error: 'Invalid user role configuration'
          };
        }
        
        const user = {
          id: userData.id,
          email: userData.email,
          name: userData.name || userData.username || userData.email?.split('@')[0] || 'User',
          role: userRole.toLowerCase(), // Normalize role to lowercase
          avatar: userData.avatar,
          createdAt: userData.createdAt,
          permissions: userData.permissions || [],
          // Add any other relevant user fields
          ...userData
        };
        
        const isAuthenticated = authStatus?.isAuthenticated || true;
        
        set({
          user,
          isAuthenticated,
          isLoading: false,
          lastCheckTime: Date.now(),
          error: null
        });
        
        // Store in localStorage for persistence
        try {
          localStorage.setItem('auth_user', JSON.stringify(user));
          localStorage.setItem('auth_token', response.data?.token || '');
          localStorage.setItem('auth_timestamp', Date.now().toString());
        } catch (storageError) {
          console.warn('Failed to save auth data to localStorage:', storageError);
        }
        
        return { 
          success: true, 
          data: response.data,
          user, // Include user in response for immediate access
          role: user.role // Explicitly include role for easy access
        };
      }
      
      // Handle failed login response
      set({ 
        isLoading: false, 
        error: response.message || 'Login failed. Please check your credentials.' 
      });
      
      return { 
        success: false, 
        error: response.message || 'Login failed. Please check your credentials.',
        data: response.data
      };
      
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || 
                      error.response.data?.error || 
                      `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Something else happened
        errorMessage = error.message || 'An unexpected error occurred.';
      }
      
      set({ 
        isLoading: false, 
        error: errorMessage 
      });
      
      return { 
        success: false, 
        error: errorMessage,
        details: error.response?.data || null
      };
    }
  },

  logout: () => {
    AuthService.logout();
    set({ 
      user: null, 
      isAuthenticated: false, 
      isLoading: false,
      lastCheckTime: 0
    });
  },



  register: async (userData) => {
    try {
      set({ isLoading: true });
      const response = await AuthService.register(userData);
      
      if (response.success) {
        set({ isLoading: false });
        return { 
          success: true, 
          data: response.data,
          message: response.message || 'Registration successful'
        };
      } else {
        set({ isLoading: false });
        return { 
          success: false, 
          error: response.message || 'Registration failed' 
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      set({ isLoading: false });
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Registration failed' 
      };
    }
  },
 
  // Force refresh auth status
  refreshAuth: async () => {
    const state = get();
    const now = Date.now();
    
    // Reset last check time to force a new check
    set({ lastCheckTime: 0 });
    
    return await state.initializeAuth();
  },

  // Get current state safely
  getAuthState: () => {
    const state = get();
    return {
      user: state.user || null,
      isAuthenticated: state.isAuthenticated || false,
      isLoading: state.isLoading || false
    };
  }
}));

export default useAuthStore;




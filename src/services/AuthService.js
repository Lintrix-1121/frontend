// services/AuthService.js
import api from './api';

class AuthService {
  constructor() {
    this.isCheckingAuth = false;
    this.cachedAuthStatus = null;
    this.cacheExpiry = 30000; // 30 seconds
    this.lastCheckTime = 0;
  }

  // Set auth headers
  setAuthHeader(token) {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }

  // Login
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { user, accessToken } = response.data.data;
        
        // Store in localStorage
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Set auth header for future requests
        this.setAuthHeader(accessToken);
        
        // Update cache
        this.cachedAuthStatus = {
          isAuthenticated: true,
          user: user
        };
        this.lastCheckTime = Date.now();
        
        return response.data;
      }
      
      throw new Error(response.data.message || 'Login failed');
      
    } catch (error) {
      this.clearAuth();
      throw error;
    }
  }



  async register (userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Registration successful'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
        error: error
      };
    }
  }

  

  // Check authentication status with caching - ALWAYS returns object
  async checkAuth() {
    // Check cache first
    const now = Date.now();
    if (this.cachedAuthStatus && (now - this.lastCheckTime) < this.cacheExpiry) {
      console.log('Returning cached auth status');
      return this.cachedAuthStatus;
    }

    // Prevent multiple simultaneous checks
    if (this.isCheckingAuth) {
      console.log('Auth check already in progress');
      return this.cachedAuthStatus || { isAuthenticated: false, user: null };
    }

    try {
      this.isCheckingAuth = true;
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        const result = { isAuthenticated: false, user: null };
        this.cachedAuthStatus = result;
        this.lastCheckTime = now;
        return result;
      }
      
      // Set auth header
      this.setAuthHeader(token);
      
      // Verify token by calling /auth/me
      const response = await api.get('/auth/me');
      
      let result;
      if (response.data.success && response.data.data) {
        result = {
          isAuthenticated: true,
          user: response.data.data
        };
      } else {
        result = { isAuthenticated: false, user: null };
        this.clearAuth();
      }
      
      this.cachedAuthStatus = result;
      this.lastCheckTime = Date.now();
      return result;
      
    } catch (error) {
      console.error('Auth check error:', error.message);
      
      // Don't clear cache on network errors, only on auth errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        this.clearAuth();
      }
      
      // ALWAYS return an object, never null
      const result = { isAuthenticated: false, user: null };
      this.cachedAuthStatus = result;
      return result;
    } finally {
      this.isCheckingAuth = false;
    }
  }

  // Clear authentication data
  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    this.setAuthHeader(null);
    this.cachedAuthStatus = { isAuthenticated: false, user: null };
    this.lastCheckTime = 0;
  }

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Get token
  getToken() {
    return localStorage.getItem('token');
  }

  // Get userId
  getUserId() {
    const user = this.getCurrentUser();
    return user ? user.userId : null;
  }
}

export default new AuthService();


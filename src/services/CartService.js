import api from './api';
import CartModel from '../models/CartModel';

class CartService {
  constructor() {
    this.sessionId = this.getOrCreateSessionId();
  }



  // Get or create session ID for guest users
  getOrCreateSessionId() {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = 'session_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  // Get user ID from auth state (if logged in)
  getUserId() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.userId || null;
  }

  // Get current session ID
  getSessionId() {
    return this.sessionId;
  }

  // Get user's cart - handles both authenticated and guest users
  async getCart() {
    try {
      const userId = this.getUserId();
      const sessionId = this.getSessionId();
      
      console.log('🛒 CartService: Getting cart', { userId, hasSessionId: !!sessionId });
      
      let config = {};
      
      if (userId) {
        config = {
          headers: {
            'X-User-ID': userId
          }
        };
      } else {
        config = {
          headers: {
            'X-Session-ID': sessionId
          }
        };
      }
      
      const response = await api.get('/cart', config);
      console.log('🛒 CartService: API response received', response.data);
      
      // Handle different response structures
      let cartData = {};
      
      if (response.data) {
        if (response.data.success === false) {
          console.warn('Cart API returned error:', response.data.message);
          return this.createGuestCart();
        }
        
        cartData = response.data.data || response.data;
      }
      
      // Validate cart data has required structure
      if (!cartData || typeof cartData !== 'object') {
        console.warn('Invalid cart data structure, creating guest cart');
        return this.createGuestCart();
      }
      
      return CartModel.fromApi(cartData);
      
    } catch (error) {
      console.error('❌ CartService: Error fetching cart:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // Return empty cart instead of trying to create guest cart
      return new CartModel({
        userId: this.getUserId(),
        sessionId: this.getSessionId(),
        items: [],
        totalAmount: 0,
        itemCount: 0
      });
    }
  }
 
  // Create a guest cart if it doesn't exist
  async createGuestCart() {
    try {
      const sessionId = this.getSessionId();
      console.log('🛒 CartService: Creating guest cart with sessionId:', sessionId);
      
      const response = await api.post('/cart/guest', { sessionId });
      console.log('🛒 CartService: Guest cart created:', response.data);
      
      // Validate response
      if (!response.data) {
        console.warn('No data in guest cart response');
        return new CartModel({ sessionId, items: [], totalAmount: 0, itemCount: 0 });
      }
      
      const cartData = response.data.data || response.data;
      return CartModel.fromApi(cartData);
      
    } catch (error) {
      console.error('❌ CartService: Error creating guest cart:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // Return empty cart with session ID
      return new CartModel({
        sessionId: this.getSessionId(),
        items: [],
        totalAmount: 0,
        itemCount: 0
      });
    }
  }


  // Add item to cart
 async addToCart(productId, quantity = 1) {
  try {
    console.log('=== CARTSERVICE.ADDTOCART ===');
    console.log('Received productId:', productId);
    console.log('productId type:', typeof productId);
    console.log('productId value:', JSON.stringify(productId));
    console.log('quantity:', quantity);
    
    const userId = this.getUserId();
    const sessionId = this.getSessionId();
    console.log('User context:', { userId, sessionId });
    
    // Validate productId - MORE DETAILED
    if (productId === undefined) {
      console.error('❌ productId is undefined');
      throw new Error('Product ID is required (undefined)');
    }
    
    if (productId === null) {
      console.error('❌ productId is null');
      throw new Error('Product ID is required (null)');
    }
    
    if (!productId) {
      console.error('❌ productId is falsy:', productId);
      throw new Error('Product ID is required (falsy)');
    }
    
    // Ensure productId is a string or number
    const validatedProductId = String(productId).trim();
    console.log('Validated productId:', validatedProductId);
    
    if (!validatedProductId) {
      console.error('❌ productId is empty after validation');
      throw new Error('Valid Product ID is required');
    }
    
    const data = { 
      productId: validatedProductId,
      quantity: Number(quantity) || 1 
    };
    
    // Include session ID for guest users
    if (!userId) {
      data.sessionId = sessionId;
    }
    
    console.log('Sending to API:', data);
    
    const response = await api.post('/cart/add', data);
    console.log('API response:', response.data);
    
    return CartModel.fromApi(response.data.data);
    
    } catch (error) {
      console.error('❌ CartService.addToCart ERROR DETAILS:');
      console.error('Error message:', error.message);
      console.error('Error type:', error.constructor.name);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
      }
      
      throw error;
    }
  }
  
  // Update cart item quantity
  async updateCartItem(productId, quantity) {
    try {
      const userId = this.getUserId();
      const sessionId = this.getSessionId();
      
      const data = { productId, quantity };
      
      // Include session ID for guest users
      if (!userId) {
        data.sessionId = sessionId;
      }
      
      const response = await api.put('/cart/update', data);
      return CartModel.fromApi(response.data.data);
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  }

  // Remove item from cart
  async removeFromCart(productId) {
    try {
      const userId = this.getUserId();
      const sessionId = this.getSessionId();
      
      const data = { productId };
      
      // Include session ID for guest users
      if (!userId) {
        data.sessionId = sessionId;
      }
      
      const response = await api.delete('/cart/remove', { data });
      return CartModel.fromApi(response.data.data);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  // Clear cart
  async clearCart() {
    try {
      const userId = this.getUserId();
      const sessionId = this.getSessionId();
      
      const data = {};
      
      // Include session ID for guest users
      if (!userId) {
        data.sessionId = sessionId;
      }
      
      await api.delete('/cart/clear', { data });
      return new CartModel({ items: [], totalAmount: 0, itemCount: 0 });
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  // Apply coupon
  async applyCoupon(couponCode) {
    try {
      const userId = this.getUserId();
      const sessionId = this.getSessionId();
      
      const data = { couponCode };
      
      // Include session ID for guest users
      if (!userId) {
        data.sessionId = sessionId;
      }
      
      const response = await api.post('/cart/apply-coupon', data);
      return CartModel.fromApi(response.data.data);
    } catch (error) {
      console.error('Error applying coupon:', error);
      throw error;
    }
  }

  // Remove coupon
  async removeCoupon() {
    try {
      const userId = this.getUserId();
      const sessionId = this.getSessionId();
      
      const data = {};
      
      // Include session ID for guest users
      if (!userId) {
        data.sessionId = sessionId;
      }
      
      const response = await api.delete('/cart/remove-coupon', { data });
      return CartModel.fromApi(response.data.data);
    } catch (error) {
      console.error('Error removing coupon:', error);
      throw error;
    }
  }

  // Get cart summary for checkout
  async getCartSummary() {
    try {
      const userId = this.getUserId();
      const sessionId = this.getSessionId();
      
      let config = {};
      
      if (userId) {
        config.headers = { 'X-User-ID': userId };
      } else {
        config.headers = { 'X-Session-ID': sessionId };
      }
      
      const response = await api.get('/cart/summary', config);
      return response.data.data;
    } catch (error) {
      console.error('Error getting cart summary:', error);
      throw error;
    }
  }

  // Merge guest cart with user cart after login
  async mergeCarts(userId) {
    try {
      const sessionId = this.getSessionId();
      const response = await api.post('/cart/merge', { userId, sessionId });
      
      // Clear session ID after merge
      localStorage.removeItem('sessionId');
      this.sessionId = null;
      
      return CartModel.fromApi(response.data.data);
    } catch (error) {
      console.error('Error merging carts:', error);
      throw error;
    }
  }

  // Transfer guest cart to user (when guest registers)
  async transferCart(userId) {
    try {
      const sessionId = this.getSessionId();
      const response = await api.post('/cart/transfer', { userId, sessionId });
      
      // Clear session ID after transfer
      localStorage.removeItem('sessionId');
      this.sessionId = null;
      
      return CartModel.fromApi(response.data.data);
    } catch (error) {
      console.error('Error transferring cart:', error);
      throw error;
    }
  }

  // Update shipping and tax
  async updateShippingTax(shippingAmount = 0, taxAmount = 0) {
    try {
      const userId = this.getUserId();
      const sessionId = this.getSessionId();
      
      const data = { shippingAmount, taxAmount };
      
      // Include session ID for guest users
      if (!userId) {
        data.sessionId = sessionId;
      }
      
      const response = await api.put('/cart/shipping-tax', data);
      return CartModel.fromApi(response.data.data);
    } catch (error) {
      console.error('Error updating shipping/tax:', error);
      throw error;
    }
  }
}

export default new CartService();




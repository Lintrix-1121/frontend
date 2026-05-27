// stores/useCartStore.js - FIXED VERSION
import { create } from 'zustand';
import CartService from '../../services/CartService';
import CartModel from '../../models/CartModel';

const useCartStore = create((set, get) => ({
  cart: new CartModel({ items: [], totalAmount: 0, itemCount: 0 }),
  isLoading: false,
  error: null,
  isInitialized: false,

  // Initialize store
  initialize: async () => {
    try {
      console.log('🛒 CartStore: Initializing...');
      await get().loadCart();
      set({ isInitialized: true });
      console.log('✅ CartStore: Initialized successfully');
    } catch (error) {
      console.error('❌ CartStore: Initialization failed:', error);
      set({ error: error.message, isInitialized: true });
    }
  },

  // Load cart from API
  loadCart: async () => {
    try {
      set({ isLoading: true, error: null });
      const cart = await CartService.getCart();
      console.log('🛒 CartStore: Cart loaded with', cart.items.length, 'items');
      set({ cart, isLoading: false });
    } catch (error) {
      console.error('❌ CartStore: Error loading cart:', error);
      // Don't set error here, just keep empty cart
      set({ 
        cart: new CartModel({ items: [], totalAmount: 0, itemCount: 0 }), 
        isLoading: false 
      });
    }
  },

  // Add item to cart - FIXED!
  addToCart: async (product, quantity = 1) => {
    try {
      console.log('🛒 CartStore.addToCart called with product:', product);
      console.log('Product keys:', product ? Object.keys(product) : 'No product');
      
      // Get product ID from either productId or id
      const productId = product?.productId || product?.id;
      console.log('Extracted productId:', productId);
      
      if (!productId) {
        throw new Error('Product ID is missing from product object');
      }
      
      set({ isLoading: true, error: null });
      
      console.log('🛒 Calling CartService.addToCart with:', { productId, quantity });
      const cart = await CartService.addToCart(productId, quantity);
      
      console.log('✅ CartService response received');
      set({ cart, isLoading: false });
      
      return { success: true, message: 'Product added to cart', cart };
      
    } catch (error) {
      console.error('❌ CartStore.addToCart error:', error.message);
      const errorMsg = error.message || 'Failed to add to cart';
      set({ error: errorMsg, isLoading: false });
      return { success: false, message: errorMsg };
    }
  },

  // Update item quantity
  updateQuantity: async (productId, quantity) => {
    try {
      set({ isLoading: true, error: null });
      const cart = await CartService.updateCartItem(productId, quantity);
      set({ cart, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Remove item from cart
  removeFromCart: async (productId) => {
    try {
      set({ isLoading: true, error: null });
      const cart = await CartService.removeFromCart(productId);
      set({ cart, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      set({ isLoading: true, error: null });
      await CartService.clearCart();
      set({ 
        cart: new CartModel({ items: [], totalAmount: 0, itemCount: 0 }), 
        isLoading: false 
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Check if product is in cart
  isInCart: (productId) => {
    const { cart } = get();
    return cart.items.some(item => item.productId === productId);
  },

  // Get cart item quantity
  getItemQuantity: (productId) => {
    const { cart } = get();
    const item = cart.items.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  },

  // Get cart item (including product details)
  getCartItem: (productId) => {
    const { cart } = get();
    return cart.items.find(item => item.productId === productId);
  }
}));

export default useCartStore;



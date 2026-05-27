// models/CartModel.js - FIXED VERSION
class CartModel {
  constructor(data = {}) { // Add default empty object
    this.id = data?.cartId || data?.id || null;
    this.userId = data?.userId || null;
    this.items = Array.isArray(data?.items) ? data.items : [];
    this.totalAmount = parseFloat(data?.totalAmount) || 0;
    this.itemCount = data?.itemCount || this.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    this.discountAmount = parseFloat(data?.discountAmount) || 0;
    this.shippingAmount = parseFloat(data?.shippingAmount) || 0;
    this.taxAmount = parseFloat(data?.taxAmount) || 0;
    this.grandTotal = parseFloat(data?.grandTotal) || this.totalAmount;
    this.couponCode = data?.couponCode || null;
  }

  static fromApi(data) {
    if (!data) {
      console.warn('CartModel.fromApi: Received null/undefined data, returning empty cart');
      return new CartModel({});
    }
    return new CartModel(data);
  }

  getItem(productId) {
    return this.items.find(item => item.productId === productId);
  }

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
  }
 
  addItem(product, quantity = 1) {
    const existingItem = this.getItem(product.id);
    
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 0) + quantity;
      existingItem.total = (existingItem.price || 0) * existingItem.quantity;
    } else {
      this.items.push({
        productId: product.id,
        product: product, // Store the full product object for reference
        name: product.name,
        price: product.price || 0,
        thumbnail: product.thumbnail,
        quantity: quantity,
        total: (product.price || 0) * quantity,
        addedAt: new Date().toISOString()
      });
    }
    
    this.recalculate();
  }

  updateQuantity(productId, quantity) {
    const item = this.getItem(productId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
        item.total = (item.price || 0) * quantity;
        this.recalculate();
      }
    }
  }

  removeItem(productId) {
    this.items = this.items.filter(item => item.productId !== productId);
    this.recalculate();
  }

  clear() {
    this.items = [];
    this.recalculate();
  }

  recalculate() {
    this.itemCount = this.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const subtotal = this.getSubtotal();
    this.totalAmount = subtotal;
    this.grandTotal = subtotal - this.discountAmount + this.shippingAmount + this.taxAmount;
  }
}

export default CartModel;


// class CartModel {
//   constructor(data) {
//     this.id = data.cartId || data.id;
//     this.userId = data.userId;
//     this.items = data.items || [];
//     this.totalAmount = parseFloat(data.totalAmount) || 0;
//     this.itemCount = data.itemCount || 0;
//     this.discountAmount = parseFloat(data.discountAmount) || 0;
//     this.shippingAmount = parseFloat(data.shippingAmount) || 0;
//     this.taxAmount = parseFloat(data.taxAmount) || 0;
//     this.grandTotal = parseFloat(data.grandTotal) || 0;
//     this.couponCode = data.couponCode;
//   }

//   static fromApi(data) {
//     return new CartModel(data);
//   }

//   getItem(productId) {
//     return this.items.find(item => item.productId === productId);
//   }

//   getSubtotal() {
//     return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//   }
 
//   addItem(product, quantity = 1) {
//     const existingItem = this.getItem(product.id);
    
//     if (existingItem) {
//       existingItem.quantity += quantity;
//       existingItem.total = existingItem.price * existingItem.quantity;
//     } else {
//       this.items.push({
//         productId: product.id,
//         name: product.name,
//         price: product.price,
//         thumbnail: product.thumbnail,
//         quantity: quantity,
//         total: product.price * quantity,
//         addedAt: new Date().toISOString()
//       });
//     }
    
//     this.recalculate();
//   }

//   updateQuantity(productId, quantity) {
//     const item = this.getItem(productId);
    
//     if (item) {
//       if (quantity <= 0) {
//         this.removeItem(productId);
//       } else {
//         item.quantity = quantity;
//         item.total = item.price * quantity;
//         this.recalculate();
//       }
//     }
//   }

//   removeItem(productId) {
//     this.items = this.items.filter(item => item.productId !== productId);
//     this.recalculate();
//   }

//   clear() {
//     this.items = [];
//     this.recalculate();
//   }

//   recalculate() {
//     this.itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
//     const subtotal = this.getSubtotal();
//     this.totalAmount = subtotal;
//     this.grandTotal = subtotal - this.discountAmount + this.shippingAmount + this.taxAmount;
//   }
// }

// export default CartModel;



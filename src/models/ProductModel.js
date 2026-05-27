class ProductModel {
  constructor(data) {
    this.id = data.productId || data.id;
    this.name = data.name;
    this.description = data.description;
    this.sku = data.sku;
    this.price = parseFloat(data.price);
    this.comparePrice = data.comparePrice ? parseFloat(data.comparePrice) : null;
    this.quantity = data.quantity;
    this.categoryId = data.categoryId;
    this.subCategoryId = data.subCategoryId;
    this.brand = data.brand;
    this.images = data.images || [];
    this.thumbnail = data.thumbnail;
    this.isFeatured = data.isFeatured || false;
    this.isOnSale = data.isOnSale || false;
    this.salePrice = data.salePrice ? parseFloat(data.salePrice) : null;
    this.tags = data.tags || [];
    this.specifications = data.specifications || {};
    
    // Calculate sale price if applicable
    if (this.isOnSale && this.salePrice) {
      this.displayPrice = this.salePrice;
    } else {
      this.displayPrice = this.price;
    }
    
    // Check if in stock
    this.inStock = this.quantity > 0;
  }
 
  static fromApi(data) {
    return new ProductModel(data);
  } 

  static fromArray(dataArray) {
    return dataArray.map(item => ProductModel.fromApi(item));
  }

  getDiscountPercentage() {
    if (this.comparePrice && this.comparePrice > this.price) {
      const discount = ((this.comparePrice - this.price) / this.comparePrice) * 100;
      return Math.round(discount);
    }
    return 0;
  }

  isOnSaleNow() {
    if (!this.isOnSale) return false;
    
    const now = new Date();
    const saleStart = this.saleStart ? new Date(this.saleStart) : null;
    const saleEnd = this.saleEnd ? new Date(this.saleEnd) : null;
    
    if (saleStart && saleEnd) {
      return now >= saleStart && now <= saleEnd;
    }
    
    return this.isOnSale;
  }
}

export default ProductModel;


class AdminProductModel {
  constructor(data) {
    this.id = data.productId || data.id;
    this.name = data.name;
    this.sku = data.sku;
    this.price = parseFloat(data.price);
    this.comparePrice = data.comparePrice ? parseFloat(data.comparePrice) : null;
    this.cost = data.cost ? parseFloat(data.cost) : null;
    this.quantity = parseInt(data.quantity) || 0;
    this.categoryId = data.categoryId;
    this.subCategoryId = data.subCategoryId;
    this.brand = data.brand;
    this.images = data.images || [];
    this.thumbnail = data.thumbnail;
    this.description = data.description;
    this.specifications = data.specifications || {};
    this.tags = data.tags || [];
    this.isActive = Boolean(data.isActive);
    this.isFeatured = Boolean(data.isFeatured);
    this.isOnSale = Boolean(data.isOnSale);
    this.salePrice = data.salePrice ? parseFloat(data.salePrice) : null;
    this.saleStart = data.saleStart ? new Date(data.saleStart) : null;
    this.saleEnd = data.saleEnd ? new Date(data.saleEnd) : null;
    this.weight = data.weight ? parseFloat(data.weight) : null;
    this.dimensions = data.dimensions || {};
    this.metaTitle = data.metaTitle;
    this.metaDescription = data.metaDescription;
    this.odooProductId = data.odooProductId;
    this.odooTemplateId = data.odooTemplateId;
    this.odooVariantId = data.odooVariantId;
    this.lastSyncedAt = data.lastSyncedAt ? new Date(data.lastSyncedAt) : null;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
    
    // Calculated fields
    this.margin = this.cost ? ((this.price - this.cost) / this.price * 100) : null;
    this.lowStock = this.quantity <= 10;
    this.outOfStock = this.quantity === 0;
  }

  static fromApi(data) {
    return new AdminProductModel(data);
  }

  static fromArray(dataArray) {
    return dataArray.map(item => AdminProductModel.fromApi(item));
  }

  getProfitMargin() {
    if (!this.cost) return null;
    return ((this.price - this.cost) / this.cost * 100).toFixed(2);
  }

  getInventoryValue() {
    return this.price * this.quantity;
  }

  validate() {
    const errors = {};
    
    if (!this.name || this.name.trim() === '') {
      errors.name = 'Product name is required';
    }
    
    if (!this.sku || this.sku.trim() === '') {
      errors.sku = 'SKU is required';
    }
    
    if (!this.price || this.price < 0) {
      errors.price = 'Valid price is required';
    }
    
    if (this.quantity < 0) {
      errors.quantity = 'Quantity cannot be negative';
    }
    
    if (this.comparePrice && this.comparePrice <= this.price) {
      errors.comparePrice = 'Compare price must be greater than price';
    }
    
    if (this.salePrice && this.salePrice >= this.price) {
      errors.salePrice = 'Sale price must be less than regular price';
    }
    
    if (this.saleStart && this.saleEnd && this.saleStart >= this.saleEnd) {
      errors.saleEnd = 'Sale end date must be after start date';
    }
    
    return errors;
  }

  toApiPayload() {
    return {
      name: this.name,
      sku: this.sku,
      price: this.price,
      comparePrice: this.comparePrice,
      cost: this.cost,
      quantity: this.quantity,
      categoryId: this.categoryId,
      subCategoryId: this.subCategoryId,
      brand: this.brand,
      images: this.images,
      thumbnail: this.thumbnail,
      description: this.description,
      specifications: this.specifications,
      tags: this.tags,
      isActive: this.isActive,
      isFeatured: this.isFeatured,
      isOnSale: this.isOnSale,
      salePrice: this.salePrice,
      saleStart: this.saleStart,
      saleEnd: this.saleEnd, 
      weight: this.weight,
      dimensions: this.dimensions,
      metaTitle: this.metaTitle,
      metaDescription: this.metaDescription
    };
  }
}

export default AdminProductModel; 
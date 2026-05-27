class CategoryModel {
  constructor(data) {
    this.id = data.categoryId || data.id;
    this.name = data.name;
    this.slug = data.slug;
    this.description = data.description;
    this.parentId = data.parentId;
    this.image = data.image;
    this.isActive = data.isActive || true;
    this.displayOrder = data.displayOrder || 0;
    this.productCount = data.productCount || 0;
    this.children = [];
  }
 
  static fromApi(data) {
    return new CategoryModel(data);
  }

  static fromArray(dataArray) {
    return dataArray.map(item => CategoryModel.fromApi(item));
  }

  buildHierarchy(categories) {
    const categoryMap = new Map();
    const rootCategories = [];
    
    // Create map of all categories
    categories.forEach(cat => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });
    
    // Build hierarchy
    categories.forEach(cat => {
      const category = categoryMap.get(cat.id);
      if (cat.parentId && categoryMap.has(cat.parentId)) {
        categoryMap.get(cat.parentId).children.push(category);
      } else {
        rootCategories.push(category);
      }
    });
    
    return rootCategories;
  }
}

export default CategoryModel;



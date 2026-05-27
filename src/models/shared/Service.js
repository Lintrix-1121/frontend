export class Service {
  constructor(data = {}) {
    this.serviceId = data.serviceId || 0;
    this.title = data.title || '';
    this.subTitle = data.subTitle || '';
    this.description = data.description || '';
    this.icon = data.icon || '';
    this.image = data.image || '';
    this.imageUrl = data.imageUrl || '';
    this.order = data.order || 0;
    this.isActive = data.isActive ?? true;
    this.createdAt = data.createdAt || '';
    this.updatedAt = data.updatedAt || '';
    this.relatedServices = data.relatedServices || [];
  }

  static createFromForm(formData) {
    return new Service({
      title: formData.title,
      subTitle: formData.subTitle,
      description: formData.description,
      icon: formData.icon,
      order: parseInt(formData.order) || 0,
      isActive: formData.isActive ?? true,
    });
  }

  toFormData(imageFile = null) {
    const formData = new FormData();
    formData.append('title', this.title);
    if (this.subTitle) formData.append('subTitle', this.subTitle);
    if (this.description) formData.append('description', this.description);
    if (this.icon) formData.append('icon', this.icon);
    formData.append('order', this.order.toString());
    formData.append('isActive', this.isActive.toString());
    if (imageFile) {
      formData.append('image', imageFile);
    }
    return formData;
  }
}

export class RelatedService {
  constructor(data = {}) {
    this.relationId = data.relationId || 0;
    this.serviceId = data.serviceId || 0;
    this.relatedServiceId = data.relatedServiceId || 0;
    this.relationType = data.relationType || 'similar';
    this.order = data.order || 0;
  }
}



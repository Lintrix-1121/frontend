import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  XMarkIcon, 
  PhotoIcon, 
  TagIcon, 
  InformationCircleIcon,
  TrashIcon,
  StarIcon,
  StarIcon as StarIconSolid
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconFilled } from '@heroicons/react/24/solid';

const ProductForm = ({ product, onSubmit, onCancel, isSubmitting = false }) => {
  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm({
    defaultValues: product || {}
  });

  const [images, setImages] = useState(product?.images || []);
  const [specifications, setSpecifications] = useState(
    product?.specifications || {
      material: '',
      dimensions: '',
      warranty: '',
      color: ''
    } 
  );
  const [tags, setTags] = useState(product?.tags || []);
  const [currentTag, setCurrentTag] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [thumbnailIndex, setThumbnailIndex] = useState(product?.thumbnail ? 
    images.findIndex(img => img.url === product.thumbnail) : 0);

  const isOnSale = watch('isOnSale');
  const watchImages = watch('images');

  // Initialize form with product data

  useEffect(() => {
    if (product) {
      console.log('📥 Initializing form with product data:', product);
      
      // Create a complete form data object
      const formData = {
        name: product.name || '',
        sku: product.sku || '',
        price: product.price || '',
        comparePrice: product.comparePrice || '',
        quantity: product.quantity || '',
        description: product.description || '',
        isOnSale: product.isOnSale || false,
        salePrice: product.salePrice || '',
        metaTitle: product.metaTitle || '',
        metaDescription: product.metaDescription || '',
        brand: product.brand || '',
        categoryId: product.categoryId || '',
        subCategoryId: product.subCategoryId || '',
        cost: product.cost || '',
        weight: product.weight || '',
        isActive: product.isActive !== undefined ? product.isActive : true,
        isFeatured: product.isFeatured || false,
        dimensions: product.dimensions || {},
        saleStart: product.saleStart || null,
        saleEnd: product.saleEnd || null,
        thumbnail: product.thumbnail || '',
      };

      // Reset the form with all values at once
      reset(formData);
      
      // Set non-form state
      setImages(product.images || []);
      setSpecifications(product.specifications || {});
      setTags(product.tags || []);
      
      // Set thumbnail index
      if (product.thumbnail && product.images?.length > 0) {
        const index = product.images.findIndex(img => {
          if (typeof img === 'string') return img === product.thumbnail;
          if (typeof img === 'object' && img.url) return img.url === product.thumbnail;
          return false;
        });
        if (index !== -1) {
          setThumbnailIndex(index);
          // Also update images array to mark thumbnail
          setImages(prev => prev.map((img, i) => ({
            ...img,
            isThumbnail: i === index
          })));
        }
      }
    }
  }, [product, reset]); // Use reset instead of setValue


  // useEffect(() => {
  //   if (product) {
  //     setValue('name', product.name || '');
  //     setValue('sku', product.sku || '');
  //     setValue('price', product.price || '');
  //     setValue('comparePrice', product.comparePrice || '');
  //     setValue('quantity', product.quantity || '');
  //     setValue('description', product.description || '');
  //     setValue('isOnSale', product.isOnSale || false);
  //     setValue('salePrice', product.salePrice || '');
  //     setValue('metaTitle', product.metaTitle || '');
  //     setValue('metaDescription', product.metaDescription || '');
  //     setValue('brand', product.brand || '');
  //     setValue('categoryId', product.categoryId || '');
  //     setValue('subCategoryId', product.subCategoryId || '');
  //     setValue('cost', product.cost || '');
  //     setValue('weight', product.weight || '');
      
  //     setImages(product.images || []);
  //     setSpecifications(product.specifications || {});
  //     setTags(product.tags || []);
      
  //     // Set thumbnail index
  //     if (product.thumbnail && product.images) {
  //       const index = product.images.findIndex(img => 
  //         img.url === product.thumbnail || img === product.thumbnail
  //       );
  //       if (index !== -1) setThumbnailIndex(index);
  //     }
  //   }
  // }, [product, setValue]);




  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];
    
    for (const file of files) {
      // Validate file
      try {
        // Create object URL for preview
        const previewUrl = URL.createObjectURL(file);
        newImages.push({
          url: previewUrl,
          file: file,
          originalname: file.name,
          size: file.size,
          mimetype: file.type,
          isThumbnail: false
        });
      } catch (error) {
        console.error('Error processing file:', error);
        alert(`Error with file ${file.name}: ${error.message}`);
      }
    }
    
    // If no thumbnail is set and this is the first image, set it as thumbnail
    if (images.length === 0 && newImages.length > 0) {
      newImages[0].isThumbnail = true;
      setThumbnailIndex(0);
      setValue('thumbnail', newImages[0].url);
    }
    
    setImages([...images, ...newImages]);
    e.target.value = ''; // Reset file input
  };

  const removeImage = (index) => {
    // Revoke object URL to prevent memory leaks
    if (images[index].url.startsWith('blob:')) {
      URL.revokeObjectURL(images[index].url);
    }
    
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    
    // If we're removing the thumbnail, set a new one
    if (index === thumbnailIndex && newImages.length > 0) {
      setThumbnailIndex(0);
      newImages[0].isThumbnail = true;
      setValue('thumbnail', newImages[0].url);
    } else if (newImages.length === 0) {
      setThumbnailIndex(0);
      setValue('thumbnail', '');
    }
  };

  const setAsThumbnail = (index) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isThumbnail: i === index
    }));
    
    setImages(newImages);
    setThumbnailIndex(index);
    setValue('thumbnail', newImages[index].url);
  };

  const handleAddTag = () => {
    const trimmedTag = currentTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setCurrentTag('');
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };


  // In ProductForm.jsx - update the onSubmitForm function
const onSubmitForm = (data) => {
  // Check if we have any images with files
  const hasFilesToUpload = images.some(img => img.file);
  
  if (!hasFilesToUpload) {
    // If no files, just submit the data without images
    const formData = {
      ...data,
      price: parseFloat(data.price) || 0,
      comparePrice: data.comparePrice ? parseFloat(data.comparePrice) : null,
      cost: data.cost ? parseFloat(data.cost) : null,
      quantity: parseInt(data.quantity) || 0,
      salePrice: data.salePrice ? parseFloat(data.salePrice) : null,
      weight: data.weight ? parseFloat(data.weight) : null,
      isActive: data.isActive !== undefined ? data.isActive : true,
      isFeatured: data.isFeatured || false,
      isOnSale: data.isOnSale || false,
      images: [], // Empty array since no files
      specifications: specifications || {},
      tags: tags || [],
      dimensions: data.dimensions || {},
      saleStart: data.saleStart || null,
      saleEnd: data.saleEnd || null,
      metaTitle: data.metaTitle || '',
      metaDescription: data.metaDescription || '',
      brand: data.brand || '',
      categoryId: data.categoryId || null,
      subCategoryId: data.subCategoryId || null
    };
    
    onSubmit(formData);
    return;
  }
  
  // If we have files, we need to handle them differently
  onSubmit({
    ...data,
    price: parseFloat(data.price) || 0,
    comparePrice: data.comparePrice ? parseFloat(data.comparePrice) : null,
    cost: data.cost ? parseFloat(data.cost) : null,
    quantity: parseInt(data.quantity) || 0,
    salePrice: data.salePrice ? parseFloat(data.salePrice) : null,
    weight: data.weight ? parseFloat(data.weight) : null,
    isActive: data.isActive !== undefined ? data.isActive : true,
    isFeatured: data.isFeatured || false,
    isOnSale: data.isOnSale || false,
    // Send images with files only
    images: images.filter(img => img.file).map(img => ({
      file: img.file,
      isThumbnail: img.isThumbnail,
      url: img.url // Keep URL for reference
    })),
    specifications: specifications || {},
    tags: tags || [],
    dimensions: data.dimensions || {},
    saleStart: data.saleStart || null,
    saleEnd: data.saleEnd || null,
    metaTitle: data.metaTitle || '',
    metaDescription: data.metaDescription || '',
    brand: data.brand || '',
    categoryId: data.categoryId || null,
    subCategoryId: data.subCategoryId || null
  });
};

  return (
    <div className="container-xl">
      <form onSubmit={handleSubmit(onSubmitForm)}>
        {/* Tabs */}
        <ul className="nav nav-tabs mb-4">
          {[
            ['basic', 'Basic Info', InformationCircleIcon],
            ['images', 'Images', PhotoIcon],
            ['specifications', 'Specifications', TagIcon],
            ['seo', 'SEO', TagIcon],
            ['advanced', 'Advanced', TagIcon],
          ].map(([id, label, Icon]) => (
            <li className="nav-item" key={id}>
              <button
                type="button"
                className={`nav-link ${activeTab === id ? 'active' : ''}`}
                onClick={() => setActiveTab(id)}
              >
                <Icon className="me-2" style={{ width: 18 }} />
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* BASIC INFO */}
        {activeTab === 'basic' && (
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Product Name *</label>
              <input 
                {...register('name', { required: 'Product name is required' })} 
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                placeholder="Enter product name"
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name.message}</div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">SKU *</label>
              <input 
                {...register('sku', { required: 'SKU is required' })} 
                className={`form-control ${errors.sku ? 'is-invalid' : ''}`}
                placeholder="Enter SKU"
              />
              {errors.sku && (
                <div className="invalid-feedback">{errors.sku.message}</div>
              )}
            </div>

            <div className="col-md-4">
              <label className="form-label">Price *</label>
              <div className="input-group">
                <span className="input-group-text">UGX</span>
                <input 
                  type="number" 
                  step="0.01"
                  {...register('price', { 
                    required: 'Price is required',
                    min: { value: 0, message: 'Price must be positive' }
                  })} 
                  className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                />
                {errors.price && (
                  <div className="invalid-feedback">{errors.price.message}</div>
                )}
              </div>
            </div>

            <div className="col-md-4">
              <label className="form-label">Compare Price</label>
              <div className="input-group">
                <span className="input-group-text">UGX</span>
                <input 
                  type="number" 
                  step="0.01"
                  {...register('comparePrice', { 
                    min: { value: 0, message: 'Compare price must be positive' }
                  })} 
                  className={`form-control ${errors.comparePrice ? 'is-invalid' : ''}`}
                />
              </div>
            </div>

            <div className="col-md-4">
              <label className="form-label">Quantity *</label>
              <input 
                type="number" 
                {...register('quantity', { 
                  required: 'Quantity is required',
                  min: { value: 0, message: 'Quantity cannot be negative' }
                })} 
                className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
              />
              {errors.quantity && (
                <div className="invalid-feedback">{errors.quantity.message}</div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">Brand</label>
              <input 
                {...register('brand')} 
                className="form-control"
                placeholder="Enter brand name"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Cost Price</label>
              <div className="input-group">
                <span className="input-group-text">UGX</span>
                <input 
                  type="number" 
                  step="0.01"
                  {...register('cost')} 
                  className="form-control"
                  placeholder="Product cost"
                />
              </div>
            </div>

            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea 
                {...register('description')} 
                rows="4" 
                className="form-control"
                placeholder="Enter product description"
              />
            </div>

            {/* Sale Section */}
            <div className="col-12">
              <div className="form-check form-switch">
                <input 
                  {...register('isOnSale')} 
                  type="checkbox" 
                  className="form-check-input" 
                  role="switch"
                  id="isOnSale"
                />
                <label className="form-check-label" htmlFor="isOnSale">
                  Put product on sale
                </label>
              </div>
            </div>

            {isOnSale && (
              <>
                <div className="col-md-4">
                  <label className="form-label">Sale Price</label>
                  <div className="input-group">
                    <span className="input-group-text">UGX</span>
                    <input 
                      type="number"
                      step="0.01"
                      {...register('salePrice')} 
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Sale Start Date</label>
                  <input 
                    type="datetime-local"
                    {...register('saleStart')} 
                    className="form-control"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Sale End Date</label>
                  <input 
                    type="datetime-local"
                    {...register('saleEnd')} 
                    className="form-control"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* IMAGES */}
        {activeTab === 'images' && (
          <div className="mb-4">
            <div className="mb-3">
              <label className="form-label">Upload Images</label>
              <input 
                type="file" 
                multiple 
                accept="image/*"
                className="form-control" 
                onChange={handleImageUpload}
              />
              <small className="text-muted">
                Maximum file size: 5MB. Allowed types: JPG, PNG, GIF, WebP
              </small>
            </div>

            {/* Image Gallery */}
            <div className="row g-3">
              {images.length === 0 ? (
                <div className="col-12 text-center py-5">
                  <PhotoIcon className="text-muted mb-3" style={{ width: 48, height: 48 }} />
                  <p className="text-muted">No images uploaded yet</p>
                </div>
              ) : (
                images.map((img, i) => (
                  <div className="col-6 col-md-3" key={i}>
                    <div className="card">
                      <div className="position-relative">
                        <img 
                          src={img.url} 
                          className="card-img-top" 
                          alt={`Product ${i + 1}`}
                          style={{ height: '150px', objectFit: 'cover' }}
                        />
                        {/* Thumbnail Indicator */}
                        {img.isThumbnail && (
                          <div className="position-absolute top-0 start-0 m-2">
                            <span className="badge bg-warning">
                              <StarIconFilled className="me-1" style={{ width: 12, height: 12 }} />
                              Thumbnail
                            </span>
                          </div>
                        )}
                        {/* Action Buttons */}
                        <div className="position-absolute top-0 end-0 m-2">
                          <button
                            type="button"
                            className="btn btn-danger btn-sm me-1"
                            onClick={() => removeImage(i)}
                            title="Remove image"
                          >
                            <TrashIcon style={{ width: 14, height: 14 }} />
                          </button>
                          {!img.isThumbnail && (
                            <button
                              type="button"
                              className="btn btn-warning btn-sm"
                              onClick={() => setAsThumbnail(i)}
                              title="Set as thumbnail"
                            >
                              <StarIcon style={{ width: 14, height: 14 }} />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="card-body p-2">
                        <small className="text-muted d-block truncate">
                          {img.originalname || 'Image'}
                        </small>
                        {img.size && (
                          <small className="text-muted">
                            {(img.size / 1024).toFixed(1)} KB
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Hidden field for thumbnail */}
            <input type="hidden" {...register('thumbnail')} />
          </div>
        )}

        {/* SPECIFICATIONS */}
        {activeTab === 'specifications' && (
          <>
            <div className="row g-3 mb-3">
              {Object.entries(specifications).map(([key, value]) => (
                <div className="col-md-6" key={key}>
                  <label className="form-label text-capitalize">{key}</label>
                  <input
                    className="form-control"
                    value={value}
                    onChange={(e) =>
                      setSpecifications({ ...specifications, [key]: e.target.value })
                    }
                    placeholder={`Enter ${key}`}
                  />
                </div>
              ))}
            </div>

            {/* Tags Section */}
            <div className="mb-3">
              <label className="form-label">Tags</label>
              <div className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  placeholder="Add a tag"
                />
                <button 
                  className="btn btn-outline-secondary" 
                  type="button"
                  onClick={handleAddTag}
                >
                  Add
                </button>
              </div>
              
              {/* Tags Display */}
              <div className="d-flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span key={index} className="badge bg-primary d-flex align-items-center">
                    {tag}
                    <button
                      type="button"
                      className="btn btn-sm p-0 ms-2"
                      onClick={() => removeTag(index)}
                      style={{ color: 'white' }}
                    >
                      <XMarkIcon style={{ width: 12, height: 12 }} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {/* SEO */}
        {activeTab === 'seo' && (
          <>
            <div className="mb-3">
              <label className="form-label">Meta Title</label>
              <input 
                {...register('metaTitle')} 
                className="form-control" 
                placeholder="Enter meta title for SEO"
                maxLength="200"
              />
              <small className="text-muted">Recommended: 50-60 characters</small>
            </div>
            <div className="mb-3">
              <label className="form-label">Meta Description</label>
              <textarea 
                {...register('metaDescription')} 
                rows="3" 
                className="form-control" 
                placeholder="Enter meta description for SEO"
                maxLength="300"
              />
              <small className="text-muted">Recommended: 150-160 characters</small>
            </div>
          </>
        )}

        {/* ADVANCED */}
        {activeTab === 'advanced' && (
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Category</label>
              <select {...register('categoryId')} className="form-select">
                <option value="">Select Category</option>
                {/* Categories would be populated from API */}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Sub-Category</label>
              <select {...register('subCategoryId')} className="form-select">
                <option value="">Select Sub-Category</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Weight (grams)</label>
              <input 
                type="number" 
                step="0.01"
                {...register('weight')} 
                className="form-control"
                placeholder="Product weight in grams"
              />
            </div>
            <div className="col-md-6">
              <div className="form-check form-switch mt-4">
                <input 
                  {...register('isFeatured')} 
                  type="checkbox" 
                  className="form-check-input" 
                  role="switch"
                  id="isFeatured"
                />
                <label className="form-check-label" htmlFor="isFeatured">
                  Featured Product
                </label>
              </div>
            </div>
            <div className="col-12">
              <label className="form-label">Dimensions (cm)</label>
              <textarea 
                {...register('dimensions')} 
                rows="2" 
                className="form-control"
                placeholder='{"length": 10, "width": 5, "height": 2}'
              />
              <small className="text-muted">Enter dimensions as JSON object</small>
            </div>
          </div>
        )}

        {/* ACTIONS */}
        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
          <button 
            type="button" 
            onClick={onCancel} 
            className="btn btn-outline-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {product ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              product ? 'Update Product' : 'Create Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;


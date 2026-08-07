import React, { useState, useMemo } from 'react';
import {
  XMarkIcon, PhotoIcon, TagIcon, InformationCircleIcon,
  TrashIcon, StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconFilled } from '@heroicons/react/24/solid';

const ProductForm = ({
  initialData,       // <-- fully prepared object from container
  categories,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  // Use initialData to set state once (no useEffect needed)
  const [formData, setFormData] = useState(() => ({
    name: initialData?.name || '',
    sku: initialData?.sku || '',
    price: initialData?.price || '',
    comparePrice: initialData?.comparePrice || '',
    quantity: initialData?.quantity || '',
    description: initialData?.description || '',
    isOnSale: initialData?.isOnSale || false,
    salePrice: initialData?.salePrice || '',
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
    brand: initialData?.brand || '',
    categoryId: initialData?.categoryId || null,
    subCategoryId: initialData?.subCategoryId || null,
    cost: initialData?.cost || '',
    weight: initialData?.weight || '',
    isActive: initialData?.isActive ?? true,
    isFeatured: initialData?.isFeatured || false,
    dimensions: initialData?.dimensions || '',
    saleStart: initialData?.saleStart || null,
    saleEnd: initialData?.saleEnd || null,
    thumbnail: initialData?.thumbnail || '',
  }));

  const [images, setImages] = useState(initialData?.images || []);
  const [specifications, setSpecifications] = useState(
    initialData?.specifications || { material: '', dimensions: '', warranty: '', color: '' }
  );
  const [tags, setTags] = useState(initialData?.tags || []);
  const [currentTag, setCurrentTag] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [thumbnailIndex, setThumbnailIndex] = useState(() => {
    if (initialData?.thumbnail && initialData?.images?.length) {
      return initialData.images.findIndex(img => img.url === initialData.thumbnail);
    }
    return 0;
  });

  // selectedParentId from initialData
  const [selectedParentId, setSelectedParentId] = useState(initialData?.selectedParentId || null);

  const parentCategories = useMemo(() => categories.filter(cat => !cat.parentId), [categories]);
  const childCategories = useMemo(() => {
    if (!selectedParentId) return [];
    return categories.filter(cat => cat.parentId === selectedParentId);
  }, [categories, selectedParentId]);

  // ---------- Handlers (unchanged) ----------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleParentChange = (e) => {
    const parentId = e.target.value ? parseInt(e.target.value) : null;
    setSelectedParentId(parentId);
    setFormData(prev => ({
      ...prev,
      categoryId: parentId,
      subCategoryId: null
    }));
  };

  const handleChildChange = (e) => {
    const childId = e.target.value ? parseInt(e.target.value) : null;
    setFormData(prev => ({
      ...prev,
      subCategoryId: childId
    }));
  };

  // Image handlers (exactly as before – I'll keep them short)
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];
    for (const file of files) {
      try {
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
    if (images.length === 0 && newImages.length > 0) {
      newImages[0].isThumbnail = true;
      setThumbnailIndex(0);
      setFormData(prev => ({ ...prev, thumbnail: newImages[0].url }));
    }
    setImages([...images, ...newImages]);
    e.target.value = '';
  };

  const removeImage = (index) => {
    if (images[index].url.startsWith('blob:')) {
      URL.revokeObjectURL(images[index].url);
    }
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    if (index === thumbnailIndex && newImages.length > 0) {
      setThumbnailIndex(0);
      newImages[0].isThumbnail = true;
      setFormData(prev => ({ ...prev, thumbnail: newImages[0].url }));
    } else if (newImages.length === 0) {
      setThumbnailIndex(0);
      setFormData(prev => ({ ...prev, thumbnail: '' }));
    }
  };

  const setAsThumbnail = (index) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isThumbnail: i === index
    }));
    setImages(newImages);
    setThumbnailIndex(index);
    setFormData(prev => ({ ...prev, thumbnail: newImages[index].url }));
  };

  const handleAddTag = () => {
    const trimmedTag = currentTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setCurrentTag('');
    }
  };
  const removeTag = (index) => setTags(tags.filter((_, i) => i !== index));
  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
      cost: formData.cost ? parseFloat(formData.cost) : null,
      quantity: parseInt(formData.quantity) || 0,
      salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      isActive: formData.isActive !== undefined ? formData.isActive : true,
      isFeatured: formData.isFeatured || false,
      isOnSale: formData.isOnSale || false,
      dimensions: formData.dimensions ? JSON.parse(formData.dimensions) : {},
      saleStart: formData.saleStart || null,
      saleEnd: formData.saleEnd || null,
      images: images.filter(img => img.file).map(img => ({
        file: img.file,
        isThumbnail: img.isThumbnail,
        url: img.url
      })),
      specifications,
      tags,
    };
    onSubmit(payload);
  };

  // ---------- JSX – identical to your existing layout, but all fields use formData state ----------
  // (I'll include the full JSX here for completeness, but it's the same as the previous useState version)
  return (
    <div className="container-xl">
      <form onSubmit={handleSubmit}>
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

        {/* BASIC TAB – all inputs use value={formData.field} onChange={handleChange} */}
        {activeTab === 'basic' && (
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-control"
                placeholder="Enter product name"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">SKU *</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
                className="form-control"
                placeholder="Enter SKU"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Price *</label>
              <div className="input-group">
                <span className="input-group-text">UGX</span>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-4">
              <label className="form-label">Compare Price</label>
              <div className="input-group">
                <span className="input-group-text">UGX</span>
                <input
                  type="number"
                  step="0.01"
                  name="comparePrice"
                  value={formData.comparePrice}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-4">
              <label className="form-label">Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
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
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="form-control"
              />
            </div>
            <div className="col-12">
              <div className="form-check form-switch">
                <input
                  type="checkbox"
                  name="isOnSale"
                  checked={formData.isOnSale}
                  onChange={handleChange}
                  className="form-check-input"
                  id="isOnSale"
                />
                <label className="form-check-label" htmlFor="isOnSale">Put product on sale</label>
              </div>
            </div>
            {formData.isOnSale && (
              <>
                <div className="col-md-4">
                  <label className="form-label">Sale Price</label>
                  <div className="input-group">
                    <span className="input-group-text">UGX</span>
                    <input
                      type="number"
                      step="0.01"
                      name="salePrice"
                      value={formData.salePrice}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Sale Start Date</label>
                  <input
                    type="datetime-local"
                    name="saleStart"
                    value={formData.saleStart}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Sale End Date</label>
                  <input
                    type="datetime-local"
                    name="saleEnd"
                    value={formData.saleEnd}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* IMAGES TAB */}
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
              <small className="text-muted">Max 5MB each. Allowed: JPG, PNG, GIF, WebP</small>
            </div>
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
                        {img.isThumbnail && (
                          <div className="position-absolute top-0 start-0 m-2">
                            <span className="badge bg-warning">
                              <StarIconFilled className="me-1" style={{ width: 12 }} /> Thumbnail
                            </span>
                          </div>
                        )}
                        <div className="position-absolute top-0 end-0 m-2">
                          <button
                            type="button"
                            className="btn btn-danger btn-sm me-1"
                            onClick={() => removeImage(i)}
                          >
                            <TrashIcon style={{ width: 14 }} />
                          </button>
                          {!img.isThumbnail && (
                            <button
                              type="button"
                              className="btn btn-warning btn-sm"
                              onClick={() => setAsThumbnail(i)}
                            >
                              <StarIcon style={{ width: 14 }} />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="card-body p-2">
                        <small className="text-muted d-block truncate">{img.originalname || 'Image'}</small>
                        {img.size && <small className="text-muted">{(img.size / 1024).toFixed(1)} KB</small>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <input type="hidden" name="thumbnail" value={formData.thumbnail} />
          </div>
        )}

        {/* SPECIFICATIONS TAB */}
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
                <button className="btn btn-outline-secondary" type="button" onClick={handleAddTag}>
                  Add
                </button>
              </div>
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
                      <XMarkIcon style={{ width: 12 }} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {/* SEO TAB */}
        {activeTab === 'seo' && (
          <>
            <div className="mb-3">
              <label className="form-label">Meta Title</label>
              <input
                type="text"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                className="form-control"
                maxLength="200"
              />
              <small className="text-muted">50‑60 characters recommended</small>
            </div>
            <div className="mb-3">
              <label className="form-label">Meta Description</label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                rows="3"
                className="form-control"
                maxLength="300"
              />
              <small className="text-muted">150‑160 characters recommended</small>
            </div>
          </>
        )}

        {/* ADVANCED TAB */}
        {activeTab === 'advanced' && (
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Parent Category</label>
              <select
                className="form-select"
                value={selectedParentId || ''}
                onChange={handleParentChange}
              >
                <option value="">None (Top-level)</option>
                {parentCategories.map(cat => (
                  <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Sub‑Category</label>
              <select
                className="form-select"
                value={formData.subCategoryId || ''}
                onChange={handleChildChange}
                disabled={!selectedParentId || childCategories.length === 0}
              >
                <option value="">Select Sub‑Category</option>
                {childCategories.map(cat => (
                  <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
                ))}
              </select>
              {!selectedParentId && <small className="text-muted">Select a parent first</small>}
            </div>
            <input type="hidden" name="categoryId" value={formData.categoryId || ''} />

            <div className="col-md-6">
              <label className="form-label">Weight (grams)</label>
              <input
                type="number"
                step="0.01"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="col-md-6">
              <div className="form-check form-switch mt-4">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="form-check-input"
                  id="isFeatured"
                />
                <label className="form-check-label" htmlFor="isFeatured">Featured Product</label>
              </div>
            </div>
            <div className="col-12">
              <label className="form-label">Dimensions (cm)</label>
              <textarea
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                rows="2"
                className="form-control"
                placeholder='{"length": 10, "width": 5, "height": 2}'
              />
              <small className="text-muted">Enter as JSON object</small>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
          <button type="button" onClick={onCancel} className="btn btn-outline-secondary" disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <><span className="spinner-border spinner-border-sm me-2" />{initialData?.name ? 'Updating...' : 'Creating...'}</>
            ) : (
              initialData?.name ? 'Update Product' : 'Create Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;





// import React, { useState, useEffect, useMemo } from 'react';
// import { useForm } from 'react-hook-form';
// import { 
//   XMarkIcon, 
//   PhotoIcon, 
//   TagIcon, 
//   InformationCircleIcon,
//   TrashIcon,
//   StarIcon
// } from '@heroicons/react/24/outline';
// import { StarIcon as StarIconFilled } from '@heroicons/react/24/solid';

// const ProductForm = ({ product, onSubmit, onCancel, isSubmitting = false, categories = [] }) => {
//   const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm({
//     defaultValues: product || {}
//   });

//   // ---------- Category hierarchy state ----------
//   const [selectedParentId, setSelectedParentId] = useState(null);

//   // Compute parent categories (those without parentId)
//   const parentCategories = useMemo(() => {
//     return categories.filter(cat => !cat.parentId);
//   }, [categories]);

//   // Compute child categories based on selected parent
//   const childCategories = useMemo(() => {
//     if (!selectedParentId) return [];
//     return categories.filter(cat => cat.parentId === selectedParentId);
//   }, [categories, selectedParentId]);

//   // Initialize selectedParentId when product changes (editing)
//   useEffect(() => {
//     if (product && categories.length) {
//       // Determine the product's category
//       const catId = product.categoryId || product.subCategoryId;
//       if (catId) {
//         const cat = categories.find(c => c.categoryId === catId);
//         if (cat) {
//           if (cat.parentId) {
//             // This is a child category – set parent to its parentId
//             setSelectedParentId(cat.parentId);
//             // Also set the child selection via setValue later
//             setValue('subCategoryId', cat.categoryId);
//           } else {
//             // This is a top‑level category
//             setSelectedParentId(null);
//             setValue('categoryId', cat.categoryId);
//             setValue('subCategoryId', null);
//           }
//         }
//       } else {
//         // No category set
//         setSelectedParentId(null);
//         setValue('categoryId', null);
//         setValue('subCategoryId', null);
//       }
//     }
//   }, [product, categories, setValue]);

//   // ---------- Image state (unchanged) ----------
//   const [images, setImages] = useState(product?.images || []);
//   const [specifications, setSpecifications] = useState(
//     product?.specifications || { material: '', dimensions: '', warranty: '', color: '' }
//   );
//   const [tags, setTags] = useState(product?.tags || []);
//   const [currentTag, setCurrentTag] = useState('');
//   const [activeTab, setActiveTab] = useState('basic');
//   const [thumbnailIndex, setThumbnailIndex] = useState(
//     product?.thumbnail ? images.findIndex(img => img.url === product.thumbnail) : 0
//   );

//   const isOnSale = watch('isOnSale');

//   // ---------- Handlers for category selection ----------
//   const handleParentChange = (e) => {
//     const parentId = e.target.value ? parseInt(e.target.value) : null;
//     setSelectedParentId(parentId);
//     // Reset child selection
//     setValue('subCategoryId', null);
//     // If no parent, clear categoryId; otherwise set categoryId to parent
//     if (!parentId) {
//       setValue('categoryId', null);
//     } else {
//       setValue('categoryId', parentId);
//     }
//   };

//   const handleChildChange = (e) => {
//     const childId = e.target.value ? parseInt(e.target.value) : null;
//     setValue('subCategoryId', childId);
//     // categoryId stays as the parent (already set)
//     // If child is cleared, categoryId remains parent (which is correct)
//   };

//   // ---------- Image handlers (unchanged) ----------
//   const handleImageUpload = async (e) => {
//     const files = Array.from(e.target.files);
//     const newImages = [];
    
//     for (const file of files) {
//       try {
//         const previewUrl = URL.createObjectURL(file);
//         newImages.push({
//           url: previewUrl,
//           file: file,
//           originalname: file.name,
//           size: file.size,
//           mimetype: file.type,
//           isThumbnail: false
//         });
//       } catch (error) {
//         console.error('Error processing file:', error);
//         alert(`Error with file ${file.name}: ${error.message}`);
//       }
//     }
    
//     if (images.length === 0 && newImages.length > 0) {
//       newImages[0].isThumbnail = true;
//       setThumbnailIndex(0);
//       setValue('thumbnail', newImages[0].url);
//     }
    
//     setImages([...images, ...newImages]);
//     e.target.value = '';
//   };

//   const removeImage = (index) => {
//     if (images[index].url.startsWith('blob:')) {
//       URL.revokeObjectURL(images[index].url);
//     }
//     const newImages = images.filter((_, i) => i !== index);
//     setImages(newImages);
//     if (index === thumbnailIndex && newImages.length > 0) {
//       setThumbnailIndex(0);
//       newImages[0].isThumbnail = true;
//       setValue('thumbnail', newImages[0].url);
//     } else if (newImages.length === 0) {
//       setThumbnailIndex(0);
//       setValue('thumbnail', '');
//     }
//   };

//   const setAsThumbnail = (index) => {
//     const newImages = images.map((img, i) => ({
//       ...img,
//       isThumbnail: i === index
//     }));
//     setImages(newImages);
//     setThumbnailIndex(index);
//     setValue('thumbnail', newImages[index].url);
//   };

//   const handleAddTag = () => {
//     const trimmedTag = currentTag.trim();
//     if (trimmedTag && !tags.includes(trimmedTag)) {
//       setTags([...tags, trimmedTag]);
//       setCurrentTag('');
//     }
//   };

//   const removeTag = (index) => {
//     setTags(tags.filter((_, i) => i !== index));
//   };

//   const handleTagKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       handleAddTag();
//     }
//   };

//   // ---------- Form submission ----------
//   const onSubmitForm = (data) => {
//     const hasFilesToUpload = images.some(img => img.file);
    
//     // Build payload exactly as your backend expects
//     const formData = {
//       ...data,
//       price: parseFloat(data.price) || 0,
//       comparePrice: data.comparePrice ? parseFloat(data.comparePrice) : null,
//       cost: data.cost ? parseFloat(data.cost) : null,
//       quantity: parseInt(data.quantity) || 0,
//       salePrice: data.salePrice ? parseFloat(data.salePrice) : null,
//       weight: data.weight ? parseFloat(data.weight) : null,
//       isActive: data.isActive !== undefined ? data.isActive : true,
//       isFeatured: data.isFeatured || false,
//       isOnSale: data.isOnSale || false,
//       images: hasFilesToUpload
//         ? images.filter(img => img.file).map(img => ({
//             file: img.file,
//             isThumbnail: img.isThumbnail,
//             url: img.url
//           }))
//         : [],
//       specifications: specifications || {},
//       tags: tags || [],
//       dimensions: data.dimensions || {},
//       saleStart: data.saleStart || null,
//       saleEnd: data.saleEnd || null,
//       metaTitle: data.metaTitle || '',
//       metaDescription: data.metaDescription || '',
//       brand: data.brand || '',
//       // categoryId and subCategoryId are already set via setValue, but we ensure they're in data
//       categoryId: data.categoryId || null,
//       subCategoryId: data.subCategoryId || null,
//     };
    
//     onSubmit(formData);
//   };

//   // ---------- Render ----------
//   return (
//     <div className="container-xl">
//       <form onSubmit={handleSubmit(onSubmitForm)}>
//         {/* Tabs */}
//         <ul className="nav nav-tabs mb-4">
//           {[
//             ['basic', 'Basic Info', InformationCircleIcon],
//             ['images', 'Images', PhotoIcon],
//             ['specifications', 'Specifications', TagIcon],
//             ['seo', 'SEO', TagIcon],
//             ['advanced', 'Advanced', TagIcon],
//           ].map(([id, label, Icon]) => (
//             <li className="nav-item" key={id}>
//               <button
//                 type="button"
//                 className={`nav-link ${activeTab === id ? 'active' : ''}`}
//                 onClick={() => setActiveTab(id)}
//               >
//                 <Icon className="me-2" style={{ width: 18 }} />
//                 {label}
//               </button>
//             </li>
//           ))}
//         </ul>

//         {/* ---------- BASIC TAB ---------- */}
//         {activeTab === 'basic' && (
//           <div className="row g-3">
//             <div className="col-md-6">
//               <label className="form-label">Product Name *</label>
//               <input 
//                 {...register('name', { required: 'Product name is required' })} 
//                 className={`form-control ${errors.name ? 'is-invalid' : ''}`}
//                 placeholder="Enter product name"
//               />
//               {errors.name && (
//                 <div className="invalid-feedback">{errors.name.message}</div>
//               )}
//             </div>

//             <div className="col-md-6">
//               <label className="form-label">SKU *</label>
//               <input 
//                 {...register('sku', { required: 'SKU is required' })} 
//                 className={`form-control ${errors.sku ? 'is-invalid' : ''}`}
//                 placeholder="Enter SKU"
//               />
//               {errors.sku && (
//                 <div className="invalid-feedback">{errors.sku.message}</div>
//               )}
//             </div>

//             <div className="col-md-4">
//               <label className="form-label">Price *</label>
//               <div className="input-group">
//                 <span className="input-group-text">UGX</span>
//                 <input 
//                   type="number" 
//                   step="0.01"
//                   {...register('price', { 
//                     required: 'Price is required',
//                     min: { value: 0, message: 'Price must be positive' }
//                   })} 
//                   className={`form-control ${errors.price ? 'is-invalid' : ''}`}
//                 />
//                 {errors.price && (
//                   <div className="invalid-feedback">{errors.price.message}</div>
//                 )}
//               </div>
//             </div>

//             <div className="col-md-4">
//               <label className="form-label">Compare Price</label>
//               <div className="input-group">
//                 <span className="input-group-text">UGX</span>
//                 <input 
//                   type="number" 
//                   step="0.01"
//                   {...register('comparePrice', { 
//                     min: { value: 0, message: 'Compare price must be positive' }
//                   })} 
//                   className={`form-control ${errors.comparePrice ? 'is-invalid' : ''}`}
//                 />
//               </div>
//             </div>

//             <div className="col-md-4">
//               <label className="form-label">Quantity *</label>
//               <input 
//                 type="number" 
//                 {...register('quantity', { 
//                   required: 'Quantity is required',
//                   min: { value: 0, message: 'Quantity cannot be negative' }
//                 })} 
//                 className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
//               />
//               {errors.quantity && (
//                 <div className="invalid-feedback">{errors.quantity.message}</div>
//               )}
//             </div>

//             <div className="col-md-6">
//               <label className="form-label">Brand</label>
//               <input 
//                 {...register('brand')} 
//                 className="form-control"
//                 placeholder="Enter brand name"
//               />
//             </div>

//             <div className="col-md-6">
//               <label className="form-label">Cost Price</label>
//               <div className="input-group">
//                 <span className="input-group-text">UGX</span>
//                 <input 
//                   type="number" 
//                   step="0.01"
//                   {...register('cost')} 
//                   className="form-control"
//                   placeholder="Product cost"
//                 />
//               </div>
//             </div>

//             <div className="col-12">
//               <label className="form-label">Description</label>
//               <textarea 
//                 {...register('description')} 
//                 rows="4" 
//                 className="form-control"
//                 placeholder="Enter product description"
//               />
//             </div>

//             {/* Sale Section */}
//             <div className="col-12">
//               <div className="form-check form-switch">
//                 <input 
//                   {...register('isOnSale')} 
//                   type="checkbox" 
//                   className="form-check-input" 
//                   role="switch"
//                   id="isOnSale"
//                 />
//                 <label className="form-check-label" htmlFor="isOnSale">
//                   Put product on sale
//                 </label>
//               </div>
//             </div>

//             {isOnSale && (
//               <>
//                 <div className="col-md-4">
//                   <label className="form-label">Sale Price</label>
//                   <div className="input-group">
//                     <span className="input-group-text">UGX</span>
//                     <input 
//                       type="number"
//                       step="0.01"
//                       {...register('salePrice')} 
//                       className="form-control"
//                     />
//                   </div>
//                 </div>
//                 <div className="col-md-4">
//                   <label className="form-label">Sale Start Date</label>
//                   <input 
//                     type="datetime-local"
//                     {...register('saleStart')} 
//                     className="form-control"
//                   />
//                 </div>
//                 <div className="col-md-4">
//                   <label className="form-label">Sale End Date</label>
//                   <input 
//                     type="datetime-local"
//                     {...register('saleEnd')} 
//                     className="form-control"
//                   />
//                 </div>
//               </>
//             )}
//           </div>
//         )}

//         {/* ---------- IMAGES TAB ---------- */}
//         {activeTab === 'images' && (
//           <div className="mb-4">
//             <div className="mb-3">
//               <label className="form-label">Upload Images</label>
//               <input 
//                 type="file" 
//                 multiple 
//                 accept="image/*"
//                 className="form-control" 
//                 onChange={handleImageUpload}
//               />
//               <small className="text-muted">
//                 Maximum file size: 5MB. Allowed types: JPG, PNG, GIF, WebP
//               </small>
//             </div>

//             <div className="row g-3">
//               {images.length === 0 ? (
//                 <div className="col-12 text-center py-5">
//                   <PhotoIcon className="text-muted mb-3" style={{ width: 48, height: 48 }} />
//                   <p className="text-muted">No images uploaded yet</p>
//                 </div>
//               ) : (
//                 images.map((img, i) => (
//                   <div className="col-6 col-md-3" key={i}>
//                     <div className="card">
//                       <div className="position-relative">
//                         <img 
//                           src={img.url} 
//                           className="card-img-top" 
//                           alt={`Product ${i + 1}`}
//                           style={{ height: '150px', objectFit: 'cover' }}
//                         />
//                         {img.isThumbnail && (
//                           <div className="position-absolute top-0 start-0 m-2">
//                             <span className="badge bg-warning">
//                               <StarIconFilled className="me-1" style={{ width: 12, height: 12 }} />
//                               Thumbnail
//                             </span>
//                           </div>
//                         )}
//                         <div className="position-absolute top-0 end-0 m-2">
//                           <button
//                             type="button"
//                             className="btn btn-danger btn-sm me-1"
//                             onClick={() => removeImage(i)}
//                             title="Remove image"
//                           >
//                             <TrashIcon style={{ width: 14, height: 14 }} />
//                           </button>
//                           {!img.isThumbnail && (
//                             <button
//                               type="button"
//                               className="btn btn-warning btn-sm"
//                               onClick={() => setAsThumbnail(i)}
//                               title="Set as thumbnail"
//                             >
//                               <StarIcon style={{ width: 14, height: 14 }} />
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                       <div className="card-body p-2">
//                         <small className="text-muted d-block truncate">
//                           {img.originalname || 'Image'}
//                         </small>
//                         {img.size && (
//                           <small className="text-muted">
//                             {(img.size / 1024).toFixed(1)} KB
//                           </small>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>

//             <input type="hidden" {...register('thumbnail')} />
//           </div>
//         )}

//         {/* ---------- SPECIFICATIONS TAB ---------- */}
//         {activeTab === 'specifications' && (
//           <>
//             <div className="row g-3 mb-3">
//               {Object.entries(specifications).map(([key, value]) => (
//                 <div className="col-md-6" key={key}>
//                   <label className="form-label text-capitalize">{key}</label>
//                   <input
//                     className="form-control"
//                     value={value}
//                     onChange={(e) =>
//                       setSpecifications({ ...specifications, [key]: e.target.value })
//                     }
//                     placeholder={`Enter ${key}`}
//                   />
//                 </div>
//               ))}
//             </div>

//             <div className="mb-3">
//               <label className="form-label">Tags</label>
//               <div className="input-group mb-2">
//                 <input
//                   type="text"
//                   className="form-control"
//                   value={currentTag}
//                   onChange={(e) => setCurrentTag(e.target.value)}
//                   onKeyPress={handleTagKeyPress}
//                   placeholder="Add a tag"
//                 />
//                 <button 
//                   className="btn btn-outline-secondary" 
//                   type="button"
//                   onClick={handleAddTag}
//                 >
//                   Add
//                 </button>
//               </div>
              
//               <div className="d-flex flex-wrap gap-2">
//                 {tags.map((tag, index) => (
//                   <span key={index} className="badge bg-primary d-flex align-items-center">
//                     {tag}
//                     <button
//                       type="button"
//                       className="btn btn-sm p-0 ms-2"
//                       onClick={() => removeTag(index)}
//                       style={{ color: 'white' }}
//                     >
//                       <XMarkIcon style={{ width: 12, height: 12 }} />
//                     </button>
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </>
//         )}

//         {/* ---------- SEO TAB ---------- */}
//         {activeTab === 'seo' && (
//           <>
//             <div className="mb-3">
//               <label className="form-label">Meta Title</label>
//               <input 
//                 {...register('metaTitle')} 
//                 className="form-control" 
//                 placeholder="Enter meta title for SEO"
//                 maxLength="200"
//               />
//               <small className="text-muted">Recommended: 50-60 characters</small>
//             </div>
//             <div className="mb-3">
//               <label className="form-label">Meta Description</label>
//               <textarea 
//                 {...register('metaDescription')} 
//                 rows="3" 
//                 className="form-control" 
//                 placeholder="Enter meta description for SEO"
//                 maxLength="300"
//               />
//               <small className="text-muted">Recommended: 150-160 characters</small>
//             </div>
//           </>
//         )}

//         {/* ---------- ADVANCED TAB ---------- */}
//         {activeTab === 'advanced' && (
//           <div className="row g-3">
//             {/* Parent Category */}
//             <div className="col-md-6">
//               <label className="form-label">Parent Category</label>
//               <select
//                 className="form-select"
//                 value={selectedParentId || ''}
//                 onChange={handleParentChange}
//               >
//                 <option value="">None (Top-level)</option>
//                 {parentCategories.map(cat => (
//                   <option key={cat.categoryId} value={cat.categoryId}>
//                     {cat.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Sub‑Category */}
//             <div className="col-md-6">
//               <label className="form-label">Sub‑Category</label>
//               <select
//                 {...register('subCategoryId')}
//                 className="form-select"
//                 disabled={!selectedParentId || childCategories.length === 0}
//                 onChange={handleChildChange}
//               >
//                 <option value="">Select Sub‑Category</option>
//                 {childCategories.map(cat => (
//                   <option key={cat.categoryId} value={cat.categoryId}>
//                     {cat.name}
//                   </option>
//                 ))}
//               </select>
//               {!selectedParentId && (
//                 <small className="text-muted">Select a parent category first</small>
//               )}
//             </div>

//             {/* Hidden field for categoryId (set by our handlers) */}
//             <input type="hidden" {...register('categoryId')} />

//             {/* Rest of advanced fields */}
//             <div className="col-md-6">
//               <label className="form-label">Weight (grams)</label>
//               <input 
//                 type="number" 
//                 step="0.01"
//                 {...register('weight')} 
//                 className="form-control"
//                 placeholder="Product weight in grams"
//               />
//             </div>
//             <div className="col-md-6">
//               <div className="form-check form-switch mt-4">
//                 <input 
//                   {...register('isFeatured')} 
//                   type="checkbox" 
//                   className="form-check-input" 
//                   role="switch"
//                   id="isFeatured"
//                 />
//                 <label className="form-check-label" htmlFor="isFeatured">
//                   Featured Product
//                 </label>
//               </div>
//             </div>
//             <div className="col-12">
//               <label className="form-label">Dimensions (cm)</label>
//               <textarea 
//                 {...register('dimensions')} 
//                 rows="2" 
//                 className="form-control"
//                 placeholder='{"length": 10, "width": 5, "height": 2}'
//               />
//               <small className="text-muted">Enter dimensions as JSON object</small>
//             </div>
//           </div>
//         )}

//         {/* ---------- FORM ACTIONS ---------- */}
//         <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
//           <button 
//             type="button" 
//             onClick={onCancel} 
//             className="btn btn-outline-secondary"
//             disabled={isSubmitting}
//           >
//             Cancel
//           </button>
//           <button 
//             type="submit" 
//             className="btn btn-primary"
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? (
//               <>
//                 <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                 {product ? 'Updating...' : 'Creating...'}
//               </>
//             ) : (
//               product ? 'Update Product' : 'Create Product'
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ProductForm;



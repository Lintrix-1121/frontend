import React, { useState, useEffect, useMemo } from 'react';
import { 
  XMarkIcon, 
  PhotoIcon, 
  TagIcon, 
  InformationCircleIcon,
  TrashIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconFilled } from '@heroicons/react/24/solid';

const ProductForm = ({ product, onSubmit, onCancel, isSubmitting = false, categories = [] }) => {
  // ---------- Form state (like ProjectForm) ----------
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    comparePrice: '',
    quantity: '',
    description: '',
    isOnSale: false,
    salePrice: '',
    metaTitle: '',
    metaDescription: '',
    brand: '',
    categoryId: null,
    subCategoryId: null,
    cost: '',
    weight: '',
    isActive: true,
    isFeatured: false,
    dimensions: '',
    saleStart: null,
    saleEnd: null,
    thumbnail: ''
  });

  // Other state
  const [images, setImages] = useState([]);
  const [specifications, setSpecifications] = useState({ material: '', dimensions: '', warranty: '', color: '' });
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  const [thumbnailIndex, setThumbnailIndex] = useState(0);

  // Category hierarchy state
  const [selectedParentId, setSelectedParentId] = useState(null);

  // Compute parent and child categories
  const parentCategories = useMemo(() => categories.filter(cat => !cat.parentId), [categories]);
  const childCategories = useMemo(() => {
    if (!selectedParentId) return [];
    return categories.filter(cat => cat.parentId === selectedParentId);
  }, [categories, selectedParentId]);

  // ---------- Populate form when product changes ----------
  useEffect(() => {
    if (!product) return;

    // Fill basic fields
    setFormData({
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
      categoryId: product.categoryId || null,
      subCategoryId: product.subCategoryId || null,
      cost: product.cost || '',
      weight: product.weight || '',
      isActive: product.isActive !== undefined ? product.isActive : true,
      isFeatured: product.isFeatured || false,
      dimensions: typeof product.dimensions === 'object' ? JSON.stringify(product.dimensions) : product.dimensions || '',
      saleStart: product.saleStart || null,
      saleEnd: product.saleEnd || null,
      thumbnail: product.thumbnail || ''
    });

    // Set images
    setImages(product.images || []);
    setSpecifications(product.specifications || {});
    setTags(product.tags || []);

    // Determine thumbnail index
    if (product.thumbnail && product.images?.length) {
      const idx = product.images.findIndex(img => img.url === product.thumbnail);
      setThumbnailIndex(idx >= 0 ? idx : 0);
    }

    // Set category hierarchy
    const catId = product.categoryId || product.subCategoryId;
    if (catId) {
      const cat = categories.find(c => c.categoryId === catId);
      if (cat) {
        if (cat.parentId) {
          setSelectedParentId(cat.parentId);
          setFormData(prev => ({
            ...prev,
            categoryId: cat.parentId,
            subCategoryId: cat.categoryId
          }));
        } else {
          setSelectedParentId(null);
          setFormData(prev => ({
            ...prev,
            categoryId: cat.categoryId,
            subCategoryId: null
          }));
        }
      } else {
        setSelectedParentId(null);
        setFormData(prev => ({
          ...prev,
          categoryId: null,
          subCategoryId: null
        }));
      }
    } else {
      setSelectedParentId(null);
      setFormData(prev => ({
        ...prev,
        categoryId: null,
        subCategoryId: null
      }));
    }
  }, [product, categories]);

  // ---------- Handlers for form fields ----------
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

  // ---------- Image handlers ----------
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

  // ---------- Tags ----------
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

  // ---------- Submit ----------
  const handleSubmit = (e) => {
    e.preventDefault();
    // Build final payload
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
      // categoryId and subCategoryId already in formData
    };
    onSubmit(payload);
  };

  // ---------- Render ----------
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

        {/* BASIC TAB */}
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
                  role="switch"
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
                          alt={`Product ${i+1}`}
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
                            title="Remove"
                          >
                            <TrashIcon style={{ width: 14 }} />
                          </button>
                          {!img.isThumbnail && (
                            <button
                              type="button"
                              className="btn btn-warning btn-sm"
                              onClick={() => setAsThumbnail(i)}
                              title="Set as thumbnail"
                            >
                              <StarIcon style={{ width: 14 }} />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="card-body p-2">
                        <small className="text-muted d-block truncate">{img.originalname || 'Image'}</small>
                        {img.size && <small className="text-muted">{(img.size/1024).toFixed(1)} KB</small>}
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
                    onChange={(e) => setSpecifications({...specifications, [key]: e.target.value})}
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
                <button className="btn btn-outline-secondary" type="button" onClick={handleAddTag}>Add</button>
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
                placeholder="Meta title"
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
                placeholder="Meta description"
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
            {/* Hidden fields for categoryId */}
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
                  role="switch"
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

        {/* Form Actions */}
        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
          <button type="button" onClick={onCancel} className="btn btn-outline-secondary" disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <><span className="spinner-border spinner-border-sm me-2" />{product ? 'Updating...' : 'Creating...'}</>
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

// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import useProjectStore from '../../stores/shared/projectStore';
// import LoadingSpinner from '../../components/admin/LoadingSpinner';
// import ErrorMessage from '../../components/projects/ErrorMessage';
// import toast from 'react-hot-toast';

// const ProjectForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { currentProject, loading, error, createProject, updateProject, fetchProject } = useProjectStore();

//   const [formData, setFormData] = useState({
//     title: '',
//     category: 'Software Development',
//     subCategory: '',
//     clientName: '',
//     clientIndustry: '',
//     shortDescription: '',
//     fullDescription: '',
//     challenge: '',
//     solution: '',
//     results: '',
//     technologies: [],
//     teamSize: '',
//     projectDuration: '',
//     startDate: '',
//     endDate: '',
//     projectUrl: '',
//     githubUrl: '',
//     demoUrl: '',
//     clientTestimonial: '',
//     testimonialAuthor: '',
//     testimonialPosition: '',
//     status: 'planned',
//     priority: 'medium',
//     isFeatured: false,
//     isPublished: false,
//     tags: [],
//     location: '',
//     country: '',
//     budget: '',
//     currency: 'USD'
//   });

//   const [mediaFiles, setMediaFiles] = useState([]);
//   const [techInput, setTechInput] = useState('');
//   const [tagInput, setTagInput] = useState('');

//   useEffect(() => {
//     if (id) {
//       fetchProject(id);
//     }
//   }, [id]);

//   useEffect(() => {
//     if (currentProject && id) {
//       setFormData({
//         title: currentProject.title || '',
//         category: currentProject.category || 'Software Development',
//         subCategory: currentProject.subCategory || '',
//         clientName: currentProject.clientName || '',
//         clientIndustry: currentProject.clientIndustry || '',
//         shortDescription: currentProject.shortDescription || '',
//         fullDescription: currentProject.fullDescription || '',
//         challenge: currentProject.challenge || '',
//         solution: currentProject.solution || '',
//         results: currentProject.results || '',
//         technologies: currentProject.technologies || [],
//         teamSize: currentProject.teamSize || '',
//         projectDuration: currentProject.projectDuration || '',
//         startDate: currentProject.startDate ? currentProject.startDate.split('T')[0] : '',
//         endDate: currentProject.endDate ? currentProject.endDate.split('T')[0] : '',
//         projectUrl: currentProject.projectUrl || '',
//         githubUrl: currentProject.githubUrl || '',
//         demoUrl: currentProject.demoUrl || '',
//         clientTestimonial: currentProject.clientTestimonial || '',
//         testimonialAuthor: currentProject.testimonialAuthor || '',
//         testimonialPosition: currentProject.testimonialPosition || '',
//         status: currentProject.status || 'planned',
//         priority: currentProject.priority || 'medium',
//         isFeatured: currentProject.isFeatured || false,
//         isPublished: currentProject.isPublished || false,
//         tags: currentProject.tags || [],
//         location: currentProject.location || '',
//         country: currentProject.country || '',
//         budget: currentProject.budget || '',
//         currency: currentProject.currency || 'USD'
//       });
//     }
//   }, [currentProject, id]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleArrayAdd = (field, value, setInput) => {
//     if (value && !formData[field].includes(value)) {
//       setFormData(prev => ({
//         ...prev,
//         [field]: [...prev[field], value]
//       }));
//       setInput('');
//     }
//   };

//   const handleArrayRemove = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: prev[field].filter(item => item !== value)
//     }));
//   };

//   const handleFileChange = (e) => {
//     setMediaFiles([...e.target.files]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       const user = JSON.parse(localStorage.getItem('user') || '{}');
//       const projectData = {
//         ...formData,
//         createdBy: user.userId
//       };

//       let result;
//       if (id) {
//         result = await updateProject(id, projectData, mediaFiles);
//       } else {
//         result = await createProject(projectData, mediaFiles);
//       }

//       if (result.success) {
//         toast.success(result.message || 'Project saved successfully');
//         navigate('/admin/projects');
//       } else {
//         toast.error(result.error || 'Error saving project');
//       }
//     } catch (error) {
//       toast.error('An error occurred');
//       console.error('Submit error:', error);
//     }
//   };

//   const categoryOptions = [
//     { value: 'IoT', label: 'Internet of Things' },
//     { value: 'Electronics', label: 'Electronics' },
//     { value: 'Mobile apps', label: 'Mobile Apps' },
//     { value: 'Web apps', label: 'Web Apps' },
//     { value: 'Installations', label: 'Installations' },
//     { value: 'Networking', label: 'Networking' },
//     { value: 'Embedded Systems', label: 'Embedded Systems' },
//     { value: 'Software Development', label: 'Software Development' },
//     { value: 'ICT Infrastructure', label: 'ICT Infrastructure' },
//     { value: 'Security Systems', label: 'Security Systems' },
//     { value: 'Cloud Computing', label: 'Cloud Computing' },
//     { value: 'AI/ML', label: 'AI/ML' },
//     { value: 'Blockchain', label: 'Blockchain' },
//     { value: 'Robotics', label: 'Robotics' },
//     { value: 'Telecommunications', label: 'Telecommunications' },
//     { value: 'Data Center', label: 'Data Center' },
//     { value: 'IT Consulting', label: 'IT Consulting' },
//     { value: 'Hardware Design', label: 'Hardware Design' },
//     { value: 'Firmware Development', label: 'Firmware Development' },
//     { value: 'System Integration', label: 'System Integration' }
//   ];

//   if (loading) return <LoadingSpinner />;
//   if (error) return <ErrorMessage message={error} />;

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-8">
//         {id ? 'Edit Project' : 'Create New Project'}
//       </h1>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Basic Information */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Title *</label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 required
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Category *</label>
//               <select
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 required
//                 className="w-full border rounded-lg px-3 py-2"
//               >
//                 {categoryOptions.map(opt => (
//                   <option key={opt.value} value={opt.value}>
//                     {opt.label}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Sub Category</label>
//               <input
//                 type="text"
//                 name="subCategory"
//                 value={formData.subCategory}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Client Name</label>
//               <input
//                 type="text"
//                 name="clientName"
//                 value={formData.clientName}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Client Industry</label>
//               <input
//                 type="text"
//                 name="clientIndustry"
//                 value={formData.clientIndustry}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Status & Priority */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">Status & Priority</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Status</label>
//               <select
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2"
//               >
//                 <option value="planned">Planned</option>
//                 <option value="in-progress">In Progress</option>
//                 <option value="completed">Completed</option>
//                 <option value="on-hold">On Hold</option>
//                 <option value="cancelled">Cancelled</option>
//                 <option value="maintenance">Maintenance</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Priority</label>
//               <select
//                 name="priority"
//                 value={formData.priority}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2"
//               >
//                 <option value="low">Low</option>
//                 <option value="medium">Medium</option>
//                 <option value="high">High</option>
//                 <option value="critical">Critical</option>
//               </select>
//             </div>

//             <div className="flex items-center space-x-4">
//               <label className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   name="isFeatured"
//                   checked={formData.isFeatured}
//                   onChange={handleChange}
//                   className="rounded"
//                 />
//                 <span>Featured Project</span>
//               </label>

//               <label className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   name="isPublished"
//                   checked={formData.isPublished}
//                   onChange={handleChange}
//                   className="rounded"
//                 />
//                 <span>Published</span>
//               </label>
//             </div>
//           </div>
//         </div>

//         {/* Description */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">Description</h2>
          
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Short Description</label>
//               <textarea
//                 name="shortDescription"
//                 value={formData.shortDescription}
//                 onChange={handleChange}
//                 rows="3"
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Full Description *</label>
//               <textarea
//                 name="fullDescription"
//                 value={formData.fullDescription}
//                 onChange={handleChange}
//                 required
//                 rows="6"
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Challenge</label>
//               <textarea
//                 name="challenge"
//                 value={formData.challenge}
//                 onChange={handleChange}
//                 rows="4"
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Solution</label>
//               <textarea
//                 name="solution"
//                 value={formData.solution}
//                 onChange={handleChange}
//                 rows="4"
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Results</label>
//               <textarea
//                 name="results"
//                 value={formData.results}
//                 onChange={handleChange}
//                 rows="4"
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Technologies */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">Technologies</h2>
          
//           <div className="space-y-4">
//             <div className="flex space-x-2">
//               <input
//                 type="text"
//                 value={techInput}
//                 onChange={(e) => setTechInput(e.target.value)}
//                 placeholder="Add technology..."
//                 className="flex-1 border rounded-lg px-3 py-2"
//               />
//               <button
//                 type="button"
//                 onClick={() => handleArrayAdd('technologies', techInput, setTechInput)}
//                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//               >
//                 Add
//               </button>
//             </div>
            
//             <div className="flex flex-wrap gap-2">
//               {formData.technologies.map(tech => (
//                 <span
//                   key={tech}
//                   className="bg-gray-100 px-3 py-1 rounded-full flex items-center space-x-1"
//                 >
//                   <span>{tech}</span>
//                   <button
//                     type="button"
//                     onClick={() => handleArrayRemove('technologies', tech)}
//                     className="text-red-500 hover:text-red-700"
//                   >
//                     ×
//                   </button>
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Dates & Timeline */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">Timeline</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Start Date</label>
//               <input
//                 type="date"
//                 name="startDate"
//                 value={formData.startDate}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">End Date</label>
//               <input
//                 type="date"
//                 name="endDate"
//                 value={formData.endDate}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Project Duration</label>
//               <input
//                 type="text"
//                 name="projectDuration"
//                 value={formData.projectDuration}
//                 onChange={handleChange}
//                 placeholder="e.g., 3 months"
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Team Size</label>
//               <input
//                 type="number"
//                 name="teamSize"
//                 value={formData.teamSize}
//                 onChange={handleChange}
//                 min="1"
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Links */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">Links</h2>
          
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Project URL</label>
//               <input
//                 type="url"
//                 name="projectUrl"
//                 value={formData.projectUrl}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">GitHub URL</label>
//               <input
//                 type="url"
//                 name="githubUrl"
//                 value={formData.githubUrl}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Demo URL</label>
//               <input
//                 type="url"
//                 name="demoUrl"
//                 value={formData.demoUrl}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Location */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">Location</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Location</label>
//               <input
//                 type="text"
//                 name="location"
//                 value={formData.location}
//                 onChange={handleChange}
//                 placeholder="City, State"
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Country</label>
//               <input
//                 type="text"
//                 name="country"
//                 value={formData.country}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Budget */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">Budget</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Budget</label>
//               <input
//                 type="number"
//                 name="budget"
//                 value={formData.budget}
//                 onChange={handleChange}
//                 step="0.01"
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Currency</label>
//               <select
//                 name="currency"
//                 value={formData.currency}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2"
//               >
//                 <option value="USD">USD</option>
//                 <option value="EUR">EUR</option>
//                 <option value="GBP">GBP</option>
//                 <option value="JPY">JPY</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Testimonial */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">Client Testimonial</h2>
          
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Testimonial</label>
//               <textarea
//                 name="clientTestimonial"
//                 value={formData.clientTestimonial}
//                 onChange={handleChange}
//                 rows="4"
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Author</label>
//                 <input
//                   type="text"
//                   name="testimonialAuthor"
//                   value={formData.testimonialAuthor}
//                   onChange={handleChange}
//                   className="w-full border rounded-lg px-3 py-2"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Position</label>
//                 <input
//                   type="text"
//                   name="testimonialPosition"
//                   value={formData.testimonialPosition}
//                   onChange={handleChange}
//                   className="w-full border rounded-lg px-3 py-2"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Media Upload */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">Media Files</h2>
          
//           <div>
//             <label className="block text-sm font-medium mb-2">
//               Upload Images/Videos/Documents
//             </label>
//             <input
//               type="file"
//               multiple
//               accept="image/*,video/*,.pdf,.doc,.docx"
//               onChange={handleFileChange}
//               className="w-full"
//             />
//             <p className="text-sm text-gray-500 mt-1">
//               Max 20 files. Images (10MB), Videos (100MB), Documents (20MB)
//             </p>
//           </div>

//           {mediaFiles.length > 0 && (
//             <div className="mt-4">
//               <h3 className="font-medium mb-2">Selected files:</h3>
//               <ul className="list-disc list-inside">
//                 {Array.from(mediaFiles).map((file, index) => (
//                   <li key={index} className="text-sm text-gray-600">
//                     {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>

//         {/* Submit Buttons */}
//         <div className="flex justify-end space-x-4">
//           <button
//             type="button"
//             onClick={() => navigate('/admin/projects')}
//             className="px-6 py-2 border rounded-lg hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//           >
//             {id ? 'Update Project' : 'Create Project'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ProjectForm;



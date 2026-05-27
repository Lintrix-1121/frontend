import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FolderIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import categoryApi from '../../services/admin/CategoriesApi';

const CategoriesView = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Extended form data with all required fields
  const [formData, setFormData] = useState({ 
    name: '', 
    slug: '', 
    description: '',
    parentId: null,
    image: '',
    isActive: true,
    displayOrder: 0,
    metaTitle: '',
    metaDescription: ''
  });

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryApi.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError(err.message || 'Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.name.trim()) {
      showError('Please enter a category name');
      return;
    }

    if (!formData.slug.trim()) {
      showError('Please enter a URL slug');
      return;
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(formData.slug)) {
      showError('Slug can only contain lowercase letters, numbers, and hyphens');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare data for backend
      const categoryData = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description || '',
        parentId: formData.parentId || null,
        image: formData.image || '',
        isActive: formData.isActive,
        displayOrder: parseInt(formData.displayOrder) || 0,
        metaTitle: formData.metaTitle || '',
        metaDescription: formData.metaDescription || ''
      };

      if (editingCategory) {
        // Update existing category
        const id = editingCategory.categoryId || editingCategory.id;
        const updatedCategory = await categoryApi.updateCategory(id, categoryData);
        
        // Update local state
        setCategories(prev => prev.map(cat =>
          (cat.categoryId === id || cat.id === id) ? updatedCategory : cat
        ));
        
        setSuccessMessage('Category updated successfully!');
      } else {
        // Create new category
        const newCategory = await categoryApi.createCategory(categoryData);
        
        // Update local state
        setCategories(prev => [...prev, newCategory]);
        
        setSuccessMessage('Category created successfully!');
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
      
      handleCloseModal();
      
    } catch (err) {
      console.error('Failed to save category:', err);
      showError(err.message || 'Failed to save category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ 
      name: category.name, 
      slug: category.slug,
      description: category.description || '',
      parentId: category.parentId || null,
      image: category.image || '',
      isActive: category.isActive !== undefined ? category.isActive : true,
      displayOrder: category.displayOrder || 0,
      metaTitle: category.metaTitle || '',
      metaDescription: category.metaDescription || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? All products in this category will become uncategorized.')) {
      return;
    }

    try {
      await categoryApi.deleteCategory(id);
      
      // Update local state
      setCategories(prev => prev.filter(cat => 
        (cat.categoryId !== id && cat.id !== id)
      ));
      
      setSuccessMessage('Category deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (err) {
      console.error('Failed to delete category:', err);
      showError(err.message || 'Failed to delete category. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ 
      name: '', 
      slug: '', 
      description: '',
      parentId: null,
      image: '',
      isActive: true,
      displayOrder: 0,
      metaTitle: '',
      metaDescription: ''
    });
    setError(null);
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    const newSlug = generateSlug(name);
    
    setFormData(prev => ({ 
      ...prev, 
      name: name,
      // Auto-generate slug if slug field is empty or matches the previous generated slug
      slug: prev.slug === generateSlug(prev.name) || prev.slug === '' 
        ? newSlug 
        : prev.slug
    }));
  };

  const handleSlugChange = (e) => {
    const slug = e.target.value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    setFormData(prev => ({ ...prev, slug }));
  };

  const showError = (message) => {
    setError(message);
    // Auto-clear error after 5 seconds
    setTimeout(() => setError(null), 5000);
  };

  // Filter out current category from parent options (can't be parent of itself)
  const getParentOptions = () => {
    if (!editingCategory) return categories;
    
    const currentId = editingCategory.categoryId || editingCategory.id;
    return categories.filter(cat => 
      (cat.categoryId !== currentId && cat.id !== currentId) &&
      // Also prevent circular references (category can't be parent of its own parent)
      !(cat.parentId === currentId)
    );
  };

  const refreshCategories = () => {
    loadCategories();
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Categories</h2>
          <p className="text-muted mb-0">Manage product categories</p>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            onClick={refreshCategories}
            disabled={loading}
            title="Refresh categories"
          >
            <ArrowPathIcon width={18} />
            Refresh
          </button>
          <button
            className="btn btn-success d-flex align-items-center gap-2"
            onClick={() => setIsModalOpen(true)}
            disabled={loading}
          >
            <PlusIcon width={18} />
            Add Category
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center" role="alert">
          <CheckCircleIcon width={20} className="me-2" />
          <div>{successMessage}</div>
          <button type="button" className="btn-close" onClick={() => setSuccessMessage('')} />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center" role="alert">
          <ExclamationTriangleIcon width={20} className="me-2" />
          <div>{error}</div>
          <button type="button" className="btn-close" onClick={() => setError(null)} />
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading categories...</p>
        </div>
      )}

      {/* Categories Grid */}
      {!loading && categories.length > 0 && (
        <>
          <div className="row g-4">
            {categories.map(category => {
              // Use categoryId for backend data, id for mock data
              const categoryId = category.categoryId || category.id;
              const parentCategory = category.parentId 
                ? categories.find(c => (c.categoryId === category.parentId || c.id === category.parentId))
                : null;

              return (
                <div key={categoryId} className="col-sm-6 col-lg-4 col-xl-3">
                  <div className="card h-100 shadow-sm hover-shadow transition-all">
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className="bg-primary bg-opacity-10 p-2 rounded">
                            <FolderIcon width={24} className="text-primary" />
                          </div>
                          <div>
                            <div className="fw-medium">{category.name}</div>
                            <small className="text-muted">{category.slug}</small>
                            {parentCategory && (
                              <small className="d-block text-info">
                                Parent: {parentCategory.name}
                              </small>
                            )}
                          </div>
                        </div>

                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary p-1"
                            onClick={() => handleEdit(category)}
                            title="Edit category"
                          >
                            <PencilIcon width={16} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger p-1"
                            onClick={() => handleDelete(categoryId)}
                            title="Delete category"
                          >
                            <TrashIcon width={16} />
                          </button>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between small mb-2">
                        <span className="text-muted">Products</span>
                        <span className="fw-medium">{category.productCount || 0}</span>
                      </div>

                      <div className="d-flex justify-content-between small">
                        <span className="text-muted">Status</span>
                        <span
                          className={`badge ${
                            category.isActive
                              ? 'bg-success-subtle text-success'
                              : 'bg-secondary-subtle text-secondary'
                          }`}
                        >
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      {category.displayOrder > 0 && (
                        <div className="d-flex justify-content-between small mt-2">
                          <span className="text-muted">Display Order</span>
                          <span className="fw-medium">{category.displayOrder}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats Footer */}
          <div className="mt-4 pt-3 border-top">
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-muted small">
                Showing {categories.length} category{categories.length !== 1 ? 's' : ''}
              </div>
              <div className="text-muted small">
                Total Products: {categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0)}
              </div>
            </div>
          </div>
        </>
      )}

      {/* No Categories Message */}
      {!loading && categories.length === 0 && (
        <div className="text-center py-5">
          <div className="bg-light rounded-circle d-inline-flex p-4 mb-3">
            <FolderIcon width={48} className="text-muted" />
          </div>
          <h4 className="mb-2">No Categories Yet</h4>
          <p className="text-muted mb-4">Start by creating your first product category</p>
          <button
            className="btn btn-primary d-flex align-items-center gap-2 mx-auto"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusIcon width={18} />
            Create First Category
          </button>
        </div>
      )}

      {/* Modal - FIXED VERSION */}
      {isModalOpen && (
        <>
          {/* Modal Backdrop */}
          <div 
            className="modal-backdrop fade show" 
            style={{ opacity: 0.3 }}
            onClick={handleCloseModal}
          />
          
          {/* Modal Dialog */}
          <div 
            className="modal fade show d-block"
            style={{ backgroundColor: 'transparent' }}
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <form onSubmit={handleSubmit}>
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {editingCategory ? 'Edit Category' : 'Add New Category'}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={handleCloseModal}
                      disabled={isSubmitting}
                      aria-label="Close"
                    />
                  </div>

                  <div className="modal-body">
                    {/* Error in modal */}
                    {error && (
                      <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center mb-3" role="alert">
                        <ExclamationTriangleIcon width={16} className="me-2" />
                        <small>{error}</small>
                        <button 
                          type="button" 
                          className="btn-close btn-close-sm" 
                          onClick={() => setError(null)}
                          aria-label="Close error"
                        />
                      </div>
                    )}

                    <div className="mb-3">
                      <label htmlFor="categoryName" className="form-label">
                        Category Name *
                        <span className="text-muted small ms-1">(e.g., "Water Filters")</span>
                      </label>
                      <input
                        id="categoryName"
                        type="text"
                        className="form-control"
                        required
                        value={formData.name}
                        onChange={handleNameChange}
                        placeholder="Enter category name"
                        autoFocus
                        disabled={isSubmitting}
                        autoComplete="new-category-name"
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="categorySlug" className="form-label">
                        URL Slug *
                        <span className="text-muted small ms-1">(e.g., "water-filters")</span>
                      </label>
                      <input
                        id="categorySlug"
                        type="text"
                        className="form-control"
                        required
                        value={formData.slug}
                        onChange={handleSlugChange}
                        placeholder="url-slug"
                        disabled={isSubmitting}
                        autoComplete="new-category-slug"
                      />
                      <div className="form-text small">
                        This will be used in URLs. Only lowercase letters, numbers, and hyphens are allowed.
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="categoryDescription" className="form-label">Description</label>
                      <textarea
                        id="categoryDescription"
                        className="form-control"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Enter category description"
                        rows="3"
                        disabled={isSubmitting}
                        autoComplete="off"
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="parentCategory" className="form-label">Parent Category</label>
                        <select
                          id="parentCategory"
                          className="form-select"
                          value={formData.parentId || ''}
                          onChange={(e) =>
                            setFormData({ ...formData, parentId: e.target.value ? parseInt(e.target.value) : null })
                          }
                          disabled={isSubmitting}
                        >
                          <option value="">None (Top Level Category)</option>
                          {getParentOptions().map(cat => {
                            const catId = cat.categoryId || cat.id;
                            return (
                              <option key={catId} value={catId}>
                                {cat.name}
                              </option>
                            );
                          })}
                        </select>
                        <div className="form-text small">
                          Select a parent category if this is a sub-category
                        </div>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="displayOrder" className="form-label">Display Order</label>
                        <input
                          id="displayOrder"
                          type="number"
                          className="form-control"
                          value={formData.displayOrder}
                          onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                          placeholder="0"
                          min="0"
                          disabled={isSubmitting}
                          autoComplete="off"
                        />
                        <div className="form-text small">
                          Lower numbers appear first
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="imageUrl" className="form-label">Image URL</label>
                      <input
                        id="imageUrl"
                        type="text"
                        className="form-control"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                        disabled={isSubmitting}
                        autoComplete="off"
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="metaTitle" className="form-label">Meta Title</label>
                        <input
                          id="metaTitle"
                          type="text"
                          className="form-control"
                          value={formData.metaTitle}
                          onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                          placeholder="SEO title"
                          disabled={isSubmitting}
                          autoComplete="off"
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="status" className="form-label">Status</label>
                        <select
                          id="status"
                          className="form-select"
                          value={formData.isActive}
                          onChange={(e) =>
                            setFormData({ ...formData, isActive: e.target.value === 'true' })
                          }
                          disabled={isSubmitting}
                        >
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="metaDescription" className="form-label">Meta Description</label>
                      <textarea
                        id="metaDescription"
                        className="form-control"
                        value={formData.metaDescription}
                        onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                        placeholder="SEO description"
                        rows="2"
                        disabled={isSubmitting}
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleCloseModal}
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
                          {editingCategory ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        editingCategory ? 'Update Category' : 'Create Category'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoriesView;



// import React, { useState, useEffect } from 'react';
// import {
//   PlusIcon,
//   PencilIcon,
//   TrashIcon,
//   FolderIcon,
//   ExclamationTriangleIcon,
//   CheckCircleIcon
// } from '@heroicons/react/24/outline';
// import categoryApi from '../../services/admin/CategoriesApi'; // Adjust path as needed

// const CategoriesView = () => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [editingCategory, setEditingCategory] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
  
//   // Extended form data with all required fields
//   const [formData, setFormData] = useState({ 
//     name: '', 
//     slug: '', 
//     description: '',
//     parentId: null,
//     image: '',
//     isActive: true,
//     displayOrder: 0,
//     metaTitle: '',
//     metaDescription: ''
//   });

//   // Load categories on component mount
//   useEffect(() => {
//     loadCategories();
//   }, []);

//   const loadCategories = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const data = await categoryApi.getCategories();
//       setCategories(data);
//     } catch (err) {
//       console.error('Failed to load categories:', err);
//       setError(err.message || 'Failed to load categories. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Form validation
//     if (!formData.name.trim()) {
//       showError('Please enter a category name');
//       return;
//     }

//     if (!formData.slug.trim()) {
//       showError('Please enter a URL slug');
//       return;
//     }

//     // Validate slug format
//     const slugRegex = /^[a-z0-9-]+$/;
//     if (!slugRegex.test(formData.slug)) {
//       showError('Slug can only contain lowercase letters, numbers, and hyphens');
//       return;
//     }

//     setIsSubmitting(true);
//     setError(null);

//     try {
//       // Prepare data for backend
//       const categoryData = {
//         name: formData.name.trim(),
//         slug: formData.slug.trim(),
//         description: formData.description || '',
//         parentId: formData.parentId || null,
//         image: formData.image || '',
//         isActive: formData.isActive,
//         displayOrder: parseInt(formData.displayOrder) || 0,
//         metaTitle: formData.metaTitle || '',
//         metaDescription: formData.metaDescription || ''
//       };

//       if (editingCategory) {
//         // Update existing category
//         const id = editingCategory.categoryId || editingCategory.id;
//         const updatedCategory = await categoryApi.updateCategory(id, categoryData);
        
//         // Update local state
//         setCategories(prev => prev.map(cat =>
//           (cat.categoryId === id || cat.id === id) ? updatedCategory : cat
//         ));
        
//         setSuccessMessage('Category updated successfully!');
//       } else {
//         // Create new category
//         const newCategory = await categoryApi.createCategory(categoryData);
        
//         // Update local state
//         setCategories(prev => [...prev, newCategory]);
        
//         setSuccessMessage('Category created successfully!');
//       }

//       // Clear success message after 3 seconds
//       setTimeout(() => setSuccessMessage(''), 3000);
      
//       handleCloseModal();
      
//     } catch (err) {
//       console.error('Failed to save category:', err);
//       showError(err.message || 'Failed to save category. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleEdit = (category) => {
//     setEditingCategory(category);
//     setFormData({ 
//       name: category.name, 
//       slug: category.slug,
//       description: category.description || '',
//       parentId: category.parentId || null,
//       image: category.image || '',
//       isActive: category.isActive !== undefined ? category.isActive : true,
//       displayOrder: category.displayOrder || 0,
//       metaTitle: category.metaTitle || '',
//       metaDescription: category.metaDescription || ''
//     });
//     setIsModalOpen(true);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this category? All products in this category will become uncategorized.')) {
//       return;
//     }

//     try {
//       await categoryApi.deleteCategory(id);
      
//       // Update local state
//       setCategories(prev => prev.filter(cat => 
//         (cat.categoryId !== id && cat.id !== id)
//       ));
      
//       setSuccessMessage('Category deleted successfully!');
//       setTimeout(() => setSuccessMessage(''), 3000);
      
//     } catch (err) {
//       console.error('Failed to delete category:', err);
//       showError(err.message || 'Failed to delete category. Please try again.');
//     }
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setEditingCategory(null);
//     setFormData({ 
//       name: '', 
//       slug: '', 
//       description: '',
//       parentId: null,
//       image: '',
//       isActive: true,
//       displayOrder: 0,
//       metaTitle: '',
//       metaDescription: ''
//     });
//     setError(null);
//   };

//   const generateSlug = (name) => {
//     return name
//       .toLowerCase()
//       .trim()
//       .replace(/[^\w\s-]/g, '')
//       .replace(/[\s_-]+/g, '-')
//       .replace(/^-+|-+$/g, '');
//   };

//   const handleNameChange = (e) => {
//     const name = e.target.value;
//     const newSlug = generateSlug(name);
    
//     setFormData(prev => ({ 
//       ...prev, 
//       name: name,
//       // Auto-generate slug if slug field is empty or matches the previous generated slug
//       slug: prev.slug === generateSlug(prev.name) || prev.slug === '' 
//         ? newSlug 
//         : prev.slug
//     }));
//   };

//   const handleSlugChange = (e) => {
//     const slug = e.target.value
//       .toLowerCase()
//       .replace(/\s+/g, '-')
//       .replace(/[^a-z0-9-]/g, '');
//     setFormData(prev => ({ ...prev, slug }));
//   };

//   const showError = (message) => {
//     setError(message);
//     // Auto-clear error after 5 seconds
//     setTimeout(() => setError(null), 5000);
//   };

//   // Filter out current category from parent options (can't be parent of itself)
//   const getParentOptions = () => {
//     if (!editingCategory) return categories;
    
//     const currentId = editingCategory.categoryId || editingCategory.id;
//     return categories.filter(cat => 
//       (cat.categoryId !== currentId && cat.id !== currentId) &&
//       // Also prevent circular references (category can't be parent of its own parent)
//       !(cat.parentId === currentId)
//     );
//   };

//   const refreshCategories = () => {
//     loadCategories();
//   };

//   return (
//     <div className="container-fliud py-4">
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h2 className="fw-bold mb-1">Categories</h2>
//           <p className="text-muted mb-0">Manage product categories</p>
//         </div>

//         <div className="d-flex gap-2">
//           <button
//             className="btn btn-outline-secondary d-flex align-items-center gap-2"
//             onClick={refreshCategories}
//             disabled={loading}
//             title="Refresh categories"
//           >
//             <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//             </svg>
//             Refresh
//           </button>
//           <button
//             className="btn btn-success d-flex align-items-center gap-2"
//             onClick={() => setIsModalOpen(true)}
//             disabled={loading}
//           >
//             <PlusIcon width={18} />
//             Add Category
//           </button>
//         </div>
//       </div>

//       {/* Success Message */}
//       {successMessage && (
//         <div className="alert alert-success alert-dismissible fade show d-flex align-items-center" role="alert">
//           <CheckCircleIcon width={20} className="me-2" />
//           <div>{successMessage}</div>
//           <button type="button" className="btn-close" onClick={() => setSuccessMessage('')} />
//         </div>
//       )}

//       {/* Error Message */}
//       {error && (
//         <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center" role="alert">
//           <ExclamationTriangleIcon width={20} className="me-2" />
//           <div>{error}</div>
//           <button type="button" className="btn-close" onClick={() => setError(null)} />
//         </div>
//       )}

//       {/* Loading State */}
//       {loading && (
//         <div className="text-center py-5">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-3 text-muted">Loading categories...</p>
//         </div>
//       )}

//       {/* Categories Grid */}
//       {!loading && categories.length > 0 && (
//         <>
//           <div className="row g-4">
//             {categories.map(category => {
//               // Use categoryId for backend data, id for mock data
//               const categoryId = category.categoryId || category.id;
//               const parentCategory = category.parentId 
//                 ? categories.find(c => (c.categoryId === category.parentId || c.id === category.parentId))
//                 : null;

//               return (
//                 <div key={categoryId} className="col-sm-6 col-lg-4 col-xl-3">
//                   <div className="card h-100 shadow-sm hover-shadow transition-all">
//                     <div className="card-body">
//                       <div className="d-flex justify-content-between mb-3">
//                         <div className="d-flex align-items-center gap-3">
//                           <div className="bg-primary bg-opacity-10 p-2 rounded">
//                             <FolderIcon width={24} className="text-primary" />
//                           </div>
//                           <div>
//                             <div className="fw-medium">{category.name}</div>
//                             <small className="text-muted">{category.slug}</small>
//                             {parentCategory && (
//                               <small className="d-block text-info">
//                                 Parent: {parentCategory.name}
//                               </small>
//                             )}
//                           </div>
//                         </div>

//                         <div className="d-flex gap-2">
//                           <button
//                             className="btn btn-sm btn-outline-primary p-1"
//                             onClick={() => handleEdit(category)}
//                             title="Edit category"
//                           >
//                             <PencilIcon width={16} />
//                           </button>
//                           <button
//                             className="btn btn-sm btn-outline-danger p-1"
//                             onClick={() => handleDelete(categoryId)}
//                             title="Delete category"
//                           >
//                             <TrashIcon width={16} />
//                           </button>
//                         </div>
//                       </div>

//                       <div className="d-flex justify-content-between small mb-2">
//                         <span className="text-muted">Products</span>
//                         <span className="fw-medium">{category.productCount || 0}</span>
//                       </div>

//                       <div className="d-flex justify-content-between small">
//                         <span className="text-muted">Status</span>
//                         <span
//                           className={`badge ${
//                             category.isActive
//                               ? 'bg-success-subtle text-success'
//                               : 'bg-secondary-subtle text-secondary'
//                           }`}
//                         >
//                           {category.isActive ? 'Active' : 'Inactive'}
//                         </span>
//                       </div>

//                       {category.displayOrder > 0 && (
//                         <div className="d-flex justify-content-between small mt-2">
//                           <span className="text-muted">Display Order</span>
//                           <span className="fw-medium">{category.displayOrder}</span>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Stats Footer */}
//           <div className="mt-4 pt-3 border-top">
//             <div className="d-flex justify-content-between align-items-center">
//               <div className="text-muted small">
//                 Showing {categories.length} category{categories.length !== 1 ? 's' : ''}
//               </div>
//               <div className="text-muted small">
//                 Total Products: {categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0)}
//               </div>
//             </div>
//           </div>
//         </>
//       )}

//       {/* No Categories Message */}
//       {!loading && categories.length === 0 && (
//         <div className="text-center py-5">
//           <div className="bg-light rounded-circle d-inline-flex p-4 mb-3">
//             <FolderIcon width={48} className="text-muted" />
//           </div>
//           <h4 className="mb-2">No Categories Yet</h4>
//           <p className="text-muted mb-4">Start by creating your first product category</p>
//           <button
//             className="btn btn-primary d-flex align-items-center gap-2 mx-auto"
//             onClick={() => setIsModalOpen(true)}
//           >
//             <PlusIcon width={18} />
//             Create First Category
//           </button>
//         </div>
//       )}

//       {/* Modal */}
//       {isModalOpen && (
//         <div 
//           className="modal fade show" 
//           style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
//           tabIndex="-1"
//         >
//           <div className="modal-dialog modal-dialog-centered">
//             <div 
//               className="modal-content"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <form onSubmit={handleSubmit}>
//                 <div className="modal-header">
//                   <h5 className="modal-title">
//                     {editingCategory ? 'Edit Category' : 'Add New Category'}
//                   </h5>
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={handleCloseModal}
//                     disabled={isSubmitting}
//                     aria-label="Close"
//                   />
//                 </div>

//                 <div className="modal-body">
//                   {/* Error in modal */}
//                   {error && (
//                     <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center mb-3" role="alert">
//                       <ExclamationTriangleIcon width={16} className="me-2" />
//                       <small>{error}</small>
//                       <button type="button" className="btn-close btn-close-sm" onClick={() => setError(null)} />
//                     </div>
//                   )}

//                   <div className="mb-3">
//                     <label className="form-label">
//                       Category Name *
//                       <span className="text-muted small ms-1">(e.g., "Water Filters")</span>
//                     </label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       required
//                       value={formData.name}
//                       onChange={handleNameChange}
//                       onFocus={(e) => e.stopPropagation()}
//                       placeholder="Enter category name"
//                       autoFocus
//                       disabled={isSubmitting}
//                     />
//                   </div>

//                   <div className="mb-3">
//                     <label className="form-label">
//                       URL Slug *
//                       <span className="text-muted small ms-1">(e.g., "water-filters")</span>
//                     </label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       required
//                       value={formData.slug}
//                       onChange={handleSlugChange}
//                       onFocus={(e) => e.stopPropagation()}
//                       placeholder="url-slug"
//                       disabled={isSubmitting}
//                     />
//                     <div className="form-text small">
//                       This will be used in URLs. Only lowercase letters, numbers, and hyphens are allowed.
//                     </div>
//                   </div>

//                   <div className="mb-3">
//                     <label className="form-label">Description</label>
//                     <textarea
//                       className="form-control"
//                       value={formData.description}
//                       onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                       onFocus={(e) => e.stopPropagation()}
//                       placeholder="Enter category description"
//                       rows="3"
//                       disabled={isSubmitting}
//                     />
//                   </div>

//                   <div className="row">
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">Parent Category</label>
//                       <select
//                         className="form-select"
//                         value={formData.parentId || ''}
//                         onChange={(e) =>
//                           setFormData({ ...formData, parentId: e.target.value ? parseInt(e.target.value) : null })
//                         }
//                         onFocus={(e) => e.stopPropagation()}
//                         disabled={isSubmitting}
//                       >
//                         <option value="">None (Top Level Category)</option>
//                         {getParentOptions().map(cat => {
//                           const catId = cat.categoryId || cat.id;
//                           return (
//                             <option key={catId} value={catId}>
//                               {cat.name}
//                             </option>
//                           );
//                         })}
//                       </select>
//                       <div className="form-text small">
//                         Select a parent category if this is a sub-category
//                       </div>
//                     </div>

//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">Display Order</label>
//                       <input
//                         type="number"
//                         className="form-control"
//                         value={formData.displayOrder}
//                         onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
//                         onFocus={(e) => e.stopPropagation()}
//                         placeholder="0"
//                         min="0"
//                         disabled={isSubmitting}
//                       />
//                       <div className="form-text small">
//                         Lower numbers appear first
//                       </div>
//                     </div>
//                   </div>

//                   <div className="mb-3">
//                     <label className="form-label">Image URL</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       value={formData.image}
//                       onChange={(e) => setFormData({ ...formData, image: e.target.value })}
//                       onFocus={(e) => e.stopPropagation()}
//                       placeholder="https://example.com/image.jpg"
//                       disabled={isSubmitting}
//                     />
//                   </div>

//                   <div className="row">
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">Meta Title</label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         value={formData.metaTitle}
//                         onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
//                         onFocus={(e) => e.stopPropagation()}
//                         placeholder="SEO title"
//                         disabled={isSubmitting}
//                       />
//                     </div>

//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">Status</label>
//                       <select
//                         className="form-select"
//                         value={formData.isActive}
//                         onChange={(e) =>
//                           setFormData({ ...formData, isActive: e.target.value === 'true' })
//                         }
//                         onFocus={(e) => e.stopPropagation()}
//                         disabled={isSubmitting}
//                       >
//                         <option value="true">Active</option>
//                         <option value="false">Inactive</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div className="mb-3">
//                     <label className="form-label">Meta Description</label>
//                     <textarea
//                       className="form-control"
//                       value={formData.metaDescription}
//                       onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
//                       onFocus={(e) => e.stopPropagation()}
//                       placeholder="SEO description"
//                       rows="2"
//                       disabled={isSubmitting}
//                     />
//                   </div>
//                 </div>

//                 <div className="modal-footer">
//                   <button
//                     type="button"
//                     className="btn btn-outline-secondary"
//                     onClick={handleCloseModal}
//                     disabled={isSubmitting}
//                   >
//                     Cancel
//                   </button>
//                   <button 
//                     type="submit" 
//                     className="btn btn-primary"
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? (
//                       <>
//                         <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                         {editingCategory ? 'Updating...' : 'Creating...'}
//                       </>
//                     ) : (
//                       editingCategory ? 'Update Category' : 'Create Category'
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
          
//           {/* Modal Backdrop - Click to close */}
//           <div 
//             className="modal-backdrop fade show" 
//             style={{ opacity: 0.5 }}
//             onClick={handleCloseModal}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default CategoriesView;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../../views/admin/ProductForm';
import AdminProductService from '../../services/admin/AdminProductService';
import AdminProductModel from '../../models/admin/AdminProductModel';

const ProductFormContainer = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(!!productId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  // Fetch product if editing
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setApiError(null);

        // Fetch categories
        const categoriesResponse = await AdminProductService.getCategoriesFlat();
        setCategories(categoriesResponse);

        if (productId) {
          // Fetch product
          const productData = await AdminProductService.getProductById(productId);
          
          // Process product images
          const processedProduct = {
            ...productData,
            images: productData.images || [],
            thumbnail: productData.thumbnail || null
          };
          
          setProduct(processedProduct);
          
          // Fetch sub-categories based on selected category
          const flatCategories = categoriesResponse;
          const subs = flatCategories.filter(
            category => category.parentId === productData.categoryId
          );

          if (productData.categoryId) {
           
            setSubCategories(subs);
          }
          else {
            setSubCategories([]);
          }
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setApiError(err.message || 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [productId]);

  // Handle form submission
  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setValidationErrors({});
      setApiError(null);

      // Basic validation
      const errors = {};
      if (!formData.name || formData.name.trim() === '') {
        errors.name = 'Product name is required';
      }
      if (!formData.sku || formData.sku.trim() === '') {
        errors.sku = 'SKU is required';
      }
      if (!formData.price || formData.price <= 0) {
        errors.price = 'Valid price is required';
      }
      if (!formData.quantity || formData.quantity < 0) {
        errors.quantity = 'Valid quantity is required';
      }

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        setIsSubmitting(false);
        return;
      }

      let result;
      if (productId) {
        result = await AdminProductService.updateProduct(productId, formData);
      } else {
        result = await AdminProductService.createProduct(formData);
      }

      // Success handling
      console.log('Product saved successfully:', result);
      
      // Show success message
      alert(productId ? 'Product updated successfully!' : 'Product created successfully!');
      
      // Redirect to products list
      navigate('/admin/products');

    } catch (err) {
      console.error('Error saving product:', err);
      
      // Handle specific errors
      if (err.response) {
        if (err.response.status === 409) {
          setApiError('SKU already exists. Please use a different SKU.');
        } else if (err.response.status === 413) {
          setApiError('File too large. Maximum file size is 5MB.');
        } else if (err.response.status === 415) {
          setApiError('Invalid file type. Only image files are allowed.');
        } else {
          setApiError(err.response.data?.message || 'Failed to save product. Please try again.');
        }
      } else {
        setApiError(err.message || 'Failed to save product. Please try again.');
      }
      
      window.scrollTo(0, 0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      navigate('/admin/products');
    }
  };

  // If editing and product doesn't exist
  if (productId && !isLoading && !product) {
    return (
      <div className="container text-center py-5">
        <h3>Product Not Found</h3>
        <p>The product you're trying to edit doesn't exist.</p>
        <button className="btn btn-primary" onClick={() => navigate('/admin/products')}>
          Back to Products
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading product...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* API Error */}
      {apiError && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Error:</strong> {apiError}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setApiError(null)}
          />
        </div>
      )}

      {/* Validation Errors */}
      {Object.keys(validationErrors).length > 0 && (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          <strong>Validation Errors:</strong>
          <ul className="mb-0 mt-2">
            {Object.entries(validationErrors).map(([field, error]) => (
              <li key={field}>{field}: {error}</li>
            ))}
          </ul>
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setValidationErrors({})}
          />
        </div>
      )}

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0">
            {productId ? 'Edit Product' : 'Create New Product'}
          </h1>
          <p className="text-muted mb-0">
            {productId 
              ? `Editing ${product?.name || 'product'}` 
              : 'Add a new product to your store'
            }
          </p>
        </div>
        
        {isSubmitting && (
          <div className="d-flex align-items-center">
            <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
              <span className="visually-hidden">Saving...</span>
            </div>
            <span>Saving...</span>
          </div>
        )}
      </div>

      {/* Product Form */}
      <div className="card">
        <div className="card-body">
          <ProductForm
            product={product}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            categories={categories}
            subCategories={subCategories}
          />
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-3 text-muted small">
        <p className="mb-1">
          <strong>Note:</strong> Images can be uploaded in the Images tab. The first image will be set as thumbnail by default.
        </p>
        <p className="mb-0">
          All fields marked with * are required.
        </p>
      </div>
    </div>
  );
};

export default ProductFormContainer;



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


  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setApiError(null);

        // Load categories
        const categoriesResponse =
          await AdminProductService.getCategoriesFlat();

        setCategories(categoriesResponse || []);

        if (!productId) {
          setProduct(null);
          return;
        }

        // Load product
        const productData =
          await AdminProductService.getProductById(productId);

        console.log('========== EDIT PRODUCT ==========');
        console.log('Product returned from service:', productData);
        console.log('Product name:', productData?.name);
        console.log('Product SKU:', productData?.sku);
        console.log('Product price:', productData?.price);
        console.log('Product quantity:', productData?.quantity);
        console.log('Product category:', productData?.categoryId);
        console.log('Product subcategory:', productData?.subCategoryId);
        console.log('Product images:', productData?.images);
        console.log('Product specifications:', productData?.specifications);
        console.log('Product tags:', productData?.tags);
        console.log('=================================');

        // Convert API/model object into plain form values
        const normalizedProduct = {
          id: productData?.id ?? productData?.productId ?? productId,

          name: productData?.name ?? '',
          sku: productData?.sku ?? '',

          price:
            productData?.price !== null &&
            productData?.price !== undefined
              ? String(productData.price)
              : '',

          comparePrice:
            productData?.comparePrice !== null &&
            productData?.comparePrice !== undefined
              ? String(productData.comparePrice)
              : '',

          cost:
            productData?.cost !== null &&
            productData?.cost !== undefined
              ? String(productData.cost)
              : '',

          quantity:
            productData?.quantity !== null &&
            productData?.quantity !== undefined
              ? String(productData.quantity)
              : '0',

          brand: productData?.brand ?? '',
          description: productData?.description ?? '',

          categoryId:
            productData?.categoryId !== null &&
            productData?.categoryId !== undefined
              ? String(productData.categoryId)
              : '',

          subCategoryId:
            productData?.subCategoryId !== null &&
            productData?.subCategoryId !== undefined
              ? String(productData.subCategoryId)
              : '',

          isActive: productData?.isActive ?? true,
          isFeatured: productData?.isFeatured ?? false,
          isOnSale: productData?.isOnSale ?? false,

          salePrice:
            productData?.salePrice !== null &&
            productData?.salePrice !== undefined
              ? String(productData.salePrice)
              : '',

          saleStart: formatDateTimeLocal(productData?.saleStart),
          saleEnd: formatDateTimeLocal(productData?.saleEnd),

          weight:
            productData?.weight !== null &&
            productData?.weight !== undefined
              ? String(productData.weight)
              : '',

          dimensions:
            productData?.dimensions &&
            typeof productData.dimensions === 'object'
              ? JSON.stringify(productData.dimensions, null, 2)
              : productData?.dimensions ?? '',

          metaTitle: productData?.metaTitle ?? '',
          metaDescription: productData?.metaDescription ?? '',

          thumbnail: productData?.thumbnail ?? '',

          images: Array.isArray(productData?.images)
            ? productData.images
            : [],

          specifications:
            productData?.specifications &&
            typeof productData.specifications === 'object'
              ? productData.specifications
              : {},

          tags: Array.isArray(productData?.tags)
            ? productData.tags
            : []
        };

        console.log('========== NORMALIZED PRODUCT ==========');
        console.log(normalizedProduct);
        console.log('========================================');

        setProduct(normalizedProduct);

        // Correct subcategory filtering
        const subs = (categoriesResponse || []).filter(
          category =>
            Number(category.parentId) ===
            Number(productData?.categoryId)
        );

        setSubCategories(subs);

      } catch (err) {
        console.error('Error loading data:', err);
        setApiError(err.message || 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [productId]);


  const formatDateTimeLocal = (date) => {
    if (!date) return '';

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return '';
    }

    const pad = value => String(value).padStart(2, '0');

    return (
      `${d.getFullYear()}-` +
      `${pad(d.getMonth() + 1)}-` +
      `${pad(d.getDate())}T` +
      `${pad(d.getHours())}:` +
      `${pad(d.getMinutes())}`
    );
  };

  // Fetch product if editing
  // useEffect(() => {
  //   const loadData = async () => {
  //     try {
  //       setIsLoading(true);
  //       setApiError(null);

  //       // Fetch categories
  //       const categoriesResponse = await AdminProductService.getCategoriesFlat();
  //       setCategories(categoriesResponse);

  //       if (productId) {
  //         // Fetch product
  //         const productData = await AdminProductService.getProductById(productId);
          
  //         // Process product images
  //         const processedProduct = {
  //           ...productData,
  //           images: productData.images || [],
  //           thumbnail: productData.thumbnail || null
  //         };
          
  //         setProduct(processedProduct);
          
  //         // Fetch sub-categories based on selected category
  //         const flatCategories = categoriesResponse;
  //         const subs = flatCategories.filter(
  //           category => category.parentId === productData.categoryId
  //         );

  //         if (productData.categoryId) {
           
  //           setSubCategories(subs);
  //         }
  //         else {
  //           setSubCategories([]);
  //         }
  //       }
  //     } catch (err) {
  //       console.error('Error loading data:', err);
  //       setApiError(err.message || 'Failed to load data');
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   loadData();
  // }, [productId]);

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
            key={product?.id || productId}
            product={product}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            categories={categories}
            subCategories={subCategories}
          />
          {/* <ProductForm
            product={product}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            categories={categories}
            subCategories={subCategories}
          /> */}
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



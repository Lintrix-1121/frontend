import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from './ProductForm';
import AdminProductController from '../../controllers/admin/AdminProductController';
import useAdminProductStore from '../../stores/admin/useAdminProductStore';
import toast from 'react-hot-toast';

const EditProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const productStore = useAdminProductStore();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [controller, setController] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        console.log(` Initializing EditProductView for ID: ${id}`);
        
        // Create controller
        const ctrl = new AdminProductController(productStore);
        setController(ctrl);
        
        // Check if controller has the method
        console.log(' Controller methods available:', {
          loadProductById: typeof ctrl.loadProductById,
          updateProduct: typeof ctrl.updateProduct
        });
        
        // Fetch the specific product using the controller method
        console.log(` Calling loadProductById(${id})...`);
        const productData = await ctrl.loadProductById(id);
        
        console.log(' Product data received:', {
          id: productData?.id,
          name: productData?.name,
          hasImages: productData?.images?.length || 0,
          hasSpecifications: !!productData?.specifications,
          hasTags: productData?.tags?.length || 0
        });
        
        if (!productData) {
          throw new Error('Product not found');
        }
        
        setProduct(productData);
      } catch (error) {
        console.error(' Error loading product:', error);
        toast.error(`Failed to load product: ${error.message}`);
        navigate('/admin/products');
      } finally {
        setIsLoading(false);
      }
    };
    
    init();
  }, [id]);

  const handleSubmit = async (formData) => {
    if (!controller) {
      toast.error('Controller not initialized');
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log(' Updating product with data:', formData);
      
      await controller.updateProduct(id, formData);
      toast.success('Product updated successfully');
      navigate('/admin/products');
    } catch (error) {
      console.error(' Update error:', error);
      toast.error(`Update failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/products');
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading product data...</p>
          <small className="text-muted">Product ID: {id}</small>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            {product ? `Edit: ${product.name}` : 'Edit Product'}
          </h2>
          <small className="text-muted">
            {product && `ID: ${product.id} | SKU: ${product.sku}`}
          </small>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate(`/admin/products/${id}`)}
          >
            View Details
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
      
      {product ? (
        <div className="card">
          <div className="card-body">
            {/* Debug info - remove in production */}
            <div className="alert alert-info mb-4">
              <small>
                <strong>Debug Info:</strong> Product loaded successfully. 
                Images: {product.images?.length || 0}, 
                Tags: {product.tags?.length || 0}
              </small>
            </div>
            
            <ProductForm
              product={product}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      ) : (
        <div className="alert alert-danger">
          <h4>Product Not Found</h4>
          <p>The product you're trying to edit doesn't exist or you don't have permission to access it.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/admin/products')}
          >
            Return to Products
          </button>
        </div>
      )}
    </div>
  );
};

export default EditProductView;


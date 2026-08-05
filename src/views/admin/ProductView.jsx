import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import debounce from 'lodash/debounce';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowUpTrayIcon,
  EyeIcon,
  FunnelIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

import useAdminProductStore from '../../stores/admin/useAdminProductStore';
import AdminProductController from '../../controllers/admin/AdminProductController';
import ProductTable from '../../components/shared/ProductTable';
import BulkActions from '../../components/shared/BulkActions';
import ImportExportModal from '../../components/shared/ImportExportModal';
import DeleteConfirmationModal from '../../components/shared/DeleteConfirmationModal';
import StatusBadge from '../../components/shared/StatusBadge';
import AnalyticsModal from '../../components/shared/AnalyticsModal';
import SyncStatusBadge from '../../components/shared/SyncStatusBadge';
import useAuthStore from '../../stores/shared/useAuthStore';
import { useNavigate } from 'react-router-dom';

/* Enhanced Filters Component with Validation */
const ProductFilters = ({ register, errors, watch, onClear, isLoading }) => {
  const minPrice = watch('minPrice');
  const maxPrice = watch('maxPrice');

  return (
    <div className="row g-3">
      <div className="col-md-3">
        <div className="input-group">
          <span className="input-group-text">
            <MagnifyingGlassIcon width={16} />
          </span>
          <input
            {...register('search')}
            className={`form-control ${errors.search ? 'is-invalid' : ''}`}
            placeholder="Search products..."
            disabled={isLoading}
          />
          {errors.search && (
            <div className="invalid-feedback">{errors.search.message}</div>
          )}
        </div>
      </div>

      <div className="col-md-2">
        <input
          {...register('minPrice', {
            min: { value: 0, message: 'Must be ≥ 0' },
            validate: (value) => {
              if (!value || !maxPrice) return true;
              return Number(value) <= Number(maxPrice) || 'Must be ≤ max price';
            }
          })}
          type="number"
          step="0.01"
          min="0"
          className={`form-control ${errors.minPrice ? 'is-invalid' : ''}`}
          placeholder="Min price"
          disabled={isLoading}
        />
        {errors.minPrice && (
          <div className="invalid-feedback">{errors.minPrice.message}</div>
        )}
      </div>

      <div className="col-md-2">
        <input
          {...register('maxPrice', {
            min: { value: 0, message: 'Must be ≥ 0' },
            validate: (value) => {
              if (!value || !minPrice) return true;
              return Number(value) >= Number(minPrice) || 'Must be ≥ min price';
            }
          })}
          type="number"
          step="0.01"
          min="0"
          className={`form-control ${errors.maxPrice ? 'is-invalid' : ''}`}
          placeholder="Max price"
          disabled={isLoading}
        />
        {errors.maxPrice && (
          <div className="invalid-feedback">{errors.maxPrice.message}</div>
        )}
      </div>

      <div className="col-md-2">
        <select
          {...register('isActive')}
          className="form-select"
          disabled={isLoading}
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      <div className="col-md-2">
        <select
          {...register('inStock')}
          className="form-select"
          disabled={isLoading}
        >
          <option value="">All Stock</option>
          <option value="true">In Stock</option>
          <option value="false">Out of Stock</option>
        </select>
      </div>

      <div className="col-md-1 d-flex align-items-center">
        <button
          type="button"
          className="btn btn-outline-danger w-100"
          onClick={onClear}
          disabled={isLoading}
          title="Clear filters"
        >
          <XMarkIcon width={16} />
        </button>
      </div>
    </div>
  );
};

// Helper function to safely get thumbnail URL
const getProductThumbnail = (product) => {
  if (!product) return 'https://via.placeholder.com/400';
  
  // Use environment variable with fallback
  const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://api.logiphix.tech';
  
  // If thumbnail is already set and valid
  if (product.thumbnail && 
      product.thumbnail !== 'null' && 
      typeof product.thumbnail === 'string') {
    
    let thumbnail = product.thumbnail;
    
    // Convert relative URL to absolute
    if (thumbnail.startsWith('/')) {
      thumbnail = `${BACKEND_URL}${thumbnail}`;
    }
    
    return thumbnail;
  }
  
};

const ProductsView = () => {
  const productStore = useAdminProductStore();
  const [showFilters, setShowFilters] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [optimisticUpdates, setOptimisticUpdates] = useState({});
  const abortControllerRef = useRef(null);
  const filterTimeoutRef = useRef(null);
  const initializationAttemptedRef = useRef(false);

  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  // Get state from store
  const { 
    products, 
    isLoading, 
    error, 
    pagination, 
    filters,
    bulkSelection,
    _isInitialized 
  } = productStore;

  // Debug logging for first product
  useEffect(() => {
    if (products.length > 0) {
      const firstProduct = products[0];
      console.log('🔍 First product data:', {
        id: firstProduct.id,
        name: firstProduct.name,
        thumbnail: firstProduct.thumbnail,
        images: firstProduct.images,
        imagesCount: firstProduct.images?.length || 0,
        thumbnailFromHelper: getProductThumbnail(firstProduct)
      });
    }
  }, [products]);

  // Create controller instance (memoized)
  const controller = useMemo(() => {
    try {
      return new AdminProductController(productStore);
    } catch (err) {
      console.error('Failed to create controller:', err);
      toast.error(`Failed to initialize: ${err.message}`);
      return null;
    }
  }, [productStore]);

  // Enhanced initialization with guard against infinite loops
  useEffect(() => {
    if (!controller || initializationAttemptedRef.current) return;

    const initProducts = async () => {
      try {
        // Prevent multiple initialization attempts
        if (initializationAttemptedRef.current) return;
        initializationAttemptedRef.current = true;

        // Skip if already initialized or currently loading
        if (_isInitialized || isLoading) return;

        await controller.initializeProductsPage();
        
        // Reset initialization flag on success to allow re-initialization when needed
        initializationAttemptedRef.current = false;
         
      } catch (error) {
        console.error('Initialization error:', error);
        initializationAttemptedRef.current = false; // Reset on error to allow retry
        
        if (error.name === 'AbortError') {
          console.log('Request aborted during initialization');
          return;
        }
        
        toast.error(`Failed to load products: ${error.message}`);
      }
    };

    initProducts();

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, [controller, _isInitialized, isLoading]);

  // Setup form with validation only when controller is ready
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty }
  } = useForm({
    defaultValues: useMemo(() => {
      if (!controller) return {};
      const filters = controller.getCurrentFilters() || {};
      return {
        search: filters.search || '',
        brand: filters.brand || '',
        minPrice: filters.minPrice || '',
        maxPrice: filters.maxPrice || '',
        isActive: filters.isActive !== undefined ? String(filters.isActive) : '',
        inStock: filters.inStock !== null ? String(filters.inStock) : '',
        isFeatured: filters.isFeatured !== null ? String(filters.isFeatured) : '',
        isOnSale: filters.isOnSale !== null ? String(filters.isOnSale) : '',
      };
    }, [controller])
  });

  // Debounced filter application with validation
  const applyFiltersDebounced = useMemo(
    () =>
      debounce(async (formData) => {
        if (!controller) return;
        try {
          await controller.applyFilters(formData);
        } catch (error) {
          toast.error(`Failed to apply filters: ${error.message}`);
        }
      }, 500),
    [controller]
  );

  // Watch form changes and apply debounced filters
  useEffect(() => {
    if (!controller) return;
    
    const subscription = watch((value) => {
      if (isDirty) {
        applyFiltersDebounced(value);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, isDirty, applyFiltersDebounced, controller]);

  // Handle manual refresh with retry logic
  const handleRefresh = useCallback(async () => {
    if (!controller) return;
    
    setIsRefreshing(true);
    try {
      await controller.loadProducts(true); // Force refresh
      toast.success('Products refreshed');
    } catch (error) {
      toast.error('Failed to refresh products');
    } finally {
      setIsRefreshing(false);
    }
  }, [controller]);

  // Optimistic delete handler
  const handleDeleteProduct = useCallback(async (product) => {
    if (!controller || !product) return;
    
    const productId = product.id;
    
    // Optimistic update
    setOptimisticUpdates(prev => ({
      ...prev,
      [productId]: 'deleting'
    }));

    try {
      await controller.deleteProduct(productId);
      toast.success('Product deleted successfully');
      setShowDeleteModal(false);
      setSelectedProduct(null);
    } catch (error) {
      // Rollback optimistic update
      setOptimisticUpdates(prev => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });
      toast.error(`Failed to delete product: ${error.message}`);
    }
  }, [controller]);

  // Bulk action handler with optimistic updates
  const handleBulkAction = useCallback(async (action, productIds) => {
    if (!controller || !productIds.length) return;
    
    const updates = {};
    
    // Apply optimistic updates based on action
    if (action.status === 'active' || action.status === 'inactive') {
      productIds.forEach(id => {
        updates[id] = { isActive: action.status === 'active' };
      });
    }

    setOptimisticUpdates(prev => ({
      ...prev,
      ...updates
    }));

    try {
      await controller.bulkUpdateProducts(productIds, action);
      toast.success('Bulk update completed');
      
      // Clear optimistic updates after success
      setOptimisticUpdates({});
    } catch (error) {
      // Rollback optimistic updates
      setOptimisticUpdates({});
      toast.error(`Bulk update failed: ${error.message}`);
    }
  }, [controller]);

  // Export handler
  const handleExport = useCallback(async (format = 'csv') => {
    if (!controller) return;
    
    try {
      await controller.exportProducts(format);
      toast.success('Export started successfully');
    } catch (error) {
      toast.error(`Export failed: ${error.message}`);
    }
  }, [controller]);

  // Sync to Odoo handler
  const handleSyncToOdoo = useCallback(async (productId) => {
    if (!controller) return;
    
    try {
      // Optimistic update
      setOptimisticUpdates(prev => ({
        ...prev,
        [productId]: 'syncing'
      }));

      await controller.syncToOdoo(productId);
      toast.success('Product synced to Odoo');
      
      // Clear optimistic update
      setOptimisticUpdates(prev => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });
    } catch (error) {
      // Rollback
      setOptimisticUpdates(prev => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });
      toast.error(`Sync failed: ${error.message}`);
    }
  }, [controller]);

  // Pagination handler
  const handlePageChange = useCallback(async (page) => {
    if (!controller) return;
    
    try {
      await controller.changePage(page);
      // Scroll to top of product list
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast.error(`Failed to load page ${page}: ${error.message}`);
    }
  }, [controller]);

  // Handle filter clear
  const handleClearFilters = useCallback(async () => {
    if (!controller) return;
    
    reset();
    await controller.clearFilters();
  }, [controller, reset]);

  // Handle filter changes
  const handleFilterChange = useCallback((filterUpdates) => {
    if (!controller) return;
    
    controller.setFilters(filterUpdates);
  }, [controller]);

  // Loading / Error states
  if (isLoading && products.length === 0 && !_isInitialized) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-3">Loading products...</p>
          <small className="text-muted">Preparing your catalog</small>
        </div>
      </div>
    );
  }

  if (error && products.length === 0 && !isLoading) {
    return (
      <div className="container py-5 text-center">
        <ExclamationTriangleIcon className="text-danger mb-3" width={48} />
        <h4>Failed to Load Products</h4>
        <p className="text-muted">{error}</p>
        <div className="d-flex justify-content-center gap-2 mt-3">
          <button 
            className="btn btn-primary" 
            onClick={handleRefresh}
          >
            Retry
          </button>
          <button 
            className="btn btn-outline-secondary" 
            onClick={() => productStore.clearError()}
          >
            Clear Error
          </button>
        </div>
      </div>
    );
  }

  const handleAddProductClick = () => {
    console.log(' Add Product clicked');
    console.log(' Auth state:', { isAuthenticated, role: user?.role });
    console.log(' Current path:', window.location.pathname);
    console.log(' Navigating to:', '/admin/products/new');
    
    // Test navigation
    navigate('/admin/products/new');
  };

  //Main View
  return (
    <div className="container-fluid py-4">
      {/* Header with Stats */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Products</h2>
          <small className="text-muted">
            {pagination.totalItems} products • 
            Page {pagination.currentPage} of {pagination.totalPages}
          </small>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={() => setShowFilters(!showFilters)}
            disabled={isLoading}
          >
            <FunnelIcon width={16} /> Filters
          </button>
          
          <button
            className="btn btn-outline-secondary"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
          >
            <ArrowPathIcon 
              width={16} 
              className={isRefreshing ? 'spin' : ''} 
            /> 
            Refresh
          </button>
          
          <button
            className="btn btn-outline-secondary"
            onClick={() => setShowImportModal(true)}
            disabled={isLoading}
          >
            <ArrowUpTrayIcon width={16} /> Import
          </button>
          
          <button
            className="btn btn-outline-secondary"
            onClick={() => handleExport('csv')}
            disabled={isLoading}
          >
            <ArrowDownTrayIcon width={16} /> Export
          </button>

          <button
            className="btn btn-success"
            onClick={handleAddProductClick}
            disabled={isLoading}
          >
            <PlusIcon width={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="card mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Filters</h5>
              <button
                className="btn btn-link text-danger"
                onClick={handleClearFilters}
                disabled={isLoading}
              >
                Clear All
              </button>
            </div>
            <ProductFilters
              register={register}
              errors={errors}
              watch={watch}
              onClear={handleClearFilters}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {bulkSelection.length > 0 && controller && (
        <BulkActions
          selectionCount={bulkSelection.length}
          productIds={bulkSelection}
          onBulkAction={handleBulkAction}
          onClearSelection={() => controller.clearSelection()}
          isLoading={isLoading}
        />
      )}

      {/* View Mode Toggle */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="btn-group" role="group">
          <button
            className={`btn btn-outline-secondary ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            disabled={isLoading}
          >
            Grid
          </button>
          <button
            className={`btn btn-outline-secondary ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            disabled={isLoading}
          >
            Table
          </button>
        </div>
        
        {/* Sorting Controls */}
        <div className="d-flex gap-2">
          <select
            className="form-select form-select-sm"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
            disabled={isLoading}
          >
            <option value="createdAt">Date Created</option>
            <option value="updatedAt">Last Updated</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="stockQuantity">Stock</option>
          </select>
          
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => {
              const newOrder = filters.sortOrder === 'ASC' ? 'DESC' : 'ASC';
              handleFilterChange({ sortOrder: newOrder });
            }}
            disabled={isLoading}
          >
            {filters.sortOrder === 'ASC' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && products.length > 0 && (
        <div className="position-relative">
          <div className="position-absolute top-0 start-0 end-0 bottom-0 bg-white bg-opacity-75 d-flex justify-content-center align-items-center z-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Updating...</span>
            </div>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="row g-4">
          {products.map((product) => {
            const optimisticState = optimisticUpdates[product.id];
            const thumbnailUrl = getProductThumbnail(product);
            
            return (
              <div
                className="col-sm-6 col-md-4 col-xl-3"
                key={product.id}
                style={{
                  opacity: optimisticState === 'deleting' ? 0.5 : 1,
                  transition: 'opacity 0.3s ease'
                }}
              >
                <div className="card h-100 shadow-sm hover-shadow transition-all">
                  <div className="position-relative">
                    <img
                      src={thumbnailUrl}
                      className="card-img-top"
                      alt={product.name}
                      style={{ height: '200px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400';
                      }}
                    />
                    {optimisticState && (
                      <div className="position-absolute top-0 start-0 end-0 bottom-0 bg-white bg-opacity-75 d-flex justify-content-center align-items-center">
                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                          <span className="visually-hidden">Processing...</span>
                        </div>
                      </div>
                    )}
                    <div className="position-absolute top-2 end-2">
                      <SyncStatusBadge
                        product={product}
                        onSync={() => handleSyncToOdoo(product.id)}
                        isSyncing={optimisticState === 'syncing'}
                      />
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <h6 className="card-title text-truncate" title={product.name}>
                      {product.name}
                    </h6>
                    <p className="text-muted small mb-1">{product.sku}</p>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <strong className="text-primary">
                        USh {product.price?.toFixed(2) || '0.00'}
                      </strong>
                      <span className={`badge ${product.quantity > 0 ? 'bg-success' : 'bg-danger'}`}>
                        {product.quantity || 0} in stock
                      </span>
                    </div>

                    <div className="mt-2 d-flex flex-wrap gap-1">
                      {!product.isActive && <StatusBadge type="inactive" label="Inactive" />}
                      {product.isFeatured && <StatusBadge type="featured" label="Featured" />}
                      {product.isOnSale && <StatusBadge type="sale" label="On Sale" />}
                      {product.odooProductId && (
                        <StatusBadge type="success" label="Synced" />
                      )}
                    </div>
                  </div>

                  <div className="card-footer bg-white d-flex justify-content-between border-top-0">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => navigate(`/admin/products/${product.id}`)}
                      disabled={optimisticState}
                      title="View Details"
                    >
                      <EyeIcon width={14} />
                    </button>
                    
                    <button
                      className="btn btn-sm btn-outline-info"
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowAnalyticsModal(true);
                      }}
                      disabled={optimisticState}
                      title="View Analytics"
                    >
                      <CubeIcon width={14} />
                    </button>
                    
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                      disabled={optimisticState}
                      title="Edit"
                    >
                      <PencilIcon width={14} />
                    </button>
                    
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowDeleteModal(true);
                      }}
                      disabled={optimisticState}
                      title="Delete"
                    >
                      <TrashIcon width={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        //  Table View
        <ProductTable
          products={products}
          onView={(p) => navigate(`/admin/products/${p.id}`)}
          onEdit={(p) => navigate(`/admin/products/${p.id}/edit`)}
          onDelete={(p) => {
            setSelectedProduct(p);
            setShowDeleteModal(true);
          }}
          onSync={handleSyncToOdoo}
          optimisticUpdates={optimisticUpdates}
          getThumbnail={getProductThumbnail}
        />
      )}

      {/* { Pagination  */}
      {pagination.totalPages > 1 && (
        <nav className="mt-4" aria-label="Product pagination">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={isLoading || pagination.currentPage === 1}
              >
                Previous
              </button>
            </li>
            
            {[...Array(pagination.totalPages)].map((_, i) => {
              const page = i + 1;
              const isCurrent = page === pagination.currentPage;
              const isNearCurrent = Math.abs(page - pagination.currentPage) <= 2;
              
              if (isNearCurrent || page === 1 || page === pagination.totalPages) {
                return (
                  <li
                    key={page}
                    className={`page-item ${isCurrent ? 'active' : ''}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(page)}
                      disabled={isLoading || isCurrent}
                    >
                      {page}
                    </button>
                  </li>
                );
              }
              
              // Show ellipsis for far pages
              if (page === 2 || page === pagination.totalPages - 1) {
                return (
                  <li key={page} className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                );
              }
              
              return null;
            })}
            
            <li className={`page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={isLoading || pagination.currentPage === pagination.totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Empty State */}
      {products.length === 0 && !isLoading && (
        <div className="text-center py-5">
          <CubeIcon className="text-muted mb-3" width={64} />
          <h4>No Products Found</h4>
          <p className="text-muted mb-4">
            {Object.values(filters).some(v => v !== null && v !== '' && v !== false && v !== true)
              ? 'Try adjusting your filters'
              : 'Get started by adding your first product'}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/admin/products/new')}
          >
            <PlusIcon width={16} /> Add First Product
          </button>
        </div>
      )}

      {/* Modals */}
      {controller && (
        <>
          <ImportExportModal
            isOpen={showImportModal}
            onClose={() => setShowImportModal(false)}
            onImport={controller.importProducts}
            onExport={handleExport}
            isLoading={isLoading}
          />

          <DeleteConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedProduct(null);
            }}
            onConfirm={() => handleDeleteProduct(selectedProduct)}
            title="Delete Product"
            message={
              <div>
                <p>Are you sure you want to delete "<strong>{selectedProduct?.name}</strong>"?</p>
                <p className="text-muted small">This action cannot be undone.</p>
              </div>
            }
            isLoading={optimisticUpdates[selectedProduct?.id] === 'deleting'}
          />

          <AnalyticsModal
            isOpen={showAnalyticsModal}
            onClose={() => {
              setShowAnalyticsModal(false);
              setSelectedProduct(null);
            }}
            productId={selectedProduct?.id}
            productName={selectedProduct?.name}
            onLoadAnalytics={controller.getProductAnalytics}
          />
        </>
      )}
    </div>
  );
};

//CSS for animations
const styles = `
  .hover-shadow:hover {
    box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
    transform: translateY(-2px);
    transition: all 0.3s ease;
  }
  
  .spin {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .transition-all {
    transition: all 0.3s ease;
  }
`;

//styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}


export default ProductsView;




import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useAdminProductStore from '../../stores/admin/useAdminProductStore';
import AdminProductController from '../../controllers/admin/AdminProductController';
import DeleteConfirmationModal from '../../components/shared/DeleteConfirmationModal';

const ProductDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const productStore = useAdminProductStore();

  const [controller, setController] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const init = async () => {
      const ctrl = new AdminProductController(productStore);
      setController(ctrl);
      await ctrl.loadProductById(id);
    };
    init();
  }, [id]);

  const handleDelete = async () => {
    if (!controller) return;
    await controller.deleteProduct(id);
    navigate(-1);
  };

  if (productStore.isLoading && !productStore.selectedProduct) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  const product = productStore.selectedProduct;
  if (!product) {
    return (
      <div className="text-center py-5">
        <h4>Product not found</h4>
        <Link to="/admin/products" className="btn btn-link">
          <i className="bi bi-arrow-left me-1"></i> Back to Products
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'seo', label: 'SEO' }
  ];

  return (
    <div className="container-fluid py-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left"></i>
          </button>

          <div>
            <h3 className="fw-bold mb-0">{product.name}</h3>
            <small className="text-muted">
              SKU: {product.sku} | ID: {product.id}
            </small>
          </div>
        </div>

        <div className="d-flex gap-2">
          <a
            href={`/product/${product.id}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline-primary"
          >
            <i className="bi bi-eye me-1"></i> View
          </a>

          <Link
            to={`/admin/products/${product.id}/edit`}
            className="btn btn-primary"
          >
            <i className="bi bi-pencil me-1"></i> Edit
          </Link>

          <button
            className="btn btn-danger"
            onClick={() => setShowDeleteModal(true)}
          >
            <i className="bi bi-trash me-1"></i> Delete
          </button>
        </div>
      </div>

      {/* STATUS BADGES */}
      <div className="mb-4 d-flex gap-2 flex-wrap">
        {product.isActive && <span className="badge bg-success">Active</span>}
        {!product.isActive && <span className="badge bg-secondary">Inactive</span>}
        {product.isFeatured && <span className="badge bg-warning">Featured</span>}
        {product.isOnSale && <span className="badge bg-info">On Sale</span>}
        {product.lowStock && <span className="badge bg-warning">Low Stock</span>}
        {product.outOfStock && <span className="badge bg-danger">Out of Stock</span>}
      </div>

      {/* TABS */}
      <ul className="nav nav-tabs mb-4">
        {tabs.map(tab => (
          <li className="nav-item" key={tab.id}>
            <button
              className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="row g-4">

        {/* LEFT COLUMN */}
        <div className="col-lg-8">

          {/* IMAGE */}
          <div className="card mb-4">
            <div className="card-header fw-bold">Product Image</div>
            <div className="card-body text-center">
              <img
                src={product.thumbnail || 'https://via.placeholder.com/400'}
                alt={product.name}
                className="img-fluid rounded"
                style={{ maxHeight: 400 }}
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="card mb-4">
            <div className="card-header fw-bold">Description</div>
            <div className="card-body">
              <p className="mb-0">{product.description}</p>
            </div>
          </div>

          {/* SPECIFICATIONS */}
          {activeTab === 'specifications' && product.specifications && (
            <div className="card">
              <div className="card-header fw-bold">Specifications</div>
              <div className="card-body">
                <div className="row">
                  {Object.entries(product.specifications).map(([k, v]) => (
                    <div className="col-md-6 mb-3" key={k}>
                      <small className="text-muted text-capitalize">
                        {k.replace(/([A-Z])/g, ' $1')}
                      </small>
                      <div className="fw-semibold">{v || 'N/A'}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="col-lg-4">

          {/* QUICK STATS */}
          <div className="card mb-4">
            <div className="card-header fw-bold">Quick Stats</div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span><i className="bi bi-currency-dollar me-1"></i> Price</span>
                <strong>${product.price.toFixed(2)}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span><i className="bi bi-box-seam me-1"></i> Stock</span>
                <strong className={product.quantity > 0 ? 'text-success' : 'text-danger'}>
                  {product.quantity}
                </strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span><i className="bi bi-tags me-1"></i> Category</span>
                <strong>{product.categoryId || 'Uncategorized'}</strong>
              </div>
            </div>
          </div>

          {/* DATES */}
          <div className="card">
            <div className="card-header fw-bold">Dates</div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Created</span>
                <small>{new Date(product.createdAt).toLocaleDateString()}</small>
              </div>
              <div className="d-flex justify-content-between">
                <span>Updated</span>
                <small>{new Date(product.updatedAt).toLocaleDateString()}</small>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* DELETE MODAL */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        itemName={product.name}
      />
    </div>
  );
};

export default ProductDetailView;


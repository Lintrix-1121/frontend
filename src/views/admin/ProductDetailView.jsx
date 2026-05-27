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
// import React, { useEffect, useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import {
//   PencilIcon,
//   TrashIcon,
//   ArrowLeftIcon,
//   EyeIcon,
//   TagIcon,
//   CubeIcon,
//   CurrencyDollarIcon,
//   ChartBarIcon,
//   ClockIcon,
//   CheckCircleIcon,
//   XCircleIcon
// } from '@heroicons/react/24/outline';
// import useAdminProductStore from '../../stores/admin/useAdminProductStore';
// import ProductController from '../../controllers/admin/AdminProductController';
// import StatusBadge from '../../components/shared/StatusBadge';
// import DeleteConfirmationModal from '../../components/shared/DeleteConfirmationModal';

// const ProductDetailView = () => {
//   const { id } = useParams();
//   const productStore = useAdminProductStore();
//   const [controller, setController] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [activeTab, setActiveTab] = useState('overview');

//   useEffect(() => {
//     // Initialize controller
//     const initController = async () => {
//       try {
//         const ctrl = new AdminProductController(productStore);
//         setController(ctrl);
//         await ctrl.loadProductById(id);
//       } catch (error) {
//         console.error('Failed to load product:', error);
//       }
//     };
    
//     initController();
//   }, [id, productStore]);

//   const handleDelete = async () => {
//     if (!controller) return;
    
//     try {
//       await controller.deleteProduct(id);
//       window.history.back();
//     } catch (error) {
//       console.error('Delete failed:', error);
//     }
//   };
// // const ProductDetailView = () => {
// //   const { id } = useParams();
// //   const productStore = useAdminProductStore();
// //   const [controller] = useState(() => new ProductController(productStore));
// //   const [showDeleteModal, setShowDeleteModal] = useState(false);
// //   const [activeTab, setActiveTab] = useState('overview');

// //   useEffect(() => {
// //     controller.loadProductById(id);
// //   }, [id]);

//   // const handleDelete = async () => {
//   //   try {
//   //     await controller.deleteProduct(id);
//   //     window.history.back();
//   //   } catch (error) {
//   //     console.error('Delete failed:', error);
//   //   }
//   // };

//   if (productStore.isLoading && !productStore.selectedProduct) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   const product = productStore.selectedProduct;
//   if (!product) {
//     return (
//       <div className="text-center py-12">
//         <h3 className="text-lg font-medium text-gray-900">Product not found</h3>
//         <Link to="/admin/products" className="mt-4 inline-flex items-center text-blue-600">
//           <ArrowLeftIcon className="h-4 w-4 mr-1" />
//           Back to Products
//         </Link>
//       </div>
//     );
//   }

//   const tabs = [
//     { id: 'overview', name: 'Overview' },
//     { id: 'analytics', name: 'Analytics' },
//     { id: 'specifications', name: 'Specifications' },
//     { id: 'seo', name: 'SEO' }
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <Link
//             to="/admin/products"
//             className="p-2 rounded-lg hover:bg-gray-100"
//           >
//             <ArrowLeftIcon className="h-5 w-5" />
//           </Link>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
//             <p className="text-gray-600">SKU: {product.sku} | ID: {product.id}</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-3">
//           <a
//             href={`/product/${product.id}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//           >
//             <EyeIcon className="h-4 w-4" />
//             View Live
//           </a>
//           <Link
//             to={`/admin/products/${product.id}/edit`}
//             className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             <PencilIcon className="h-4 w-4" />
//             Edit
//           </Link>
//           <button
//             onClick={() => setShowDeleteModal(true)}
//             className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//           >
//             <TrashIcon className="h-4 w-4" />
//             Delete
//           </button>
//         </div>
//       </div>

//       {/* Status badges */}
//       <div className="flex flex-wrap gap-2">
//         <StatusBadge type={product.isActive ? 'active' : 'inactive'} label={product.isActive ? 'Active' : 'Inactive'} />
//         {product.isFeatured && <StatusBadge type="featured" label="Featured" />}
//         {product.isOnSale && <StatusBadge type="sale" label="On Sale" />}
//         {product.lowStock && <StatusBadge type="warning" label="Low Stock" />}
//         {product.outOfStock && <StatusBadge type="danger" label="Out of Stock" />}
//       </div>

//       {/* Tabs */}
//       <div className="border-b border-gray-200">
//         <nav className="-mb-px flex space-x-8">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === tab.id
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               {tab.name}
//             </button>
//           ))}
//         </nav>
//       </div>

//       {/* Main content */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left column - Product info */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Product image */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">Product Image</h3>
//             <div className="aspect-square max-w-md mx-auto bg-gray-100 rounded-lg overflow-hidden">
//               <img
//                 src={product.thumbnail || 'https://via.placeholder.com/400'}
//                 alt={product.name}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </div>

//           {/* Description */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
//             <div className="prose max-w-none">
//               <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
//             </div>
//           </div>

//           {/* Specifications */}
//           {activeTab === 'specifications' && product.specifications && (
//             <div className="bg-white rounded-lg shadow p-6">
//               <h3 className="text-lg font-medium text-gray-900 mb-4">Specifications</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {Object.entries(product.specifications).map(([key, value]) => (
//                   <div key={key} className="border-b pb-2">
//                     <div className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
//                     <div className="font-medium">{value || 'Not specified'}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Right column - Sidebar */}
//         <div className="space-y-6">
//           {/* Quick stats */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
//                   <span className="text-gray-600">Price</span>
//                 </div>
//                 <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <CubeIcon className="h-5 w-5 text-gray-400" />
//                   <span className="text-gray-600">Stock</span>
//                 </div>
//                 <span className={`font-bold ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
//                   {product.quantity} units
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <TagIcon className="h-5 w-5 text-gray-400" />
//                   <span className="text-gray-600">Category</span>
//                 </div>
//                 <span className="font-medium">{product.categoryId || 'Uncategorized'}</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <ChartBarIcon className="h-5 w-5 text-gray-400" />
//                   <span className="text-gray-600">Margin</span>
//                 </div>
//                 <span className="font-bold text-green-600">
//                   {product.getProfitMargin() ? `${product.getProfitMargin()}%` : 'N/A'}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Inventory info */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory</h3>
//             <div className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-600">Current Stock</span>
//                 <span className="font-medium">{product.quantity}</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-600">Low Stock Threshold</span>
//                 <span className="font-medium">10 units</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-600">Inventory Value</span>
//                 <span className="font-medium">${product.getInventoryValue().toFixed(2)}</span>
//               </div>
//             </div>
//           </div>

//           {/* Dates */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">Dates</h3>
//             <div className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <ClockIcon className="h-4 w-4 text-gray-400" />
//                   <span className="text-gray-600">Created</span>
//                 </div>
//                 <span className="text-sm">
//                   {new Date(product.createdAt).toLocaleDateString()}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <ClockIcon className="h-4 w-4 text-gray-400" />
//                   <span className="text-gray-600">Last Updated</span>
//                 </div>
//                 <span className="text-sm">
//                   {new Date(product.updatedAt).toLocaleDateString()}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Delete Confirmation Modal */}
//       <DeleteConfirmationModal
//         isOpen={showDeleteModal}
//         onClose={() => setShowDeleteModal(false)}
//         onConfirm={handleDelete}
//         title="Delete Product"
//         message={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
//       />
//     </div>
//   );
// };

// export default ProductDetailView;
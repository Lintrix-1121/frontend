import React from 'react';
import { Checkbox } from '@headlessui/react';
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import StatusBadge from './StatusBadge';

const ProductTable = ({
  products = [],
  bulkSelection = [],
  onSelectProduct,
  onSelectAll,
  onEdit,
  onDelete,
  onView,
  onSyncToOdoo,
  isLoading = false,
  pagination = null,
  onPageChange
}) => {
  const allSelected =
    products.length > 0 && bulkSelection.length === products.length;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX'
    }).format(amount || 0);

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      : 'N/A';

  /* ================= Loading ================= */
  if (isLoading) {
    return (
      <div className="card p-5 text-center">
        <div className="spinner-border text-primary mx-auto" />
        <p className="mt-3 text-muted">Loading products...</p>
      </div>
    );
  }

  /* ================= Empty ================= */
  if (!products.length) {
    return (
      <div className="card p-5 text-center text-muted">
        No products found
      </div>
    );
  }

  return (
    <div className="card">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>
                <Checkbox checked={allSelected} onChange={onSelectAll} />
              </th>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <Checkbox
                    checked={bulkSelection.includes(product.id)}
                    onChange={() => onSelectProduct?.(product.id)}
                  />
                </td>

                <td>
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={
                        product.imageUrl ||
                        product.images?.[0] ||
                        'https://via.placeholder.com/40'
                      }
                      alt={product.name}
                      className="rounded"
                      width={40}
                      height={40}
                    />
                    <div>
                      <div className="fw-semibold">{product.name}</div>
                      <small className="text-muted">
                        SKU: {product.sku || 'N/A'}
                      </small>
                      {product.odooProductId && (
                        <div className="text-success small">
                          Odoo ID: {product.odooProductId}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                <td>{product.category?.name || product.category || '—'}</td>

                <td>
                  <div>{formatCurrency(product.price)}</div>
                  {product.salePrice &&
                    product.salePrice < product.price && (
                      <small className="text-danger">
                        Sale: {formatCurrency(product.salePrice)}
                      </small>
                    )}
                </td>

                <td>
                  <div>{product.quantity?.toLocaleString() || 0}</div>
                  <small
                    className={
                      product.quantity > 0
                        ? 'text-success'
                        : 'text-danger'
                    }
                  >
                    {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                  </small>
                </td>

                <td>
                  <StatusBadge
                    status={product.isActive ? 'active' : 'inactive'}
                    size="sm"
                  />
                  {product.isFeatured && (
                    <span className="badge bg-purple ms-2">Featured</span>
                  )}
                </td>

                <td className="text-muted">
                  {formatDate(product.updatedAt || product.createdAt)}
                </td>

                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onView?.(product)}
                    >
                      <EyeIcon width={16} />
                    </button>

                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={() => onEdit?.(product)}
                    >
                      <PencilIcon width={16} />
                    </button>

                    {onSyncToOdoo && !product.odooProductId && (
                      <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => onSyncToOdoo(product.id)}
                      >
                        <ArrowPathIcon width={16} />
                      </button>
                    )}

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete?.(product)}
                    >
                      <TrashIcon width={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= Pagination ================= */}
      {pagination && pagination.totalPages > 1 && (
        <div className="card-footer d-flex justify-content-between align-items-center">
          <small className="text-muted">
            Showing {(pagination.currentPage - 1) * pagination.pageSize + 1}–
            {Math.min(
              pagination.currentPage * pagination.pageSize,
              pagination.totalItems
            )}{' '}
            of {pagination.totalItems}
          </small>

          <nav>
            <ul className="pagination mb-0">
              {[...Array(pagination.totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <li
                    key={page}
                    className={`page-item ${
                      page === pagination.currentPage ? 'active' : ''
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => onPageChange?.(page)}
                    >
                      {page}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ProductTable;

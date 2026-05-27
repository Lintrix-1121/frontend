import React from 'react';

const BulkActions = ({ 
  selectedCount, 
  onDelete, 
  onBulkUpdate, 
  onClearSelection,
  isLoading = false 
}) => {
  if (selectedCount === 0) return null;

  const statusOptions = [
    { value: 'active', label: 'Set as Active' },
    { value: 'inactive', label: 'Set as Inactive' },
    { value: 'featured', label: 'Set as Featured' },
    { value: 'not_featured', label: 'Remove Featured' },
    { value: 'on_sale', label: 'Set On Sale' },
    { value: 'not_on_sale', label: 'Remove From Sale' }
  ];

  const handleStatusChange = (e) => {
    const value = e.target.value;
    if (!value || !onBulkUpdate) return;

    let updates = {};
    switch (value) {
      case 'active':
        updates = { isActive: true };
        break;
      case 'inactive':
        updates = { isActive: false };
        break;
      case 'featured':
        updates = { isFeatured: true };
        break;
      case 'not_featured':
        updates = { isFeatured: false };
        break;
      case 'on_sale':
        updates = { isOnSale: true };
        break;
      case 'not_on_sale':
        updates = { isOnSale: false };
        break;
    }

    onBulkUpdate(updates);
    e.target.value = ''; // Reset select
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-blue-700 font-medium">
            {selectedCount} {selectedCount === 1 ? 'product' : 'products'} selected
          </span>
          <button
            onClick={onClearSelection}
            className="text-sm text-blue-600 hover:text-blue-800"
            disabled={isLoading}
          >
            Clear selection
          </button>
        </div>
        <div className="flex items-center gap-2">
          <select
            onChange={handleStatusChange}
            className="rounded-md border-gray-300 text-sm py-1.5 focus:ring-blue-500 focus:border-blue-500"
            defaultValue=""
            disabled={isLoading}
          >
            <option value="" disabled>Update Status</option>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={onDelete}
            disabled={isLoading}
            className="px-4 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Deleting...' : 'Delete Selected'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;


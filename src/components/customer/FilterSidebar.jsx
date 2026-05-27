// src/components/customer/FilterSidebar.jsx
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'react-bootstrap-icons';

const FilterSidebar = ({
  categories,
  selectedCategory,
  priceRange,
  filters = {}, // Add default value
  onCategorySelect,
  onPriceRangeChange,
  onFilterChange,
  onClearFilters
}) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [localPriceRange, setLocalPriceRange] = useState(priceRange || [0, 1000000]);

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const renderCategoryTree = (category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories[category.id];
    const isSelected = selectedCategory?.id === category.id;

    return (
      <div key={category.id} className="mb-1">
        <div
          className="d-flex align-items-center justify-content-between py-2 px-3"
          style={{
            background: isSelected ? 'rgba(40, 167, 69, 0.1)' : 'transparent',
            borderLeft: isSelected ? '3px solid #28a745' : '3px solid transparent',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onClick={() => onCategorySelect(category)}
          onMouseEnter={(e) => {
            if (!isSelected) {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.02)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          <div className="d-flex align-items-center gap-2" style={{ marginLeft: `${level * 16}px` }}>
            {hasChildren && (
              <button
                className="btn btn-link p-0 text-decoration-none"
                style={{ color: '#6c757d', minWidth: '20px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCategory(category.id);
                }}
              >
                {isExpanded ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </button>
            )}
            <span className="small" style={{ 
              color: isSelected ? '#28a745' : '#495057',
              fontWeight: isSelected ? '500' : 'normal'
            }}>
              {category.name}
            </span>
            {category.productCount > 0 && (
              <span className="small text-muted">({category.productCount})</span>
            )}
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {category.children.map(child => renderCategoryTree(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const handlePriceChange = (type, value) => {
    const newRange = [...localPriceRange];
    if (type === 'min') {
      newRange[0] = parseInt(value) || 0;
    } else {
      newRange[1] = parseInt(value) || 1000000;
    }
    setLocalPriceRange(newRange);
  };

  const applyPriceFilter = () => {
    onPriceRangeChange(localPriceRange[0], localPriceRange[1]);
  };

  // Fixed activeFilterCount calculation
  const activeFilterCount = [
    selectedCategory ? 1 : 0,
    filters.inStock ? 1 : 0,
    filters.isOnSale ? 1 : 0
  ].reduce((total, value) => total + value, 0);

  return (
    <div className="vstack gap-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between pb-3 border-bottom" 
        style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}>
        <h6 className="fw-bold mb-0">Filters</h6>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearFilters}
            className="btn btn-link btn-sm text-decoration-none p-0"
            style={{ color: '#dc3545' }}
          >
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h6 className="fw-semibold mb-3 text-dark">Categories</h6>
        <div className="vstack gap-1" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {/* All Categories */}
          <div
            className="py-2 px-3"
            style={{
              background: !selectedCategory ? 'rgba(40, 167, 69, 0.1)' : 'transparent',
              borderLeft: !selectedCategory ? '3px solid #28a745' : '3px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => onCategorySelect(null)}
            onMouseEnter={(e) => {
              if (selectedCategory) {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.02)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCategory) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <span className="small" style={{ 
              color: !selectedCategory ? '#28a745' : '#495057',
              fontWeight: !selectedCategory ? '500' : 'normal'
            }}>
              All Categories
            </span>
          </div>
          
          {/* Category Tree */}
          {categories && categories.map(category => renderCategoryTree(category))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h6 className="fw-semibold mb-3 text-dark">Price Range</h6>
        <div className="vstack gap-3">
          <div className="d-flex gap-2">
            <div className="grow">
              <label className="small text-muted mb-1">Min (UGX)</label>
              <input
                type="number"
                className="form-control form-control-sm"
                value={localPriceRange[0]}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                min="0"
                style={{
                  borderRadius: 0,
                  border: '1px solid rgba(0, 0, 0, 0.2)',
                  background: 'rgba(255, 255, 255, 0.7)'
                }}
              />
            </div>
            <div className="grow">
              <label className="small text-muted mb-1">Max (UGX)</label>
              <input
                type="number"
                className="form-control form-control-sm"
                value={localPriceRange[1]}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                min="0"
                style={{
                  borderRadius: 0,
                  border: '1px solid rgba(0, 0, 0, 0.2)',
                  background: 'rgba(255, 255, 255, 0.7)'
                }}
              />
            </div>
          </div>
          <button
            onClick={applyPriceFilter}
            className="btn btn-sm"
            style={{
              background: 'rgba(40, 167, 69, 0.1)',
              color: '#28a745',
              border: '1px solid rgba(40, 167, 69, 0.2)',
              borderRadius: 0,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#28a745';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(40, 167, 69, 0.1)';
              e.target.style.color = '#28a745';
            }}
          >
            Apply Price Filter
          </button>
        </div>
      </div>

      {/* Availability Filter */}
      <div>
        <h6 className="fw-semibold mb-3 text-dark">Availability</h6>
        <label className="d-flex align-items-center gap-3" style={{ cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={filters.inStock || false}
            onChange={(e) => onFilterChange('inStock', e.target.checked)}
            className="form-check-input m-0"
            style={{
              borderRadius: 0,
              border: '1px solid rgba(0, 0, 0, 0.2)',
              cursor: 'pointer'
            }}
          />
          <span className="small text-secondary">In Stock Only</span>
        </label>
      </div>

      {/* Special Offers Filter */}
      <div>
        <h6 className="fw-semibold mb-3 text-dark">Special Offers</h6>
        <label className="d-flex align-items-center gap-3" style={{ cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={filters.isOnSale || false}
            onChange={(e) => onFilterChange('isOnSale', e.target.checked)}
            className="form-check-input m-0"
            style={{
              borderRadius: 0,
              border: '1px solid rgba(0, 0, 0, 0.2)',
              cursor: 'pointer'
            }}
          />
          <span className="small text-secondary">On Sale</span>
        </label>
      </div>

      {/* Active Filters Summary */}
      {activeFilterCount > 0 && (
        <div className="mt-3 pt-3 border-top" style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}>
          <h6 className="fw-semibold mb-2 text-dark small">Active Filters</h6>
          <div className="d-flex flex-wrap gap-2">
            {selectedCategory && (
              <span 
                className="badge d-inline-flex align-items-center gap-1"
                style={{
                  background: 'rgba(40, 167, 69, 0.1)',
                  color: '#28a745',
                  padding: '0.5rem',
                  fontWeight: 'normal'
                }}
              >
                {selectedCategory.name}
                <button
                  className="btn btn-link p-0 text-decoration-none ms-1"
                  style={{ color: '#28a745', fontSize: '1rem', lineHeight: 1 }}
                  onClick={() => onCategorySelect(null)}
                >
                  ×
                </button>
              </span>
            )}
            {filters.inStock && (
              <span 
                className="badge d-inline-flex align-items-center gap-1"
                style={{
                  background: 'rgba(40, 167, 69, 0.1)',
                  color: '#28a745',
                  padding: '0.5rem',
                  fontWeight: 'normal'
                }}
              >
                In Stock
                <button
                  className="btn btn-link p-0 text-decoration-none ms-1"
                  style={{ color: '#28a745', fontSize: '1rem', lineHeight: 1 }}
                  onClick={() => onFilterChange('inStock', false)}
                >
                  ×
                </button>
              </span>
            )}
            {filters.isOnSale && (
              <span 
                className="badge d-inline-flex align-items-center gap-1"
                style={{
                  background: 'rgba(40, 167, 69, 0.1)',
                  color: '#28a745',
                  padding: '0.5rem',
                  fontWeight: 'normal'
                }}
              >
                On Sale
                <button
                  className="btn btn-link p-0 text-decoration-none ms-1"
                  style={{ color: '#28a745', fontSize: '1rem', lineHeight: 1 }}
                  onClick={() => onFilterChange('isOnSale', false)}
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;// import React, { useState } from 'react';
// import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// const FilterSidebar = ({
//   categories,
//   selectedCategory,
//   priceRange,
//   filters,
//   onCategorySelect,
//   onPriceRangeChange,
//   onFilterChange,
//   onClearFilters
// }) => {
//   const [expandedCategories, setExpandedCategories] = useState({});
//   const [localPriceRange, setLocalPriceRange] = useState(priceRange);

//   const toggleCategory = (categoryId) => {
//     setExpandedCategories(prev => ({
//       ...prev,
//       [categoryId]: !prev[categoryId]
//     }));
//   };

//   const renderCategoryTree = (category, level = 0) => {
//     const hasChildren = category.children && category.children.length > 0;
//     const isExpanded = expandedCategories[category.id];

//     return (
//       <div key={category.id} className="mb-1">
//         <div
//           className={`flex items-center justify-between py-1 px-2 rounded hover:bg-gray-100 cursor-pointer ${
//             selectedCategory?.id === category.id ? 'bg-blue-50 text-blue-600' : ''
//           }`}
//           onClick={() => onCategorySelect(category)}
//         >
//           <div className="flex items-center gap-2">
//             {hasChildren && (
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   toggleCategory(category.id);
//                 }}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 {isExpanded ? (
//                   <ChevronDownIcon className="h-4 w-4" />
//                 ) : (
//                   <ChevronRightIcon className="h-4 w-4" />
//                 )}
//               </button>
//             )}
//             <span className="text-sm">{category.name}</span>
//             {category.productCount > 0 && (
//               <span className="text-xs text-gray-500">({category.productCount})</span>
//             )}
//           </div>
//         </div>
        
//         {hasChildren && isExpanded && (
//           <div className="ml-6 mt-1">
//             {category.children.map(child => renderCategoryTree(child, level + 1))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   const handlePriceChange = (type, value) => {
//     const newRange = [...localPriceRange];
//     if (type === 'min') {
//       newRange[0] = parseInt(value) || 0;
//     } else {
//       newRange[1] = parseInt(value) || 1000;
//     }
//     setLocalPriceRange(newRange);
//   };

//   const applyPriceFilter = () => {
//     onPriceRangeChange(localPriceRange[0], localPriceRange[1]);
//   };

//   return (
//     //<div className="space-y-6">
//     <div className="space-y-6 min-w-0">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
//         <button
//           onClick={onClearFilters}
//           className="text-sm bg-success text-white hover:text-blue-800"
//         >
//           Clear all
//         </button>
//       </div>

//       {/* Categories */}
//       <div>
//         <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
//         <div className="space-y-1 max-h-96 overflow-y-auto">
//           {/* All Categories */}
//           <div
//             className={`py-2 px-3 rounded cursor-pointer ${!selectedCategory ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-100'}`}
//             onClick={() => onCategorySelect(null)}
//           >
//             <span className="text-sm">All Categories</span>
//           </div>
          
//           {/* Category Tree */}
//           {categories.map(category => renderCategoryTree(category))}
//         </div>
//       </div>

//       {/* Price Range */}
//       <div>
//         <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
//         <div className="space-y-3">
//           <div className="flex items-center gap-3">
//             <div className="flex-1">
//               <label className="block text-xs text-gray-500 mb-1">Min</label>
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Ugx </span>
//                 <input
//                   type="number"
//                   value={localPriceRange[0]}
//                   onChange={(e) => handlePriceChange('min', e.target.value)}
//                   className="w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   min="0"
//                 />
//               </div>
//             </div>
//             <div className="flex-1">
//               <label className="block text-xs text-gray-500 mb-1">Max</label>
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">Ugx </span>
//                 <input
//                   type="number"
//                   value={localPriceRange[1]}
//                   onChange={(e) => handlePriceChange('max', e.target.value)}
//                   className="w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   min="0"
//                 />
//               </div>
//             </div>
//           </div>
//           <button
//             onClick={applyPriceFilter}
//             className="w-full py-2 bg-success text-white  rounded-lg hover:bg-blue-700"
//           >
//             Apply Price Filter
//           </button>
//         </div>
//       </div>

//       {/* In Stock Filter */}
//       <div>
//         <h3 className="font-medium text-gray-900 mb-3">Availability</h3>
//         <div className="space-y-2">
//           <label className="flex items-center gap-3 cursor-pointer">
//             <input
//               type="checkbox"
//               checked={filters.inStock}
//               onChange={(e) => onFilterChange('inStock', e.target.checked)}
//               className="h-4 w-4 text-blue-600 rounded"
//             />
//             <span className="text-sm">In Stock Only</span>
//           </label>
//         </div>
//       </div>

//       {/* On Sale Filter */}
//       <div>
//         <h3 className="font-medium text-gray-900 mb-3">Special Offers</h3>
//         <div className="space-y-2">
//           <label className="flex items-center gap-3 cursor-pointer">
//             <input
//               type="checkbox"
//               checked={filters.isOnSale}
//               onChange={(e) => onFilterChange('isOnSale', e.target.checked)}
//               className="h-4 w-4 text-blue-600 rounded"
//             />
//             <span className="text-sm">On Sale</span>
//           </label>
//         </div>
//       </div>

//       {/* Brand Filter (if brands available) */}
//       {/* Add brand filter logic here */}
//     </div>
//   );
// };

// export default FilterSidebar;
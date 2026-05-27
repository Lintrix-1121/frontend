import React, { useState } from 'react';
import { PROJECT_CATEGORIES } from '../../services/shared/projectApi.config';
import projectController from '../../controllers/shared/projectController';

const ProjectFilters = ({ filters, onFilterChange }) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const statusOptions = projectController.getStatusOptions();
  const priorityOptions = projectController.getPriorityOptions();

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onFilterChange({ ...filters, search: searchInput });
  };

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    onFilterChange({
      category: null,
      status: null,
      priority: null,
      search: null,
      featured: null
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-4">
        <div className="flex">
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Search projects..."
            className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>
      </form>

      {/* Filter Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 mb-4"
      >
        <svg className={`w-4 h-4 transform ${showAdvanced ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span>Advanced Filters</span>
      </button>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="space-y-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value || null)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {PROJECT_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value || null)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={filters.priority || ''}
              onChange={(e) => handleFilterChange('priority', e.target.value || null)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Priorities</option>
              {priorityOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Filter */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={filters.featured || false}
              onChange={(e) => handleFilterChange('featured', e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
              Featured Projects Only
            </label>
          </div>

          {/* Clear Filters */}
          <button
            onClick={handleClearFilters}
            className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectFilters;
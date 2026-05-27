import React from 'react';

const StatusBadge = ({ status, type, size = 'md', label: customLabel }) => {
  // Use type if provided, otherwise use status
  const statusValue = type || status;
  
  const getStatusConfig = (status) => {
    // Handle undefined or null status
    if (!status) {
      return {
        color: 'gray',
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        label: 'Unknown'
      };
    }

    const configs = {
      active: { color: 'green', bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
      inactive: { color: 'gray', bg: 'bg-gray-100', text: 'text-gray-800', label: 'Inactive' },
      pending: { color: 'yellow', bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      processing: { color: 'blue', bg: 'bg-blue-100', text: 'text-blue-800', label: 'Processing' },
      shipped: { color: 'purple', bg: 'bg-purple-100', text: 'text-purple-800', label: 'Shipped' },
      delivered: { color: 'green', bg: 'bg-green-100', text: 'text-green-800', label: 'Delivered' },
      cancelled: { color: 'red', bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
      low: { color: 'orange', bg: 'bg-orange-100', text: 'text-orange-800', label: 'Low' },
      critical: { color: 'red', bg: 'bg-red-100', text: 'text-red-800', label: 'Critical' },
      warning: { color: 'yellow', bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Warning' },
      'out of stock': { color: 'red', bg: 'bg-red-100', text: 'text-red-800', label: 'Out of Stock' },
      featured: { color: 'purple', bg: 'bg-purple-100', text: 'text-purple-800', label: 'Featured' },
      sale: { color: 'orange', bg: 'bg-orange-100', text: 'text-orange-800', label: 'On Sale' },
      success: { color: 'green', bg: 'bg-green-100', text: 'text-green-800', label: 'Success' },
      default: { color: 'gray', bg: 'bg-gray-100', text: 'text-gray-800', label: String(status) }
    };

    // Safely convert to lowercase
    const statusKey = String(status).toLowerCase();
    const config = configs[statusKey] || configs.default;
    
    // Override label if customLabel is provided
    if (customLabel) {
      return { ...config, label: customLabel };
    }
    
    return config;
  };

  const config = getStatusConfig(statusValue);
  
  // Guard against undefined config
  if (!config) {
    console.error('No config found for status:', statusValue);
    return null; // or return a fallback badge
  }
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  // Define color mapping for inline styles
  const colorMap = {
    green: '#10b981',
    red: '#ef4444',
    blue: '#3b82f6',
    yellow: '#f59e0b',
    orange: '#f97316',
    purple: '#8b5cf6',
    gray: '#6b7280'
  };

  const dotColor = colorMap[config.color] || '#6b7280';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${config.bg} ${config.text} ${sizeClasses[size]}`}>
      <span 
        className="h-2 w-2 rounded-full mr-2"
        style={{ backgroundColor: dotColor }}
      ></span>
      {config.label}
    </span>
  );
};

export default StatusBadge;


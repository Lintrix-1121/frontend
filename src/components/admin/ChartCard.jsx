import React from 'react';

const ChartCard = ({ title, description, icon: Icon, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          {Icon && (
            <div className="p-2 bg-blue-50 rounded-lg">
              <Icon className="h-5 w-5 text-blue-600" />
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </div>
      <div className="relative">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
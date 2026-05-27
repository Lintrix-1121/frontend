import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => {
  const colorClasses = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', trend: 'text-blue-600' },
    green: { bg: 'bg-green-50', icon: 'text-green-600', trend: 'text-green-600' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', trend: 'text-purple-600' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-600', trend: 'text-orange-600' },
    red: { bg: 'bg-red-50', icon: 'text-red-600', trend: 'text-red-600' }
  };

  const currentColor = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${currentColor.bg}`}>
          <Icon className={`h-6 w-6 ${currentColor.icon}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 ${currentColor.trend}`}>
            {trend.isPositive ? (
              <ArrowUpIcon className="h-4 w-4" />
            ) : (
              <ArrowDownIcon className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">
              {trend.value}%
            </span>
          </div>
        )}
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;

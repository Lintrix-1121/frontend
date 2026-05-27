import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

const Breadcrumb = ({ items }) => {
  return (
    <nav className="d-flex mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="text-gray-400 hover:text-gray-500">
            <HomeIcon className="h-5 w-5" />
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.name}>
            <div className="flex items-center">
              <ChevronRightIcon className="h-4 w-4 text-gray-400" />
              {index === items.length - 1 ? (
                <span className="ml-2 text-sm font-medium text-gray-500">
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  {item.name}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
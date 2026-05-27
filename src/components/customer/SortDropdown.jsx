// src/components/customer/SortDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'react-bootstrap-icons';

const sortOptions = [
  { name: 'Newest', value: 'createdAt', order: 'DESC' },
  { name: 'Price: Low to High', value: 'price', order: 'ASC' },
  { name: 'Price: High to Low', value: 'price', order: 'DESC' },
  { name: 'Name: A to Z', value: 'name', order: 'ASC' },
  { name: 'Name: Z to A', value: 'name', order: 'DESC' },
  { name: 'Featured', value: 'isFeatured', order: 'DESC' },
];

const SortDropdown = ({ currentSort, currentOrder, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentOption = sortOptions.find(
    opt => opt.value === currentSort && opt.order === currentOrder
  ) || sortOptions[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="position-relative" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        className="d-inline-flex align-items-center gap-2 px-4 py-2"
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          color: '#495057',
          fontSize: '0.875rem',
          fontWeight: '500',
          transition: 'all 0.2s ease'
        }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
          e.currentTarget.style.borderColor = 'rgba(40, 167, 69, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
          e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.1)';
        }}
      >
        <span>Sort by: <span className="fw-semibold" style={{ color: '#28a745' }}>{currentOption.name}</span></span>
        <ChevronDown 
          size={16} 
          style={{ 
            transition: 'transform 0.2s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)'
          }} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="position-absolute start-0 mt-2"
          style={{ 
            zIndex: 1050,
            minWidth: '220px'
          }}
        >
          <div 
            className="py-2"
            style={{
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)'
            }}
          >
            {sortOptions.map((option) => {
              const isSelected = currentSort === option.value && currentOrder === option.order;
              
              return (
                <button
                  key={`${option.value}-${option.order}`}
                  className="d-block w-100 text-start px-4 py-2"
                  style={{
                    background: isSelected ? 'rgba(40, 167, 69, 0.1)' : 'transparent',
                    color: isSelected ? '#28a745' : '#495057',
                    border: 'none',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => {
                    onChange(option.value, option.order);
                    setIsOpen(false);
                  }}
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
                  <div className="d-flex align-items-center justify-content-between">
                    <span>{option.name}</span>
                    {isSelected && (
                      <i className="bi bi-check-lg" style={{ color: '#28a745' }}></i>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;


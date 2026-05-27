// components/shared/Pagination.jsx
import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 2 && i <= currentPage + 2)
    ) {
      pages.push(i);
    } else if (i === currentPage - 3 || i === currentPage + 3) {
      pages.push('...');
    }
  }

  // Remove duplicates
  const uniquePages = [...new Set(pages)];

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </button>
        </li>
        
        {uniquePages.map((page, index) => (
          <li
            key={index}
            className={`page-item ${page === currentPage ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}
          >
            <button
              className="page-link"
              onClick={() => page !== '...' && onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}
        
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
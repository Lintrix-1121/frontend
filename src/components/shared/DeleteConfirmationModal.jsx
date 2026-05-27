import React from 'react';

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName = "",
  isBulk = false,
  itemCount = 0,
  isLoading = false
}) => {
  if (!isOpen) return null;

  const displayMessage = isBulk
    ? `Are you sure you want to delete ${itemCount} selected products? This action cannot be undone. All product data including images, variants, and inventory will be permanently removed.`
    : itemName
      ? `Are you sure you want to delete "${itemName}"? This action cannot be undone. All product data including images, variants, and inventory will be permanently removed.`
      : message;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1040 }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{ zIndex: 1050 }}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow">

            {/* Header */}
            <div className="modal-header bg-light">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-10"
                  style={{ width: 48, height: 48 }}
                >
                  <i className="bi bi-exclamation-triangle text-danger fs-4"></i>
                </div>
                <h5 className="modal-title fw-bold mb-0">{title}</h5>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                disabled={isLoading}
              />
            </div>

            {/* Body */}
            <div className="modal-body">
              <p className="text-muted mb-3">{displayMessage}</p>

              {isBulk && (
                <div className="alert alert-danger d-flex align-items-start gap-2">
                  <i className="bi bi-exclamation-circle mt-1"></i>
                  <div>
                    <strong>Warning:</strong> This action affects multiple products and cannot be reversed.
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer bg-light">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-danger"
                onClick={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmationModal;
// import React from 'react';
// import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// const DeleteConfirmationModal = ({ 
//   isOpen, 
//   onClose, 
//   onConfirm, 
//   title = "Confirm Deletion",
//   message = "Are you sure you want to delete this item? This action cannot be undone.",
//   itemName = "",
//   isBulk = false,
//   itemCount = 0,
//   isLoading = false
// }) => {
//   if (!isOpen) return null;

//   const displayMessage = isBulk 
//     ? `Are you sure you want to delete ${itemCount} selected products? This action cannot be undone. All product data including images, variants, and inventory will be permanently removed.`
//     : itemName 
//       ? `Are you sure you want to delete "${itemName}"? This action cannot be undone. All product data including images, variants, and inventory will be permanently removed.`
//       : message;

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
//         <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        
//         <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//           <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//             <div className="sm:flex sm:items-start">
//               <div className="mx-auto shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
//                 <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
//               </div>
//               <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
//                 <h3 className="text-lg leading-6 font-medium text-gray-900">
//                   {title}
//                 </h3>
//                 <div className="mt-2">
//                   <p className="text-sm text-gray-500">
//                     {displayMessage}
//                   </p>
//                   {isBulk && (
//                     <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-md">
//                       <p className="text-sm text-red-700">
//                         ⚠️ Warning: This action affects multiple products and cannot be reversed.
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//             <button
//               type="button"
//               onClick={onConfirm}
//               disabled={isLoading}
//               className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
//             >
//               {isLoading ? 'Deleting...' : 'Delete'}
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={isLoading}
//               className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DeleteConfirmationModal;
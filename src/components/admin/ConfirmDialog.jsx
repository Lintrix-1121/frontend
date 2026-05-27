// components/shared/ConfirmDialog.jsx
import React from 'react';

const ConfirmDialog = ({ 
  show, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  variant = 'primary',
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) => {
  if (!show) return null;

  return (
    <>
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button 
                type="button" 
                className="btn-close"
                onClick={onCancel}
              />
            </div>
            <div className="modal-body">
              <p>{message}</p>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={onCancel}
              >
                {cancelText}
              </button>
              <button 
                type="button" 
                className={`btn btn-${variant}`}
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" />
    </>
  );
};

export default ConfirmDialog;
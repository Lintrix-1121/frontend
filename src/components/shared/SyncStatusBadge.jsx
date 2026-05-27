import React, { useState } from 'react';
import { ArrowPathIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const SyncStatusBadge = ({ product, onSync, isSyncing }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getSyncStatus = () => {
    if (!product.odooProductId) {
      return {
        label: 'Not Synced',
        color: 'secondary',
        icon: <ExclamationTriangleIcon width={12} />
      };
    }

    if (product.lastSyncedAt) {
      const lastSync = new Date(product.lastSyncedAt);
      const now = new Date();
      const diffHours = (now - lastSync) / (1000 * 60 * 60);

      if (diffHours < 24) {
        return {
          label: 'Synced',
          color: 'success',
          icon: <CheckCircleIcon width={12} />
        };
      } else {
        return {
          label: 'Sync Old',
          color: 'warning',
          icon: <ArrowPathIcon width={12} />
        };
      }
    }

    return {
      label: 'Synced',
      color: 'success',
      icon: <CheckCircleIcon width={12} />
    };
  };

  const status = getSyncStatus();

  const handleSyncClick = () => {
    if (onSync && !isSyncing) {
      onSync();
    }
  };

  return (
    <div 
      className="position-relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        className={`btn btn-sm btn-${status.color} d-flex align-items-center gap-1`}
        onClick={handleSyncClick}
        disabled={isSyncing}
        title={`Sync with Odoo${product.lastSyncedAt ? `\nLast sync: ${new Date(product.lastSyncedAt).toLocaleString()}` : ''}`}
      >
        {isSyncing ? (
          <>
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">Syncing...</span>
            </div>
            <span>Syncing...</span>
          </>
        ) : (
          <>
            {status.icon}
            <span>{status.label}</span>
          </>
        )}
      </button>

      {showTooltip && (
        <div 
          className="position-absolute top-100 start-50 translate-middle-x mt-2"
          style={{ zIndex: 1000 }}
        >
          <div className="bg-dark text-white p-2 rounded shadow-sm" style={{ whiteSpace: 'nowrap' }}>
            {product.odooProductId ? (
              <>
                <div>Odoo ID: {product.odooProductId}</div>
                {product.lastSyncedAt && (
                  <div>Last sync: {new Date(product.lastSyncedAt).toLocaleString()}</div>
                )}
              </>
            ) : (
              <div>Not synced with Odoo</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SyncStatusBadge;
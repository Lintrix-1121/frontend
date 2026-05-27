import React from "react";
import StatusBadge from "./StatusBadge";

const InventoryAlerts = ({ alerts = [] }) => {
  return (
    <div className="card shadow-sm h-100">
      {/* Header */}
      <div className="card-body border-bottom d-flex align-items-center gap-2">
        <i className="bi bi-exclamation-triangle-fill text-danger fs-5"></i>
        <h6 className="fw-bold mb-0">Inventory Alerts</h6>
      </div>

      {/* Content */}
      <div className="card-body">
        {!alerts || alerts.length === 0 ? (
          <p className="text-muted text-center my-4">
            No inventory alerts
          </p>
        ) : (
          alerts.slice(0, 5).map((alert, index) => (
            <div
              key={alert.id || index}
              className="d-flex justify-content-between align-items-start border-bottom py-3"
            >
              <div>
                <div className="fw-semibold">{alert.product}</div>
                <small className="text-muted">
                  Stock: <strong>{alert.currentStock}</strong> | Min:{" "}
                  <strong>{alert.minStock}</strong>
                </small>
              </div>

              <StatusBadge status={alert.status} size="sm" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InventoryAlerts;



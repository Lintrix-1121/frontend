import React from "react";
import StatusBadge from "./StatusBadge";

const RecentActivity = ({ activities = [] }) => {
  return (
    <div className="card shadow-sm h-100">
      {/* Header */}
      <div className="card-body border-bottom d-flex align-items-center gap-2">
        <i className="bi bi-clock-history text-primary fs-5"></i>
        <h6 className="fw-bold mb-0">Recent Activity</h6>
      </div>

      {/* Content */}
      <div className="card-body">
        {!activities || activities.length === 0 ? (
          <p className="text-muted text-center my-4">
            No recent activity
          </p>
        ) : (
          activities.slice(0, 5).map((activity, index) => (
            <div
              key={activity.id || index}
              className="d-flex justify-content-between align-items-start border-bottom py-3"
            >
              {/* Left */}
              <div>
                <div className="fw-semibold">
                  {activity.customer}
                </div>

                <small className="text-muted">
                  Order #{activity.id}
                  <span className="mx-1">•</span>
                  {activity.date}
                </small>
              </div>

              {/* Right */}
              <div className="text-end">
                <div className="fw-semibold">
                  USh {activity.amount?.toFixed(2) || "0.00"}
                </div>
                <StatusBadge status={activity.status} size="sm" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivity;


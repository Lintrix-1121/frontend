import React from "react";
import { AlertTriangle, RefreshCw, X } from "lucide-react";

const ErrorAlert = ({
  message,
  onClose,
  onRetry,
  title = "Unable to Complete Your Request"
}) => {
  return (
    <div
      className="alert border-0 shadow-sm mb-4"
      role="alert"
      style={{
        background: "linear-gradient(135deg,#fff5f5,#ffffff)",
        borderLeft: "5px solid #dc3545",
        borderRadius: "12px"
      }}
    >
      <div className="d-flex align-items-start">

        {/* Icon */}
        <div
          className="d-flex justify-content-center align-items-center me-3 shrink-0"
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "rgba(220,53,69,.12)"
          }}
        >
          <AlertTriangle
            size={28}
            color="#dc3545"
          />
        </div>

        {/* Content */}
        <div className="grow">

          <div className="fw-bold text-success small mb-1">
            SynerPhix Technologies
          </div>

          <h6 className="fw-bold mb-2">
            {title}
          </h6>

          <p className="text-muted mb-3">
            {message ||
              "An unexpected error occurred while processing your request. Please try again."}
          </p>

          <div className="d-flex flex-column flex-sm-row gap-2">

            {onRetry && (
              <button
                className="btn btn-danger btn-sm"
                onClick={onRetry}
              >
                <RefreshCw
                  size={16}
                  className="me-2"
                />
                Try Again
              </button>
            )}

            <a
              href="mailto:synerphixtechnologies@gmail.com"
              className="btn btn-outline-success btn-sm"
            >
              Contact Support
            </a>

          </div>

        </div>

        {/* Close Button */}
        {onClose && (
          <button
            type="button"
            className="btn btn-link text-secondary p-0 ms-3 shrink-0"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={22} />
          </button>
        )}

      </div>
    </div>
  );
};

export default ErrorAlert;
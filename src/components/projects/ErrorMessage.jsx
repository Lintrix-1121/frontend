import React from "react";

const ErrorMessage = ({
  message,
  onRetry,
  title = "Connection Problem",
}) => {
  return (
    <div className="container my-4">
      <div
        className="mx-auto p-4 p-md-5"
        style={{
          maxWidth: "700px",
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(220,53,69,0.2)",
          borderLeft: "5px solid #dc3545",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <div className="row align-items-center g-4">

          {/* Icon */}
          <div className="col-12 col-md-auto text-center">
            <div
              className="d-inline-flex align-items-center justify-content-center"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "rgba(220,53,69,0.1)",
                border: "2px solid rgba(220,53,69,0.2)",
              }}
            >
              <i
                className="bi bi-exclamation-triangle-fill text-danger"
                style={{ fontSize: "2rem" }}
              ></i>
            </div>
          </div>

          {/* Content */}
          <div className="col text-center text-md-start">
            <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-2 mb-2">
              <h4 className="mb-0 fw-bold text-danger">
                {title}
              </h4>

              <span
                className="badge"
                style={{
                  background: "rgba(25,135,84,0.1)",
                  color: "#198754",
                  border: "1px solid rgba(25,135,84,0.2)",
                }}
              >
                SynerPhix Technologies
              </span>
            </div>

            <p className="text-muted mb-3">
              {message ||
                "We encountered a temporary issue while processing your request. Please try again in a few moments."}
            </p>

            {onRetry && (
              <button
                className="btn btn-success px-4"
                onClick={onRetry}
                style={{
                  borderRadius: 0,
                }}
              >
                <i className="bi bi-arrow-repeat me-2"></i>
                Retry
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
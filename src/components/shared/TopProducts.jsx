import React from "react";

const TopProducts = ({ products = [] }) => {
  return (
    <div className="card shadow-sm h-100">
      {/* Header */}
      <div className="card-body border-bottom d-flex align-items-center gap-2">
        <i className="bi bi-star-fill text-primary fs-5"></i>
        <h6 className="fw-bold mb-0">Top Products</h6>
      </div>

      {/* Content */}
      <div className="card-body">
        {!products || products.length === 0 ? (
          <p className="text-muted text-center my-4">
            No product data available
          </p>
        ) : (
          products.slice(0, 5).map((product, index) => (
            <div
              key={product.id || index}
              className="d-flex justify-content-between align-items-center border-bottom py-3"
            >
              {/* Left */}
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded bg-primary bg-opacity-10 text-primary fw-bold"
                  style={{ width: "32px", height: "32px" }}
                >
                  {index + 1}
                </div>

                <div>
                  <div className="fw-semibold">{product.name}</div>
                  <small className="text-muted">
                    {product.sales?.toLocaleString() || 0} sales
                  </small>
                </div>
              </div>

              {/* Right */}
              <div className="text-end">
                <div className="fw-semibold">
                  USh {product.revenue?.toLocaleString() || 0}
                </div>
                <small className="text-muted">Revenue</small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopProducts;


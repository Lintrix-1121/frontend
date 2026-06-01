// src/components/career/CareerStats.jsx
import React from 'react';

const CareerStats = ({ stats }) => {
  // Default stats if none provided
  const defaultStats = {
    totalJobs: 0,
    activeJobs: 0,
    applications: 0,
    departments: 0
  };

  // Handle different API response structures
  const getStats = () => {
    if (!stats) return defaultStats;

    // If stats is the direct data object from your API
    if (stats.data) {
      return {
        totalJobs: stats.data.totals?.jobs || 0,
        activeJobs: stats.data.jobStats?.active || 0,
        applications: stats.data.totals?.applications || 0,
        departments: stats.data.jobStats?.departments || 0
      };
    }

    // If stats is the raw data
    return {
      totalJobs: stats.totals?.jobs || stats.totalJobs || 0,
      activeJobs: stats.jobStats?.active || stats.activeJobs || 0,
      applications: stats.totals?.applications || stats.applications || 0,
      departments: stats.jobStats?.departments || stats.departments || 0
    };
  };

  const data = getStats();

  return (
    <div className="row g-3">
      <div className="col-6 col-md-3">
        <div className="text-center">
          <div className="h2 text-white mb-1">{data.totalJobs}</div>
          <div className="small text-white-50">Total Jobs</div>
        </div>
      </div>
      <div className="col-6 col-md-3">
        <div className="text-center">
          <div className="h2 text-white mb-1">{data.activeJobs}</div>
          <div className="small text-white-50">Active Now</div>
        </div>
      </div>
      <div className="col-6 col-md-3">
        <div className="text-center">
          <div className="h2 text-white mb-1">{data.applications}+</div>
          <div className="small text-white-50">Applications</div>
        </div>
      </div>
      <div className="col-6 col-md-3">
        <div className="text-center">
          <div className="h2 text-white mb-1">{data.departments}</div>
          <div className="small text-white-50">Departments</div>
        </div>
      </div>
    </div>
  );
};

export default CareerStats;


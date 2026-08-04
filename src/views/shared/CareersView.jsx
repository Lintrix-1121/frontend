// src/pages/CareersPage.jsx
import React, { useState, useEffect } from 'react';
import useCareerStore from '../../stores/shared/careerStore';
import JobList from '../../components/career/JobList';
import JobFilters from '../../components/career/JobFilters';
import CareerStats from '../../components/career/CareerStats';
import back from '../../assets/breadboard.jpg'

const CareersPage = () => {
  const {
    jobs,
    loading,
    error,
    fetchJobs,
    fetchCareerStats,
    stats,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    clearFilters,
    getFilteredJobs
  } = useCareerStore();

  const [viewMode, setViewMode] = useState('grid');
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    console.log('CareersPage mounted');
    console.log('Initial store state:', { 
      jobs: jobs?.length, 
      loading, 
      error,
      stats: !!stats 
    });
    
    const loadData = async () => {
      console.log('Starting to fetch data...');
      
      try {
        console.log('Fetching jobs...');
        const jobsResult = await fetchJobs();
        console.log('Jobs result:', jobsResult);
        
        console.log('Fetching stats...');
        const statsResult = await fetchCareerStats();
        console.log('Stats result:', statsResult);
        
        const currentState = useCareerStore.getState();
        console.log('Store after fetch:', {
          jobsLength: currentState.jobs?.length,
          jobs: currentState.jobs,
          loading: currentState.loading,
          error: currentState.error
        });
      } catch (err) { 
        console.error('Error loading data:', err);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    console.log('Jobs updated:', {
      jobsLength: jobs?.length,
      jobs: jobs,
      loading,
      error
    });
    
    const filtered = getFilteredJobs();
    console.log('Filtered jobs:', filtered?.length, filtered);
  }, [jobs, searchQuery, filters]);

  const filteredJobs = getFilteredJobs();

  console.log('Rendering CareersPage with:', {
    jobsLength: jobs?.length,
    filteredLength: filteredJobs?.length,
    loading,
    error,
    searchQuery,
    filters
  });

  if (loading && (!jobs || jobs.length === 0)) {
    console.log('Showing loading spinner...');
    return (
      <div 
        className="min-vh-100 d-flex justify-content-center align-items-center p-3"
        style={{
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}
      >
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-4 text-secondary">Loading career opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-vh-100 d-flex justify-content-center align-items-center p-3"
        style={{
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}
      >
        <div 
          className="p-5 text-center"
          style={{
            maxWidth: '500px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(220, 53, 69, 0.2)'
          }}
        >
          <i className="bi bi-exclamation-triangle-fill" style={{ color: '#dc3545', fontSize: '3rem' }}></i>
          <h4 className="fw-bold mt-3 mb-3" style={{ color: '#dc3545' }}>Error Loading Careers</h4>
          <p className="text-muted mb-4">{error}</p>
          <button 
            className="btn px-4 py-2"
            style={{
              background: 'rgba(220, 53, 69, 0.1)',
              color: '#dc3545',
              border: '1px solid rgba(220, 53, 69, 0.2)',
              transition: 'all 0.3s ease'
            }}
            onClick={() => window.location.reload()}
            onMouseEnter={(e) => {
              e.target.style.background = '#dc3545';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(220, 53, 69, 0.1)';
              e.target.style.color = '#dc3545';
            }}
          >
            <i className="bi bi-arrow-repeat me-2"></i>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      {/* Header with Glass Morphism */}
      <header className="position-relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundImage: `url(${back})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0
          }}
        />
        
        {/* Dark Overlay */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1
          }}
        />
        
        {/* Glass Overlay */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)',
            zIndex: 2
          }}
        />
        
        {/* Content */}
        <div className="container position-relative py-5" style={{ zIndex: 3 }}>
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-3">
                Join <span style={{ color: '#ffc107' }}>Our Team</span>
              </h1>
              <p className="lead text-white mb-0 opacity-75">
                Discover exciting career opportunities and grow with us. We're looking for talented individuals who share our passion for innovation.
              </p>
            </div>
            <div className="col-lg-6 mt-4 mt-lg-0">
              {/* Stats Card */}
              <div 
                className="p-4"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <CareerStats stats={stats} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row g-4">
          {/* Main Content Column */}
          <div className="col-lg-8">
            {/* Search and Filters Card */}
            <div 
              className="p-4 mb-4"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                position: 'relative',
                zIndex: 10
              }}
            >
              <div className="row g-3">
                <div className="col-md-8">
                  <div className="d-flex align-items-stretch">
                    <span 
                      className="d-flex align-items-center justify-content-center px-3"
                      style={{
                        background: 'rgba(40, 167, 69, 0.05)',
                        border: '1px solid rgba(40, 167, 69, 0.2)',
                        borderRight: 'none'
                      }}
                    >
                      <i className="bi bi-search" style={{ color: '#28a745' }}></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search job titles, keywords, or locations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        border: '1px solid rgba(40, 167, 69, 0.2)',
                        borderRadius: 0
                      }}
                      onMouseEnter={(e) => e.target.style.borderColor = '#28a745'}
                      onMouseLeave={(e) => e.target.style.borderColor = 'rgba(40, 167, 69, 0.2)'}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex gap-2">
                    <div className="btn-group grow" role="group">
                      <button
                        className={`btn`}
                        onClick={() => setViewMode('grid')}
                        style={{
                          background: viewMode === 'grid' ? '#28a745' : 'rgba(40, 167, 69, 0.1)',
                          color: viewMode === 'grid' ? 'white' : '#28a745',
                          border: '1px solid rgba(40, 167, 69, 0.2)',
                          borderRadius: 0
                        }}
                      >
                        <i className="bi bi-grid"></i>
                      </button>
                      <button
                        className={`btn`}
                        onClick={() => setViewMode('list')}
                        style={{
                          background: viewMode === 'list' ? '#28a745' : 'rgba(40, 167, 69, 0.1)',
                          color: viewMode === 'list' ? 'white' : '#28a745',
                          border: '1px solid rgba(40, 167, 69, 0.2)',
                          borderRadius: 0
                        }}
                      >
                        <i className="bi bi-list"></i>
                      </button>
                    </div>
                    <div style={{ position: 'relative', zIndex: 20 }}>
                      <JobFilters
                        filters={filters}
                        onFilterChange={setFilters}
                        onClearFilters={clearFilters}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Count */}
            {filteredJobs && filteredJobs.length > 0 && (
              <div className="mb-4">
                <p className="text-muted mb-0">
                  Showing <span className="fw-bold" style={{ color: '#28a745' }}>{filteredJobs.length}</span> of{' '}
                  <span className="fw-bold" style={{ color: '#28a745' }}>{jobs?.length || 0}</span> positions
                </p>
              </div>
            )}

            {/* Job Listings */}
            {filteredJobs && filteredJobs.length > 0 ? (
              <JobList jobs={filteredJobs} viewMode={viewMode} />
            ) : (
              !loading && (
                <div 
                  className="text-center py-5"
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    padding: '3rem'
                  }}
                >
                  <i className="bi bi-briefcase" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
                  <h3 className="fw-bold mt-3 mb-3" style={{ color: '#28a745' }}>No Jobs Found</h3>
                  <p className="text-muted mb-4">
                    Try adjusting your search or filter criteria to find what you're looking for.
                  </p>
                  <button 
                    className="btn px-4 py-2"
                    style={{
                      background: 'rgba(40, 167, 69, 0.1)',
                      color: '#28a745',
                      border: '1px solid rgba(40, 167, 69, 0.2)',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={clearFilters}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#28a745';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(40, 167, 69, 0.1)';
                      e.target.style.color = '#28a745';
                    }}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Clear All Filters
                  </button>
                </div>
              )
            )}
          </div>

          {/* Sidebar Column */}
          <div className="col-lg-4">
            {/* Quick Stats */}
            <div 
              className="mb-4 p-4"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                position: 'relative',
                zIndex: 5
              }}
            >
              <h5 className="fw-semibold pb-2 border-bottom mb-3" style={{ borderColor: 'rgba(40, 167, 69, 0.2)' }}>
                Quick Overview
              </h5>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Total Positions</span>
                  <span className="fw-bold" style={{ color: '#28a745' }}>{jobs?.length || 0}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Active Filters</span>
                  <span className="fw-bold" style={{ color: '#ffc107' }}>
                    {Object.values(filters).filter(v => v && v !== 'all' && v !== '').length}
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Matching Jobs</span>
                  <span className="fw-bold" style={{ color: '#28a745' }}>{filteredJobs?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* Benefits Card */}
            <div 
              className="mb-4 p-4"
              style={{
                background: 'linear-gradient(135deg, rgba(40, 167, 69, 0.1), rgba(255, 193, 7, 0.1))',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(40, 167, 69, 0.2)',
                position: 'relative',
                zIndex: 5
              }}
            >
              <h5 className="fw-semibold pb-2 border-bottom mb-3" style={{ color: '#28a745', borderColor: 'rgba(40, 167, 69, 0.2)' }}>
                Why Join Us?
              </h5>
              <ul className="list-unstyled mb-0">
                {[
                  'Competitive Salary & Benefits',
                  'Flexible Working Hours',
                  'Professional Development',
                  'Health & Wellness Programs',
                  'Remote Work Options'
                ].map((benefit, index) => (
                  <li key={index} className="mb-3 d-flex align-items-center">
                    <i className="bi bi-check-circle-fill me-3" style={{ color: '#28a745' }}></i>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div 
              className="mb-4 p-4"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                position: 'relative',
                zIndex: 5
              }}
            >
              <h5 className="fw-semibold pb-2 border-bottom mb-3" style={{ borderColor: 'rgba(40, 167, 69, 0.2)' }}>
                Stay Updated
              </h5>
              <p className="text-muted small mb-3">
                Get notified about new job opportunities that match your skills.
              </p>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Your email address"
                    style={{
                      borderRadius: 0,
                      border: '1px solid rgba(40, 167, 69, 0.2)',
                      background: 'rgba(255, 255, 255, 0.7)'
                    }}
                    onMouseEnter={(e) => e.target.style.borderColor = '#28a745'}
                    onMouseLeave={(e) => e.target.style.borderColor = 'rgba(40, 167, 69, 0.2)'}
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn w-100 py-2"
                  style={{
                    background: 'rgba(40, 167, 69, 0.1)',
                    color: '#28a745',
                    border: '1px solid rgba(40, 167, 69, 0.2)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#28a745';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(40, 167, 69, 0.1)';
                    e.target.style.color = '#28a745';
                  }}
                >
                  <i className="bi bi-bell me-2"></i>
                  Subscribe to Job Alerts
                </button>
              </form>
            </div>

            {/* Popular Skills */}
            <div 
              className="p-4"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                position: 'relative',
                zIndex: 5
              }}
            >
              <h5 className="fw-semibold pb-2 border-bottom mb-3" style={{ borderColor: 'rgba(40, 167, 69, 0.2)' }}>
                Popular Skills
              </h5>
              <div className="d-flex flex-wrap gap-2">
                {['React', 'Node.js', 'Python', 'JavaScript', 'UI/UX', 'Product Management', 'Data Science', 'DevOps', 'AWS', 'Mobile Development'].map((skill) => (
                  <button
                    key={skill}
                    className="btn btn-sm"
                    style={{
                      background: 'rgba(40, 167, 69, 0.05)',
                      border: '1px solid rgba(40, 167, 69, 0.2)',
                      color: '#28a745',
                      borderRadius: 0,
                      padding: '0.5rem 1rem',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => setSearchQuery(skill)}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#28a745';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(40, 167, 69, 0.05)';
                      e.target.style.color = '#28a745';
                    }}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareersPage;



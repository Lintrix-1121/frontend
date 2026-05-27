import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useProjectStore from '../../stores/shared/projectStore';
import ProjectGrid from '../../components/projects/ProjectGrid';
import ProjectFilters from '../../components/projects/ProjectFilters';
import Pagination from '../../components/admin/Pagination';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import ErrorMessage from '../../components/projects/ErrorMessage';

const Projects = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    projects,
    loading,
    error,
    pagination,
    filters,
    fetchProjects,
    setFilters,
    setPage
  } = useProjectStore();

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Sync URL params with store
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page')) || 1;

    if (category || status || search) {
      setFilters({ category, status, search });
    }
    
    if (page !== pagination.currentPage) {
      setPage(page);
    } else {
      fetchProjects();
    }
  }, [searchParams]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setSearchParams({
      ...newFilters,
      page: 1
    });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSearchParams({
      ...filters,
      page: newPage
    });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Our Projects</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {showFilters && (
          <div className="mb-8">
            <ProjectFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
        )}

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No projects found</p>
          </div>
        ) : (
          <>
            <ProjectGrid projects={projects} />
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Projects;
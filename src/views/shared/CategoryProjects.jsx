import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import projectService from '../../services/shared/projectService';
import ProjectGrid from '../../components/projects/ProjectGrid';
import Pagination from '../../components/admin/Pagination';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import ErrorMessage from '../../components/projects/ErrorMessage';
import { PROJECT_CATEGORIES } from '../../services/shared/projectApi.config';

const CategoryProjects = () => {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState({
    projects: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      total: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentPage = parseInt(searchParams.get('page')) || 1;
  const categoryInfo = PROJECT_CATEGORIES.find(c => c.value === category);

  useEffect(() => {
    loadCategoryProjects();
  }, [category, currentPage]);

  const loadCategoryProjects = async () => {
    setLoading(true);
    setError(null);
    
    const result = await projectService.getProjectsByCategory(category, currentPage, 9);
    
    if (result.success) {
      setData({
        projects: result.data,
        pagination: result.pagination
      });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handlePageChange = (page) => {
    setSearchParams({ page });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadCategoryProjects} />;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{categoryInfo?.icon || '📁'}</div>
          <h1 className="text-4xl font-bold mb-4">{categoryInfo?.label || category}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our {category} projects and see how we deliver innovative solutions.
          </p>
        </div>

        {/* Projects Grid */}
        {data.projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No projects found in this category.</p>
          </div>
        ) : (
          <>
            <ProjectGrid projects={data.projects} />
            
            {/* Pagination */}
            {data.pagination.totalPages > 1 && (
              <Pagination
                currentPage={data.pagination.currentPage}
                totalPages={data.pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryProjects;
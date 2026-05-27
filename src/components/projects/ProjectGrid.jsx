import React from 'react';
import ProjectCard from './ProjectCard';

const ProjectGrid = ({ projects, loading, error, onRetry }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(n => (
          <div key={n} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📁</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Projects Found</h3>
        <p className="text-gray-500">Check back later for new projects.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => (
        <ProjectCard key={project.projectId} project={project} />
      ))}
    </div>
  );
};

export default ProjectGrid;
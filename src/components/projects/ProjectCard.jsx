import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const ProjectCard = ({ project }) => {
  const statusColors = {
    'planned': 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'on-hold': 'bg-orange-100 text-orange-800',
    'cancelled': 'bg-red-100 text-red-800',
    'maintenance': 'bg-purple-100 text-purple-800'
  };

  const priorityColors = {
    'low': 'bg-gray-100 text-gray-800',
    'medium': 'bg-blue-100 text-blue-800',
    'high': 'bg-orange-100 text-orange-800',
    'critical': 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {project.featuredImage ? (
          <img
            src={project.featuredImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-500 to-purple-600">
            <span className="text-4xl text-white">📁</span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[project.status] || 'bg-gray-100'}`}>
            {project.statusBadge?.text || project.status}
          </span>
          {project.isFeatured && (
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
              ⭐ Featured
            </span>
          )}
        </div>
        
        {/* Category */}
        <div className="absolute top-2 right-2">
          <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
            {project.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">
          <Link to={`/projects/${project.slug || project.projectId}`} className="hover:text-blue-600 transition">
            {project.title}
          </Link>
        </h3>
        
        {project.clientName && (
          <p className="text-sm text-gray-600 mb-2">Client: {project.clientName}</p>
        )}
        
        <p className="text-gray-700 mb-4 line-clamp-3">
          {project.shortDescription || project.fullDescription?.substring(0, 150) + '...'}
        </p>

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {project.technologies.slice(0, 3).map((tech, index) => (
                <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                  +{project.technologies.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{project.views || 0}</span>
            </span>
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{project.likes || 0}</span>
            </span>
          </div>
          
          {project.publishedAt && (
            <span>{format(new Date(project.publishedAt), 'MMM d, yyyy')}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
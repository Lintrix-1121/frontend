import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useProjectStore from '../../stores/shared/projectStore';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import ErrorMessage from '../../components/projects/ErrorMessage';
import Pagination from '../../components/admin/Pagination';

const ProjectList = () => {
  const { projects, loading, error, pagination, fetchProjects, deleteProject, setPage } = useProjectStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteType, setDeleteType] = useState('soft');

  useEffect(() => {
    fetchProjects({ limit: 10 });
  }, []);

  const handleDeleteClick = (project) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (selectedProject) {
      await deleteProject(selectedProject.projectId, deleteType === 'permanent');
      setShowDeleteModal(false);
      setSelectedProject(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      'planned': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'on-hold': 'bg-orange-100 text-orange-800',
      'cancelled': 'bg-red-100 text-red-800',
      'maintenance': 'bg-purple-100 text-purple-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Link
          to="/admin/projects/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + New Project
        </Link>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projects.map(project => (
                <tr key={project.projectId} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3 flex items-center justify-center">
                        {project.featuredImage ? (
                          <img
                            src={project.featuredImage}
                            alt={project.title}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <span className="text-xl">📁</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{project.title}</p>
                        {project.clientName && (
                          <p className="text-sm text-gray-500">{project.clientName}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">{project.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(project.status)}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      project.priority === 'high' || project.priority === 'critical'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {project.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{project.views || 0}</td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/projects/edit/${project.projectId}`}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(project)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Delete Project</h3>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete "{selectedProject.title}"?
            </p>
            
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="soft"
                  checked={deleteType === 'soft'}
                  onChange={(e) => setDeleteType('soft')}
                  className="text-blue-600"
                />
                <span>Soft delete (move to trash)</span>
              </label>
              <label className="flex items-center space-x-2 mt-2">
                <input
                  type="radio"
                  value="permanent"
                  checked={deleteType === 'permanent'}
                  onChange={(e) => setDeleteType('permanent')}
                  className="text-red-600"
                />
                <span>Permanently delete (cannot be undone)</span>
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
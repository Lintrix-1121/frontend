import React, { useEffect, useState } from 'react';
import useProjectStore from '../../stores/shared/projectStore';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import ErrorMessage from '../../components/projects/ErrorMessage';

const ProjectStats = () => {
  const { projectStats, loading, error, fetchProjectStats } = useProjectStore();
  const [selectedChart, setSelectedChart] = useState('category');

  useEffect(() => {
    fetchProjectStats();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!projectStats) return null;

  const { totals, byStatus, byCategory, engagement, recentProjects, topPerformers } = projectStats;

  const getMaxValue = (obj) => {
    if (!obj) return 0;
    return Math.max(...Object.values(obj));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Project Statistics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <p className="text-blue-100 mb-2">Total Projects</p>
          <p className="text-4xl font-bold">{totals?.all || 0}</p>
        </div>

        <div className="bg-linear-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <p className="text-green-100 mb-2">Published</p>
          <p className="text-4xl font-bold">{totals?.published || 0}</p>
        </div>

        <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <p className="text-purple-100 mb-2">Featured</p>
          <p className="text-4xl font-bold">{totals?.featured || 0}</p>
        </div>

        <div className="bg-linear-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
          <p className="text-yellow-100 mb-2">Total Views</p>
          <p className="text-4xl font-bold">{engagement?.totalViews?.toLocaleString() || 0}</p>
        </div>
      </div>

      {/* Engagement Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Engagement</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Total Likes</p>
              <p className="text-2xl font-bold">{engagement?.totalLikes?.toLocaleString() || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Shares</p>
              <p className="text-2xl font-bold">{engagement?.totalShares?.toLocaleString() || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Views</p>
              <p className="text-2xl font-bold">{engagement?.averageViews?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">By Status</h3>
          <div className="space-y-3">
            {byStatus && Object.entries(byStatus).map(([status, count]) => {
              const percentage = totals?.all ? ((count / totals.all) * 100).toFixed(1) : 0;
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{status}</span>
                    <span className="font-medium">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        status === 'completed' ? 'bg-green-500' :
                        status === 'in-progress' ? 'bg-blue-500' :
                        status === 'planned' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">By Priority</h3>
          <div className="space-y-3">
            {projectStats.priorityStats && Object.entries(projectStats.priorityStats).map(([priority, count]) => {
              const percentage = totals?.all ? ((count / totals.all) * 100).toFixed(1) : 0;
              return (
                <div key={priority}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{priority}</span>
                    <span className="font-medium">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        priority === 'critical' ? 'bg-red-500' :
                        priority === 'high' ? 'bg-orange-500' :
                        priority === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Projects by Category</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedChart('category')}
              className={`px-3 py-1 rounded-lg ${
                selectedChart === 'category' ? 'bg-blue-600 text-white' : 'bg-gray-100'
              }`}
            >
              Bar
            </button>
            <button
              onClick={() => setSelectedChart('pie')}
              className={`px-3 py-1 rounded-lg ${
                selectedChart === 'pie' ? 'bg-blue-600 text-white' : 'bg-gray-100'
              }`}
            >
              Pie
            </button>
          </div>
        </div>

        {byCategory && (
          <div className="space-y-4">
            {Object.entries(byCategory)
              .sort((a, b) => b[1] - a[1])
              .map(([category, count]) => {
                const maxValue = getMaxValue(byCategory);
                const percentage = maxValue ? (count / maxValue) * 100 : 0;
                
                return (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{category}</span>
                      <span className="font-medium">{count} projects</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-blue-600 h-4 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Top Performing Projects */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-6">Top Performing Projects</h3>
        <div className="space-y-4">
          {topPerformers?.map(project => (
            <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-semibold">{project.title}</h4>
                <p className="text-sm text-gray-500">{project.category}</p>
              </div>
              <div className="flex space-x-4">
                <span className="text-sm" title="Views">
                  👁️ {project.views}
                </span>
                <span className="text-sm" title="Likes">
                  ❤️ {project.likes}
                </span>
                <span className="text-sm" title="Shares">
                  📤 {project.shares}
                </span>
                <span className="text-sm font-semibold text-blue-600" title="Engagement Score">
                  Score: {project.engagementScore}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {recentProjects?.map(project => (
            <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-semibold">{project.title}</h4>
                <p className="text-sm text-gray-500">
                  Published {new Date(project.publishedAt || project.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">by {project.creator}</span>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {project.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectStats;
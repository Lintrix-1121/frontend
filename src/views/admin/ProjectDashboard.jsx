import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import  useProjectStore  from '../../stores/shared/projectStore';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import ErrorMessage from '../../components/projects/ErrorMessage';

const ProjectDashboard = () => {
  const { projects, loading, error, fetchProjects, getProjectStats } = useProjectStore();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    await fetchProjects({ limit: 5 });
    const statsData = await getProjectStats();
    setStats(statsData);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const getStatusColor = (status) => {
    const colors = {
      'planned': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'on-hold': 'bg-orange-100 text-orange-800',
      'cancelled': 'bg-red-100 text-red-800',
      'maintenance': 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Project Dashboard</h1>
        <Link
          to="/admin/projects/projects/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + New Project
        </Link>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm">Total Projects</p>
            <p className="text-3xl font-bold">{stats.totals?.all || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm">Published</p>
            <p className="text-3xl font-bold">{stats.totals?.published || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm">Featured</p>
            <p className="text-3xl font-bold">{stats.totals?.featured || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm">Total Views</p>
            <p className="text-3xl font-bold">{stats.engagement?.totalViews || 0}</p>
          </div>
        </div>
      )}

      {/* Recent Projects */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Recent Projects</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projects.map(project => (
                <tr key={project.projectId} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3 flex items-center justify-center">
                        {project.featuredImage ? (
                          <img src={project.featuredImage} alt={project.title} className="w-10 h-10 rounded-lg object-cover" />
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
                  <td className="px-6 py-4">{project.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
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
                  <td className="px-6 py-4">{project.views || 0}</td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/admin/projects/edit/${project.projectId}`}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(project)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useProjectStore } from '../../stores/shared/projectStore';
// import projectController from '../../controllers/shared/projectController';
// import LoadingSpinner from '../../components/admin/LoadingSpinner';
// import ErrorMessage from '../../components/projects/ErrorMessage';

// const ProjectDashboard = () => {
//   const { projectStats, loading, error } = useProjectStore();
//   const [dashboardData, setDashboardData] = useState(null);

//   useEffect(() => {
//     loadDashboardData();
//   }, []);

//   const loadDashboardData = async () => {
//     const data = await projectController.loadAdminDashboard();
//     setDashboardData(data);
//   };

//   if (loading || !dashboardData) return <LoadingSpinner />;
//   if (error) return <ErrorMessage message={error} />;

//   const { stats, recentProjects } = dashboardData;

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Total Projects</p>
//               <p className="text-3xl font-bold">{stats?.totals?.all || 0}</p>
//             </div>
//             <div className="text-blue-500 text-4xl">📁</div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Published</p>
//               <p className="text-3xl font-bold">{stats?.totals?.published || 0}</p>
//             </div>
//             <div className="text-green-500 text-4xl">✅</div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Featured</p>
//               <p className="text-3xl font-bold">{stats?.totals?.featured || 0}</p>
//             </div>
//             <div className="text-yellow-500 text-4xl">⭐</div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-500 text-sm">Total Views</p>
//               <p className="text-3xl font-bold">{stats?.engagement?.totalViews || 0}</p>
//             </div>
//             <div className="text-purple-500 text-4xl">👁️</div>
//           </div>
//         </div>
//       </div>

//       {/* Recent Projects */}
//       <div className="bg-white rounded-lg shadow p-6 mb-8">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Recent Projects</h2>
//           <Link
//             to="/admin/projects"
//             className="text-blue-600 hover:underline"
//           >
//             View All
//           </Link>
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-2 text-left">Title</th>
//                 <th className="px-4 py-2 text-left">Category</th>
//                 <th className="px-4 py-2 text-left">Status</th>
//                 <th className="px-4 py-2 text-left">Views</th>
//                 <th className="px-4 py-2 text-left">Created</th>
//               </tr>
//             </thead>
//             <tbody>
//               {recentProjects?.map(project => (
//                 <tr key={project.projectId} className="border-t hover:bg-gray-50">
//                   <td className="px-4 py-2">
//                     <Link
//                       to={`/admin/projects/edit/${project.projectId}`}
//                       className="text-blue-600 hover:underline"
//                     >
//                       {project.title}
//                     </Link>
//                   </td>
//                   <td className="px-4 py-2">{project.category}</td>
//                   <td className="px-4 py-2">
//                     <span className={`px-2 py-1 rounded-full text-xs bg-${project.statusBadge?.color}-100 text-${project.statusBadge?.color}-800`}>
//                       {project.statusBadge?.text}
//                     </span>
//                   </td>
//                   <td className="px-4 py-2">{project.views}</td>
//                   <td className="px-4 py-2">
//                     {new Date(project.createdAt).toLocaleDateString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Category Distribution */}
//       {stats?.byCategory && Object.keys(stats.byCategory).length > 0 && (
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">Projects by Category</h2>
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//             {Object.entries(stats.byCategory).map(([category, count]) => (
//               <div key={category} className="flex justify-between items-center">
//                 <span className="text-gray-700">{category}:</span>
//                 <span className="font-semibold">{count}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProjectDashboard;
import React from 'react';
import { format } from 'date-fns';

const ProjectTimeline = ({ startDate, endDate, milestones = [], completionPercentage }) => {
  const calculateProgress = () => {
    if (completionPercentage !== undefined) return completionPercentage;
    
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const total = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / total) * 100);
  };

  const progress = calculateProgress();

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 rounded-full h-4 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>

        {/* Start Date */}
        {startDate && (
          <div className="relative pl-12 pb-8">
            <div className="absolute left-2 w-5 h-5 bg-green-500 rounded-full border-4 border-white shadow"></div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="font-semibold">{format(new Date(startDate), 'MMMM d, yyyy')}</p>
            </div>
          </div>
        )}

        {/* Milestones */}
        {milestones.map((milestone, index) => (
          <div key={index} className="relative pl-12 pb-8">
            <div className={`absolute left-2 w-5 h-5 ${getStatusColor(milestone.status)} rounded-full border-4 border-white shadow`}></div>
            <div className="bg-white border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold">{milestone.title}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  milestone.status === 'completed' ? 'bg-green-100 text-green-800' :
                  milestone.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {milestone.status}
                </span>
              </div>
              {milestone.description && (
                <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
              )}
              {milestone.date && (
                <p className="text-xs text-gray-500">
                  Target: {format(new Date(milestone.date), 'MMMM d, yyyy')}
                </p>
              )}
            </div>
          </div>
        ))}

        {/* End Date */}
        {endDate && (
          <div className="relative pl-12">
            <div className="absolute left-2 w-5 h-5 bg-red-500 rounded-full border-4 border-white shadow"></div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">End Date</p>
              <p className="font-semibold">{format(new Date(endDate), 'MMMM d, yyyy')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTimeline;
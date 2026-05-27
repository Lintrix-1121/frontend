// src/components/career/JobList.jsx
import React from 'react';
import JobCard from './JobCard';
import JobListItem from './JobListItem';

const JobList = ({ jobs, viewMode }) => {
  if (!jobs || jobs.length === 0) return null;

  if (viewMode === 'grid') {
    return (
      <div className="row g-4">
        {jobs.map((job) => (
          <div key={job.id} className="col-md-6">
            <div 
              className="h-100"
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
                e.currentTarget.style.borderColor = 'rgba(40, 167, 69, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.1)';
              }}
            >
              <JobCard job={job} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // List view
  return (
    <div className="vstack gap-3">
      {jobs.map((job) => (
        <div 
          key={job.id}
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
            e.currentTarget.style.borderColor = 'rgba(40, 167, 69, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.1)';
          }}
        >
          <JobListItem job={job} />
        </div>
      ))}
    </div>
  );
};

export default JobList;// // src/components/career/JobList.jsx
// import React from 'react';
// import JobCard from './JobCard';
// import JobListItem from './JobListItem';

// const JobList = ({ jobs, viewMode }) => {
//   if (viewMode === 'grid') {
//     return (
//       <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
//         {jobs.map((job) => (
//           <div key={job.id} className="col">
//             <JobCard job={job} />
//           </div>
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className="list-group">
//       {jobs.map((job) => (
//         <JobListItem key={job.id} job={job} />
//       ))}
//     </div>
//   );
// };

// export default JobList;


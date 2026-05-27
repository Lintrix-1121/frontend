import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useProjectStore from '../../stores/shared/projectStore';
import projectController from '../../controllers/shared/projectController';
import ProjectMediaGallery from '../../components/projects/ProjectMediaGallery';
import ProjectTimeline from '../../components/projects/ProjectTimeline';
import ProjectGrid from '../../components/projects/ProjectGrid';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import ErrorMessage from '../../components/projects/ErrorMessage';

const ProjectDetail = () => {
  const { identifier } = useParams();
  const { currentProject, loading, error } = useProjectStore();
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    loadProjectData();
  }, [identifier]);

  const loadProjectData = async () => {
    setPageLoading(true);
    const data = await projectController.loadProjectDetailPage(identifier);
    if (data) {
      setRelatedProjects(data.relatedProjects);
    }
    setPageLoading(false);
  };

  if (pageLoading || loading) return <LoadingSpinner />;
  if (error || !currentProject) return <ErrorMessage message="Project not found" />;

  const project = currentProject;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex gap-2 mb-4">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {project.category}
              </span>
              <span className={`bg-${project.statusBadge.color}-500/20 px-3 py-1 rounded-full text-sm`}>
                {project.statusBadge.text}
              </span>
              {project.isFeatured && (
                <span className="bg-yellow-500/20 px-3 py-1 rounded-full text-sm">
                  Featured
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
            {project.clientName && (
              <p className="text-xl opacity-90">Client: {project.clientName}</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Media Gallery */}
            {project.media?.length > 0 && (
              <div className="mb-8">
                <ProjectMediaGallery media={project.media} />
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
              <p className="text-gray-700 mb-6">{project.fullDescription}</p>

              {project.challenge && (
                <>
                  <h3 className="text-xl font-semibold mb-2">The Challenge</h3>
                  <p className="text-gray-700 mb-4">{project.challenge}</p>
                </>
              )}

              {project.solution && (
                <>
                  <h3 className="text-xl font-semibold mb-2">Our Solution</h3>
                  <p className="text-gray-700 mb-4">{project.solution}</p>
                </>
              )}

              {project.results && (
                <>
                  <h3 className="text-xl font-semibold mb-2">Key Results</h3>
                  <p className="text-gray-700 mb-4">{project.results}</p>
                </>
              )}
            </div>

            {/* Technologies */}
            {project.technologies?.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">Technologies Used</h2>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Testimonial */}
            {project.clientTestimonial && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">Client Testimonial</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 italic mb-4">"{project.clientTestimonial}"</p>
                  <div>
                    <p className="font-semibold">{project.testimonialAuthor}</p>
                    <p className="text-sm text-gray-500">{project.testimonialPosition}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            {/* Project Info Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Project Details</h3>
              
              <div className="space-y-4">
                {project.clientName && (
                  <div>
                    <p className="text-sm text-gray-500">Client</p>
                    <p className="font-semibold">{project.clientName}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className={`font-semibold text-${project.statusBadge.color}-600`}>
                    {project.statusBadge.text}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Priority</p>
                  <p className={`font-semibold text-${project.priorityBadge.color}-600`}>
                    {project.priorityBadge.text}
                  </p>
                </div>

                {project.startDate && (
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-semibold">{project.formattedStartDate}</p>
                  </div>
                )}

                {project.endDate && (
                  <div>
                    <p className="text-sm text-gray-500">End Date</p>
                    <p className="font-semibold">{project.formattedEndDate}</p>
                  </div>
                )}

                {project.projectDuration && (
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-semibold">{project.projectDuration}</p>
                  </div>
                )}

                {project.teamSize && (
                  <div>
                    <p className="text-sm text-gray-500">Team Size</p>
                    <p className="font-semibold">{project.teamSize} members</p>
                  </div>
                )}

                {project.budget && (
                  <div>
                    <p className="text-sm text-gray-500">Budget</p>
                    <p className="font-semibold">{project.formattedBudget}</p>
                  </div>
                )}

                {project.location && (
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold">{project.location}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Project Manager Card */}
            {project.manager && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Project Manager</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    {project.manager.profilePicture ? (
                      <img
                        src={project.manager.profilePicture}
                        alt={project.manager.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xl">
                        {project.manager.username?.[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{project.manager.username}</p>
                    <p className="text-sm text-gray-500">{project.manager.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Links */}
            {(project.projectUrl || project.githubUrl || project.demoUrl) && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">Links</h3>
                <div className="space-y-2">
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:underline"
                    >
                      🔗 Project Website
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-gray-700 hover:underline"
                    >
                      💻 GitHub Repository
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-green-600 hover:underline"
                    >
                      🚀 Live Demo
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Timeline Section */}
        {project.milestones?.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Project Timeline</h2>
            <ProjectTimeline
              startDate={project.startDate}
              endDate={project.endDate}
              milestones={project.milestones}
              completionPercentage={project.completionPercentage}
            />
          </div>
        )}

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Projects</h2>
            <ProjectGrid projects={relatedProjects} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
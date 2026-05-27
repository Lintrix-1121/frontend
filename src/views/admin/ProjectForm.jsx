import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useProjectStore from '../../stores/shared/projectStore';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import ErrorMessage from '../../components/projects/ErrorMessage';
import toast from 'react-hot-toast';

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProject, loading, error, createProject, updateProject, fetchProject } = useProjectStore();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Software Development',
    subCategory: '',
    clientName: '',
    clientIndustry: '',
    shortDescription: '',
    fullDescription: '',
    challenge: '',
    solution: '',
    results: '',
    technologies: [],
    teamSize: '',
    projectDuration: '',
    startDate: '',
    endDate: '',
    projectUrl: '',
    githubUrl: '',
    demoUrl: '',
    clientTestimonial: '',
    testimonialAuthor: '',
    testimonialPosition: '',
    status: 'planned',
    priority: 'medium',
    isFeatured: false,
    isPublished: false,
    tags: [],
    location: '',
    country: '',
    budget: '',
    currency: 'USD'
  });

  const [mediaFiles, setMediaFiles] = useState([]);
  const [techInput, setTechInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (id) {
      fetchProject(id);
    }
  }, [id]);

  useEffect(() => {
    if (currentProject && id) {
      setFormData({
        title: currentProject.title || '',
        category: currentProject.category || 'Software Development',
        subCategory: currentProject.subCategory || '',
        clientName: currentProject.clientName || '',
        clientIndustry: currentProject.clientIndustry || '',
        shortDescription: currentProject.shortDescription || '',
        fullDescription: currentProject.fullDescription || '',
        challenge: currentProject.challenge || '',
        solution: currentProject.solution || '',
        results: currentProject.results || '',
        technologies: currentProject.technologies || [],
        teamSize: currentProject.teamSize || '',
        projectDuration: currentProject.projectDuration || '',
        startDate: currentProject.startDate ? currentProject.startDate.split('T')[0] : '',
        endDate: currentProject.endDate ? currentProject.endDate.split('T')[0] : '',
        projectUrl: currentProject.projectUrl || '',
        githubUrl: currentProject.githubUrl || '',
        demoUrl: currentProject.demoUrl || '',
        clientTestimonial: currentProject.clientTestimonial || '',
        testimonialAuthor: currentProject.testimonialAuthor || '',
        testimonialPosition: currentProject.testimonialPosition || '',
        status: currentProject.status || 'planned',
        priority: currentProject.priority || 'medium',
        isFeatured: currentProject.isFeatured || false,
        isPublished: currentProject.isPublished || false,
        tags: currentProject.tags || [],
        location: currentProject.location || '',
        country: currentProject.country || '',
        budget: currentProject.budget || '',
        currency: currentProject.currency || 'USD'
      });
    }
  }, [currentProject, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayAdd = (field, value, setInput) => {
    if (value && !formData[field].includes(value)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value]
      }));
      setInput('');
    }
  };

  const handleArrayRemove = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== value)
    }));
  };

  const handleFileChange = (e) => {
    setMediaFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const projectData = {
        ...formData,
        createdBy: user.userId
      };

      let result;
      if (id) {
        result = await updateProject(id, projectData, mediaFiles);
      } else {
        result = await createProject(projectData, mediaFiles);
      }

      if (result.success) {
        toast.success(result.message || 'Project saved successfully');
        navigate('/admin/projects');
      } else {
        toast.error(result.error || 'Error saving project');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error('Submit error:', error);
    }
  };

  const categoryOptions = [
    { value: 'IoT', label: 'Internet of Things' },
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Mobile apps', label: 'Mobile Apps' },
    { value: 'Web apps', label: 'Web Apps' },
    { value: 'Installations', label: 'Installations' },
    { value: 'Networking', label: 'Networking' },
    { value: 'Embedded Systems', label: 'Embedded Systems' },
    { value: 'Software Development', label: 'Software Development' },
    { value: 'ICT Infrastructure', label: 'ICT Infrastructure' },
    { value: 'Security Systems', label: 'Security Systems' },
    { value: 'Cloud Computing', label: 'Cloud Computing' },
    { value: 'AI/ML', label: 'AI/ML' },
    { value: 'Blockchain', label: 'Blockchain' },
    { value: 'Robotics', label: 'Robotics' },
    { value: 'Telecommunications', label: 'Telecommunications' },
    { value: 'Data Center', label: 'Data Center' },
    { value: 'IT Consulting', label: 'IT Consulting' },
    { value: 'Hardware Design', label: 'Hardware Design' },
    { value: 'Firmware Development', label: 'Firmware Development' },
    { value: 'System Integration', label: 'System Integration' }
  ];

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">
        {id ? 'Edit Project' : 'Create New Project'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2"
              >
                {categoryOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Sub Category</label>
              <input
                type="text"
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Client Name</label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Client Industry</label>
              <input
                type="text"
                name="clientIndustry"
                value={formData.clientIndustry}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Status & Priority */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Status & Priority</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="planned">Planned</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
                <option value="cancelled">Cancelled</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="rounded"
                />
                <span>Featured Project</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  className="rounded"
                />
                <span>Published</span>
              </label>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Short Description</label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows="3"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Full Description *</label>
              <textarea
                name="fullDescription"
                value={formData.fullDescription}
                onChange={handleChange}
                required
                rows="6"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Challenge</label>
              <textarea
                name="challenge"
                value={formData.challenge}
                onChange={handleChange}
                rows="4"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Solution</label>
              <textarea
                name="solution"
                value={formData.solution}
                onChange={handleChange}
                rows="4"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Results</label>
              <textarea
                name="results"
                value={formData.results}
                onChange={handleChange}
                rows="4"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Technologies */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Technologies</h2>
          
          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="Add technology..."
                className="flex-1 border rounded-lg px-3 py-2"
              />
              <button
                type="button"
                onClick={() => handleArrayAdd('technologies', techInput, setTechInput)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map(tech => (
                <span
                  key={tech}
                  className="bg-gray-100 px-3 py-1 rounded-full flex items-center space-x-1"
                >
                  <span>{tech}</span>
                  <button
                    type="button"
                    onClick={() => handleArrayRemove('technologies', tech)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Dates & Timeline */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Timeline</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Project Duration</label>
              <input
                type="text"
                name="projectDuration"
                value={formData.projectDuration}
                onChange={handleChange}
                placeholder="e.g., 3 months"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Team Size</label>
              <input
                type="number"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleChange}
                min="1"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Links</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Project URL</label>
              <input
                type="url"
                name="projectUrl"
                value={formData.projectUrl}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">GitHub URL</label>
              <input
                type="url"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Demo URL</label>
              <input
                type="url"
                name="demoUrl"
                value={formData.demoUrl}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Location</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, State"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Budget</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Budget</label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                step="0.01"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Currency</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
              </select>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Client Testimonial</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Testimonial</label>
              <textarea
                name="clientTestimonial"
                value={formData.clientTestimonial}
                onChange={handleChange}
                rows="4"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Author</label>
                <input
                  type="text"
                  name="testimonialAuthor"
                  value={formData.testimonialAuthor}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Position</label>
                <input
                  type="text"
                  name="testimonialPosition"
                  value={formData.testimonialPosition}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Media Upload */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Media Files</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload Images/Videos/Documents
            </label>
            <input
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-1">
              Max 20 files. Images (10MB), Videos (100MB), Documents (20MB)
            </p>
          </div>

          {mediaFiles.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Selected files:</h3>
              <ul className="list-disc list-inside">
                {Array.from(mediaFiles).map((file, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/projects')}
            className="px-6 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            {id ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useProjectStore } from '../../stores/shared/projectStore';
// import projectController from '../../controllers/shared/projectController';
// import LoadingSpinner from '../../components/admin/LoadingSpinner';
// import ErrorMessage from '../../components/projects/ErrorMessage';

// const ProjectForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { loading, error } = useProjectStore();
  
//   const [formData, setFormData] = useState({
//     title: '',
//     category: 'Software Development',
//     subCategory: '',
//     clientName: '',
//     clientIndustry: '',
//     shortDescription: '',
//     fullDescription: '',
//     challenge: '',
//     solution: '',
//     results: '',
//     technologies: [],
//     teamSize: '',
//     projectDuration: '',
//     startDate: '',
//     endDate: '',
//     projectUrl: '',
//     githubUrl: '',
//     demoUrl: '',
//     clientTestimonial: '',
//     testimonialAuthor: '',
//     testimonialPosition: '',
//     status: 'planned',
//     priority: 'medium',
//     isFeatured: false,
//     isPublished: false,
//     tags: [],
//     location: '',
//     country: '',
//     budget: '',
//     currency: 'USD'
//   });

//   const [mediaFiles, setMediaFiles] = useState([]);
//   const [techInput, setTechInput] = useState('');
//   const [tagInput, setTagInput] = useState('');
//   const [loadingData, setLoadingData] = useState(id ? true : false);

//   useEffect(() => {
//     if (id) {
//       loadProjectData();
//     }
//   }, [id]);

//   const loadProjectData = async () => {
//     const project = await projectController.loadProjectForm(parseInt(id));
//     if (project) {
//       setFormData({
//         title: project.title || '',
//         category: project.category || 'Software Development',
//         subCategory: project.subCategory || '',
//         clientName: project.clientName || '',
//         clientIndustry: project.clientIndustry || '',
//         shortDescription: project.shortDescription || '',
//         fullDescription: project.fullDescription || '',
//         challenge: project.challenge || '',
//         solution: project.solution || '',
//         results: project.results || '',
//         technologies: project.technologies || [],
//         teamSize: project.teamSize || '',
//         projectDuration: project.projectDuration || '',
//         startDate: project.startDate ? project.startDate.split('T')[0] : '',
//         endDate: project.endDate ? project.endDate.split('T')[0] : '',
//         projectUrl: project.projectUrl || '',
//         githubUrl: project.githubUrl || '',
//         demoUrl: project.demoUrl || '',
//         clientTestimonial: project.clientTestimonial || '',
//         testimonialAuthor: project.testimonialAuthor || '',
//         testimonialPosition: project.testimonialPosition || '',
//         status: project.status || 'planned',
//         priority: project.priority || 'medium',
//         isFeatured: project.isFeatured || false,
//         isPublished: project.isPublished || false,
//         tags: project.tags || [],
//         location: project.location || '',
//         country: project.country || '',
//         budget: project.budget || '',
//         currency: project.currency || 'USD'
//       });
//     }
//     setLoadingData(false);
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleArrayAdd = (field, value, inputField, setInput) => {
//     if (value && !formData[field].includes(value)) {
//       setFormData(prev => ({
//         ...prev,
//         [field]: [...prev[field], value]
//       }));
//       setInput('');
//     }
//   };

//   const handleArrayRemove = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: prev[field].filter(item => item !== value)
//     }));
//   };

//   const handleFileChange = (e) => {
//     setMediaFiles([...e.target.files]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (id) {
//       const result = await projectController.handleUpdateProject(
//         parseInt(id),
//         formData,
//         mediaFiles,
//         navigate
//       );
//       if (!result.success) {
//         alert(result.error);
//       }
//     } else {
//       const result = await projectController.handleCreateProject(
//         formData,
//         mediaFiles,
//         navigate
//       );
//       if (!result.success) {
//         alert(result.error);
//       }
//     }
//   };

//   const handleClone = async () => {
//     const newTitle = prompt('Enter title for cloned project:', `Copy of ${formData.title}`);
//     if (newTitle) {
//       const result = await projectController.handleCloneProject(id, newTitle, navigate);
//       if (!result.success) {
//         alert(result.error);
//       }
//     }
//   };

//   const handleExport = async (format) => {
//     const result = await projectController.handleExportProject(id, format);
//     if (!result.success) {
//       alert(result.error);
//     }
//   };

//   if (loadingData) return <LoadingSpinner />;

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">
//           {id ? 'Edit Project' : 'Create New Project'}
//         </h1>
//         {id && (
//           <div className="flex space-x-2">
//             <button
//               onClick={handleClone}
//               className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
//             >
//               Clone
//             </button>
//             <button
//               onClick={() => handleExport('json')}
//               className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//             >
//               Export JSON
//             </button>
//             <button
//               onClick={() => handleExport('csv')}
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             >
//               Export CSV
//             </button>
//           </div>
//         )}
//       </div>

//       {error && <ErrorMessage message={error} />}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Basic Information */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Title *</label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 required
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Category *</label>
//               <select
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 required
//                 className="w-full border rounded-lg px-3 py-2"
//               >
//                 {projectController.getCategoryOptions().map(opt => (
//                   <option key={opt.value} value={opt.value}>
//                     {opt.label}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Sub Category</label>
//               <input
//                 type="text"
//                 name="subCategory"
//                 value={formData.subCategory}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Client Name</label>
//               <input
//                 type="text"
//                 name="clientName"
//                 value={formData.clientName}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Client Industry</label>
//               <input
//                 type="text"
//                 name="clientIndustry"
//                 value={formData.clientIndustry}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Status & Priority */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">Status & Priority</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Status</label>
//               <select
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2"
//               >
//                 {projectController.getStatusOptions().map(opt => (
//                   <option key={opt.value} value={opt.value}>
//                     {opt.label}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Priority</label>
//               <select
//                 name="priority"
//                 value={formData.priority}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2"
//               >
//                 {projectController.getPriorityOptions().map(opt => (
//                   <option key={opt.value} value={opt.value}>
//                     {opt.label}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="flex items-center space-x-4">
//               <label className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   name="isFeatured"
//                   checked={formData.isFeatured}
//                   onChange={handleChange}
//                   className="rounded"
//                 />
//                 <span>Featured Project</span>
//               </label>

//               <label className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   name="isPublished"
//                   checked={formData.isPublished}
//                   onChange={handleChange}
//                   className="rounded"
//                 />
//                 <span>Published</span>
//               </label>
//             </div>
//           </div>
//         </div>

//         {/* Description */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">Description</h2>
          
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Short Description</label>
//               <textarea
//                 name="shortDescription"
//                 value={formData.shortDescription}
//                 onChange={handleChange}
//                 rows="3"
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Full Description *</label>
//               <textarea
//                 name="fullDescription"
//                 value={formData.fullDescription}
//                 onChange={handleChange}
//                 required
//                 rows="6"
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Challenge</label>
//               <textarea
//                 name="challenge"
//                 value={formData.challenge}
//                 onChange={handleChange}
//                 rows="4"
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Solution</label>
//               <textarea
//                 name="solution"
//                 value={formData.solution}
//                 onChange={handleChange}
//                 rows="4"
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Results</label>
//               <textarea
//                 name="results"
//                 value={formData.results}
//                 onChange={handleChange}
//                 rows="4"
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Technologies */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">Technologies</h2>
          
//           <div className="space-y-4">
//             <div className="flex space-x-2">
//               <input
//                 type="text"
//                 value={techInput}
//                 onChange={(e) => setTechInput(e.target.value)}
//                 placeholder="Add technology..."
//                 className="flex-1 border rounded-lg px-3 py-2"
//               />
//               <button
//                 type="button"
//                 onClick={() => handleArrayAdd('technologies', techInput, setTechInput)}
//                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//               >
//                 Add
//               </button>
//             </div>
            
//             <div className="flex flex-wrap gap-2">
//               {formData.technologies.map(tech => (
//                 <span
//                   key={tech}
//                   className="bg-gray-100 px-3 py-1 rounded-full flex items-center space-x-1"
//                 >
//                   <span>{tech}</span>
//                   <button
//                     type="button"
//                     onClick={() => handleArrayRemove('technologies', tech)}
//                     className="text-red-500 hover:text-red-700"
//                   >
//                     ×
//                   </button>
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Dates & Timeline */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">Timeline</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Start Date</label>
//               <input
//                 type="date"
//                 name="startDate"
//                 value={formData.startDate}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">End Date</label>
//               <input
//                 type="date"
//                 name="endDate"
//                 value={formData.endDate}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Project Duration</label>
//               <input
//                 type="text"
//                 name="projectDuration"
//                 value={formData.projectDuration}
//                 onChange={handleChange}
//                 placeholder="e.g., 3 months"
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Team Size</label>
//               <input
//                 type="number"
//                 name="teamSize"
//                 value={formData.teamSize}
//                 onChange={handleChange}
//                 min="1"
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Links */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">Links</h2>
          
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Project URL</label>
//               <input
//                 type="url"
//                 name="projectUrl"
//                 value={formData.projectUrl}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">GitHub URL</label>
//               <input
//                 type="url"
//                 name="githubUrl"
//                 value={formData.githubUrl}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Demo URL</label>
//               <input
//                 type="url"
//                 name="demoUrl"
//                 value={formData.demoUrl}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Location */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">Location</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Location</label>
//               <input
//                 type="text"
//                 name="location"
//                 value={formData.location}
//                 onChange={handleChange}
//                 placeholder="City, State"
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Country</label>
//               <input
//                 type="text"
//                 name="country"
//                 value={formData.country}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Budget */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">Budget</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Budget</label>
//               <input
//                 type="number"
//                 name="budget"
//                 value={formData.budget}
//                 onChange={handleChange}
//                 step="0.01"
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Currency</label>
//               <select
//                 name="currency"
//                 value={formData.currency}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg px-3 py-2"
//               >
//                 <option value="USD">USD</option>
//                 <option value="EUR">EUR</option>
//                 <option value="GBP">GBP</option>
//                 <option value="JPY">JPY</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Testimonial */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">Client Testimonial</h2>
          
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Testimonial</label>
//               <textarea
//                 name="clientTestimonial"
//                 value={formData.clientTestimonial}
//                 onChange={handleChange}
//                 rows="4"
//                 className="w-full border rounded-lg px-3 py-2"
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Author</label>
//                 <input
//                   type="text"
//                   name="testimonialAuthor"
//                   value={formData.testimonialAuthor}
//                   onChange={handleChange}
//                   className="w-full border rounded-lg px-3 py-2"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Position</label>
//                 <input
//                   type="text"
//                   name="testimonialPosition"
//                   value={formData.testimonialPosition}
//                   onChange={handleChange}
//                   className="w-full border rounded-lg px-3 py-2"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Media Upload */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-semibold mb-4">Media Files</h2>
          
//           <div>
//             <label className="block text-sm font-medium mb-2">
//               Upload Images/Videos/Documents
//             </label>
//             <input
//               type="file"
//               multiple
//               accept="image/*,video/*,.pdf,.doc,.docx"
//               onChange={handleFileChange}
//               className="w-full"
//             />
//             <p className="text-sm text-gray-500 mt-1">
//               Max 20 files. Images (10MB), Videos (100MB), Documents (20MB)
//             </p>
//           </div>

//           {mediaFiles.length > 0 && (
//             <div className="mt-4">
//               <h3 className="font-medium mb-2">Selected files:</h3>
//               <ul className="list-disc list-inside">
//                 {Array.from(mediaFiles).map((file, index) => (
//                   <li key={index} className="text-sm text-gray-600">
//                     {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>

//         {/* Submit Buttons */}
//         <div className="flex justify-end space-x-4">
//           <button
//             type="button"
//             onClick={() => navigate('/admin/projects')}
//             className="px-6 py-2 border rounded-lg hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
//           >
//             {loading ? 'Saving...' : id ? 'Update Project' : 'Create Project'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ProjectForm;
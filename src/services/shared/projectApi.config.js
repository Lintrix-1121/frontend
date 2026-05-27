export const API_ENDPOINTS = {
  // Public endpoints
  PROJECTS: {
    BASE: '/projects',
    FEATURED: '/projects/featured',
    BY_CATEGORY: '/projects/category',
    SEARCH: '/projects/search',
    STATS: '/projects/stats'
  },
  
  // Admin endpoints
  ADMIN: {
    PROJECTS: {
      CREATE: '/admin/projects',
      UPDATE: '/admin/projects',
      DELETE: '/admin/projects',
      MEDIA_UPLOAD: '/admin/projects',
      MEDIA_DELETE: '/admin/projects/media',
      CLONE: '/admin/projects',
      EXPORT: '/admin/projects'
    }
  },
  
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me'
  }
};

export const PROJECT_CATEGORIES = [
  { value: 'IoT', label: 'Internet of Things', icon: '📱' },
  { value: 'Electronics', label: 'Electronics', icon: '🔌' },
  { value: 'Mobile apps', label: 'Mobile Apps', icon: '📱' },
  { value: 'Web apps', label: 'Web Apps', icon: '💻' },
  { value: 'Installations', label: 'Installations', icon: '⚙️' },
  { value: 'Networking', label: 'Networking', icon: '🌐' },
  { value: 'Embedded Systems', label: 'Embedded Systems', icon: '🔧' },
  { value: 'Software Development', label: 'Software Development', icon: '💻' },
  { value: 'ICT Infrastructure', label: 'ICT Infrastructure', icon: '🏗️' },
  { value: 'Security Systems', label: 'Security Systems', icon: '🔒' },
  { value: 'Cloud Computing', label: 'Cloud Computing', icon: '☁️' },
  { value: 'AI/ML', label: 'AI/ML', icon: '🤖' },
  { value: 'Blockchain', label: 'Blockchain', icon: '🔗' },
  { value: 'Robotics', label: 'Robotics', icon: '🤖' },
  { value: 'Telecommunications', label: 'Telecommunications', icon: '📡' },
  { value: 'Data Center', label: 'Data Center', icon: '🏢' },
  { value: 'IT Consulting', label: 'IT Consulting', icon: '💼' },
  { value: 'Hardware Design', label: 'Hardware Design', icon: '🖥️' },
  { value: 'Firmware Development', label: 'Firmware Development', icon: '⚙️' },
  { value: 'System Integration', label: 'System Integration', icon: '🔄' }
];






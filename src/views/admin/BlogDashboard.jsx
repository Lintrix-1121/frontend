import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import useBlogStore from '../../stores/shared/blogStore';
import BlogController from '../../controllers/shared/blogController';
import BlogList from '../shared/BlogList';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import LoadingSpinner from '../../components/admin/LoadingSpinner';

const BlogDashboard = () => {
  // Store state
  const blogs = useBlogStore(state => state.blogs);
  const loading = useBlogStore(state => state.loading);
  const error = useBlogStore(state => state.error);
  const fetchBlogs = useBlogStore(state => state.fetchBlogs);
  
  // Getter methods using selector pattern
  const getPublishedBlogs = useBlogStore(state => state.getPublishedBlogs);
  const getDraftBlogs = useBlogStore(state => state.getDraftBlogs);
  const getFeaturedBlogs = useBlogStore(state => state.getFeaturedBlogs);
  const getRecentBlogs = useBlogStore(state => state.getRecentBlogs);
  const getMostViewedBlogs = useBlogStore(state => state.getMostViewedBlogs);
  const getMostLikedBlogs = useBlogStore(state => state.getMostLikedBlogs);
  const getBlogStatistics = useBlogStore(state => state.getBlogStatistics);
  
  const [stats, setStats] = useState(null);
  const [timeRange, setTimeRange] = useState('month'); // day, week, month, year
  const [activeView, setActiveView] = useState('overview'); // overview, analytics, performance

  useEffect(() => {
    loadData();
  }, []);


  const loadData = async () => {
  console.log('📥 [DASHBOARD] Starting data load...');
  
  try {
    // First, load blogs
    console.log('📚 [DASHBOARD] Fetching blogs...');
    const fetchResult = await fetchBlogs({ 
      status: 'published', 
      limit: 20,
      sortBy: 'publishedAt',
      sortOrder: 'DESC'
    });
    
    console.log('✅ [DASHBOARD] Blogs fetch result:', {
      success: fetchResult?.success,
      error: fetchResult?.error,
      dataLength: fetchResult?.data?.length,
      blogsInStore: blogs.length,
      fetchResult
    });
    
    // Then try to load statistics
    console.log('📊 [DASHBOARD] Loading statistics...');
    const statsResult = await BlogController.getBlogStatistics();
    
    console.log('📈 [DASHBOARD] Stats result:', {
      success: statsResult?.success,
      error: statsResult?.error,
      data: statsResult?.data,
      hasStats: !!statsResult?.data?.data
    });
    
    if (statsResult.success && statsResult.data?.data) {
      console.log('🎯 [DASHBOARD] Setting stats:', statsResult.data.data);
      setStats(statsResult.data.data);
    } else {
      console.error('❌ [DASHBOARD] Stats failed:', statsResult.error);
      // Create mock stats if real ones fail
      createMockStats();
    }
    
  } catch (error) {
    console.error('❌ [DASHBOARD] Error in loadData:', error);
    // Create mock stats on error
    createMockStats();
  }
};

// Create mock statistics if real ones fail
const createMockStats = () => {
  console.log('🔄 [DASHBOARD] Creating mock statistics');
  
  const mockStats = {
    totals: {
      all: blogs.length,
      published: getPublishedBlogs ? getPublishedBlogs().length : blogs.filter(b => b.status === 'published').length,
      draft: getDraftBlogs ? getDraftBlogs().length : blogs.filter(b => b.status === 'draft').length,
      featured: getFeaturedBlogs ? getFeaturedBlogs().length : blogs.filter(b => b.isFeatured && b.status === 'published').length
    },
    engagement: {
      totalViews: blogs.reduce((sum, blog) => sum + (blog.views || 0), 0),
      totalLikes: blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0),
      totalShares: blogs.reduce((sum, blog) => sum + (blog.shares || 0), 0),
      averageViews: blogs.length > 0 ? Math.round(blogs.reduce((sum, blog) => sum + (blog.views || 0), 0) / blogs.length) : 0
    }
  };
  
  console.log('🎯 [DASHBOARD] Mock stats created:', mockStats);
  setStats(mockStats);
};

  // const loadData = async () => {
  //   await fetchBlogs({ status: 'published', limit: 20 });
    
  //   const statsResult = await BlogController.getBlogStatistics();
  //   if (statsResult.success) {
  //     setStats(statsResult.data.data);
  //   }
  // };

  // Generate mock performance data for charts
  const performanceData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, index) => ({
      month,
      views: Math.floor(Math.random() * 10000) + 5000,
      likes: Math.floor(Math.random() * 1000) + 500,
      shares: Math.floor(Math.random() * 500) + 100,
      posts: Math.floor(Math.random() * 20) + 5
    }));
  }, []);

  // Prepare data for engagement chart
  const engagementData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: 'Views', value: stats.engagement.totalViews, color: '#4caf50' },
      { name: 'Likes', value: stats.engagement.totalLikes, color: '#f44336' },
      { name: 'Shares', value: stats.engagement.totalShares, color: '#2196f3' },
    ];
  }, [stats]);

  // Prepare data for post status chart
  const postStatusData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: 'Published', value: stats.totals.published, color: '#4caf50' },
      { name: 'Drafts', value: stats.totals.draft, color: '#ff9800' },
      { name: 'Featured', value: stats.totals.featured, color: '#9c27b0' },
    ];
  }, [stats]);

  // Generate category data (mock for now)
  const categoryData = [
    { category: 'Technology', posts: 15, views: 45000 },
    { category: 'Engineering', posts: 12, views: 38000 },
    { category: 'Innovation', posts: 8, views: 29000 },
    { category: 'Tutorials', posts: 10, views: 32000 },
    { category: 'Industry News', posts: 6, views: 18000 },
  ];

  // Helper function to get reading time text
  const getReadingTimeText = (blog) => {
    const minutes = blog.readingTime || Math.ceil((blog.content || '').split(/\s+/).length / 200);
    return `${minutes} min read`;
  };

  // Helper function to get relative time
  const getPublishedAtRelative = (blog) => {
    if (!blog.publishedAt) return '';
    const now = new Date();
    const pubDate = new Date(blog.publishedAt);
    const diffMs = now - pubDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  // Top performing posts - with null check
  const topPerformingPosts = useMemo(() => {
    const mostViewedBlogs = getMostViewedBlogs ? getMostViewedBlogs(5) : [];
    return mostViewedBlogs.map((blog, index) => ({
      ...blog,
      engagementScore: Math.round((blog.views * 0.4 + blog.likes * 0.3 + blog.shares * 0.3) / 10),
      performance: index === 0 ? 'high' : index < 3 ? 'medium' : 'low'
    }));
  }, [blogs, getMostViewedBlogs]);

  // Recent blogs with null check
  const recentBlogs = useMemo(() => {
    return getRecentBlogs ? getRecentBlogs(5) : [];
  }, [blogs, getRecentBlogs]);

  if (loading && !blogs.length)
    return <LoadingSpinner />;

  return (
    <div className="container-fluid py-4">
      {/* Dashboard Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 fw-bold mb-1">Blog Analytics Dashboard</h1>
              <p className="text-muted mb-0">Track performance, engagement, and content insights</p>
            </div>
            <div className="d-flex gap-2">
              <div className="btn-group">
                <button 
                  className={`btn btn-sm ${activeView === 'overview' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setActiveView('overview')}
                >
                  <i className="bi bi-speedometer2 me-1"></i> Overview
                </button>
                <button 
                  className={`btn btn-sm ${activeView === 'analytics' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setActiveView('analytics')}
                >
                  <i className="bi bi-graph-up me-1"></i> Analytics
                </button>
                <button 
                  className={`btn btn-sm ${activeView === 'performance' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setActiveView('performance')}
                >
                  <i className="bi bi-bar-chart me-1"></i> Performance
                </button>
              </div>
              <div className="btn-group">
                <button className="btn btn-outline-secondary btn-sm">
                  <i className="bi bi-download me-1"></i> Export
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview Cards */}
      {stats && (
        <div className="row mb-4">
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-start border-primary border-4 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted fw-normal mb-2">Total Posts</h6>
                    <h2 className="fw-bold text-primary">{stats.totals.all}</h2>
                    <div className="small text-muted">
                      <span className="text-success">
                        <i className="bi bi-arrow-up me-1"></i>12%
                      </span> from last month
                    </div>
                  </div>
                  <div className="bg-primary bg-opacity-10 p-3 rounded">
                    <i className="bi bi-journal-text text-primary fs-3"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-start border-success border-4 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted fw-normal mb-2">Total Views</h6>
                    <h2 className="fw-bold text-success">{stats.engagement.totalViews.toLocaleString()}</h2>
                    <div className="small text-muted">
                      <span className="text-success">
                        <i className="bi bi-arrow-up me-1"></i>18%
                      </span> from last month
                    </div>
                  </div>
                  <div className="bg-success bg-opacity-10 p-3 rounded">
                    <i className="bi bi-eye text-success fs-3"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-start border-danger border-4 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted fw-normal mb-2">Total Engagement</h6>
                    <h2 className="fw-bold text-danger">
                      {(stats.engagement.totalLikes + stats.engagement.totalShares).toLocaleString()}
                    </h2>
                    <div className="small text-muted">
                      <span className="text-success">
                        <i className="bi bi-arrow-up me-1"></i>24%
                      </span> from last month
                    </div>
                  </div>
                  <div className="bg-danger bg-opacity-10 p-3 rounded">
                    <i className="bi bi-heart text-danger fs-3"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-start border-warning border-4 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted fw-normal mb-2">Avg. Engagement</h6>
                    <h2 className="fw-bold text-warning">
                      {stats.engagement.averageViews.toLocaleString()}
                    </h2>
                    <div className="small text-muted">
                      Views per post • <span className="text-success">+8%</span>
                    </div>
                  </div>
                  <div className="bg-warning bg-opacity-10 p-3 rounded">
                    <i className="bi bi-graph-up-arrow text-warning fs-3"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Charts Section */}
      <div className="row mb-4">
        {/* Performance Trend Chart */}
        <div className="col-xl-8 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-bold">
                  <i className="bi bi-graph-up me-2 text-primary"></i>
                  Performance Trends
                </h6>
                <div className="btn-group btn-group-sm">
                  <button className={`btn ${timeRange === 'week' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setTimeRange('week')}>Week</button>
                  <button className={`btn ${timeRange === 'month' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setTimeRange('month')}>Month</button>
                  <button className={`btn ${timeRange === 'year' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setTimeRange('year')}>Year</button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    formatter={(value) => [value.toLocaleString(), '']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#4caf50" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Views"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="likes" 
                    stroke="#f44336" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Likes"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="shares" 
                    stroke="#2196f3" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Shares"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Engagement Distribution */}
        <div className="col-xl-4 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white py-3">
              <h6 className="mb-0 fw-bold">
                <i className="bi bi-pie-chart me-2 text-success"></i>
                Engagement Distribution
              </h6>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={engagementData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {engagementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value.toLocaleString(), 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Top Content & Categories */}
      <div className="row mb-4">
        {/* Top Performing Posts */}
        <div className="col-xl-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white py-3">
              <h6 className="mb-0 fw-bold">
                <i className="bi bi-trophy me-2 text-warning"></i>
                Top Performing Posts
              </h6>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Post</th>
                      <th>Views</th>
                      <th>Likes</th>
                      <th>Shares</th>
                      <th>Engagement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topPerformingPosts.map((blog) => (
                      <tr key={blog.blogId}>
                        <td className="ps-4">
                          <div className="d-flex align-items-center">
                            <div className="shrink-0 me-3">
                              {blog.featuredImageUrl ? (
                                <img
                                  src={blog.featuredImageUrl}
                                  alt={blog.title}
                                  className="rounded"
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                              ) : (
                                <div className="bg-light rounded d-flex align-items-center justify-content-center"
                                     style={{ width: '40px', height: '40px' }}>
                                  <i className="bi bi-journal-text text-muted"></i>
                                </div>
                              )}
                            </div>
                            <div className="grow">
                              <div className="fw-medium text-truncate" style={{ maxWidth: '200px' }}>
                                {blog.title}
                              </div>
                              <div className="text-muted small">{blog.authorName || 'Admin'}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <i className="bi bi-eye text-primary me-1"></i>
                            {blog.views?.toLocaleString() || '0'}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <i className="bi bi-heart text-danger me-1"></i>
                            {blog.likes?.toLocaleString() || '0'}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <i className="bi bi-share text-success me-1"></i>
                            {blog.shares?.toLocaleString() || '0'}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="progress grow me-2" style={{ height: '6px' }}>
                              <div 
                                className={`progress-bar bg-${blog.performance === 'high' ? 'success' : blog.performance === 'medium' ? 'warning' : 'danger'}`}
                                style={{ width: `${blog.engagementScore}%` }}
                              ></div>
                            </div>
                            <span className="fw-medium">{blog.engagementScore}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div className="col-xl-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white py-3">
              <h6 className="mb-0 fw-bold">
                <i className="bi bi-tags me-2 text-info"></i>
                Category Performance
              </h6>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="category" stroke="#666" />
                  <YAxis yAxisId="left" stroke="#666" />
                  <YAxis yAxisId="right" orientation="right" stroke="#666" />
                  <Tooltip 
                    formatter={(value, name) => [
                      value.toLocaleString(), 
                      name === 'posts' ? 'Posts' : 'Views'
                    ]}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="posts" fill="#8884d8" name="Posts" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="views" fill="#82ca9d" name="Views" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats & Actions */}
      <div className="row">
        {/* Post Status Overview */}
        <div className="col-xl-4 col-lg-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white py-3">
              <h6 className="mb-0 fw-bold">
                <i className="bi bi-clipboard-data me-2 text-primary"></i>
                Post Status
              </h6>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={postStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {postStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Posts']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="row text-center mt-3">
                {postStatusData.map((status, index) => (
                  <div key={index} className="col-4">
                    <div className="fw-bold" style={{ color: status.color }}>
                      {status.value}
                    </div>
                    <div className="text-muted small">{status.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-xl-4 col-lg-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white py-3">
              <h6 className="mb-0 fw-bold">
                <i className="bi bi-activity me-2 text-success"></i>
                Recent Activity
              </h6>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {recentBlogs.map((blog, index) => (
                  <div key={blog.blogId} className="list-group-item border-0 py-3">
                    <div className="d-flex align-items-center">
                      <div className="shrink-0 me-3">
                        <div className={`bg-${index === 0 ? 'primary' : index === 1 ? 'success' : 'info'} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center`}
                             style={{ width: '40px', height: '40px' }}>
                          <i className={`bi bi-${index === 0 ? 'star' : index === 1 ? 'eye' : 'heart'} text-${index === 0 ? 'primary' : index === 1 ? 'success' : 'info'}`}></i>
                        </div>
                      </div>
                      <div className="grow">
                        <div className="fw-medium">{blog.title}</div>
                        <div className="text-muted small">
                          Published {getPublishedAtRelative(blog)} • {blog.views?.toLocaleString() || '0'} views
                        </div>
                      </div>
                      <div className="shrink-0">
                        <span className="badge bg-light text-dark">
                          {getReadingTimeText(blog)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-xl-4 col-lg-12 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white py-3">
              <h6 className="mb-0 fw-bold">
                <i className="bi bi-lightning me-2 text-warning"></i>
                Quick Actions
              </h6>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <Link to="/admin/blog/create" className="btn btn-primary btn-lg">
                  <i className="bi bi-plus-circle me-2"></i>Create New Post
                </Link>
                <Link to="/admin/blog/manage" className="btn btn-outline-success">
                  <i className="bi bi-journal-text me-2"></i>Manage Posts
                </Link>
                <Link to="/blog/analytics" className="btn btn-outline-primary">
                  <i className="bi bi-graph-up me-2"></i>View Detailed Analytics
                </Link>
                <button className="btn btn-outline-warning">
                  <i className="bi bi-gear me-2"></i>Blog Settings
                </button>
              </div>
              
              <div className="mt-4">
                <h6 className="fw-bold mb-3">Performance Tips</h6>
                <div className="list-group list-group-flush">
                  <div className="list-group-item border-0 px-0 py-2">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Add featured images to increase views by 40%
                  </div>
                  <div className="list-group-item border-0 px-0 py-2">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Post during peak hours (9 AM - 11 AM)
                  </div>
                  <div className="list-group-item border-0 px-0 py-2">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Use 5-7 relevant tags for better discovery
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Footer */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 bg-light">
            <div className="card-body text-center py-3">
              <div className="d-flex justify-content-center align-items-center">
                <div className="me-3">
                  <i className="bi bi-info-circle text-primary"></i>
                </div>
                <div className="text-muted small">
                  Last updated: Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • 
                  Data refreshes every 30 minutes
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDashboard;


// import React, { useEffect, useState, useMemo } from 'react';
// import { Link } from 'react-router-dom';
// import useBlogStore from '../../stores/shared/blogStore';
// import BlogController from '../../controllers/shared/blogController';
// import BlogList from '../shared/BlogList';
// import { 
//   BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
//   XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
//   AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
// } from 'recharts';

// const BlogDashboard = () => {
//   const {
//     blogs,
//     loading,
//     error,
//     fetchBlogs,
//     getPublishedBlogs,
//     getDraftBlogs,
//     getFeaturedBlogs,
//     getRecentBlogs,
//     getMostViewedBlogs,
//     getMostLikedBlogs,
//     getBlogStatistics
//   } = useBlogStore();
  
//   const [stats, setStats] = useState(null);
//   const [timeRange, setTimeRange] = useState('month'); // day, week, month, year
//   const [activeView, setActiveView] = useState('overview'); // overview, analytics, performance

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     await fetchBlogs({ status: 'published', limit: 20 });
    
//     const statsResult = await BlogController.getBlogStatistics();
//     if (statsResult.success) {
//       setStats(statsResult.data.data);
//     }
//   };

//   // Generate mock performance data for charts
//   const performanceData = useMemo(() => {
//     const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//     return months.map((month, index) => ({
//       month,
//       views: Math.floor(Math.random() * 10000) + 5000,
//       likes: Math.floor(Math.random() * 1000) + 500,
//       shares: Math.floor(Math.random() * 500) + 100,
//       posts: Math.floor(Math.random() * 20) + 5
//     }));
//   }, []);

//   // Prepare data for engagement chart
//   const engagementData = useMemo(() => {
//     if (!stats) return [];
//     return [
//       { name: 'Views', value: stats.engagement.totalViews, color: '#4caf50' },
//       { name: 'Likes', value: stats.engagement.totalLikes, color: '#f44336' },
//       { name: 'Shares', value: stats.engagement.totalShares, color: '#2196f3' },
//     ];
//   }, [stats]);

//   // Prepare data for post status chart
//   const postStatusData = useMemo(() => {
//     if (!stats) return [];
//     return [
//       { name: 'Published', value: stats.totals.published, color: '#4caf50' },
//       { name: 'Drafts', value: stats.totals.draft, color: '#ff9800' },
//       { name: 'Featured', value: stats.totals.featured, color: '#9c27b0' },
//     ];
//   }, [stats]);

//   // Generate category data (mock for now)
//   const categoryData = [
//     { category: 'Technology', posts: 15, views: 45000 },
//     { category: 'Engineering', posts: 12, views: 38000 },
//     { category: 'Innovation', posts: 8, views: 29000 },
//     { category: 'Tutorials', posts: 10, views: 32000 },
//     { category: 'Industry News', posts: 6, views: 18000 },
//   ];

//   // Top performing posts
//   const topPerformingPosts = useMemo(() => {
//     return getMostViewedBlogs(5).map((blog, index) => ({
//       ...blog,
//       engagementScore: Math.round((blog.views * 0.4 + blog.likes * 0.3 + blog.shares * 0.3) / 10),
//       performance: index === 0 ? 'high' : index < 3 ? 'medium' : 'low'
//     }));
//   }, [blogs]);

//   if (loading && !blogs.length) {
//     return (
//       <div className="container py-5">
//         <div className="text-center">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-3 text-muted">Loading blog dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid py-4">
//       {/* Dashboard Header */}
//       <div className="row mb-4">
//         <div className="col-12">
//           <div className="d-flex justify-content-between align-items-center">
//             <div>
//               <h1 className="h3 fw-bold mb-1">Blog Analytics Dashboard</h1>
//               <p className="text-muted mb-0">Track performance, engagement, and content insights</p>
//             </div>
//             <div className="d-flex gap-2">
//               <div className="btn-group">
//                 <button 
//                   className={`btn btn-sm ${activeView === 'overview' ? 'btn-primary' : 'btn-outline-primary'}`}
//                   onClick={() => setActiveView('overview')}
//                 >
//                   <i className="bi bi-speedometer2 me-1"></i> Overview
//                 </button>
//                 <button 
//                   className={`btn btn-sm ${activeView === 'analytics' ? 'btn-primary' : 'btn-outline-primary'}`}
//                   onClick={() => setActiveView('analytics')}
//                 >
//                   <i className="bi bi-graph-up me-1"></i> Analytics
//                 </button>
//                 <button 
//                   className={`btn btn-sm ${activeView === 'performance' ? 'btn-primary' : 'btn-outline-primary'}`}
//                   onClick={() => setActiveView('performance')}
//                 >
//                   <i className="bi bi-bar-chart me-1"></i> Performance
//                 </button>
//               </div>
//               <div className="btn-group">
//                 <button className="btn btn-outline-secondary btn-sm">
//                   <i className="bi bi-download me-1"></i> Export
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stats Overview Cards */}
//       {stats && (
//         <div className="row mb-4">
//           <div className="col-xl-3 col-md-6 mb-4">
//             <div className="card border-start border-primary border-4 shadow-sm h-100">
//               <div className="card-body">
//                 <div className="d-flex justify-content-between align-items-center">
//                   <div>
//                     <h6 className="text-muted fw-normal mb-2">Total Posts</h6>
//                     <h2 className="fw-bold text-primary">{stats.totals.all}</h2>
//                     <div className="small text-muted">
//                       <span className="text-success">
//                         <i className="bi bi-arrow-up me-1"></i>12%
//                       </span> from last month
//                     </div>
//                   </div>
//                   <div className="bg-primary bg-opacity-10 p-3 rounded">
//                     <i className="bi bi-journal-text text-primary fs-3"></i>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div className="col-xl-3 col-md-6 mb-4">
//             <div className="card border-start border-success border-4 shadow-sm h-100">
//               <div className="card-body">
//                 <div className="d-flex justify-content-between align-items-center">
//                   <div>
//                     <h6 className="text-muted fw-normal mb-2">Total Views</h6>
//                     <h2 className="fw-bold text-success">{stats.engagement.totalViews.toLocaleString()}</h2>
//                     <div className="small text-muted">
//                       <span className="text-success">
//                         <i className="bi bi-arrow-up me-1"></i>18%
//                       </span> from last month
//                     </div>
//                   </div>
//                   <div className="bg-success bg-opacity-10 p-3 rounded">
//                     <i className="bi bi-eye text-success fs-3"></i>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div className="col-xl-3 col-md-6 mb-4">
//             <div className="card border-start border-danger border-4 shadow-sm h-100">
//               <div className="card-body">
//                 <div className="d-flex justify-content-between align-items-center">
//                   <div>
//                     <h6 className="text-muted fw-normal mb-2">Total Engagement</h6>
//                     <h2 className="fw-bold text-danger">
//                       {(stats.engagement.totalLikes + stats.engagement.totalShares).toLocaleString()}
//                     </h2>
//                     <div className="small text-muted">
//                       <span className="text-success">
//                         <i className="bi bi-arrow-up me-1"></i>24%
//                       </span> from last month
//                     </div>
//                   </div>
//                   <div className="bg-danger bg-opacity-10 p-3 rounded">
//                     <i className="bi bi-heart text-danger fs-3"></i>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div className="col-xl-3 col-md-6 mb-4">
//             <div className="card border-start border-warning border-4 shadow-sm h-100">
//               <div className="card-body">
//                 <div className="d-flex justify-content-between align-items-center">
//                   <div>
//                     <h6 className="text-muted fw-normal mb-2">Avg. Engagement</h6>
//                     <h2 className="fw-bold text-warning">
//                       {stats.engagement.averageViews.toLocaleString()}
//                     </h2>
//                     <div className="small text-muted">
//                       Views per post • <span className="text-success">+8%</span>
//                     </div>
//                   </div>
//                   <div className="bg-warning bg-opacity-10 p-3 rounded">
//                     <i className="bi bi-graph-up-arrow text-warning fs-3"></i>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Charts Section */}
//       <div className="row mb-4">
//         {/* Performance Trend Chart */}
//         <div className="col-xl-8 mb-4">
//           <div className="card shadow-sm h-100">
//             <div className="card-header bg-white py-3">
//               <div className="d-flex justify-content-between align-items-center">
//                 <h6 className="mb-0 fw-bold">
//                   <i className="bi bi-graph-up me-2 text-primary"></i>
//                   Performance Trends
//                 </h6>
//                 <div className="btn-group btn-group-sm">
//                   <button className={`btn ${timeRange === 'week' ? 'btn-primary' : 'btn-outline-primary'}`}
//                     onClick={() => setTimeRange('week')}>Week</button>
//                   <button className={`btn ${timeRange === 'month' ? 'btn-primary' : 'btn-outline-primary'}`}
//                     onClick={() => setTimeRange('month')}>Month</button>
//                   <button className={`btn ${timeRange === 'year' ? 'btn-primary' : 'btn-outline-primary'}`}
//                     onClick={() => setTimeRange('year')}>Year</button>
//                 </div>
//               </div>
//             </div>
//             <div className="card-body">
//               <ResponsiveContainer width="100%" height={300}>
//                 <LineChart data={performanceData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                   <XAxis dataKey="month" stroke="#666" />
//                   <YAxis stroke="#666" />
//                   <Tooltip 
//                     formatter={(value) => [value.toLocaleString(), '']}
//                     labelFormatter={(label) => `Month: ${label}`}
//                   />
//                   <Legend />
//                   <Line 
//                     type="monotone" 
//                     dataKey="views" 
//                     stroke="#4caf50" 
//                     strokeWidth={2}
//                     dot={{ r: 4 }}
//                     activeDot={{ r: 6 }}
//                     name="Views"
//                   />
//                   <Line 
//                     type="monotone" 
//                     dataKey="likes" 
//                     stroke="#f44336" 
//                     strokeWidth={2}
//                     dot={{ r: 4 }}
//                     name="Likes"
//                   />
//                   <Line 
//                     type="monotone" 
//                     dataKey="shares" 
//                     stroke="#2196f3" 
//                     strokeWidth={2}
//                     dot={{ r: 4 }}
//                     name="Shares"
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>

//         {/* Engagement Distribution */}
//         <div className="col-xl-4 mb-4">
//           <div className="card shadow-sm h-100">
//             <div className="card-header bg-white py-3">
//               <h6 className="mb-0 fw-bold">
//                 <i className="bi bi-pie-chart me-2 text-success"></i>
//                 Engagement Distribution
//               </h6>
//             </div>
//             <div className="card-body">
//               <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                   <Pie
//                     data={engagementData}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                     outerRadius={80}
//                     fill="#8884d8"
//                     dataKey="value"
//                   >
//                     {engagementData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip formatter={(value) => [value.toLocaleString(), 'Count']} />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Top Content & Categories */}
//       <div className="row mb-4">
//         {/* Top Performing Posts */}
//         <div className="col-xl-6 mb-4">
//           <div className="card shadow-sm h-100">
//             <div className="card-header bg-white py-3">
//               <h6 className="mb-0 fw-bold">
//                 <i className="bi bi-trophy me-2 text-warning"></i>
//                 Top Performing Posts
//               </h6>
//             </div>
//             <div className="card-body p-0">
//               <div className="table-responsive">
//                 <table className="table table-hover mb-0">
//                   <thead className="table-light">
//                     <tr>
//                       <th className="ps-4">Post</th>
//                       <th>Views</th>
//                       <th>Likes</th>
//                       <th>Shares</th>
//                       <th>Engagement</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {topPerformingPosts.map((blog) => (
//                       <tr key={blog.blogId}>
//                         <td className="ps-4">
//                           <div className="d-flex align-items-center">
//                             <div className="shrink-0 me-3">
//                               {blog.featuredImageUrl ? (
//                                 <img
//                                   src={blog.featuredImageUrl}
//                                   alt={blog.title}
//                                   className="rounded"
//                                   style={{ width: '40px', height: '40px', objectFit: 'cover' }}
//                                 />
//                               ) : (
//                                 <div className="bg-light rounded d-flex align-items-center justify-content-center"
//                                      style={{ width: '40px', height: '40px' }}>
//                                   <i className="bi bi-journal-text text-muted"></i>
//                                 </div>
//                               )}
//                             </div>
//                             <div className="grow">
//                               <div className="fw-medium text-truncate" style={{ maxWidth: '200px' }}>
//                                 {blog.title}
//                               </div>
//                               <div className="text-muted small">{blog.authorName}</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td>
//                           <div className="d-flex align-items-center">
//                             <i className="bi bi-eye text-primary me-1"></i>
//                             {blog.views.toLocaleString()}
//                           </div>
//                         </td>
//                         <td>
//                           <div className="d-flex align-items-center">
//                             <i className="bi bi-heart text-danger me-1"></i>
//                             {blog.likes.toLocaleString()}
//                           </div>
//                         </td>
//                         <td>
//                           <div className="d-flex align-items-center">
//                             <i className="bi bi-share text-success me-1"></i>
//                             {blog.shares.toLocaleString()}
//                           </div>
//                         </td>
//                         <td>
//                           <div className="d-flex align-items-center">
//                             <div className="progress grow me-2" style={{ height: '6px' }}>
//                               <div 
//                                 className={`progress-bar bg-${blog.performance === 'high' ? 'success' : blog.performance === 'medium' ? 'warning' : 'danger'}`}
//                                 style={{ width: `${blog.engagementScore}%` }}
//                               ></div>
//                             </div>
//                             <span className="fw-medium">{blog.engagementScore}</span>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Category Performance */}
//         <div className="col-xl-6 mb-4">
//           <div className="card shadow-sm h-100">
//             <div className="card-header bg-white py-3">
//               <h6 className="mb-0 fw-bold">
//                 <i className="bi bi-tags me-2 text-info"></i>
//                 Category Performance
//               </h6>
//             </div>
//             <div className="card-body">
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={categoryData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                   <XAxis dataKey="category" stroke="#666" />
//                   <YAxis yAxisId="left" stroke="#666" />
//                   <YAxis yAxisId="right" orientation="right" stroke="#666" />
//                   <Tooltip 
//                     formatter={(value, name) => [
//                       value.toLocaleString(), 
//                       name === 'posts' ? 'Posts' : 'Views'
//                     ]}
//                   />
//                   <Legend />
//                   <Bar yAxisId="left" dataKey="posts" fill="#8884d8" name="Posts" radius={[4, 4, 0, 0]} />
//                   <Bar yAxisId="right" dataKey="views" fill="#82ca9d" name="Views" radius={[4, 4, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Quick Stats & Actions */}
//       <div className="row">
//         {/* Post Status Overview */}
//         <div className="col-xl-4 col-lg-6 mb-4">
//           <div className="card shadow-sm h-100">
//             <div className="card-header bg-white py-3">
//               <h6 className="mb-0 fw-bold">
//                 <i className="bi bi-clipboard-data me-2 text-primary"></i>
//                 Post Status
//               </h6>
//             </div>
//             <div className="card-body">
//               <ResponsiveContainer width="100%" height={200}>
//                 <PieChart>
//                   <Pie
//                     data={postStatusData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={80}
//                     paddingAngle={5}
//                     dataKey="value"
//                   >
//                     {postStatusData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip formatter={(value) => [value, 'Posts']} />
//                 </PieChart>
//               </ResponsiveContainer>
//               <div className="row text-center mt-3">
//                 {postStatusData.map((status, index) => (
//                   <div key={index} className="col-4">
//                     <div className="fw-bold" style={{ color: status.color }}>
//                       {status.value}
//                     </div>
//                     <div className="text-muted small">{status.name}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Recent Activity */}
//         <div className="col-xl-4 col-lg-6 mb-4">
//           <div className="card shadow-sm h-100">
//             <div className="card-header bg-white py-3">
//               <h6 className="mb-0 fw-bold">
//                 <i className="bi bi-activity me-2 text-success"></i>
//                 Recent Activity
//               </h6>
//             </div>
//             <div className="card-body p-0">
//               <div className="list-group list-group-flush">
//                 {getRecentBlogs(5).map((blog, index) => (
//                   <div key={blog.blogId} className="list-group-item border-0 py-3">
//                     <div className="d-flex align-items-center">
//                       <div className="shrink-0 me-3">
//                         <div className={`bg-${index === 0 ? 'primary' : index === 1 ? 'success' : 'info'} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center`}
//                              style={{ width: '40px', height: '40px' }}>
//                           <i className={`bi bi-${index === 0 ? 'star' : index === 1 ? 'eye' : 'heart'} text-${index === 0 ? 'primary' : index === 1 ? 'success' : 'info'}`}></i>
//                         </div>
//                       </div>
//                       <div className="grow">
//                         <div className="fw-medium">{blog.title}</div>
//                         <div className="text-muted small">
//                           Published {blog.publishedAtRelative} • {blog.views.toLocaleString()} views
//                         </div>
//                       </div>
//                       <div className="shrink-0">
//                         <span className="badge bg-light text-dark">
//                           {/* {blog.getReadingTimeText()} */}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="col-xl-4 col-lg-12 mb-4">
//           <div className="card shadow-sm h-100">
//             <div className="card-header bg-white py-3">
//               <h6 className="mb-0 fw-bold">
//                 <i className="bi bi-lightning me-2 text-warning"></i>
//                 Quick Actions
//               </h6>
//             </div>
//             <div className="card-body">
//               <div className="d-grid gap-2">
//                 <Link to="/admin/blog/create" className="btn btn-primary btn-lg">
//                   <i className="bi bi-plus-circle me-2"></i>Create New Post
//                 </Link>
//                 <Link to="/admin/blog/manage" className="btn btn-outline-success">
//                   <i className="bi bi-journal-text me-2"></i>Manage Posts
//                 </Link>
//                 <Link to="/blog/analytics" className="btn btn-outline-primary">
//                   <i className="bi bi-graph-up me-2"></i>View Detailed Analytics
//                 </Link>
//                 <button className="btn btn-outline-warning">
//                   <i className="bi bi-gear me-2"></i>Blog Settings
//                 </button>
//               </div>
              
//               <div className="mt-4">
//                 <h6 className="fw-bold mb-3">Performance Tips</h6>
//                 <div className="list-group list-group-flush">
//                   <div className="list-group-item border-0 px-0 py-2">
//                     <i className="bi bi-check-circle text-success me-2"></i>
//                     Add featured images to increase views by 40%
//                   </div>
//                   <div className="list-group-item border-0 px-0 py-2">
//                     <i className="bi bi-check-circle text-success me-2"></i>
//                     Post during peak hours (9 AM - 11 AM)
//                   </div>
//                   <div className="list-group-item border-0 px-0 py-2">
//                     <i className="bi bi-check-circle text-success me-2"></i>
//                     Use 5-7 relevant tags for better discovery
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Dashboard Footer */}
//       <div className="row mt-4">
//         <div className="col-12">
//           <div className="card border-0 bg-light">
//             <div className="card-body text-center py-3">
//               <div className="d-flex justify-content-center align-items-center">
//                 <div className="me-3">
//                   <i className="bi bi-info-circle text-primary"></i>
//                 </div>
//                 <div className="text-muted small">
//                   Last updated: Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • 
//                   Data refreshes every 30 minutes
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogDashboard;





import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Badge,
  Spinner,
  Alert,
  InputGroup,
  Dropdown,
  DropdownButton,
} from 'react-bootstrap';
import useProjectStore from '../../stores/shared/projectStore';
import ProjectCard from '../../components/projects/ProjectCard';
import Pagination from '../../components/admin/Pagination';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import ErrorMessage from '../../components/projects/ErrorMessage';

const Projects = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    projects,
    loading,
    error,
    pagination,
    filters,
    fetchProjects,
    setFilters,
    setPage,
    clearCurrentProject,
  } = useProjectStore();

  // Local state for filter inputs (to avoid instant store updates)
  const [localFilters, setLocalFilters] = useState({
    category: searchParams.get('category') || '',
    status: searchParams.get('status') || '',
    priority: searchParams.get('priority') || '',
    featured: searchParams.get('featured') || '',
    search: searchParams.get('search') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'DESC',
  });

  const [showFilters, setShowFilters] = useState(false);

  // Sync URL params with store on mount and URL changes
  useEffect(() => {
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    const priority = searchParams.get('priority') || '';
    const featured = searchParams.get('featured') || '';
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'DESC';
    const page = parseInt(searchParams.get('page')) || 1;

    // Update local filters
    setLocalFilters({ category, status, priority, featured, search, sortBy, sortOrder });

    // Update store filters (will trigger fetch)
    const storeFilters = { category, status, priority, featured, search, sortBy, sortOrder };
    setFilters(storeFilters);
    if (page !== pagination.currentPage) {
      setPage(page);
    } else {
      // Only fetch if not already loading or if filters changed
      fetchProjects({ ...storeFilters, page });
    }

    // Cleanup
    return () => clearCurrentProject();
  }, [searchParams]);

  // Handle filter form submission
  const applyFilters = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(localFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSortChange = (sortBy, sortOrder) => {
    setLocalFilters((prev) => ({ ...prev, sortBy, sortOrder }));
    const params = new URLSearchParams(searchParams);
    params.set('sortBy', sortBy);
    params.set('sortOrder', sortOrder);
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    setSearchParams(params);
  };

  const clearFilters = () => {
    setLocalFilters({
      category: '',
      status: '',
      priority: '',
      featured: '',
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'DESC',
    });
    setSearchParams(new URLSearchParams());
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="align-items-center mb-4">
        <Col>
          <h1 className="h2 mb-0">📂 Our Projects</h1>
          <p className="text-muted">
            {pagination.total > 0
              ? `Showing ${projects.length} of ${pagination.total} projects`
              : 'No projects found'}
          </p>
        </Col>
        <Col xs="auto">
          <Button
            variant="outline-primary"
            onClick={() => setShowFilters(!showFilters)}
            className="me-2"
          >
            {showFilters ? 'Hide Filters' : 'Filters'}
          </Button>
          <DropdownButton
            variant="outline-secondary"
            title={`Sort: ${localFilters.sortBy} ${localFilters.sortOrder}`}
            id="sort-dropdown"
          >
            <Dropdown.Item onClick={() => handleSortChange('createdAt', 'DESC')}>
              Newest First
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSortChange('createdAt', 'ASC')}>
              Oldest First
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSortChange('title', 'ASC')}>
              Title A–Z
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSortChange('title', 'DESC')}>
              Title Z–A
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSortChange('views', 'DESC')}>
              Most Viewed
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSortChange('likes', 'DESC')}>
              Most Liked
            </Dropdown.Item>
          </DropdownButton>
        </Col>
      </Row>

      {/* Filter Panel */}
      {showFilters && (
        <Row className="mb-4">
          <Col>
            <Form onSubmit={applyFilters} className="bg-light p-3 rounded shadow-sm">
              <Row className="g-3 align-items-end">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Search</Form.Label>
                    <Form.Control
                      type="text"
                      name="search"
                      value={localFilters.search}
                      onChange={handleInputChange}
                      placeholder="Search projects..."
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      name="category"
                      value={localFilters.category}
                      onChange={handleInputChange}
                    >
                      <option value="">All Categories</option>
                      <option value="IoT">IoT</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Mobile apps">Mobile Apps</option>
                      <option value="Web apps">Web Apps</option>
                      <option value="Installations">Installations</option>
                      <option value="Networking">Networking</option>
                      <option value="Embedded Systems">Embedded Systems</option>
                      <option value="Software Development">Software Development</option>
                      <option value="ICT Infrastructure">ICT Infrastructure</option>
                      <option value="Security Systems">Security Systems</option>
                      <option value="Cloud Computing">Cloud Computing</option>
                      <option value="AI/ML">AI/ML</option>
                      <option value="Blockchain">Blockchain</option>
                      <option value="Robotics">Robotics</option>
                      <option value="Telecommunications">Telecommunications</option>
                      <option value="Data Center">Data Center</option>
                      <option value="IT Consulting">IT Consulting</option>
                      <option value="Hardware Design">Hardware Design</option>
                      <option value="Firmware Development">Firmware Development</option>
                      <option value="System Integration">System Integration</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={localFilters.status}
                      onChange={handleInputChange}
                    >
                      <option value="">All Statuses</option>
                      <option value="planned">Planned</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="on-hold">On Hold</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="maintenance">Maintenance</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label>Priority</Form.Label>
                    <Form.Select
                      name="priority"
                      value={localFilters.priority}
                      onChange={handleInputChange}
                    >
                      <option value="">All</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={1}>
                  <Form.Group>
                    <Form.Label>Featured</Form.Label>
                    <Form.Select
                      name="featured"
                      value={localFilters.featured}
                      onChange={handleInputChange}
                    >
                      <option value="">All</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2} className="d-flex gap-2">
                  <Button variant="primary" type="submit" className="w-100">
                    Apply
                  </Button>
                  <Button variant="outline-secondary" onClick={clearFilters}>
                    Clear
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      )}

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Row className="justify-content-center">
          <Col md={6} className="text-center py-5">
            <Alert variant="info">
              <h5>No projects match your criteria</h5>
              <p className="mb-0">Try adjusting the filters above.</p>
            </Alert>
          </Col>
        </Row>
      ) : (
        <>
          <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
            {projects.map((project) => (
              <Col key={project.projectId}>
                <ProjectCard project={project} />
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Row className="mt-4">
              <Col>
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </Col>
            </Row>
          )}
        </>
      )}
    </Container>
  );
};

export default Projects;


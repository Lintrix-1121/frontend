import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Table, Badge } from 'react-bootstrap';
import { useProjectStore } from '../../stores/shared/projectStore';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import ErrorMessage from '../../components/projects/ErrorMessage';

const ProjectDashboard = () => {
  const { projects, loading, error, fetchProjects, fetchProjectStats, projectStats } = useProjectStore();

  useEffect(() => {
    fetchProjects({ limit: 5, sortBy: 'createdAt', sortOrder: 'DESC' });
    fetchProjectStats();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const { totals, engagement, byStatus, byCategory } = projectStats || {};

  return (
    <Container fluid className="py-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h1 className="h2 mb-0">📊 Project Dashboard</h1>
        </Col>
        <Col xs="auto">
          <Button as={Link} to="/admin/projects/new" variant="primary">
            + New Project
          </Button>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={3} sm={6}>
          <Card className="h-100 text-white bg-primary">
            <Card.Body>
              <Card.Title as="h6" className="text-white-50">Total Projects</Card.Title>
              <Card.Text as="h2" className="mb-0">{totals?.all || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="h-100 text-white bg-success">
            <Card.Body>
              <Card.Title as="h6" className="text-white-50">Published</Card.Title>
              <Card.Text as="h2" className="mb-0">{totals?.published || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="h-100 text-white bg-warning">
            <Card.Body>
              <Card.Title as="h6" className="text-white-50">Featured</Card.Title>
              <Card.Text as="h2" className="mb-0">{totals?.featured || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="h-100 text-white bg-info">
            <Card.Body>
              <Card.Title as="h6" className="text-white-50">Total Views</Card.Title>
              <Card.Text as="h2" className="mb-0">{engagement?.totalViews?.toLocaleString() || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Stats: Status & Category */}
      <Row className="g-4 mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>Status Distribution</Card.Header>
            <Card.Body>
              {byStatus && Object.entries(byStatus).map(([status, count]) => (
                <div key={status} className="d-flex justify-content-between align-items-center mb-2">
                  <Badge bg={status === 'completed' ? 'success' : status === 'in-progress' ? 'primary' : 'secondary'}>
                    {status}
                  </Badge>
                  <span>{count}</span>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>Top Categories</Card.Header>
            <Card.Body>
              {byCategory && Object.entries(byCategory)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([cat, count]) => (
                  <div key={cat} className="d-flex justify-content-between align-items-center mb-2">
                    <span>{cat}</span>
                    <Badge bg="secondary">{count}</Badge>
                  </div>
                ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Projects Table */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">Recent Projects</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover striped className="mb-0">
            <thead>
              <tr>
                <th>Project</th>
                <th>Category</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Views</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project.projectId}>
                  <td>
                    <div className="d-flex align-items-center">
                      {project.featuredImage ? (
                        <img src={project.featuredImage} alt={project.title} width="40" height="40" className="rounded me-2" />
                      ) : (
                        <div className="bg-light rounded me-2" style={{ width: 40, height: 40 }}>📁</div>
                      )}
                      <div>
                        <div className="fw-bold">{project.title}</div>
                        <small className="text-muted">{project.clientName}</small>
                      </div>
                    </div>
                  </td>
                  <td>{project.category}</td>
                  <td>
                    <Badge bg={
                      project.status === 'completed' ? 'success' :
                      project.status === 'in-progress' ? 'primary' :
                      project.status === 'planned' ? 'secondary' :
                      project.status === 'on-hold' ? 'warning' :
                      project.status === 'cancelled' ? 'danger' : 'info'
                    }>
                      {project.status}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={
                      project.priority === 'critical' ? 'danger' :
                      project.priority === 'high' ? 'warning' :
                      project.priority === 'medium' ? 'info' : 'secondary'
                    }>
                      {project.priority}
                    </Badge>
                  </td>
                  <td>{project.views || 0}</td>
                  <td>
                    <Button as={Link} to={`/admin/projects/edit/${project.projectId}`} size="sm" variant="outline-primary" className="me-1">Edit</Button>
                    <Button as={Link} to={`/admin/projects/${project.projectId}`} size="sm" variant="outline-info" className="me-1">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProjectDashboard;
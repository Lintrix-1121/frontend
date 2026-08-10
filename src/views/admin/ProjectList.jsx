import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Button, Badge, Form, Pagination, Modal } from 'react-bootstrap';
import { useProjectStore } from '../../stores/shared/projectStore';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import ErrorMessage from '../../components/projects/ErrorMessage';
import toast from 'react-hot-toast';

const ProjectList = () => {
  const { projects, loading, error, pagination, fetchProjects, deleteProject, setPage, setFilters } = useProjectStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteType, setDeleteType] = useState('soft');

  useEffect(() => {
    fetchProjects({ limit: 10 });
  }, []);

  const handleDeleteClick = (project) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (selectedProject) {
      await deleteProject(selectedProject.projectId, deleteType === 'permanent');
      setShowDeleteModal(false);
      setSelectedProject(null);
      toast.success('Project deleted');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ [name]: value || null });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Container fluid className="py-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h1 className="h2 mb-0">Projects</h1>
        </Col>
        <Col xs="auto">
          <Button as={Link} to="/admin/projects/new" variant="primary">+ New Project</Button>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Select name="category" onChange={handleFilterChange}>
                  <option value="">All</option>
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
            <Col md={3}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select name="status" onChange={handleFilterChange}>
                  <option value="">All</option>
                  <option value="planned">Planned</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="maintenance">Maintenance</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Priority</Form.Label>
                <Form.Select name="priority" onChange={handleFilterChange}>
                  <option value="">All</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Featured</Form.Label>
                <Form.Select name="featured" onChange={handleFilterChange}>
                  <option value="">All</option>
                  <option value="true">Featured</option>
                  <option value="false">Not Featured</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Table */}
      <Card>
        <Card.Body className="p-0">
          <Table responsive hover striped className="mb-0">
            <thead>
              <tr>
                <th>Project</th>
                <th>Category</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Views</th>
                <th>Created</th>
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
                  <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Button as={Link} to={`/admin/projects/${project.projectId}`} size="sm" variant="outline-info" className="me-1">View</Button>
                    <Button as={Link} to={`/admin/projects/edit/${project.projectId}`} size="sm" variant="outline-primary" className="me-1">Edit</Button>
                    <Button size="sm" variant="outline-danger" onClick={() => handleDeleteClick(project)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
        {pagination.totalPages > 1 && (
          <Card.Footer>
            <Pagination className="mb-0 justify-content-center">
              <Pagination.Prev onClick={() => setPage(pagination.currentPage - 1)} disabled={pagination.currentPage === 1} />
              {[...Array(pagination.totalPages).keys()].map(num => (
                <Pagination.Item key={num + 1} active={num + 1 === pagination.currentPage} onClick={() => setPage(num + 1)}>
                  {num + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => setPage(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.totalPages} />
            </Pagination>
          </Card.Footer>
        )}
      </Card>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete "<strong>{selectedProject?.title}</strong>"?</p>
          <Form.Group>
            <Form.Check
              type="radio"
              label="Soft delete (move to trash)"
              name="deleteType"
              value="soft"
              checked={deleteType === 'soft'}
              onChange={() => setDeleteType('soft')}
            />
            <Form.Check
              type="radio"
              label="Permanently delete (cannot be undone)"
              name="deleteType"
              value="permanent"
              checked={deleteType === 'permanent'}
              onChange={() => setDeleteType('permanent')}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProjectList;



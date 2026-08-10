import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, Carousel, Tabs, Tab, Table, Alert } from 'react-bootstrap';
import useProjectStore from '../../stores/shared/projectStore';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import ErrorMessage from '../../components/projects/ErrorMessage';
import toast from 'react-hot-toast';

const ProjectDetails = () => {
  const { id } = useParams();
  const { currentProject, relatedProjects, timelineData, loading, error, fetchProject, fetchRelatedProjects, fetchProjectTimeline, clearCurrentProject } = useProjectStore();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      fetchProject(id);
      fetchRelatedProjects(id);
      fetchProjectTimeline(id);
    }
    return () => clearCurrentProject();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!currentProject) return <Alert variant="warning">Project not found</Alert>;

  const project = currentProject;

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <Button as={Link} to="/admin/projects" variant="outline-secondary" className="mb-3">← Back to Projects</Button>
          <h1 className="h2">{project.title}</h1>
          <div className="d-flex flex-wrap gap-2 mt-2">
            <Badge bg="secondary">{project.category}</Badge>
            <Badge bg={
              project.status === 'completed' ? 'success' :
              project.status === 'in-progress' ? 'primary' :
              project.status === 'planned' ? 'secondary' :
              project.status === 'on-hold' ? 'warning' :
              project.status === 'cancelled' ? 'danger' : 'info'
            }>
              {project.status}
            </Badge>
            <Badge bg={
              project.priority === 'critical' ? 'danger' :
              project.priority === 'high' ? 'warning' :
              project.priority === 'medium' ? 'info' : 'secondary'
            }>
              {project.priority}
            </Badge>
            {project.isFeatured && <Badge bg="warning">Featured</Badge>}
            {project.isPublished ? <Badge bg="success">Published</Badge> : <Badge bg="secondary">Draft</Badge>}
            {project.isConfidential && <Badge bg="danger">Confidential</Badge>}
          </div>
        </Col>
        <Col xs="auto">
          <Button as={Link} to={`/admin/projects/edit/${project.projectId}`} variant="primary" className="me-2">Edit</Button>
          <Button variant="outline-info" className="me-2" onClick={async () => {
            const newTitle = prompt('Enter new title for clone:', `Copy of ${project.title}`);
            if (newTitle) {
              const user = JSON.parse(localStorage.getItem('user') || '{}');
              const result = await useProjectStore.getState().cloneProject(project.projectId, newTitle, user.userId);
              if (result.success) toast.success('Project cloned');
              else toast.error('Clone failed');
            }
          }}>Clone</Button>
          <Button variant="outline-secondary" onClick={async () => {
            const result = await useProjectStore.getState().exportProject(project.projectId, 'json');
            if (result.success) {
              const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `project-${project.projectId}.json`;
              a.click();
            } else toast.error('Export failed');
          }}>Export JSON</Button>
        </Col>
      </Row>

      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
        <Tab eventKey="overview" title="Overview">
          <Row>
            <Col lg={8}>
              <Card className="mb-4">
                <Card.Body>
                  <h5>Description</h5>
                  <p>{project.fullDescription}</p>
                  {project.challenge && (
                    <>
                      <h5>Challenge</h5>
                      <p>{project.challenge}</p>
                    </>
                  )}
                  {project.solution && (
                    <>
                      <h5>Solution</h5>
                      <p>{project.solution}</p>
                    </>
                  )}
                  {project.results && (
                    <>
                      <h5>Results</h5>
                      <p>{project.results}</p>
                    </>
                  )}
                </Card.Body>
              </Card>

              {project.media && project.media.length > 0 && (
                <Card className="mb-4">
                  <Card.Header>Media Gallery</Card.Header>
                  <Card.Body>
                    <Carousel>
                      {project.media.map((media, idx) => (
                        <Carousel.Item key={idx}>
                          {media.mediaType === 'image' ? (
                            <img src={media.mediaUrl} className="d-block w-100" alt={media.title || 'Project media'} style={{ maxHeight: '400px', objectFit: 'contain' }} />
                          ) : media.mediaType === 'video' ? (
                            <video controls className="d-block w-100" style={{ maxHeight: '400px' }}>
                              <source src={media.mediaUrl} type={media.mimeType} />
                            </video>
                          ) : (
                            <div className="text-center p-5 bg-light">
                              <a href={media.mediaUrl} target="_blank" rel="noopener noreferrer">{media.fileName}</a>
                            </div>
                          )}
                          {media.title && <Carousel.Caption><h5>{media.title}</h5></Carousel.Caption>}
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  </Card.Body>
                </Card>
              )}

              {project.milestones && project.milestones.length > 0 && (
                <Card className="mb-4">
                  <Card.Header>Milestones</Card.Header>
                  <Card.Body>
                    <ul className="list-group">
                      {project.milestones.map((m, idx) => (
                        <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <strong>{m.title}</strong> - {m.date}
                            {m.description && <span className="text-muted ms-2">({m.description})</span>}
                          </div>
                          <Badge bg={m.status === 'completed' ? 'success' : 'warning'}>{m.status || 'pending'}</Badge>
                        </li>
                      ))}
                    </ul>
                  </Card.Body>
                </Card>
              )}
            </Col>

            <Col lg={4}>
              <Card className="mb-4">
                <Card.Header>Details</Card.Header>
                <Card.Body>
                  <p><strong>Client:</strong> {project.clientName || 'N/A'}</p>
                  <p><strong>Industry:</strong> {project.clientIndustry || 'N/A'}</p>
                  <p><strong>Sub Category:</strong> {project.subCategory || 'N/A'}</p>
                  <p><strong>Team Size:</strong> {project.teamSize || 'N/A'}</p>
                  <p><strong>Duration:</strong> {project.projectDuration || 'N/A'}</p>
                  <p><strong>Start:</strong> {project.formattedStartDate}</p>
                  <p><strong>End:</strong> {project.formattedEndDate}</p>
                  <p><strong>Budget:</strong> {project.formattedBudget}</p>
                  <p><strong>ROI:</strong> {project.roi || 'N/A'}</p>
                  <p><strong>Completion:</strong> {project.completionPercentage}%</p>
                  <p><strong>Views:</strong> {project.views}</p>
                  <p><strong>Likes:</strong> {project.likes}</p>
                  <p><strong>Shares:</strong> {project.shares}</p>
                  <p><strong>Location:</strong> {project.location || 'N/A'}</p>
                  <p><strong>Country:</strong> {project.country || 'N/A'}</p>
                </Card.Body>
              </Card>

              {project.technologies && project.technologies.length > 0 && (
                <Card className="mb-4">
                  <Card.Header>Technologies</Card.Header>
                  <Card.Body>
                    {project.technologies.map(tech => (
                      <Badge bg="secondary" className="me-1 mb-1" key={tech}>{tech}</Badge>
                    ))}
                  </Card.Body>
                </Card>
              )}

              {project.tags && project.tags.length > 0 && (
                <Card className="mb-4">
                  <Card.Header>Tags</Card.Header>
                  <Card.Body>
                    {project.tags.map(tag => (
                      <Badge bg="info" className="me-1 mb-1" key={tag}>{tag}</Badge>
                    ))}
                  </Card.Body>
                </Card>
              )}

              {project.kpis && Object.keys(project.kpis).length > 0 && (
                <Card className="mb-4">
                  <Card.Header>KPIs</Card.Header>
                  <Card.Body>
                    <Table size="sm">
                      <tbody>
                        {Object.entries(project.kpis).map(([key, value]) => (
                          <tr key={key}>
                            <td>{key}</td>
                            <td>{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="timeline" title="Timeline">
          {timelineData ? (
            <Row>
              <Col lg={6}>
                <Card>
                  <Card.Header>Project Timeline</Card.Header>
                  <Card.Body>
                    <p><strong>Start:</strong> {timelineData.project.startDate}</p>
                    <p><strong>End:</strong> {timelineData.project.endDate}</p>
                    <p><strong>Status:</strong> {timelineData.project.status}</p>
                    <p><strong>Progress:</strong> {timelineData.project.completionPercentage}%</p>
                    <div className="progress mb-3">
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${timelineData.project.completionPercentage}%` }}
                        aria-valuenow={timelineData.project.completionPercentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        {timelineData.project.completionPercentage}%
                      </div>
                    </div>
                    <h6>Duration: {timelineData.duration}</h6>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6}>
                <Card>
                  <Card.Header>Milestones Progress</Card.Header>
                  <Card.Body>
                    {timelineData.milestones && timelineData.milestones.length > 0 ? (
                      <ul className="list-group">
                        {timelineData.milestones.map((m, idx) => (
                          <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                            {m.title}
                            <Badge bg={m.status === 'completed' ? 'success' : 'warning'}>{m.status || 'pending'}</Badge>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No milestones defined.</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ) : (
            <Alert variant="info">No timeline data available.</Alert>
          )}
        </Tab>

        <Tab eventKey="related" title="Related Projects">
          {relatedProjects && relatedProjects.length > 0 ? (
            <Row xs={1} md={2} lg={3} className="g-4">
              {relatedProjects.map(rel => (
                <Col key={rel.projectId}>
                  <Card>
                    <Card.Img variant="top" src={rel.featuredImage || 'https://via.placeholder.com/300x200'} style={{ height: '200px', objectFit: 'cover' }} />
                    <Card.Body>
                      <Card.Title>{rel.title}</Card.Title>
                      <Card.Text>
                        <Badge bg="secondary">{rel.category}</Badge>
                      </Card.Text>
                      <Button as={Link} to={`/admin/projects/${rel.projectId}`} variant="outline-primary" size="sm">View</Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Alert variant="info">No related projects found.</Alert>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default ProjectDetails;



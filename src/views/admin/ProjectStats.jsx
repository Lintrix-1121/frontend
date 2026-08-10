import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Table } from 'react-bootstrap';
import useProjectStore from '../../stores/shared/projectStore';
import LoadingSpinner from '../../components/admin/LoadingSpinner';
import ErrorMessage from '../../components/projects/ErrorMessage';

const ProjectStats = () => {
  const { projectStats, loading, error, fetchProjectStats } = useProjectStore();

  useEffect(() => {
    fetchProjectStats();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!projectStats) return null;

  const { totals, byStatus, byCategory, engagement, recentProjects, topPerformers } = projectStats;

  return (
    <Container fluid className="py-4">
      <h1 className="h2 mb-4">📈 Project Statistics</h1>

      {/* Summary Cards */}
      <Row className="g-4 mb-4">
        <Col md={3} sm={6}>
          <Card className="text-white bg-primary h-100">
            <Card.Body>
              <Card.Title as="h6" className="text-white-50">Total Projects</Card.Title>
              <Card.Text as="h2" className="mb-0">{totals?.all || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="text-white bg-success h-100">
            <Card.Body>
              <Card.Title as="h6" className="text-white-50">Published</Card.Title>
              <Card.Text as="h2" className="mb-0">{totals?.published || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="text-white bg-warning h-100">
            <Card.Body>
              <Card.Title as="h6" className="text-white-50">Featured</Card.Title>
              <Card.Text as="h2" className="mb-0">{totals?.featured || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="text-white bg-info h-100">
            <Card.Body>
              <Card.Title as="h6" className="text-white-50">Total Views</Card.Title>
              <Card.Text as="h2" className="mb-0">{engagement?.totalViews?.toLocaleString() || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Engagement & Distributions */}
      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card>
            <Card.Header>Engagement</Card.Header>
            <Card.Body>
              <p><strong>Total Likes:</strong> {engagement?.totalLikes?.toLocaleString() || 0}</p>
              <p><strong>Total Shares:</strong> {engagement?.totalShares?.toLocaleString() || 0}</p>
              <p><strong>Average Views:</strong> {engagement?.averageViews?.toLocaleString() || 0}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>Status Distribution</Card.Header>
            <Card.Body>
              {byStatus && Object.entries(byStatus).map(([status, count]) => (
                <div key={status} className="d-flex justify-content-between mb-2">
                  <Badge bg={
                    status === 'completed' ? 'success' :
                    status === 'in-progress' ? 'primary' :
                    status === 'planned' ? 'secondary' :
                    status === 'on-hold' ? 'warning' :
                    status === 'cancelled' ? 'danger' : 'info'
                  }>
                    {status}
                  </Badge>
                  <span>{count} ({totals?.all ? ((count/totals.all)*100).toFixed(1) : 0}%)</span>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>Priority Distribution</Card.Header>
            <Card.Body>
              {projectStats.priorityStats && Object.entries(projectStats.priorityStats).map(([prio, count]) => (
                <div key={prio} className="d-flex justify-content-between mb-2">
                  <Badge bg={
                    prio === 'critical' ? 'danger' :
                    prio === 'high' ? 'warning' :
                    prio === 'medium' ? 'info' : 'secondary'
                  }>
                    {prio}
                  </Badge>
                  <span>{count} ({totals?.all ? ((count/totals.all)*100).toFixed(1) : 0}%)</span>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Category Distribution */}
      <Card className="mb-4">
        <Card.Header>Projects by Category</Card.Header>
        <Card.Body>
          {byCategory && Object.entries(byCategory)
            .sort((a, b) => b[1] - a[1])
            .map(([cat, count]) => (
              <div key={cat} className="d-flex align-items-center mb-2">
                <div style={{ width: '150px' }}><strong>{cat}</strong></div>
                <div className="grow">
                  <div className="progress">
                    <div
                      className="progress-bar bg-primary"
                      role="progressbar"
                      style={{ width: `${(count / Math.max(...Object.values(byCategory))) * 100}%` }}
                      aria-valuenow={count}
                      aria-valuemin="0"
                      aria-valuemax={Math.max(...Object.values(byCategory))}
                    >
                      {count}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </Card.Body>
      </Card>

      {/* Top Performers */}
      <Card className="mb-4">
        <Card.Header>Top Performing Projects</Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Project</th>
                <th>Category</th>
                <th>Views</th>
                <th>Likes</th>
                <th>Shares</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {topPerformers?.map(proj => (
                <tr key={proj.id}>
                  <td>{proj.title}</td>
                  <td>{proj.category}</td>
                  <td>{proj.views}</td>
                  <td>{proj.likes}</td>
                  <td>{proj.shares}</td>
                  <td><Badge bg="primary">{proj.engagementScore}</Badge></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Recent Activity */}
      <Card>
        <Card.Header>Recent Activity</Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Project</th>
                <th>Creator</th>
                <th>Date</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {recentProjects?.map(proj => (
                <tr key={proj.id}>
                  <td>{proj.title}</td>
                  <td>{proj.creator}</td>
                  <td>{new Date(proj.publishedAt || proj.createdAt).toLocaleDateString()}</td>
                  <td><Badge bg="secondary">{proj.category}</Badge></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProjectStats;



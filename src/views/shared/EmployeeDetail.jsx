import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useEmployeeStore from '../../stores/shared/employeeStore';
import {
  Container,
  Row,
  Col,
  Card,
  Image,
  Button,
  Form,
  Badge,
  Spinner,
  Alert,
} from 'react-bootstrap';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentEmployee,
    loading,
    error,
    fetchEmployee,
    uploadProfilePicture,
    updateEmployeeStatus,
    clearCurrentEmployee,
  } = useEmployeeStore();

  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (id) fetchEmployee(id);
    return () => clearCurrentEmployee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile && id) {
      await uploadProfilePicture(id, selectedFile);
      setSelectedFile(null);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (id) {
      await updateEmployeeStatus(id, newStatus);
    }
  };

  if (loading && !currentEmployee) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading employee...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        <Alert.Heading>Error</Alert.Heading>
        <p>{typeof error === 'string' ? error : JSON.stringify(error)}</p>
      </Alert>
    );
  }

  if (!currentEmployee) {
    return (
      <Alert variant="warning" className="m-3">
        No employee found.
      </Alert>
    );
  }

  const emp = currentEmployee;

  return (
    <Container fluid className="px-4 py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Employee Profile</h2>
        <Button variant="outline-secondary" onClick={() => navigate('/admin/employees')}>
          <i className="bi bi-arrow-left"></i> Back to List
        </Button>
      </div>

      <Row>
        {/* Left column: Profile picture & quick actions */}
        <Col lg={4} className="mb-4">
          <Card className="shadow-sm text-center">
            <Card.Body>
              <Image
                src={emp.profilePictureUrl}
                alt={emp.displayName}
                roundedCircle
                fluid
                className="mb-3"
                style={{ maxWidth: '200px', height: 'auto', objectFit: 'cover' }}
              />
              <h4>{emp.employeeName}</h4>
              <p className="text-muted">
                <Badge bg={emp.isActive ? 'success' : 'secondary'}>
                  {emp.employmentStatus}
                </Badge>
              </p>
              <hr />
              <div className="d-grid gap-2">
                <Form.Group>
                  <Form.Label className="fw-bold">Change Status</Form.Label>
                  <Form.Select
                    value={emp.employmentStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="probation">Probation</option>
                    <option value="terminated">Terminated</option>
                    <option value="resigned">Resigned</option>
                  </Form.Select>
                </Form.Group>
                <hr />
                <Form.Group>
                  <Form.Label className="fw-bold">Upload New Photo</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    size="sm"
                  />
                  <Button
                    variant="primary"
                    className="mt-2 w-100"
                    onClick={handleUpload}
                    disabled={!selectedFile}
                  >
                    Upload
                  </Button>
                </Form.Group>
                <Link
                  to={`/admin/employees/${emp.id}/edit`}
                  className="btn btn-outline-secondary mt-2"
                >
                  <i className="bi bi-pencil"></i> Edit Employee
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Right column: Details */}
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Row>
                <Col md={6}>
                  <DetailItem label="Employee ID" value={emp.employeeId} />
                  <DetailItem label="Email" value={emp.email} />
                  <DetailItem label="Phone" value={emp.phone} />
                  <DetailItem label="Date of Birth" value={emp.dateOfBirth} />
                  <DetailItem label="Gender" value={emp.gender} />
                  <DetailItem label="Nationality" value={emp.nationality} />
                  <DetailItem label="Tax ID" value={emp.taxId} />
                </Col>
                <Col md={6}>
                  <DetailItem label="Hire Date" value={emp.hireDate} />
                  <DetailItem label="Department" value={emp.department?.name} />
                  <DetailItem label="Role" value={emp.role?.title} />
                  <DetailItem
                    label="Salary"
                    value={emp.salary ? `$${Number(emp.salary).toFixed(2)}` : null}
                  />
                  <DetailItem label="Address" value={emp.address} />
                  <DetailItem
                    label="Emergency Contact"
                    value={
                      emp.emergencyContact?.name
                        ? `${emp.emergencyContact.name} (${emp.emergencyContact.relation}) – ${emp.emergencyContact.phone}`
                        : null
                    }
                  />
                  <DetailItem label="Description" value={emp.description} />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// Helper component for detail rows
const DetailItem = ({ label, value }) => (
  <div className="mb-3">
    <strong className="text-secondary">{label}:</strong>
    <p className="mb-0">{value || 'N/A'}</p>
  </div>
);

export default EmployeeDetail;
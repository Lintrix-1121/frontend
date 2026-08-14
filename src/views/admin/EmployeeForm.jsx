import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useEmployeeStore from '../../stores/shared/employeeStore';
import { Form, Button, Card, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';

const EmployeeForm = ({ employee: propEmployee, onSuccess, onCancel }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentEmployee, fetchEmployee, createEmployee, updateEmployee, loading, error } =
    useEmployeeStore();

  // Use prop or store's currentEmployee
  const employee = propEmployee || currentEmployee;

  useEffect(() => {
    // If we have an id in the URL and no employee object, fetch it
    if (id && !employee) {
      fetchEmployee(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, employee]);

  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'prefer_not_to_say',
    address: '',
    emergencyContact: { name: '', phone: '', relation: '' },
    nationality: '',
    taxId: '',
    hireDate: '',
    employmentStatus: 'active',
    salary: '',
    description: '',
    departmentId: '',
    roleId: '',
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        employeeId: employee.employeeId || '',
        employeeName: employee.employeeName || '',
        email: employee.email || '',
        phone: employee.phone || '',
        dateOfBirth: employee.dateOfBirth || '',
        gender: employee.gender || 'prefer_not_to_say',
        address: employee.address || '',
        emergencyContact: employee.emergencyContact || { name: '', phone: '', relation: '' },
        nationality: employee.nationality || '',
        taxId: employee.taxId || '',
        hireDate: employee.hireDate || '',
        employmentStatus: employee.employmentStatus || 'active',
        salary: employee.salary || '',
        description: employee.description || '',
        departmentId: employee.departmentId || '',
        roleId: employee.roleId || '',
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmergencyChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [field]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if (payload.salary) payload.salary = parseFloat(payload.salary);
    let result;
    if (employee && employee.id) {
      result = await updateEmployee(employee.id, payload);
    } else {
      result = await createEmployee(payload);
    }
    if (result.success) {
      if (onSuccess) onSuccess(result.data);
      else navigate('/admin/employees');
    }
  };

  if (loading && id && !employee) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading employee data...</p>
      </div>
    );
  }

  return (
    <Container fluid className="px-4 py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{employee && employee.id ? 'Edit Employee' : 'Create New Employee'}</h2>
        <Button variant="outline-secondary" onClick={() => navigate('/admin/employees')}>
          <i className="bi bi-arrow-left"></i> Back
        </Button>
      </div>

      {error && (
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{typeof error === 'string' ? error : JSON.stringify(error)}</p>
        </Alert>
      )}

      <Card className="shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <h5 className="mb-3">Personal Information</h5>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Employee ID *</Form.Label>
                  <Form.Control
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="employeeName"
                    value={formData.employeeName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Gender</Form.Label>
                  <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nationality</Form.Label>
                  <Form.Control
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <hr />
            <h5 className="mb-3">Employment Details</h5>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Hire Date *</Form.Label>
                  <Form.Control
                    type="date"
                    name="hireDate"
                    value={formData.hireDate}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Employment Status</Form.Label>
                  <Form.Select
                    name="employmentStatus"
                    value={formData.employmentStatus}
                    onChange={handleChange}
                  >
                    <option value="active">Active</option>
                    <option value="probation">Probation</option>
                    <option value="terminated">Terminated</option>
                    <option value="resigned">Resigned</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Salary</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Department ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleChange}
                    placeholder="UUID of department"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Role ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="roleId"
                    value={formData.roleId}
                    onChange={handleChange}
                    placeholder="UUID of role"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <hr />
            <h5 className="mb-3">Emergency Contact</h5>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.emergencyContact.name}
                    onChange={(e) => handleEmergencyChange('name', e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.emergencyContact.phone}
                    onChange={(e) => handleEmergencyChange('phone', e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Relation</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.emergencyContact.relation}
                    onChange={(e) => handleEmergencyChange('relation', e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tax ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2 mt-4">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Saving...' : employee && employee.id ? 'Update' : 'Create'}
              </Button>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={onCancel || (() => navigate('/admin/employees'))}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EmployeeForm;

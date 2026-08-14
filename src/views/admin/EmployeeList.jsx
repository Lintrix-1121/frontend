import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useEmployeeStore from '../../stores/shared/employeeStore';
import { Spinner, Alert, Table, Button, Form, InputGroup, Pagination } from 'react-bootstrap';

const EmployeeList = () => {
  const {
    employees,
    pagination,
    filters,
    loading,
    error,
    fetchEmployees,
    setFilters,
    deleteEmployee,
  } = useEmployeeStore();

  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || '');

  useEffect(() => {
    fetchEmployees({ page: pagination.page, limit: pagination.limit });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ search: searchTerm, status: statusFilter });
    fetchEmployees({ page: 1, limit: pagination.limit });
  };

  const handlePageChange = (newPage) => {
    fetchEmployees({ page: newPage, limit: pagination.limit });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      await deleteEmployee(id);
    }
  };

  // Loading and error states
  if (loading && employees.length === 0) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading employees...</p>
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

  return (
    <div className="container-fluid px-4 py-3">
      <h2 className="mb-4">Employee Management</h2>

      {/* Filters */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSearch} className="row g-3 align-items-end">
            <div className="col-md-4">
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Name, email, or ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button type="submit" variant="primary">
                    <i className="bi bi-search"></i> Search
                  </Button>
                </InputGroup>
              </Form.Group>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="probation">Probation</option>
                  <option value="terminated">Terminated</option>
                  <option value="resigned">Resigned</option>
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-md-2">
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                  setFilters({ search: '', status: '' });
                  fetchEmployees({ page: 1, limit: pagination.limit });
                }}
                className="w-100"
              >
                Clear Filters
              </Button>
            </div>
            <div className="col-md-3 text-md-end">
              <Link to="/admin/employees/create" className="btn btn-success">
                <i className="bi bi-plus-circle"></i> Add Employee
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Table */}
      <Card className="shadow-sm">
        <Card.Body className="p-0">
          <Table striped bordered hover responsive className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Profile</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Role</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No employees found
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <img
                        src={emp.profilePictureUrl}
                        alt={emp.displayName}
                        width="40"
                        height="40"
                        className="rounded-circle object-fit-cover"
                        style={{ objectFit: 'cover' }}
                      />
                    </td>
                    <td>{emp.employeeName}</td>
                    <td>{emp.email}</td>
                    <td>{emp.department?.name || 'N/A'}</td>
                    <td>{emp.role?.title || 'N/A'}</td>
                    <td>
                      <span
                        className={`badge ${
                          emp.employmentStatus === 'active'
                            ? 'bg-success'
                            : emp.employmentStatus === 'probation'
                            ? 'bg-warning text-dark'
                            : 'bg-danger'
                        }`}
                      >
                        {emp.employmentStatus}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2 flex-wrap">
                        <Link
                          to={`/admin/employees/${emp.id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          <i className="bi bi-eye"></i>
                        </Link>
                        <Link
                          to={`/admin/employees/${emp.id}/edit`}
                          className="btn btn-sm btn-outline-secondary"
                        >
                          <i className="bi bi-pencil"></i>
                        </Link>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(emp.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between align-items-center">
          <span>
            Showing {employees.length} of {pagination.total} employees
          </span>
          <Pagination className="mb-0">
            <Pagination.Prev
              disabled={pagination.page === 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            />
            <Pagination.Item active>{pagination.page}</Pagination.Item>
            <Pagination.Next
              disabled={pagination.page === pagination.totalPages}
              onClick={() => handlePageChange(pagination.page + 1)}
            />
          </Pagination>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default EmployeeList;
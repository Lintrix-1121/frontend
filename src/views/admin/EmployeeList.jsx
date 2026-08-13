import React, { useEffect, useState } from 'react';
import useEmployeeStore from '../../stores/shared/employeeStore';
import { Link } from 'react-router-dom';

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
  }, []);

  const handleSearch = () => {
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

  if (loading && employees.length === 0) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name, email, ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="probation">Probation</option>
          <option value="terminated">Terminated</option>
          <option value="resigned">Resigned</option>
        </select>
        <button onClick={handleSearch}>Search</button>
        <Link to="/employees/create">Add Employee</Link>
      </div>

      <table>
        <thead>
          <tr>
            <th>Profile</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>
                <img src={emp.profilePictureUrl} alt={emp.displayName} width="50" height="50" />
              </td>
              <td>{emp.employeeName}</td>
              <td>{emp.email}</td>
              <td>{emp.department?.name || 'N/A'}</td>
              <td>{emp.role?.title || 'N/A'}</td>
              <td>{emp.employmentStatus}</td>
              <td>
                <Link to={`/employees/${emp.id}`}>View</Link>
                <Link to={`/employees/${emp.id}/edit`}>Edit</Link>
                <button onClick={() => handleDelete(emp.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          disabled={pagination.page === 1}
          onClick={() => handlePageChange(pagination.page - 1)}
        >
          Previous
        </button>
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          disabled={pagination.page === pagination.totalPages}
          onClick={() => handlePageChange(pagination.page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployeeList;
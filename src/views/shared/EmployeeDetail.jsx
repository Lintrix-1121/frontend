import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useEmployeeStore from '../../stores/shared/employeeStore';
import { useDropzone } from 'react-dropzone'; 

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

  if (loading && !currentEmployee) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!currentEmployee) return <div>No employee found</div>;

  const emp = currentEmployee;

  return (
    <div className="employee-detail">
      <div className="profile-header">
        <img src={emp.profilePictureUrl} alt={emp.displayName} width="150" height="150" />
        <h1>{emp.employeeName}</h1>
        <p>ID: {emp.employeeId}</p>
        <p>Email: {emp.email}</p>
        <p>Status: <strong>{emp.employmentStatus}</strong></p>
        <div>
          <label>Upload new photo: </label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button onClick={handleUpload} disabled={!selectedFile}>Upload</button>
        </div>
      </div>

      <div className="details">
        <p><strong>Phone:</strong> {emp.phone || 'N/A'}</p>
        <p><strong>Date of Birth:</strong> {emp.dateOfBirth || 'N/A'}</p>
        <p><strong>Gender:</strong> {emp.gender}</p>
        <p><strong>Address:</strong> {emp.address || 'N/A'}</p>
        <p><strong>Nationality:</strong> {emp.nationality || 'N/A'}</p>
        <p><strong>Tax ID:</strong> {emp.taxId || 'N/A'}</p>
        <p><strong>Hire Date:</strong> {emp.hireDate || 'N/A'}</p>
        <p><strong>Salary:</strong> {emp.salary ? `$${emp.salary}` : 'N/A'}</p>
        <p><strong>Department:</strong> {emp.department?.name || 'N/A'}</p>
        <p><strong>Role:</strong> {emp.role?.title || 'N/A'}</p>
        <p><strong>Description:</strong> {emp.description || 'N/A'}</p>
        <p><strong>Emergency Contact:</strong></p>
        <ul>
          <li>Name: {emp.emergencyContact?.name || 'N/A'}</li>
          <li>Phone: {emp.emergencyContact?.phone || 'N/A'}</li>
          <li>Relation: {emp.emergencyContact?.relation || 'N/A'}</li>
        </ul>
      </div>

      <div className="actions">
        <Link to={`/employees/${emp.id}/edit`}>Edit Employee</Link>
        <select onChange={(e) => handleStatusChange(e.target.value)} value={emp.employmentStatus}>
          <option value="active">Active</option>
          <option value="probation">Probation</option>
          <option value="terminated">Terminated</option>
          <option value="resigned">Resigned</option>
        </select>
        <button onClick={() => navigate('/employees')}>Back to List</button>
      </div>
    </div>
  );
};

export default EmployeeDetail;
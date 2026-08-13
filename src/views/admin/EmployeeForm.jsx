import React, { useState, useEffect } from 'react';
import useEmployeeStore from '../../stores/shared/employeeStore';

const EmployeeForm = ({ employee, onSuccess, onCancel }) => {
  const { createEmployee, updateEmployee } = useEmployeeStore();
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

  // Populate form when editing
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
    if (result.success && onSuccess) onSuccess(result.data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="employeeId" value={formData.employeeId} onChange={handleChange} placeholder="Employee ID" required />
      <input name="employeeName" value={formData.employeeName} onChange={handleChange} placeholder="Full Name" required />
      <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
      <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
      <input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
      <select name="gender" value={formData.gender} onChange={handleChange}>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
        <option value="prefer_not_to_say">Prefer not to say</option>
      </select>
      <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
      <h4>Emergency Contact</h4>
      <input
        placeholder="Name"
        value={formData.emergencyContact.name}
        onChange={(e) => handleEmergencyChange('name', e.target.value)}
      />
      <input
        placeholder="Phone"
        value={formData.emergencyContact.phone}
        onChange={(e) => handleEmergencyChange('phone', e.target.value)}
      />
      <input
        placeholder="Relation"
        value={formData.emergencyContact.relation}
        onChange={(e) => handleEmergencyChange('relation', e.target.value)}
      />
      <input name="nationality" value={formData.nationality} onChange={handleChange} placeholder="Nationality" />
      <input name="taxId" value={formData.taxId} onChange={handleChange} placeholder="Tax ID" />
      <input name="hireDate" type="date" value={formData.hireDate} onChange={handleChange} required />
      <select name="employmentStatus" value={formData.employmentStatus} onChange={handleChange}>
        <option value="active">Active</option>
        <option value="probation">Probation</option>
        <option value="terminated">Terminated</option>
        <option value="resigned">Resigned</option>
      </select>
      <input name="salary" type="number" step="0.01" value={formData.salary} onChange={handleChange} placeholder="Salary" />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
      <input name="departmentId" value={formData.departmentId} onChange={handleChange} placeholder="Department ID" />
      <input name="roleId" value={formData.roleId} onChange={handleChange} placeholder="Role ID" />
      <button type="submit">{employee && employee.id ? 'Update' : 'Create'}</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default EmployeeForm;


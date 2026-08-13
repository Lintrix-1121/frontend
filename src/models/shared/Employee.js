export class Employee {
  constructor(data = {}) {
    this.id = data.id || null;
    this.employeeId = data.employeeId || '';
    this.employeeName = data.employeeName || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.dateOfBirth = data.dateOfBirth || null;
    this.gender = data.gender || 'prefer_not_to_say';
    this.address = data.address || '';
    this.emergencyContact = data.emergencyContact || { name: '', phone: '', relation: '' };
    this.nationality = data.nationality || '';
    this.taxId = data.taxId || '';
    this.hireDate = data.hireDate || null;
    this.employmentStatus = data.employmentStatus || 'active';
    this.profilePicture = data.profilePicture || '';
    this.salary = data.salary || null;
    this.description = data.description || '';
    this.departmentId = data.departmentId || null;
    this.roleId = data.roleId || null;
    this.department = data.department || null;   // populated when included
    this.role = data.role || null;               // populated when included
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
    this.deletedAt = data.deletedAt || null;
  }

  // Helper to get full name or fallback
  get displayName() {
    return this.employeeName || this.email || 'Unnamed';
  }

  // Helper to get profile picture URL or fallback
  get profilePictureUrl() {
    return this.profilePicture || '/default-avatar.png';
  }

  // Helper to check if employee is active
  get isActive() {
    return this.employmentStatus === 'active';
  }

  // Convert to plain object for API payload
  toJSON() {
    return {
      employeeId: this.employeeId,
      employeeName: this.employeeName,
      email: this.email,
      phone: this.phone,
      dateOfBirth: this.dateOfBirth,
      gender: this.gender,
      address: this.address,
      emergencyContact: this.emergencyContact,
      nationality: this.nationality,
      taxId: this.taxId,
      hireDate: this.hireDate,
      employmentStatus: this.employmentStatus,
      profilePicture: this.profilePicture,
      salary: this.salary,
      description: this.description,
      departmentId: this.departmentId,
      roleId: this.roleId,
    };
  }
}
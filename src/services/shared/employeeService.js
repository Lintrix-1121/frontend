import api from '../api';

class EmployeeService {
  async create(data) {
    const response = await api.post('/employees', data);
    return response.data;
  }

  async findAll({ page = 1, limit = 10, search = '', status = '' } = {}) {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    const response = await api.get(`/employees?${params.toString()}`);
    return response.data; // { total, page, limit, totalPages, data }
  }

  async findById(id) {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  }

  async update(id, data) {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  }

  async delete(id) {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  }

  async uploadProfilePicture(id, file) {
    const formData = new FormData();
    formData.append('profilePicture', file);
    const response = await api.post(`/employees/${id}/profile-picture`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data; 
  }

  async updateStatus(id, status) {
    const response = await api.patch(`/employees/${id}/status`, { status });
    return response.data;
  }
}

export default new EmployeeService();
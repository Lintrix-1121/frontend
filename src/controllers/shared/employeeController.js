import employeeService from '../../services/shared/employeeService';
import { Employee } from '../../models/shared/Employee';

class EmployeeController {
  async create(data) {
    try {
      const result = await employeeService.create(data);
      return { success: true, data: new Employee(result) };
    } catch (error) {
      console.error('Create employee error:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  async fetchAll(params) {
    try {
      const result = await employeeService.findAll(params);
      return {
        success: true,
        data: result.data.map(emp => new Employee(emp)),
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      };
    } catch (error) {
      console.error('Fetch employees error:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  async fetchById(id) {
    try {
      const result = await employeeService.findById(id);
      return { success: true, data: new Employee(result) };
    } catch (error) {
      console.error('Fetch employee error:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  async update(id, data) {
    try {
      const result = await employeeService.update(id, data);
      return { success: true, data: new Employee(result) };
    } catch (error) {
      console.error('Update employee error:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  async delete(id) {
    try {
      const result = await employeeService.delete(id);
      return { success: true, message: result.message };
    } catch (error) {
      console.error('Delete employee error:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  async uploadProfilePicture(id, file) {
    try {
      const result = await employeeService.uploadProfilePicture(id, file);
      return { success: true, data: new Employee(result.employee) };
    } catch (error) {
      console.error('Upload profile picture error:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  async updateStatus(id, status) {
    try {
      const result = await employeeService.updateStatus(id, status);
      return { success: true, data: new Employee(result) };
    } catch (error) {
      console.error('Update status error:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }
}

export default new EmployeeController();
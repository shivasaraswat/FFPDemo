import api from './api';

export const userService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.isActive !== undefined) {
      params.append('isActive', filters.isActive);
    }
    
    if (filters.roleId) {
      params.append('roleId', filters.roleId);
    }
    
    if (filters.search) {
      params.append('search', filters.search);
    }
    
    const queryString = params.toString();
    const url = queryString ? `/users?${queryString}` : '/users';
    const response = await api.get(url);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  create: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  update: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  activate: async (id) => {
    const response = await api.patch(`/users/${id}/activate`);
    return response.data;
  },

  deactivate: async (id) => {
    const response = await api.patch(`/users/${id}/deactivate`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};



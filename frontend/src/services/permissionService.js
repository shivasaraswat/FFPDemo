import api from './api';

export const permissionService = {
  getMatrix: async () => {
    const response = await api.get('/permissions');
    return response.data;
  },

  getByRole: async (roleId) => {
    const response = await api.get(`/permissions/role/${roleId}`);
    return response.data;
  },

  bulkUpdate: async (permissions) => {
    const response = await api.post('/permissions', { permissions });
    return response.data;
  },

  update: async (id, permissionData) => {
    const response = await api.put(`/permissions/${id}`, permissionData);
    return response.data;
  }
};



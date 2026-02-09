import api from './api';

export const apiRegistryService = {
  getAll: async () => {
    const response = await api.get('/api-registry');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api-registry/${id}`);
    return response.data;
  },

  getByModule: async (moduleKey) => {
    const response = await api.get(`/api-registry/module/${moduleKey}`);
    return response.data;
  },

  create: async (apiData) => {
    const response = await api.post('/api-registry', apiData);
    return response.data;
  },

  update: async (id, apiData) => {
    const response = await api.put(`/api-registry/${id}`, apiData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api-registry/${id}`);
    return response.data;
  }
};




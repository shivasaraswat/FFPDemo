import api from './api';

export const accessObjectService = {
  getAll: async (hierarchical = false) => {
    const url = hierarchical ? '/modules?hierarchical=true' : '/modules';
    const response = await api.get(url);
    return response.data;
  },

  getByKey: async (key) => {
    const response = await api.get(`/modules/${key}`);
    return response.data;
  },

  create: async (moduleData) => {
    const response = await api.post('/modules', moduleData);
    return response.data;
  },

  update: async (key, moduleData) => {
    const response = await api.put(`/modules/${key}`, moduleData);
    return response.data;
  },

  delete: async (key) => {
    const response = await api.delete(`/modules/${key}`);
    return response.data;
  }
};


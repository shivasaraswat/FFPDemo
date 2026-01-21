import api from './api';

export const fieldFixService = {
  getDemo: async () => {
    const response = await api.get('/field-fix/demo');
    return response.data;
  }
};



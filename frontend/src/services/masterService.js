import api from './api';

// Master type mappings
const masterTypes = {
  region: 'region',
  regioncenter: 'regioncenter',
  countries: 'countries',
  model: 'model',
  smtype: 'smtype',
  aggregate: 'aggregate',
  subaggregate: 'subaggregate',
  categories: 'categories'
};

// Field name mappings for each master type
const fieldMappings = {
  region: {
    id: 'region_id',
    code: 'region_code',
    name: 'region_name'
  },
  regioncenter: {
    id: 'regioncenter_id',
    code: 'regioncenter_code',
    name: 'regioncenter_name'
  },
  countries: {
    id: 'country_id',
    code: 'country_code',
    name: 'country_name',
    isoId: 'country_iso_id'
  },
  model: {
    id: 'model_id',
    code: 'model_code',
    name: 'model_name'
  },
  smtype: {
    id: 'smtype_id',
    code: 'smtype_code',
    name: 'smtype_name'
  },
  aggregate: {
    id: 'aggregate_id',
    code: 'aggregate_code',
    name: 'aggregate_name'
  },
  subaggregate: {
    id: 'subaggregate_id',
    code: 'subaggregate_code',
    name: 'subaggregate_name',
    aggregateId: 'aggregate_id'
  },
  categories: {
    id: 'category_id',
    code: 'category_code',
    name: 'category_name',
    applicableBusiness: 'applicable_business'
  }
};

export const masterService = {
  // Get field mappings for a master type
  getFieldMappings: (type) => {
    return fieldMappings[type] || {};
  },

  // Normalize data from API response to frontend format
  normalizeRecord: (type, record) => {
    const mappings = fieldMappings[type];
    if (!mappings) return record;

    return {
      id: record[mappings.id],
      code: record[mappings.code],
      name: record[mappings.name],
      isActive: record.is_active,
      ...(mappings.isoId && { isoId: record[mappings.isoId] }),
      ...(mappings.aggregateId && { aggregateId: record[mappings.aggregateId], aggregateName: record.aggregate_name }),
      ...(mappings.applicableBusiness && { applicableBusiness: record[mappings.applicableBusiness] }),
      createdAt: record.created_at,
      updatedAt: record.updated_at
    };
  },

  // Denormalize data from frontend format to API format
  denormalizeRecord: (type, data) => {
    const mappings = fieldMappings[type];
    if (!mappings) return data;

    const denormalized = {
      // Code is auto-generated on backend, so don't send it
      [mappings.name]: data.name,
      is_active: data.isActive !== undefined ? data.isActive : 1
    };

    if (mappings.isoId && data.isoId !== undefined) {
      denormalized[mappings.isoId] = data.isoId;
    }

    if (mappings.aggregateId && data.aggregateId !== undefined) {
      denormalized[mappings.aggregateId] = data.aggregateId;
    }

    if (mappings.applicableBusiness && data.applicableBusiness !== undefined) {
      denormalized[mappings.applicableBusiness] = data.applicableBusiness;
    }

    return denormalized;
  },

  getAll: async (type, filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.isActive !== undefined) {
      params.append('isActive', filters.isActive);
    }
    
    if (filters.search) {
      params.append('search', filters.search);
    }
    
    const queryString = params.toString();
    const url = queryString ? `/masters/${type}?${queryString}` : `/masters/${type}`;
    const response = await api.get(url);
    
    // Normalize all records
    return response.data.map(record => masterService.normalizeRecord(type, record));
  },

  getById: async (type, id) => {
    const response = await api.get(`/masters/${type}/${id}`);
    return masterService.normalizeRecord(type, response.data);
  },

  create: async (type, data) => {
    const denormalized = masterService.denormalizeRecord(type, data);
    const response = await api.post(`/masters/${type}`, denormalized);
    return masterService.normalizeRecord(type, response.data);
  },

  update: async (type, id, data) => {
    const denormalized = masterService.denormalizeRecord(type, data);
    const response = await api.put(`/masters/${type}/${id}`, denormalized);
    return masterService.normalizeRecord(type, response.data);
  },

  delete: async (type, id) => {
    const response = await api.delete(`/masters/${type}/${id}`);
    return response.data;
  }
};


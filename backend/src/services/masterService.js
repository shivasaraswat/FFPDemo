const GdRegion = require('../models/GdRegion');
const GdRegionCenter = require('../models/GdRegionCenter');
const GdCountry = require('../models/GdCountry');
const GdModel = require('../models/GdModel');
const GdSmType = require('../models/GdSmType');
const GdAggregate = require('../models/GdAggregate');
const GdSubAggregate = require('../models/GdSubAggregate');
const GdCategory = require('../models/GdCategory');

// Map master types to their models
const modelMap = {
  region: GdRegion,
  regioncenter: GdRegionCenter,
  countries: GdCountry,
  model: GdModel,
  smtype: GdSmType,
  aggregate: GdAggregate,
  subaggregate: GdSubAggregate,
  categories: GdCategory
};

// Map master types to their ID field names
const idFieldMap = {
  region: 'region_id',
  regioncenter: 'regioncenter_id',
  countries: 'country_id',
  model: 'model_id',
  smtype: 'smtype_id',
  aggregate: 'aggregate_id',
  subaggregate: 'subaggregate_id',
  categories: 'category_id'
};

// Map master types to their code field names
const codeFieldMap = {
  region: 'region_code',
  regioncenter: 'regioncenter_code',
  countries: 'country_code',
  model: 'model_code',
  smtype: 'smtype_code',
  aggregate: 'aggregate_code',
  subaggregate: 'subaggregate_code',
  categories: 'category_code'
};

class MasterService {
  getModel(type) {
    const normalizedType = type.toLowerCase();
    const model = modelMap[normalizedType];
    if (!model) {
      throw new Error(`Invalid master type: ${type}`);
    }
    return model;
  }

  getIdField(type) {
    const normalizedType = type.toLowerCase();
    return idFieldMap[normalizedType] || 'id';
  }

  getCodeField(type) {
    const normalizedType = type.toLowerCase();
    return codeFieldMap[normalizedType] || 'code';
  }

  /**
   * Generate a unique code from a name
   * Strategy: Convert to uppercase, replace spaces with underscores, remove special chars
   * If code exists, append a number to make it unique
   */
  async generateUniqueCode(type, name) {
    const model = this.getModel(type);
    const codeField = this.getCodeField(type);
    
    // Generate base code from name
    let baseCode = name
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '_')  // Replace spaces with underscores
      .replace(/[^A-Z0-9_]/g, '')  // Remove special characters except underscores
      .replace(/_+/g, '_')  // Replace multiple underscores with single
      .replace(/^_|_$/g, '');  // Remove leading/trailing underscores
    
    // Ensure code is not empty
    if (!baseCode) {
      baseCode = 'CODE_' + Date.now().toString().slice(-6);
    }
    
    // Ensure code doesn't exceed 50 characters (database limit)
    if (baseCode.length > 50) {
      baseCode = baseCode.substring(0, 50);
    }
    
    // Check if code exists, if so append number
    let code = baseCode;
    let counter = 1;
    while (true) {
      const existing = await model.findByCode(code);
      if (!existing) {
        return code;
      }
      // Append number, ensuring total length doesn't exceed 50
      const suffix = `_${counter}`;
      if (baseCode.length + suffix.length > 50) {
        code = baseCode.substring(0, 50 - suffix.length) + suffix;
      } else {
        code = baseCode + suffix;
      }
      counter++;
      
      // Safety check to prevent infinite loop
      if (counter > 1000) {
        code = baseCode + '_' + Date.now().toString().slice(-6);
        break;
      }
    }
    
    return code;
  }

  async getAll(type, filters = {}) {
    const model = this.getModel(type);
    return await model.findAll(filters);
  }

  async getById(type, id) {
    const model = this.getModel(type);
    const record = await model.findById(id);
    if (!record) {
      throw new Error(`${type} not found`);
    }
    return record;
  }

  async create(type, data, userId) {
    const model = this.getModel(type);
    const codeField = this.getCodeField(type);
    const nameField = codeField.replace('_code', '_name');
    
    // Validate required fields
    if (!data[nameField] || !data[nameField].trim()) {
      throw new Error(`${nameField} is required`);
    }
    
    // Auto-generate code from name if not provided
    let code = data[codeField];
    if (!code || !code.trim()) {
      code = await this.generateUniqueCode(type, data[nameField]);
    } else {
      // If code is provided, check for uniqueness
      const existing = await model.findByCode(code);
      if (existing) {
        throw new Error(`${codeField} already exists`);
      }
    }

    // Set audit fields
    const createData = {
      ...data,
      [codeField]: code,
      created_by: userId
    };

    return await model.create(createData);
  }

  async update(type, id, data, userId) {
    const model = this.getModel(type);
    const codeField = this.getCodeField(type);
    
    // Check if record exists
    const existing = await model.findById(id);
    if (!existing) {
      throw new Error(`${type} not found`);
    }

    const nameField = codeField.replace('_code', '_name');
    
    // Validate required fields if being updated
    if (data[nameField] !== undefined && (!data[nameField] || !data[nameField].trim())) {
      throw new Error(`${nameField} is required`);
    }

    // Don't allow code updates - code is auto-generated and should remain unchanged
    // Remove code from update data if provided
    const updateData = { ...data };
    if (updateData[codeField] !== undefined) {
      delete updateData[codeField];
    }

    // Set audit fields
    updateData.updated_by = userId;

    return await model.update(id, updateData);
  }

  async delete(type, id) {
    const model = this.getModel(type);
    const existing = await model.findById(id);
    if (!existing) {
      throw new Error(`${type} not found`);
    }
    return await model.delete(id);
  }
}

module.exports = new MasterService();


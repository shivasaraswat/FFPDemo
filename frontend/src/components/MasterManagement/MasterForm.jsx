import React, { useState, useEffect } from 'react';
import { masterService } from '../../services/masterService';

const MasterForm = ({ masterType, record, aggregates, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    isActive: 1,
    isoId: '',
    aggregateId: '',
    applicableBusiness: ''
  });
  const [errors, setErrors] = useState({});
  const isEditMode = !!record;

  // Master type configurations
  const masterTypeConfig = {
    region: { label: 'Region', codeLabel: 'Region Code', nameLabel: 'Region Name' },
    regioncenter: { label: 'Regional Center', codeLabel: 'Regional Center Code', nameLabel: 'Regional Center Name' },
    countries: { label: 'Country', codeLabel: 'Country Code', nameLabel: 'Country Name', hasIsoId: true },
    model: { label: 'Model', codeLabel: 'Model Code', nameLabel: 'Model Name' },
    smtype: { label: 'SM Type', codeLabel: 'SM Type Code', nameLabel: 'SM Type Name' },
    aggregate: { label: 'Aggregate', codeLabel: 'Aggregate Code', nameLabel: 'Aggregate Name' },
    subaggregate: { label: 'Sub Aggregate', codeLabel: 'Sub Aggregate Code', nameLabel: 'Sub Aggregate Name' },
    categories: { label: 'Category', codeLabel: 'Category Code', nameLabel: 'Category Name', hasApplicableBusiness: true }
  };

  const config = masterTypeConfig[masterType] || {};

  useEffect(() => {
    if (record) {
      setFormData({
        name: record.name || '',
        isActive: record.isActive !== undefined ? record.isActive : 1,
        isoId: record.isoId || '',
        aggregateId: record.aggregateId || '',
        applicableBusiness: record.applicableBusiness || ''
      });
    } else {
      setFormData({
        name: '',
        isActive: 1,
        isoId: '',
        aggregateId: '',
        applicableBusiness: ''
      });
    }
    setErrors({});
  }, [record, masterType]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = `${config.nameLabel || 'Name'} is required`;
    }

    if (config.hasAggregate && !formData.aggregateId) {
      newErrors.aggregateId = 'Aggregate is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const submitData = { ...formData };
      
      // Remove empty optional fields
      if (!config.hasIsoId || !submitData.isoId) {
        delete submitData.isoId;
      }
      if (!config.hasAggregate || !submitData.aggregateId) {
        delete submitData.aggregateId;
      }
      if (!config.hasApplicableBusiness || !submitData.applicableBusiness) {
        delete submitData.applicableBusiness;
      }

      onSubmit(submitData);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000] p-4" onClick={onCancel}>
      <div className="bg-white rounded-lg w-full max-w-[600px] max-h-[90vh] overflow-y-auto shadow-lg master-form-modal" onClick={(e) => e.stopPropagation()} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`
          .master-form-modal {
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
          }
          .master-form-modal::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
          }
          .master-form-modal .modal-cancel-btn {
            border: 2px solid #d1d5db !important;
          }
          .master-form-modal .modal-submit-btn {
            border: 2px solid #D80C0C !important;
          }
        `}</style>
        <div className="flex justify-between items-center p-6 border-b border-gray-300">
          <h2 className="m-0 text-gray-800 text-2xl">
            {isEditMode ? `Edit ${config.label}` : `Add ${config.label}`}
          </h2>
          <button 
            className="bg-transparent border-none text-3xl text-gray-600 cursor-pointer leading-none p-0 w-8 h-8 flex items-center justify-center rounded transition-colors hover:bg-gray-100" 
            onClick={onCancel}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col mb-4">
            <label htmlFor="name" className="mb-2 text-gray-800 font-medium text-sm">
              {config.nameLabel || 'Name'} *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`py-3.5 px-4 border-2 rounded-lg text-[0.95rem] transition-all duration-300 bg-bg-secondary text-text-primary font-sans hover:border-gray-300 hover:bg-white focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.name ? 'border-danger bg-red-50' : 'border-gray-200'}`}
              placeholder={config.nameLabel || 'Name'}
            />
            {errors.name && <span className="mt-1 text-sm text-danger">{errors.name}</span>}
            {!isEditMode && (
              <span className="mt-1 text-xs text-gray-500">
                Code will be auto-generated from the name
              </span>
            )}
            {isEditMode && record && (
              <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                <span className="text-xs text-gray-600 font-medium">Code: </span>
                <span className="text-xs text-gray-800 font-mono">{record.code}</span>
              </div>
            )}
          </div>

          {config.hasIsoId && (
            <div className="flex flex-col mb-4">
              <label htmlFor="isoId" className="mb-2 text-gray-800 font-medium text-sm">
                Country ISO ID
              </label>
              <input
                id="isoId"
                type="text"
                value={formData.isoId}
                onChange={(e) => handleChange('isoId', e.target.value)}
                className="py-3.5 px-4 border-2 border-gray-200 rounded-lg text-[0.95rem] transition-all duration-300 bg-bg-secondary text-text-primary font-sans hover:border-gray-300 hover:bg-white focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                placeholder="ISO ID (optional)"
                maxLength={10}
              />
            </div>
          )}

          {config.hasAggregate && (
            <div className="flex flex-col mb-4">
              <label htmlFor="aggregateId" className="mb-2 text-gray-800 font-medium text-sm">
                Aggregate *
              </label>
              <select
                id="aggregateId"
                value={formData.aggregateId}
                onChange={(e) => handleChange('aggregateId', e.target.value)}
                className={`py-3.5 px-4 border-2 rounded-lg text-[0.95rem] transition-all duration-300 bg-bg-secondary text-text-primary font-sans hover:border-gray-300 hover:bg-white focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 ${errors.aggregateId ? 'border-danger bg-red-50' : 'border-gray-200'}`}
              >
                <option value="">Select Aggregate</option>
                {aggregates && aggregates.map(agg => (
                  <option key={agg.id} value={agg.id}>
                    {agg.name}
                  </option>
                ))}
              </select>
              {errors.aggregateId && <span className="mt-1 text-sm text-danger">{errors.aggregateId}</span>}
            </div>
          )}

          {config.hasApplicableBusiness && (
            <div className="flex flex-col mb-4">
              <label htmlFor="applicableBusiness" className="mb-2 text-gray-800 font-medium text-sm">
                Applicable Business
              </label>
              <input
                id="applicableBusiness"
                type="text"
                value={formData.applicableBusiness}
                onChange={(e) => handleChange('applicableBusiness', e.target.value)}
                className="py-3.5 px-4 border-2 border-gray-200 rounded-lg text-[0.95rem] transition-all duration-300 bg-bg-secondary text-text-primary font-sans hover:border-gray-300 hover:bg-white focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                placeholder="Applicable Business (optional)"
                maxLength={100}
              />
            </div>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <button 
              type="button" 
              className="modal-cancel-btn px-6 py-2.5 rounded-lg font-semibold bg-white text-gray-500 cursor-pointer transition-all duration-300 hover:bg-gray-50"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="modal-submit-btn px-6 py-2.5 rounded-lg font-semibold bg-white cursor-pointer transition-all duration-300 hover:bg-red-50 flex items-center gap-2"
              style={{ color: '#D80C0C' }}
            >
              {isEditMode ? 'Update' : 'Create'}
              <span style={{ color: '#D80C0C' }}>›</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MasterForm;


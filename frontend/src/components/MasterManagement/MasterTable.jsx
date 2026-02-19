import React from 'react';
import { HiPencil, HiTrash } from 'react-icons/hi';

const MasterTable = ({ masterType, records, onEdit, onDelete }) => {
  // Master type configurations for column headers
  const masterTypeConfig = {
    region: { codeHeader: 'Region Code', nameHeader: 'Region Name' },
    regioncenter: { codeHeader: 'Regional Center Code', nameHeader: 'Regional Center Name' },
    countries: { codeHeader: 'Country Code', nameHeader: 'Country Name', hasIsoId: true },
    model: { codeHeader: 'Model Code', nameHeader: 'Model Name' },
    smtype: { codeHeader: 'SM Type Code', nameHeader: 'SM Type Name' },
    aggregate: { codeHeader: 'Aggregate Code', nameHeader: 'Aggregate Name' },
    subaggregate: { codeHeader: 'Sub Aggregate Code', nameHeader: 'Sub Aggregate Name' },
    categories: { codeHeader: 'Category Code', nameHeader: 'Category Name', hasApplicableBusiness: true }
  };

  const config = masterTypeConfig[masterType] || {};

  if (records.length === 0) {
    return (
      <div className="text-center py-12 text-text-secondary bg-bg-secondary rounded-lg border border-border">
        <p className="m-0 text-base font-medium">No records found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6 max-md:overflow-x-auto">
      <table className="w-full border-collapse bg-white">
        <thead className="bg-bg-secondary border-b border-border sticky top-0 z-10">
          <tr>
            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider relative whitespace-nowrap">
              SR. No
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider relative whitespace-nowrap">
              {config.nameHeader || 'Name'}
            </th>
            {config.hasIsoId && (
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider relative whitespace-nowrap">
                ISO ID
              </th>
            )}
            {config.hasAggregate && (
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider relative whitespace-nowrap">
                Aggregate
              </th>
            )}
            {config.hasApplicableBusiness && (
              <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider relative whitespace-nowrap">
                Applicable Business
              </th>
            )}
            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider relative whitespace-nowrap">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={record.id} className="border-b border-gray-100 transition-colors duration-200 hover:bg-bg-secondary">
              <td className="px-4 py-4 text-sm text-gray-700">{index + 1}</td>
              <td className="px-4 py-4 text-sm text-gray-700">{record.name}</td>
              {config.hasIsoId && (
                <td className="px-4 py-4 text-sm text-gray-500">{record.isoId || '-'}</td>
              )}
              {config.hasAggregate && (
                <td className="px-4 py-4 text-sm text-gray-700">{record.aggregateName || '-'}</td>
              )}
              {config.hasApplicableBusiness && (
                <td className="px-4 py-4 text-sm text-gray-500">{record.applicableBusiness || '-'}</td>
              )}
              <td className="px-4 py-4 text-sm text-gray-700">
                <div className="flex gap-3 items-center">
                  <button
                    className="flex items-center justify-center cursor-pointer transition-all duration-200 bg-transparent border-none p-1 text-gray-400 hover:text-blue-600"
                    onClick={() => onEdit(record)}
                    title="Edit"
                    aria-label="Edit record"
                  >
                    <HiPencil size={20} />
                  </button>
                  <button
                    className="flex items-center justify-center cursor-pointer transition-all duration-200 bg-transparent border-none p-1 text-gray-400 hover:text-red-600"
                    onClick={() => onDelete(record.id)}
                    title="Delete"
                    aria-label="Delete record"
                  >
                    <HiTrash size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MasterTable;



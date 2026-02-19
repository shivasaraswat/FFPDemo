import React, { useState, useEffect, useRef } from 'react';
import { masterService } from '../../services/masterService';
import MasterTable from '../../components/MasterManagement/MasterTable';
import MasterForm from '../../components/MasterManagement/MasterForm';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { useSnackbar } from '../../context/SnackbarContext';
import '../Common.css';

const ManageMasters = () => {
  const { success, error: showError } = useSnackbar();
  const [selectedMasterType, setSelectedMasterType] = useState('smtype');
  const [records, setRecords] = useState([]);
  const [aggregates, setAggregates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({ search: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const searchTimeoutRef = useRef(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, recordId: null });

  // Master type options
  const masterTypeOptions = [
    { value: 'region', label: 'Region Master' },
    { value: 'regioncenter', label: 'Regional Center Master' },
    { value: 'countries', label: 'Country Master' },
    { value: 'model', label: 'Model Master' },
    { value: 'smtype', label: 'SM Type Master' },
    { value: 'aggregate', label: 'Aggregate Master' },
    { value: 'subaggregate', label: 'Sub Aggregate Master' },
    { value: 'categories', label: 'Categories Master' }
  ];

  // Get display name for master type
  const getMasterTypeLabel = (type) => {
    const option = masterTypeOptions.find(opt => opt.value === type);
    return option ? option.label : type;
  };

  // Debounce search input
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput }));
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchInput]);


  // Load data when master type or filters change
  useEffect(() => {
    loadData();
    setCurrentPage(1);
  }, [selectedMasterType, filters]);

  const loadAggregates = async () => {
    try {
      const data = await masterService.getAll('aggregate', { isActive: 1 });
      setAggregates(data);
    } catch (error) {
      console.error('Failed to load aggregates:', error);
      showError('Failed to load aggregates');
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await masterService.getAll(selectedMasterType, {
        isActive: 1,
        ...(filters.search && { search: filters.search })
      });
      setRecords(data);
    } catch (error) {
      console.error('Failed to load data:', error);
      showError('Failed to load master data');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingRecord(null);
    setShowForm(true);
  };

  const handleEdit = async (record) => {
    try {
      const fullRecord = await masterService.getById(selectedMasterType, record.id);
      setEditingRecord(fullRecord);
      setShowForm(true);
    } catch (error) {
      console.error('Failed to load record data:', error);
      showError('Failed to load record data for editing');
    }
  };

  const handleDelete = (id) => {
    setConfirmModal({ isOpen: true, recordId: id });
  };

  const confirmDelete = async () => {
    const recordId = confirmModal.recordId;
    setConfirmModal({ isOpen: false, recordId: null });
    
    try {
      await masterService.delete(selectedMasterType, recordId);
      success('Record deleted successfully');
      loadData();
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to delete record');
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingRecord) {
        await masterService.update(selectedMasterType, editingRecord.id, formData);
        success('Record updated successfully');
      } else {
        await masterService.create(selectedMasterType, formData);
        success('Record created successfully');
      }
      setShowForm(false);
      setEditingRecord(null);
      loadData();
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to save record');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingRecord(null);
  };

  const handleClear = () => {
    setSearchInput('');
    setFilters({ search: '' });
    setCurrentPage(1);
  };

  // Pagination calculations
  const totalRecords = records.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const displayedRecords = records.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="p-0 min-h-[calc(100vh-0px)] bg-transparent w-full">
        <div className="text-center py-8 text-gray-600">Loading master data...</div>
      </div>
    );
  }

  return (
    <div className="">
      <style>{`
        .master-table-container::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        .master-table-container {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}</style>
      <div className="bg-white rounded-[10px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            Manage Master
            <span className="text-gray-400 ml-1.5 font-normal">({totalRecords} Records)</span>
          </h2>
        </div>

        {/* Main Content Area */}
        <div className="flex gap-6">
          {/* Left Panel - Master Type Dropdown */}
          <div className="w-64 flex-shrink-0">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Select Master Type
            </label>
            <div className="relative">
              <select
                value={selectedMasterType}
                onChange={(e) => setSelectedMasterType(e.target.value)}
                className="w-full py-3.5 px-4 border-2 border-gray-200 rounded-lg text-[0.95rem] transition-all duration-300 bg-bg-secondary text-text-primary font-sans hover:border-gray-300 hover:bg-white focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 appearance-none bg-[url('data:image/svg+xml,%3Csvg_width=\'12\'_height=\'8\'_viewBox=\'0_0_12_8\'_fill=\'none\'_xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath_d=\'M1_1L6_6L11_1\'_stroke=\'%236b7280\'_stroke-width=\'1.5\'_stroke-linecap=\'round\'_stroke-linejoin=\'round\'/%3E%3C/svg%3E')] bg-no-repeat bg-[right_0.75rem_center]"
              >
                {masterTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Panel - Table and Controls */}
          <div className="flex-1">
            {/* Action Buttons/Search */}
            <div className="flex justify-between items-center mb-4">
              <button 
                className="flex items-center gap-1.5 px-4 py-2
                 border border-[var(--Strokes-Primary,#D80C0C)]
                 rounded-lg bg-white
                 text-[var(--Strokes-Primary,#D80C0C)]
                 shadow-[0px_1px_2px_0px_#0000000D] border-common hover:bg-[#fff3f3]"
                onClick={handleAdd}
              >
                <span>+</span>
                Add {getMasterTypeLabel(selectedMasterType).replace(' Master', '')}
              </button>
              <div className="flex items-center gap-3">
                
                <input
                  type="text"
                  placeholder="Search by code or name"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  className="w-60 h-18 px-4 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 transition-all duration-200 focus:outline-none focus:border-danger focus:ring-2 focus:ring-danger/10 placeholder:text-gray-400"
                />
                {searchInput && (
                  <button 
                    className="h-18 px-4 border border-[#ff3b3b] text-[#ff3b3b] bg-white rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-[#fff3f3] border-common"
                    onClick={handleClear}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Table */}
            <div 
              className="border border-gray-200 rounded-lg overflow-hidden master-table-container" 
              style={{ 
                height: 'calc(100vh - 370px)', 
                overflowY: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              <MasterTable
                masterType={selectedMasterType}
                records={displayedRecords}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>

            {/* Footer with Results Count and Pagination */}
            <div className="flex justify-between items-center mt-4">
              {totalRecords > 0 && (
                <span className="text-gray-500 text-sm">
                  Showing {Math.min(endIndex, totalRecords)} results out of {totalRecords}
                </span>
              )}
              {totalRecords === 0 && <div></div>}
              {totalRecords > 0 && (
                <div className="flex gap-2 items-center">
                  <button className="w-8 h-8 border border-gray-300 bg-white rounded-md text-sm font-medium text-gray-700 flex items-center justify-center" style={{ border: '0.8px solid #D1D5DC' }}>
                    {currentPage}
                  </button>
                  <span className="text-sm text-gray-700">of {totalPages}</span>
                  <div className="flex border border-gray-300 rounded-md overflow-hidden">
                    <button
                      className="w-8 h-8 bg-white border-r border-gray-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white text-sm font-medium flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => p - 1)}
                    >
                      ‹
                    </button>
                    <button
                      className="w-8 h-8 bg-gray-100 cursor-pointer text-sm rounded-none font-medium flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => p + 1)}
                    >
                      ›
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MasterForm Modal */}
        {showForm && (
          <MasterForm
            masterType={selectedMasterType}
            record={editingRecord}
            aggregates={aggregates}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        )}

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ isOpen: false, recordId: null })}
          onConfirm={confirmDelete}
          title="Delete Record"
          message="Are you sure you want to delete this record? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      </div>
    </div>
  );
};

export default ManageMasters;

import React, { useState } from 'react';

const CFTMasterRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const totalRecords = 20;

  // Sample data - replace with actual data from API
  const sampleData = [
    { id: 1, d2sStatus: 'Synced', cftNumber: '879', wscCode: ['C00-011', 'C00-01'], kitPartNumber: 'HT014', kitPartsQty: 4, accountingOrder: 'RC-01-NZ-879', segment: 'RC-05', country: 'NZ, Taiwan', model: 'Light Truck' },
    { id: 2, d2sStatus: 'Pending', cftNumber: '879', wscCode: ['C00-011'], kitPartNumber: 'HT014', kitPartsQty: 4, accountingOrder: 'RC-01-NZ-879', segment: 'RC-05', country: 'NZ, Taiwan', model: 'Light Truck' },
    { id: 3, d2sStatus: 'Synced', cftNumber: '879', wscCode: ['C00-011', 'C00-01', 'C00-011'], kitPartNumber: 'HT014', kitPartsQty: 4, accountingOrder: 'RC-01-NZ-879', segment: 'RC-05', country: 'NZ, Taiwan', model: 'Light Truck' },
    { id: 4, d2sStatus: 'Pending', cftNumber: '879', wscCode: ['C00-011', 'C00-01'], kitPartNumber: 'HT014', kitPartsQty: 4, accountingOrder: 'RC-01-NZ-879', segment: 'RC-05', country: 'NZ, Taiwan', model: 'Light Truck' },
    { id: 5, d2sStatus: 'Synced', cftNumber: '879', wscCode: ['C00-011'], kitPartNumber: 'HT014', kitPartsQty: 4, accountingOrder: 'RC-01-NZ-879', segment: 'RC-05', country: 'NZ, Taiwan', model: 'Light Truck' },
    { id: 6, d2sStatus: 'Pending', cftNumber: '879', wscCode: ['C00-011', 'C00-01'], kitPartNumber: 'HT014', kitPartsQty: 4, accountingOrder: 'RC-01-NZ-879', segment: 'RC-05', country: 'NZ, Taiwan', model: 'Light Truck' },
    { id: 7, d2sStatus: 'Synced', cftNumber: '879', wscCode: ['C00-011'], kitPartNumber: 'HT014', kitPartsQty: 4, accountingOrder: 'RC-01-NZ-879', segment: 'RC-05', country: 'NZ, Taiwan', model: 'Light Truck' },
    { id: 8, d2sStatus: 'Pending', cftNumber: '879', wscCode: ['C00-011', 'C00-01', 'C00-011'], kitPartNumber: 'HT014', kitPartsQty: 4, accountingOrder: 'RC-01-NZ-879', segment: 'RC-05', country: 'NZ, Taiwan', model: 'Light Truck' },
    { id: 9, d2sStatus: 'Synced', cftNumber: '879', wscCode: ['C00-011', 'C00-01'], kitPartNumber: 'HT014', kitPartsQty: 4, accountingOrder: 'RC-01-NZ-879', segment: 'RC-05', country: 'NZ, Taiwan', model: 'Light Truck' },
    { id: 10, d2sStatus: 'Pending', cftNumber: '879', wscCode: ['C00-011'], kitPartNumber: 'HT014', kitPartsQty: 4, accountingOrder: 'RC-01-NZ-879', segment: 'RC-05', country: 'NZ, Taiwan', model: 'Light Truck' },
  ];

  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const displayedData = sampleData.slice(startIndex, endIndex);

  const handleClear = () => {
    setSearchTerm('');
    setDateRange('');
  };

  return (
    <div className="p-0 min-h-[calc(100vh-0px)] bg-transparent w-full">
      <div className="mb-8 px-2">
        <h1 className="text-text-primary mb-3 text-3xl font-semibold tracking-tight">
          CFT Master Records <span className="font-normal text-2xl text-text-secondary">({totalRecords} Records)</span>
        </h1>
      </div>
      <div className="max-w-[1400px] mx-auto w-full">
        <div className="flex justify-between items-center gap-6 mb-6 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <div className="relative flex items-center">
              <svg className="absolute left-4 text-gray-400 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M15 15L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search by CFT Number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 px-4 pl-12 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 transition-all duration-200 focus:outline-none focus:border-danger focus:ring-2 focus:ring-danger/10"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium cursor-pointer transition-all duration-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 min-w-[80px]">Today</button>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="dd/mm/yyyy - dd/mm/yyyy"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-3 pr-12 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 min-w-[220px] transition-all duration-200 focus:outline-none focus:border-danger focus:ring-2 focus:ring-danger/10"
              />
              <svg className="absolute right-4 text-gray-400 pointer-events-none" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M3 8H17" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M7 2V6M13 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <button className="w-11 h-11 p-0 border border-gray-300 rounded-lg bg-white text-gray-500 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-gray-400">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="5" cy="10" r="2" fill="currentColor"/>
                <circle cx="10" cy="10" r="2" fill="currentColor"/>
                <circle cx="15" cy="10" r="2" fill="currentColor"/>
                <line x1="3" y1="10" x2="3" y2="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="7" y1="10" x2="7" y2="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="13" y1="10" x2="13" y2="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="17" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
            <button className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium cursor-pointer transition-all duration-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 min-w-[80px]" onClick={handleClear}>Clear</button>
            <button className="px-6 py-3 border-none rounded-lg bg-danger text-white text-sm font-semibold cursor-pointer transition-all duration-200 whitespace-nowrap hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-lg">+ Create New CFT Number</button>
          </div>
        </div>

        <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-6 max-md:overflow-x-auto">
          <table className="w-full border-collapse bg-white">
            <thead className="bg-bg-secondary border-b border-border">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider relative whitespace-nowrap">
                  D2S Synced Status
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider relative whitespace-nowrap">
                  CFT Number
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider relative whitespace-nowrap">
                  WSC Code
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider relative whitespace-nowrap">
                  Kit Part Number
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider relative whitespace-nowrap">
                  Kit Parts Qty.
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider relative whitespace-nowrap">
                  Accounting Order
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider relative whitespace-nowrap">
                  Segment
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider relative whitespace-nowrap">
                  Country
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider relative whitespace-nowrap">
                  Model
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider relative whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedData.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 transition-colors duration-200 hover:bg-bg-secondary">
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {row.d2sStatus === 'Synced' ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold bg-green-100 text-green-800">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="8" cy="8" r="6" fill="#10b981"/>
                          <path d="M5 8L7 10L11 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Synced
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold bg-yellow-100 text-yellow-800">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="8" cy="8" r="6" fill="#f59e0b"/>
                          <path d="M8 5V8L10 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{row.cftNumber}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    <div className="flex flex-wrap gap-2">
                      {row.wscCode.map((code, idx) => (
                        <span key={idx} className="px-3 py-1 bg-bg-tertiary text-gray-700 rounded-md text-xs font-medium">{code}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{row.kitPartNumber}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{row.kitPartsQty}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{row.accountingOrder}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    <span className="px-3 py-1 bg-bg-tertiary text-gray-700 rounded-md text-xs font-medium">{row.segment}</span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{row.country}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{row.model}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    <div className="flex gap-2">
                      <button className="w-8 h-8 flex items-center justify-center border-none rounded-md cursor-pointer transition-all duration-200 bg-transparent text-danger p-0 hover:bg-red-100">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11.333 2.667C11.5084 2.49167 11.7163 2.40417 11.9567 2.40417C12.1971 2.40417 12.405 2.49167 12.5803 2.66667L13.333 3.41933C13.5084 3.59467 13.5961 3.80256 13.5961 4.043C13.5961 4.28344 13.5084 4.49133 13.333 4.66667L6.66667 11.333L3.33333 12L4 8.66667L11.333 2.667Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center border-none rounded-md cursor-pointer transition-all duration-200 bg-transparent text-danger p-0 hover:bg-red-100">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center py-4">
          <div className="text-sm text-text-secondary">
            Showing {startIndex + 1}-{Math.min(endIndex, totalRecords)} results out of {totalRecords}
          </div>
          <div className="flex items-center gap-4">
            <button
              className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-md bg-white text-gray-700 cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="text-sm text-gray-700 font-medium">{currentPage} of {totalPages}</span>
            <button
              className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-md bg-white text-gray-700 cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CFTMasterRecords;


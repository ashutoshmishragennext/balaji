/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { useState, useEffect } from 'react';
import { Download,  Search } from 'lucide-react';

interface FormData {
  id: string;
  companyName: string;
  personName: string;
  phone: string;
  email: string;
  make: string | null;
  model: string | null;
  technicalSupport: string[];
  newMachineModel: string | null;
  eventName: string | null;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  forms: FormData[];
  message?: string;
}

export default function FormsPage() {
  const [forms, setForms] = useState<FormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [downloadMessage, setDownloadMessage] = useState('');
  const [recordCount, setRecordCount] = useState(0);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');

  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/get-form');
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const data: ApiResponse = await response.json();
        if (data.success && Array.isArray(data.forms)) {
          setForms(data.forms);
        } else {
          setError(data.message || 'Failed to fetch forms');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching forms');
        setForms([]);
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  const filtepurpleForms = (forms || []).filter(form =>
    form.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.personName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.phone?.includes(searchTerm) ||
    (form.make && form.make.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (form.model && form.model.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filtepurpleForms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentForms = filtepurpleForms.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const downloadExcel = async () => {
    const XLSX = await import('xlsx');
    setIsDownloading(true);
    setDownloadStatus('idle');
    setDownloadMessage('');
    try {
      let formsToExport = forms;
      if (startDate) {
        const start = new Date(startDate);
        formsToExport = formsToExport.filter(f => new Date(f.createdAt) >= start);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        formsToExport = formsToExport.filter(f => new Date(f.createdAt) <= end);
      }
      if (companyFilter.trim()) {
        formsToExport = formsToExport.filter(f =>
          f.companyName.toLowerCase().includes(companyFilter.toLowerCase().trim())
        );
      }
      if (formsToExport.length === 0) throw new Error('No records found');

      const excelData = formsToExport.map((f, i) => ({
        'S.No': i + 1,
        'Company Name': f.companyName || '',
        'Person Name': f.personName || '',
        'Phone': f.phone || '',
        'Email': f.email || '',
        'Make': f.make || '',
        'Model': f.model || '',
        'Tech Support': Array.isArray(f.technicalSupport) ? f.technicalSupport.join(', ') : '',
        'New Model': f.newMachineModel || '',
        'Event': f.eventName || '',
        'Remarks': f.remarks || '',
        'Submission Date': f.createdAt ? new Date(f.createdAt).toLocaleDateString('en-IN') : '',
      }));

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      worksheet['!cols'] = [{ wch: 5 }, { wch: 20 }, { wch: 18 }, { wch: 12 }, { wch: 22 }, { wch: 12 }, { wch: 12 }, { wch: 25 }, { wch: 15 }, { wch: 12 }, { wch: 30 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Forms');

      const filename = `India_CORR_Expo_2025.xlsx`;
      XLSX.writeFile(workbook, filename);

      setDownloadStatus('success');
      setDownloadMessage(`Downloaded ${formsToExport.length} records`);
      setRecordCount(formsToExport.length);
    } catch (e: any) {
      setDownloadStatus('error');
      setDownloadMessage(e.message || 'Download failed');
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (error) return <div className="flex h-screen items-center justify-center text-purple-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
          <div className='m-auto'>
            <img src="/logo.jpg" alt="" height={100} width={100} className='m-auto' />
          </div>

          {/* Excel Export */}
          {/* <div className="bg-white border border-purple-200 rounded-lg p-3 shadow-sm w-full sm:w-72">
            <div className="flex items-center gap-2 mb-2">
              <FileSpreadsheet className="w-5 h-5 text-purple-500" />
              <h3 className="text-sm font-semibold text-gray-700">Export</h3>
            </div>
            <div className="flex flex-col gap-2">
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full text-sm border border-purple-200 rounded px-2 py-1" />
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full text-sm border border-purple-200 rounded px-2 py-1" />
              <input type="text" value={companyFilter} onChange={e => setCompanyFilter(e.target.value)} placeholder="Filter by company" className="w-full text-sm border border-purple-200 rounded px-2 py-1" />
              <button onClick={downloadExcel} disabled={isDownloading} className={`w-full flex items-center justify-center gap-2 px-3 py-1.5 text-sm rounded-md font-medium ${isDownloading ? 'bg-gray-300 text-gray-600' : 'bg-purple-500 text-white hover:bg-purple-600'}`}>
                <Download className="w-4 h-4" /> {isDownloading ? 'Preparing...' : 'Download Excel'}
              </button>
              {downloadStatus !== 'idle' && (
                <div className={`text-xs p-1.5 rounded border ${downloadStatus === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>
                  {downloadMessage}
                </div>
              )}
            </div>
          </div> */}
          
        </div>
        <div className="bg-white border border-purple-200 rounded-lg p-3 shadow-sm w-full flex flex-wrap items-center gap-2">
  {/* Header */}
  <div className="flex items-center gap-2 pr-3 border-r border-purple-200">
      <div className="flex items-center gap-2 ">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by company, person, email, etc."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm border border-purple-200 rounded focus:ring-1 focus:ring-purple-400"
            />
            <Search className="absolute left-2 top-1.5 w-4 h-4 text-gray-400" />
          </div>
          <span className="text-xs text-gray-500">Showing {currentForms.length}/{filtepurpleForms.length}</span>
        </div>
    
  </div>
<div className="flex flex-wrap items-center gap-2 flex-1 justify-end">
  {/* Filters */}
  {/* <input
    type="date"
    value={startDate}
    onChange={e => setStartDate(e.target.value)}
    className="text-sm border border-purple-200 rounded px-2 py-1"
  />
  <span className="text-gray-500 text-xs">to</span>
  <input
    type="date"
    value={endDate}
    onChange={e => setEndDate(e.target.value)}
    className="text-sm border border-purple-200 rounded px-2 py-1"
  />
 */}

  {/* Button */}
  <button
    onClick={downloadExcel}
    disabled={isDownloading}
    className={`flex items-center justify-center gap-2 px-3 py-1.5 text-sm rounded-md font-medium ${
      isDownloading
        ? 'bg-gray-300 text-gray-600'
        : 'bg-purple-500 text-white hover:bg-purple-600'
    }`}
  >
    <Download className="w-4 h-4" />
    {isDownloading ? 'Preparing...' : 'Download Excel'}
  </button>

  {/* Status */}
  {downloadStatus !== 'idle' && (
    <div
      className={`text-xs px-2 py-1 rounded border ${
        downloadStatus === 'success'
          ? 'bg-green-50 text-green-700 border-green-200'
          : 'bg-purple-50 text-purple-700 border-purple-200'
      }`}
    >
      {downloadMessage}
    </div>
  )}
</div>
</div>

        {/* Search */}
      

        {/* Table */}
        <div className="bg-white border border-purple-200 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-purple-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Company & Person</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Contact</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Machine</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Support</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Event & Remarks</th>
                </tr>
              </thead>
              <tbody>
                {currentForms.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-gray-500">No results</td>
                  </tr>
                ) : currentForms.map(f => (
                  <tr key={f.id} className="hover:bg-purple-50">
                    <td className="px-4 py-2">{f.companyName}<br /><span className="text-gray-500 text-xs">{f.personName}</span></td>
                    <td className="px-4 py-2">{f.email}<br /><span className="text-gray-500 text-xs">{f.phone}</span></td>
                    <td className="px-4 py-2">{f.make || f.model || f.newMachineModel || <span className="text-gray-400 italic">N/A</span>}</td>
                    <td className="px-4 py-2">{f.technicalSupport?.length ? f.technicalSupport.join(', ') : <span className="text-gray-400 italic">None</span>}</td>
                    <td className="px-4 py-2">{f.eventName || ''} {f.remarks && <div className="text-gray-500 text-xs truncate">{f.remarks}</div>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-1">
            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-2 py-1 text-sm border border-purple-200 rounded disabled:opacity-50">Prev</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-2 py-1 text-sm border ${currentPage === i + 1 ? 'bg-purple-100 border-purple-300 text-purple-600' : 'border-purple-200'}`}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-2 py-1 text-sm border border-purple-200 rounded disabled:opacity-50">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
import { db } from "@/db";
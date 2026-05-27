import React, { useState } from 'react';
import { XMarkIcon, ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

const ImportExportModal = ({ 
  isOpen, 
  onClose, 
  onImport, 
  onExport,
  filters = null,
  isLoading = false 
}) => {
  const [activeTab, setActiveTab] = useState('import');
  const [file, setFile] = useState(null);
  const [format, setFormat] = useState('csv');
  const [importType, setImportType] = useState('upsert');
  const [importResult, setImportResult] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleImport = async () => {
    if (!file) {
      alert('Please select a file to import');
      return;
    }

    try {
      const result = await onImport(file, importType);
      setImportResult(result);
      // Don't close immediately - show result
    } catch (error) {
      console.error('Import failed:', error);
      alert(`Import failed: ${error.message}`);
    }
  };

  const handleExport = async () => {
    try {
      await onExport(format, filters);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      alert(`Export failed: ${error.message}`);
    }
  };

  const handleClose = () => {
    setFile(null);
    setImportResult(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={handleClose}></div>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {activeTab === 'import' ? 'Import Products' : 'Export Products'}
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500"
                disabled={isLoading}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('import')}
                  disabled={isLoading}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'import'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 disabled:opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ArrowUpTrayIcon className="h-4 w-4" />
                    Import
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('export')}
                  disabled={isLoading}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'export'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 disabled:opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    Export
                  </div>
                </button>
              </nav>
            </div>

            {/* Content */}
            {activeTab === 'import' ? (
              <div>
                {importResult ? (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Import Successful!</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>Successfully imported: {importResult.successCount || 0} products</li>
                      {importResult.errorCount > 0 && (
                        <li>Failed: {importResult.errorCount} products</li>
                      )}
                      {importResult.updatedCount > 0 && (
                        <li>Updated: {importResult.updatedCount} existing products</li>
                      )}
                      {importResult.createdCount > 0 && (
                        <li>Created: {importResult.createdCount} new products</li>
                      )}
                    </ul>
                    <button
                      onClick={handleClose}
                      className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Import Type
                      </label>
                      <select
                        value={importType}
                        onChange={(e) => setImportType(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        disabled={isLoading}
                      >
                        <option value="upsert">Update existing and add new</option>
                        <option value="create">Only add new products</option>
                        <option value="update">Only update existing products</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        File Format
                      </label>
                      <select
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        disabled={isLoading}
                      >
                        <option value="csv">CSV</option>
                        <option value="json">JSON</option>
                        <option value="excel">Excel (.xlsx)</option>
                      </select>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload File
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                              <span>Upload a file</span>
                              <input
                                type="file"
                                className="sr-only"
                                onChange={handleFileChange}
                                accept={format === 'csv' ? '.csv' : format === 'json' ? '.json' : '.xlsx,.xls'}
                                disabled={isLoading}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            {format === 'csv' && 'CSV up to 10MB'}
                            {format === 'json' && 'JSON up to 10MB'}
                            {format === 'excel' && 'Excel up to 10MB'}
                          </p>
                        </div>
                      </div>
                      {file && (
                        <div className="mt-2 text-sm text-gray-600">
                          Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                      )}
                    </div>

                    <div className="text-sm text-gray-600 mb-6">
                      <p className="font-medium mb-1">Required fields for import:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><code>name</code> (Product name)</li>
                        <li><code>sku</code> (Stock Keeping Unit)</li>
                        <li><code>price</code> (Base price)</li>
                        <li><code>quantity</code> (Stock quantity)</li>
                      </ul>
                      <p className="mt-2">Optional fields: <code>description</code>, <code>category</code>, <code>brand</code>, <code>salePrice</code>, etc.</p>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={handleClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleImport}
                        disabled={!file || isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Importing...' : 'Import Products'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Export Format
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    disabled={isLoading}
                  >
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                    <option value="excel">Excel (.xlsx)</option>
                  </select>
                </div>

                <div className="text-sm text-gray-600 mb-6">
                  <p className="font-medium mb-1">Export includes:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Product details (name, description, SKU)</li>
                    <li>Pricing information</li>
                    <li>Inventory levels</li>
                    <li>Category and brand information</li>
                    <li>Status flags (active, featured, on sale)</li>
                    {filters && (
                      <li className="text-blue-600">
                        Note: Current filters will be applied to export
                      </li>
                    )}
                  </ul>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExport}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Exporting...' : 'Export Products'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportExportModal;


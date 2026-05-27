import React, { useState } from 'react';
import { Download, FileText, BarChart2, PieChart, Calendar, Filter, Printer } from 'lucide-react';

const ReportsView = () => {
  const [selectedReport, setSelectedReport] = useState('sales');
  const [dateRange, setDateRange] = useState('month');

  const reports = [
    {
      id: 'sales',
      title: 'Sales Report',
      description: 'Detailed sales breakdown by product, category, and time period',
      icon: BarChart2,
      lastGenerated: '2026-01-01 ',
      frequency: 'Daily'
    },
    {
      id: 'inventory',
      title: 'Inventory Report',
      description: 'Stock levels, turnover rates, and reorder recommendations',
      icon: PieChart,
      lastGenerated: '2026-01-01 ',
      frequency: 'Weekly'
    },
    {
      id: 'customer',
      title: 'Customer Report',
      description: 'Customer acquisition, retention, and lifetime value analysis',
      icon: FileText,
      lastGenerated: '2026-01-01 ',
      frequency: 'Monthly'
    },
    {
      id: 'financial',
      title: 'Financial Report',
      description: 'Revenue, expenses, profit margins, and financial projections',
      icon: FileText,
      lastGenerated: '2026-01-01 ',
      frequency: 'Monthly'
    },
  ];

  const generateReport = () => {
    alert(`Generating ${selectedReport} report for ${dateRange}...`);
  };

  return (
    <div className="container-fluid p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </button>
          <button 
            onClick={generateReport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Report Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                selectedReport === report.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center mb-3">
                <div className={`p-2 rounded-lg ${
                  selectedReport === report.id ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    selectedReport === report.id ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                </div>
              </div>
              <h3 className="font-semibold mb-1">{report.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{report.description}</p>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Last: {report.lastGenerated}</span>
                <span>{report.frequency}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Report Configuration */}
      <div className="bg-white rounded-xl p-6 shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Report Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Date Range</label>
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Format</label>
            <select className="w-full px-3 py-2 border rounded-lg">
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Filters</label>
            <button className="w-full px-3 py-2 border rounded-lg hover:bg-gray-50 flex items-center justify-center">
              <Filter className="w-4 h-4 mr-2" />
              Add Filters
            </button>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-white rounded-xl p-6 shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Report Preview</h2>
          <button className="px-4 py-2 text-blue-600 hover:text-blue-800 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Download Sample
          </button>
        </div>
        <div className="border rounded-lg p-8 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {reports.find(r => r.id === selectedReport)?.title}
          </h3>
          <p className="text-gray-500 mb-4">
            Configure your report settings and generate to view the preview
          </p>
          <div className="text-sm text-gray-400">
            Last generated: {reports.find(r => r.id === selectedReport)?.lastGenerated}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
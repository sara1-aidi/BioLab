'use client'
export default function CalendarFilters({
  statusFilter,
  showHighPriority,
  dateRange,
  toggleStatusFilter,
  setShowHighPriority,
  setDateRange,
  clearFilters,
  closeFilters
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <h3 className="text-sm font-medium text-[var(--text-blue-dark)] mb-2">Status</h3>
          <div className="space-y-2">
            {['pending', 'approved', 'completed', 'canceled'].map(status => (
              <label key={status} className="flex items-center">
                <input
                  type="checkbox"
                  checked={statusFilter.includes(status)}
                  onChange={() => toggleStatusFilter(status)}
                  className="h-4 w-4 text-[var(--pastel-blue-dark)] focus:ring-[var(--pastel-blue-medium)] border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-[var(--text-blue-medium)] capitalize">{status}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-[var(--text-blue-dark)] mb-2">Priority</h3>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showHighPriority}
              onChange={() => setShowHighPriority(!showHighPriority)}
              className="h-4 w-4 text-[var(--pastel-blue-dark)] focus:ring-[var(--pastel-blue-medium)] border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-[var(--text-blue-medium)]">Show only high priority</span>
          </label>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-sm font-medium text-[var(--text-blue-dark)] mb-2">Date Range</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="date"
                value={dateRange.start?.toISOString().split('T')[0] || ''}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value ? new Date(e.target.value) : null }))}
                className="block w-full px-3 py-2 border border-[var(--pastel-blue-medium)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--pastel-blue-dark)] focus:border-transparent"
              />
            </div>
            <div>
              <input
                type="date"
                value={dateRange.end?.toISOString().split('T')[0] || ''}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value ? new Date(e.target.value) : null }))}
                className="block w-full px-3 py-2 border border-[var(--pastel-blue-medium)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--pastel-blue-dark)] focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4 space-x-3">
        <button
          onClick={clearFilters}
          className="px-4 py-2 text-sm font-medium text-[var(--text-blue-medium)] hover:text-[var(--text-blue-dark)]"
        >
          Clear All
        </button>
        <button
          onClick={closeFilters}
          className="px-4 py-2 bg-[var(--pastel-blue-dark)] text-white text-sm font-medium rounded-lg hover:bg-[var(--pastel-blue-medium)]"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
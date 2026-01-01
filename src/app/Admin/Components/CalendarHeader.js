'use client'
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon, CalendarIcon, ListBulletIcon } from "@heroicons/react/24/outline";

export default function CalendarHeader({
  viewMode,
  setViewMode,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setShowFilters
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode('calendar')}
          className={`p-2 rounded-lg ${viewMode === 'calendar' ? 'bg-[var(--pastel-blue-dark)] text-white' : 'bg-white text-[var(--text-blue-medium)]'}`}
        >
          <CalendarIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-[var(--pastel-blue-dark)] text-white' : 'bg-white text-[var(--text-blue-medium)]'}`}
        >
          <ListBulletIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="relative flex-1 md:w-64">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search patient or ID..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--pastel-blue-dark)] focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      <button
        onClick={() => setShowFilters(prev => !prev)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
      >
        <FunnelIcon className="h-5 w-5 text-[var(--text-blue-medium)]" />
        <span className="text-sm font-medium">Filters</span>
        {filterStatus > 0 && (
          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-[var(--pastel-blue-dark)] rounded-full">
            {filterStatus}
          </span>
        )}
      </button>
    </div>
  );
}
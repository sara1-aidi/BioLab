'use client';
import StatWidgets from '../Components/StatWidgets';
import TestsLineChart from '../Components/TestsLineChart';
import PerformanceSummary from '../Components/PerformanceSummary';
import RecentTestsCard from '../Components/RecentTestsCard';
import NotificationsFeed from '../Components/NotificationsFeed';
import TopStaffCard from '../Components/TopStaffCard';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 text-sm sm:text-base">Overview of lab activity and performance</p>
          </div>
          <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            Generate Report
          </button>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatWidgets />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column (2/3 width on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Test Trends Chart */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Test Volume Trends</h2>
              <div className="h-64 sm:h-80">
                <TestsLineChart />
              </div>
            </div>

            {/* Performance Overview */}
            <PerformanceSummary />

            {/* Recent Tests Table */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm overflow-x-auto">
              <RecentTestsCard />
            </div>
          </div>

          {/* Right Column (1/3 width on large screens) */}
          <div className="space-y-6">
            {/* Notifications Panel */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
              <NotificationsFeed />
            </div>

            {/* Top Performing Staff */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
              <TopStaffCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
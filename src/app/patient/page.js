"use client";

export default function Dashboard({ children }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Page Content Only - No Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
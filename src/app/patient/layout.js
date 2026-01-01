'use client';

import { useState } from 'react';
import Sidebar from './components/Sidebar';

export default function PatientLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className={`flex-1 transition-all duration-300 ${
        sidebarOpen ? 'ml-0' : 'md:ml-64'
      }`}>
        {/* Main content area with enhanced spacing */}
        <main className="p-6 pb-12"> {/* Increased bottom padding */}
          <div className="mx-auto max-w-[1800px]"> {/* Wider container with auto margins */}
            <div className="mb-8"> {/* Added bottom margin to content wrapper */}
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
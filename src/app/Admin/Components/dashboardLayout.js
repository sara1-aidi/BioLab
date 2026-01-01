'use client';
import { useState } from 'react';
import Link from 'next/link';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-blue-800 text-white transition-all duration-300`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">LabAdmin</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-lg hover:bg-blue-700">
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        <nav className="mt-6">
          <NavItem icon="📊" text="Dashboard" href="/Admin/dashboard" active sidebarOpen={sidebarOpen} />
          <NavItem icon="🧪" text="Scan" href="/Admin/send-scan" sidebarOpen={sidebarOpen} />
          <NavItem icon="👨‍🔬" text="Appointements" href="/Admin/appointements" sidebarOpen={sidebarOpen} />
          <NavItem icon="🧑‍⚕️" text="Patients" href="/Admin/users" sidebarOpen={sidebarOpen} />
          <NavItem icon="📦" text="Knowledge" href="/Admin/faq" sidebarOpen={sidebarOpen} />
          <NavItem icon="⚙️" text="contact" href="/Admin/contact" sidebarOpen={sidebarOpen} />
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Dashboard Overview</h2>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
              <span className="text-gray-600">🔔</span>
            </button>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">AD</div>
              {sidebarOpen && <span className="ml-2">Admin</span>}
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

const NavItem = ({ icon, text, href, active, sidebarOpen }) => (
  <Link href={href}>
    <div className={`flex items-center p-3 mx-2 my-1 rounded-lg cursor-pointer ${active ? 'bg-blue-700' : 'hover:bg-blue-700'}`}>
      <span className="text-xl">{icon}</span>
      {sidebarOpen && <span className="ml-3">{text}</span>}
    </div>
  </Link>
);

export default DashboardLayout;
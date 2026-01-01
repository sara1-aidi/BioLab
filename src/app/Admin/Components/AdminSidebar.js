"use client";

import Link from 'next/link';

export default function AdminSidebar() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Accounts</h2>
      <nav className="space-y-2">
        <Link href="/admin/users" className="block px-4 py-2 hover:bg-gray-100 rounded">Liste utilisateurs</Link>
        <Link href="/admin/users/new" className="block px-4 py-2 hover:bg-gray-100 rounded">
        Add a profilel
        </Link>
        <Link href="/admin/users/123" className="block px-4 py-2 hover:bg-gray-100 rounded">Profile</Link>
        <Link href="/admin/send-scan" className="block px-4 py-2 hover:bg-gray-100 rounded">Send Scan</Link>
      </nav>
    </div>
  );
}

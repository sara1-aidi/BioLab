'use client';

import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut, SignUpButton } from '@clerk/nextjs';
import Link from 'next/link';
import PatientTopBar from './patienttopbar';

export default function AppBar() {
  const pathname = usePathname();

  // Don't show default app bar for patient routes
  if (pathname.startsWith('/patient')) {
    return <PatientTopBar />;
  }

  // Default app bar for all other routes
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">My App</Link>
        
        <SignedOut>
          <SignUpButton mode="modal">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
        
        <SignedIn>
          <div className="flex items-center gap-4">
            <Link href="/patient" className="text-gray-700 hover:text-blue-600">
              Go to Patient Portal
            </Link>
          </div>
        </SignedIn>
      </div>
    </header>
  );
}
'use client';

import { useState } from 'react';
import { UserButton } from '@clerk/nextjs';
import NotificationDrawer from '../patient/components/NotificationDrawer'; // Import your existing drawer component

export default function PatientTopBar() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="container mx-auto px-4 py-3 flex justify-end items-center gap-4">
        {/* Notification Button - Replaced with your drawer component */}
        <NotificationDrawer 
          isOpen={notificationsOpen}
          setIsOpen={setNotificationsOpen}
          triggerComponent={
            <button 
              className="p-2 rounded-full hover:bg-gray-100 relative"
              aria-label="Notifications"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-gray-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          }
        />

        {/* Profile Settings */}
        <div className="flex items-center">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
}
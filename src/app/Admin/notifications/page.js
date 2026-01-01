'use client';

import React from 'react';
import {
  DocumentArrowUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const notifications = [
  {
    id: 1,
    type: 'scan',
    title: 'Nouveau scan ajouté',
    message: 'Un nouveau scan a été uploadé pour le patient X.',
    time: 'Il y a 5 min',
    read: false,
  },
  {
    id: 2,
    type: 'error',
    title: 'Erreur serveur',
    message: 'Le serveur a rencontré une erreur à 14:32.',
    time: 'Il y a 2h',
    read: true,
  },
  {
    id: 3,
    type: 'success',
    title: 'Patient enregistré',
    message: 'Le patient Y a été ajouté au système.',
    time: 'Hier',
    read: true,
  },
  {
    id: 4,
    type: 'success',
    title: 'Analyse complétée',
    message: "L'analyse du patient Z est terminée.",
    time: 'Il y a 3 jours',
    read: true,
  },
  {
    id: 5,
    type: 'scan',
    title: 'Nouveau scan reçu',
    message: 'Scan reçu pour le patient A.',
    time: 'Il y a 1 semaine',
    read: false,
  },
];

const getIcon = (type) => {
  switch (type) {
    case 'scan':
      return <DocumentArrowUpIcon className="w-6 h-6 text-blue-500 mt-1" />;
    case 'error':
      return <ExclamationTriangleIcon className="w-6 h-6 text-red-500 mt-1" />;
    case 'success':
      return <CheckCircleIcon className="w-6 h-6 text-green-500 mt-1" />;
    default:
      return null;
  }
};

const NotificationsPage = () => {
  return (
    <div className="h-screen overflow-hidden px-4 py-6 bg-gray-50">
  <h1 className="text-3xl font-bold text-blue-600 mb-6">
    All notifications
  </h1>

  <div className="bg-white rounded-2xl shadow h-[500px] overflow-y-auto pr-2">
    {notifications.length === 0 ? (
      <p className="p-6 text-center text-gray-500">No notifications</p>
    ) : (
      <div className="divide-y divide-gray-200">
        {notifications.map((notif) => (
          <Link
            key={notif.id}
            href={`/admin/notifications/${notif.id}`}
            className={`flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-all duration-150 ${
              !notif.read ? 'bg-blue-50' : 'bg-white'
            }`}
          >
            {getIcon(notif.type)}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 text-base">{notif.title}</h4>
              <p className="text-sm text-gray-600">{notif.message}</p>
              <span className="text-xs text-gray-400">{notif.time}</span>
            </div>
            {!notif.read && (
              <span className="text-xs text-blue-500 font-medium self-start mt-1">
                Unread
              </span>
            )}
          </Link>
        ))}
      </div>
    )}
  </div>
</div>

  );
};

export default NotificationsPage;

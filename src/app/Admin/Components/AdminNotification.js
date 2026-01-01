'use client';

import React, { useState } from "react";
import {
  BellIcon,
  XMarkIcon,
  DocumentArrowUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

const initialNotifications = [
  {
    id: 1,
    type: "scan",
    title: "Nouveau scan ajouté",
    message: "Un nouveau scan a été uploadé pour le patient X.",
    time: "Il y a 5 min",
    read: false,
  },
  {
    id: 2,
    type: "error",
    title: "Erreur serveur",
    message: "Le serveur a rencontré une erreur à 14:32.",
    time: "Il y a 2h",
    read: false,
  },
  {
    id: 3,
    type: "success",
    title: "Patient enregistré",
    message: "Le patient Y a été ajouté au système.",
    time: "Hier",
    read: true,
  },
];

const getIcon = (type) => {
  switch (type) {
    case "scan":
      return <DocumentArrowUpIcon className="w-6 h-6 text-blue-500" />;
    case "error":
      return <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />;
    case "success":
      return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
    default:
      return null;
  }
};

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative">
        <BellIcon className="w-7 h-7 text-gray-700 hover:text-blue-600 transition duration-200" />
        {notifications.some((n) => !n.read) && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full animate-pulse">
            {notifications.filter((n) => !n.read).length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-4 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 animate-fade-in-down">
          <div className="flex justify-between items-center px-5 py-4 border-b">
            <h3 className="text-lg font-semibold text-blue-600">Notifications</h3>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-red-500 transition">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => router.push(`/admin/notifications/${notif.id}`)}
                className={`flex items-start gap-4 px-5 py-4 cursor-pointer transition-all duration-150 ${
                  !notif.read ? "bg-blue-50" : "bg-white"
                } hover:bg-blue-100 group`}
              >
                <div className="mt-1">{getIcon(notif.type)}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-800 group-hover:text-blue-700">{notif.title}</h4>
                    {!notif.read && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notif.id);
                        }}
                        className="text-xs text-blue-500 hover:underline cursor-pointer"
                      >
                        Mark as read
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{notif.message}</p>
                  <span className="text-xs text-gray-400 mt-1 block">{notif.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 py-3 border-t bg-gray-50 flex justify-between items-center rounded-b-2xl">
            <button
              onClick={markAllAsRead}
              className="text-sm text-gray-500 hover:text-blue-600 transition"
            >
              Tout marquer comme lu
            </button>
            <button
              onClick={() => router.push("/admin-notifications")}
              className="text-sm text-blue-600 hover:underline"
            >
              See all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

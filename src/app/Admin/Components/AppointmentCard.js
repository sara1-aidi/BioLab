'use client'
import { useState } from 'react';
import {
  CurrencyDollarIcon,
  XMarkIcon,
  CheckCircleIcon,
  UserCircleIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  IdentificationIcon
} from "@heroicons/react/24/outline";

export default function AppointmentCard({ event, updateEventStatus }) {
  const [showModal, setShowModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(event?.status || 'pending');

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-600',
    approved: 'bg-[var(--pastel-green-medium)] text-[var(--pastel-green-dark)]',
    completed: 'bg-[var(--pastel-blue-medium)] text-[var(--pastel-blue-dark)]',
    canceled: 'bg-red-100 text-red-600'
  };

  if (!event) return null;

  const handleStatusUpdate = (newStatus) => {
    setCurrentStatus(newStatus);
    if (updateEventStatus && event?.id) {
      updateEventStatus(event.id, newStatus);
    }
  };

  return (
    <>
      <div 
        className="absolute p-3 rounded-lg shadow-sm cursor-pointer
                  bg-[var(--pastel-blue-light)] hover:bg-[var(--pastel-blue-medium)]
                  transition-colors border border-[var(--pastel-blue-medium)]
                  flex flex-col h-[120px] w-[260px]"
        style={{
          top: `${event.position?.top || 0}px`,
          left: `${event.position?.left || 10}px`,
          zIndex: 10
        }}
        onClick={() => setShowModal(true)}
      >
        <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <UserCircleIcon className="w-4 h-4 text-[var(--text-blue-dark)] flex-shrink-0" />
              <h3 className="font-semibold text-sm text-[var(--text-blue-dark)] truncate">
                {event.patient}
              </h3>
            </div>
            <span className={`px-2 py-0.5 text-xs rounded-full whitespace-nowrap ${statusColors[currentStatus]}`}>
              {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
            </span>
          </div>

          {/* Contact Info */}
          <div className="flex items-center gap-2 text-xs text-[var(--text-blue-medium)]">
            <EnvelopeIcon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{event.email}</span>
          </div>

          {/* Priority & Type */}
          <div className="mt-auto flex items-center justify-between">
            {event.priority === 'high' && (
              <div className="flex items-center gap-1 text-red-600 text-xs">
                <ExclamationTriangleIcon className="w-3.5 h-3.5" />
                <span>High Priority</span>
              </div>
            )}
            {event.type === 'premium' && (
              <div className="flex items-center gap-1 text-amber-600 text-xs">
                <CurrencyDollarIcon className="w-3.5 h-3.5" />
                <span>Premium</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(false);
              }}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"
            >
              <XMarkIcon className="w-6 h-6 text-[var(--text-blue-medium)]" />
            </button>

            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[var(--text-blue-dark)]">
                    {event.patient}
                    {event.type === 'premium' && (
                      <CurrencyDollarIcon className="w-6 h-6 text-amber-500 inline-block ml-2" />
                    )}
                  </h2>
                  <p className="text-[var(--text-blue-medium)]">
                    <EnvelopeIcon className="w-4 h-4 inline mr-1" />
                    {event.email}
                  </p>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full ${statusColors[currentStatus]}`}>
                  {currentStatus.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[var(--pastel-blue-light)] p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Contact Information</h3>
                  <div className="space-y-2">
                    <p><PhoneIcon className="w-4 h-4 inline mr-2" /> {event.contact}</p>
                    <p><IdentificationIcon className="w-4 h-4 inline mr-2" /> ID: {event.id}</p>
                  </div>
                </div>

                <div className="bg-[var(--pastel-green-light)] p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Appointment Details</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Doctor:</span> {event.doctor}</p>
                    <p><span className="font-medium">Reason:</span> {event.reason}</p>
                  </div>
                </div>
              </div>

              {currentStatus === 'pending' && (
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button
                    className="p-2 bg-[var(--pastel-green-light)] text-[var(--pastel-green-dark)] rounded-md hover:bg-[var(--pastel-green-medium)] flex items-center justify-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusUpdate('approved');
                    }}
                  >
                    <CheckCircleIcon className="w-5 h-5" />
                    Approve
                  </button>
                  <button
                    className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 flex items-center justify-center gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusUpdate('canceled');
                    }}
                  >
                    <XMarkIcon className="w-5 h-5" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
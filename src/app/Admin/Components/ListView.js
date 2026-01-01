'use client'
import { useState } from 'react';
import {
  ClockIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckCircleIcon,
  XMarkIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
  DocumentArrowUpIcon
} from "@heroicons/react/24/outline";

export default function ListView({ filteredEvents, updateEventStatus }) {
  const [expandedEventId, setExpandedEventId] = useState(null);

  const toggleExpand = (eventId) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-600',
    approved: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    canceled: 'bg-red-100 text-red-600'
  };

  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          All Appointments ({filteredEvents.length})
        </h2>
        
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            No appointments found matching your criteria
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEvents.map(event => (
              <div 
                key={event.id} 
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div 
                  className="p-4 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleExpand(event.id)}
                >
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {event.patient} ({event.id})
                        </h3>
                        <p className="text-sm text-gray-600">
                          {event.doctor} • {event.reason}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${statusColors[event.status]}`}>
                        {event.status}
                      </span>
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {event.start.toLocaleDateString()} • {formatTime(event.start)} - {formatTime(event.end)}
                      </div>
                      {event.priority === 'high' && (
                        <div className="flex items-center text-sm text-red-600">
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          <span>High Priority</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="ml-4 text-gray-500">
                    {expandedEventId === event.id ? (
                      <ChevronUpIcon className="w-5 h-5" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {expandedEventId === event.id && (
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-semibold mb-2 text-gray-700">Patient Information</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p className="flex items-center">
                            <UserCircleIcon className="w-4 h-4 mr-2" />
                            {event.address || 'No address'}
                          </p>
                          <p className="flex items-center">
                            <EnvelopeIcon className="w-4 h-4 mr-2" />
                            {event.email || 'No email'}
                          </p>
                          <p className="flex items-center">
                            <PhoneIcon className="w-4 h-4 mr-2" />
                            {event.contact || 'No contact'}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-semibold mb-2 text-gray-700">Medical Information</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                          {event.prescription && (
                            <div className="flex items-center">
                              <DocumentArrowUpIcon className="w-4 h-4 mr-2" />
                              <a href={event.prescription} className="text-blue-600 hover:underline">
                                View Prescription
                              </a>
                            </div>
                          )}
                          <p><span className="font-medium">Reason:</span> {event.reason || 'No reason provided'}</p>
                        </div>
                      </div>
                    </div>

                    {event.status === 'pending' && (
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateEventStatus(event.id, 'approved');
                          }}
                          className="flex-1 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200 flex items-center justify-center gap-2"
                        >
                          <CheckCircleIcon className="w-5 h-5" />
                          Approve
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateEventStatus(event.id, 'canceled');
                          }}
                          className="flex-1 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 flex items-center justify-center gap-2"
                        >
                          <XMarkIcon className="w-5 h-5" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
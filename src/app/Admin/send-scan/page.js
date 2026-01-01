'use client';
import {
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect, useMemo } from 'react';
import SendScanForm from "../Components/SendScanForm";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Spinner } from "../Components/NotificationsFeed";

export default function SendScanPage() {
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [notification, setNotification] = useState(null);

  // Use useMemo for optimized filtering
  const filteredHistory = useMemo(() => {
    return history.filter(entry => {
      const searchLower = searchQuery.toLowerCase();
      return (
        entry.patientName.toLowerCase().includes(searchLower) ||
        entry.fileName.toLowerCase().includes(searchLower)
      );
    });
  }, [history, searchQuery]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockHistory = [
          {
            id: 1,
            patientName: "John Doe",
            patientEmail: "john@example.com",
            fileName: "scan-001.pdf",
            date: "2023-10-01",
            message: "Routine checkup"
          },
          {
            id: 2,
            patientName: "Jane Smith",
            patientEmail: "jane@example.com",
            fileName: "scan-002.png",
            date: "2023-10-02",
            message: "Follow-up scan"
          },
          {
            id: 3,
            patientName: "Bob Johnson",
            patientEmail: "bob@example.com",
            fileName: "mri-scan.pdf",
            date: "2023-10-03",
            message: "Neurology referral"
          }
        ];
        setHistory(mockHistory);
      } catch (error) {
        showNotification('error', 'Error loading history');
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleNewScan = (newScan) => {
    setHistory(prev => [newScan, ...prev]);
    showNotification('success', 'Scan sent successfully');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-8">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 animate-slide-in">
          <div className={`flex items-center p-4 rounded-lg shadow-lg ${
            notification.type === 'success' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircleIcon className="w-6 h-6 mr-2" />
            ) : (
              <XCircleIcon className="w-6 h-6 mr-2" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <SendScanForm onSuccess={handleNewScan} showNotification={showNotification} />
      
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Shipping History</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by patient or scan name..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg 
              className="w-5 h-5 absolute right-3 top-3 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>

          {loadingHistory ? (
            <div className="flex justify-center py-8">
              <Spinner className="w-8 h-8 text-blue-600" />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  No results found for "{searchQuery}"
                </div>
              ) : (
                <div className="overflow-hidden border rounded-lg">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">File</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredHistory.map(entry => (
                        <tr 
                          key={entry.id} 
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium">{entry.patientName}</div>
                            <div className="text-sm text-gray-500">{entry.patientEmail}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <DocumentTextIcon className="w-5 h-5 mr-2 text-blue-600" />
                              <span className="text-sm">{entry.fileName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(entry.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                            {entry.message || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
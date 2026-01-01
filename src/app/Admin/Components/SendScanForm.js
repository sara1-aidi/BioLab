'use client';

import { useState, useCallback } from 'react';
import {
  DocumentMagnifyingGlassIcon,
  XMarkIcon,
  DocumentTextIcon,
  DocumentArrowUpIcon
} from "@heroicons/react/24/outline";
import { Spinner } from "../components/spinner";

export default function SendScanForm({ onSuccess, showNotification }) {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [scanFile, setScanFile] = useState(null);
  const [message, setMessage] = useState('');
  const [patientSearch, setPatientSearch] = useState('');
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setScanFile(e.dataTransfer.files[0]);
    }
  };

  const searchPatients = useCallback(async (query) => {
    try {
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(`/api/patients?search=${encodedQuery}`);
      if (!response.ok) throw new Error('Échec de la recherche');
      return await response.json();
    } catch (error) {
      console.error('❌ Erreur recherche patients :', error);
      showNotification('error', 'Erreur lors de la recherche du patient');
      return [];
    }
  }, [showNotification]);

  const handlePatientSearch = async (e) => {
    const query = e.target.value;
    setPatientSearch(query);
    if (!query) {
      setPatients([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchPatients(query);
      setPatients(results);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!selectedPatient || !scanFile) {
        throw new Error('Veuillez sélectionner un patient et un fichier');
      }

      const formData = new FormData();
      formData.append('scanFile', scanFile);
      formData.append('selectedPatient', selectedPatient.id);
      formData.append('message', message || '');

      console.log('Sending:', {
        patient: selectedPatient.id,
        fileName: scanFile.name,
        fileSize: scanFile.size,
        fileType: scanFile.type
      });

      const response = await fetch('/api/scans', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi');
      }

      setScanFile(null);
      setMessage('');
      setSelectedPatient(null);
      setPatientSearch('');
      
      showNotification?.('success', 'Scan envoyé avec succès');
      onSuccess?.(data);

    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message);
      showNotification?.('error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Send a scan</h2>
          <p className="text-sm text-gray-600 mt-1">Select a patient and upload a file</p>
        </div>
        <DocumentMagnifyingGlassIcon className="w-20 h-20 text-blue-600" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient search field */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
          <div className="relative">
            <input
              type="text"
              value={selectedPatient?.full_name || patientSearch || ''}
              onChange={handlePatientSearch}
              className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10"
              placeholder="Search for a patient..."
              disabled={!!selectedPatient}
            />
            {selectedPatient && (
              <button
                type="button"
                onClick={() => {
                  setSelectedPatient(null);
                  setPatientSearch('');
                }}
                className="absolute right-2 top-2 p-1 hover:bg-gray-100 rounded-full"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>

          {patients.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
              {patients.map(patient => (
                <div
                  key={patient.id}
                  onClick={() => {
                    setSelectedPatient(patient);
                    setPatients([]);
                  }}
                  className="p-3 hover:bg-gray-50 cursor-pointer flex items-center"
                >
                  <div className="flex-1">
                    <div className="font-medium">{patient.full_name}</div>
                    <div className="text-sm text-gray-500">{patient.email}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="absolute right-3 top-9">
              <Spinner className="w-5 h-5 text-gray-500" />
            </div>
          )}
        </div>

        {/* Upload zone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Scan file</label>
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {scanFile ? (
              <div className="text-sm text-gray-600">
                <DocumentTextIcon className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                {scanFile.name}
                <button
                  type="button"
                  onClick={() => setScanFile(null)}
                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm block mx-auto"
                >
                  Change file
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <DocumentArrowUpIcon className="w-8 h-8 mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Drag and drop your file here or{' '}
                  <label className="text-blue-600 cursor-pointer hover:text-blue-700">
                    browse
                    <input
                      type="file"
                      accept=".pdf,.jpg,.png"
                      onChange={(e) => setScanFile(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PDF, JPG, PNG (max 50MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Optional message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Add a personalized message..."
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Spinner className="w-5 h-5 mr-2" />
              Sending in progress...
            </>
          ) : (
            'Send scan'
          )}
        </button>
      </form>
    </div>
  );
}
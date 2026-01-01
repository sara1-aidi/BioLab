"use client";
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon, DocumentMagnifyingGlassIcon, ClockIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function AiAnalysisPage() {
  const [file, setFile] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => handleFileUpload(acceptedFiles[0]),
  });

  const getDiseaseDetails = (diagnosis) => {
    const detailsMap = {
      'lung-opacity': 'Abnormal lung opacity detected, possibly indicating fluid, inflammation, or infection',
      'normal': 'No abnormalities detected in chest radiograph',
      'pneumonia': 'Consolidation observed with potential air bronchograms, suggesting pulmonary infection'
    };
    return detailsMap[diagnosis] || 'Detailed analysis not available';
  };

  const handleFileUpload = async (uploadedFile) => {
    setFile(uploadedFile);
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Analysis failed');

      const result = await response.json();

      setDiagnosis({
        disease: result.prediction,
        confidence: Math.round(result.confidence * 100),
        details: getDiseaseDetails(result.prediction)
      });

      setAnalysisHistory(prev => [{
        id: prev.length + 1,
        date: new Date().toISOString().split('T')[0],
        diagnosis: result.prediction,
        confidence: Math.round(result.confidence * 100),
        status: 'completed'
      }, ...prev]);

    } catch (error) {
      console.error('Analysis error:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* AI Analysis Section */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <DocumentMagnifyingGlassIcon className="w-6 h-6 text-[hsl(210,60%,40%)]" />
            AI Scan Analysis
          </h2>

          <div className="flex flex-col items-center justify-center">
            <div 
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors mb-6 w-full max-w-md
                ${isDragActive ? 'border-[hsl(210,60%,40%)] bg-[hsl(210,60%,98%)]' : 'border-gray-300 hover:border-[hsl(210,60%,40%)]'}`}
            >
              <input {...getInputProps()} />
              <CloudArrowUpIcon className={`w-20 h-20 mx-auto mb-4 ${
                isDragActive ? 'text-[hsl(210,60%,40%)]' : 'text-gray-400'
              }`} />
              
              {file ? (
                <p className="text-gray-600">{file.name}</p>
              ) : (
                <div>
                  <p className="text-gray-600">Drag & drop X-ray scan, or click to upload</p>
                  <p className="text-sm text-gray-500 mt-1">Supports: PNG, JPG</p>
                </div>
              )}
            </div>
          </div>

          {isLoading && (
            <div className="text-center p-4">
              <ArrowPathIcon className="w-8 h-8 mx-auto animate-spin text-gray-400" />
              <p className="mt-2 text-gray-600">Analyzing X-ray...</p>
            </div>
          )}

          {diagnosis && !isLoading && (
            <div className="space-y-4">
              <div className="bg-[hsl(150,50%,98%)] rounded-lg p-4">
                <h3 className="font-medium text-lg">AI Diagnosis</h3>
                <p className="text-2xl font-bold text-[hsl(150,50%,40%)]">
                  {diagnosis.disease}
                </p>
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[hsl(150,50%,40%)] h-2 rounded-full" 
                        style={{ width: `${diagnosis.confidence}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      {diagnosis.confidence}% Confidence
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Analysis Details</h4>
                <p className="text-gray-600">{diagnosis.details}</p>
              </div>
            </div>
          )}
        </div>

        {/* Analysis History */}
        <div className="lg:col-span-1 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ClockIcon className="w-6 h-6 text-[hsl(210,60%,40%)]" />
            Analysis History
          </h2>
          
          <div className="space-y-4">
            {analysisHistory.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.diagnosis}</p>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-sm 
                      ${item.confidence > 90 ? 'bg-[hsl(150,50%,90%)] text-[hsl(150,50%,40%)]' : 
                         'bg-[hsl(350,50%,90%)] text-[hsl(350,50%,40%)]'}`}>
                      {item.confidence}% Confidence
                    </span>
                    <button className="text-[hsl(210,60%,40%)] hover:text-[hsl(210,60%,30%)]">
                      <ArrowPathIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
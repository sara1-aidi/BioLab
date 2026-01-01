'use client';
import { useState, useEffect } from 'react';

const AdminContactManagement = () => {
  // State variables
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(true);
  const [faqs, setFaqs] = useState([]);
  const [isLoadingFaqs, setIsLoadingFaqs] = useState(true);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [editingFaqId, setEditingFaqId] = useState(null);
  const [activeTab, setActiveTab] = useState('submissions');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [responseMessage, setResponseMessage] = useState('');
  const [isSendingResponse, setIsSendingResponse] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [submissionsRes, faqsRes] = await Promise.all([
          fetch('http://localhost:3000/api/submissions'),
          fetch('http://localhost:3000/api/faqs')
        ]);
        
        const submissionsData = await submissionsRes.json();
        const faqsData = await faqsRes.json();
        
        setSubmissions(submissionsData);
        setFaqs(faqsData);
        setIsLoadingSubmissions(false);
        setIsLoadingFaqs(false);
      } catch (error) {
        console.error('Fetch error:', error);
        setIsLoadingSubmissions(false);
        setIsLoadingFaqs(false);
      }
    };
    fetchData();
  }, [refreshKey]);

  // Filter submissions
  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      (submission.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (submission.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (submission.problem?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || submission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Filter FAQs
  const filteredFaqs = faqs.filter(faq => {
    const safeQuestion = faq.question?.toLowerCase() || '';
    const safeAnswer = faq.answer?.toLowerCase() || '';
    return safeQuestion.includes(searchTerm.toLowerCase()) || 
           safeAnswer.includes(searchTerm.toLowerCase());
  });

  // Submission handlers
  const handleSelectSubmission = (submission) => {
    setSelectedSubmission(submission);
    setResponseMessage('');
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch('http://localhost:3000/api/submissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      
      if (response.ok) {
        setSubmissions(prev => prev.map(sub => 
          sub.id === id ? { ...sub, status: newStatus } : sub
        ));
        setRefreshKey(prev => prev + 1);
      }
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  // FAQ handlers
  const handleEditFaq = (faq) => {
    setEditingFaqId(faq.id);
    setNewFaq({ question: faq.question, answer: faq.answer });
  };

  const handleDeleteFaq = async (id) => {
    try {
      await fetch('http://localhost:3000/api/faqs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      setFaqs(prev => prev.filter(faq => faq.id !== id));
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleSaveFaq = async (e) => {
    e.preventDefault();
    try {
      const method = editingFaqId ? 'PUT' : 'POST';
      const response = await fetch('http://localhost:3000/api/faqs', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingFaqId ? { id: editingFaqId, ...newFaq } : newFaq)
      });
      
      if (response.ok) {
        const data = await response.json();
        setFaqs(prev => editingFaqId 
          ? prev.map(faq => faq.id === editingFaqId ? data : faq)
          : [...prev, data]
        );
        setNewFaq({ question: '', answer: '' });
        setEditingFaqId(null);
      }
    } catch (error) {
      console.error('FAQ error:', error);
    }
  };

  // Email response handler
 const handleSendResponse = async () => {
  if (!selectedSubmission || !responseMessage.trim()) return;

  setIsSendingResponse(true);
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: selectedSubmission.email,
        subject: `Re: ${selectedSubmission.problem}`,
        text: responseMessage
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      // Handle SendGrid error format
      const errorMessage = result.error?.message || 
                          result.error?.errors?.[0]?.message ||
                          'Failed to send email';
      throw new Error(errorMessage);
    }
    
    await handleStatusChange(selectedSubmission.id, 'responded');
    setResponseMessage('');
    alert('Response sent successfully!');
    
  } catch (error) {
    console.error('Email send error details:', {
      error: error.message,
      response: error.response
    });
    alert(`Failed to send email: ${error.message}`);
  } finally {
    setIsSendingResponse(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('submissions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'submissions' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Contact Submissions
            </button>
            <button
              onClick={() => setActiveTab('faqs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'faqs' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              FAQ Management
            </button>
          </nav>
        </div>

        {activeTab === 'submissions' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Contact Submissions</h2>
              <div className="flex items-center space-x-4">
                <label className="text-sm text-gray-600">Filter by status:</label>
                <select
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="responded">Responded</option>
                </select>
              </div>
            </div>

            {isLoadingSubmissions ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading submissions...</p>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No submissions found matching your criteria.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredSubmissions.map((submission) => (
                  <div 
                    key={submission.id} 
                    className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${selectedSubmission?.id === submission.id ? 'bg-blue-50' : ''}`}
                    onClick={() => handleSelectSubmission(submission)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{submission.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{submission.email}</p>
                        <p className="text-sm text-gray-700 mt-2 line-clamp-2">{submission.problem}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : submission.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                          {submission.status.replace('-', ' ')}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(submission.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedSubmission && (
              <div className="p-6 border-t border-gray-200">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Submission Details</h3>
                  <p className="text-sm"><strong>Name:</strong> {selectedSubmission.name}</p>
                  <p className="text-sm"><strong>Email:</strong> {selectedSubmission.email}</p>
                  <p className="text-sm"><strong>Problem:</strong> {selectedSubmission.problem}</p>
                  <p className="text-sm"><strong>Status:</strong> {selectedSubmission.status}</p>
                  <p className="text-sm"><strong>Date:</strong> {new Date(selectedSubmission.created_at).toLocaleString()}</p>
                </div>

                <div className="mt-4">
                  <h4 className="text-md font-medium mb-2">Email Response</h4>
                  <textarea
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    placeholder="Write your response here..."
                    className="w-full p-3 border rounded-lg mb-4 h-32 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSendingResponse}
                  />
                  <button
                    onClick={handleSendResponse}
                    disabled={isSendingResponse || !responseMessage.trim()}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSendingResponse ? 'Sending...' : 'Send Response'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'faqs' && (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                {editingFaqId ? 'Edit FAQ' : 'Add FAQ'}
              </h2>
              <form onSubmit={handleSaveFaq} className="flex flex-col space-y-4">
                <input
                  type="text"
                  placeholder="Question"
                  className="border border-gray-300 rounded-lg px-4 py-2"
                  value={newFaq.question}
                  onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Answer"
                  className="border border-gray-300 rounded-lg px-4 py-2"
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {editingFaqId ? 'Update FAQ' : 'Add FAQ'}
                </button>
              </form>
            </div>
            
            <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
              {filteredFaqs.length === 0 ? (
                <div className="p-6 text-gray-500">No FAQs found.</div>
              ) : (
                filteredFaqs.map((faq) => (
                  <div key={faq.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                        <p className="text-sm text-gray-700 mt-1">{faq.answer}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-500 hover:underline"
                          onClick={() => handleEditFaq(faq)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-500 hover:underline"
                          onClick={() => handleDeleteFaq(faq.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContactManagement;
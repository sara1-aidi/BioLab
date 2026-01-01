'use client';
import { useState, useEffect } from 'react';

const ContactAdminPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    problem: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [faqs, setFaqs] = useState([]);

  // Fetch FAQs from API
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/faqs');
        const data = await res.json();
        setFaqs(data);
      } catch (error) {
        console.error('FAQ fetch error:', error);
      }
    };
    fetchFAQs();
  }, []);

  // Safe search filtering
  const filteredFaqs = faqs.filter(faq => {
    const safeQuestion = faq.question?.toLowerCase() || '';
    const safeAnswer = faq.answer?.toLowerCase() || '';
    const safeSearch = searchQuery?.toLowerCase() || '';
    
    return safeQuestion.includes(safeSearch) || 
           safeAnswer.includes(safeSearch);
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
   if (!selectedSubmission || !responseMessage.trim()) return;
  setIsSubmitting(true);
  
  try {
    const response = await fetch('http://localhost:3000/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        problem: formData.problem,
        status: 'pending' // Add initial status
      })
    });

    if (!response.ok) {
      throw new Error('Submission failed');
    }

    setSubmitSuccess(true);
    setFormData({ name: '', email: '', problem: '' });
  }  catch (error) {
    // Enhanced error logging
    console.error('Full error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      response: {
        status: error.response?.status,
        data: error.response?.data
      },
      request: {
        url: '/api/send-email',
        method: 'POST',
        payload: {
          to: selectedSubmission.email,
          subject: `Re: ${selectedSubmission.problem}`,
          text: responseMessage
        }
      }
    });

    // User-friendly error display
    const errorMessage = error.response?.data?.error?.message 
      || error.message 
      || 'Failed to send email. Please check console for details.';
    
    alert(`Email Error: ${errorMessage}`);
  } finally {
    setIsSendingResponse(false);
  }
};

  const toggleFAQ = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[url('/images/FAQ.png')] bg-cover bg-center bg-no-repeat bg-fixed">
      <div className="min-h-screen bg-[var(--pastel-blue-light)]/70 backdrop-blur-sm">
        <div className="container mx-auto p-6 max-w-6xl">
          <h1 className="text-3xl font-bold text-[var(--text-blue-dark)] mb-2">How can we help you?</h1>
          
          {/* Search bar */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search help questions..."
                className="w-full pl-10 pr-4 py-2 border border-[var(--pastel-blue-dark)] rounded-lg focus:ring-[var(--text-blue-medium)] focus:border-[var(--text-blue-medium)]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-[var(--text-blue-medium)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* FAQ Section */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-[var(--pastel-blue-dark)]">
                <h2 className="text-2xl font-semibold text-[var(--text-blue-medium)] mb-6">Frequently Asked Questions</h2>
                <p className="text-[var(--text-blue-medium)] mb-8">
                  Find answers to common questions about our platform. Can't find what you need? Contact our team below.
                </p>

                <div className="space-y-4">
                  {filteredFaqs.map((faq, index) => (
                    <div key={faq.id} className="border-b border-[var(--pastel-blue-dark)] pb-4">
                      <button 
                        className="flex justify-between items-center w-full text-left group"
                        onClick={() => toggleFAQ(index)}
                      >
                        <h3 className="text-lg font-medium text-[var(--text-blue-dark)] group-hover:text-[var(--text-blue-medium)] transition-colors">
                          {faq.question}
                        </h3>
                        <svg
                          className={`h-5 w-5 text-[var(--text-blue-medium)] transform transition-transform ${
                            expandedIndex === index ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {expandedIndex === index && (
                        <div className="mt-3 text-[var(--text-blue-dark)]">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Help Resources Section */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-[var(--pastel-blue-dark)]">
                <h3 className="text-xl font-semibold text-[var(--text-blue-medium)] mb-4">Additional Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[var(--pastel-blue-light)] rounded-lg hover:bg-[var(--pastel-blue-medium)] transition-colors">
                    <h4 className="font-medium text-[var(--text-blue-dark)]">User Guides</h4>
                    <p className="text-sm text-[var(--text-blue-medium)]">Step-by-step instructions for all features</p>
                  </div>
                  <div className="p-4 bg-[var(--pastel-blue-light)] rounded-lg hover:bg-[var(--pastel-blue-medium)] transition-colors">
                    <h4 className="font-medium text-[var(--text-blue-dark)]">Video Tutorials</h4>
                    <p className="text-sm text-[var(--text-blue-medium)]">Visual guides to using the platform</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-[var(--pastel-blue-dark)]">
              <h2 className="text-2xl font-semibold text-[var(--text-blue-dark)] mb-6">Contact Support</h2>
              
              {submitSuccess && (
                <div className="mb-4 p-3 bg-[var(--pastel-green-light)] text-[var(--pastel-green-dark)] rounded-lg">
                  Message sent successfully! We'll respond within 24 hours.
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-blue-dark)] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-[var(--pastel-blue-dark)] rounded-lg focus:ring-[var(--text-blue-medium)] focus:border-[var(--text-blue-medium)]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--text-blue-dark)] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-[var(--pastel-blue-dark)] rounded-lg focus:ring-[var(--text-blue-medium)] focus:border-[var(--text-blue-medium)]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--text-blue-dark)] mb-1">
                    Describe Your Issue *
                  </label>
                  <textarea
                    name="problem"
                    value={formData.problem}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-[var(--pastel-blue-dark)] rounded-lg focus:ring-[var(--text-blue-medium)] focus:border-[var(--text-blue-medium)]"
                    placeholder="Please describe your issue in detail..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 bg-[var(--text-blue-medium)] hover:bg-[var(--text-blue-dark)] text-white font-medium rounded-lg transition-colors ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Submit Message'
                  )}
                </button>
              </form>

              {/* Contact Info */}
              <div className="mt-8 pt-6 border-t border-[var(--pastel-blue-dark)]">
                <h3 className="text-lg font-medium text-[var(--text-blue-dark)] mb-3">Other ways to reach us</h3>
                <div className="space-y-2">
                  <p className="flex items-center text-[var(--text-blue-medium)]">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    support@mediscan.com
                  </p>
                  <p className="flex items-center text-[var(--text-blue-medium)]">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    +1 (555) 123-4567
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactAdminPage;
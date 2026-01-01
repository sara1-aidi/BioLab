// components/Chatbot.jsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline';

const MEDICAL_KNOWLEDGE = [
  {
    question: /scan|upload|dicom/i,
    answer: "Upload scans via your dashboard. Supported formats: DICOM, JPEG, PNG."
  },
  {
    question: /result|wait|time/i,
    answer: "Results typically take 5-15 minutes. Complex cases may take longer."
  }
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogue, setDialogue] = useState([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  // Restore chat history
  useEffect(() => {
    const saved = localStorage.getItem('med-chat');
    if (saved) setDialogue(JSON.parse(saved));
  }, []);

  // Persist chat history
  useEffect(() => {
    if (dialogue.length > 0) {
      localStorage.setItem('med-chat', JSON.stringify(dialogue));
    }
  }, [dialogue]);

  // Scroll to bottom when messages update or chat opens
  useEffect(() => {
    scrollToBottom();
  }, [dialogue, isLoading, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Add click-away listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        !event.target.closest('button[aria-label="Open chat"]')
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const prompt = query.trim();
    if (!prompt || isLoading) return;

    // Check local knowledge first
    const quickResponse = MEDICAL_KNOWLEDGE.find(({ question }) => 
      question.test(prompt)
    )?.answer;

    if (quickResponse) {
      setDialogue(prev => [...prev, 
        { content: prompt, role: 'user' },
        { content: quickResponse, role: 'bot', source: 'KB' }
      ]);
      setQuery('');
      return;
    }

    // API request
    setDialogue(prev => [...prev, { content: prompt, role: 'user' }]);
    setQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt })
      });
      
      const { reply, model } = await response.json();
      setDialogue(prev => [...prev, 
        { content: reply, role: 'bot', source: model }
      ]);

    } catch (error) {
      setDialogue(prev => [...prev, 
        { content: "Connection error. Please try again.", role: 'bot', source: 'error' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        <button 
          onClick={() => {
            setIsOpen(!isOpen);
            // Scroll to bottom after a small delay to ensure container is rendered
            setTimeout(scrollToBottom, 100);
          }}
          className="p-4 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-all"
          aria-label="Open chat"
        >
          <span className="sr-only">Open chat</span>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>

        <div 
          ref={containerRef}
          className={`absolute bottom-20 right-0 w-96 bg-blue-50 rounded-xl shadow-xl border border-blue-100 transform origin-bottom-right transition-all ${
            isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-blue-200">
            <h2 className="text-lg font-semibold text-blue-900">Medical Assistant</h2>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-blue-100 rounded-lg"
            >
              <XMarkIcon className="w-5 h-5 text-blue-700" />
            </button>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {dialogue.map((entry, index) => (
              <div key={index} className={`flex ${entry.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-sm ${
                  entry.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-blue-900 border border-blue-200'
                }`}>
                  <p>{entry.content}</p>
                  {entry.source && (
                    <p className={`mt-1 text-xs ${
                      entry.role === 'user' ? 'text-blue-200' : 'text-blue-600'
                    }`}>
                      {entry.source === 'KB' ? 'Knowledge Base' : `AI Model: ${entry.source}`}
                    </p>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-xl text-sm flex items-center gap-2 border border-blue-200">
                  <ArrowPathIcon className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-blue-900">Analyzing with medical AI...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-blue-200">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about medical scans..."
                className="w-full p-2 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm placeholder:text-blue-900/60 text-blue-900"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="absolute right-2 top-2 p-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
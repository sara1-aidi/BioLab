"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Chatbot from "../components/Chatbot";
import { BookmarkIcon as BookmarkOutline, BookmarkSlashIcon as BookmarkSolid } from '@heroicons/react/24/outline';

export default function FAQPage() {
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [savedItems, setSavedItems] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('savedKnowledgeItems');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [selectedTags, setSelectedTags] = useState(['all']);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKnowledgeBase = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const tagsParam = selectedTags.includes('all') ? '' : `?tags=${selectedTags.join(',')}`;
        const response = await fetch(`http://localhost:3000/api/knowledge-base${tagsParam}`);
        
        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
        
        const data = await response.json();
        setKnowledgeBase(data);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKnowledgeBase();
  }, [selectedTags]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('savedKnowledgeItems', JSON.stringify(savedItems));
    }
  }, [savedItems]);

  const allTags = [
    'all',
    ...new Set(knowledgeBase.flatMap(item => item.tags)),
    ...(savedItems.length > 0 ? ['saved'] : [])
  ];

  const toggleTag = (tag) => {
    setSelectedTags(prev => {
      if (tag === 'all') return ['all'];
      const newTags = prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev.filter(t => t !== 'all'), tag];
      return newTags.length === 0 ? ['all'] : newTags;
    });
  };

  const toggleSaved = (itemId) => {
    setSavedItems(prev => prev.includes(itemId) 
      ? prev.filter(id => id !== itemId)
      : [...prev, itemId]
    );
  };

  const filteredItems = knowledgeBase.filter(item => {
    if (selectedTags.includes('all')) return true;
    if (selectedTags.includes('saved')) return savedItems.includes(item.id);
    return selectedTags.some(tag => item.tags.includes(tag));
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error loading knowledge base: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-blue-dark)' }}>
          Welcome to the Medical Knowledge Base
        </h2>
        <p className="mt-2 text-lg" style={{ color: 'var(--text-blue-medium)' }}>
          Explore educational content about lung health and diagnostics. Save your favorite resources for quick access.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 items-center">
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            style={{
              backgroundColor: selectedTags.includes(tag)
                ? tag === 'saved'
                  ? 'var(--pastel-green-medium)'
                  : 'var(--pastel-blue-dark)'
                : 'var(--pastel-blue-medium)',
              color: selectedTags.includes(tag) ? 'var(--text-blue-dark)' : 'var(--text-blue-medium)'
            }}
            className="px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-colors"
          >
            {tag === 'saved' ? (
              <>
                <BookmarkSolid className="w-4 h-4" />
                Saved ({savedItems.length})
              </>
            ) : (
              tag.charAt(0).toUpperCase() + tag.slice(1)
            )}
          </button>
        ))}
      </div>

      {selectedTags.includes('saved') && (
        <div style={{ 
          backgroundColor: 'var(--pastel-green-light)',
          borderLeft: '4px solid var(--pastel-green-dark)'
        }} className="p-4 mb-6 rounded-lg">
          <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-blue-dark)' }}>
            <BookmarkSolid className="w-5 h-5" />
            Your Saved Items ({savedItems.length})
          </h2>
          <p className="mt-1" style={{ color: 'var(--text-blue-medium)' }}>
            {savedItems.length === 0 
              ? "You haven't saved any items yet. Click the bookmark icon to save content."
              : "These are the items you've bookmarked for quick access."}
          </p>
        </div>
      )}

      {filteredItems.length === 0 ? (
        <div className="text-center text-blue-500 p-6">
          No items found for selected tags
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col"
              style={{ backgroundColor: 'var(--pastel-blue-light)' }}
            >
              {item.image && (
                <div className="relative w-full h-80 bg-gray-50 flex items-center justify-center rounded-t-lg overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={600}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--text-blue-dark)' }}>
                    {item.title}
                  </h3>
                  <button 
                    onClick={() => toggleSaved(item.id)}
                    className="text-gray-400 hover:text-blue-600 p-1"
                  >
                    {savedItems.includes(item.id) ? (
                      <BookmarkSolid className="w-6 h-6" style={{ color: 'var(--pastel-green-dark)' }} />
                    ) : (
                      <BookmarkOutline className="w-6 h-6" style={{ color: 'var(--pastel-blue-dark)' }} />
                    )}
                  </button>
                </div>

                <div className="space-y-3 flex-1" style={{ color: 'var(--text-blue-medium)' }}>
                  {item.type === 'video' ? (
                    <iframe
                      className="w-full aspect-video rounded-lg"
                      src={item.content}
                      title={item.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="prose max-w-none">
                      {item.type === 'tutorial' ? (
                        item.content.split('\n').map((step, i) => (
                          <p key={i} className="mb-2">{step}</p>
                        ))
                      ) : (
                        <p>{item.content}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {item.tags.map(tag => (
                    <span 
                      key={tag}
                      style={{
                        backgroundColor: 'var(--pastel-blue-medium)',
                        color: 'var(--text-blue-dark)'
                      }}
                      className="px-2 py-1 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-50">
        <Chatbot />
      </div>
    </div>
  );
}
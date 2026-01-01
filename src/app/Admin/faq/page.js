"use client";
import { useState, useEffect } from 'react';
import { TrashIcon, PencilIcon, PlusIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const safeJsonParse = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

export default function KnowledgeBaseAdmin() {
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'article',
    tags: '',
    image: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchKnowledgeBase = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('http://localhost:3000/api/knowledge-base');
        const text = await response.text();
        const data = safeJsonParse(text);

        if (!response.ok || !data) {
          throw new Error(data?.error || 'Failed to load knowledge base');
        }

        setKnowledgeBase(data);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message.includes('<') ? 'Server connection error' : error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchKnowledgeBase();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const startEditing = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      content: item.content,
      type: item.type,
      tags: item.tags.join(', '),
      image: item.image || ''
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setFormData({
      title: '',
      content: '',
      type: 'article',
      tags: '',
      image: ''
    });
    setError(null);
  };

  const saveItem = async () => {
    if (!formData.title || !formData.content) {
      setError('Title and content are required');
      return;
    }
  
    const payload = {
      title: formData.title,
      content: formData.content,
      type: formData.type,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      image: formData.image || null
    };
  
    try {
      setIsSubmitting(true);
      setError(null);
      
      const isNew = editingId === 'new';
      const url = 'http://localhost:3000/api/knowledge-base';
      const method = isNew ? 'POST' : 'PUT';
  
      // For updates, add ID to payload
      if (!isNew) payload.id = editingId;
  
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
  
      const text = await response.text();
      const data = safeJsonParse(text);
  
      if (!response.ok || !data) {
        throw new Error(data?.error || (isNew ? 'Failed to create' : 'Failed to update'));
      }
  
      setKnowledgeBase(prev => isNew ? [data, ...prev] : prev.map(item => 
        item.id === editingId ? data : item
      ));
      
      cancelEditing();
    } catch (error) {
      console.error("Save error:", error);
      setError(error.message.includes('<') ? 'Operation failed' : error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Update the deleteItem function
  const deleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        setIsSubmitting(true);
        setError(null);
        
        const response = await fetch('http://localhost:3000/api/knowledge-base', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        
        const text = await response.text();
        const data = safeJsonParse(text);
  
        if (!response.ok) {
          throw new Error(data?.error || 'Deletion failed');
        }
  
        setKnowledgeBase(prev => prev.filter(item => item.id !== id));
      } catch (error) {
        console.error("Delete error:", error);
        setError(error.message.includes('<') ? 'Deletion failed' : error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  const filteredItems = knowledgeBase.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-8 max-w-7xl mx-auto bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Knowledge Base Management</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <button
          onClick={() => setEditingId('new')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-200 text-blue-800 hover:bg-blue-300 transition-colors"
          disabled={isSubmitting}
        >
          <PlusIcon className="h-5 w-5" />
          Add New Article
        </button>
      </div>

      {(editingId === 'new' || editingId) && (
        <div className="p-6 rounded-lg shadow-md mb-6 border border-blue-200 bg-white">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">
            {editingId === 'new' ? 'Create New Article' : 'Edit Article'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-blue-800">Title*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Article title"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-blue-800">Type*</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                >
                  <option value="article">Article</option>
                  <option value="tutorial">Tutorial</option>
                  <option value="video">Video</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-blue-800">Tags</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Comma-separated tags"
                  disabled={isSubmitting}
                />
                <p className="text-xs mt-1 text-blue-500">Separate tags with commas</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-blue-800">Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Image URL"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-blue-800">Content*</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={8}
                className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={formData.type === 'tutorial' ? "Tutorial steps..." : "Article content"}
                required
                disabled={isSubmitting}
              />
              {formData.type === 'tutorial' && (
                <p className="text-xs mt-1 text-blue-500">Put each step on a new line</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={cancelEditing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
              disabled={isSubmitting}
            >
              <XMarkIcon className="h-5 w-5" />
              Cancel
            </button>
            <button
              type="button"
              onClick={saveItem}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-200 text-blue-800 hover:bg-green-300 transition-colors"
              disabled={isSubmitting}
            >
              <CheckIcon className="h-5 w-5" />
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="rounded-lg shadow-md overflow-hidden border border-blue-200 bg-white">
          <div className="grid grid-cols-12 p-4 font-semibold border-b border-blue-200 bg-blue-100 text-blue-800">
            <div className="col-span-4">Title</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-3">Tags</div>
            <div className="col-span-2">Image</div>
            <div className="col-span-1">Actions</div>
          </div>
          
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-blue-500">
              {searchTerm ? 'No matching articles found' : 'No articles available'}
            </div>
          ) : (
            filteredItems.map(item => (
              <div 
                key={item.id} 
                className="grid grid-cols-12 p-4 items-center border-b border-blue-100 hover:bg-blue-50 text-blue-800"
              >
                <div className="col-span-4 font-medium">{item.title}</div>
                <div className="col-span-2 capitalize">{item.type}</div>
                <div className="col-span-3">
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="text-xs px-2 py-1 rounded bg-blue-200 text-blue-800 border border-blue-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  {item.image ? (
                    <span className="text-sm text-green-600">Yes</span>
                  ) : (
                    <span className="text-sm text-blue-500">None</span>
                  )}
                </div>
                <div className="col-span-1 flex justify-end gap-2">
                  <button
                    onClick={() => startEditing(item)}
                    className="p-1 text-blue-600 hover:text-blue-800"
                    title="Edit"
                    disabled={isSubmitting}
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-1 text-red-600 hover:text-red-800"
                    title="Delete"
                    disabled={isSubmitting}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
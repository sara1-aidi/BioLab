'use client';
import { useState, useEffect } from 'react';
import { 
  PencilSquareIcon,
  TrashIcon,
  UserIcon,
  PlusIcon,
  BuildingLibraryIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const safeJsonParse = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

export default function AdminMedicalPage() {
  const [activeTab, setActiveTab] = useState('doctors');
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [formState, setFormState] = useState({
    name: '',
    specialty: 'Cardiology',
    type: 'Hospital',
    distance: '',
    rating: '4.5',
    phone_number: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const endpoint = activeTab === 'doctors' 
        ? '/api/doctors'
        : '/api/emergency-services';
      
      const response = await fetch(endpoint);
      const text = await response.text();
      const data = safeJsonParse(text);

      if (!response.ok || !data) {
        throw new Error(data?.error || `Failed to load ${activeTab}`);
      }

      activeTab === 'doctors' ? setDoctors(data) : setServices(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message.includes('<') ? 'Server connection error' : err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (editItem) {
      setEditItem(prev => ({ ...prev, [name]: value }));
    } else {
      setFormState(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      
      if (!formState.name && !editItem?.name) {
        throw new Error('Name is required');
      }

      const baseEndpoint = activeTab === 'doctors' ? '/api/doctors' : '/api/emergency-services';
      const method = editItem ? 'PUT' : 'POST';
      
      const payload = editItem 
        ? { id: editItem.id, ...editItem }
        : formState;

      const response = await fetch(baseEndpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const text = await response.text();
      const data = safeJsonParse(text);

      if (!response.ok || !data) {
        throw new Error(data?.error || (editItem ? 'Update failed' : 'Creation failed'));
      }

      setEditItem(null);
      setFormState({
        name: '',
        specialty: 'Cardiology',
        type: 'Hospital',
        distance: '',
        rating: '4.5',
        phone_number: ''
      });
      
      await fetchData();
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message.includes('<') ? 'Operation failed - check server' : err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      setSubmitting(true);
      setError(null);
      
      const baseEndpoint = activeTab === 'doctors' 
        ? '/api/doctors' 
        : '/api/emergency-services';

      const response = await fetch(baseEndpoint, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      
      const text = await response.text();
      const data = safeJsonParse(text);

      if (!response.ok || !data) {
        throw new Error(data?.error || 'Deletion failed');
      }

      await fetchData();
    } catch (err) {
      console.error('Deletion error:', err);
      setError(err.message.includes('<') ? 'Deletion failed - server error' : err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
          <button 
            onClick={fetchData}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? 'Retrying...' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">Medical Content Management</h1>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 flex items-center gap-2 ${
            activeTab === 'doctors' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('doctors')}
        >
          <UserIcon className="w-5 h-5" />
          Doctors
        </button>
        <button
          className={`px-4 py-2 flex items-center gap-2 ml-4 ${
            activeTab === 'services' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('services')}
        >
          <BuildingLibraryIcon className="w-5 h-5" />
          Emergency Services
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editItem ? 'Edit' : 'Add New'} {activeTab === 'doctors' ? 'Doctor' : 'Service'}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {activeTab === 'doctors' ? (
            <>
              <input
                name="name"
                placeholder="Doctor Name"
                value={editItem?.name || formState.name}
                onChange={handleFormChange}
                className="p-2 border rounded"
                required
              />
              <select
                name="specialty"
                value={editItem?.specialty || formState.specialty}
                onChange={handleFormChange}
                className="p-2 border rounded"
              >
                <option value="Cardiology">Cardiology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="General">General</option>
              </select>
            </>
          ) : (
            <>
              <input
                name="name"
                placeholder="Service Name"
                value={editItem?.name || formState.name}
                onChange={handleFormChange}
                className="p-2 border rounded"
                required
              />
              <select
                name="type"
                value={editItem?.type || formState.type}
                onChange={handleFormChange}
                className="p-2 border rounded"
              >
                <option value="Hospital">Hospital</option>
                <option value="Ambulance">Ambulance</option>
              </select>
            </>
          )}

          <input
            type="number"
            name="distance"
            placeholder="Distance (km)"
            step="0.1"
            value={editItem?.distance || formState.distance}
            onChange={handleFormChange}
            className="p-2 border rounded"
            required
          />

          {activeTab === 'doctors' && (
            <input
              type="number"
              name="rating"
              placeholder="Rating"
              min="0"
              max="5"
              step="0.1"
              value={editItem?.rating || formState.rating}
              onChange={handleFormChange}
              className="p-2 border rounded"
              required
            />
          )}

          <input
            type="tel"
            name="phone_number"
            placeholder="Phone Number"
            value={editItem?.phone_number || formState.phone_number}
            onChange={handleFormChange}
            className="p-2 border rounded"
            required
          />
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? (
              <span className="animate-spin">↻</span>
            ) : (
              <>
                <PlusIcon className="w-5 h-5" />
                {editItem ? 'Update' : 'Create'}
              </>
            )}
          </button>
          {editItem && (
            <button
              type="button"
              onClick={() => setEditItem(null)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Data Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">{activeTab === 'doctors' ? 'Specialty' : 'Type'}</th>
              <th className="p-3 text-left">Distance</th>
              {activeTab === 'doctors' && <th className="p-3 text-left">Rating</th>}
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(activeTab === 'doctors' ? doctors : services).map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.specialty || item.type}</td>
                <td className="p-3">{item.distance}km</td>
                {activeTab === 'doctors' && (
                  <td className="p-3">
                    <div className="flex items-center gap-1 text-yellow-600">
                      <StarIcon className="w-4 h-4" />
                      {item.rating}
                    </div>
                  </td>
                )}
                <td className="p-3">{item.phone_number}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => setEditItem(item)}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1 disabled:opacity-50"
                    disabled={submitting}
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1 disabled:opacity-50"
                    disabled={submitting}
                  >
                    <TrashIcon className="w-4 h-4" />
                    {submitting ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-yellow-100 rounded-lg">
        <p className="text-yellow-800 text-sm">
          ⚠️ Warning: This admin panel is currently open to everyone. 
          Add authentication before deploying to production.
        </p>
      </div>
    </div>
  );
}
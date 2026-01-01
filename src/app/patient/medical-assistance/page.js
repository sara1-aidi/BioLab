'use client';
import { useState, useEffect } from 'react';
import { 
  ClockIcon,
  PhoneIcon,
  StarIcon,
  MagnifyingGlassIcon,
  BuildingLibraryIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../../lib/supabase';

const HospitalIcon = BuildingLibraryIcon;
const AmbulanceIcon = TruckIcon;
const SearchIcon = MagnifyingGlassIcon;

export default function MedicalAssistancePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [doctors, setDoctors] = useState([]);
  const [emergencyServices, setEmergencyServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: doctorsData, error: doctorsError } = await supabase
          .from('doctors')
          .select('*')
          .order('rating', { ascending: false });

        const { data: servicesData, error: servicesError } = await supabase
          .from('emergency_services')
          .select('*');

        if (doctorsError || servicesError) {
          throw new Error(doctorsError?.message || servicesError?.message);
        }

        setDoctors(doctorsData);
        setEmergencyServices(servicesData);
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || 
                            doctor.specialty.toLowerCase() === selectedSpecialty.toLowerCase();
    return matchesSearch && matchesSpecialty;
  });

  const formatPhoneNumber = (phone) => {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
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
          <p>Error loading data: {error}</p>
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
    <div className="p-6 space-y-8">
      {/* Search and Filter Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-[var(--text-blue-dark)] mb-6">
          Find Medical Assistance
        </h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex items-center flex-1 relative">
            <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3" />
            <input
              type="text"
              placeholder="Search doctors..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[var(--text-blue-medium)]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--text-blue-medium)]"
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
          >
            <option value="all">All Specialties</option>
            <option value="cardiology">Cardiology</option>
            <option value="pediatrics">Pediatrics</option>
          </select>
        </div>

        {/* Emergency Services Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-[var(--secondary-coral)]">
            <AmbulanceIcon className="w-5 h-5" />
            Emergency Services Nearby
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {emergencyServices.map((service) => (
              <div key={service.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{service.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="inline-flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {service.distance}km away
                      </span>
                      <span className="mx-2">•</span>
                      <span>{service.type}</span>
                    </p>
                  </div>
                  <a 
                    href={`tel:${service.phone_number}`}
                    className="flex items-center gap-2 text-[var(--text-blue-medium)] hover:text-[var(--text-blue-dark)] whitespace-nowrap"
                  >
                    <PhoneIcon className="w-5 h-5" />
                    {formatPhoneNumber(service.phone_number)}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Doctors Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-[var(--text-blue-medium)]">
            <StarIcon className="w-5 h-5" />
            Available Doctors
          </h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Specialty</th>
                  <th className="p-4 text-left">Distance</th>
                  <th className="p-4 text-left">Rating</th>
                  <th className="p-4 text-left">Contact</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor.id} className="border-t hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium">{doctor.name}</td>
                    <td className="p-4 text-gray-600">{doctor.specialty}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {doctor.distance}km
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-yellow-600">
                        <StarIcon className="w-4 h-4 fill-current" />
                        <span>{doctor.rating}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <a
                        href={`https://wa.me/${doctor.phone_number}`}
                        className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-lg hover:bg-green-200 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <PhoneIcon className="w-4 h-4" />
                        WhatsApp
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredDoctors.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                No doctors found matching your criteria
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
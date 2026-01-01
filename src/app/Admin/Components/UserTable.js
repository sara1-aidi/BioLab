'use client';

import React, { useState } from 'react';
import {
  UserIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  TrashIcon,
  MagnifyingGlassIcon,  // Icône de recherche
} from '@heroicons/react/24/outline';

const initialUsers = [
  {
    id: 1,
    name: 'Jean Dupont',
    email: 'jean@exemple.com',
    role: 'patient',
    type: 'premium',
  },
  {
    id: 2,
    name: 'Claire Martin',
    email: 'claire@exemple.com',
    role: 'administrateur',
  },
  {
    id: 3,
    name: 'Alex Dumas',
    email: 'alex@exemple.com',
    role: 'externe',
  },
];

const roleIcons = {
  administrateur: <ShieldCheckIcon className="w-5 h-5 text-blue-600 inline" />,
  patient: <UserIcon className="w-5 h-5 text-green-500 inline" />,
  externe: <UserCircleIcon className="w-5 h-5 text-gray-500 inline" />,
};

const UserTable = () => {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');

  const updateRole = (id, newRole) => {
    const updated = users.map((user) =>
      user.id === id ? { ...user, role: newRole } : user
    );
    setUsers(updated);
  };

  const togglePatientType = (id) => {
    const updated = users.map((user) =>
      user.id === id && user.role === 'patient'
        ? {
            ...user,
            type: user.type === 'premium' ? 'regulier' : 'premium',
          }
        : user
    );
    setUsers(updated);
  };

  const deleteUser = (id) => {
    const confirmDelete = window.confirm('Supprimer ce compte ?');
    if (confirmDelete) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.id.toString().includes(searchQuery)
  );

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 overflow-x-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
      User management
      </h2>

      {/* Barre de recherche stylisée */}
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Rechercher par nom, email ou ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-gray-100 text-sm rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 pl-8 pr-12 transition-all ease-in-out"
        />
        {/* Icône à gauche */}
        <div className="absolute top-1/2 left-3 transform -translate-y-1/2">
          <UserIcon className="w-5 h-5 text-gray-400" />
        </div>
        {/* Icône à droite */}
        <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      <table className="table w-full border-separate border-spacing-x-0 border-spacing-y-2">
        <thead>
          <tr className="text-left text-gray-600">
            <th className="border-r border-gray-200 px-4 py-2">Name</th>
            <th className="border-r border-gray-200 px-4">E-mail</th>
            <th className="border-r border-gray-200 px-4">Role</th>
            <th className="border-r border-gray-200 px-4">Type</th>
            <th className="px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-3 text-gray-500">
              No matches found
              </td>
            </tr>
          ) : (
            filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition">
                <td className="border-r border-gray-200 px-4 py-3 font-medium text-gray-800">
                  {user.name}
                </td>
                <td className="border-r border-gray-200 px-4">{user.email}</td>
                <td className="border-r border-gray-200 px-4 capitalize">
                  <div className="flex items-center gap-2">
                    {roleIcons[user.role]}
                    <select
                      value={user.role}
                      onChange={(e) => updateRole(user.id, e.target.value)}
                      className="border border-gray-300 text-sm rounded-md px-2 py-1 focus:ring focus:ring-blue-200"
                    >
                      <option value="administrateur">Administrator</option>
                      <option value="patient">Patient</option>
                      <option value="externe">External</option>
                    </select>
                  </div>
                </td>
                <td className="border-r border-gray-200 px-4">
                  {user.role === 'patient' ? (
                    <button
                      onClick={() => togglePatientType(user.id)}
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        user.type === 'premium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {user.type === 'premium' ? 'Premium' : 'Régulier'}
                    </button>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Supprimer"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;

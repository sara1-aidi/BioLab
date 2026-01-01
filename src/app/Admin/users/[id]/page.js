'use client';

import { useState } from 'react';

export default function UserProfile({ user }) {
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Mise à jour du profil:', { username, email, phone });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-xl shadow-md space-y-8 w-full max-w-2xl mx-auto"
    >
      {/* Avatar et bouton photo */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-xl font-bold">
          {username.charAt(0).toUpperCase()}
        </div>
        <button type="button" className="text-blue-600 font-medium hover:underline">
         Edit photo
        </button>
      </div>

      {/* Nom d'utilisateur */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          User Name
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
        E-mail address <span className="ml-2 px-2 py-0.5 bg-gray-200 text-xs text-gray-700 rounded-full">Main</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Téléphone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
        Phone number
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Bouton enregistrer */}
      <div className="pt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Save changes
        </button>
      </div>
    </form>
  );
}

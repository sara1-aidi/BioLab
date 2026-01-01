'use client';

import React, { useState } from 'react';

const AddUserForm = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('%m54!DGvjxr53rMx8YQ@CTo');
  const [passwordStrength, setPasswordStrength] = useState('Forte');

  return (
    <div className="min-h-screen flex justify-center items-center px-4 bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2]">
      <form className="w-full max-w-2xl mt-8 px-6 py-8 bg-blue-200 rounded-xl border border-gray-300 shadow-md">
        <h2 className="text-2xl font-bold mb-3 text-gray-800">Add an account</h2>
        <p className="text-sm mb-6 text-gray-500">
        Create a new account and add it to this site.
        </p>

        {[
          { label: 'Identifiant (nécessaire)', name: 'username', type: 'text' },
          { label: 'E-mail (nécessaire)', name: 'email', type: 'email' },
          { label: 'Prénom', name: 'prenom', type: 'text' },
          { label: 'Nom', name: 'nom', type: 'text' },
          { label: 'Site web', name: 'siteweb', type: 'url' }
        ].map(({ label, name, type }) => (
          <div key={name} className="mb-5">
            <label htmlFor={name} className="font-semibold text-sm text-gray-600">
              {label}
            </label>
            <input
              id={name}
              name={name}
              type={type}
              className="mt-2 w-full h-11 px-4 text-base rounded-md border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-300 bg-white"
            />
          </div>
        ))}

        <div className="mb-5">
          <label htmlFor="langue" className="font-semibold text-sm text-gray-600">
            Language
          </label>
          <select
            id="langue"
            name="langue"
            className="mt-2 w-full h-11 px-4 rounded-md border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-300 bg-white"
          >
            <option value="default">Default site</option>
            <option value="fr">French</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="mb-5">
          <label htmlFor="password" className="font-semibold text-sm text-gray-600">
           Password
          </label>

          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              onClick={() => {
                const newPass = Math.random().toString(36).slice(2) + '@123';
                setPassword(newPass);
                setPasswordStrength('Forte');
              }}
              className="text-sm px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-blue-700 hover:bg-gray-200 transition"
            >
             Generate a password
            </button>
          </div>

          <div className="mt-3 flex flex-col gap-2 p-3 bg-green-100 border border-green-500 rounded-md">
            <input
              id="password"
              name="password"
              type={passwordVisible ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-4 rounded-md border border-gray-300 bg-white focus:outline-none"
            />

            <div className="flex justify-between items-center text-sm">
              <span className="text-green-600 font-semibold">{passwordStrength}</span>
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="text-blue-600 hover:underline"
              >
                {passwordVisible ? 'Masquer' : 'Afficher'}
              </button>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="notification"
              defaultChecked
              className="accent-blue-600"
            />
            Email the person about their account
          </label>
        </div>

        <div className="mb-6">
          <label htmlFor="role" className="font-semibold text-sm text-gray-600">
            Role
          </label>
          <select
            id="role"
            name="role"
            className="mt-2 w-full h-11 px-4 rounded-md border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-300 bg-white"
          >
            <option value="administrator">Administrator</option>
            <option value="subscriber">Visitor</option>
            <option value="contributor">Patient</option>
            <option value="author">External</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full h-12 rounded-md bg-blue-700 text-white font-semibold text-base hover:bg-blue-800 transition"
        >
          Add an account
        </button>
      </form>
    </div>
  );
};

export default AddUserForm;

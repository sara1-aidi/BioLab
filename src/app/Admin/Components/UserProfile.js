export default function UserProfile({ user }) {
  if (!user) return <p>
Loading...</p>;

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 max-w-4xl w-full mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Profile Settings</h2>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center text-3xl font-bold shadow">
          {user.username[0].toUpperCase()}
        </div>
        <button className="text-blue-600 hover:underline font-medium">Edit photo</button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">User Name</label>
          <div className="flex items-center gap-4">
            <input
              value={user.username}
              className="border border-gray-300 px-4 py-2 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly
            />
            <button className="text-blue-600 hover:underline font-medium">modify</button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">E-mail address</label>
          <p className="text-gray-800">
            {user.email}
            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Main</span>
          </p>
          <a href="#" className="text-blue-600 text-sm hover:underline">+ Add an e-mail address</a>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Phone number</label>
          <p className="text-gray-800">{user.phone || 'Non renseigné'}</p>
          <a href="#" className="text-blue-600 text-sm hover:underline">+ Add a number</a>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Connected accounts</label>
          <a href="#" className="text-blue-600 text-sm hover:underline">+ Connect an account</a>
        </div>
      </div>
    </div>
  );
}

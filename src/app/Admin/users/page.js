'use client';
import Card from "../Components/Card";
import UserTable from "../Components/UserProfile";


export default function UsersPage() {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <Card />
      <h1 className="text-2xl font-bold mb-6">User management</h1>
      <UserTable />
    </div>
  );
}

import React from 'react';

const Profile = () => {
  const username = localStorage.getItem('username') || 'N/A';
  const email = localStorage.getItem('email') || 'N/A';
  const role = localStorage.getItem('role') || 'N/A';

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white shadow-md rounded-lg font-sans border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">My Profile</h2>

      <div className="space-y-4 text-lg text-gray-700">
        <div className="flex justify-between">
          <span className="font-semibold">Username:</span>
          <span>{username}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold">Email:</span>
          <span>{email}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold">Role:</span>
          <span className="capitalize">{role}</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import React from 'react';
import {
  UserCircleIcon,
  EnvelopeIcon,
  UserIcon,
  IdentificationIcon,
  CalendarIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';

const Profile = () => {
  const username = localStorage.getItem('username') || 'N/A';
  const email = localStorage.getItem('email') || 'N/A';
  const role = localStorage.getItem('role') || 'N/A';
  const phone = localStorage.getItem('phone') || 'N/A';
  const createdAt = localStorage.getItem('createdAt') || 'N/A';

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-100 via-white to-blue-100 flex items-center justify-center p-8">
      <div className="w-full max-w-5xl bg-white/90 backdrop-blur-2xl shadow-2xl rounded-3xl p-10 border border-white/60">
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-3 rounded-full shadow-lg">
              <UserCircleIcon className="w-40 h-40 text-green-500" />
            </div>
            <h2 className="text-4xl font-extrabold text-gray-800 mt-4">My Profile</h2>
            <p className="text-gray-500 text-md mt-1">Your account details and preferences</p>
          </div>

          {/* Info Section */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 md:mt-0 text-gray-700">
            {/* Username */}
            <div className="flex items-start gap-4 border-b pb-4">
              <UserIcon className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="text-lg font-semibold">{username}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4 border-b pb-4">
              <EnvelopeIcon className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg font-semibold">{email}</p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-start gap-4 border-b pb-4">
              <IdentificationIcon className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="text-lg font-semibold capitalize">{role}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4 border-b pb-4">
              <PhoneIcon className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-lg font-semibold">{phone}</p>
              </div>
            </div>

            {/* Account Creation */}
            <div className="flex items-start gap-4 border-b pb-4">
              <CalendarIcon className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Account Created</p>
                <p className="text-lg font-semibold">{createdAt}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

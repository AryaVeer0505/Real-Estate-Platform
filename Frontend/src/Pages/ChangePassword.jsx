import React, { useState } from 'react';
import axiosInstance from '../../axiosInnstance.js';
import { baseURL } from '../../config.js';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (newPassword !== confirmPassword) {
    setMessage("New passwords do not match.");
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const res = await axiosInstance(`${baseURL}/api/password/change-password`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Password changed successfully.");
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setMessage(data.error || "Error changing password.");
    }
  } catch (err) {
    setMessage("Server error.");
  }
};


  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Change Password</h2>
      {message && <div className="mb-4 text-red-500 text-center">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;

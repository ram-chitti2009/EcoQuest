"use client";
import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';

export default function ResetPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  // Password Recovery Function
  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Password reset attempted");
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset`
    });
    
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Password reset email sent! Check your inbox.' });
      setEmail(''); // Clear the form
    }
  };

  // Update User Function
  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("User update attempted");
    
    const updateData: { email?: string; password?: string } = {};
    if (newEmail) updateData.email = newEmail;
    if (newPassword) updateData.password = newPassword;
    
    if (Object.keys(updateData).length === 0) {
      setMessage({ type: 'error', text: 'Please provide either a new email or password to update.' });
      return;
    }
    
    const { error } = await supabase.auth.updateUser(updateData);
    
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'User information updated successfully!' });
      setNewEmail(''); // Clear the form
      setNewPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-center text-black">Reset Password</h1>
          <p className="text-center text-black mt-2">
            Reset your password or update your account information
          </p>
        </div>

        {/* Password Recovery Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-black">Password Recovery</h2>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter your email"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Send Reset Email
            </button>
          </form>
        </div>

        {/* Update User Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-black">Update User Information</h2>
          <form onSubmit={handleUpdateUser} className="space-y-4">
            <div>
              <label htmlFor="newEmail" className="block text-sm font-medium text-black">
                New Email Address (optional)
              </label>
              <input
                type="email"
                id="newEmail"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter new email"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-black">
                New Password (optional)
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter new password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update Information
            </button>
          </form>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`p-4 rounded-md ${
            message.type === 'error' 
              ? 'bg-red-50 text-black border border-red-200' 
              : 'bg-green-50 text-black border border-green-200'
          }`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaUsers, FaSearch } from 'react-icons/fa';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qText, setQText] = useState('');
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://charity-donation-platform-server.vercel.app';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/users`);
        if (!res.ok) {
          throw new Error(`Failed to load users: ${res.status}`);
        }

        const data = await res.json();

        const normalized = data.map((u, idx) => ({
          id: u._id || u.id || `user-${idx}`,  // ✔ FIX: unique fallback key
          uid: u.uid || '',
          email: u.email || '',
          displayName: u.displayName || u.name || '',
          photoURL: u.photoURL || '',
          role: u.role || 'donor',
          providerId: u.providerId || 'password',
          createdAt: u.createdAt || null,
        }));

        setUsers(normalized);
      } catch (e) {
        console.error('Failed to load users:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [API_BASE_URL]);

  // ✔ Fixed filtering to avoid null errors
  const filtered = users.filter(u => {
    const t = qText.toLowerCase();
    return (
      u.displayName.toLowerCase().includes(t) ||
      u.email.toLowerCase().includes(t) ||
      u.role.toLowerCase().includes(t)
    );
  });

  return (
  <>
  <Helmet>
    <title>Admin Users - Charity Platform</title>
  </Helmet>

  <div className="space-y-6">

    {/* Header */}
    <div className="flex items-center justify-between p-5 rounded-2xl 
      bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 
      shadow-lg text-white">
      
      <div className="flex items-center gap-3">
        <FaUsers className="text-2xl opacity-90" />
        <h1 className="text-2xl font-semibold tracking-wide">
          Users Management
        </h1>
      </div>

      {/* Search */}
      <div className="join">
        <input
          type="text"
          placeholder="Search name, email, role"
          value={qText}
          onChange={(e) => setQText(e.target.value)}
          className="input join-item w-72 bg-white/90 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <button className="btn join-item bg-white/20 hover:bg-white/30 text-white border-none">
          <FaSearch />
        </button>
      </div>
    </div>

    {/* Table Card */}
    <div className="card bg-base-100 rounded-2xl shadow-lg border border-base-200">
      <div className="card-body p-0">

        {loading ? (
          <div className="p-10 flex justify-center">
            <span className="loading loading-spinner loading-lg text-indigo-600"></span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700">
                  <th>#</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Provider</th>
                  <th>Created</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((u, idx) => (
                    <tr
                      key={u.id}
                      className="hover:bg-indigo-50/60 transition-colors"
                    >
                      <td className="font-medium text-indigo-600">
                        {idx + 1}
                      </td>

                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-10 h-10 ring-2 ring-indigo-100">
                              <img
                                src={
                                  u.photoURL ||
                                  "https://i.ibb.co/fH0ZCz1/user-placeholder.png"
                                }
                                alt={u.displayName || "User"}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="font-semibold text-gray-800">
                              {u.displayName || "—"}
                            </div>
                            <div className="text-xs text-gray-400">
                              {u.uid ? u.uid.slice(0, 8) : "—"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="text-gray-600">
                        {u.email || "—"}
                      </td>

                      <td>
                        <span className="badge bg-indigo-100 text-indigo-700 border-indigo-200">
                          {u.role}
                        </span>
                      </td>

                      <td className="text-sm text-gray-500">
                        {u.providerId}
                      </td>

                      <td className="text-sm text-gray-600">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleString()
                          : "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-12 text-gray-400"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>

  </div>
</>


  );
};

export default AdminUsers;

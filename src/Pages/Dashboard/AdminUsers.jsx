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
          id: u._id || u.id || `user-${idx}`,
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
          bg-black/70 backdrop-blur-md
          shadow-xl border border-indigo-500/30 text-white">

          <div className="flex items-center gap-3">
            <FaUsers className="text-2xl text-indigo-300" />
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
              className="input join-item w-72
                bg-black/60 text-gray-200 placeholder:text-gray-400
                border border-indigo-500/30
                focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="btn join-item bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-200 border border-indigo-500/30">
              <FaSearch />
            </button>
          </div>
        </div>

        {/* Table Card */}
        <div className="card bg-black/70 backdrop-blur-md rounded-2xl shadow-xl border border-indigo-500/30">
          <div className="card-body p-0">

            {loading ? (
              <div className="p-10 flex justify-center">
                <span className="loading loading-spinner loading-lg text-indigo-400"></span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table text-gray-200">

                  <thead>
                    <tr className="bg-black/60 text-indigo-300 border-b border-indigo-500/30">
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
                          className="hover:bg-indigo-500/10 transition-colors border-b border-indigo-500/10"
                        >
                          <td className="font-medium text-indigo-400">
                            {idx + 1}
                          </td>

                          <td>
                            <div className="flex items-center gap-3">
                              <div className="avatar">
                                <div className="mask mask-squircle w-10 h-10 ring-2 ring-indigo-500/30">
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
                                <div className="font-semibold text-gray-100">
                                  {u.displayName || "—"}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {u.uid ? u.uid.slice(0, 8) : "—"}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="text-gray-300">
                            {u.email || "—"}
                          </td>

                          <td>
                            <span className="badge bg-indigo-600/20 text-indigo-300 border border-indigo-500/40">
                              {u.role}
                            </span>
                          </td>

                          <td className="text-sm text-gray-400">
                            {u.providerId}
                          </td>

                          <td className="text-sm text-gray-400">
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
                          className="text-center py-12 text-gray-500"
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

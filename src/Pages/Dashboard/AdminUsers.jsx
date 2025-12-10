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
        const normalized = data.map((u) => ({
          id: u._id || u.id,
          uid: u.uid,
          email: u.email,
          displayName: u.displayName || u.name,
          photoURL: u.photoURL,
          role: u.role || 'donor',
          providerId: u.providerId || 'password',
          createdAt: u.createdAt,
        }));
        setUsers(normalized);
      } catch (e) {
        console.error('Failed to load users:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = users.filter(u => {
    const t = qText.toLowerCase();
    return !t ||
      (u.displayName || '').toLowerCase().includes(t) ||
      (u.email || '').toLowerCase().includes(t) ||
      (u.role || '').toLowerCase().includes(t);
  });

  return (
    <>
      <Helmet>
        <title>Admin Users - Charity Platform</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaUsers className="text-2xl text-primary" />
            <h1 className="text-2xl font-bold">Users</h1>
          </div>
          <div className="join">
            <input
              type="text"
              placeholder="Search name, email, role"
              value={qText}
              onChange={(e) => setQText(e.target.value)}
              className="input input-bordered join-item w-72"
            />
            <button className="btn btn-primary join-item"><FaSearch /></button>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/5 shadow-lg border border-primary/20">
          <div className="card-body p-0">
            {loading ? (
              <div className="p-6">
                <span className="loading loading-spinner"></span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Provider</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((u, idx) => (
                      <tr key={u.id}>
                        <td>{idx + 1}</td>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="mask mask-squircle w-10 h-10">
                                <img src={u.photoURL || '/api/placeholder/40/40'} alt={u.displayName || 'User'} />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">{u.displayName || '—'}</div>
                              <div className="text-sm opacity-50">{u.uid?.slice(0,8)}</div>
                            </div>
                          </div>
                        </td>
                        <td>{u.email || '—'}</td>
                        <td>
                          <span className="badge badge-outline">{u.role || 'donor'}</span>
                        </td>
                        <td>{u.providerId || 'password'}</td>
                        <td>{u.createdAt ? new Date(u.createdAt).toLocaleString() : '—'}</td>
                      </tr>
                    ))}
                    {!filtered.length && (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-sm text-base-content/70">No users found</td>
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

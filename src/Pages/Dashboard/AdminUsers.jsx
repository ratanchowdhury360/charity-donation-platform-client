import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaUsers, FaSearch } from 'react-icons/fa';
import { db } from '../../firebase/firebase.config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qText, setQText] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, 'users');
        const qy = query(usersRef, orderBy('createdAt', 'desc'));
        const snap = await getDocs(qy);
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setUsers(data);
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

        <div className="card bg-base-100 shadow">
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
                        <td>{u.createdAt?.toDate ? u.createdAt.toDate().toLocaleString() : '—'}</td>
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

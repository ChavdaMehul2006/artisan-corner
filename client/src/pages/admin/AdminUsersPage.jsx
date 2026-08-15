import React, { useState, useEffect } from 'react';
import { Search, UserCheck, UserX, Trash2, AlertTriangle, Shield, X } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import axiosClient from '../../api/axiosClient';
import { useToast } from '../../components/common/Toast';

export const AdminUsersPage = () => {
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Delete modal state
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/admin/users?search=${encodeURIComponent(search)}&role=${roleFilter}`);
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  const handleToggleActive = async (userId, currentActive, name) => {
    try {
      await axiosClient.patch(`/admin/users/${userId}/toggle-active`);
      addToast(`User ${name} ${currentActive ? 'deactivated' : 'activated'}`, 'success');
      fetchUsers();
    } catch (err) {
      addToast(err.message || 'Failed to update user status', 'error');
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      setDeleting(true);
      await axiosClient.delete(`/admin/users/${userToDelete._id}`);
      addToast(`User "${userToDelete.name}" and associated records permanently removed.`, 'success');
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      addToast(err.message || 'Failed to delete user', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-stone-800">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
          User & Vendor Governance
        </h1>
        <p className="text-xs text-stone-400 mt-1">
          Review registered accounts, manage buyer/vendor permissions, and remove accounts
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-800 border border-stone-700 rounded-xl text-xs text-white placeholder-stone-400 focus:outline-none focus:border-indigo-500"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 bg-stone-800 border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Roles</option>
          <option value="BUYER">Buyers</option>
          <option value="VENDOR">Vendors</option>
          <option value="ADMIN">Administrators</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-stone-950/80 rounded-3xl border border-stone-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-900 border-b border-stone-800 text-stone-400 uppercase font-bold tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">User / Artisan</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions & Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 font-normal">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-stone-500">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-stone-900/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar?.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover border border-stone-700"
                        />
                        <div>
                          <h5 className="font-bold text-white">{u.name}</h5>
                          <p className="text-stone-400 text-[11px] font-mono">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === 'ADMIN'
                            ? 'bg-indigo-900/80 text-indigo-300 border border-indigo-700'
                            : u.role === 'VENDOR'
                            ? 'bg-amber-900/80 text-amber-300 border border-amber-700'
                            : 'bg-stone-800 text-stone-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-400">{formatDate(u.createdAt)}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.isActive
                            ? 'bg-emerald-900/80 text-emerald-300'
                            : 'bg-rose-900/80 text-rose-300'
                        }`}
                      >
                        {u.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {u.role !== 'ADMIN' ? (
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleToggleActive(u._id, u.isActive, u.name)}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                              u.isActive
                                ? 'bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700'
                                : 'bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800'
                            }`}
                          >
                            {u.isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                            <span>{u.isActive ? 'Deactivate' : 'Activate'}</span>
                          </button>

                          <button
                            onClick={() => setUserToDelete(u)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                            title="Permanently remove user"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-stone-500 font-semibold italic">Protected Admin</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2 text-rose-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-serif text-lg font-bold text-white">Confirm Removal</h3>
              </div>
              <button
                onClick={() => setUserToDelete(null)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-300 leading-relaxed">
              <p>
                Are you sure you want to permanently delete <strong className="text-white">{userToDelete.name}</strong> (<span className="font-mono text-stone-400">{userToDelete.email}</span>)?
              </p>
              {userToDelete.role === 'VENDOR' && (
                <div className="p-3 bg-rose-950/40 border border-rose-800/80 rounded-2xl text-rose-300">
                  ⚠️ <strong>Vendor Account Warning:</strong> Removing this artisan will also delete their storefront, craft product catalog, active carts, and customer reviews.
                </div>
              )}
              <p className="text-stone-500">
                This action is irreversible and immediately wipes all associated database records.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteUser}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {deleting ? 'Deleting Records...' : 'Permanently Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;

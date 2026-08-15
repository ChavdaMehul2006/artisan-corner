import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Lock, Phone, Mail, Camera, Sparkles, Check, Shield } from 'lucide-react';
import { checkAuth } from '../store/slices/authSlice';
import axiosClient from '../api/axiosClient';
import { useToast } from '../components/common/Toast';

const AVATAR_PRESETS = [
  { label: 'Studio Master', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300' },
  { label: 'Artisan Potter', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300' },
  { label: 'Leather Craftsman', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300' },
  { label: 'Weaver & Painter', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300' },
  { label: 'Woodworker', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=300' }
];

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const { user } = useSelector((state) => state.auth);

  // Profile info state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar?.url || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAvatarUrl(user.avatar?.url || '');
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setUpdatingProfile(true);
      await axiosClient.patch('/auth/profile', {
        name,
        phone,
        avatar: avatarUrl ? { url: avatarUrl } : undefined
      });
      addToast('Profile name and photo updated successfully!', 'success');
      dispatch(checkAuth());
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast('New passwords do not match.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      addToast('Password must be at least 6 characters.', 'error');
      return;
    }

    try {
      setChangingPassword(true);
      await axiosClient.patch('/auth/change-password', { currentPassword, newPassword });
      addToast('Password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      addToast(err.message || 'Failed to change password', 'error');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-10">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          Account & Profile Settings
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Customize your display name, profile avatar photo, contact info, and security
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <div className="w-10 h-10 rounded-full bg-artisan-100 text-terracotta-600 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Profile Details</h3>
              <p className="text-xs text-stone-400">Photo & personal identity</p>
            </div>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-5">
            {/* Avatar Preview & URL */}
            <div className="flex flex-col items-center sm:items-start gap-4 p-4 bg-artisan-50 rounded-2xl border border-stone-200/80">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                    alt={name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-terracotta-500 shadow-sm"
                  />
                  <div className="absolute -bottom-1 -right-1 p-1 bg-stone-900 text-white rounded-full">
                    <Camera className="w-3 h-3" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">{name || 'Your Account'}</h4>
                  <span className="inline-block mt-0.5 px-2 py-0.5 bg-terracotta-100 text-terracotta-700 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                    {user?.role || 'BUYER'}
                  </span>
                </div>
              </div>

              {/* Preset Avatar Selection */}
              <div className="w-full space-y-1.5 pt-2 border-t border-stone-200/60">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-stone-500">
                  Quick Select Portrait Avatar
                </label>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(preset.url)}
                      className={`relative shrink-0 rounded-full transition-all cursor-pointer ${
                        avatarUrl === preset.url ? 'ring-2 ring-terracotta-500 scale-105' : 'opacity-70 hover:opacity-100'
                      }`}
                      title={preset.label}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Image URL Input */}
              <div className="w-full">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-stone-500 mb-1">
                  Or Custom Photo / Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs focus:outline-none focus:border-terracotta-500"
                />
              </div>
            </div>

            {/* Name Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-artisan-50 border border-stone-300 rounded-xl text-sm font-medium focus:outline-none focus:border-terracotta-500 focus:bg-white"
              />
            </div>

            {/* Email Field (Readonly) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                Email Address (Account ID)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-sm font-mono text-stone-500 cursor-not-allowed"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-artisan-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-terracotta-500 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={updatingProfile}
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {updatingProfile ? 'Saving Changes...' : 'Save Profile & Photo'}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <div className="w-10 h-10 rounded-full bg-artisan-100 text-stone-700 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Security Credentials</h3>
              <p className="text-xs text-stone-400">Update your account password</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-artisan-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-terracotta-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-artisan-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-terracotta-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-artisan-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-terracotta-500 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={changingPassword}
              className="w-full py-3 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow disabled:opacity-50 cursor-pointer"
            >
              {changingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

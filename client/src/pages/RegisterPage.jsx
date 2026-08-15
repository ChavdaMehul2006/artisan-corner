import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Store, Lock, Mail, User, Phone } from 'lucide-react';
import { registerUser } from '../store/slices/authSlice';
import { useToast } from '../components/common/Toast';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToast } = useToast();

  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }

    const result = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(result)) {
      addToast('Welcome to Artisan\'s Corner! Account created.', 'success');
      navigate('/');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/80 shadow-artisan">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-terracotta-600 flex items-center justify-center text-white shadow-md">
              <Store className="w-5 h-5" />
            </div>
            <span className="font-serif text-2xl font-bold text-stone-900">
              Artisan's<span className="text-terracotta-600">.</span>Corner
            </span>
          </Link>
          <h2 className="font-serif text-2xl font-bold text-stone-900 pt-2">
            Create Your Account
          </h2>
          <p className="text-xs text-stone-500">
            Join mindful collectors and independent artisans worldwide
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium">
            {typeof error === 'string' ? error : 'Failed to register account.'}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Eleanor Vance"
                className="w-full pl-10 pr-4 py-2.5 bg-artisan-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-terracotta-500 focus:bg-white"
              />
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-artisan-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-terracotta-500 focus:bg-white"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Password * (min 6 chars)
            </label>
            <div className="relative">
              <input
                type="password"
                required
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-artisan-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-terracotta-500 focus:bg-white"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-10 pr-4 py-2.5 bg-artisan-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-terracotta-500 focus:bg-white"
              />
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Join Artisan\'s Corner'}
          </button>
        </form>

        <div className="text-center text-xs text-stone-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-stone-900 hover:text-terracotta-600 underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

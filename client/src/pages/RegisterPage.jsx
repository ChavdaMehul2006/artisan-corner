import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Store, Lock, Mail, User, Phone, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { registerUser, clearAuthError } from '../store/slices/authSlice';
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
    confirmPassword: '',
    phone: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [clientErrors, setClientErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (clientErrors[name]) {
      setClientErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedName || trimmedName.length < 2) {
      errors.name = 'Full name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      errors.email = 'Please provide a valid email address (e.g. name@example.com).';
    }

    if (!formData.password || formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      addToast('Please correct the highlighted fields.', 'error');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      phone: formData.phone.trim()
    };

    const result = await dispatch(registerUser(payload));
    if (registerUser.fulfilled.match(result)) {
      addToast(`Welcome to Artisan's Corner, ${payload.name}! Your account is ready.`, 'success');
      navigate('/');
    } else {
      const errorMsg = result.payload || 'Registration failed. Please check your information.';
      addToast(errorMsg, 'error');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-7 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/80 shadow-artisan">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-terracotta-600 flex items-center justify-center text-white shadow-md">
              <Store className="w-5 h-5" />
            </div>
            <span className="font-serif text-2xl font-bold text-stone-900">
              Artisan's<span className="text-terracotta-600">.</span>Corner
            </span>
          </Link>
          <h2 className="font-serif text-2xl font-bold text-stone-900 pt-1">
            Create Your Account
          </h2>
          <p className="text-xs text-stone-500">
            Join mindful collectors and independent artisans worldwide
          </p>
        </div>

        {/* Global Server Error Alert */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{typeof error === 'string' ? error : 'Failed to register account.'}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
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
                className={`w-full pl-10 pr-4 py-2.5 bg-artisan-50 border rounded-xl text-sm transition-colors focus:outline-none focus:bg-white ${
                  clientErrors.name ? 'border-rose-400 focus:border-rose-500' : 'border-stone-300 focus:border-terracotta-500'
                }`}
              />
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
            {clientErrors.name && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium">{clientErrors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="eleanor@example.com"
                className={`w-full pl-10 pr-4 py-2.5 bg-artisan-50 border rounded-xl text-sm transition-colors focus:outline-none focus:bg-white ${
                  clientErrors.email ? 'border-rose-400 focus:border-rose-500' : 'border-stone-300 focus:border-terracotta-500'
                }`}
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
            {clientErrors.email && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium">{clientErrors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Password * (min 6 characters)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2.5 bg-artisan-50 border rounded-xl text-sm transition-colors focus:outline-none focus:bg-white ${
                  clientErrors.password ? 'border-rose-400 focus:border-rose-500' : 'border-stone-300 focus:border-terracotta-500'
                }`}
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {clientErrors.password && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium">{clientErrors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-2.5 bg-artisan-50 border rounded-xl text-sm transition-colors focus:outline-none focus:bg-white ${
                  clientErrors.confirmPassword ? 'border-rose-400 focus:border-rose-500' : 'border-stone-300 focus:border-terracotta-500'
                }`}
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-3" />
              )}
            </div>
            {clientErrors.confirmPassword && (
              <p className="text-[11px] text-rose-600 mt-1 font-medium">{clientErrors.confirmPassword}</p>
            )}
          </div>

          {/* Phone Field (Optional) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Phone Number <span className="text-stone-400 font-normal lowercase">(optional)</span>
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md disabled:opacity-50 cursor-pointer mt-2"
          >
            {loading ? 'Creating Account...' : 'Join Artisan\'s Corner'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
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

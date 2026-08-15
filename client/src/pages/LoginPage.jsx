import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Store, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { loginUser, clearAuthError } from '../store/slices/authSlice';
import { useToast } from '../components/common/Toast';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { addToast } = useToast();

  const { loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      addToast('Welcome back to Artisan\'s Corner!', 'success');
      navigate(from, { replace: true });
    }
  };

  const handleQuickDemoLogin = async (demoEmail) => {
    setEmail(demoEmail);
    setPassword('ArtisanPass123!');
    const result = await dispatch(loginUser({ email: demoEmail, password: 'ArtisanPass123!' }));
    if (loginUser.fulfilled.match(result)) {
      addToast(`Logged in as ${demoEmail.split('@')[0]}`, 'success');
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200/80 shadow-artisan">
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
          <h2 className="font-serif text-2xl font-bold text-stone-900 pt-2">
            Sign In to Your Account
          </h2>
          <p className="text-xs text-stone-500">
            Access your orders, saved craft favorites, or maker studio
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium">
            {typeof error === 'string' ? error : 'Invalid login credentials.'}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-artisan-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-terracotta-500 focus:bg-white"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-artisan-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-terracotta-500 focus:bg-white"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Access Bar
        <div className="pt-4 border-t border-stone-100 space-y-2.5">
          <span className="block text-center text-[11px] font-bold uppercase tracking-wider text-stone-400">
            ⚡ 1-Click Quick Demo Accounts
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('buyer@artisanscorner.com')}
              className="px-2 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-[11px] font-bold transition-colors truncate"
            >
              Demo Buyer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('vendor@artisanscorner.com')}
              className="px-2 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-[11px] font-bold transition-colors truncate"
            >
              Demo Vendor
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin@artisanscorner.com')}
              className="px-2 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-xl text-[11px] font-bold transition-colors truncate"
            >
              Demo Admin
            </button>
          </div>
        </div> */}

        {/* Footer link */}
        <div className="text-center text-xs text-stone-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-terracotta-600 hover:text-terracotta-700 underline">
            Join Artisan's Corner
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

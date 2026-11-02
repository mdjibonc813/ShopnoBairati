import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  Phone, 
  ShieldCheck, 
  LogIn, 
  UserPlus, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2,
  Database
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalMode, 
    loginUser, 
    registerUser, 
    loginWithGoogle,
    settings,
    setActivePage 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'customer' | 'register' | 'admin'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (authModalMode === 'admin') {
      setActiveTab('admin');
      setEmail('mdjibonc813@gmail.com');
      setPassword('admin123');
    } else if (authModalMode === 'register') {
      setActiveTab('register');
      setEmail('');
      setPassword('');
    } else {
      setActiveTab('customer');
      setEmail('');
      setPassword('');
    }
    setError('');
    setSuccessMsg('');
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (activeTab === 'register') {
        const res = await registerUser(email, password, name, phoneNumber);
        if (res.success) {
          setSuccessMsg('Account registered successfully! Welcome to our store.');
        } else {
          setError(res.error || 'Failed to create account.');
        }
      } else if (activeTab === 'admin') {
        const res = await loginUser(email, password, 'admin');
        if (res.success) {
          setSuccessMsg('Admin login successful! Directing to dashboard...');
          setTimeout(() => {
            setActivePage('admin-dashboard');
          }, 400);
        } else {
          setError(res.error || 'Invalid admin credentials.');
        }
      } else {
        const res = await loginUser(email, password, 'customer', name);
        if (res.success) {
          setSuccessMsg('Logged in successfully!');
        } else {
          setError(res.error || 'Failed to log in.');
        }
      }
    } catch (err) {
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCustomer = () => {
    setEmail('customer@store.com');
    setPassword('customer123');
    setName('Mahmud Hasan');
    setError('');
  };

  const handleDemoAdmin = () => {
    setActiveTab('admin');
    setEmail('mdjibonc813@gmail.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-950/50 backdrop-blur-xs transition-opacity"
        onClick={closeAuthModal}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          
          {/* Modal Header */}
          <div className="bg-stone-900 text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-serif-display font-bold text-white">
                {settings.logoText?.[0] || 'A'}
              </div>
              <div>
                <h3 className="font-serif-display text-base font-bold tracking-wide">
                  {settings.storeName}
                </h3>
                <span className="text-[10px] text-stone-400 block -mt-0.5">
                  Member &amp; Staff Authentication
                </span>
              </div>
            </div>

            <button
              onClick={closeAuthModal}
              className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-stone-200 bg-stone-50 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('customer');
                setError('');
              }}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                activeTab === 'customer'
                  ? 'border-stone-900 text-stone-900 bg-white'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Customer Login
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setError('');
              }}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                activeTab === 'register'
                  ? 'border-stone-900 text-stone-900 bg-white'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Register
            </button>

            {/* Admin tab is only rendered if opened specifically for admin or already in admin tab */}
            {(authModalMode === 'admin' || activeTab === 'admin') && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('admin');
                  setEmail('mdjibonc813@gmail.com');
                  setPassword('admin123');
                  setError('');
                }}
                className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                  activeTab === 'admin'
                    ? 'border-emerald-600 text-emerald-900 bg-white'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Admin Portal
              </button>
            )}
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-4">
            
            {/* Quick Demo Credentials Pill */}
            {activeTab === 'customer' && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                <div>
                  <span className="font-bold block">Quick Customer Demo:</span>
                  <span className="font-mono text-[11px] text-emerald-700">customer@store.com</span>
                </div>
                <button
                  type="button"
                  onClick={handleDemoCustomer}
                  className="px-2.5 py-1 bg-emerald-600 text-white font-semibold rounded-md text-[11px] hover:bg-emerald-700"
                >
                  Auto-fill
                </button>
              </div>
            )}

            {activeTab === 'admin' && (
              <div className="p-2.5 bg-stone-100 border border-stone-300 rounded-xl flex items-center justify-between text-xs text-stone-800">
                <div>
                  <span className="font-bold block">Authorized Admin:</span>
                  <span className="font-mono text-[11px] text-stone-700">mdjibonc813@gmail.com • admin123</span>
                </div>
                <button
                  type="button"
                  onClick={handleDemoAdmin}
                  className="px-2.5 py-1 bg-stone-900 text-white font-semibold rounded-md text-[11px] hover:bg-stone-800"
                >
                  Auto-fill
                </button>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              
              {activeTab === 'register' && (
                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tanvir Ahmed"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
                    />
                    <User className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
                  />
                  <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              {activeTab === 'register' && (
                <div>
                  <label className="block font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Phone Number (For WhatsApp Delivery Confirmation)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="01700-000000"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
                    />
                    <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
                  />
                  <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-[0.98] mt-2"
              >
                {activeTab === 'register' ? (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
                  </>
                ) : activeTab === 'admin' ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{loading ? 'Verifying...' : 'Sign in as Administrator'}</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-3.5 h-3.5" />
                    <span>{loading ? 'Signing in...' : 'Sign In to Account'}</span>
                  </>
                )}
              </button>
            </form>

            {/* Google Login Option for Customers */}
            {activeTab !== 'admin' && (
              <div className="pt-2">
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-stone-200" />
                  <span className="flex-shrink mx-2 text-[10px] text-stone-400 uppercase">Or continue with</span>
                  <div className="flex-grow border-t border-stone-200" />
                </div>

                <button
                  type="button"
                  onClick={() => loginWithGoogle()}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-semibold transition-colors shadow-2xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google Account Sign-In</span>
                </button>
              </div>
            )}

          </div>

          {/* Footer note */}
          <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 text-[11px] text-stone-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Firebase Auth &amp; Firestore Synced</span>
            </span>
            <button 
              onClick={() => {
                if (activeTab === 'register') setActiveTab('customer');
                else if (activeTab === 'customer') setActiveTab('register');
                else setActiveTab('customer');
              }}
              className="text-stone-700 font-semibold hover:underline"
            >
              {activeTab === 'register' ? 'Have account? Sign in' : 'Create new account'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

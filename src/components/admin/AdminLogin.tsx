import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowLeft, KeyRound, AlertCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, setActivePage, settings } = useStore();
  const [email, setEmail] = useState('mdjibonc813@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = loginAdmin(email, password);
    if (success) {
      setActivePage('admin-dashboard');
    } else {
      setError('অনুমতি নেই: শুধুমাত্র mdjibonc813@gmail.com অ্যাডমিন প্যানেলে লগইন করতে পারবেন। সাধারণ ব্যবহারকারীদের জন্য অ্যাডমিন অ্যাক্সেস সংরক্ষিত নয়।');
    }
  };

  const handleDemoFill = () => {
    setEmail('mdjibonc813@gmail.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Return to website link */}
      <div className="max-w-md w-full mx-auto mb-6">
        <button
          onClick={() => setActivePage('home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Customer Storefront</span>
        </button>
      </div>

      <div className="max-w-md w-full mx-auto bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
        
        {/* Brand Lockup */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-stone-900 text-white flex items-center justify-center mx-auto mb-3 shadow-sm font-serif-display text-xl font-bold">
            {settings.logoText?.[0] || 'A'}
          </div>
          <h2 className="font-serif-display text-2xl font-bold text-stone-900">
            Admin Portal Login
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Restricted access exclusively for <strong className="text-stone-800">mdjibonc813@gmail.com</strong>
          </p>
        </div>

        {/* Quick Demo Credentials Banner */}
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
          <div>
            <span className="font-semibold block">Authorized Admin:</span>
            <span className="font-mono text-[11px] text-emerald-700">mdjibonc813@gmail.com • admin123</span>
          </div>
          <button
            type="button"
            onClick={handleDemoFill}
            className="px-2.5 py-1 bg-emerald-600 text-white font-semibold rounded-md text-[11px] hover:bg-emerald-700 transition-colors"
          >
            Auto-fill
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Email or Username
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@store.com"
                className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => setForgotPasswordNotice(!forgotPasswordNotice)}
                className="text-[11px] text-stone-500 hover:text-stone-800 underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          {forgotPasswordNotice && (
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-600">
              For security, password recovery can be verified via store master email ({settings.contactEmail}) or use the pre-configured credentials <code className="font-mono text-stone-900 font-bold">admin123</code>.
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-sm font-semibold transition-all shadow-sm active:scale-[0.98]"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sign In to Dashboard</span>
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-stone-400">
          Private administrative access for store managers.
        </div>

      </div>
    </div>
  );
};

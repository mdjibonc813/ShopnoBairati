import React from 'react';
import { MessageCircle, MapPin, Mail, Clock, Phone, ShieldCheck, Truck, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings, setActivePage, categories, navigateToShopWithCategory, adminUser, currentUser, openAuthModal, logout } = useStore();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Trust Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-14 border-b border-stone-800">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-stone-800 flex items-center justify-center shrink-0 text-emerald-400">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-medium text-sm">Direct WhatsApp Ordering</h4>
              <p className="text-stone-400 text-xs mt-1 leading-relaxed">
                No passwords, no sign-ups. Tap order and chat directly with our Dhaka store team.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-stone-800 flex items-center justify-center shrink-0 text-stone-300">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-medium text-sm">Cash on Delivery (COD)</h4>
              <p className="text-stone-400 text-xs mt-1 leading-relaxed">
                Pay when the package arrives at your doorstep anywhere in Bangladesh.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-stone-800 flex items-center justify-center shrink-0 text-stone-300">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-medium text-sm">Open &amp; Check Before Pay</h4>
              <p className="text-stone-400 text-xs mt-1 leading-relaxed">
                Inspect your product in front of the courier rider for complete peace of mind.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-stone-800 flex items-center justify-center shrink-0 text-stone-300">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-medium text-sm">7-Day Easy Exchange</h4>
              <p className="text-stone-400 text-xs mt-1 leading-relaxed">
                Hassle-free replacement policy if there is any sizing or manufacturing issue.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-stone-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="font-serif-display text-2xl font-bold text-white tracking-wider">
              {settings.storeName}
            </div>
            <p className="text-stone-400 text-sm leading-relaxed max-w-sm">
              {settings.tagline}
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button onClick={() => setActivePage('home')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('shop')} className="hover:text-white transition-colors">
                  All Catalog Items
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('contact')} className="hover:text-white transition-colors">
                  Store Location &amp; Map
                </button>
              </li>
              {adminUser && (
                <li>
                  <button 
                    onClick={() => setActivePage('admin-dashboard')} 
                    className="hover:text-emerald-400 text-stone-400 transition-colors flex items-center gap-1.5 pt-2 font-medium"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Admin Dashboard</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider">Collections</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              {categories.slice(0, 5).map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigateToShopWithCategory(cat.name)}
                    className="hover:text-white transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider">Store Concierge</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-white font-medium">{settings.whatsappNumberDisplay}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-stone-400 shrink-0" />
                <span>{settings.contactEmail}</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <span>{settings.businessHours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © 2026 {settings.storeName}. All rights reserved. Made for Bangladesh.
          </div>
          <div className="flex items-center gap-6">
            <span>Currency: BDT (৳)</span>
            <span>Cash on Delivery</span>
            {currentUser ? (
              <button 
                onClick={() => logout()}
                className="text-stone-400 hover:text-red-400 underline underline-offset-4"
              >
                Logout ({currentUser.name.split(' ')[0]})
              </button>
            ) : (
              <button 
                onClick={() => openAuthModal('login')}
                className="text-stone-400 hover:text-stone-200 underline underline-offset-4"
              >
                Login / Register
              </button>
            )}
            <button 
              onClick={() => {
                if (adminUser) setActivePage('admin-dashboard');
                else openAuthModal('admin');
              }}
              className="text-stone-400 hover:text-stone-200 underline underline-offset-4"
            >
              {adminUser ? 'Manage Store' : 'Staff Portal'}
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

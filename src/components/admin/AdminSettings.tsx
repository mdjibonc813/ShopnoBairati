import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Check, 
  MessageCircle, 
  Store, 
  MapPin, 
  Mail, 
  Clock, 
  Coins, 
  Truck, 
  RotateCcw,
  Sparkles,
  ExternalLink,
  User,
  ShieldCheck,
  Phone,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, updateAdminProfile, resetAllToDefault, currentUser } = useStore();

  const [form, setForm] = useState({ ...settings });
  const [success, setSuccess] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  // Admin Profile state (Name, Address, Phone)
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || 'Md Jibon',
    phone: currentUser?.phone || settings.whatsappNumberDisplay || '+880 1712-345678',
    address: currentUser?.address || settings.address || 'House 42, Road 11, Banani, Dhaka-1213, Bangladesh',
  });
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        name: currentUser.name || 'Md Jibon',
        phone: currentUser.phone || settings.whatsappNumberDisplay || '+880 1712-345678',
        address: currentUser.address || settings.address || 'House 42, Road 11, Banani, Dhaka-1213, Bangladesh',
      });
    }
  }, [currentUser, settings]);

  const handleChange = (field: keyof typeof settings, val: string) => {
    setForm(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    await updateAdminProfile(profileForm);
    setProfileLoading(false);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleReset = () => {
    resetAllToDefault();
    setResetConfirm(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      window.location.reload();
    }, 800);
  };

  const testWhatsAppUrl = `https://wa.me/${form.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello! This is a test message to verify WhatsApp store settings for ${form.storeName}.`)}`;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-display text-2xl font-bold text-stone-900">
            Store &amp; WhatsApp Configuration
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
            Customize your store identity, WhatsApp ordering recipient, business address, and BDT currency settings.
          </p>
        </div>

        <a
          href={testWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Test WhatsApp Hotline</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Admin Personal Profile Card (Name, Address, Phone) */}
      <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-2xl p-6 sm:p-7 text-white shadow-md border border-stone-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-stone-700/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-display text-base font-bold text-white">
                  Admin Personal Details (নাম, ঠিকানা ও ফোন নম্বর)
                </h3>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold rounded-full border border-emerald-500/30">
                  Master Admin
                </span>
              </div>
              <p className="text-stone-300 text-xs mt-0.5">
                Authorized Admin Email: <strong className="text-white font-mono">{currentUser?.email || 'mdjibonc813@gmail.com'}</strong>
              </p>
            </div>
          </div>

          {profileSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs rounded-lg animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Admin details saved to Firebase!</span>
            </div>
          )}
        </div>

        <form onSubmit={handleProfileSave} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Admin Name */}
            <div>
              <label className="block text-stone-300 font-semibold mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-stone-400" />
                <span>Admin Name (নাম) *</span>
              </label>
              <input
                type="text"
                required
                value={profileForm.name}
                onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Md Jibon"
                className="w-full px-3.5 py-2.5 bg-stone-800/80 border border-stone-700 rounded-lg text-sm text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Admin Phone */}
            <div>
              <label className="block text-stone-300 font-semibold mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <span>Phone / WhatsApp (ফোন) *</span>
              </label>
              <input
                type="text"
                required
                value={profileForm.phone}
                onChange={(e) => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                placeholder="+880 1712-345678"
                className="w-full px-3.5 py-2.5 bg-stone-800/80 border border-stone-700 rounded-lg text-sm font-mono text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Admin Address */}
            <div>
              <label className="block text-stone-300 font-semibold mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>Address (ঠিকানা) *</span>
              </label>
              <input
                type="text"
                required
                value={profileForm.address}
                onChange={(e) => setProfileForm(p => ({ ...p, address: e.target.value }))}
                placeholder="House 42, Road 11, Banani, Dhaka"
                className="w-full px-3.5 py-2.5 bg-stone-800/80 border border-stone-700 rounded-lg text-sm text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <p className="text-[11px] text-stone-400">
              Changes directly sync to your user profile and store hotline in Firebase Firestore.
            </p>
            <button
              type="submit"
              disabled={profileLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-[0.98]"
            >
              <Save className="w-4 h-4" />
              <span>{profileLoading ? 'Saving...' : 'Update Admin Details'}</span>
            </button>
          </div>
        </form>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Store settings have been updated and synced with the live website!</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Section 1: Business Identity */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2 pb-2 border-b border-stone-100">
            <Store className="w-4 h-4 text-stone-500" />
            <span>Store Identity</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Store Name *
              </label>
              <input
                type="text"
                required
                value={form.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Logo Wordmark / Monogram
              </label>
              <input
                type="text"
                value={form.logoText}
                onChange={(e) => handleChange('logoText', e.target.value)}
                placeholder="AURA"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm font-serif-display font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">
                Tagline / Business Description
              </label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: WhatsApp Number Configuration */}
        <div className="space-y-4 pt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2 pb-2 border-b border-stone-100">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp Order Gateway</span>
          </h3>

          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
            <span className="text-xs font-bold text-emerald-900 block">
              Direct Order Forwarding
            </span>
            <p className="text-xs text-emerald-800 leading-relaxed">
              When a customer taps "Order on WhatsApp", their message is pre-filled with the product name, price, and quantity, and immediately directed to this WhatsApp number.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                WhatsApp Phone Number (International wa.me format) *
              </label>
              <input
                type="text"
                required
                placeholder="8801712345678"
                value={form.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
              />
              <span className="text-[11px] text-stone-400 mt-1 block">
                Country code + number with NO spaces or '+' sign (e.g., 8801712345678)
              </span>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                WhatsApp Display Format (Shown to customers)
              </label>
              <input
                type="text"
                placeholder="+880 1712-345678"
                value={form.whatsappNumberDisplay}
                onChange={(e) => handleChange('whatsappNumberDisplay', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
              />
              <span className="text-[11px] text-stone-400 mt-1 block">
                Visual format displayed in header and footer
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Physical Address & Contact */}
        <div className="space-y-4 pt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2 pb-2 border-b border-stone-100">
            <MapPin className="w-4 h-4 text-stone-500" />
            <span>Store Address &amp; Operating Hours</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">
                Store Physical Address *
              </label>
              <input
                type="text"
                required
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => handleChange('contactEmail', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Business Hours
              </label>
              <input
                type="text"
                value={form.businessHours}
                onChange={(e) => handleChange('businessHours', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Currency & Delivery Notes */}
        <div className="space-y-4 pt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2 pb-2 border-b border-stone-100">
            <Coins className="w-4 h-4 text-stone-500" />
            <span>Currency &amp; Delivery Terms</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Currency Symbol *
              </label>
              <input
                type="text"
                value={form.currencySymbol}
                onChange={(e) => handleChange('currencySymbol', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
              />
              <span className="text-[11px] text-stone-400 mt-1 block">Default: ৳ (Bangladeshi Taka)</span>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Currency Code
              </label>
              <input
                type="text"
                value={form.currencyCode}
                onChange={(e) => handleChange('currencyCode', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
              />
              <span className="text-[11px] text-stone-400 mt-1 block">Default: BDT</span>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">
                Courier / Delivery Policy Notes
              </label>
              <textarea
                rows={2}
                value={form.deliveryNotes}
                onChange={(e) => handleChange('deliveryNotes', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setResetConfirm(true)}
            className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default Demo Data</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-[0.99]"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>

      </form>

      {/* Reset Confirmation Dialog */}
      {resetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 max-w-sm w-full shadow-xl space-y-4">
            <h3 className="text-base font-bold text-stone-900 text-center">Reset Demo Catalog?</h3>
            <p className="text-xs text-stone-500 text-center">
              This will restore the original products, categories, images, and store settings.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResetConfirm(false)}
                className="flex-1 px-4 py-2 bg-stone-100 text-stone-700 text-xs font-semibold rounded-lg hover:bg-stone-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

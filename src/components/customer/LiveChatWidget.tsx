import React, { useState } from 'react';
import { MessageCircle, X, Send, CheckCircle2, ShieldCheck, Database, Sparkles, Phone, User } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const LiveChatWidget: React.FC = () => {
  const { settings, saveCustomerInquiry, isFirestoreConnected } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);

    // Save chat message directly into Firebase Firestore!
    await saveCustomerInquiry({
      name: name.trim() || 'Website Visitor',
      phone: phone.trim() || '',
      topic: 'Live Website Chat',
      message: message.trim(),
      source: 'chat_widget',
      status: 'new',
    });

    setLoading(false);
    setSubmitted(true);

    // Open WhatsApp with pre-filled message
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const waText = encodeURIComponent(
      `Hello ${settings.storeName}! 👋\n\n` +
      `*Message from Web Store Live Chat:*\n` +
      `• *Name:* ${name.trim() || 'Customer'}\n` +
      (phone.trim() ? `• *Phone:* ${phone.trim()}\n` : '') +
      `\n*Inquiry:* ${message.trim()}`
    );

    setTimeout(() => {
      window.open(`https://wa.me/${cleanNumber}?text=${waText}`, '_blank', 'noopener,noreferrer');
    }, 400);

    // Reset form after short delay
    setTimeout(() => {
      setMessage('');
      setSubmitted(false);
      setIsOpen(false);
    }, 3500);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-xl transition-all duration-200 active:scale-95"
          aria-label="Open WhatsApp Chat & Inquiry"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full border-2 border-emerald-600" />
          </div>
          <span className="text-xs font-bold tracking-wide">
            Chat &amp; Inquiry
          </span>
          <span className="text-[10px] bg-emerald-700 px-1.5 py-0.5 rounded text-emerald-100 flex items-center gap-1 font-mono">
            <Database className="w-2.5 h-2.5" />
            <span>Live DB</span>
          </span>
        </button>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="w-[330px] sm:w-[360px] bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
          
          {/* Header */}
          <div className="bg-stone-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider">{settings.storeName} Concierge</h3>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Online • Connected to Firestore</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-stone-50/70 max-h-[360px] overflow-y-auto space-y-3 text-xs">
            {/* Auto welcome greeting */}
            <div className="bg-white p-3 rounded-xl border border-stone-200 text-stone-700 leading-relaxed shadow-2xs">
              <span className="font-semibold text-stone-900 block mb-1">
                Welcome to our online store! 👋
              </span>
              Ask any question about our products, sizing, or delivery. Every inquiry is instantly recorded in our database and forwarded to our WhatsApp hotline for immediate reply.
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center space-y-2 text-emerald-900">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-xs">Message Saved &amp; Sent!</h4>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Your chat inquiry has been saved to Firebase Firestore and WhatsApp is opening now. Our team will assist you shortly!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Tanvir Rahman"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                    <User className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="e.g. 01700-000000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                    <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Message / Question *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Type your question or request here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-[0.98]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? 'Saving...' : 'Send Message & WhatsApp Chat'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Footer note */}
          <div className="px-4 py-2 bg-stone-100 border-t border-stone-200 text-[10px] text-stone-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Database className="w-3 h-3 text-emerald-600" />
              <span>Firebase Firestore Synced</span>
            </span>
            <span className="font-mono text-stone-400">shopnobairati</span>
          </div>

        </div>
      )}
    </div>
  );
};

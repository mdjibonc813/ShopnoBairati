import React, { useState } from 'react';
import { 
  MessageCircle, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  Sparkles,
  Navigation
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ContactPage: React.FC = () => {
  const { settings, saveCustomerInquiry } = useStore();

  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formSubject, setFormSubject] = useState('Product Inquiry');
  const [formMessage, setFormMessage] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState(false);

  const handleSendWhatsAppInquiry = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Save data input into Firebase Firestore database
    await saveCustomerInquiry({
      name: formName.trim() || 'Website Visitor',
      phone: formPhone.trim() || '',
      topic: formSubject,
      message: formMessage.trim(),
      source: 'contact_form',
      status: 'new',
    });

    setSubmittedFeedback(true);
    setTimeout(() => setSubmittedFeedback(false), 4000);

    // 2. Launch WhatsApp with pre-filled inquiry text
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const text = `Hello ${settings.storeName}! 👋\n\n` +
      `*Inquiry from Store Website*\n` +
      `• *Name:* ${formName || 'Customer'}\n` +
      `• *Phone:* ${formPhone || 'Not provided'}\n` +
      `• *Topic:* ${formSubject}\n\n` +
      `*Message:* ${formMessage || 'Hello, I would like more information about your products.'}`;

    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-stone-50/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Store Concierge &amp; Showroom
          </span>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
            Get in Touch Directly
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-2">
            Have questions about product availability, sizing, custom orders, or delivery? Reach out directly via WhatsApp for instant assistance.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">WhatsApp Helpline</h3>
              <p className="text-base font-bold text-stone-900 mt-1">{settings.whatsappNumberDisplay}</p>
              <p className="text-xs text-stone-500 mt-1">Fastest response for orders &amp; queries</p>
            </div>
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Chat now</span>
              <span>→</span>
            </a>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Store Address</h3>
              <p className="text-sm font-semibold text-stone-900 mt-1">{settings.address}</p>
              <p className="text-xs text-stone-500 mt-1">Dhaka, Bangladesh</p>
            </div>
            <a
              href="https://maps.google.com/?q=Banani+Dhaka+Bangladesh"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-xs font-semibold text-stone-900 hover:underline flex items-center gap-1"
            >
              <span>Open in Maps</span>
              <span>→</span>
            </a>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center mb-4">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Email Inquiry</h3>
              <p className="text-sm font-semibold text-stone-900 mt-1 truncate">{settings.contactEmail}</p>
              <p className="text-xs text-stone-500 mt-1">For corporate or bulk orders</p>
            </div>
            <a
              href={`mailto:${settings.contactEmail}`}
              className="mt-4 text-xs font-semibold text-stone-900 hover:underline flex items-center gap-1"
            >
              <span>Send Email</span>
              <span>→</span>
            </a>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Business Hours</h3>
              <p className="text-xs sm:text-sm font-semibold text-stone-900 mt-1">{settings.businessHours}</p>
              <p className="text-xs text-stone-500 mt-1">WhatsApp orders accepted 24/7</p>
            </div>
            <div className="mt-4 text-xs text-emerald-700 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Direct Support Active</span>
            </div>
          </div>

        </div>

        {/* Interactive Form & Google Map Embed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* WhatsApp Direct Form */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-stone-900">
                Send Direct Message via WhatsApp
              </h2>
            </div>
            <p className="text-xs text-stone-500 mb-6">
              Fill in your message and click submit. It will immediately generate a clean formatted chat with our store team.
            </p>

            {submittedFeedback && (
              <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Your message has been securely recorded in our Firebase Firestore database!</span>
              </div>
            )}

            <form onSubmit={handleSendWhatsAppInquiry} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanvir Ahmed"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    placeholder="e.g. 01700-000000"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Inquiry Topic</label>
                <select
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
                >
                  <option value="Product Sizing & Stock">Product Sizing &amp; Stock Availability</option>
                  <option value="Delivery Timeframe Question">Delivery Timeframe &amp; Courier Coverage</option>
                  <option value="Corporate / Bulk Order">Corporate / Bulk Gift Orders</option>
                  <option value="Order Tracking">Existing Order Status</option>
                  <option value="General Question">General Assistance</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Your Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us what you're looking for, or share the product name you are interested in..."
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-[0.99]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Launch WhatsApp with This Message</span>
              </button>
            </form>
          </div>

          {/* Google Maps Section */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="w-5 h-5 text-stone-900" />
                <h2 className="text-lg font-bold text-stone-900">
                  Store Location &amp; Directions
                </h2>
              </div>
              <p className="text-xs text-stone-500 mb-4">
                Visit our showroom in Banani, Dhaka. Prior appointment via WhatsApp is recommended for personalized viewings.
              </p>
            </div>

            {/* Styled Map Container */}
            <div className="relative rounded-xl overflow-hidden border border-stone-200 aspect-[16/10] bg-stone-100 flex-1 min-h-[250px]">
              <iframe
                title="Store Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14602.700319717148!2d90.3957262!3d23.7945821!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c70c15ea1de1%3A0x97856381e57fb311!2sBanani%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="pt-4 flex items-center justify-between text-xs text-stone-600">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Road 11, Banani, Dhaka</span>
              </span>
              <a
                href="https://maps.google.com/?q=Banani+Road+11+Dhaka"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-stone-900 hover:underline"
              >
                Get Directions →
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

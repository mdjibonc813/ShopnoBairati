import React from 'react';
import { MessageCircle, ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { HERO_IMAGE } from '../../data/initialData';

export const Hero: React.FC = () => {
  const { setActivePage, settings } = useStore();

  const handleWhatsAppInquiry = () => {
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Hello ${settings.storeName}! I am browsing your catalog and would like assistance choosing a product.`);
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="relative bg-stone-100 overflow-hidden border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Text Content Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-stone-600 bg-stone-200/80 px-3 py-1.5 rounded-md">
              <Sparkles className="w-3.5 h-3.5 text-stone-700" />
              <span>Direct WhatsApp E-Commerce Catalog</span>
            </div>

            <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 leading-[1.15] text-balance">
              Refined Essentials for Modern Living.
            </h1>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-xl">
              Discover curated luxury timepieces, handcrafted full-grain leather, designer eyewear, and premium studio acoustics. Order in seconds through direct WhatsApp chat with Cash on Delivery.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => setActivePage('shop')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-sm font-semibold transition-all shadow-sm active:scale-[0.98]"
              >
                <span>Browse All Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleWhatsAppInquiry}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-all shadow-sm active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Store Hotline</span>
              </button>
            </div>

            {/* Trust Markers Bar */}
            <div className="pt-6 border-t border-stone-200/80 grid grid-cols-3 gap-4 text-stone-600">
              <div className="space-y-1">
                <span className="block text-xs font-bold text-stone-900">৳ BDT Pricing</span>
                <span className="block text-[11px] text-stone-500">Transparent &amp; No Hidden Fees</span>
              </div>
              <div className="space-y-1">
                <span className="block text-xs font-bold text-stone-900">Cash on Delivery</span>
                <span className="block text-[11px] text-stone-500">All 64 Districts in Bangladesh</span>
              </div>
              <div className="space-y-1">
                <span className="block text-xs font-bold text-stone-900">Zero Signup Needed</span>
                <span className="block text-[11px] text-stone-500">Order directly in 1-Click</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-stone-200/60 aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] bg-stone-200">
              <img
                src={HERO_IMAGE}
                alt="Aura Lifestyle Showroom"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent pointer-events-none" />
              
              {/* Floating Hero Card Overlay */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/40 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      Featured Collection
                    </span>
                    <span className="text-xs text-stone-500">Banani, Dhaka</span>
                  </div>
                  <h4 className="text-sm font-semibold text-stone-900">Handcrafted Leather &amp; Horology</h4>
                </div>
                <button
                  onClick={() => setActivePage('shop')}
                  className="px-3.5 py-2 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors shrink-0"
                >
                  View Catalog
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

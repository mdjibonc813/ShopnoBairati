import React from 'react';
import { 
  ArrowRight, 
  MessageCircle, 
  Sparkles, 
  Percent, 
  ShieldCheck, 
  Clock, 
  Truck, 
  Award 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Hero } from './Hero';
import { CategoryBar } from './CategoryBar';
import { ProductGrid } from './ProductGrid';

export const HomePage: React.FC = () => {
  const { setActivePage, settings, products } = useStore();

  const handleWhatsAppSupport = () => {
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Hello ${settings.storeName}! I need assistance with product recommendations.`);
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-0">
      
      {/* 1. Hero Campaign Banner */}
      <Hero />

      {/* 2. Popular Categories Section */}
      <CategoryBar />

      {/* 3. Featured Products Section */}
      <ProductGrid
        title="Featured Curations"
        subtitle="Handpicked timepieces, artisanal leather, and acoustics curated for lasting elegance."
        limit={4}
        featuredOnly={true}
        showFilters={false}
      />

      {/* Promotional Story / WhatsApp Order Spotlight */}
      <section className="py-14 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <span className="text-emerald-400 font-semibold text-xs uppercase tracking-wider block">
                How It Works • Direct &amp; Hassle-Free
              </span>
              <h2 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-balance">
                Shop Without Registrations or Pre-payments.
              </h2>
              <p className="text-stone-400 text-xs sm:text-sm leading-relaxed max-w-2xl">
                We believe premium shopping should be as personal as visiting a luxury boutique. Simply choose your item, click order, and complete your delivery details directly over WhatsApp with our dedicated concierge team in Dhaka.
              </p>

              {/* 3-Step Flow */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700/60">
                  <div className="text-emerald-400 font-bold text-sm mb-1">01. Browse</div>
                  <p className="text-stone-300 text-xs">Explore products, genuine photos, and clear BDT pricing.</p>
                </div>

                <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700/60">
                  <div className="text-emerald-400 font-bold text-sm mb-1">02. Click WhatsApp</div>
                  <p className="text-stone-300 text-xs">Pre-filled order details automatically load in your chat.</p>
                </div>

                <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700/60">
                  <div className="text-emerald-400 font-bold text-sm mb-1">03. Pay on Delivery</div>
                  <p className="text-stone-300 text-xs">Inspect item on arrival &amp; pay cash to the delivery rider.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-center items-start lg:items-end gap-3">
              <button
                onClick={handleWhatsAppSupport}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-lg transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat with Concierge</span>
              </button>
              <span className="text-[11px] text-stone-400">
                Hotline: {settings.whatsappNumberDisplay}
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Special Offers Section */}
      <ProductGrid
        title="Special Offers &amp; Value Sets"
        subtitle="Limited availability pieces with direct promotional pricing in BDT."
        limit={4}
        specialOffersOnly={true}
        showFilters={false}
      />

      {/* 5. Latest Arrivals Section */}
      <ProductGrid
        title="Latest Catalog Arrivals"
        subtitle="Fresh additions to our Dhaka boutique catalog."
        limit={8}
        showFilters={false}
      />

      {/* View All Products CTA Strip */}
      <div className="py-8 bg-stone-100 border-t border-stone-200 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <span className="text-xs sm:text-sm font-semibold text-stone-700">
            Looking for something specific among our {products.length} products?
          </span>
          <button
            onClick={() => setActivePage('shop')}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
          >
            <span>Open Complete Catalog Page</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

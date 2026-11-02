import React, { useState } from 'react';
import { 
  MessageCircle, 
  ShoppingBag, 
  Check, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  ChevronRight, 
  Copy, 
  Share2, 
  Sparkles,
  Info
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';

export const ProductDetailsPage: React.FC = () => {
  const { 
    selectedProduct, 
    setActivePage, 
    products, 
    orderProductOnWhatsApp, 
    addToCart, 
    formatPrice, 
    settings,
    navigateToShopWithCategory
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [showWhatsAppPreview, setShowWhatsAppPreview] = useState(false);

  if (!selectedProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-stone-900 mb-4">Product Not Found</h2>
        <button
          onClick={() => setActivePage('shop')}
          className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const gallery = selectedProduct.gallery && selectedProduct.gallery.length > 0 
    ? selectedProduct.gallery 
    : [selectedProduct.image];

  const currentImage = gallery[activeImageIndex] || selectedProduct.image;

  const totalCalculated = selectedProduct.price * quantity;

  const discountPercent = selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price
    ? Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)
    : null;

  const savingsAmount = selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price
    ? (selectedProduct.originalPrice - selectedProduct.price) * quantity
    : null;

  // Related products in the same category
  const relatedProducts = products
    .filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleOrderWhatsApp = () => {
    orderProductOnWhatsApp(selectedProduct, quantity);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const previewMessage = `Hello ${settings.storeName}! 👋\n\nI want to order this product from your catalog:\n\n` +
    `📦 *Product:* ${selectedProduct.name}\n` +
    `🏷️ *SKU:* ${selectedProduct.sku || 'N/A'}\n` +
    `💵 *Unit Price:* ${formatPrice(selectedProduct.price)}\n` +
    `🔢 *Quantity:* ${quantity}\n` +
    `💰 *Total Amount:* ${formatPrice(totalCalculated)}\n\n` +
    `Please provide more details about ordering and delivery to my address. Thank you!`;

  return (
    <div className="bg-stone-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6 flex-wrap">
          <button 
            onClick={() => setActivePage('home')} 
            className="hover:text-stone-900 transition-colors"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <button 
            onClick={() => setActivePage('shop')} 
            className="hover:text-stone-900 transition-colors"
          >
            Catalog
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <button 
            onClick={() => navigateToShopWithCategory(selectedProduct.category)} 
            className="hover:text-stone-900 transition-colors"
          >
            {selectedProduct.category}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-900 font-medium truncate max-w-[200px] sm:max-w-xs">
            {selectedProduct.name}
          </span>
        </nav>

        {/* Back to Catalog button */}
        <div className="mb-6">
          <button
            onClick={() => setActivePage('shop')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Products</span>
          </button>
        </div>

        {/* Main PDP Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-2xl border border-stone-200 p-4 sm:p-8 shadow-xs">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Image Stage */}
            <div className="relative aspect-[4/3] bg-stone-100 rounded-xl overflow-hidden border border-stone-200">
              <img
                src={currentImage}
                alt={selectedProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              {discountPercent && (
                <div className="absolute top-4 left-4 bg-stone-900 text-white text-xs font-bold px-2.5 py-1 rounded shadow-sm">
                  Save {discountPercent}%
                </div>
              )}
            </div>

            {/* Thumbnail Row */}
            {gallery.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIndex === idx
                        ? 'border-stone-900 ring-2 ring-stone-900/10'
                        : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${selectedProduct.name} preview ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Specifications & Craftsmanship Tabs */}
            <div className="pt-6 border-t border-stone-100 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Product Specifications
              </h4>
              {selectedProduct.specifications && Object.keys(selectedProduct.specifications).length > 0 ? (
                <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100 text-xs">
                  {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-3 p-3 bg-stone-50/50 hover:bg-stone-50 transition-colors">
                      <span className="font-semibold text-stone-600 col-span-1">{key}</span>
                      <span className="text-stone-900 col-span-2">{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-500">
                  Standard manufacturer verified specifications apply.
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                <span className="uppercase tracking-wider font-semibold text-stone-600">
                  {selectedProduct.category}
                </span>
                {selectedProduct.sku && (
                  <span className="font-mono text-[11px] text-stone-400">
                    SKU: {selectedProduct.sku}
                  </span>
                )}
              </div>

              <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
                {selectedProduct.name}
              </h1>

              {/* Stock Status Badge */}
              <div className="mt-2.5 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                  selectedProduct.inStock ? 'text-emerald-700' : 'text-amber-700'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    selectedProduct.inStock ? 'bg-emerald-600' : 'bg-amber-500'
                  }`} />
                  {selectedProduct.inStock ? 'In Stock — Ready for Immediate Dispatch' : 'Out of Stock / Pre-Order'}
                </span>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-stone-900 tabular-nums">
                  {formatPrice(selectedProduct.price)}
                </span>
                {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                  <span className="text-base text-stone-400 line-through tabular-nums">
                    {formatPrice(selectedProduct.originalPrice)}
                  </span>
                )}
              </div>
              {savingsAmount && savingsAmount > 0 && (
                <p className="text-xs text-emerald-700 font-medium">
                  You save {formatPrice(savingsAmount)} ({discountPercent}% discount)
                </p>
              )}
              <p className="text-[11px] text-stone-500 pt-1">
                Prices in Bangladeshi Taka (৳). Cash on Delivery available at your doorstep.
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Description
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {selectedProduct.fullDescription || selectedProduct.shortDescription}
              </p>
            </div>

            {/* Quantity Selector & Line Total */}
            <div className="pt-2 border-t border-stone-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Select Quantity
                </span>
                <span className="text-xs text-stone-500 tabular-nums">
                  Line Total: <strong className="text-stone-900 font-bold">{formatPrice(totalCalculated)}</strong>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-3.5 py-2 text-stone-700 hover:bg-stone-100 disabled:opacity-40 transition-colors font-bold text-sm"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-semibold text-stone-900 tabular-nums min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-2 text-stone-700 hover:bg-stone-100 transition-colors font-bold text-sm"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <div className="text-xs text-stone-500">
                  {quantity > 1 ? `${quantity} units selected` : 'Single unit'}
                </div>
              </div>
            </div>

            {/* PRIMARY ORDER ACTION: ORDER VIA WHATSAPP BUTTON */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleOrderWhatsApp}
                className="w-full flex items-center justify-center gap-2.5 px-6 py-4 text-sm sm:text-base font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] rounded-xl shadow-md transition-all duration-150"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                <span>Order via WhatsApp ({formatPrice(totalCalculated)})</span>
              </button>

              <button
                onClick={handleAddToCart}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold rounded-xl border transition-all ${
                  addedAnimation
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-800'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-stone-700" />
                    <span>Add to Temporary Cart</span>
                  </>
                )}
              </button>

              {/* Message Preview Toggle */}
              <div className="pt-1">
                <button
                  onClick={() => setShowWhatsAppPreview(!showWhatsAppPreview)}
                  className="text-[11px] text-stone-500 hover:text-stone-800 underline flex items-center gap-1 mx-auto"
                >
                  <Info className="w-3 h-3" />
                  <span>{showWhatsAppPreview ? 'Hide WhatsApp message preview' : 'View pre-filled WhatsApp message format'}</span>
                </button>

                {showWhatsAppPreview && (
                  <div className="mt-2.5 p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-lg text-xs font-mono text-stone-800 whitespace-pre-wrap leading-relaxed">
                    {previewMessage}
                  </div>
                )}
              </div>
            </div>

            {/* Assurance Box */}
            <div className="pt-4 border-t border-stone-100 space-y-2.5 text-xs text-stone-600">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Dhaka Delivery:</strong> ৳60 (24h) • <strong>Outside Dhaka:</strong> ৳120</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cash on Delivery (COD) with open-box verification</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Share2 className="w-4 h-4 text-stone-500 shrink-0 cursor-pointer" onClick={handleShare} />
                <button onClick={handleShare} className="text-stone-600 hover:underline">
                  {copiedLink ? 'Product link copied to clipboard!' : 'Share this product with friends'}
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-stone-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Recommended for you
                </span>
                <h3 className="font-serif-display text-2xl font-bold text-stone-900 mt-0.5">
                  Related Products
                </h3>
              </div>
              <button
                onClick={() => navigateToShopWithCategory(selectedProduct.category)}
                className="text-xs font-semibold text-stone-700 hover:text-stone-900 underline underline-offset-4"
              >
                View all in {selectedProduct.category}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

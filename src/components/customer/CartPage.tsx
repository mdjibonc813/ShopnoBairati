import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  MessageCircle, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  Check, 
  Eye, 
  Info 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CartPage: React.FC = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    cartTotalAmount, 
    formatPrice, 
    orderCartOnWhatsApp, 
    getCartWhatsAppMessage, 
    setActivePage,
    settings 
  } = useStore();

  const [showFormattedMessage, setShowFormattedMessage] = useState(true);

  const cartMessage = getCartWhatsAppMessage();

  if (cart.length === 0) {
    return (
      <div className="bg-stone-50/50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl border border-stone-200 p-12 shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8 opacity-60" />
            </div>
            <h2 className="font-serif-display text-2xl font-bold text-stone-900">
              Your Shopping Cart is Empty
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm max-w-md mx-auto">
              You haven't selected any items yet. Browse our curated collection, add items to your cart, and submit them directly via WhatsApp.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActivePage('shop')}
                className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
              >
                Browse All Products
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setActivePage('shop')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>

          <button
            onClick={clearCart}
            className="text-xs text-stone-400 hover:text-red-600 transition-colors"
          >
            Clear Entire Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <h1 className="font-serif-display text-xl sm:text-2xl font-bold text-stone-900">
                  Shopping Cart
                </h1>
                <span className="text-xs text-stone-500">
                  {cart.length} unique {cart.length === 1 ? 'product' : 'products'}
                </span>
              </div>

              <div className="divide-y divide-stone-100">
                {cart.map((item) => {
                  const subtotal = item.product.price * item.quantity;

                  return (
                    <div key={item.product.id} className="py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-center"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">
                          {item.product.category}
                        </span>
                        <h3 className="text-sm sm:text-base font-semibold text-stone-900 truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5 tabular-nums">
                          Unit Price: <span className="font-medium text-stone-700">{formatPrice(item.product.price)}</span>
                        </p>
                      </div>

                      {/* Quantity Stepper & Subtotal */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0">
                        <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="p-1.5 text-stone-600 hover:bg-stone-100 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 py-1 text-xs font-bold text-stone-900 tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="p-1.5 text-stone-600 hover:bg-stone-100 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-sm sm:text-base font-bold text-stone-900 tabular-nums">
                            {formatPrice(subtotal)}
                          </div>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                          title="Remove from cart"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live WhatsApp Pre-filled Order Message Preview */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    WA
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                    Pre-filled WhatsApp Message Preview
                  </h3>
                </div>
                <button
                  onClick={() => setShowFormattedMessage(!showFormattedMessage)}
                  className="text-xs text-stone-500 hover:text-stone-900 underline"
                >
                  {showFormattedMessage ? 'Collapse' : 'Expand'}
                </button>
              </div>

              {showFormattedMessage && (
                <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl font-mono text-xs text-stone-800 whitespace-pre-wrap leading-relaxed">
                  {cartMessage}
                </div>
              )}
              <p className="text-[11px] text-stone-400">
                This exact text will automatically populate in your WhatsApp when you click "Order All via WhatsApp".
              </p>
            </div>
          </div>

          {/* Right Column: Order Summary & WhatsApp CTA */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6 sticky top-28">
              
              <h2 className="text-base font-bold text-stone-900 pb-3 border-b border-stone-100">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="font-semibold text-stone-900 tabular-nums">
                    {formatPrice(cartTotalAmount)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="text-stone-700">৳60 (Dhaka) / ৳120 (Nationwide)</span>
                </div>

                <div className="flex justify-between">
                  <span>Payment Method</span>
                  <span className="font-medium text-emerald-700">Cash on Delivery (COD)</span>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-baseline justify-between text-base font-bold text-stone-900">
                  <span>Estimated Total</span>
                  <span className="text-2xl text-emerald-800 tabular-nums">
                    {formatPrice(cartTotalAmount)}
                  </span>
                </div>
              </div>

              {/* PRIMARY ACTION: ORDER ALL ON WHATSAPP */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => orderCartOnWhatsApp()}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-xl text-base font-bold shadow-md transition-all"
                >
                  <MessageCircle className="w-5 h-5 shrink-0" />
                  <span>Order All via WhatsApp</span>
                </button>

                <p className="text-[11px] text-stone-500 text-center leading-relaxed">
                  Clicking will open WhatsApp with all product names, quantities, and totals pre-filled. Our team will promptly confirm your delivery address.
                </p>
              </div>

              {/* Trust badges */}
              <div className="pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No credit card or online payment required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Doorstep delivery across all 64 districts</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

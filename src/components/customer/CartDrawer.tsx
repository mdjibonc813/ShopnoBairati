import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, MessageCircle, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartDrawerOpen, 
    setIsCartDrawerOpen, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    cartTotalAmount, 
    cartTotalItemsCount,
    formatPrice, 
    orderCartOnWhatsApp,
    getCartWhatsAppMessage,
    setActivePage,
  } = useStore();

  const [showPreview, setShowPreview] = useState(false);

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-950/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-6 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-900" />
              <h2 className="text-base font-bold text-stone-900">
                Your Shopping Cart
              </h2>
              <span className="text-xs text-stone-500 font-medium tabular-nums">
                ({cartTotalItemsCount} {cartTotalItemsCount === 1 ? 'item' : 'items'})
              </span>
            </div>

            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body: Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-stone-100">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-stone-900">Your cart is empty</h3>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto">
                    Browse our catalog to select products and order them all together via WhatsApp.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setActivePage('shop');
                  }}
                  className="px-5 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const subtotal = item.product.price * item.quantity;

                return (
                  <div key={item.product.id} className="py-4 flex gap-4 items-center">
                    {/* Item Thumbnail */}
                    <div className="w-16 h-16 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-stone-900 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        {formatPrice(item.product.price)} each
                      </p>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-stone-200 rounded-md bg-stone-50 text-xs">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:bg-stone-200 text-stone-700 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 font-semibold text-stone-900 tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:bg-stone-200 text-stone-700 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-stone-900 tabular-nums ml-auto">
                          {formatPrice(subtotal)}
                        </span>
                      </div>
                    </div>

                    {/* Delete Item Button */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-stone-400 hover:text-red-600 p-1.5 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-stone-200 bg-stone-50 space-y-4">
              
              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span className="font-semibold text-stone-900 tabular-nums">
                    {formatPrice(cartTotalAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-stone-500">
                  <span>Delivery Charge</span>
                  <span>Calculated via WhatsApp (৳60 / ৳120)</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Order Total:</span>
                  <span className="text-base text-emerald-800 tabular-nums">
                    {formatPrice(cartTotalAmount)}
                  </span>
                </div>
              </div>

              {/* PRIMARY ORDER ACTION: ORDER ALL VIA WHATSAPP */}
              <button
                onClick={() => {
                  orderCartOnWhatsApp();
                  setIsCartDrawerOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-[0.99]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order All via WhatsApp ({formatPrice(cartTotalAmount)})</span>
              </button>

              {/* View Full Cart Page Link */}
              <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setActivePage('cart');
                  }}
                  className="hover:text-stone-900 underline underline-offset-4"
                >
                  View full cart page
                </button>

                <button
                  onClick={clearCart}
                  className="hover:text-red-600 transition-colors"
                >
                  Clear cart
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero online payment required • Cash on Delivery</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

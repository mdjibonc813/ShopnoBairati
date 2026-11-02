import React, { useState } from 'react';
import { MessageCircle, ShoppingBag, Eye, ArrowUpRight, Check, ImageOff } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { viewProductDetails, orderProductOnWhatsApp, addToCart, formatPrice } = useStore();
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleDirectWhatsAppOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    orderProductOnWhatsApp(product, 1);
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div 
      onClick={() => viewProductDetails(product.id)}
      className="group bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col transition-all duration-200 hover:shadow-md hover:border-stone-300 cursor-pointer"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        {imageError ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-stone-400 bg-stone-100">
            <ImageOff className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-xs text-center font-medium line-clamp-1">{product.name}</span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        )}

        {/* Quiet Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10 pointer-events-none">
          {discountPercent && (
            <span className="bg-stone-900/90 text-white text-[11px] font-semibold px-2 py-0.5 rounded shadow-sm">
              Save {discountPercent}%
            </span>
          )}
          {!product.inStock && (
            <span className="bg-amber-600/90 text-white text-[11px] font-medium px-2 py-0.5 rounded shadow-sm">
              Out of Stock
            </span>
          )}
        </div>

        {/* Quick View Floating Hint */}
        <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <span className="p-1.5 bg-white/90 backdrop-blur-sm rounded-md shadow-sm text-stone-700 hover:text-stone-900 inline-flex">
            <Eye className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category & Status */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
          <span className="uppercase tracking-wider text-[11px] font-medium text-stone-500 truncate max-w-[65%]">
            {product.category}
          </span>
          <span className={`text-[11px] font-medium ${product.inStock ? 'text-emerald-700' : 'text-stone-400'}`}>
            {product.inStock ? 'In Stock' : 'Pre-order'}
          </span>
        </div>

        {/* Product Title */}
        <h3 className="text-sm sm:text-base font-semibold text-stone-900 line-clamp-2 leading-snug group-hover:text-stone-700 transition-colors mb-2">
          {product.name}
        </h3>

        {/* Short summary description */}
        <p className="text-xs text-stone-500 line-clamp-2 mb-3 leading-relaxed">
          {product.shortDescription}
        </p>

        {/* Price Row with Tabular Numbers */}
        <div className="mt-auto pt-2 border-t border-stone-100 flex items-baseline gap-2 mb-3">
          <span className="text-base sm:text-lg font-bold text-stone-900 tabular-nums">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-stone-400 line-through tabular-nums">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {/* Order on WhatsApp Button - Primary Accent */}
          <button
            onClick={handleDirectWhatsAppOrder}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] rounded-lg transition-all shadow-sm"
            title="Order directly on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Order on WhatsApp</span>
          </button>

          {/* Quick Add to Cart & Details */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-1 px-2.5 py-2 text-xs font-medium border rounded-lg transition-colors ${
                addedAnimation
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
              }`}
              title="Add to temporary cart"
            >
              {addedAnimation ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="truncate">Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span className="truncate">+ Cart</span>
                </>
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                viewProductDetails(product.id);
              }}
              className="p-2 border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
              title="View full product specifications"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

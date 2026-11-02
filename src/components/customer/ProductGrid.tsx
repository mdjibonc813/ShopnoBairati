import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X, Sparkles, AlertCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  featuredOnly?: boolean;
  specialOffersOnly?: boolean;
  showFilters?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  title = 'Product Catalog',
  subtitle = 'Order any item instantly on WhatsApp with Cash on Delivery in Bangladesh',
  limit,
  featuredOnly = false,
  specialOffersOnly = false,
  showFilters = true,
}) => {
  const { 
    products, 
    categories, 
    selectedCategoryFilter, 
    setSelectedCategoryFilter,
    searchQuery,
    setSearchQuery,
    formatPrice,
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (featuredOnly) {
      result = result.filter(p => p.isFeatured);
    }

    if (specialOffersOnly) {
      result = result.filter(p => p.isSpecialOffer || (p.originalPrice && p.originalPrice > p.price));
    }

    if (selectedCategoryFilter && selectedCategoryFilter !== 'All') {
      result = result.filter(p => p.category === selectedCategoryFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q))
      );
    }

    if (inStockOnly) {
      result = result.filter(p => p.inStock);
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    if (limit) {
      result = result.slice(0, limit);
    }

    return result;
  }, [products, featuredOnly, specialOffersOnly, selectedCategoryFilter, searchQuery, inStockOnly, sortBy, limit]);

  return (
    <section className="py-12 bg-stone-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-stone-700" />
              <span>Direct WhatsApp Storefront</span>
            </div>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900">
              {title}
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1 max-w-2xl">
              {subtitle}
            </p>
          </div>

          {/* Quick results count */}
          <div className="text-xs text-stone-500 tabular-nums">
            Showing <span className="font-semibold text-stone-900">{filteredProducts.length}</span> of {products.length} products
          </div>
        </div>

        {/* Filter & Search Bar (Only shown on full catalog views or if enabled) */}
        {showFilters && (
          <div className="bg-white rounded-xl border border-stone-200 p-4 mb-8 shadow-xs space-y-4">
            {/* Top row: Search and Sort */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search products by title, category, or sku..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Controls on Right */}
              <div className="flex items-center gap-3 self-end sm:self-auto">
                {/* Stock Toggle */}
                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded border-stone-300 text-stone-900 focus:ring-stone-500"
                  />
                  <span>In Stock Only</span>
                </label>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-1.5 border border-stone-200 bg-stone-50 rounded-lg px-2.5 py-1.5 text-xs text-stone-700">
                  <ArrowUpDown className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent text-xs text-stone-900 font-medium focus:outline-none cursor-pointer"
                  >
                    <option value="featured">Featured First</option>
                    <option value="newest">Newest Arrivals</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bottom row: Category Filter Tabs */}
            <div className="pt-2 border-t border-stone-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-semibold text-stone-500 mr-1 shrink-0 flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3" />
                Category:
              </span>
              <button
                onClick={() => setSelectedCategoryFilter('All')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategoryFilter === 'All'
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                }`}
              >
                All Products ({products.length})
              </button>
              {categories.map((cat) => {
                const count = products.filter(p => p.category === cat.name).length;
                const isSelected = selectedCategoryFilter === cat.name;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryFilter(cat.name)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                    }`}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Product Grid: 4 or 3 columns on desktop, 2 columns on mobile as requested! */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-stone-900 mb-1">No products found</h3>
            <p className="text-xs text-stone-500 mb-6">
              No items match your active filter criteria. Try clearing search terms or selecting another category.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategoryFilter('All');
                setInStockOnly(false);
              }}
              className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

import React from 'react';
import { Watch, Briefcase, Glasses, Headphones, Home, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Watches & Horology': <Watch className="w-4 h-4" />,
  'Leather Goods': <Briefcase className="w-4 h-4" />,
  'Premium Eyewear': <Glasses className="w-4 h-4" />,
  'Audio & Tech': <Headphones className="w-4 h-4" />,
  'Home & Desk Essentials': <Home className="w-4 h-4" />,
  'Fragrance & Grooming': <Sparkles className="w-4 h-4" />,
};

export const CategoryBar: React.FC = () => {
  const { categories, products, navigateToShopWithCategory } = useStore();

  return (
    <section className="py-10 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Curated Collections
            </span>
            <h2 className="font-serif-display text-2xl font-bold text-stone-900 mt-1">
              Browse by Category
            </h2>
          </div>
          <button
            onClick={() => navigateToShopWithCategory('All')}
            className="text-xs font-semibold text-stone-700 hover:text-stone-900 underline underline-offset-4 self-start sm:self-auto"
          >
            View All Categories ({products.length} items)
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const count = products.filter(p => p.category === cat.name).length;
            const icon = CATEGORY_ICONS[cat.name] || <Sparkles className="w-4 h-4" />;

            return (
              <button
                key={cat.id}
                onClick={() => navigateToShopWithCategory(cat.name)}
                className="group p-4 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200/80 hover:border-stone-300 text-left transition-all duration-200 flex flex-col justify-between"
              >
                <div className="w-9 h-9 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-700 group-hover:text-stone-900 shadow-2xs mb-3 group-hover:scale-110 transition-transform">
                  {icon}
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-stone-900 group-hover:text-stone-700 leading-snug line-clamp-1">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-stone-500 tabular-nums block mt-0.5">
                    {count} {count === 1 ? 'item' : 'items'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

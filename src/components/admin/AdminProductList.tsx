import React, { useState, useMemo } from 'react';
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Check, 
  X, 
  AlertTriangle,
  ArrowUpDown,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

interface AdminProductListProps {
  onEditProduct: (product: Product) => void;
}

export const AdminProductList: React.FC<AdminProductListProps> = ({ onEditProduct }) => {
  const { 
    products, 
    categories, 
    deleteProduct, 
    toggleStockStatus, 
    setActivePage, 
    formatPrice,
    viewProductDetails 
  } = useStore();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      const matchesSearch = 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [products, categoryFilter, search]);

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-display text-2xl font-bold text-stone-900">
            Product Catalog Management
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
            Manage product images, pricing in BDT, inventory stock, and descriptions.
          </p>
        </div>

        <button
          onClick={() => setActivePage('admin-add-product')}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search products by title, sku, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:bg-white"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-stone-500 whitespace-nowrap">Filter Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none"
          >
            <option value="All">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Responsive Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4 font-semibold">Image</th>
                <th className="py-3.5 px-4 font-semibold">Product Name &amp; SKU</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Price (৳ BDT)</th>
                <th className="py-3.5 px-4 font-semibold text-center">Stock Availability</th>
                <th className="py-3.5 px-4 font-semibold text-center">Featured</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.length > 0 ? (
                filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-stone-50/80 transition-colors">
                    {/* Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                    </td>

                    {/* Product Name */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-stone-900 truncate">
                        {product.name}
                      </div>
                      <div className="text-[11px] text-stone-400 font-mono">
                        {product.sku || 'No SKU'}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-stone-600 truncate max-w-[130px]">
                      {product.category}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 tabular-nums">
                      <span className="font-bold text-stone-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-[10px] text-stone-400 line-through block">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </td>

                    {/* Stock Status Toggle Switch */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleStockStatus(product.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                          product.inStock
                            ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                        title="Click to toggle In Stock / Out of Stock"
                      >
                        <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-emerald-600' : 'bg-stone-400'}`} />
                        <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                      </button>
                    </td>

                    {/* Featured Status */}
                    <td className="py-3 px-4 text-center">
                      {product.isFeatured ? (
                        <span className="inline-flex items-center text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-bold">
                          Featured
                        </span>
                      ) : (
                        <span className="text-stone-300 text-[11px]">-</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => viewProductDetails(product.id)}
                          className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                          title="View on Customer Storefront"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onEditProduct(product)}
                          className="p-1.5 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setProductToDelete(product)}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No products match your search or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 max-w-sm w-full shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-stone-900">Confirm Product Deletion</h3>
              <p className="text-xs text-stone-500">
                Are you sure you want to delete <strong className="text-stone-800">"{productToDelete.name}"</strong>? This will remove it from the customer catalog.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

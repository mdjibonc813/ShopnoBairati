import React from 'react';
import { 
  Package, 
  CheckCircle2, 
  FolderTree, 
  MessageCircle, 
  PlusCircle, 
  Settings, 
  ArrowUpRight, 
  Database,
  ShoppingBag,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminOverview: React.FC = () => {
  const { products, categories, settings, setActivePage, formatPrice, viewProductDetails, orders, inquiries } = useStore();

  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.inStock).length;
  const outOfStockProducts = totalProducts - inStockProducts;
  const totalCategories = categories.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const newInquiries = inquiries.filter(i => i.status === 'new').length;

  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const testWhatsAppUrl = `https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Test message from ${settings.storeName} admin console.`)}`;

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-display text-2xl font-bold text-stone-900">
            Welcome to {settings.storeName}
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            WhatsApp-based catalog operations center. Orders are directed straight to your WhatsApp hotline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('admin-add-product')}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Product</span>
          </button>

          <a
            href={testWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
            title="Verify that WhatsApp opens with your configured phone number"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Test WhatsApp Link</span>
          </a>
        </div>
      </div>

      {/* KPI Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* WhatsApp Orders from Firestore */}
        <div 
          onClick={() => setActivePage('admin-orders')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-emerald-300 transition-all"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">WhatsApp Orders</span>
            <div className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1 tabular-nums">
              {orders.length}
            </div>
            <span className="text-[11px] text-emerald-600 mt-0.5 block font-medium">
              {pendingOrders} pending • Firestore Live
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Customer Inquiries & Chats from Firestore */}
        <div 
          onClick={() => setActivePage('admin-inquiries')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-emerald-300 transition-all"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Customer Chats</span>
            <div className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1 tabular-nums">
              {inquiries.length}
            </div>
            <span className="text-[11px] text-stone-500 mt-0.5 block">
              {newInquiries} new messages
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Total Products */}
        <div 
          onClick={() => setActivePage('admin-products')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-stone-300 transition-all"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Total Products</span>
            <div className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1 tabular-nums">
              {totalProducts}
            </div>
            <span className="text-[11px] text-stone-500 mt-0.5 block">{inStockProducts} in stock</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Collections Count */}
        <div 
          onClick={() => setActivePage('admin-categories')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between cursor-pointer hover:border-stone-300 transition-all"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Collections</span>
            <div className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1 tabular-nums">
              {totalCategories}
            </div>
            <span className="text-[11px] text-stone-500 mt-0.5 block">Organized categories</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
            <FolderTree className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Out of Stock Warning (if any) */}
      {outOfStockProducts > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>{outOfStockProducts} product{outOfStockProducts > 1 ? 's are' : ' is'} currently marked Out of Stock.</strong> Customers see these as pre-orders.
            </span>
          </div>
          <button
            onClick={() => setActivePage('admin-products')}
            className="font-bold underline text-amber-900 hover:text-black"
          >
            Review Inventory
          </button>
        </div>
      )}

      {/* Grid: Recent Products & Store Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Products List */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h3 className="font-serif-display text-lg font-bold text-stone-900">
                Recent Catalog Products
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Latest additions to your online store catalog
              </p>
            </div>
            <button
              onClick={() => setActivePage('admin-products')}
              className="text-xs font-semibold text-stone-700 hover:text-stone-900 underline underline-offset-4"
            >
              View All ({products.length})
            </button>
          </div>

          <div className="divide-y divide-stone-100 overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead>
                <tr className="text-stone-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 font-semibold">Product</th>
                  <th className="py-3 font-semibold">Category</th>
                  <th className="py-3 font-semibold">Price (৳)</th>
                  <th className="py-3 font-semibold">Status</th>
                  <th className="py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover bg-stone-100 border border-stone-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-semibold text-stone-900 block truncate max-w-[200px]">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {p.sku || 'No SKU'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-stone-600 truncate max-w-[120px]">{p.category}</td>
                    <td className="py-3 font-semibold text-stone-900 tabular-nums">
                      {formatPrice(p.price)}
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded ${
                        p.inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.inStock ? 'bg-emerald-600' : 'bg-stone-400'}`} />
                        {p.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => {
                          viewProductDetails(p.id);
                        }}
                        className="p-1.5 text-stone-500 hover:text-stone-900 rounded-md hover:bg-stone-100 transition-colors"
                        title="View on website"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Store Details Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h3 className="font-serif-display text-lg font-bold text-stone-900 pb-3 border-b border-stone-100">
              Active Store Information
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Store Name</span>
                <span className="text-stone-900 font-semibold">{settings.storeName}</span>
              </div>

              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Address</span>
                <span className="text-stone-800">{settings.address}</span>
              </div>

              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">WhatsApp Recipient</span>
                <span className="text-emerald-700 font-bold">{settings.whatsappNumberDisplay}</span>
              </div>

              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Courier &amp; Delivery</span>
                <span className="text-stone-600 leading-relaxed block">{settings.deliveryNotes}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100">
              <button
                onClick={() => setActivePage('admin-settings')}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Edit Store Settings</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomePage } from './components/customer/HomePage';
import { ProductGrid } from './components/customer/ProductGrid';
import { ProductDetailsPage } from './components/customer/ProductDetailsPage';
import { CartPage } from './components/customer/CartPage';
import { CartDrawer } from './components/customer/CartDrawer';
import { ContactPage } from './components/customer/ContactPage';
import { LiveChatWidget } from './components/customer/LiveChatWidget';
import { AuthModal } from './components/common/AuthModal';

import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminOverview } from './components/admin/AdminOverview';
import { AdminProductList } from './components/admin/AdminProductList';
import { AdminProductForm } from './components/admin/AdminProductForm';
import { AdminCategoryManager } from './components/admin/AdminCategoryManager';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminInquiriesAndOrders } from './components/admin/AdminInquiriesAndOrders';
import { Product } from './types';

const MainAppContent: React.FC = () => {
  const { activePage, setActivePage, adminUser, currentUser } = useStore();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setActivePage('admin-edit-product');
  };

  // Admin Views Guard
  const isAdminView = activePage.startsWith('admin-');

  if (isAdminView) {
    // If logged in as regular customer (non-admin), block access completely
    if (currentUser && currentUser.role !== 'admin') {
      return (
        <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-8 max-w-md w-full shadow-lg text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mx-auto font-bold text-xl">
              ✕
            </div>
            <h2 className="font-serif-display text-xl font-bold text-stone-900">
              অ্যাক্সেস সংরক্ষিত (Access Restricted)
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              শুধুমাত্র অনুমোদিত অ্যাডমিন (<strong>mdjibonc813@gmail.com</strong>) এই অ্যাডমিন প্যানেলে প্রবেশ করতে পারেন। সাধারণ গ্রাহকরা এই প্যানেলে প্রবেশ করতে পারবেন না।
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActivePage('home')}
                className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                গ্রাহক স্টোরফ্রন্টে ফিরে যান (Return to Store)
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activePage === 'admin-login') {
      return <AdminLogin />;
    }

    // If not authenticated, require login
    if (!adminUser) {
      return <AdminLogin />;
    }

    return (
      <AdminLayout>
        {activePage === 'admin-dashboard' && <AdminOverview />}
        {activePage === 'admin-products' && (
          <AdminProductList onEditProduct={handleEditProduct} />
        )}
        {activePage === 'admin-add-product' && (
          <AdminProductForm
            editProduct={null}
            onDone={() => setActivePage('admin-products')}
          />
        )}
        {activePage === 'admin-edit-product' && (
          <AdminProductForm
            editProduct={editingProduct}
            onDone={() => {
              setEditingProduct(null);
              setActivePage('admin-products');
            }}
          />
        )}
        {activePage === 'admin-categories' && <AdminCategoryManager />}
        {activePage === 'admin-settings' && <AdminSettings />}
        {(activePage === 'admin-orders' || activePage === 'admin-inquiries') && <AdminInquiriesAndOrders />}
      </AdminLayout>
    );
  }

  // Customer Storefront Views
  return (
    <div className="min-h-screen flex flex-col bg-stone-50/40 text-stone-900 selection:bg-emerald-100 selection:text-emerald-900">
      <Header />

      <main className="flex-1">
        {activePage === 'home' && <HomePage />}
        {activePage === 'shop' && (
          <ProductGrid
            title="All Products Catalog"
            subtitle="Browse our entire collection. Order any item instantly on WhatsApp with Cash on Delivery."
            showFilters={true}
          />
        )}
        {activePage === 'product-details' && <ProductDetailsPage />}
        {activePage === 'cart' && <CartPage />}
        {activePage === 'contact' && <ContactPage />}
      </main>

      <Footer />
      <CartDrawer />
      <LiveChatWidget />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  FolderTree, 
  Settings, 
  Globe, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  MessageCircle, 
  ShoppingBag,
  ArrowUpRight 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ActivePage } from '../../types';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { activePage, setActivePage, logoutAdmin, adminUser, settings, products, orders, inquiries } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  const newInquiriesCount = inquiries.filter(i => i.status === 'new').length;

  const navItems: { label: string; page: ActivePage; icon: React.ReactNode; badge?: number }[] = [
    { label: 'Dashboard', page: 'admin-dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'WhatsApp Orders', page: 'admin-orders', icon: <ShoppingBag className="w-4 h-4" />, badge: pendingOrdersCount > 0 ? pendingOrdersCount : orders.length },
    { label: 'Chats & Inquiries', page: 'admin-inquiries', icon: <MessageCircle className="w-4 h-4" />, badge: newInquiriesCount > 0 ? newInquiriesCount : inquiries.length },
    { label: 'Products', page: 'admin-products', icon: <Package className="w-4 h-4" />, badge: products.length },
    { label: 'Add New Product', page: 'admin-add-product', icon: <PlusCircle className="w-4 h-4" /> },
    { label: 'Categories', page: 'admin-categories', icon: <FolderTree className="w-4 h-4" /> },
    { label: 'Store Settings', page: 'admin-settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleNav = (page: ActivePage) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row text-stone-900 font-sans">
      
      {/* Mobile Top bar */}
      <div className="md:hidden bg-stone-900 text-white p-4 flex items-center justify-between border-b border-stone-800 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="font-serif-display font-bold text-lg">{settings.storeName}</span>
          <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded font-mono">ADMIN</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 text-stone-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-stone-900 text-stone-300 flex flex-col border-r border-stone-800 transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold font-serif-display text-base">
              A
            </div>
            <div>
              <div className="font-serif-display text-lg font-bold text-white tracking-wide">
                {settings.storeName}
              </div>
              <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Admin Dashboard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-3 py-2">
            Management
          </div>

          {navItems.map((item) => {
            const isActive = activePage === item.page;

            return (
              <button
                key={item.page}
                onClick={() => handleNav(item.page)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-stone-800 text-white font-semibold'
                    : 'text-stone-300 hover:bg-stone-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-emerald-400' : 'text-stone-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="bg-stone-800 text-stone-300 text-[10px] px-2 py-0.5 rounded-full tabular-nums">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-6 text-[10px] font-bold uppercase tracking-wider text-stone-400 px-3 py-2">
            Storefront
          </div>

          {/* View Website Button */}
          <button
            onClick={() => setActivePage('home')}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-stone-300 hover:bg-stone-800/60 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>View Customer Website</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-stone-400" />
          </button>
        </nav>

        {/* User Footer & Logout */}
        <div className="p-4 border-t border-stone-800 space-y-3 bg-stone-950/40">
          <div className="flex items-center justify-between px-2">
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">
                {adminUser?.name || 'Administrator'}
              </p>
              <p className="text-[11px] text-stone-400 truncate">
                {adminUser?.email || 'mdjibonc813@gmail.com'}
              </p>
            </div>
            <button
              onClick={logoutAdmin}
              className="p-1.5 text-stone-400 hover:text-red-400 transition-colors"
              title="Logout from admin session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Stage */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Strip */}
        <header className="bg-white border-b border-stone-200 px-6 py-4 hidden md:flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold text-stone-800 capitalize">
              {activePage.replace('admin-', '').replace('-', ' ')}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-stone-500 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Orders Active: </span>
              <strong className="text-stone-900">{settings.whatsappNumberDisplay}</strong>
            </div>

            <button
              onClick={() => setActivePage('home')}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-700 flex items-center gap-1.5 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Open Website</span>
            </button>
          </div>
        </header>

        {/* Child Screen */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>

    </div>
  );
};
